package io.debezium.configserver;

import io.quarkus.test.junit.NativeImageTest;

@NativeImageTest
public class NativeCreatePostgresConnectorIT extends CreatePostgresConnectorIT {

    // Execute the same tests but in native mode.
}
