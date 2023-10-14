FROM node:hydrogen-bullseye AS build
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable
COPY . /app
WORKDIR /app

RUN apt-get update && apt-get install -y --no-install-recommends dumb-init
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile
RUN pnpm exec prisma generate
RUN pnpm build

FROM node:hydrogen-bullseye-slim AS deploy
WORKDIR /app
COPY --from=build /app/node_modules /app/node_modules
COPY --from=build /usr/bin/dumb-init /usr/bin/dumb-init
COPY --from=build /app/dist /app

VOLUME [ "/app/prisma" ]

EXPOSE 3000
ENV PORT 3000

CMD ["dumb-init", "node", "/app/server/entry.mjs"]