import { Inject, Injectable } from "@nestjs/common";
import { Observable } from "rxjs";
import { Redis as RedisClient } from "ioredis";

import { RedisSocketEventRecievedDTO } from "src/redisocket-propagator/dtos/socket-event-recieved.dto";

import {
  REDIS_CONNECTION,
  REDIS_PUBLISHER_CLIENT,
  REDIS_SUBSCRIBER_CLIENT,
} from "src/constants";
import SubscriberObservable from "./classes/subscriber.observable";

export interface RedisSubscribeMessage {
  readonly message: string;
  readonly channel: string;
}

@Injectable()
export class RedisService {
  public constructor(
    @Inject(REDIS_CONNECTION)
    private readonly redisClient: RedisClient,
    @Inject(REDIS_SUBSCRIBER_CLIENT)
    private readonly redisSubscriberClient: RedisClient,
    @Inject(REDIS_PUBLISHER_CLIENT)
    private readonly redisPublisherClient: RedisClient,
  ) {}

  public fromEvent<T extends RedisSocketEventRecievedDTO>(
    eventName: string,
  ): Observable<T> {
    this.redisSubscriberClient.subscribe(eventName);

    return new SubscriberObservable(this.redisSubscriberClient).create(
      eventName,
    );
  }

  public async publish(channel: string, value: unknown): Promise<number> {
    return new Promise<number>((resolve, reject) => {
      return this.redisPublisherClient.publish(
        channel,
        JSON.stringify(value),
        (error, reply) => {
          if (error || !reply) {
            return reject(error);
          }

          return resolve(reply);
        },
      );
    });
  }

  public async get(key: string): Promise<unknown> {
    const value = await this.redisClient.get(key);

    return value;
  }

  public async set(
    key: string,
    value: string | number | Buffer,
  ): Promise<string> {
    const result = await this.redisClient.set(key, value);
    return result;
  }
}
