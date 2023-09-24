import { TSVFileReader } from '../../shared/libs/file-reader/tsv-file-reader.js';
import { ICommand } from './command.interface.js';
import { CommandName } from './constants.js';

export class ImportCommand implements ICommand {
  public getName(): string {
    return `--${CommandName.IMPORT}`;
  }

  public execute(...parameters: string[]): void {
    const [filename = ''] = parameters;
    const fileReader = new TSVFileReader(filename.trim());

    try {
      fileReader.read();
      console.log(fileReader.toArray());
    } catch (err) {
      if (!(err instanceof Error)) {
        throw err;
      }

      console.error(`Can't import data from file: ${filename}`);
      console.error(`Details: ${err.message}`);
    }
  }
}
