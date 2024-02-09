####
# This Dockerfile is used in order to build a container with Debezium UI.
###
# Build UI
FROM registry.access.redhat.com/ubi9/nodejs-18 AS build
WORKDIR /app
COPY --chown=1001 package*.json ./
RUN npm install
COPY --chown=1001 . .
RUN npm run build

# Final image with only build artifacts
FROM node:18.19.0-slim
WORKDIR /app
RUN npm install express
COPY --from=build /app/dist/serve.js /app/dist/config.js ./
COPY --from=build /app/dist ./dist
EXPOSE 3000
ENV NODE_ENV=production
ENV KAFKA_CONNECT_CLUSTERS=http://localhost:8083/
CMD ["node", "serve"]
