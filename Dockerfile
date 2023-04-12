FROM node:hydrogen-bullseye AS dependencies

WORKDIR /home/node/app
COPY package.json .yarnrc.yml yarn.lock ./

ENV NPM_CONFIG_PREFIX=/home/node/.npm-global
# optionally if you want to run npm global bin without specifying path
ENV PATH=$PATH:/home/node/.npm-global/bin
RUN corepack enable
RUN corepack prepare yarn@stable --activate
RUN yarn

FROM node:hydrogen-bullseye AS build
RUN apt-get update && apt-get install -y --no-install-recommends dumb-init

WORKDIR /home/node/app
COPY --chown=node:node --from=dependencies /home/node/app/node_modules ./node_modules
COPY --chown=node:node . .

RUN npx prisma generate
RUN yarn build


FROM node:hydrogen-bullseye-slim AS deploy

ENV DEBIAN_FRONTEND=noninteractive

ENV NODE_ENV production
COPY --from=build /usr/bin/dumb-init /usr/bin/dumb-init

USER node
WORKDIR /home/node/app
COPY --chown=node:node --from=build /home/node/app/tsconfig.json ./
COPY --chown=node:node --from=build /home/node/app/node_modules ./node_modules
COPY --chown=node:node --from=build /home/node/app/package.json /home/node/app/.yarnrc.yml /home/node/app/yarn.lock ./
COPY --chown=node:node --from=build /home/node/app/dist ./

VOLUME [ "/home/node/app/prisma" ]

EXPOSE 3000
ENV PORT 3000

CMD ["dumb-init", "node", "server/entry.mjs"]
