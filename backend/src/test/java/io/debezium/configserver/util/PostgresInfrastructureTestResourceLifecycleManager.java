package io.debezium.configserver.util;

import java.util.Map;

public class PostgresInfrastructureTestResourceLifecycleManager extends AbstractInfrastructureTestResourceLifecycleManager {

    @Override
    public Map<String, String> start() {
        Infrastructure.startContainers(Infrastructure.DATABASE.POSTGRES);
        return super.start();
    }

}

