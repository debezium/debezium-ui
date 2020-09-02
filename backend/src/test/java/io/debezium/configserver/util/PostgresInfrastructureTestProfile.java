package io.debezium.configserver.util;

import io.quarkus.test.junit.QuarkusTestProfile;

import java.util.ArrayList;
import java.util.List;


public class PostgresInfrastructureTestProfile implements QuarkusTestProfile {
    @Override
    public List<TestResourceEntry> testResources() {
        ArrayList<TestResourceEntry> resourceEntries = new ArrayList<>(1) {};
        resourceEntries.add(new TestResourceEntry(PostgresInfrastructureTestResourceLifecycleManager.class));
        return resourceEntries;
    }
}


