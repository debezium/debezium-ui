package io.debezium.configserver.rest.model;

public class ServerError {

    public String message;
    public String trace;

    public ServerError(String message, String trace) {
        this.message = message;
        this.trace = trace;
    }
}
