import { Expose, Type } from 'class-transformer';
import { UserRdo } from '../../user/rdo/user.rdo.js';

export class HousingOfferRdo {
  @Expose()
  public id: string;

  @Expose()
  public title: string;

  @Expose()
  public description: string;

  @Expose()
  public city: string;

  @Expose()
  public rating: number;

  @Expose()
  public previewPhoto: string;

  @Expose()
  public photos: string[];

  @Expose()
  public isPremium: boolean;

  @Expose()
  public isFavorite: boolean;

  @Expose()
  public type: string;

  @Expose()
  public rooms: number;

  @Expose()
  public guests: number;

  @Expose()
  public cost: number;

  @Expose()
  public features: string[];

  @Expose()
  public commentCount: number;

  @Expose()
  public geo: string;

  @Expose({ name: 'userId' })
  @Type(() => UserRdo)
  public user: UserRdo;
}
