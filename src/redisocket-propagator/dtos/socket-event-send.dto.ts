import { RedisSocketEventRecievedDTO } from "./socket-event-recieved.dto";

export class RedisSocketEventSendDTO extends RedisSocketEventRecievedDTO {
  public readonly event: string;
}
