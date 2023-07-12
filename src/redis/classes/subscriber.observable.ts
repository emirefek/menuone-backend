import { Redis as RedisClient } from "ioredis";
import { Observable, Observer } from "rxjs";
import { filter, map } from "rxjs/operators";

export default class SubscriberObservable {
  private redisSubscriberClient: RedisClient; // Your Redis client type here

  constructor(redisSubscriberClient: RedisClient) {
    // Your Redis client type here
    this.redisSubscriberClient = redisSubscriberClient;
  }

  create(eventName: string): Observable<any> {
    return new Observable(
      (observer: Observer<{ channel: string; message: string }>) => {
        this.redisSubscriberClient.on(
          "message",
          (channel: string, message: string) => {
            observer.next({ channel, message });
          },
        );
      },
    ).pipe(
      filter(({ channel }) => channel === eventName),
      map(({ message }) => JSON.parse(message)),
    );
  }
}
