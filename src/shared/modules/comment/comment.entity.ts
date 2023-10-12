import { defaultClasses, getModelForClass, prop, modelOptions, Ref } from '@typegoose/typegoose';
import { UserEntity } from '../user/user.entity.js';
import { HousingOfferEntity } from '../housing-offer/housing-offer.entity.js';

// eslint-disable-next-line @typescript-eslint/no-unsafe-declaration-merging
export interface CommentEntity extends defaultClasses.Base {}

@modelOptions({
  schemaOptions: {
    collection: 'comments',
    timestamps: true,
  },
})
// eslint-disable-next-line @typescript-eslint/no-unsafe-declaration-merging
export class CommentEntity extends defaultClasses.TimeStamps {
  @prop({ trim: true })
  public text: string;

  @prop({ min: 1, max: 5, default: 0 })
  public rating: number;

  @prop({
    ref: HousingOfferEntity,
    required: true,
  })
  public offerId: Ref<HousingOfferEntity>;

  @prop({
    ref: UserEntity,
    required: true,
  })
  public userId: Ref<UserEntity>;
}

export const CommentModel = getModelForClass(CommentEntity);
