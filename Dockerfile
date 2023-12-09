FROM node:20

WORKDIR /app

COPY . .

RUN yarn install --immutable --immutable-cache

ENTRYPOINT ["/app/bin/action-exec"]
