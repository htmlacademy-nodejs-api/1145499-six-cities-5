import { DocumentType, types } from '@typegoose/typegoose';
import { inject, injectable } from 'inversify';
import { ILogger } from '../../libs/logger/index.js';
import { Component, SortType } from '../../types/index.js';
import { IHousingOfferService } from './housing-offer-service.interface.js';
import { HousingOfferEntity } from './housing-offer.entity.js';
import { CreateHousingOfferDto } from './dto/create-housing-offer.dto.js';
import { UpdateHousingOfferDto } from './dto/update-housing-offer.dto.js';
import { DEFAULT_HOUSING_OFFER_COUNT } from './housing-offer.constant.js';

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
    return this.offerModel.findById(offerId).populate('userId');
  }

  public async find(count?: number): Promise<DocumentType<HousingOfferEntity>[]> {
    const limit =
      count && count < DEFAULT_HOUSING_OFFER_COUNT ? count : DEFAULT_HOUSING_OFFER_COUNT;

    return this.offerModel
      .aggregate([
        {
          $lookup: {
            from: 'comments',
            let: { id: '$_id' },
            pipeline: [{ $match: { $expr: { $eq: ['$offerId', '$$id'] } } }],
            as: 'comments',
          },
        },
        {
          $addFields: { rating: { $avg: '$comments.rating' } },
        },
        { $unset: 'comments' },
        { $sort: { offerCount: SortType.Down } },
        { $limit: limit },
      ])
      .exec();
  }

  public async deleteById(offerId: string): Promise<DocumentType<HousingOfferEntity> | null> {
    return this.offerModel.findByIdAndDelete(offerId);
  }

  public async updateById(
    offerId: string,
    dto: UpdateHousingOfferDto,
  ): Promise<DocumentType<HousingOfferEntity> | null> {
    return this.offerModel
      .findByIdAndUpdate(offerId, dto, { new: true })
      .populate('userId', ['name', 'avatar'])
      .exec();
  }

  public async incCommentCount(offerId: string): Promise<DocumentType<HousingOfferEntity> | null> {
    return this.offerModel
      .findByIdAndUpdate(offerId, {
        $inc: {
          commentCount: 1,
        },
      })
      .exec();
  }
}
