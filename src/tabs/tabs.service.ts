import { Inject, Injectable } from "@nestjs/common";
import { eq, isNull } from "drizzle-orm";
import { PG_CONNECTION } from "src/constants";
import { DrizzleClient } from "src/drizzle/drizzle.interface";
import { products, tabs } from "src/drizzle/schema";
import { RedisService } from "src/redis/redis.service";
import { Tab } from "src/drizzle/schema";

@Injectable()
export class TabsService {
  constructor(
    private readonly redisService: RedisService,
    @Inject(PG_CONNECTION) private readonly db: DrizzleClient,
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
      await this.redisService.set(key, JSON.stringify(value));
      return dbTab[0];
    }

    if (typeof tab === "string") {
      return JSON.parse(tab);
    } else {
      throw new Error("Cannot parse tab from Redis");
    }
  }

  async orderAdd(tabId: string, productId: string) {
    const tab = (await JSON.parse(await this.get(tabId))) as Tab;

    if (!tab) {
      throw new Error("Tab not found");
    }

    const product = await this.db
      .select()
      .from(products)
      .where(eq(products.id, productId));

    if (product.length === 0) {
      throw new Error("Product not found");
    }

    const currentOrders = tab.orders || [];

    await this.redisService.set(
      `tab:${tabId}`,
      JSON.stringify({
        ...tab,
        orders: [
          ...currentOrders,
          {
            id: product[0].id,
            name: product[0].name,
            description: product[0].description,
            price: product[0].price,
          },
        ],
      }),
    );

    const updatedTab = await this.db
      .update(tabs)
      .set({
        orders: [
          ...currentOrders,
          {
            id: product[0].id,
            name: product[0].name,
            description: product[0].description,
            price: product[0].price,
          },
        ],
      })
      .returning();

    return updatedTab;
  }
}
