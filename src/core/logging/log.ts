// deno-lint-ignore-file no-explicit-any
import { format } from '@std/datetime/format';
import { ensureFileSync } from '@std/fs';
import { writeTextFileSync } from '@std/fs/unstable-write-text-file';
import { join, resolve } from '@std/path';
import { Injectable } from '../dependency-injection/decorators.ts';
import type { OnInit } from '../dependency-injection/on-init.interface.ts';
import { LogLevel } from './log-level.enum.ts';

@Injectable({ global: true })
export class LogService implements OnInit {
  private logToFile = false;
  private logFilePath: string = '';

  private get currentlySetLogLevel(): LogLevel {
    let level = Deno.env.get('LOG_LEVEL') ?? LogLevel.INFO;

    if (isNaN(Number(level))) {
      level = Object.entries(LogLevel).find(([key]) => key === level)
        ?.[1] as LogLevel;
    }

    return level as LogLevel;
  }

  public onInit(): void | Promise<void> {
    const logDir = Deno.env.get('LOG_DIRECTORY');

    if (!logDir) {
      this.debug('Log directory environment variable is empty. No logs will be persisted.');

      return;
    }

    const resolvedLogDir = resolve(logDir);
    const today = format(new Date(), 'dd');
    const logFilePath = join(resolvedLogDir, `${today}.log`);

    // Makes sure, the log file, the app will be logging into, exists
    ensureFileSync(logFilePath);

    this.logToFile = true;
    this.logFilePath = logFilePath;
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

  private log(level: LogLevel, message: string, ...additionalInfo: any[]): void {
    if (level < this.currentlySetLogLevel) {
      return;
    }

    const curTimestamp = format(new Date(), 'yyyy-MM-dd HH:mm:ss');
    const logLevelKey = Object.entries(LogLevel).find(([_, lvl]) => lvl === level)?.[0];
    const logMessage = `[${curTimestamp}][${logLevelKey}] ${message}`;

    // deno-lint-ignore no-console
    console.log(logMessage, ...additionalInfo);

    if (this.logToFile) {
      writeTextFileSync(
        this.logFilePath,
        `${logMessage}${additionalInfo?.length ? ' ' + JSON.stringify(additionalInfo) : ''}\n`,
        { append: true },
      );
    }
  }
}
