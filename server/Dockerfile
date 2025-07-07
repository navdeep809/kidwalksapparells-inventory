FROM node:20-alpine AS base

RUN mkdir -p /home/node/server/node_modules && chown -R node:node /home/node/server

WORKDIR /home/node/server

COPY /server/package*.json /server/ecosystem.config.js ./

RUN npm install

COPY /server/ .
COPY /server/assets ./assets
COPY /server/prisma/ ./prisma

RUN npx prisma generate
RUN npm run seed
RUN npm run build

EXPOSE 3001

CMD ["npm", "start"]
