# Install dependencies only when needed
FROM node:18-alpine AS base
# Check https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a31506c3#nodealpine to understand why libc6-compat might be needed.
#RUN apk add --no-cache libc6-compat
WORKDIR /home/node


FROM base AS prod
RUN apk add --no-cache python3 g++ make
USER  node
COPY package.json yarn.lock ./
RUN yarn install --prod --frozen-lockfile


# Rebuild the source code only when needed
FROM prod AS builder
ARG BASE_DEPLOY_PATH=
RUN yarn install --frozen-lockfile
COPY --chown=node:node . .
RUN yarn prisma:generate && yarn build 
RUN rm -rf ./.next/cache/* && mkdir moveTarget && mv ./prisma  entrypoint.sh next.config.js package.json public/ ./moveTarget/


# Production image, copy all the files and run next
FROM base
ENV NODE_ENV=production NEXT_TELEMETRY_DISABLED=1
EXPOSE 3000

# Next.js collects completely anonymous telemetry data about general usage.
# Learn more here: https://nextjs.org/telemetry
# Uncomment the following line in case you want to disable telemetry.
ENTRYPOINT "./entrypoint.sh"

# You only need to copy next.config.js if you are NOT using the default configuration
# COPY --from=builder /app/next.config.js ./
COPY --from=prod     /home/node/node_modules ./node_modules
COPY --from=builder  /home/node/moveTarget/   ./
RUN yarn prisma:generate
COPY --from=builder  /home/node/.next ./.next
VOLUME /home/node/.next/cache