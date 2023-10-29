import { Request } from 'express';
import { RequestBody, RequestParams } from '../../../libs/rest/index.js';
import { CreateHousingOfferDto } from '../dto/create-housing-offer.dto.js';

export type CreateOfferRequest = Request<RequestParams, RequestBody, CreateHousingOfferDto>;
