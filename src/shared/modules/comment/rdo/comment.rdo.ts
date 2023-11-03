import { Expose, Type, Transform } from 'class-transformer';
import { UserRdo } from '../../user/rdo/user.rdo.js';

export class CommentRdo {
  @Expose()
  @Transform((value) => value.obj._id.toString())
  public id: string;

  @Expose()
  public text: string;

  @Expose()
  public rating: number;

  @Expose()
  public createdAt: string;

  @Expose({ name: 'userId' })
  @Type(() => UserRdo)
  public user: UserRdo;
}
