package io.debezium.configserver.model;

public class PropertyValidationResult {

    public String property;
    public String message;

    public PropertyValidationResult() {
    }

    public PropertyValidationResult(String property, String message) {
        this.property = property;
        this.message = message;
    }
}
