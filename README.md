<!-- ALL-CONTRIBUTORS-BADGE:START - Do not remove or modify this section -->
[![All Contributors](https://img.shields.io/badge/all_contributors-13-orange.svg?style=flat-square)](#contributors-)
<!-- ALL-CONTRIBUTORS-BADGE:END -->

# Technologies Used

-   ExpressJs
-   Mongoose
-   Typegoose
-   TypeScript
-   Passport

# Features

-   Admin dashboard
-   User settings and or user dashboard
-   send emails
-   recive emails
-   Connections through other parties ie discord, twitter, facebook etc..

# Run locally

You can setup the application on your local system by 2 methods

-   Docker
-   Manually

> :warning: If you are using unix operating system
> than prefix all bash commands with `sudo`

### Create new directory and clone the repository

```bash
mkdir multi-email
cd multi-email
git clone https://github.com/MultiEmail/backend.git
cd backend
```

## Using Docker

### Prerequisite

-   [Docker](https://www.docker.com/) is installed on your local system
-   `.env` file wih all required variables (check environment variables mentioned below)

### Run Server

```bash
docker compose --env-file ./.env up
```

### To rebuild the image

```bash
docker compose --env-file ./.env up --build
```

### Create admin user

List current running docker containers

```bash
docker ps
```

Output

```bash
CONTAINER ID   IMAGE          COMMAND                  CREATED          STATUS          PORTS                                         NAMES
d07f06c78445   backend-api    "docker-entrypoint.s…"   46 minutes ago   Up 46 minutes   0.0.0.0:3001->3001/tcp, :::3001->3001/tcp     Server
91826c111b76   mongo:latest   "docker-entrypoint.s…"   52 minutes ago   Up 46 minutes   0.0.0.0:2717->27017/tcp, :::2717->27017/tcp   Database

```

now copy the `CONTAINER ID` of image/container `backend-api` and replace `<container_id>` in the below mentioned commands and execute them

```bash
# build and install the command line tool in docker container
docker exec <container_id> yarn build
docker exec <container_id> npm i -g .
```

```bash
# create new admin user in database in docker container
docker exec <container_id> multi-email-admin -e <email> -u <username> -p <password>
```

### Extra's (Port forwarding for docker containers)

| Container | PORT (host) | Port (container) |
| --------- | ----------- | ---------------- |
| Server    | 3001        | 3001             |
| MongoDB   | 2717        | 27017            |

if you want to access database inside docker container from host than use

```bash
mongosh --port 2717
```

or if you want to use [mongodb compass](https://www.mongodb.com/products/compass) than you can use
this connection string

```
mongodb://mongo_db:27017/multiemail
```

## Manually

### Prerequisite

-   Latest [Node js](https://nodejs.org/en/) version
-   [Yarn](https://yarnpkg.com/) installed
-   [Mongodb](https://www.mongodb.com/) installed on local system
-   `.env` file wih all required variables (check environment variables mentioned below)

### Install all the required dependencies

this project use [Yarn](https://yarnpkg.com/) as package manager

```bash
yarn install
```

### Run the server

```bash
yarn dev
```

# Create admin user

```bash
yarn build
npm i -g .
multi-email-admin -e <email> -u <username> -p <password>
```

# Environment Variables

To run this project, you will need to add the following environment variables to your .env file

| Name                      | Description                                                       | Example                                                                               |
| ------------------------- | ----------------------------------------------------------------- | ------------------------------------------------------------------------------------- |
| DB_URI                    | URI on which database is running                                  | mongodb://localhost:27017/multiemail                                                  |
| GOOGLE_CLIENT_ID          | Client ID obtained while creating google oauth concent screen     | 758327950938-90jskrnp9b8d2e6ljpqrstd8fdl2k9fljkhchasnnrnj8.apps.googleusercontent.com |
| GOOGLE_CLIENT_SECRET      | Client Secret obtained while creating google oauth concent screen | GOCSPX-NL52LzLNzF6YGJxlAoeLAnGK-a6                                                    |
| NODE_ENV                  | What type of environment are you running this app in              | development                                                                           |
| EMAIL_ID                  | Which ID will be used for sending email                           | no-reply@multiemail.com                                                               |
| EMAIL_PASSWORD            | Password of your email id                                         | mystrongpassword                                                                      |
| EMAIL_SMTP                | Email SMTP host                                                   | smtp.server.com                                                                       |
| ACCESS_TOKEN_PRIVATE_KEY  | private RSA key which will be used to sign access token           | check .env.example file                                                               |
| ACCESS_TOKEN_PUBLIC_KEY   | public RSA key which will be used to verify access token          | check .env.example file                                                               |
| REFRESH_TOKEN_PRIVATE_KEY | private RSA key which will be used to sign refresh token          | check .env.example file                                                               |
| REFRESH_TOKEN_PUBLIC_KEY  | public RSA key which will be used to verify refresh token         | check .env.example file                                                               |

### NOTEs

-   Your `DB_URI` must be `mongodb://mongo_db:27017/multiemail` if you are using docker
-   If you use gmail account as `EMAIL_ID` than you must enable [2FA](https://myaccount.google.com/signinoptions/two-step-verification/enroll-welcome?pli=1) for your google account and generate [app password](https://support.google.com/accounts/answer/185833?hl=en) and use it as `EMAIL_PASS`

### Resources for generating .env variables

-   You can get google credentials by following this [guide](https://developers.google.com/identity/gsi/web/guides/get-google-api-clientid)
-   You can use [crypto tools](https://cryptotools.net/rsagen) for generating RSA keys for access and refresh tokens
-   RSA keys must be `1024`

# Detailed docs

-   [Github Pages](https://multiemail.github.io/backend/)
-   [Wiki](https://github.com/MultiEmail/backend/wiki)

# Wanna join the team?

-   [Discord server](https://discord.gg/gkvCYzRKEB)
-   [Postman team](https://www.postman.com/multiemail/workspace/muti-email-rest-api/overview)

## Contributing

-   Contributions make the open source community such an amazing place to learn, inspire, and create.
-   Any contributions you make are **truly appreciated**.
-   Check out our [contribution guidelines](/CONTRIBUTING.md) for more information.

<h2>
License
</h2>

<br>
<p>
This project is Licensed under the <a href="./LICENSE">MIT License</a>. Please go through the License atleast once before making your contribution. </p>
<br>

## Contributors ✨

Thanks goes to these wonderful people ❤:

<!-- ALL-CONTRIBUTORS-LIST:START - Do not remove or modify this section -->
<!-- prettier-ignore-start -->
<!-- markdownlint-disable -->
<table>
  <tbody>
    <tr>
      <td align="center"><a href="https://shriproperty.com"><img src="https://avatars.githubusercontent.com/u/69336518?v=4?s=100" width="100px;" alt="Ayush Chugh"/><br /><sub><b>Ayush Chugh</b></sub></a><br /><a href="https://github.com/MultiEmail/backend/issues?q=author%3Aaayushchugh" title="Bug reports">🐛</a> <a href="#ideas-aayushchugh" title="Ideas, Planning, & Feedback">🤔</a> <a href="#mentoring-aayushchugh" title="Mentoring">🧑‍🏫</a> <a href="#security-aayushchugh" title="Security">🛡️</a></td>
      <td align="center"><a href="https://github.com/DaatUserName"><img src="https://avatars.githubusercontent.com/u/40370496?v=4?s=100" width="100px;" alt="Toby"/><br /><sub><b>Toby</b></sub></a><br /><a href="https://github.com/MultiEmail/backend/commits?author=DaatUserName" title="Code">💻</a> <a href="https://github.com/MultiEmail/backend/pulls?q=is%3Apr+reviewed-by%3ADaatUserName" title="Reviewed Pull Requests">👀</a> <a href="#maintenance-DaatUserName" title="Maintenance">🚧</a></td>
      <td align="center"><a href="https://github.com/shivamvishwakarm"><img src="https://avatars.githubusercontent.com/u/80755217?v=4?s=100" width="100px;" alt="shivam vishwakarma"/><br /><sub><b>shivam vishwakarma</b></sub></a><br /><a href="https://github.com/MultiEmail/backend/commits?author=shivamvishwakarm" title="Documentation">📖</a> <a href="https://github.com/MultiEmail/backend/commits?author=shivamvishwakarm" title="Code">💻</a></td>
      <td align="center"><a href="https://github.com/tharun634"><img src="https://avatars.githubusercontent.com/u/53267275?v=4?s=100" width="100px;" alt="Tharun K"/><br /><sub><b>Tharun K</b></sub></a><br /><a href="https://github.com/MultiEmail/backend/commits?author=tharun634" title="Documentation">📖</a> <a href="https://github.com/MultiEmail/backend/commits?author=tharun634" title="Code">💻</a></td>
      <td align="center"><a href="https://github.com/is-it-ayush"><img src="https://avatars.githubusercontent.com/u/36449128?v=4?s=100" width="100px;" alt="Ayush"/><br /><sub><b>Ayush</b></sub></a><br /><a href="https://github.com/MultiEmail/backend/issues?q=author%3Ais-it-ayush" title="Bug reports">🐛</a> <a href="#security-is-it-ayush" title="Security">🛡️</a> <a href="#ideas-is-it-ayush" title="Ideas, Planning, & Feedback">🤔</a></td>
      <td align="center"><a href="https://www.jamesmesser.xyz"><img src="https://avatars.githubusercontent.com/u/71551059?v=4?s=100" width="100px;" alt="James"/><br /><sub><b>James</b></sub></a><br /><a href="#financial-CodesWithJames" title="Financial">💵</a> <a href="#ideas-CodesWithJames" title="Ideas, Planning, & Feedback">🤔</a></td>
      <td align="center"><a href="https://github.com/AndrewFirePvP7"><img src="https://avatars.githubusercontent.com/u/29314485?v=4?s=100" width="100px;" alt="AndrewDev"/><br /><sub><b>AndrewDev</b></sub></a><br /><a href="#ideas-AndrewFirePvP7" title="Ideas, Planning, & Feedback">🤔</a></td>
    </tr>
    <tr>
      <td align="center"><a href="https://arpitchugh.live/"><img src="https://avatars.githubusercontent.com/u/63435960?v=4?s=100" width="100px;" alt="Arpit Chugh"/><br /><sub><b>Arpit Chugh</b></sub></a><br /><a href="https://github.com/MultiEmail/backend/commits?author=Arpitchugh" title="Documentation">📖</a></td>
      <td align="center"><a href="https://github.com/drishit96"><img src="https://avatars.githubusercontent.com/u/13049630?v=4?s=100" width="100px;" alt="Drishit Mitra"/><br /><sub><b>Drishit Mitra</b></sub></a><br /><a href="https://github.com/MultiEmail/backend/commits?author=drishit96" title="Code">💻</a></td>
      <td align="center"><a href="https://github.com/Areadrill"><img src="https://avatars.githubusercontent.com/u/9729792?v=4?s=100" width="100px;" alt="João Mota"/><br /><sub><b>João Mota</b></sub></a><br /><a href="https://github.com/MultiEmail/backend/commits?author=Areadrill" title="Code">💻</a></td>
      <td align="center"><a href="https://github.com/shashankbhatgs"><img src="https://avatars.githubusercontent.com/u/76593166?v=4?s=100" width="100px;" alt="Shashank Bhat G S"/><br /><sub><b>Shashank Bhat G S</b></sub></a><br /><a href="https://github.com/MultiEmail/backend/commits?author=shashankbhatgs" title="Documentation">📖</a></td>
      <td align="center"><a href="https://github.com/alberturria"><img src="https://avatars.githubusercontent.com/u/32776999?v=4?s=100" width="100px;" alt="Alberto Herrera Vargas"/><br /><sub><b>Alberto Herrera Vargas</b></sub></a><br /><a href="https://github.com/MultiEmail/backend/commits?author=alberturria" title="Code">💻</a></td>
      <td align="center"><a href="https://vadimdez.github.io"><img src="https://avatars.githubusercontent.com/u/3748453?v=4?s=100" width="100px;" alt="Vadym Yatsyuk"/><br /><sub><b>Vadym Yatsyuk</b></sub></a><br /><a href="https://github.com/MultiEmail/backend/commits?author=VadimDez" title="Code">💻</a></td>
    </tr>
  </tbody>
  <tfoot>
    <tr>
      <td align="center" size="13px" colspan="7">
        <img src="https://raw.githubusercontent.com/all-contributors/all-contributors-cli/1b8533af435da9854653492b1327a23a4dbd0a10/assets/logo-small.svg">
          <a href="https://all-contributors.js.org/docs/en/bot/usage">Add your contributions</a>
        </img>
      </td>
    </tr>
  </tfoot>
</table>

<!-- markdownlint-restore -->
<!-- prettier-ignore-end -->

<!-- ALL-CONTRIBUTORS-LIST:END -->

This project follows the [all-contributors](https://github.com/all-contributors/all-contributors) specification. Contributions of any kind welcome!
