import { inject, injectable } from 'inversify';
import express, { Express } from 'express';
import { ILogger } from '../shared/libs/logger/index.js';
import { IConfig, RestSchema } from '../shared/libs/config/index.js';
import { IDatabaseClient } from '../shared/libs/database-client/index.js';
import { getMongoURI } from '../shared/helpers/index.js';
import { Component } from '../shared/types/component.enum.js';
// import { IHousingOfferService } from '../shared/modules/housing-offer/index.js';
// import { ICommentService } from '../shared/modules/comment/index.js';
import { IExceptionFilter } from '../shared/libs/rest/index.js';

@injectable()
export class RestApplication {
  private server: Express;

  constructor(
    @inject(Component.Logger) private readonly logger: ILogger,
    @inject(Component.Config) private readonly config: IConfig<RestSchema>,
    @inject(Component.DatabaseClient) private readonly databaseClient: IDatabaseClient,
    @inject(Component.ExceptionFilter) private readonly defaultExceptionFilter: IExceptionFilter, // @inject(Component.HousingOfferService) private readonly offerService: IHousingOfferService, // @inject(Component.CommentService) private readonly commentService: ICommentService,
  ) {
    this.server = express();
  }

  private async _initDb() {
    const mongoUri = getMongoURI(
      this.config.get('DB_USER'),
      this.config.get('DB_PASSWORD'),
      this.config.get('DB_HOST'),
      this.config.get('DB_PORT'),
      this.config.get('DB_NAME'),
    );

    return this.databaseClient.connect(mongoUri);
  }

  private async _initServer() {
    const port = this.config.get('PORT');
    this.server.listen(port);
  }

  private async _initExceptionFilters() {
    this.server.use(this.defaultExceptionFilter.catch.bind(this.defaultExceptionFilter));
  }

  public async init() {
    this.logger.info('Application initialization');
    this.logger.info(`Get value from env $PORT: ${this.config.get('PORT')}`);

    this.logger.info('Init database…');
    await this._initDb();
    this.logger.info('Init database completed');

    this.logger.info('Init exception filters');
    await this._initExceptionFilters();
    this.logger.info('Exception filters initialization compleated');

    this.logger.info('Try to init server…');
    await this._initServer();
    this.logger.info(`🚀 Server started on http://localhost:${this.config.get('PORT')}`);

    // TODO: временный код для тестирования
    // const comment1 = await this.commentService.create({
    //   text: 'Hello, World',
    //   userId: '65240b1c17ba3f4be9b99dc0',
    //   offerId: '65240b1c17ba3f4be9b99dc2',
    //   rating: 3,
    // });
    // console.log('comment1', comment1);

    // const comment2 = await this.commentService.create({
    //   text: 'Hello, World War III',
    //   userId: '65240b1c17ba3f4be9b99dc0',
    //   offerId: '65240b1c17ba3f4be9b99dc2',
    //   rating: 4,
    // });
    // console.log('comment2', comment2);

    // // const findedComment = await this.commentService.findByOfferId('6523e9a795b99a3bdb65c10a', 10);
    // // console.log('findedComment', findedComment);

    // const offers = await this.offerService.find();
    // console.log(offers);
  }
}
