import { Inject, Injectable } from "@nestjs/common";
import { and, eq } from "drizzle-orm";
import { PG_CONNECTION } from "src/constants";
import { DrizzleClient } from "src/drizzle/drizzle.interface";
import {
  categories,
  products,
  restaurants,
  usersToManager,
} from "src/drizzle/schema";
import { RedisService } from "src/redis/redis.service";

@Injectable()
export class ProductService {
  constructor(
    private readonly redisService: RedisService,
    @Inject(PG_CONNECTION) private readonly db: DrizzleClient,
  ) {}

  async get(productId: string) {
    const key = `product:${productId}`;
    const product = await this.redisService.get(key);

    if (!product) {
      const dbProduct = await this.db
        .select()
        .from(products)
        .where(eq(products.id, productId));

      if (dbProduct.length === 0) {
        throw new Error("Product not found");
      }

      await this.redisService.set(key, JSON.stringify(dbProduct[0]));
      return dbProduct[0];
    }

    if (typeof product === "string") {
      return JSON.parse(product);
    } else {
      throw new Error("Cannot parse product from redis");
    }
  }

  async create(
    userId: string,
    restaurantId: string,
    categoryId: string,
    productParams: {
      name: string;
      description: string | null;
      price: number;
    },
  ) {
    const categoryResp = await this.db
      .select()
      .from(categories)
      .innerJoin(
        usersToManager,
        and(
          eq(usersToManager.restaurantId, restaurantId),
          eq(usersToManager.userId, userId),
        ),
      )
      .where(eq(categories.id, categoryId));

    if (categoryResp.length !== 1) {
      throw new Error("Category not found");
    }

    const newProduct = await this.db
      .insert(products)
      .values({
        name: productParams.name,
        description: productParams.description,
        price: productParams.price,
        categoryId: categoryId,
        index: 0,
      })
      .onConflictDoNothing()
      .returning();

    return newProduct[0];
  }

  async remove(productId: string) {
    const key = `product:${productId}`;
    await this.redisService.del(key);

    const deletedProduct = await this.db
      .delete(products)
      .where(eq(products.id, productId));

    return deletedProduct;
  }

  async getByCategory(categoryId: string) {
    const productsResp = await this.db
      .select()
      .from(products)
      .where(eq(products.categoryId, categoryId));

    return productsResp;
  }
}
