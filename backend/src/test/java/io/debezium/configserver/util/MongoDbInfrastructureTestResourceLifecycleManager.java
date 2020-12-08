package io.debezium.configserver.util;

import java.util.Map;

public class MongoDbInfrastructureTestResourceLifecycleManager extends AbstractInfrastructureTestResourceLifecycleManager {

    @Override
    public Map<String, String> start() {
        Infrastructure.startContainers(Infrastructure.DATABASE.MONGODB);
        return super.start();
    }

}

