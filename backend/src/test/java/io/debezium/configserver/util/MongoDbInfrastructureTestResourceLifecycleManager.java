/*
 * Copyright Debezium Authors.
 *
 * Licensed under the Apache Software License version 2.0, available at http://www.apache.org/licenses/LICENSE-2.0
 */
package io.debezium.configserver.util;

import io.debezium.testing.testcontainers.util.DockerUtils;
import org.testcontainers.utility.MountableFile;

import java.io.IOException;
import java.util.Map;

public class MongoDbInfrastructureTestResourceLifecycleManager extends AbstractInfrastructureTestResourceLifecycleManager {

    @Override
    public Map<String, String> start() {
        DockerUtils.enableFakeDnsIfRequired();
        Infrastructure.startContainers(Infrastructure.DATABASE.MONGODB);
        initialize();
        return super.start();
    }

    private void initialize() {
        var mongo = Infrastructure.getMongoDbContainer();
        // TODO: this should be mostly moved to MongoDbContainer
        mongo.tryPrimary().ifPresent(container -> {
            container.copyFileToContainer(MountableFile.forClasspathResource(
                    "/initialize-mongo-single.js"), "/docker-entrypoint-initdb.d/"
            );

            var mongoCommand = "mongo " +
                    "--quiet " +
                    "--host " + container.getNamedAddress().getHost() + " " +
                    "--port " + container.getNamedAddress().getPort() + " " +
                    "/docker-entrypoint-initdb.d/initialize-mongo-single.js";

            try {
                container.execInContainer("sh", "-c", "mongosh " + mongoCommand);
            }
            catch (IOException | InterruptedException e) {
                throw new IllegalStateException(e);
            }
        });
    }

    @Override
    public void stop() {
        Infrastructure.stopContainers(Infrastructure.DATABASE.MONGODB);
        DockerUtils.disableFakeDns();
        super.stop();
    }
}

