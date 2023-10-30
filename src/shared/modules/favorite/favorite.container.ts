import { types } from '@typegoose/typegoose';
import { Container } from 'inversify';
import { Component } from '../../types/index.js';
import { IFavoriteService } from './favorite-service.interface.js';
import { FavoriteService } from './favorite.service.js';
import { FavoriteEntity, FavoriteModel } from './favorite.entity.js';

export function createFavoriteContainer() {
  const container = new Container();
  container
    .bind<types.ModelType<FavoriteEntity>>(Component.FavoriteModel)
    .toConstantValue(FavoriteModel);
  container
    .bind<IFavoriteService>(Component.FavoriteService)
    .to(FavoriteService)
    .inSingletonScope();

  return container;
}
