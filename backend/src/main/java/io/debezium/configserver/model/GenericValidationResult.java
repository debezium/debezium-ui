package io.debezium.configserver.model;

public class GenericValidationResult {

    public String message;
    public String trace;

    public GenericValidationResult() {
    }

    public GenericValidationResult(String message, String trace) {
        this.message = message;
        this.trace = trace;
    }
}
