import { Controller, Get } from "../router/route-decorators.ts";

@Controller("/hello-world")
export class HelloWorldController {
  @Get("/")
  public printHelloWorld(): number {
    console.log("Hello world!");

    return 1;
  }
}
