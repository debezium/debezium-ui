package io.debezium.configserver;

import io.quarkus.test.junit.NativeImageTest;

@NativeImageTest
public class NativeMultipleKafkaConnectClustersIT extends MultipleKafkaConnectClustersIT {

    // Execute the same tests but in native mode.
}