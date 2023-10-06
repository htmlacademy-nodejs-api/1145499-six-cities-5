import { User } from '../../../types/user.type.js';
import { UserType } from '../../../types/user-type.enum.js';

export class CreateUserDto implements User {
  public name: string;
  public email: string;
  public avatar: string;
  public _password: string;
  public type: UserType;
}
