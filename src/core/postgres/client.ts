import { Client } from '@db/postgres';
import { Injectable } from '../dependency-injection/decorators.ts';
import type { OnInit } from '../dependency-injection/on-init.interface.ts';
import { inject } from '../dependency-injection/inject.ts';
import { LogService } from '../logging/log.ts';

@Injectable({ global: true })
export class PostgresClient implements OnInit {
  #logService = inject(LogService);
  #client: Client;

  constructor() {
    this.validateConfig();

    this.#client = new Client({
      user: Deno.env.get('POSTGRES_USER'),
      password: Deno.env.get('POSTGRES_PASSWORD'),
      hostname: Deno.env.get('POSTGRES_HOST'),
      port: Deno.env.get('POSTGRES_PORT') ?? 5432,
      database: Deno.env.get('POSTGRES_DATABASE'),
    });
  }

  public async onInit(): Promise<void> {
    this.#logService.debug('Connecting to postgres database...');
    await this.#client.connect();

    this.#logService.debug('Connected.');
  }

  public async destroy(): Promise<void> {
    this.#logService.debug('Gracefully disconnecting from postgres database');

    await this.#client.end();

    this.#logService.debug('Disconnected');
  }

  private validateConfig(): void | never {
    if (
      ![
        'POSTGRES_USER',
        'POSTGRES_PASSWORD',
        'POSTGRES_HOST',
        'POSTGRES_DATABASE',
      ].every(Deno.env.has)
    ) {
      throw new Error(
        'Postgres configuration is not set! Expected `POSTGRES_USER`, `POSTGRES_PASSWORD`, `POSTGRES_HOST`, `POSTGRES_DATABASE`',
      );
    }
  }
}
