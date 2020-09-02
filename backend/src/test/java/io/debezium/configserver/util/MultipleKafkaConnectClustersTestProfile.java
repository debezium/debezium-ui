package io.debezium.configserver.util;

import io.debezium.configserver.rest.ConnectorResource;
import io.quarkus.test.junit.QuarkusTestProfile;

import java.util.HashMap;
import java.util.Map;

public class MultipleKafkaConnectClustersTestProfile implements QuarkusTestProfile {
    /**
     * Returns additional config to be applied to the test. This
     * will override any existing config (including in application.properties),
     * however existing config will be merged with this (i.e. application.properties
     * config will still take effect, unless a specific config key has been overridden).
     */
    @Override
    public Map<String, String> getConfigOverrides() {
        Map<String, String> config = new HashMap<>();
        config.put(
                ConnectorResource.PROPERTY_KAFKA_CONNECT_URI,
                "http://localhost:1234, http://localhorst:4567"
        );
        return config;
    }
}


