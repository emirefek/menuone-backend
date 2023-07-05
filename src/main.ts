import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { NestExpressApplication } from "@nestjs/platform-express";

async function bootstrap() {
  const mainBackend = await NestFactory.create<NestExpressApplication>(
    AppModule,
  );
  await mainBackend.listen(3000);
}
bootstrap();
