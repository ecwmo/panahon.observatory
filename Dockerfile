FROM node:hydrogen-bullseye AS build
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable
COPY . /app
WORKDIR /app

FROM build as build-deps
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install -P --frozen-lockfile
RUN pnpm dlx prisma generate

FROM build as build-prod
RUN apt-get update && apt-get install -y --no-install-recommends dumb-init
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile
RUN pnpm build

FROM node:hydrogen-bullseye-slim AS deploy
WORKDIR /app
COPY --from=build-deps /app/node_modules /app/node_modules
COPY --from=build-prod /usr/bin/dumb-init /usr/bin/dumb-init
COPY --from=build-prod /app/dist /app

VOLUME [ "/app/prisma" ]

EXPOSE 3000
ENV PORT 3000

CMD ["dumb-init", "node", "/app/server/entry.mjs"]