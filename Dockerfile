FROM node:alpine

WORKDIR .

COPY server.js server.js
COPY yarn.lock yarn.lock
COPY package.json package.json

RUN yarn install --frozen-lockfile
RUN node --version

EXPOSE 3000

CMD ["node", "server.js"]
