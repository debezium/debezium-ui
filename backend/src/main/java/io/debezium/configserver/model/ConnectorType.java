package io.debezium.configserver.model;

import java.util.List;

public class ConnectorType {

    public String id;
    public String className;
    public String displayName;
    public String version;
    public boolean enabled;
    public List<ConnectorProperty> properties;

    public ConnectorType() {
    }

    public ConnectorType(String id, String className, String displayName, String version, boolean enabled, List<ConnectorProperty> properties) {
        this.id = id;
        this.className = className;
        this.displayName = displayName;
        this.version = version;
        this.enabled = enabled;
        this.properties = properties;
    }
}
