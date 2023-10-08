import { createHousingOffer, getErrorMessage, getMongoURI } from '../../shared/helpers/index.js';
import { TSVFileReader } from '../../shared/libs/file-reader/tsv-file-reader.js';
import { HousingOffer, CommandName } from '../../shared/types/index.js';
import { ICommand } from './command.interface.js';
import {
  IHousingOfferService,
  HousingOfferService,
  HousingOfferModel,
} from '../../shared/modules/housing-offer/index.js';
import { IDatabaseClient, MongoDatabaseClient } from '../../shared/libs/database-client/index.js';
import { ILogger, ConsoleLogger } from '../../shared/libs/logger/index.js';
import { DefaultUserService, UserModel, IUserService } from '../../shared/modules/user/index.js';

export class ImportCommand implements ICommand {
  private userService: IUserService;
  private offerService: IHousingOfferService;
  private databaseClient: IDatabaseClient;
  private logger: ILogger;
  private salt: string;

  constructor() {
    this.onImportedLine = this.onImportedLine.bind(this);
    this.onCompleteImport = this.onCompleteImport.bind(this);

    this.logger = new ConsoleLogger();
    this.userService = new DefaultUserService(this.logger, UserModel);
    this.offerService = new HousingOfferService(this.logger, HousingOfferModel);
    this.databaseClient = new MongoDatabaseClient(this.logger);
  }

  public getName(): string {
    return `--${CommandName.IMPORT}`;
  }

  private async onImportedLine(line: string, resolve: () => void) {
    const offer = createHousingOffer(line);
    await this.saveOffer(offer);
    resolve();
  }

  private onCompleteImport(count: number) {
    console.info(`${count} rows imported.`);
    this.databaseClient.disconnect();
  }

  private async saveOffer(offer: HousingOffer) {
    const { user: author, ...restOffer } = offer;
    const user = await this.userService.findOrCreate(author, this.salt);

    await this.offerService.create({
      ...restOffer,
      userId: user.id,
    });
  }

  public async execute(
    filename: string,
    login: string,
    password: string,
    host: string,
    dbname: string,
    salt: string,
  ): Promise<void> {
    const uri = getMongoURI(login, password, host, '27017', dbname);
    this.salt = salt;

    await this.databaseClient.connect(uri);

    const fileReader = new TSVFileReader(filename.trim());

    fileReader.on('line', this.onImportedLine);
    fileReader.on('end', this.onCompleteImport);

    try {
      fileReader.read();
    } catch (error) {
      if (!(error instanceof Error)) {
        throw error;
      }

      console.error(`Can't import data from file: ${filename}`);
      console.error(getErrorMessage(error));
    }
  }
}
