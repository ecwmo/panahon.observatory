FROM node:lts as base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable && corepack prepare pnpm@10.10.0 --activate

FROM base as deps
WORKDIR /app
RUN apt-get update && apt-get install -y --no-install-recommends \
  build-essential \
  libcairo2-dev \
  libpango1.0-dev \
  libjpeg-dev \
  libgif-dev \
  librsvg2-dev \
  && rm -rf /var/lib/apt/lists/*
COPY package.json pnpm-lock.yaml ./
COPY prisma ./prisma
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile
RUN pnpx prisma@6.11.1 generate

FROM deps as build
ARG MODE=production
WORKDIR /app
COPY . .
RUN pnpm build --mode "$MODE"

FROM node:lts-slim as deploy
WORKDIR /app
RUN apt-get update && apt-get install -y --no-install-recommends \
  libpango1.0-0 \
  libpangocairo-1.0-0 \
  libcairo2 \
  libjpeg62-turbo \
  libgif7 \
  librsvg2-2 \
  openssl \
  && rm -rf /var/lib/apt/lists/*
ENV NODE_ENV="production"
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
COPY --from=deps /app/node_modules /app/node_modules
COPY --from=build /app/dist /app/

VOLUME ["/app/prisma"]

ENV HOST=0.0.0.0
ENV PORT=3000
EXPOSE 3000

CMD ["node", "/app/server/entry.mjs"]
