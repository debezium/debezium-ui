// config.js
module.exports = {
    KAFKA_CONNECT_CLUSTERS: process.env.KAFKA_CONNECT_CLUSTERS || 'http://localhost:8084/,http://localhost:8085/',
  };
  