import { User } from '../../../types/user.type.js';
import { UserType } from '../../../types/user-type.enum.js';
import { IsEmail, IsEnum, IsString, Length } from 'class-validator';
import { CreateUserMessages } from './create-user.messages.js';

export class CreateUserDto implements User {
  @IsString({ message: CreateUserMessages.name.invalidFormat })
  @Length(1, 15, { message: CreateUserMessages.name.lengthField })
  public name: string;

  @IsEmail({}, { message: CreateUserMessages.email.invalidFormat })
  public email: string;

  @IsString({ message: CreateUserMessages.avatar.invalidFormat })
  public avatar: string;

  @IsString({ message: CreateUserMessages._password.invalidFormat })
  @Length(6, 12, { message: CreateUserMessages._password.lengthField })
  public _password: string;

  @IsEnum(UserType, { message: CreateUserMessages.type.invalid })
  public type: UserType;
}
