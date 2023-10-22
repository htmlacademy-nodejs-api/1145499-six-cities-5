import { inject, injectable } from 'inversify';
import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { BaseController, HttpError, HttpMethod } from '../../libs/rest/index.js';
import { ILogger } from '../../libs/logger/index.js';
import { Component } from '../../types/index.js';
import { IHousingOfferService } from './housing-offer-service.interface.js';
import { ParamOfferId } from './types/param-offerId.type.js';
import { fillDTO } from '../../helpers/index.js';
import { HousingOfferRdo } from './rdo/housing-offer.rdo.js';

@injectable()
export class HousingOfferController extends BaseController {
  constructor(
    @inject(Component.Logger) logger: ILogger,
    @inject(Component.HousingOfferService)
    private readonly housingOfferService: IHousingOfferService,
  ) {
    super(logger);

    this.logger.info('Register routes for HousingOfferController');
    this.addRoute({ path: '/:offerId', method: HttpMethod.Get, handler: this.show });
    this.addRoute({ path: '/', method: HttpMethod.Get, handler: this.index });
    this.addRoute({ path: '/:offerId', method: HttpMethod.Delete, handler: this.delete });
  }

  public async show({ params }: Request<ParamOfferId>, res: Response): Promise<void> {
    const { offerId } = params;
    const offer = await this.housingOfferService.findById(offerId);

    if (!offer) {
      throw new HttpError(
        StatusCodes.NOT_FOUND,
        `Offer with id ${offerId} not found.`,
        'OfferController',
      );
    }

    this.ok(res, fillDTO(HousingOfferRdo, offer));
  }

  public async index(_req: Request, res: Response) {
    const offers = await this.housingOfferService.find();
    this.ok(res, fillDTO(HousingOfferRdo, offers));
  }

  public async delete({ params }: Request<ParamOfferId>, res: Response): Promise<void> {
    const { offerId } = params;
    const offer = await this.housingOfferService.deleteById(offerId);

    if (!offer) {
      throw new HttpError(
        StatusCodes.NOT_FOUND,
        `Offer with id ${offerId} not found.`,
        'OfferController',
      );
    }

    this.noContent(res, offer);
  }
}
