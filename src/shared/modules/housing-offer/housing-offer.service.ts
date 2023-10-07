import { DocumentType, types } from '@typegoose/typegoose';
import { inject, injectable } from 'inversify';
import { ILogger } from '../../libs/logger/index.js';
import { Component } from '../../types/index.js';
import { IHousingOfferService } from './housing-offer-service.interface.js';
import { HousingOfferEntity } from './housing-offer.entity.js';
import { CreateHousingOfferDto } from './dto/housing-offer.dto.js';

@injectable()
export class HousingOfferService implements IHousingOfferService {
  constructor(
    @inject(Component.Logger) private readonly logger: ILogger,
    @inject(Component.HousingOfferModel)
    private readonly offerModel: types.ModelType<HousingOfferEntity>,
  ) {}

  public async create(dto: CreateHousingOfferDto): Promise<DocumentType<HousingOfferEntity>> {
    const result = await this.offerModel.create(dto);
    this.logger.info(`New housing-offer created: ${dto.title}`);

    return result;
  }

  public async findById(offerId: string): Promise<DocumentType<HousingOfferEntity> | null> {
    return this.offerModel.findOne({ offerId });
  }
}
