import { Injectable } from "@nestjs/common";
import { User } from "../users/interfaces/user.interface";
import { uuid } from "src/utils/uuid";
import { UsersService } from "src/users/users.service";
import { JwtService } from "@nestjs/jwt";
import { compare, hash } from "src/utils/bcrypt";

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async register(user: Omit<User, "id">) {
    const id = uuid();
    const data = {
      id: id,
      name: user.name,
      email: user.email,
      password: await hash(user.password),
    };
    const resp = await this.usersService.create(data);
    return {
      id: resp.id,
      name: resp.name,
      email: resp.email,
    };
  }

  async login(email: string, password: string) {
    const user = await this.usersService.findOne(email);
    if (!user) {
      return null;
    }
    if ((await compare(password, user.password)) === false) {
      return null;
    }
    const payload = {
      id: user.id,
      email: user.email,
    };

    const token = await this.jwtService.signAsync(payload);
    return {
      access_token: token,
    };
  }

  async details(id: string) {
    const user = await this.usersService.findOneById(id);
    if (!user) {
      return null;
    }
    return {
      id: user.id,
      name: user.name,
      email: user.email,
    };
  }
}
