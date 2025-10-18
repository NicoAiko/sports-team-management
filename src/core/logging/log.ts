// deno-lint-ignore-file no-explicit-any
import { format } from '@std/datetime/format';
import { Injectable } from '../dependency-injection/decorators.ts';
import { LogLevel } from './log-level.enum.ts';

@Injectable({ global: true })
export class LogService {
  get #currentlySetLogLevel(): LogLevel {
    let level = Deno.env.get('LOG_LEVEL') ?? LogLevel.INFO;

    if (isNaN(Number(level))) {
      level = Object.entries(LogLevel).find(([key]) => key === level)
        ?.[1] as LogLevel;
    }

    return level as LogLevel;
  }

  public debug(message: string, ...additionalInfo: any[]): void {
    this.log(LogLevel.DEBUG, message, ...additionalInfo);
  }

  public info(message: string, ...additionalInfo: any[]): void {
    this.log(LogLevel.INFO, message, ...additionalInfo);
  }

  public warn(message: string, ...additionalInfo: any[]): void {
    this.log(LogLevel.WARN, message, ...additionalInfo);
  }

  public error(message: string, ...additionalInfo: any[]): void {
    this.log(LogLevel.ERROR, message, ...additionalInfo);
  }

  private log(
    level: LogLevel,
    message: string,
    ...additionalInfo: any[]
  ): void {
    if (level < this.#currentlySetLogLevel) {
      return;
    }

    const curTimestamp = format(new Date(), 'yyyy-MM-dd HH:mm:ss');
    const logLevelKey = Object.entries(LogLevel).find(([_, lvl]) => lvl === level)?.[0];

    // deno-lint-ignore no-console
    console.log(
      `[${curTimestamp}][${logLevelKey}] ${message}`,
      ...additionalInfo,
    );
  }
}
