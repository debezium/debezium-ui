package io.debezium.configserver.rest.client;

public class InvalidClusterException extends KafkaConnectException {

    public InvalidClusterException(String s, Exception e) {
        super(s, e);
    }

    public InvalidClusterException(String s) {
        super(s);
    }
}
