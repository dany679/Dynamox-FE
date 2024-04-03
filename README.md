<p align="center">
  <img alt="" src="./readme.png" height-max='720px'>
</p>

<p>Link para visitar o site : 
<a href="https://portifolio-git-main-dany679.vercel.app/" />Demo</a>
</p>
<p align='center'> Basic web-site <p/>

## 🚀 Tecnologias

- How to reuse layouts
- Folder structure in Next 13 App Router
- Dynamic titles
- Tailwind design
- Tailwind animations and effects
- Form-hooks
- Zod
- Mui
- TanStack (react-query)
- Cypress (test)
- Next auth
- Search url
- Deploy on vercel

### BackEnd

TO GET THE NEXT_PUBLIC_HTTP

https://github.com/dany679/Nest-company-D-BE

case you run in localhost change in the .env file the place of the url to your localhost or get the url deployed.

NEXT_PUBLIC_HTTP=

### Prerequisites

**Node version 18.x.x**

## 💻 Projeto

O projeto sera um site de cadastro de maquinas e pontos de acesso <a href="https://vercel.com/" /> vercel</a> para rodar no seu próprio computador lembre de acessar de adicionar .env abaixo

## Licença

MIT

## How To Run

### create .env file

```shell
  #baseUrl FOR CYPRESS TESTING IN GENERAL THE SAME AS THE NEXTAUTH_URL
  baseUrl=http://localhost:3000
  NEXTAUTH_URL=http://localhost:3000
  NEXTAUTH_SECRET=<openssl rand -base64 32 as NEXTAUTH_SECRET>
  NEXT_PUBLIC_HTTP= probably https://fly-teste.fly.dev or http://localhost:8080
  # check readme.md for more info
  NEXT_PUBLIC_HTTP=<API_URL>
  # create you account and add above for testing in cypress
  email=<EMAIL>
  password=<PASSWORD>
   projectId=1hv9x5

  #project id from cypress

```

after run and sign-up add you email and password in the file.env to use cypress test

### Install packages

```shell
yarn
```

### Start the app

```shell
$ yarn start
```

### test using cypress

```shell
$ yarn test
```
