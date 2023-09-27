import { User } from './user.type.js';

export type Comment = {
  text: string;
  dateAt: Date;
  rating: number;
  author: User
}
