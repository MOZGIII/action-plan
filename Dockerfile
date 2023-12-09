FROM node:20

COPY . /action

RUN cd /action && yarn install --immutable --immutable-cache

ENTRYPOINT ["/action/bin/action-exec"]
