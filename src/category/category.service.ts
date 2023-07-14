import { Inject, Injectable } from "@nestjs/common";
import { and, eq } from "drizzle-orm";
import { PG_CONNECTION } from "src/constants";
import { DrizzleClient } from "src/drizzle/drizzle.interface";
import {
  Category,
  Product,
  categories,
  products,
  restaurants,
  usersToManager,
} from "src/drizzle/schema";
import { ProductService } from "src/product/product.service";

@Injectable()
export class CategoryService {
  constructor(
    @Inject(PG_CONNECTION) private db: DrizzleClient,
    private readonly productService: ProductService,
  ) {}

  async create(userId: string, restaurantId: string, categoryName: string) {
    const restaurantResp = await this.db
      .select()
      .from(restaurants)
      .innerJoin(
        usersToManager,
        and(
          eq(usersToManager.userId, userId),
          eq(usersToManager.restaurantId, restaurants.id),
        ),
      )
      .where(eq(restaurants.id, restaurantId));

    if (restaurantResp.length !== 1) {
      throw new Error("Restaurant not found");
    }

    const categoryResp = await this.db
      .insert(categories)
      .values({
        restaurantId: restaurantId,
        name: categoryName,
        index: 0,
      })
      .onConflictDoNothing()
      .returning();

    return categoryResp[0];
  }

  async delete(userId: string, restaurantId: string, categoryId: string) {
    const categoryResp = await this.db
      .select()
      .from(categories)
      .innerJoin(
        usersToManager,
        and(
          eq(usersToManager.userId, userId),
          eq(usersToManager.restaurantId, restaurantId),
        ),
      )
      .where(eq(categories.id, categoryId));

    if (categoryResp.length !== 1) {
      throw new Error("Category not found");
    }

    const category = categoryResp[0].categories;

    const deleteResp = await this.db
      .delete(categories)
      .where(eq(categories.id, categoryId))
      .returning();

    if (deleteResp.length === 0) {
      throw new Error("Couldn't delete category");
    }

    return category;
  }

  async update(
    userId: string,
    restaurantId: string,
    categoryId: string,
    categoryData: Partial<Omit<Category, "restaurantId" | "id">>,
  ) {
    const categoryResp = await this.db
      .select()
      .from(categories)
      .innerJoin(
        usersToManager,
        and(
          eq(usersToManager.userId, userId),
          eq(usersToManager.restaurantId, restaurantId),
        ),
      )
      .where(eq(categories.id, categoryId));

    if (categoryResp.length !== 1) {
      throw new Error("Category not found");
    }

    const updateResp = await this.db
      .update(categories)
      .set(categoryData)
      .where(eq(categories.id, categoryId))
      .returning();

    if (updateResp.length === 0) {
      throw new Error("Couldn't update category");
    }

    return updateResp[0];
  }

  async categoriesOfRestaurant(restaurantId: string) {
    const categoryResp = await this.db
      .select()
      .from(categories)
      .where(eq(categories.restaurantId, restaurantId))
      .orderBy(categories.index);

    return categoryResp;
  }

  async details(categoryId: string) {
    const categoryResp = await this.db
      .select()
      .from(categories)
      .leftJoin(products, eq(products.categoryId, categoryId))
      .where(eq(categories.id, categoryId));

    if (categoryResp.length === 0) {
      throw new Error("Category not found");
    }

    const productsArr: Product[] = [];

    const category = categoryResp[0].categories;

    for (const product of categoryResp) {
      if (product.products) {
        productsArr.push(product.products);
      }
    }

    return {
      ...category,
      products: productsArr,
    };
  }
}
