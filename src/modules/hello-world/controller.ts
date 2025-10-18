import { inject } from '../../core/dependency-injection/inject.ts';
import { LogService } from '../../core/logging/log.ts';
import { Controller, Get } from '../../core/router/route-decorators.ts';

@Controller('/hello-world')
export class HelloWorldController {
  #logService: LogService = inject(LogService);

  @Get('/')
  public printHelloWorld(): number {
    this.#logService.info('hello world!', { foo: 'bar' });

    return 1;
  }
}
