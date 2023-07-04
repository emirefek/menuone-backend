import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { NestExpressApplication } from "@nestjs/platform-express";
import { Transport, MicroserviceOptions } from "@nestjs/microservices";
import { MicroModule } from "./micro/micro.module";

async function bootstrap() {
  const mainBackend = await NestFactory.create<NestExpressApplication>(
    AppModule,
  );
  await mainBackend.listen(3000);

  // const microService =
  //   await NestFactory.createMicroservice<MicroserviceOptions>(MicroModule, {
  //     transport: Transport.TCP,
  //   });
  // await microService.listen();
}
bootstrap();
