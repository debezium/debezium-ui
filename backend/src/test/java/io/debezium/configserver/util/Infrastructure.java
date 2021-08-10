/*
 * Copyright Debezium Authors.
 *
 * Licensed under the Apache Software License version 2.0, available at http://www.apache.org/licenses/LICENSE-2.0
 */
package io.debezium.configserver.util;

import io.debezium.connector.mongodb.MongoDbConnectorConfig;
import io.debezium.testing.testcontainers.ConnectorConfiguration;
import io.debezium.testing.testcontainers.DebeziumContainer;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.testcontainers.containers.GenericContainer;
import org.testcontainers.containers.KafkaContainer;
import org.testcontainers.containers.MongoDBContainer;
import org.testcontainers.containers.MySQLContainer;
import org.testcontainers.containers.Network;
import org.testcontainers.containers.PostgreSQLContainer;
import org.testcontainers.containers.output.Slf4jLogConsumer;
import org.testcontainers.lifecycle.Startables;
import org.testcontainers.utility.DockerImageName;

import java.time.Duration;
import java.util.function.Supplier;
import java.util.stream.Stream;

public class Infrastructure {

    public enum DATABASE {
        POSTGRES, MYSQL, SQLSERVER, MONGODB
    }

    private static final String DEBEZIUM_CONTAINER_VERSION = "1.6";
    private static final Logger LOGGER = LoggerFactory.getLogger(Infrastructure.class);

    private static final Network NETWORK = Network.newNetwork();

    private static final KafkaContainer KAFKA_CONTAINER =
            new KafkaContainer(DockerImageName.parse("confluentinc/cp-kafka:5.4.3"))
                    .withNetwork(NETWORK);

    private static final PostgreSQLContainer<?> POSTGRES_CONTAINER =
            new PostgreSQLContainer<>(DockerImageName.parse("debezium/example-postgres:" + DEBEZIUM_CONTAINER_VERSION).asCompatibleSubstituteFor("postgres"))
                    .withNetwork(NETWORK)
                    .withNetworkAliases("postgres");

    private static final MySQLContainer<?> MYSQL_CONTAINER =
            new MySQLContainer<>(DockerImageName.parse("debezium/example-mysql:" + DEBEZIUM_CONTAINER_VERSION).asCompatibleSubstituteFor("mysql"))
                    .withNetwork(NETWORK)
                    .withUsername("mysqluser")
                    .withPassword("mysqlpw")
                    .withEnv("MYSQL_ROOT_PASSWORD", "debezium")
                    .withNetworkAliases("mysql");

    private static final MongoDBContainer MONGODB_CONTAINER =
            new MongoDbContainer(DockerImageName.parse("mongo:3.6"))
                    .withNetwork(NETWORK)
                    .withNetworkAliases("mongodb");

    private static final DebeziumContainer DEBEZIUM_CONTAINER =
            new DebeziumContainer(DockerImageName.parse("debezium/connect:" + DEBEZIUM_CONTAINER_VERSION))
                    .withNetwork(NETWORK)
                    .withKafka(KAFKA_CONTAINER)
                    .withLogConsumer(new Slf4jLogConsumer(LOGGER))
                    .dependsOn(KAFKA_CONTAINER);

    public static Network getNetwork() {
        return NETWORK;
    }

    public static void startContainers(DATABASE database) {
        final GenericContainer<?> dbContainer;
        switch (database) {
            case POSTGRES:
                dbContainer = POSTGRES_CONTAINER;
                break;
            case MYSQL:
                dbContainer = MYSQL_CONTAINER;
                break;
            case MONGODB:
                dbContainer = MONGODB_CONTAINER;
                break;
            default:
                dbContainer = null;
                break;
        }

        Supplier<Stream<GenericContainer<?>>> containers = () -> Stream.of(KAFKA_CONTAINER, dbContainer, DEBEZIUM_CONTAINER);
        if ("true".equals(System.getenv("CI"))) {
            containers.get().forEach(container -> container.withStartupTimeout(Duration.ofSeconds(90)));
        }
        Startables.deepStart(containers.get()).join();
    }

    public static KafkaContainer getKafkaContainer() {
        return KAFKA_CONTAINER;
    }

    public static DebeziumContainer getDebeziumContainer() {
        return DEBEZIUM_CONTAINER;
    }

    public static PostgreSQLContainer<?> getPostgresContainer() {
        return POSTGRES_CONTAINER;
    }

    public static MySQLContainer<?> getMySqlContainer() {
        return MYSQL_CONTAINER;
    }

    public static MongoDBContainer getMongoDbContainer() {
        return MONGODB_CONTAINER;
    }

    public static ConnectorConfiguration getPostgresConnectorConfiguration(int id, String... options) {
        final ConnectorConfiguration config = ConnectorConfiguration.forJdbcContainer(POSTGRES_CONTAINER)
                .with("snapshot.mode", "never") // temporarily disable snapshot mode globally until we can check if connectors inside testcontainers are in SNAPSHOT or STREAMING mode (wait for snapshot finished!)
                .with("database.server.name", "dbserver" + id)
                .with("slot.name", "debezium_" + id);

        if (options != null && options.length > 0) {
            for (int i = 0; i < options.length; i += 2) {
                config.with(options[i], options[i + 1]);
            }
        }
        return config;
    }

    public static ConnectorConfiguration getMySqlConnectorConfiguration(int id, String... options) {
        final ConnectorConfiguration config = ConnectorConfiguration.forJdbcContainer(MYSQL_CONTAINER)
                .with("snapshot.mode", "never") // temporarily disable snapshot mode globally until we can check if connectors inside testcontainers are in SNAPSHOT or STREAMING mode (wait for snapshot finished!)
                .with("database.server.name", "dbserver" + id)
                .with("database.history.kafka.bootstrap.servers", "kafka:9092")
                .with("database.history.kafka.topic", "dbhistory.inventory")
                .with("server.id", "debezium_" + (5555 + id - 1));

        if (options != null && options.length > 0) {
            for (int i = 0; i < options.length; i += 2) {
                config.with(options[i], options[i + 1]);
            }
        }
        return config;
    }

    public static ConnectorConfiguration getMongoDbConnectorConfiguration(int id, String... options) {
        final ConnectorConfiguration config = ConnectorConfiguration.forMongoDbContainer(MONGODB_CONTAINER)
                .with("snapshot.mode", "never") // temporarily disable snapshot mode globally until we can check if connectors inside testcontainers are in SNAPSHOT or STREAMING mode (wait for snapshot finished!)
                .with(MongoDbConnectorConfig.USER.name(), "debezium")
                .with(MongoDbConnectorConfig.PASSWORD.name(), "dbz")
                .with(MongoDbConnectorConfig.LOGICAL_NAME.name(), "mongo" + id);

        if (options != null && options.length > 0) {
            for (int i = 0; i < options.length; i += 2) {
                config.with(options[i], options[i + 1]);
            }
        }
        return config;
    }

}
