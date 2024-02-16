FROM node:20-alpine3.18

ENV NODE_ENV=development
ENV PORT=80

RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

COPY package.json /usr/src/app/
RUN npm install && npm cache clean --force
COPY . /usr/src/app

RUN npm run build

ENV NODE_ENV=production

CMD [ "npm", "start" ]

EXPOSE $PORT