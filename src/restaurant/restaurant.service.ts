import { Inject, Injectable } from "@nestjs/common";
import { eq } from "drizzle-orm";
import { PG_CONNECTION } from "src/constants";
import { DrizzleClient } from "src/drizzle/drizzle.interface";
import {
  Restaurant,
  restaurants,
  usersToManager,
  usersToStaff,
} from "src/drizzle/schema";
import { uuid } from "src/utils/uuid";

@Injectable()
export class RestaurantService {
  constructor(@Inject(PG_CONNECTION) private db: DrizzleClient) {}

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
    // return "This will return all restaurants of user";
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
    return "This will return spesific one restaurant";
  }

  async update() {
    return "This will update restaurant";
  }
}
