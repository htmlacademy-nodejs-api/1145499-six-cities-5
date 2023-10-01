export interface ILogger {
  info(message: string, ...args: unknown[]): void;
  warn(message: string, ...args: unknown[]): void;
  error(error: Error, message: string, ...args: unknown[]): void;
  debug(message: string, ...args: unknown[]): void;
}
