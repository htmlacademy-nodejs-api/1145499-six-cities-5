import { UserType } from './user-type.enum.js';

export type User = {
  name: string;
  email: string;
  avatar: string;
  _password: string;
  type: UserType;
};
