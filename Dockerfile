FROM node:23-slim

COPY . /action

RUN cd /action && yarn install --immutable --immutable-cache

ENTRYPOINT ["/action/bin/action-exec"]
