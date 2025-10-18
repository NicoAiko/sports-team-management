# Sports team management

## Information about this application

Sports team management is a small application that aims to provide users with a simple solution to
organise play dates within their sports teams.

## Development stack

### Backend

Primary programming language is `TypeScript` used for the [Deno](https://deno.com) environment.\
Furthermore, the following frameworks are used within the Deno environment:

- [Oak](https://github.com/oakserver/oak) as Server/Router framework
- [@db/postgres](https://github.com/denodrivers/postgres) as Postgres Database driver

## How to start the backend server?

### Prerequisites

- [Deno](https://deno.com) >= v2.4
- Postgres database
- `.env` file with necessary environment variables set (see [sample.env](sample.env))

### Deno Tasks (see [deno.json](deno.json))

- `deno task start` Starts the server
- `deno task dev` Starts the server in watch mode

## Roadmap - What's planned for version 1.0?

For version 1.0, the app aims to provide three core concepts.

1. You can create `teams`, making you the team's captain.
2. You can invite people as `members` to your `team`.
3. You can plan `events` where the `members` would then answer to.

Events should only be visible to people in the respective team, thus automatically nominated via
team.

If time allows it, the cumulation of teams into one or multiple divisions would be amazing. E.g. if
a soccer team has multiple teams (1st league, 2nd league, children's teams, etc.) handling them as a
division that allows administrating multiple teams is much better than having to circle around
multiple teams one by one.
