# ------------------------
# Stage 1: Builder
# ------------------------
FROM node:22-alpine AS builder

WORKDIR /app

# Prisma + Node need OpenSSL
RUN apk add --no-cache openssl libc6-compat

# Enable pnpm
RUN corepack enable && corepack prepare pnpm@10.28.0 --activate

# Skip Prisma auto-generate during install
ENV PRISMA_SKIP_POSTINSTALL_GENERATE=true

# Copy dependency files
COPY package.json pnpm-lock.yaml ./
COPY prisma ./prisma

# Install deps
RUN pnpm install --frozen-lockfile

# Copy source
COPY . .

# Generate Prisma client explicitly
RUN pnpm prisma generate

# Build args (public only)
ARG NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
ARG NEXT_PUBLIC_APP_URL

ENV NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=$NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
ENV NEXT_PUBLIC_APP_URL=$NEXT_PUBLIC_APP_URL

# Build Next.js standalone
RUN pnpm build

# Remove dev deps
RUN pnpm prune --prod


# ------------------------
# Stage 2: Runner
# ------------------------
FROM node:22-alpine AS runner

WORKDIR /app

RUN apk add --no-cache openssl libc6-compat

# Non-root user
RUN addgroup -S nextjs && adduser -S nextjs -G nextjs

# Copy only what is needed
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public
COPY --from=builder /app/prisma ./prisma

ENV NODE_ENV=production

USER nextjs

EXPOSE 3000

CMD ["node", "server.js"]
