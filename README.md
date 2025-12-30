# Botinha

<!--toc:start-->
- [Botinha](#botinha)
  - [Features](#features)
  - [Setup](#setup)
  - [Commands](#commands)
    - [DevOnly Commands](#devonly-commands)
      - [/reload \<command\>](#reload-command)
      - [/command \[option\]](#command-option)
      - [/devOnly](#devonly)
      - [/starters](#starters)
      - [/tag](#tag)
    - [Moderation Commands](#moderation-commands)
      - [/ban \<user\> \[reason\]](#ban-user-reason)
      - [/kick \<user\> \[reason\]](#kick-user-reason)
    - [Utility Commands](#utility-commands)
      - [/char \<subcommand\>](#char-subcommand)
      - [/echo \<input\> \[channel\]](#echo-input-channel)
      - [/info \<subcommand\>](#info-subcommand)
      - [/inv \<subcommand\>](#inv-subcommand)
      - [/ping and /bigping](#ping-and-bigping)
      - [/roll \[diesides\]](#roll-diesides)
  - [Events](#events)
    - [ready](#ready)
    - [interactionCreate](#interactioncreate)
<!--toc:end-->

CS50 final project, means "Little bot" in portuguese

## Features

- Ping (She replies with "pong" :) )
- Random number generation (e.g., /roll 20)
- Manages character inventories for RPG games
- Very cute :)

## Setup

First, ensure you have node.js and npm running properly in your syste, then:  
Run the command below to clone the repo in your system

``` bash
git clone https://github.com/LJCRocha/botinha.git
```

Then, run this in the project root (the one with the app.js and package.json)

To download dependencies:

``` bash
npm run install
```

## Commands

To use commands you simply type / in a server the bot is added in,
and Discord should autocomplete the command accordingly

Commands are defined in the commands/ folder and organized by type  
Those files are automatically loaded once `npm run deploy` is run.  

A template for these files can be found in commands/dev/command.js

They should return an object following:

``` js
{
  devonly?: boolean = false,
  cooldown?: integer = 5,
  async execute(interaction): any,
  async autocomplete(interaction): any
}
```

The autocomplete function is only needed if some option needs autocomplete

For more information, check out the [discordjs documentation](https://discordjs.guide/legacy).

### DevOnly Commands

> Some commands are developer only, marked with devonly in the files,
> and in the dev commands folder, these only are registered if you set
> the 'DEV' environment variable to 'true' in the .env file.
> (commands in progress or commands in the commands/dev/ folder
> should typically be devOnly)

#### /reload \<command\>

Most important dev command, useful for hot reloading commands when updated live.

#### /command \[option\]

Baseline command, does nothing and is simply a template for embeds and new commands.

#### /devOnly

Another baseline command, meant simply to check if the devOnly flag is working.

#### /starters

Simple command to experiment with embeds and buttons.

#### /tag

Command with subcommands to create, delete and view tags (messages stored in a database).
Contains subcommands

- list
- add \<tag\> \[description\]
- delete \<tag\>
- info \<tag\>
- find \<tag\>
- edit \<tag\> \<newdescription\>

### Moderation Commands

#### /ban \<user\> \[reason\]

Bans an user, displaying an (optional) reason.

Fetches image from media/

#### /kick \<user\> \[reason\]

Kicks an user, displaying an (optional) reason.

Fetches image from media/

### Utility Commands

#### /char \<subcommand\>

- add \<charname\>  
 Adds a char tied to your user in the database.

- remove \<charname\>  
 Removes a char tied to your user in the database.

- rename \<charname\> \<newcharname\>  
 Renames a char

#### /echo \<input\> \[channel\]

Repeats the input, optionally in another channel.

#### /info \<subcommand\>

- user \[user\]  
 Displays info about an user,
 by default targets the user who ran it

- server  
 Displays info about the server where it's run

#### /inv \<subcommand\>

- add \<charname\> \<itemname\> \[itemcount\]  
 Adds an item tied to a certain char, optionally adds more than one

- remove \<charname\> \<itemname\> \[itemcount\]  
 Subtracts amount of a registered item

- list \<charname\>  
 List items a char owns

#### /ping and /bigping

Excitedly prints "Pong" to the chat, meant to measure latency (and have fun).  
(The bigping variant simply responds with uppercase "PONG!!!")

#### /roll \[diesides\]

Rolls a die, default value is 20...  
~~Randomly gaslights user~~

Fetches random images from media/MaxRoll/ and media/MinRoll/

## Events

The files in events/ folder are meant to handle events. Check out [discordjs documentation](https://discordjs.guide/legacy).

### ready

Currently, events/ready.js simply logs to stoud that its online, and syncs the
database  

### interactionCreate

events/ready.js handle all interaction logic implemented centrally: From
chat input commands to autocomplete logic (based on the commands files)

## Media

Media folder contains a .gitconfig file meant to make git ignore everything in
it, customize it to your liking.
