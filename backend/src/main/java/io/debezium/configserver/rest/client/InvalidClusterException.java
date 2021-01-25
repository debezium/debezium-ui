package io.debezium.configserver.rest.client;

import io.debezium.configserver.rest.model.ServerError;

public class InvalidClusterException extends KafkaConnectException {

    public InvalidClusterException(ServerError error) {
        super(error);
    }
}
