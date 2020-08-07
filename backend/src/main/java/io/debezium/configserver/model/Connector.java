package io.debezium.configserver.model;

public class Connector {

    public String className;
    public String displayName;
    public String version;
    public boolean enabled;

    public Connector() {
    }

    public Connector(String className, String displayName, String version, boolean enabled) {
        this.className = className;
        this.displayName = displayName;
        this.version = version;
        this.enabled = enabled;
    }
}
