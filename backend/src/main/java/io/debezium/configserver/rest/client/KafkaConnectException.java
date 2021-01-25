package io.debezium.configserver.rest.client;

import io.debezium.configserver.rest.model.ServerError;

public class KafkaConnectException extends Exception {

    protected final ServerError error;

    public KafkaConnectException(ServerError error) {
        this.error = error;
    }

    public ServerError getServerError() {
        return error;
    }

}
