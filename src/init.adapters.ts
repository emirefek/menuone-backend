import { INestApplication } from "@nestjs/common";

import { RedisocketPropagatorService } from "src/redisocket-propagator/redisocket-propagator.service";
import { SocketAdapter } from "src/socket/socket.adapter";
import { SocketService } from "src/socket/socket.service";

export const initAdapters = (app: INestApplication): INestApplication => {
  const socketStateService = app.get(SocketService);
  const redisPropagatorService = app.get(RedisocketPropagatorService);

  app.useWebSocketAdapter(
    new SocketAdapter(app, socketStateService, redisPropagatorService),
  );

  return app;
};
