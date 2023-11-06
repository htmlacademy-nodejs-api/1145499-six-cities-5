import { DocumentType } from '@typegoose/typegoose';
import { HousingOfferEntity } from './housing-offer.entity.js';
import { CreateHousingOfferDto } from './dto/create-housing-offer.dto.js';
import { UpdateHousingOfferDto } from './dto/update-housing-offer.dto.js';
import { DocumentExists } from '../../types/index.js';

export interface IHousingOfferService extends DocumentExists {
  create(dto: CreateHousingOfferDto): Promise<DocumentType<HousingOfferEntity>>;
  findById(offerId: string): Promise<DocumentType<HousingOfferEntity> | null>;
  findByIdWithCredentials(
    offerId: string,
    userId: string,
  ): Promise<DocumentType<HousingOfferEntity> | null>;
  find(count?: number): Promise<DocumentType<HousingOfferEntity>[]>;
  findWithCredentials(userId: string, count?: number): Promise<DocumentType<HousingOfferEntity>[]>;
  findFavorites(userId: string, count?: number): Promise<DocumentType<HousingOfferEntity>[]>;
  findPremium(city: string): Promise<DocumentType<HousingOfferEntity>[]>;
  findPremiumWithCredentials(
    city: string,
    userId: string,
  ): Promise<DocumentType<HousingOfferEntity>[]>;
  deleteById(offerId: string): Promise<DocumentType<HousingOfferEntity> | null>;
  updateById(
    offerId: string,
    dto: UpdateHousingOfferDto,
  ): Promise<DocumentType<HousingOfferEntity> | null>;
  incCommentCount(offerId: string): Promise<DocumentType<HousingOfferEntity> | null>;
}
