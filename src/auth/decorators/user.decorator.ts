import { createParamDecorator, ExecutionContext } from "@nestjs/common";
import { IJwtPayload } from "../interfaces/jwt.interface";

export const User = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return request.user as IJwtPayload;
  },
);
