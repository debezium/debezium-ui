package io.debezium.configserver.rest.client;

public class KafkaConnectException extends Exception {

    public KafkaConnectException(String message, Exception e) {
        super("Error while choosing the Kafka Connect cluster URI: " + e.getMessage(), e);
    }

    public KafkaConnectException(String s) {
        super(s);
    }
}
