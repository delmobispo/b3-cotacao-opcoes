FROM node:14

ENV PORT=3000
ENV B3="https://arquivos.b3.com.br/apinegocios/ticker"

VOLUME [ "/usr/src/app" ]

WORKDIR /usr/src/app
COPY ./package.json ./
COPY ./index.js ./

CMD [ "npm", "start" ]

EXPOSE ${PORT}