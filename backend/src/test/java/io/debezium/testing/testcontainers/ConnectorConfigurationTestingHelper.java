package io.debezium.testing.testcontainers;

import com.fasterxml.jackson.databind.node.ObjectNode;

public class ConnectorConfigurationTestingHelper {

    public static ObjectNode getConfig(ConnectorConfiguration config) {
        return config.getConfiguration();
    }

}
