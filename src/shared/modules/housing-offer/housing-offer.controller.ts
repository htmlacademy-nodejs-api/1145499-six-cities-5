import { inject, injectable } from 'inversify';
import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { types } from '@typegoose/typegoose';
import {
  BaseController,
  HttpMethod,
  DocumentExistsMiddleware,
  PrivateRouteMiddleware,
  ValidateDtoMiddleware,
  ValidateObjectIdMiddleware,
  HttpError,
} from '../../libs/rest/index.js';
import { ILogger } from '../../libs/logger/index.js';
import { Component } from '../../types/index.js';
import { fillDTO } from '../../helpers/index.js';
import { ICommentService } from '../comment/index.js';
import { IFavoriteService, FavoriteRdo } from '../favorite/index.js';
import { IHousingOfferService } from './housing-offer-service.interface.js';
import { HousingOfferRdo } from './rdo/housing-offer.rdo.js';
import { CreateHousingOfferDto } from './dto/create-housing-offer.dto.js';
import { UpdateHousingOfferDto } from './dto/update-housing-offer.dto.js';
import { CreateOfferRequest } from './types/create-offer-request.type.js';
import { ParamOfferId } from './types/param-offerid.type.js';
import { ParamCity } from './types/param-city.type.js';
import { HousingOfferEntity } from './housing-offer.entity.js';

@injectable()
export class HousingOfferController extends BaseController {
  constructor(
    @inject(Component.Logger) protected logger: ILogger,
    @inject(Component.HousingOfferService)
    private readonly offerService: IHousingOfferService,
    @inject(Component.CommentService) private readonly commentService: ICommentService,
    @inject(Component.FavoriteService) private readonly favoriteService: IFavoriteService,
    @inject(Component.HousingOfferModel)
    private readonly offerModel: types.ModelType<HousingOfferEntity>,
  ) {
    super(logger);

    this.logger.info('Register routes for HousingOfferController');

    this.addRoute({ path: '/', method: HttpMethod.Get, handler: this.index });

    this.addRoute({
      path: '/:offerId',
      method: HttpMethod.Get,
      handler: this.show,
      middlewares: [
        new ValidateObjectIdMiddleware('offerId'),
        new DocumentExistsMiddleware(this.offerService, 'Offer', 'offerId'),
      ],
    });

    this.addRoute({
      path: '/',
      method: HttpMethod.Post,
      handler: this.create,
      middlewares: [new PrivateRouteMiddleware(), new ValidateDtoMiddleware(CreateHousingOfferDto)],
    });

    this.addRoute({
      path: '/:offerId',
      method: HttpMethod.Patch,
      handler: this.update,
      middlewares: [
        new PrivateRouteMiddleware(),
        new ValidateObjectIdMiddleware('offerId'),
        new ValidateDtoMiddleware(UpdateHousingOfferDto),
        new DocumentExistsMiddleware(this.offerService, 'Offer', 'offerId'),
      ],
    });

    this.addRoute({
      path: '/:offerId',
      method: HttpMethod.Delete,
      handler: this.delete,
      middlewares: [
        new PrivateRouteMiddleware(),
        new ValidateObjectIdMiddleware('offerId'),
        new DocumentExistsMiddleware(this.offerService, 'Offer', 'offerId'),
      ],
    });

    this.addRoute({
      path: '/favorites/all',
      method: HttpMethod.Get,
      handler: this.getFavorites,
      middlewares: [new PrivateRouteMiddleware()],
    });

    this.addRoute({
      path: '/:offerId/favorites',
      method: HttpMethod.Patch,
      handler: this.toggleFavorite,
      middlewares: [new PrivateRouteMiddleware(), new ValidateObjectIdMiddleware('offerId')],
    });

    this.addRoute({
      path: '/premium/:city',
      method: HttpMethod.Get,
      handler: this.getPremium,
    });
  }

  public async index({ tokenPayload }: Request, res: Response) {
    let offers = [];

    if (tokenPayload) {
      offers = await this.offerService.findWithCredentials(tokenPayload.id);
    } else {
      offers = await this.offerService.find();
    }

    this.ok(res, fillDTO(HousingOfferRdo, offers));
  }

  public async show({ params, tokenPayload }: Request<ParamOfferId>, res: Response): Promise<void> {
    const { offerId } = params;
    let offer = null;

    if (tokenPayload) {
      offer = await this.offerService.findByIdWithCredentials(offerId, tokenPayload.id);
    } else {
      offer = await this.offerService.findById(offerId);
    }

    this.ok(res, fillDTO(HousingOfferRdo, offer));
  }

  public async create({ body, tokenPayload }: CreateOfferRequest, res: Response): Promise<void> {
    const result = await this.offerService.create({ ...body, userId: tokenPayload.id });
    const offer = await this.offerService.findById(result.id);

    this.created(res, fillDTO(HousingOfferRdo, offer));
  }

  public async update(
    { body, params, tokenPayload }: Request<ParamOfferId, unknown, UpdateHousingOfferDto>,
    res: Response,
  ): Promise<void> {
    const { offerId } = params;

    const offer = await this.offerModel.findById(offerId);

    if (offer?.userId.toString() !== tokenPayload.id) {
      throw new HttpError(StatusCodes.BAD_REQUEST, 'You can only update your own documents');
    }

    const updatedOffer = await this.offerService.updateById(offerId, body);

    this.ok(res, fillDTO(HousingOfferRdo, updatedOffer));
  }

  public async delete(
    { params, tokenPayload }: Request<ParamOfferId>,
    res: Response,
  ): Promise<void> {
    const { offerId } = params;

    const offer = await this.offerModel.findById(offerId);

    if (offer?.userId.toString() !== tokenPayload.id) {
      throw new HttpError(StatusCodes.BAD_REQUEST, 'You can only delete your own documents');
    }

    await this.offerService.deleteById(offerId);
    await this.commentService.deleteByOfferId(offerId);

    this.noContent(res, null);
  }

  public async getFavorites({ tokenPayload }: Request, res: Response): Promise<void> {
    const offers = await this.offerService.findFavorites(tokenPayload.id);

    this.ok(res, fillDTO(HousingOfferRdo, offers));
  }

  public async toggleFavorite(
    { params, tokenPayload }: Request<ParamOfferId>,
    res: Response,
  ): Promise<void> {
    const { offerId } = params;

    const result = await this.favoriteService.toggle({ offerId, userId: tokenPayload.id });

    this.ok(res, fillDTO(FavoriteRdo, result));
  }

  public async getPremium(
    { tokenPayload, params }: Request<ParamCity>,
    res: Response,
  ): Promise<void> {
    const { city } = params;
    let offers = [];

    if (tokenPayload) {
      offers = await this.offerService.findPremiumWithCredentials(city, tokenPayload.id);
    } else {
      offers = await this.offerService.findPremium(city);
    }

    this.ok(res, fillDTO(HousingOfferRdo, offers));
  }
}
