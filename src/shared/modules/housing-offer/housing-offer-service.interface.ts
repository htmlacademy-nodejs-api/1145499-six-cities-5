import { DocumentType } from '@typegoose/typegoose';
import { HousingOfferEntity } from './housing-offer.entity.js';
import { CreateHousingOfferDto } from './dto/create-housing-offer.dto.js';
import { UpdateHousingOfferDto } from './dto/update-housing-offer.dto.js';
import { DocumentExists } from '../../types/index.js';

export interface IHousingOfferService extends DocumentExists {
  create(dto: CreateHousingOfferDto): Promise<DocumentType<HousingOfferEntity>>;
  findById(offerId: string): Promise<DocumentType<HousingOfferEntity> | null>;
  find(count?: number): Promise<DocumentType<HousingOfferEntity>[]>;
  deleteById(offerId: string): Promise<DocumentType<HousingOfferEntity> | null>;
  updateById(
    offerId: string,
    dto: UpdateHousingOfferDto,
  ): Promise<DocumentType<HousingOfferEntity> | null>;
  incCommentCount(offerId: string): Promise<DocumentType<HousingOfferEntity> | null>;
  exists(documentId: string): Promise<boolean>;
}
