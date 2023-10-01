#!/usr/bin/env node

import {
  CLIApplication,
  GenerateCommand,
  HelpCommand,
  ImportCommand,
  VersionCommand,
} from './cli/index.js';

function bootstrap() {
  const cliApplication = new CLIApplication();
  cliApplication.registerCommands([
    new GenerateCommand(),
    new HelpCommand(),
    new ImportCommand(),
    new VersionCommand(),
  ]);

  cliApplication.processCommand(process.argv);
}

bootstrap();
