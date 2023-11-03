import { defaultClasses, getModelForClass, prop, modelOptions, Ref } from '@typegoose/typegoose';
import { UserEntity } from '../user/user.entity.js';
import { HousingOfferEntity } from '../housing-offer/housing-offer.entity.js';

// eslint-disable-next-line @typescript-eslint/no-unsafe-declaration-merging
export interface FavoriteEntity extends defaultClasses.Base {}

@modelOptions({
  schemaOptions: {
    collection: 'favorites',
    timestamps: true,
  },
})
// eslint-disable-next-line @typescript-eslint/no-unsafe-declaration-merging
export class FavoriteEntity extends defaultClasses.TimeStamps {
  @prop({
    ref: UserEntity,
    required: true,
  })
  public userId: Ref<UserEntity>;

  @prop({
    ref: HousingOfferEntity,
    required: true,
    default: [],
  })
  public favorites: Ref<HousingOfferEntity>[];
}

export const FavoriteModel = getModelForClass(FavoriteEntity);
