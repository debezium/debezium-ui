package io.debezium.configserver.util;

import io.quarkus.test.junit.QuarkusTestProfile;

import java.util.Collections;
import java.util.List;

public class PostgresInfrastructureTestProfile implements QuarkusTestProfile {
    @Override
    public List<TestResourceEntry> testResources() {
        return Collections.singletonList(new TestResourceEntry(PostgresInfrastructureTestResourceLifecycleManager.class));
    }
}
