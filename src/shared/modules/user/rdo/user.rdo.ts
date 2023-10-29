import { Expose, Transform } from 'class-transformer';

export class UserRdo {
  @Expose()
  @Transform((value) => value.obj._id.toString())
  public id: string;

  @Expose()
  public name: string;

  @Expose()
  public email: string;

  @Expose()
  public avatar: string;

  @Expose()
  public type: string;
}
