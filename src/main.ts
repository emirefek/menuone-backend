import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { NestExpressApplication } from "@nestjs/platform-express";
import { ConfigService } from "@nestjs/config";

async function bootstrap() {
  const mainBackend = await NestFactory.create<NestExpressApplication>(
    AppModule,
  );
  const configService = mainBackend.get(ConfigService);
  const port = configService.get("PORT");
  await mainBackend.listen(port || 3000);
}
bootstrap();
