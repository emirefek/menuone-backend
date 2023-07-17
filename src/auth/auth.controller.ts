import {
  BadRequestException,
  Body,
  Controller,
  Get,
  HttpCode,
  NotFoundException,
  Post,
  UseGuards,
  UseInterceptors,
} from "@nestjs/common";
import { AuthService } from "./auth.service";
import { LoginDto } from "./dto/login.dto";
import { RegisterDto } from "./dto/signup.dto";
import { AuthGuard } from "./auth.guard";
import { User } from "./decorators/user.decorator";
import { IJwtPayload } from "./interfaces/jwt.interface";
import { SentryInterceptor } from "src/sentry/sentry.interceptor";

@UseInterceptors(SentryInterceptor)
@Controller("auth")
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post("login")
  @HttpCode(200)
  async login(@Body() loginDto: LoginDto) {
    const response = await this.authService.login(
      loginDto.email,
      loginDto.password,
    );
    if (!response) {
      throw new BadRequestException("ERR_AUTH_USER_NOT_FOUND");
    }
    return response;
  }

  @Post("register")
  async register(@Body() registerDto: RegisterDto) {
    const response = await this.authService.register(registerDto);
    return response;
  }

  @UseGuards(AuthGuard)
  @Get("details")
  async details(@User() user: IJwtPayload) {
    return this.authService.details;
  }
}
