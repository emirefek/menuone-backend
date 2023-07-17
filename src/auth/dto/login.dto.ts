import { IsEmail, IsNotEmpty, IsString } from "class-validator";

export class LoginDto {
  @IsEmail(
    {},
    {
      message: "ERR_FORM_EMAIL_INVALID",
    },
  )
  @IsNotEmpty({
    message: "ERR_FORM_EMAIL_REQUIRED",
  })
  email: string;

  @IsString({
    message: "ERR_FORM_PASSWORD_INVALID",
  })
  @IsNotEmpty({
    message: "ERR_FORM_PASSWORD_REQUIRED",
  })
  password: string;
}
