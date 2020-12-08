package io.debezium.configserver.util;

import io.debezium.configserver.rest.ConnectorResource;
import io.quarkus.test.common.QuarkusTestResourceLifecycleManager;

import java.util.HashMap;
import java.util.Map;

public abstract class AbstractInfrastructureTestResourceLifecycleManager implements QuarkusTestResourceLifecycleManager {

    @Override
    public Map<String, String> start() {
        Map<String, String> config = new HashMap<>();
        config.put(
                ConnectorResource.PROPERTY_KAFKA_CONNECT_URI,
                "http://" + Infrastructure.getDebeziumContainer().getHost() + ":" + Infrastructure.getDebeziumContainer().getMappedPort(8083)
        );
        return config;
    }

    @Override
    public void stop() {
    }

    // optional
    @Override
    public void inject(Object testInstance) {
    }

    // optional
    @Override
    public int order() {
        return 0;
    }

}

