FROM node:iron-bookworm AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable
COPY . /app
WORKDIR /app

FROM base AS prod-deps
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --prod --frozen-lockfile
RUN pnpm dlx prisma@5.14.0 generate

FROM base AS build
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile
RUN pnpm run build

FROM node:iron-bookworm-slim AS deploy
WORKDIR /app
RUN apt-get update && apt-get install -y \
  openssl \
  && rm -rf /var/lib/apt/lists/*
COPY --from=prod-deps /app/node_modules /app/node_modules
COPY --from=build /app/dist /app

VOLUME [ "/app/prisma" ]

EXPOSE 3000
ENV PORT=3000

CMD ["node", "/app/server/entry.mjs"]
