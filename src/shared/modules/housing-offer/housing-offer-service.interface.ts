import { DocumentType } from '@typegoose/typegoose';
import { HousingOfferEntity } from './housing-offer.entity.js';
import { CreateHousingOfferDto } from './dto/housing-offer.dto.js';

export interface IHousingOfferService {
  create(dto: CreateHousingOfferDto): Promise<DocumentType<HousingOfferEntity>>;
  findById(offerId: string): Promise<DocumentType<HousingOfferEntity> | null>;
}
