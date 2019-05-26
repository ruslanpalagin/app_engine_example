# 
FROM node:alpine

WORKDIR .

COPY server.js yarn.lock package.json google473b2f2e206641d6.html ./
# COPY yarn.lock yarn.lock
# COPY package.json package.json
# COPY google473b2f2e206641d6.html google473b2f2e206641d6.html

RUN yarn install --frozen-lockfile
RUN node --version

EXPOSE 8080

CMD ["node", "server.js"]