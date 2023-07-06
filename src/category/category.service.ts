import { Inject, Injectable } from "@nestjs/common";
import { eq } from "drizzle-orm";
import { PG_CONNECTION } from "src/constants";
import { DrizzleClient } from "src/drizzle/drizzle.interface";
import {
  Category,
  categories,
  restaurants,
  usersToManager,
} from "src/drizzle/schema";

@Injectable()
export class CategoryService {
  constructor(@Inject(PG_CONNECTION) private db: DrizzleClient) {}

  async create(userId: string, restaurantId: string, categoryName: string) {
    const restaurantResp = await this.db
      .select()
      .from(restaurants)
      .where(eq(restaurants.id, restaurantId))
      .innerJoin(
        usersToManager,
        eq(usersToManager.restaurantId, restaurants.id),
      );

    if (restaurantResp.length === 0) {
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

  async delete(userId: string, categoryId: string) {
    const categoryResp = await this.db
      .select()
      .from(categories)
      .where(eq(categories.id, categoryId))
      .innerJoin(
        usersToManager,
        eq(usersToManager.restaurantId, categories.restaurantId),
      );

    if (categoryResp.length === 0) {
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
    categoryId: string,
    categoryData: Partial<Omit<Category, "restaurantId" | "id">>,
  ) {
    const categoryResp = await this.db
      .select()
      .from(categories)
      .where(eq(categories.id, categoryId))
      .innerJoin(
        usersToManager,
        eq(usersToManager.restaurantId, categories.restaurantId),
      );

    if (categoryResp.length === 0) {
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
}
