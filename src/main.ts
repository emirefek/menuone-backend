import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { NestExpressApplication } from "@nestjs/platform-express";
import { ConfigService } from "@nestjs/config";

process.title = "menudrop-backend";

async function bootstrap() {
  const mainBackend = await NestFactory.create<NestExpressApplication>(
    AppModule,
  );
  const configService = mainBackend.get(ConfigService);
  const port = configService.get("PORT") || 3000;
  console.log(`Listening on port ${port}`);
  await mainBackend.listen(port);
}
bootstrap();
