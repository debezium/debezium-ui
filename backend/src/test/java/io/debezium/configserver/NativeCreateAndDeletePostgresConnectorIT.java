package io.debezium.configserver;

import io.quarkus.test.junit.NativeImageTest;

@NativeImageTest
public class NativeCreateAndDeletePostgresConnectorIT extends CreateAndDeletePostgresConnectorIT {

    // Execute the same tests but in native mode.
}
