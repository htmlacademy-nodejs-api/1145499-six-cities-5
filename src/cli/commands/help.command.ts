import { ICommand } from './command.interface.js';
import { CommandName } from './constants.js';


export class HelpCommand implements ICommand {
  public getName(): string {
    return `--${CommandName.HELP}`;
  }

  public execute() {
    console.info(`
        Программа для подготовки данных для REST API сервера.
        Пример:
            cli.js --<command> [--arguments]
        Команды:
            --${CommandName.VERSION}:                   # выводит номер версии
            --${CommandName.HELP}:                      # печатает этот текст
            --${CommandName.IMPORT} <path>:             # импортирует данные из TSV
            --${CommandName.GENERATE} <n> <path> <url>  # генерирует произвольное количество тестовых данных
    `);
  }
}
