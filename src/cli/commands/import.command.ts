import { getErrorMessage } from '../../shared/helpers/common.js';
import { createHousingOffer } from '../../shared/helpers/createHousingOffer.js';
import { TSVFileReader } from '../../shared/libs/file-reader/tsv-file-reader.js';
import { ICommand } from './command.interface.js';
import { CommandName } from '../../shared/types/command.enum.js';

export class ImportCommand implements ICommand {
  public getName(): string {
    return `--${CommandName.IMPORT}`;
  }

  private onImportedLine(line: string) {
    const offer = createHousingOffer(line);
    console.info(offer);
  }

  private onCompleteImport(count: number) {
    console.info(`${count} rows imported.`);
  }

  public execute(...parameters: string[]): void {
    const [filename = ''] = parameters;
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
