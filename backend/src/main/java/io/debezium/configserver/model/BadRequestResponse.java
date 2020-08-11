package io.debezium.configserver.model;

public class BadRequestResponse {

    public String message;

    public BadRequestResponse(String message) {
        this.message = message;
    }
}
