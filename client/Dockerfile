# Use a smaller base image
FROM node:18-slim AS base

# Set the working directory for the app
WORKDIR /home/node/app

# Enable corepack
RUN corepack enable

# Switch to the existing root user to install dependencies
USER root

# Install build dependencies using apt-get
RUN apt-get update && apt-get install -y build-essential python3 openssl libssl-dev

# Copy package.json and yarn.lock separately to leverage Docker layer caching
COPY package.json yarn.lock ./

# Copy the application code
COPY . .

# Set the node version to the latest stable release
RUN yarn set version berry

# Manually install node-gyp
RUN yarn dlx node-gyp

# Clear Yarn cache
# RUN yarn cache clean

# Install node dependencies
RUN yarn workspaces focus

# Rebuild the source code
RUN NODE_OPTIONS="--max_old_space_size=8192" \
    NEXT_PUBLIC_WS_URL="wss://mempool.cardanoapi.io/ws" \
    NEXT_PUBLIC_CARDANO_NETWORK="mainnet" \
    NEXT_PUBLIC_NODE_ENV="production" \
    NEXT_PUBLIC_API_URL="https://mempool-api.cardanoapi.io/api/v1" \
    yarn build

# Remove unnecessary files
RUN rm -rf ./.next/cache/* && \
    mkdir moveTarget && \
    mv entrypoint.sh next.config.js next-i18next.config.js next-sitemap.config.js package.json public/ ./moveTarget/

# Create a production-ready image
FROM node:18-slim

# Switch to the existing root user to install dependencies
USER root

# Install build dependencies using apt-get
RUN apt-get update && apt-get install -y build-essential python3 openssl libssl-dev

# Set environment variables
ENV NODE_ENV=production NEXT_TELEMETRY_DISABLED=1

# Set the working directory for the app
WORKDIR /home/node/app

# Copy only necessary files from the builder stage
COPY --from=base /home/node/app/node_modules ./node_modules
COPY --from=base /home/node/app/.next ./.next
COPY --from=base /home/node/app/moveTarget/ ./

# Expose the necessary port
EXPOSE 3000

# Define the entrypoint command
ENTRYPOINT ["./entrypoint.sh"]
