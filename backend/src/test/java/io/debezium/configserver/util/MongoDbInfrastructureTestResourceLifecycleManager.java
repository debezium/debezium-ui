/*
 * Copyright Debezium Authors.
 *
 * Licensed under the Apache Software License version 2.0, available at http://www.apache.org/licenses/LICENSE-2.0
 */
package io.debezium.configserver.util;

import io.debezium.testing.testcontainers.util.DockerUtils;
import org.testcontainers.utility.MountableFile;

import java.util.Map;

public class MongoDbInfrastructureTestResourceLifecycleManager extends AbstractInfrastructureTestResourceLifecycleManager {

    public static final MountableFile INIT_SCRIPT_RESOURCE =
            MountableFile.forClasspathResource("/initialize-mongo-single.js");
    public static final String INIT_SCRIPT_PATH =
            "/docker-entrypoint-initdb.d/initialize-mongo-single.js";

    @Override
    public Map<String, String> start() {
        DockerUtils.enableFakeDnsIfRequired();
        Infrastructure.startContainers(Infrastructure.DATABASE.MONGODB);
        Infrastructure.getMongoDbContainer().execMongoScript(INIT_SCRIPT_RESOURCE, INIT_SCRIPT_PATH);
        return super.start();
    }

    @Override
    public void stop() {
        Infrastructure.stopContainers(Infrastructure.DATABASE.MONGODB);
        DockerUtils.disableFakeDns();
        super.stop();
    }
}

