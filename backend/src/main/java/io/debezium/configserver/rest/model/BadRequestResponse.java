package io.debezium.configserver.rest.model;

public class BadRequestResponse {

    public String message;

    public BadRequestResponse(String message) {
        this.message = message;
    }
}
