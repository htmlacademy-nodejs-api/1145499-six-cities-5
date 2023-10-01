import chalk from 'chalk';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { ICommand } from './command.interface.js';
import { CommandName } from '../../shared/types/command-name.enum.js';

type PackageJSONConfig = {
  version: string;
};

function isPackageJSONConfig(value: unknown): value is PackageJSONConfig {
  return (
    typeof value === 'object' &&
    value !== null &&
    !Array.isArray(value) &&
    Object.hasOwn(value, CommandName.VERSION)
  );
}

export class VersionCommand implements ICommand {
  constructor(private readonly filePath: string = './package.json') {}

  private readVersion(): string {
    const jsonContent = readFileSync(resolve(this.filePath), 'utf-8');
    const importedContent: unknown = JSON.parse(jsonContent);

    if (!isPackageJSONConfig(importedContent)) {
      throw new Error('Failed to parse json content.');
    }

    return importedContent.version;
  }

  public getName(): string {
    return `--${CommandName.VERSION}`;
  }

  public execute(): void {
    try {
      const version = this.readVersion();
      console.info(chalk.green(version));
    } catch (error: unknown) {
      console.error(`Failed to read version from ${this.filePath}`);

      if (error instanceof Error) {
        console.error(error.message);
      }
    }
  }
}
