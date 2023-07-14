import { Inject, Injectable } from "@nestjs/common";
import { eq, isNull } from "drizzle-orm";
import { PG_CONNECTION } from "src/constants";
import { DrizzleClient } from "src/drizzle/drizzle.interface";
import { tabs } from "src/drizzle/schema";
import { RedisService } from "src/redis/redis.service";
import { Tab } from "src/drizzle/schema";
import { ProductService } from "src/product/product.service";
import { uuid } from "src/utils/uuid";
import { TabOrderAddDTO } from "./dto/order-add.dto";
import { OrderDTO, OrderStatusEnum } from "./dto/order.dto";

@Injectable()
export class TabsService {
  constructor(
    private readonly redisService: RedisService,
    @Inject(PG_CONNECTION) private readonly db: DrizzleClient,
    private readonly productService: ProductService,
  ) {}

  async create(tableId: string) {
    const tabsOfTable = await this.db
      .select()
      .from(tabs)
      .where(eq(tabs.tableId, tableId))
      .where(isNull(tabs.closedAt));

    if (tabsOfTable.length > 0) {
      throw new Error("Table already has an open tab");
    }

    const createdTab = await this.db
      .insert(tabs)
      .values({
        tableId: tableId,
        startedAt: new Date(),
      })
      .returning()
      .onConflictDoNothing();

    if (createdTab.length === 0) {
      throw new Error("Could not create tab");
    }

    const key = `tab:${createdTab[0].id}`;
    const value = JSON.stringify(createdTab[0]);
    await this.redisService.set(key, value);

    return createdTab[0];
  }

  async get(tabId: string) {
    const key = `tab:${tabId}`;
    const tab = await this.redisService.get(key);

    if (!tab) {
      const dbTab = await this.db
        .select()
        .from(tabs)
        .where(eq(tabs.id, tabId))
        .where(isNull(tabs.closedAt));

      if (dbTab.length === 0) {
        throw new Error("Tab not found");
      }

      const value = dbTab[0];

      if (!value.closedAt) {
        await this.redisService.set(key, JSON.stringify(value));
      }

      return dbTab[0];
    }

    if (typeof tab === "string") {
      return JSON.parse(tab);
    } else {
      throw new Error("Cannot parse tab from Redis");
    }
  }

  async orderAdd(tabId: string, orderParams: TabOrderAddDTO) {
    const tab = (await JSON.parse(await this.get(tabId))) as Tab;

    if (!tab) {
      throw new Error("Tab not found on Redis");
    }

    const newOrdersArr: OrderDTO[] = [];

    await Promise.all(
      orderParams.orders.map(async (order) => {
        const productDetails = await this.productService.get(order.productId);

        const newChunk: OrderDTO[] = Array.from(
          { length: order.quantity },
          () => ({
            id: uuid(),
            productId: order.productId,
            name: productDetails.name,
            description: productDetails.description,
            price: productDetails.price,
            status: OrderStatusEnum.OPEN,
            clientToken: orderParams.clientToken,
          }),
        );

        newOrdersArr.push(...newChunk);
      }),
    );

    const updatedTabOnRedis = await this.redisService.set(
      `tab:${tabId}`,
      JSON.stringify({
        ...tab,
        orders: [...(tab.orders ? tab.orders : []), ...newOrdersArr],
      }),
    );

    // const updatedTabOnPg = await this.db
    //   .update(tabs)
    //   .set({
    //     orders: [...(tab.orders ? tab.orders : []), ...newOrdersArr],
    //   })
    //   .where(eq(tabs.id, tabId))
    //   .returning();

    return {
      ...tab,
      orders: [...(tab.orders ? tab.orders : []), ...newOrdersArr],
    };
  }
}
