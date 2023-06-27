/*
 * Copyright Debezium Authors.
 *
 * Licensed under the Apache Software License version 2.0, available at http://www.apache.org/licenses/LICENSE-2.0
 */
package io.debezium.configserver.util;

import io.debezium.connector.mongodb.MongoDbConnectorConfig;

import io.debezium.testing.testcontainers.Connector;
import io.debezium.testing.testcontainers.ConnectorConfiguration;
import io.debezium.testing.testcontainers.ConnectorResolver;
import io.debezium.testing.testcontainers.DebeziumContainer;
import io.debezium.testing.testcontainers.MongoDbReplicaSet;
import io.debezium.testing.testcontainers.util.MoreStartables;
import org.awaitility.Awaitility;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.testcontainers.containers.GenericContainer;
import org.testcontainers.containers.JdbcDatabaseContainer;
import org.testcontainers.containers.MSSQLServerContainer;
import org.testcontainers.containers.MySQLContainer;
import org.testcontainers.containers.Network;
import org.testcontainers.containers.PostgreSQLContainer;
import org.testcontainers.containers.output.Slf4jLogConsumer;
import org.testcontainers.containers.startupcheck.MinimumDurationRunningStartupCheckStrategy;
import org.testcontainers.lifecycle.Startable;
import org.testcontainers.utility.DockerImageName;

import java.time.Duration;
import java.util.concurrent.TimeUnit;
import java.util.List;
import java.util.function.Supplier;
import java.util.stream.Stream;

public class Infrastructure {

    // Those versions are managed in the debezium-ui-parent pom.xml!
    private static final String DEBEZIUM_EXAMPLES_CONTAINER_VERSION;
    private static final String DEBEZIUM_CONNECT_CONTAINER_VERSION;
    private static final String SQLSERVER_CONTAINER_VERSION;
    private static final String MONGODB_CONTAINER_VERSION;

    static {
        final PropertiesReader debeziumPropertiesReader = PropertiesReader.debeziumPropertiesReader();
        // Those versions are managed in the debezium-ui-parent pom.xml!
        DEBEZIUM_EXAMPLES_CONTAINER_VERSION = debeziumPropertiesReader.getProperty("debezium.examples.container.version");
        DEBEZIUM_CONNECT_CONTAINER_VERSION = debeziumPropertiesReader.getProperty("debezium.connect.container.version");
        SQLSERVER_CONTAINER_VERSION = debeziumPropertiesReader.getProperty("sqlserver.container.version");
        MONGODB_CONTAINER_VERSION = debeziumPropertiesReader.getProperty("mongodb.container.version");
    }

    private static final String KAFKA_HOSTNAME = "kafka-dbz-ui";

    public enum DATABASE {
        POSTGRES, MYSQL, SQLSERVER, MONGODB, ORACLE, NONE
    }

    private static final Logger LOGGER = LoggerFactory.getLogger(Infrastructure.class);

    private static final Network NETWORK = Network.newNetwork();

    private static final GenericContainer<?> KAFKA_CONTAINER =
            new GenericContainer<>(DockerImageName.parse("quay.io/debezium/kafka:" + DEBEZIUM_EXAMPLES_CONTAINER_VERSION)
                    .asCompatibleSubstituteFor("kafka"))
                    .withNetworkAliases(KAFKA_HOSTNAME)
                    .withNetwork(NETWORK)
                    .withEnv("KAFKA_CONTROLLER_QUORUM_VOTERS", "1@" + KAFKA_HOSTNAME + ":9093")
                    .withEnv("CLUSTER_ID", "5Yr1SIgYQz-b-dgRabWx4g")
                    .withEnv("NODE_ID", "1");

    private static final PostgreSQLContainer<?> POSTGRES_CONTAINER =
            new PostgreSQLContainer<>(DockerImageName.parse("quay.io/debezium/example-postgres:" + DEBEZIUM_EXAMPLES_CONTAINER_VERSION)
                    .asCompatibleSubstituteFor("postgres"))
                    .withNetwork(NETWORK)
                    .withNetworkAliases("postgres");

    private static final MySQLContainer<?> MYSQL_CONTAINER =
            new MySQLContainer<>(DockerImageName.parse("quay.io/debezium/example-mysql:" + DEBEZIUM_EXAMPLES_CONTAINER_VERSION)
                    .asCompatibleSubstituteFor("mysql"))
                    .withNetwork(NETWORK)
                    .withUsername("mysqluser")
                    .withPassword("mysqlpw")
                    .withEnv("MYSQL_ROOT_PASSWORD", "debezium")
                    .withNetworkAliases("mysql");

    private static final MongoDbReplicaSet MONGODB_REPLICA =
            MongoDbReplicaSet.replicaSet()
                .name("rs0")
                .memberCount(1)
                .network(NETWORK)
                .imageName(DockerImageName.parse("mongo:" + MONGODB_CONTAINER_VERSION))
                .build();

    private static final MSSQLServerContainer<?> SQL_SERVER_CONTAINER =
            new MSSQLServerContainer<>(DockerImageName.parse("mcr.microsoft.com/mssql/server:" + SQLSERVER_CONTAINER_VERSION))
                    .withNetwork(NETWORK)
                    .withNetworkAliases("sqlserver")
                    .withEnv("SA_PASSWORD", "Password!")
                    .withEnv("MSSQL_PID", "Standard")
                    .withEnv("MSSQL_AGENT_ENABLED", "true")
                    .withPassword("Password!")
                    .withStartupCheckStrategy(new MinimumDurationRunningStartupCheckStrategy(Duration.ofSeconds(5)))
                    .withInitScript("/initialize-sqlserver-database.sql")
                    .acceptLicense();

    private static final DebeziumContainer DEBEZIUM_CONTAINER =
            new DebeziumContainer("quay.io/debezium/connect:" + DEBEZIUM_CONNECT_CONTAINER_VERSION)
                .withEnv("ENABLE_DEBEZIUM_SCRIPTING", "true")
                .withEnv("CONNECT_REST_EXTENSION_CLASSES", "io.debezium.kcrestextension.DebeziumConnectRestExtension")
                .withNetwork(NETWORK)
                .withKafka(KAFKA_CONTAINER.getNetwork(), KAFKA_HOSTNAME + ":9092")
                .withLogConsumer(new Slf4jLogConsumer(LOGGER))
                .dependsOn(KAFKA_CONTAINER)
                .withEnv("ENABLE_JOLOKIA", "true")
                .withExposedPorts(8083, 8778);


    public static Network getNetwork() {
        return NETWORK;
    }

    private static Supplier<Stream<Startable>> getContainers(DATABASE database) {
        final Startable dbStartable;
        switch (database) {
            case POSTGRES:
                dbStartable = POSTGRES_CONTAINER;
                break;
            case MYSQL:
                dbStartable = MYSQL_CONTAINER;
                break;
            case MONGODB:
                dbStartable = MONGODB_REPLICA;
                break;
            case SQLSERVER:
                dbStartable = SQL_SERVER_CONTAINER;
                break;
            case NONE:
            default:
                dbStartable = null;
                break;
        }

        final Supplier<Stream<Startable>> containers;
        if (null != dbStartable) {
            containers = () -> Stream.of(KAFKA_CONTAINER, dbStartable, DEBEZIUM_CONTAINER);
        }
        else {
            containers = () -> Stream.of(KAFKA_CONTAINER, DEBEZIUM_CONTAINER);
        }
        return containers;
    }

    public static void stopContainers(DATABASE database) {
        MoreStartables.deepStopSync(getContainers(database).get());
    }

    public static void startContainers(DATABASE database) {
        final Supplier<Stream<Startable>> containers = getContainers(database);

        if ("true".equals(System.getenv("CI"))) {
            containers.get().forEach(container -> {
                if (container instanceof GenericContainer<?>) {
                    ((GenericContainer<?>) container).withStartupTimeout(Duration.ofSeconds(90));
                }
                if (container instanceof MongoDbReplicaSet) {
                    // This could be added to MongoDbReplicaSet
                    ((MongoDbReplicaSet) container).getMembers().forEach(member -> {
                        member.withStartupTimeout(Duration.ofSeconds(90));
                    });
                }
            });
        }

        MoreStartables.deepStartSync(containers.get());
    }

    public static GenericContainer getKafkaContainer() {
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

    public static MongoDbReplicaSet getMongoDbContainer() {
        return MONGODB_REPLICA;
    }

    public static MSSQLServerContainer<?> getSqlServerContainer() {
        return SQL_SERVER_CONTAINER;
    }

    public static ConnectorConfiguration getPostgresConnectorConfiguration(int id, String... options) {
        final ConnectorConfiguration config = ConnectorConfiguration.forJdbcContainer(POSTGRES_CONTAINER)
                .with("snapshot.mode", "never") // temporarily disable snapshot mode globally until we can check if connectors inside testcontainers are in SNAPSHOT or STREAMING mode (wait for snapshot finished!)
                .with("topic.prefix", "dbserver" + id)
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
                .with("database.user", "debezium")
                .with("database.password", "dbz")
                .with("snapshot.mode", "never") // temporarily disable snapshot mode globally until we can check if connectors inside testcontainers are in SNAPSHOT or STREAMING mode (wait for snapshot finished!)
                .with("topic.prefix", "dbserver" + id)
                .with("schema.history.internal.kafka.bootstrap.servers", KAFKA_HOSTNAME + ":9092")
                .with("schema.history.internal.kafka.topic", "dbhistory.inventory")
                .with("database.server.id", Long.valueOf(5555 + id - 1));

        if (options != null && options.length > 0) {
            for (int i = 0; i < options.length; i += 2) {
                config.with(options[i], options[i + 1]);
            }
        }
        return config;
    }

    public static ConnectorConfiguration getMongoDbConnectorConfiguration(int id, String... options) {
        final ConnectorConfiguration config = ConnectorConfiguration.forMongoDbReplicaSet(MONGODB_REPLICA)
                .with("snapshot.mode", "never") // temporarily disable snapshot mode globally until we can check if connectors inside testcontainers are in SNAPSHOT or STREAMING mode (wait for snapshot finished!)
                .with(MongoDbConnectorConfig.USER.name(), "debezium")
                .with(MongoDbConnectorConfig.PASSWORD.name(), "dbz")
                .with(MongoDbConnectorConfig.TOPIC_PREFIX.name(), "mongo" + id);

        if (options != null && options.length > 0) {
            for (int i = 0; i < options.length; i += 2) {
                config.with(options[i], options[i + 1]);
            }
        }
        return config;
    }

    public static void waitForConnectorTaskStatus(String connectorName, int taskNumber, Connector.State state) {
        Awaitility.await()
                // this needs to be set to at least a minimum of ~65-70 seconds because PostgreSQL now
                // retries on certain failure conditions with a 10s between them.
                .atMost(120, TimeUnit.SECONDS)
                .until(() -> Infrastructure.getDebeziumContainer().getConnectorTaskState(connectorName, taskNumber) == state);
    }

    public static ConnectorConfiguration getSqlServerConnectorConfiguration(int id, String... options) {
        final ConnectorConfiguration config = forJdbcContainerWithNoDatabaseNameSupport(SQL_SERVER_CONTAINER)
                .with("database.user", "sa")
                .with("database.password", "Password!")
                .with("schema.history.internal.kafka.bootstrap.servers", KAFKA_HOSTNAME + ":9092")
                .with("schema.history.internal.kafka.topic", "dbhistory.inventory")
                .with("snapshot.mode", "initial")
                .with("topic.prefix", "dbserver" + id)
                .with("database.encrypt", false);

        if (options != null && options.length > 0) {
            for (int i = 0; i < options.length; i += 2) {
                config.with(options[i], options[i + 1]);
            }
        }
        return config;
    }

    private static final String HOSTNAME = "database.hostname";
    private static final String PORT = "database.port";
    private static final String USER = "database.user";
    private static final String PASSWORD = "database.password";
    private static final String CONNECTOR = "connector.class";

    /**
     * Creates a {@link ConnectorConfiguration} object for databases where test containers does not support
     * the call to {@link JdbcDatabaseContainer#getDatabaseName()}.
     *
     * todo: this can be replaced with debezium-testing-testcontainers:2.0.0
     *
     * @param jdbcDatabaseContainer the container
     * @return the connector configuration
     */
    private static ConnectorConfiguration forJdbcContainerWithNoDatabaseNameSupport(JdbcDatabaseContainer<?> jdbcDatabaseContainer) {
        final ConnectorConfiguration configuration = ConnectorConfiguration.create();

        configuration.with(HOSTNAME, jdbcDatabaseContainer.getContainerInfo().getConfig().getHostName());

        final List<Integer> exposedPorts = jdbcDatabaseContainer.getExposedPorts();
        configuration.with(PORT, exposedPorts.get(0));

        configuration.with(USER, jdbcDatabaseContainer.getUsername());
        configuration.with(PASSWORD, jdbcDatabaseContainer.getPassword());

        final String driverClassName = jdbcDatabaseContainer.getDriverClassName();
        configuration.with(CONNECTOR, ConnectorResolver.getConnectorByJdbcDriver(driverClassName));

        return configuration;
    }
}
