import { Inject, Injectable } from "@nestjs/common";
import { and, eq, sql } from "drizzle-orm";
import { PG_CONNECTION } from "src/constants";
import { DrizzleClient } from "src/drizzle/drizzle.interface";
import { Table, tables, usersToManager } from "src/drizzle/schema";
import { RestaurantService } from "src/restaurant/restaurant.service";

@Injectable()
export class TableService {
  constructor(@Inject(PG_CONNECTION) private db: DrizzleClient) {}

  async create(userId: string, table: Omit<Table, "id">) {
    const restaurantResp = await this.db
      .select()
      .from(usersToManager)
      .where(
        and(
          eq(usersToManager.userId, userId),
          eq(usersToManager.restaurantId, table.restaurantId),
        ),
      );

    if (restaurantResp.length === 0) {
      throw new Error("Restaurant not found");
    }

    const newTable = await this.db
      .insert(tables)
      .values({
        name: table.name,
        restaurantId: table.restaurantId,
      })
      .onConflictDoNothing()
      .returning();

    return newTable[0];
  }

  async tablesOfRestaurant(restaurantId: string) {
    const tablesResp = await this.db
      .select()
      .from(tables)
      .where(eq(tables.restaurantId, restaurantId))
      .orderBy(sql`${tables.name} desc`);
    const cleanArr = tablesResp.map((table) => ({
      id: table.id,
      name: table.name,
    }));

    return cleanArr;
  }
}
