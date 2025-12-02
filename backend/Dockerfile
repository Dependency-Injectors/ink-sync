FROM oven/bun AS build

WORKDIR /app

# Cache packages installation
COPY package.json package.json
COPY bun.lock bun.lock

RUN bun install

# Copy prisma schema and migrations
COPY ./prisma ./prisma
RUN bun run prisma:generate

COPY ./src ./src

ENV NODE_ENV=production

RUN bun build \
	--compile \
	--minify-whitespace \
	--minify-syntax \
	--outfile server \
	src/index.ts

# Use debian slim instead of distroless for compatibility
FROM debian:bookworm-slim

WORKDIR /app

# Install OpenSSL (required for Prisma)
RUN apt-get update && apt-get install -y openssl ca-certificates && rm -rf /var/lib/apt/lists/*

COPY --from=build /app/server server
COPY --from=build /app/generated /app/generated
COPY --from=build /app/prisma/schema.prisma /app/prisma/schema.prisma

ENV NODE_ENV=production

CMD ["./server"]

EXPOSE 3000
