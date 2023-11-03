import { ObjectId } from 'mongodb';
import { inject, injectable } from 'inversify';
import { DocumentType, types } from '@typegoose/typegoose';
import { IFavoriteService } from './favorite-service.interface.js';
import { Component } from '../../types/index.js';
import { FavoriteEntity } from './favorite.entity.js';
import { CreateFavoriteDto } from './dto/create-favorite.dto.js';

@injectable()
export class FavoriteService implements IFavoriteService {
  constructor(
    @inject(Component.FavoriteModel)
    private readonly favoriteModel: types.ModelType<FavoriteEntity>,
  ) {}

  private async find(userId: string): Promise<DocumentType<FavoriteEntity> | null> {
    const [result] = await this.favoriteModel.aggregate([
      {
        $match: {
          userId: new ObjectId(userId),
        },
      },
    ]);

    return result;
  }

  private async create(dto: CreateFavoriteDto): Promise<DocumentType<FavoriteEntity>> {
    return await this.favoriteModel.create({
      userId: dto.userId,
      favorites: [dto.offerId],
    });
  }

  private async findByIdAndUpdate(
    documentId: string,
    favorites: string[],
  ): Promise<DocumentType<FavoriteEntity> | null> {
    const updatedDocument = await this.favoriteModel.findByIdAndUpdate(
      { _id: documentId },
      {
        $set: { favorites },
      },
      { new: true },
    );

    return updatedDocument;
  }

  public async toggle(dto: CreateFavoriteDto): Promise<DocumentType<FavoriteEntity> | null> {
    const existedDocument = await this.find(dto.userId);

    if (!existedDocument) {
      return this.create(dto);
    }

    const favorites = existedDocument.favorites.map(String);
    const isFavorite = favorites.includes(dto.offerId);

    if (isFavorite) {
      return this.findByIdAndUpdate(
        existedDocument._id.toString(),
        favorites.filter((item) => item !== dto.offerId),
      );
    }

    return this.findByIdAndUpdate(existedDocument._id.toString(), [...favorites, dto.offerId]);
  }
}
