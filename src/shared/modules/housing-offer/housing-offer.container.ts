import { types } from '@typegoose/typegoose';
import { Container } from 'inversify';
import { Component } from '../../types/index.js';
import { IHousingOfferService } from './housing-offer-service.interface.js';
import { HousingOfferService } from './housing-offer.service.js';
import { HousingOfferEntity, HousingOfferModel } from './housing-offer.entity.js';

export function createHousingOfferContainer() {
  const offerContainer = new Container();
  offerContainer
    .bind<IHousingOfferService>(Component.HousingOfferService)
    .to(HousingOfferService)
    .inSingletonScope();
  offerContainer
    .bind<types.ModelType<HousingOfferEntity>>(Component.HousingOfferModel)
    .toConstantValue(HousingOfferModel);

  return offerContainer;
}
