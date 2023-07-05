import { Body, Controller, Get, Param, Post } from "@nestjs/common";
import { TabsService } from "./tabs.service";
import { CreateKeyDto } from "./dto/create.dto";

@Controller("tabs")
export class TabsController {
  constructor(private tabsService: TabsService) {}

  @Post("create")
  async create(@Body() body: CreateKeyDto) {
    return this.tabsService.create(body.key, body.value);
  }

  @Get("get/:key")
  async get(@Param("key") key: string) {
    return this.tabsService.get(key);
  }
}
