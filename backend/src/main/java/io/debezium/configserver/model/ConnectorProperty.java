package io.debezium.configserver.model;

public class ConnectorProperty {

    public String name;
    public String displayName;
    public String description;
    public Type type;
    public Object defaultValue;

    public ConnectorProperty() {
    }

    public ConnectorProperty(String name, String displayName, String description, Type type, Object defaultValue) {
        this.name = name;
        this.displayName = displayName;
        this.description = description;
        this.type = type;
        this.defaultValue = defaultValue instanceof Class ? ((Class<?>)defaultValue).getName() : defaultValue;
    }

    public static enum Type {
        BOOLEAN, STRING, INT, SHORT, LONG, DOUBLE, LIST, CLASS, PASSWORD;
    }
}
