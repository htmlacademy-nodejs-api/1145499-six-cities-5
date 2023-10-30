import { DocumentType } from '@typegoose/typegoose';
import { FavoriteEntity } from './favorite.entity.js';
import { CreateFavoriteDto } from './dto/create-favorite.dto.js';

export interface IFavoriteService {
  toggle(dto: CreateFavoriteDto): Promise<DocumentType<FavoriteEntity> | null>;
}
