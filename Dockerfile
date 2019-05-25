FROM node:alpine

WORKDIR .

COPY . . 

EXPOSE 3000

CMD ["node", "server.js"]
