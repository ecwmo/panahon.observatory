# --------------> The build image__
FROM node:hydrogen-bullseye AS build
RUN apt-get update && apt-get install -y --no-install-recommends dumb-init

WORKDIR /home/node/app
COPY package*.json ./
COPY .yarnrc.yml ./
COPY yarn.lock ./

ENV NPM_CONFIG_PREFIX=/home/node/.npm-global
# optionally if you want to run npm global bin without specifying path
ENV PATH=$PATH:/home/node/.npm-global/bin
RUN corepack enable
RUN corepack prepare yarn@stable --activate
RUN yarn

# --------------> The production image__
FROM node:hydrogen-bullseye-slim

ENV DEBIAN_FRONTEND=noninteractive
RUN apt update && apt install -y graphicsmagick ghostscript && rm -rf /var/lib/apt/lists/*

ENV NODE_ENV production
COPY --from=build /usr/bin/dumb-init /usr/bin/dumb-init

USER node
WORKDIR /home/node/app
COPY --chown=node:node --from=build /home/node/app/node_modules ./node_modules
COPY --chown=node:node dist/ ./
EXPOSE 3000
CMD ["dumb-init", "node", "server/entry.mjs"]
