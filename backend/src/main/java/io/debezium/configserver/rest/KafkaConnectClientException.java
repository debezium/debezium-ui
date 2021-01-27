package io.debezium.configserver.rest;

import java.net.URI;

public class KafkaConnectClientException extends Exception {

    public KafkaConnectClientException(URI kafkaConnectURI, Exception e) {
        super("Could not connect to Kafka Connect! Kafka Connect REST API is not available at \""
                + kafkaConnectURI + "\": " + e.getMessage(), e);
    }
}
