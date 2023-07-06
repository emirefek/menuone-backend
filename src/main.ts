import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { NestExpressApplication } from "@nestjs/platform-express";
import { ConfigService } from "@nestjs/config";
import * as Sentry from "@sentry/node";

process.title = "menudrop-backend";

async function bootstrap() {
  const mainBackend = await NestFactory.create<NestExpressApplication>(
    AppModule,
  );
  const configService = mainBackend.get(ConfigService);

  Sentry.init({
    dsn: configService.get("SENTRY_DSN"),
    environment: configService.get("SENTRY_ENVIRONMENT"),
  });

  const port = configService.get("PORT") || 3000;
  console.log(`Listening on port ${port}`);
  await mainBackend.listen(port);
}
bootstrap();
