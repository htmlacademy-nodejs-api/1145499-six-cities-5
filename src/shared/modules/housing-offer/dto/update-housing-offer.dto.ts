import {
  ArrayNotEmpty,
  IsArray,
  IsBoolean,
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  Length,
  Min,
  Max,
} from 'class-validator';
import { Geo } from '../../../types/geo.type.js';
import { HousingFeature } from '../../../types/housing-feature.enum.js';
import { HousingOffer } from '../../../types/housing-offer.type.js';
import { HousingType } from '../../../types/housing-type.enum.js';
import { HousingOfferMessages } from './housing-offer.messages.js';

export class UpdateHousingOfferDto implements Partial<Omit<HousingOffer, 'user'>> {
  @IsOptional()
  @IsString({ message: HousingOfferMessages.title.invalidFormat })
  @Length(10, 100, { message: HousingOfferMessages.title.lengthField })
  public title?: string;

  @IsOptional()
  @IsString({ message: HousingOfferMessages.description.invalidFormat })
  @Length(20, 1024, { message: HousingOfferMessages.description.lengthField })
  public description?: string;

  public city?: string;

  @IsOptional()
  @IsString({ message: HousingOfferMessages.previewPhoto.invalidFormat })
  public previewPhoto?: string;

  @IsOptional()
  @IsArray({ message: HousingOfferMessages.photos.invalidFormat })
  @IsString({ each: true, message: HousingOfferMessages.photos.invalidFormat })
  public photos?: string[];

  @IsOptional()
  @IsBoolean({ message: HousingOfferMessages.isPremium.invalidFormat })
  public isPremium?: boolean;

  @IsOptional()
  @IsEnum(HousingType, { message: HousingOfferMessages.type.invalid })
  public type?: HousingType;

  @IsOptional()
  @IsInt({ message: HousingOfferMessages.rooms.invalidFormat })
  @Min(1, { message: HousingOfferMessages.rooms.min })
  @Max(8, { message: HousingOfferMessages.rooms.max })
  public rooms?: number;

  @IsOptional()
  @IsInt({ message: HousingOfferMessages.guests.invalidFormat })
  @Min(1, { message: HousingOfferMessages.guests.min })
  @Max(10, { message: HousingOfferMessages.guests.max })
  public guests?: number;

  @IsOptional()
  @IsInt({ message: HousingOfferMessages.cost.invalidFormat })
  @Min(100, { message: HousingOfferMessages.cost.min })
  @Max(100000, { message: HousingOfferMessages.cost.max })
  public cost?: number;

  @IsOptional()
  @IsArray({ message: HousingOfferMessages.features.invalidFormat })
  @IsString({ each: true, message: HousingOfferMessages.features.invalidFormat })
  @ArrayNotEmpty()
  public features?: HousingFeature[];

  public userId: string;
  public geo?: Geo;
}
