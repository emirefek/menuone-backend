import { Injectable } from "@nestjs/common";

import { UniqueWebSocket } from "./socket.adapter";
import { RestaurantId } from "./socket.adapter";
import { JwtService } from "@nestjs/jwt";
import { IJwtPayload } from "src/auth/interfaces/jwt.interface";
import { RestaurantService } from "src/restaurant/restaurant.service";

@Injectable()
export class SocketService {
  constructor(
    private jwtService: JwtService,
    private restaurantService: RestaurantService,
  ) {}

  private socketState = new Map<RestaurantId, UniqueWebSocket[]>();

  public removeSocket(
    socket: UniqueWebSocket,
    restaurantId?: RestaurantId,
  ): boolean {
    const existingSocket = this.socketState.get(restaurantId || "unassigned");

    if (!existingSocket) {
      return true;
    }

    const sockets = existingSocket.filter((s) => s.id !== socket.id);

    if (!sockets.length) {
      this.socketState.delete(restaurantId || "unassigned");
    } else {
      this.socketState.set(restaurantId || "unassigned", sockets);
    }

    return true;
  }

  public addSocket(
    restaurantId: RestaurantId,
    socket: UniqueWebSocket,
  ): boolean {
    const existingSockets = this.socketState.get(restaurantId) || [];
    const sockets = [...existingSockets, socket];

    console.log("New Socket", socket.id);
    this.socketState.set(restaurantId, sockets);
    return true;
  }

  public getSocket(restaurantId: RestaurantId): UniqueWebSocket[] {
    return this.socketState.get(restaurantId) || [];
  }

  public getAllSockets(): UniqueWebSocket[] {
    const all: UniqueWebSocket[] = [];
    this.socketState.forEach((sockets) => all.concat(sockets));
    return all;
  }

  public async loginSocket(
    socket: UniqueWebSocket,
    access_token: string,
  ): Promise<boolean> {
    const payload = await this.jwtService.verifyAsync<IJwtPayload>(
      access_token,
      { secret: process.env.JWT_SECRET },
    );
    if (!payload) {
      return false;
    }
    socket.userId = payload.id;

    // if (socket.restaurantId) {
    //   socket.restaurantId = "unassigned";
    // }

    return true;
  }

  public async switchRestaurant(
    socket: UniqueWebSocket,
    restaurantId: RestaurantId,
  ): Promise<boolean> {
    if (!socket.userId) {
      return false;
    }

    const restaurantsOfUser = await this.restaurantService.getAll(
      socket.userId,
    );
    const restaurants = [
      ...restaurantsOfUser.manager,
      ...restaurantsOfUser.staff,
    ];
    const restaurantIds = restaurants.map((r) => r.id);
    restaurantIds.push("unassigned");
    console.log("restaurants", restaurants);
    if (!restaurantIds.includes(restaurantId)) {
      return false;
    }

    const socketsOfExistingRestaurant =
      this.socketState.get(restaurantId) || [];
    socketsOfExistingRestaurant.filter((s) => s.id !== socket.id);

    const socketsOfNewRestaurant = this.socketState.get(restaurantId) || [];
    this.socketState.set(restaurantId, [...socketsOfNewRestaurant, socket]);

    socket.restaurantId = restaurantId;

    return true;
  }
}
