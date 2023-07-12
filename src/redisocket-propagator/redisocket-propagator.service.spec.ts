import { Test, TestingModule } from "@nestjs/testing";
import { RedisocketPropagatorService } from "./redisocket-propagator.service";

describe("RedisocketPropagatorService", () => {
  let service: RedisocketPropagatorService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RedisocketPropagatorService],
    }).compile();

    service = module.get<RedisocketPropagatorService>(
      RedisocketPropagatorService,
    );
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });
});
