import { Client } from "@db/postgres";

export class PostgresClient {
  static #client: Client;
  static #initialised: boolean = false;

  public static async init(): Promise<void> {
    if (this.#initialised) {
      return;
    }

    console.log("Validating config to connect to database");
    this.#validateConfig();

    console.log("Connecting to database");
    this.#client = new Client({
      user: Deno.env.get("POSTGRES_USER"),
      password: Deno.env.get("POSTGRES_PASSWORD"),
      hostname: Deno.env.get("POSTGRES_HOST"),
      port: Deno.env.get("POSTGRES_PORT") ?? 5432,
      database: Deno.env.get("POSTGRES_DATABASE"),
    });

    await this.#client.connect();

    console.log("Connected");

    this.#initialised = true;
  }

  public static async destroy(): Promise<void> {
    if (!this.#initialised) {
      return;
    }

    console.log("Gracefully disconnecting from postgres database");

    await this.#client.end();

    console.log("Disconnected");
  }

  public static getClient(): Client {
    return this.#client;
  }

  static #validateConfig(): void | never {
    if (
      ![
        "POSTGRES_USER",
        "POSTGRES_PASSWORD",
        "POSTGRES_HOST",
        "POSTGRES_DATABASE",
      ].every(Deno.env.has)
    ) {
      throw new Error(
        "Postgres configuration is not set! Expected `POSTGRES_USER`, `POSTGRES_PASSWORD`, `POSTGRES_HOST`, `POSTGRES_DATABASE`",
      );
    }
  }
}
