import { IsEmail, IsString } from 'class-validator';
import { CreateLoginUserMessage } from './login-user.messages.js';

export class LoginUserDto {
  @IsEmail({}, { message: CreateLoginUserMessage.email.invalidFormat })
  public email: string;

  @IsString({ message: CreateLoginUserMessage._password.invalidFormat })
  public _password: string;
}
