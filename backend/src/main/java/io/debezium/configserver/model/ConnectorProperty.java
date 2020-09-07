package io.debezium.configserver.model;

import java.util.List;

public class ConnectorProperty {

    public enum Type {
        BOOLEAN, STRING, INT, SHORT, LONG, DOUBLE, LIST, CLASS, PASSWORD;
    }

    public enum Category {
        GENERIC, GENERIC_ADVANCED, CONNECTION, CONNECTION_ADVANCED, CONNECTOR, CONNECTOR_ADVANCED, ADVANCED
    }

    public String name;
    public String displayName;
    public String description;
    public Type type;
    public Object defaultValue;
    public boolean isMandatory;
    public Category category;
    public List<String> allowedValues;

    public ConnectorProperty() {
    }

    public ConnectorProperty(String name, String displayName, String description, Type type, Object defaultValue, boolean isMandatory, Category category, List<String> allowedValues) {
        this.name = name;
        this.displayName = displayName;
        this.description = description;
        this.type = type;
        this.defaultValue = defaultValue instanceof Class ? ((Class<?>)defaultValue).getName() : defaultValue;
        this.isMandatory = isMandatory;
        this.category = category;
        this.allowedValues = allowedValues;
    }

}
