import { inject, injectable } from 'inversify';
import { Request, Response } from 'express';
import {
  BaseController,
  HttpMethod,
  DocumentExistsMiddleware,
  PrivateRouteMiddleware,
  ValidateObjectIdMiddleware,
} from '../../libs/rest/index.js';
import { ILogger } from '../../libs/logger/index.js';
import { Component } from '../../types/index.js';
import { fillDTO } from '../../helpers/index.js';
import { CommentRdo, ICommentService } from '../comment/index.js';
import { IHousingOfferService } from './housing-offer-service.interface.js';
import { HousingOfferRdo } from './rdo/housing-offer.rdo.js';
import { ParamOfferId } from './types/param-offerid.type.js';

@injectable()
export class HousingOfferController extends BaseController {
  constructor(
    @inject(Component.Logger) protected logger: ILogger,
    @inject(Component.HousingOfferService)
    private readonly housingOfferService: IHousingOfferService,
    @inject(Component.CommentService) private readonly commentService: ICommentService,
  ) {
    super(logger);

    this.logger.info('Register routes for HousingOfferController');
    this.addRoute({
      path: '/:offerId',
      method: HttpMethod.Get,
      handler: this.show,
      middlewares: [
        new ValidateObjectIdMiddleware('offerId'),
        new DocumentExistsMiddleware(this.housingOfferService, 'Offer', 'offerId'),
      ],
    });
    this.addRoute({ path: '/', method: HttpMethod.Get, handler: this.index });
    this.addRoute({
      path: '/:offerId',
      method: HttpMethod.Delete,
      handler: this.delete,
      middlewares: [
        new PrivateRouteMiddleware(),
        new ValidateObjectIdMiddleware('offerId'),
        new DocumentExistsMiddleware(this.housingOfferService, 'Offer', 'offerId'),
      ],
    });
    this.addRoute({
      path: '/:offerId/comments',
      method: HttpMethod.Get,
      handler: this.getComments,
      middlewares: [
        new ValidateObjectIdMiddleware('offerId'),
        new DocumentExistsMiddleware(this.housingOfferService, 'Offer', 'offerId'),
      ],
    });
  }

  public async show({ params }: Request<ParamOfferId>, res: Response): Promise<void> {
    const { offerId } = params;
    const offer = await this.housingOfferService.findById(offerId);

    this.ok(res, fillDTO(HousingOfferRdo, offer));
  }

  public async index(_req: Request, res: Response) {
    const offers = await this.housingOfferService.find();
    this.ok(res, fillDTO(HousingOfferRdo, offers));
  }

  public async delete({ params }: Request<ParamOfferId>, res: Response): Promise<void> {
    const { offerId } = params;
    const offer = await this.housingOfferService.deleteById(offerId);

    await this.commentService.deleteByOfferId(offerId);

    this.noContent(res, offer);
  }

  public async getComments({ params }: Request<ParamOfferId>, res: Response): Promise<void> {
    const comments = await this.commentService.findByOfferId(params.offerId);
    this.ok(res, fillDTO(CommentRdo, comments));
  }
}