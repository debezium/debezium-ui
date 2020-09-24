package io.debezium.configserver.model;

import java.util.Map;
import java.util.stream.Collectors;

public class ConnectConnectorConfigResponse {

    public ConnectConnectorConfigResponse() {
    }

    private String name;

    public ConnectConnectorConfigResponse(String name) {
        this.name = name;
    }

    public ConnectConnectorConfigResponse(String name, Map<String, ?> config) {
        this.name = name;
        setConfig(config);
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    private Map<String, String> config;

    public Map<String, String> getConfig() {
        return config;
    }

    public void setConfig(Map<String, ?> config) {
        this.config = config.entrySet().stream()
                .collect(Collectors.toMap(Map.Entry::getKey, entry -> String.valueOf(entry.getValue())));
    }
}
