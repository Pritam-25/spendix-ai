# ------------------------
# Stage 1: Builder
# ------------------------
FROM node:22-slim AS builder

WORKDIR /app

# Enable pnpm
RUN corepack enable && corepack prepare pnpm@10.28.0 --activate

# Copy lockfiles
COPY package.json pnpm-lock.yaml ./

# Install all dependencies (dev + prod needed for build)
RUN pnpm install --frozen-lockfile

# Copy source code
COPY . .

# Build-time environment variables (public only)
ARG NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
ARG NEXT_PUBLIC_APP_URL

ENV NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=$NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
ENV NEXT_PUBLIC_APP_URL=$NEXT_PUBLIC_APP_URL

# Generate Prisma client
RUN npx prisma generate

# Build Next.js
RUN pnpm build

# Remove dev dependencies for production
RUN pnpm prune --prod

# ------------------------
# Stage 2: Runner
# ------------------------
FROM node:22-slim AS runner

WORKDIR /app

# Security: non-root user
RUN addgroup --system nodejs && adduser --system nextjs --ingroup nodejs

# Copy only standalone output and static assets
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public

# Runtime environment
ENV NODE_ENV=production

# Run as non-root
USER nextjs

# Expose port
EXPOSE 3000

# Start app using standalone server
CMD ["node", "server.js"]
