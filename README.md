# Botinha

<!--toc:start-->
- [Botinha](#botinha)
  - [Features](#features)
  - [Commands](#commands)
    - [DevOnly Commands](#devonly-commands)
<!--toc:end-->

CS50 final project, means "Little bot" in portuguese

## Features

- Ping (She replies with "pong" :) )
- Random number generation (e.g., /random 20)
- Manages character inventories for RPG games

## Commands

### DevOnly Commands

> Some commands are developer only, marked with (devOnly), these only
> are registered if you set the 'DEV' environment variable to 'true'
> in the .env file. (commands in progress or commands in the commands/dev/ folder
> should typically be devOnly)

#### /command

Baseline command, does nothing and is simply a template for embeds and new commands.

#### /devOnly

Another baseline command, meant simply to check if the devOnly flag is working.

#### /starters

Simple command to experiment with embeds and buttons.

#### /tag

Command with subcommands to create, delete and view tags (messages stored in a database).
Contains subcommands

-
