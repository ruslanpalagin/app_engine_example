# install
yarn && yarn dev

# dev
## new migrations
./node_modules/knex/bin/cli.js migrate:make add_token_to_users

# misc
GOOGLE_APPLICATION_CREDENTIALS=/home/dev/d/tmp/docker-demo/tmp/docker-test-432d30d1bf9e.json node src/task.js Pub
GOOGLE_APPLICATION_CREDENTIALS=/home/dev/d/tmp/docker-demo/tmp/docker-test-432d30d1bf9e.json PORT=3000 node src/server.js
