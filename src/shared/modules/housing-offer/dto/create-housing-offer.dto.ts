import { Geo } from '../../../types/geo.type.js';
import { HousingFeature } from '../../../types/housing-feature.enum.js';
import { HousingOffer } from '../../../types/housing-offer.type.js';
import { HousingType } from '../../../types/housing-type.enum.js';

export class CreateHousingOfferDto implements Omit<HousingOffer, 'user'> {
  public title: string;
  public description: string;
  public city: string;
  public previewPhoto: string;
  public photos: string[];
  public isPremium: boolean;
  public type: HousingType;
  public rooms: number;
  public guests: number;
  public cost: number;
  public features: HousingFeature[];
  public userId: string;
  public geo: Geo;
}
