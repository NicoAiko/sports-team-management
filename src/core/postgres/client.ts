import { type QueryArguments, type QueryObjectResult } from '@db/postgres';
import { Injectable } from '../dependency-injection/decorators.ts';
import { PostgresModule } from './module.ts';

@Injectable({ global: true, dependencies: [PostgresModule] })
export class PostgresClient {
  constructor(private readonly postgres: PostgresModule) {}

  public query<T = unknown>(query: string, args?: QueryArguments): Promise<QueryObjectResult<T>> {
    return this.postgres.client.queryObject<T>(query, args);
  }
}
