import { Inject, Injectable } from "@nestjs/common";
import { User } from "./interfaces/user.interface";
import { PG_CONNECTION } from "src/constants";
import { DrizzleClient } from "src/drizzle/drizzle.interface";
import { users } from "src/drizzle/schema";
import { eq } from "drizzle-orm";

@Injectable()
export class UsersService {
  constructor(@Inject(PG_CONNECTION) private conn: DrizzleClient) {}

  async create(user: User): Promise<User> {
    const resp = await this.conn
      .insert(users)
      .values({
        email: user.email,
        password: user.password,
        name: user.name,
        id: user.id,
      })
      .onConflictDoNothing()
      .returning();

    return resp[0];
  }

  async findOne(email: string): Promise<User | undefined> {
    const resp = await this.conn
      .select()
      .from(users)
      .where(eq(users.email, email))
      .limit(1);
    return resp[0];
  }

  async findAll(): Promise<User[]> {
    const resp = await this.conn.select().from(users);
    return resp;
  }
}
