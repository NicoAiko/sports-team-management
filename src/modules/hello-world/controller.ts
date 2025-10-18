import { Injectable } from '../../core/dependency-injection/decorators.ts';
import { LogService } from '../../core/logging/log.ts';
import { PostgresClient } from '../../core/postgres/client.ts';
import { Controller, Get } from '../../core/router/route-decorators.ts';

@Injectable({ dependencies: [LogService, PostgresClient] })
@Controller('/hello-world')
export class HelloWorldController {
  constructor(
    private readonly logService: LogService,
    private readonly postgresClient: PostgresClient,
  ) {}

  @Get()
  public printHelloWorld(): number {
    this.logService.info('hello world!', { foo: 'bar' });

    return 1;
  }
}
