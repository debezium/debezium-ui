####
# This Dockerfile is used in order to build a container with Debezium UI for development.
###
FROM registry.access.redhat.com/ubi9/nodejs-18

WORKDIR /app

COPY --chown=1001 package*.json ./

RUN npm install

COPY --chown=1001 . .

ENV NODE_ENV=production
ENV KAFKA_CONNECT_CLUSTERS=http://localhost:8083/

RUN npm run build

EXPOSE 3000
CMD ["npm", "run", "start:dev"]
