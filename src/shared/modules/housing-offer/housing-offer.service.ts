import { ObjectId } from 'mongodb';
import { DocumentType, types } from '@typegoose/typegoose';
import { inject, injectable } from 'inversify';
import { ILogger } from '../../libs/logger/index.js';
import { Component, SortType } from '../../types/index.js';
import { IHousingOfferService } from './housing-offer-service.interface.js';
import { HousingOfferEntity } from './housing-offer.entity.js';
import { CreateHousingOfferDto } from './dto/create-housing-offer.dto.js';
import { UpdateHousingOfferDto } from './dto/update-housing-offer.dto.js';
import {
  DEFAULT_HOUSING_OFFER_COUNT,
  LIMIT_PREMIUM_HOUSING_OFFER_COUNT,
} from './housing-offer.constant.js';

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
    const [offer] = await this.offerModel
      .aggregate([
        {
          $match: {
            _id: new ObjectId(offerId),
          },
        },
        {
          $lookup: {
            from: 'comments',
            localField: '_id',
            foreignField: 'offerId',
            as: 'comments',
          },
        },
        {
          $lookup: {
            from: 'users',
            localField: 'userId',
            foreignField: '_id',
            as: 'userId',
          },
        },
        {
          $addFields: {
            rating: { $round: [{ $avg: '$comments.rating' }, 1] },
          },
        },
        { $unset: 'comments' },
      ])
      .exec();

    return offer;
  }

  public async findByIdWithCredentials(
    offerId: string,
    userId: string,
  ): Promise<DocumentType<HousingOfferEntity> | null> {
    const [offer] = await this.offerModel
      .aggregate([
        {
          $match: {
            _id: new ObjectId(offerId),
          },
        },
        {
          $lookup: {
            from: 'comments',
            localField: '_id',
            foreignField: 'offerId',
            as: 'comments',
          },
        },
        {
          $lookup: {
            from: 'favorites',
            let: { offerId: '$_id' },
            pipeline: [
              {
                $match: {
                  $expr: {
                    $and: [
                      { $eq: ['$userId', new ObjectId(userId)] },
                      { $in: ['$$offerId', '$favorites'] },
                    ],
                  },
                },
              },
            ],
            as: 'favorites',
          },
        },
        {
          $lookup: {
            from: 'users',
            localField: 'userId',
            foreignField: '_id',
            as: 'userId',
          },
        },
        {
          $addFields: {
            rating: { $round: [{ $avg: '$comments.rating' }, 1] },
            isFavorite: { $toBool: { $size: '$favorites' } },
          },
        },
        { $unset: 'comments' },
      ])
      .exec();

    return offer;
  }

  public async find(count?: number): Promise<DocumentType<HousingOfferEntity>[]> {
    const limit =
      count && count < DEFAULT_HOUSING_OFFER_COUNT ? count : DEFAULT_HOUSING_OFFER_COUNT;

    return this.offerModel
      .aggregate([
        {
          $lookup: {
            from: 'comments',
            localField: '_id',
            foreignField: 'offerId',
            as: 'comments',
          },
        },
        {
          $lookup: {
            from: 'users',
            localField: 'userId',
            foreignField: '_id',
            as: 'userId',
          },
        },
        {
          $addFields: {
            rating: { $round: [{ $avg: '$comments.rating' }, 1] },
          },
        },
        { $unset: 'comments' },
        { $sort: { createdAt: SortType.Down } },
        { $limit: limit },
      ])
      .exec();
  }

  public async findWithCredentials(
    userId: string,
    count?: number,
  ): Promise<DocumentType<HousingOfferEntity>[]> {
    const limit =
      count && count < DEFAULT_HOUSING_OFFER_COUNT ? count : DEFAULT_HOUSING_OFFER_COUNT;

    return this.offerModel
      .aggregate([
        {
          $lookup: {
            from: 'comments',
            localField: '_id',
            foreignField: 'offerId',
            as: 'comments',
          },
        },
        {
          $lookup: {
            from: 'favorites',
            let: { offerId: '$_id' },
            pipeline: [
              {
                $match: {
                  $expr: {
                    $and: [
                      { $eq: ['$userId', new ObjectId(userId)] },
                      { $in: ['$$offerId', '$favorites'] },
                    ],
                  },
                },
              },
            ],
            as: 'favorites',
          },
        },
        {
          $lookup: {
            from: 'users',
            localField: 'userId',
            foreignField: '_id',
            as: 'userId',
          },
        },
        {
          $addFields: {
            rating: { $round: [{ $avg: '$comments.rating' }, 1] },
            isFavorite: { $toBool: { $size: '$favorites' } },
          },
        },
        { $unset: ['comments', 'favorites'] },
        { $sort: { createdAt: SortType.Down } },
        { $limit: limit },
      ])
      .exec();
  }

  public async findFavorites(
    userId: string,
    count?: number,
  ): Promise<DocumentType<HousingOfferEntity>[]> {
    const limit =
      count && count < DEFAULT_HOUSING_OFFER_COUNT ? count : DEFAULT_HOUSING_OFFER_COUNT;

    return this.offerModel
      .aggregate([
        {
          $lookup: {
            from: 'comments',
            localField: '_id',
            foreignField: 'offerId',
            as: 'comments',
          },
        },
        {
          $lookup: {
            from: 'favorites',
            let: { offerId: '$_id' },
            pipeline: [
              {
                $match: {
                  $expr: {
                    $and: [
                      { $eq: ['$userId', new ObjectId(userId)] },
                      { $in: ['$$offerId', '$favorites'] },
                    ],
                  },
                },
              },
            ],
            as: 'favorites',
          },
        },
        {
          $lookup: {
            from: 'users',
            localField: 'userId',
            foreignField: '_id',
            as: 'userId',
          },
        },
        {
          $addFields: {
            rating: { $round: [{ $avg: '$comments.rating' }, 1] },
            isFavorite: { $toBool: { $size: '$favorites' } },
          },
        },
        { $unset: ['comments', 'favorites'] },
        {
          $match: {
            isFavorite: true,
          },
        },
        { $sort: { createdAt: SortType.Down } },
        { $limit: limit },
      ])
      .exec();
  }

  public async findPremium(city: string): Promise<DocumentType<HousingOfferEntity>[]> {
    return this.offerModel
      .aggregate([
        {
          $lookup: {
            from: 'comments',
            localField: '_id',
            foreignField: 'offerId',
            as: 'comments',
          },
        },
        {
          $lookup: {
            from: 'users',
            localField: 'userId',
            foreignField: '_id',
            as: 'userId',
          },
        },
        {
          $addFields: {
            rating: { $round: [{ $avg: '$comments.rating' }, 1] },
          },
        },
        { $unset: ['comments'] },
        {
          $match: {
            $expr: {
              $and: [{ $eq: ['$isPremium', true] }, { $eq: ['$city', city] }],
            },
          },
        },
        { $sort: { createdAt: SortType.Down } },
        { $limit: LIMIT_PREMIUM_HOUSING_OFFER_COUNT },
      ])
      .exec();
  }

  public async findPremiumWithCredentials(
    city: string,
    userId: string,
  ): Promise<DocumentType<HousingOfferEntity>[]> {
    return this.offerModel
      .aggregate([
        {
          $lookup: {
            from: 'comments',
            localField: '_id',
            foreignField: 'offerId',
            as: 'comments',
          },
        },
        {
          $lookup: {
            from: 'favorites',
            let: { offerId: '$_id' },
            pipeline: [
              {
                $match: {
                  $expr: {
                    $and: [
                      { $eq: ['$userId', new ObjectId(userId)] },
                      { $in: ['$$offerId', '$favorites'] },
                    ],
                  },
                },
              },
            ],
            as: 'favorites',
          },
        },
        {
          $lookup: {
            from: 'users',
            localField: 'userId',
            foreignField: '_id',
            as: 'userId',
          },
        },
        {
          $addFields: {
            rating: { $round: [{ $avg: '$comments.rating' }, 1] },
            isFavorite: { $toBool: { $size: '$favorites' } },
          },
        },
        { $unset: ['comments', 'favorites'] },
        {
          $match: {
            $expr: {
              $and: [{ $eq: ['$isPremium', true] }, { $eq: ['$city', city] }],
            },
          },
        },
        { $sort: { createdAt: SortType.Down } },
        { $limit: LIMIT_PREMIUM_HOUSING_OFFER_COUNT },
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
    return this.offerModel.findByIdAndUpdate(offerId, dto, { new: true }).populate('userId').exec();
  }

  public async incCommentCount(offerId: string): Promise<DocumentType<HousingOfferEntity> | null> {
    return this.offerModel
      .findByIdAndUpdate(offerId, {
        $inc: {
          commentsCount: 1,
        },
      })
      .exec();
  }

  public async exists(documentId: string): Promise<boolean> {
    return (await this.offerModel.exists({ _id: documentId })) !== null;
  }
}
