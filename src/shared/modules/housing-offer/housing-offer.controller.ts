import { inject, injectable } from 'inversify';
import { Request, Response } from 'express';
import {
  BaseController,
  HttpMethod,
  DocumentExistsMiddleware,
  PrivateRouteMiddleware,
  ValidateDtoMiddleware,
  ValidateObjectIdMiddleware,
} from '../../libs/rest/index.js';
import { ILogger } from '../../libs/logger/index.js';
import { Component } from '../../types/index.js';
import { fillDTO } from '../../helpers/index.js';
import { ICommentService } from '../comment/index.js';
import { IFavoriteService, CreateFavoriteDto, FavoriteRdo } from '../favorite/index.js';
import { IHousingOfferService } from './housing-offer-service.interface.js';
import { HousingOfferRdo } from './rdo/housing-offer.rdo.js';
import { CreateHousingOfferDto } from './dto/create-housing-offer.dto.js';
import { UpdateHousingOfferDto } from './dto/update-housing-offer.dto.js';
import { CreateOfferRequest } from './types/create-offer-request.type.js';
import { ParamOfferId } from './types/param-offerid.type.js';

@injectable()
export class HousingOfferController extends BaseController {
  constructor(
    @inject(Component.Logger) protected logger: ILogger,
    @inject(Component.HousingOfferService)
    private readonly offerService: IHousingOfferService,
    @inject(Component.CommentService) private readonly commentService: ICommentService,
    @inject(Component.FavoriteService) private readonly favoriteService: IFavoriteService,
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
      path: '/favorites',
      method: HttpMethod.Post,
      handler: this.toggleFavorite,
      middlewares: [new PrivateRouteMiddleware(), new ValidateDtoMiddleware(CreateFavoriteDto)],
    });
  }

  public async show({ params }: Request<ParamOfferId>, res: Response): Promise<void> {
    const { offerId } = params;
    const offer = await this.offerService.findById(offerId);

    this.ok(res, fillDTO(HousingOfferRdo, offer));
  }

  public async index(_req: Request, res: Response) {
    const offers = await this.offerService.find();

    this.ok(res, fillDTO(HousingOfferRdo, offers));
  }

  public async create({ body, tokenPayload }: CreateOfferRequest, res: Response): Promise<void> {
    const result = await this.offerService.create({ ...body, userId: tokenPayload.id });
    const offer = await this.offerService.findById(result.id);

    this.created(res, fillDTO(HousingOfferRdo, offer));
  }

  public async update(
    { body, params }: Request<ParamOfferId, unknown, UpdateHousingOfferDto>,
    res: Response,
  ): Promise<void> {
    const updatedOffer = await this.offerService.updateById(params.offerId, body);

    this.ok(res, fillDTO(HousingOfferRdo, updatedOffer));
  }

  public async delete({ params }: Request<ParamOfferId>, res: Response): Promise<void> {
    const { offerId } = params;
    const offer = await this.offerService.deleteById(offerId);

    await this.commentService.deleteByOfferId(offerId);

    this.noContent(res, offer);
  }

  public async toggleFavorite({ body, tokenPayload }: Request, res: Response): Promise<void> {
    const result = await this.favoriteService.toggle({ ...body, userId: tokenPayload.id });

    this.ok(res, fillDTO(FavoriteRdo, result));
  }
}
