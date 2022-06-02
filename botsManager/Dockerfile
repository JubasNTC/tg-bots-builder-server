FROM       node:16.15.0@sha256:9b8eb61072127e898d8d2682f28508937fc21a853c6cb5587fa14d8b05ab4455

LABEL      maintainer="nullish.case@gmail.com"
LABEL      version="1.0"
LABEL      description="telegram bots builder"

RUN         mkdir -p /usr/src/bot/ && chown node:node /usr/src/bot/
RUN         mkdir -p /usr/src/volumes/ && chown node:node /usr/src/volumes/

WORKDIR     /usr/src/bot/

COPY        --chown=node:node package.json package-lock.json* ./

RUN        npm install --production

COPY       --chown=node:node . .

USER       node

EXPOSE     8081

CMD        ["npm", "start"]
