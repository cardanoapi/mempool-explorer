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

# Copy package.json and package-lock.lock separately to leverage Docker layer caching
COPY package.json package-lock.json ./

# Copy the application code
COPY . .

# Install node dependencies
RUN npm install

# Rebuild the source code
RUN NODE_OPTIONS="--max_old_space_size=8192" npm run build

# Remove unnecessary files
RUN rm -rf ./.next/cache/* && \
    mkdir moveTarget && \
    mv ./prisma tsoa.json package.json public/ ./moveTarget/

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
COPY --from=base /home/node/app/dist ./dist
COPY --from=base /home/node/app/moveTarget/ ./

# Expose the necessary port
EXPOSE 8000

# Define the entrypoint command
CMD ["npm", "start"]
