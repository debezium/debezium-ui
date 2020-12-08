package io.debezium.configserver;

import io.quarkus.test.junit.NativeImageTest;

@NativeImageTest
public class NativeCreateAndDeleteMongoDbConnectorIT extends CreateAndDeleteMongoDbConnectorIT {

    // Execute the same tests but in native mode.
}
