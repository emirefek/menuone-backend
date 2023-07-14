import { Inject, Injectable } from "@nestjs/common";
import { and, eq } from "drizzle-orm";
import { CategoryService } from "src/category/category.service";
import { PG_CONNECTION } from "src/constants";
import { DrizzleClient } from "src/drizzle/drizzle.interface";
import {
  Restaurant,
  restaurants,
  usersToManager,
  usersToStaff,
} from "src/drizzle/schema";
import { TableService } from "src/table/table.service";
import { uuid } from "src/utils/uuid";

@Injectable()
export class RestaurantService {
  constructor(
    @Inject(PG_CONNECTION) private db: DrizzleClient,
    private categoryService: CategoryService,
    private tableService: TableService,
  ) {}

  async create(userId: string, restaurant: Omit<Restaurant, "id">) {
    const id = uuid();
    const restResp = await this.db
      .insert(restaurants)
      .values({
        id: id,
        name: restaurant.name,
        alias: restaurant.alias,
        region: restaurant.region,
      })
      .onConflictDoNothing()
      .returning();

    if (restResp.length === 0) {
      throw new Error("Couldn't create restaurant");
    }

    const userResp = await this.db
      .insert(usersToManager)
      .values({
        restaurantId: id,
        userId: userId,
      })
      .onConflictDoNothing()
      .returning();

    if (userResp.length === 0) {
      throw new Error("Couldn't link user to restaurant");
    }

    return restResp[0];
  }

  async getAll(userId: string) {
    const respManager = await this.db
      .select()
      .from(usersToManager)
      .where(eq(usersToManager.userId, userId))
      .innerJoin(restaurants, eq(usersToManager.restaurantId, restaurants.id));

    const restaurantsArr = respManager.map((r) => {
      return {
        ...r.restaurants,
      };
    });

    const respStaff = await this.db
      .select()
      .from(usersToStaff)
      .where(eq(usersToStaff.userId, userId))
      .innerJoin(restaurants, eq(usersToStaff.restaurantId, restaurants.id));

    const staffRestaurantsArr = respStaff.map((r) => {
      return {
        ...r.restaurants,
      };
    });

    return {
      manager: restaurantsArr,
      staff: staffRestaurantsArr,
    };
  }

  async getOne(userId: string, restaurantId: string) {
    const restResp = await this.db
      .select()
      .from(restaurants)
      .where(eq(restaurants.id, restaurantId))
      .leftJoin(
        usersToManager,
        and(
          eq(usersToManager.userId, userId),
          eq(usersToManager.restaurantId, restaurants.id),
        ),
      )
      .leftJoin(
        usersToStaff,
        and(
          eq(usersToManager.userId, userId),
          eq(usersToStaff.restaurantId, restaurants.id),
        ),
      );

    if (
      restResp.length !== 1 &&
      (restResp[0].users_to_manager === null ||
        restResp[0].users_to_staff === null)
    ) {
      throw new Error("Restaurant not found");
    }

    return restResp[0].restaurants;
  }

  async getOneWithCategories(userId: string, restaurantId: string) {
    const restResp = await this.db
      .select()
      .from(restaurants)
      .where(eq(restaurants.id, restaurantId))
      .leftJoin(
        usersToManager,
        and(
          eq(usersToManager.userId, userId),
          eq(usersToManager.restaurantId, restaurants.id),
        ),
      )
      .leftJoin(
        usersToStaff,
        and(
          eq(usersToStaff.userId, userId),
          eq(usersToStaff.restaurantId, restaurants.id),
        ),
      );

    if (
      restResp.length !== 1 &&
      (restResp[0].users_to_manager === null ||
        restResp[0].users_to_staff === null)
    ) {
      throw new Error("Restaurant not found");
    }

    const categoriesResp = await this.categoryService.categoriesOfRestaurant(
      restaurantId,
    );

    const categoriesArray = categoriesResp.map((c) => {
      return {
        id: c.id,
        name: c.name,
        index: c.index,
      };
    });

    const tablesResp = await this.tableService.tablesOfRestaurant(restaurantId);

    return {
      ...restResp[0].restaurants,
      categories: categoriesArray,
      tables: tablesResp,
    };
  }

  async update() {
    throw new Error("NOT IMPLEMENTED");
  }

  async isUserManager(userId: string, restaurantId: string): Promise<boolean> {
    const dbResp = await this.db
      .select()
      .from(usersToManager)
      .where(
        and(
          eq(usersToManager.userId, userId),
          eq(usersToManager.restaurantId, restaurantId),
        ),
      );

    if (dbResp.length > 0) {
      return true;
    }

    return false;
  }
}
