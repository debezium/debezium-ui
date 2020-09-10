package io.debezium.configserver.service.postgres;

import java.sql.SQLException;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;

import io.debezium.configserver.model.AdditionalPropertyMetadata;
import io.debezium.configserver.model.ConnectorProperty;
import io.debezium.heartbeat.DatabaseHeartbeatImpl;
import io.debezium.heartbeat.Heartbeat;
import io.debezium.jdbc.TemporalPrecisionMode;
import org.apache.kafka.connect.source.SourceConnector;

import io.debezium.DebeziumException;
import io.debezium.config.Configuration;
import io.debezium.configserver.model.DataCollection;
import io.debezium.configserver.model.FilterValidationResult;
import io.debezium.configserver.model.PropertiesValidationResult;
import io.debezium.configserver.model.PropertiesValidationResult.Status;
import io.debezium.configserver.service.ConnectorIntegratorBase;
import io.debezium.connector.postgresql.PostgresConnector;
import io.debezium.connector.postgresql.PostgresConnectorConfig;
import io.debezium.connector.postgresql.connection.PostgresConnection;
import io.debezium.relational.TableId;

// TODO: This will live in the PG connector module eventually
public class PostgresConnectorIntegrator extends ConnectorIntegratorBase {

    private static final Map<String, AdditionalPropertyMetadata> POSTGRES_PROPERTIES = new LinkedHashMap<>();
    static {
        // Connection properties
        POSTGRES_PROPERTIES.put(PostgresConnectorConfig.SERVER_NAME.name(), new AdditionalPropertyMetadata(true, ConnectorProperty.Category.CONNECTION));
        POSTGRES_PROPERTIES.put(PostgresConnectorConfig.HOSTNAME.name(), new AdditionalPropertyMetadata(true, ConnectorProperty.Category.CONNECTION));
        POSTGRES_PROPERTIES.put(PostgresConnectorConfig.PORT.name(), new AdditionalPropertyMetadata(false, ConnectorProperty.Category.CONNECTION));
        POSTGRES_PROPERTIES.put(PostgresConnectorConfig.USER.name(), new AdditionalPropertyMetadata(true, ConnectorProperty.Category.CONNECTION));
        POSTGRES_PROPERTIES.put(PostgresConnectorConfig.PASSWORD.name(), new AdditionalPropertyMetadata(false, ConnectorProperty.Category.CONNECTION));
        POSTGRES_PROPERTIES.put(PostgresConnectorConfig.DATABASE_NAME.name(), new AdditionalPropertyMetadata(true, ConnectorProperty.Category.CONNECTION));

        // Connection properties - advanced section
        POSTGRES_PROPERTIES.put(PostgresConnectorConfig.SSL_MODE.name(), new AdditionalPropertyMetadata(false, ConnectorProperty.Category.CONNECTION_ADVANCED, enumArrayToList(PostgresConnectorConfig.SecureConnectionMode.values())));
        POSTGRES_PROPERTIES.put(PostgresConnectorConfig.SSL_CLIENT_CERT.name(), new AdditionalPropertyMetadata(false, ConnectorProperty.Category.CONNECTION_ADVANCED));
        POSTGRES_PROPERTIES.put(PostgresConnectorConfig.SSL_CLIENT_KEY_PASSWORD.name(), new AdditionalPropertyMetadata(false, ConnectorProperty.Category.CONNECTION_ADVANCED));
        POSTGRES_PROPERTIES.put(PostgresConnectorConfig.SSL_ROOT_CERT.name(), new AdditionalPropertyMetadata(false, ConnectorProperty.Category.CONNECTION_ADVANCED));
        POSTGRES_PROPERTIES.put(PostgresConnectorConfig.SSL_CLIENT_KEY.name(), new AdditionalPropertyMetadata(false, ConnectorProperty.Category.CONNECTION_ADVANCED));
        POSTGRES_PROPERTIES.put(PostgresConnectorConfig.SSL_SOCKET_FACTORY.name(), new AdditionalPropertyMetadata(false, ConnectorProperty.Category.CONNECTION_ADVANCED));
        POSTGRES_PROPERTIES.put(PostgresConnectorConfig.TCP_KEEPALIVE.name(), new AdditionalPropertyMetadata(false, ConnectorProperty.Category.CONNECTION_ADVANCED));
        POSTGRES_PROPERTIES.put(PostgresConnectorConfig.ON_CONNECT_STATEMENTS.name(), new AdditionalPropertyMetadata(false, ConnectorProperty.Category.CONNECTION_ADVANCED));

        // Connection properties - advanced section: Replication properties
        POSTGRES_PROPERTIES.put(PostgresConnectorConfig.PLUGIN_NAME.name(), new AdditionalPropertyMetadata(false, ConnectorProperty.Category.CONNECTION_ADVANCED_REPLICATION, enumArrayToList(PostgresConnectorConfig.LogicalDecoder.values())));
        POSTGRES_PROPERTIES.put(PostgresConnectorConfig.SLOT_NAME.name(), new AdditionalPropertyMetadata(false, ConnectorProperty.Category.CONNECTION_ADVANCED_REPLICATION));
        POSTGRES_PROPERTIES.put(PostgresConnectorConfig.STREAM_PARAMS.name(), new AdditionalPropertyMetadata(false, ConnectorProperty.Category.CONNECTION_ADVANCED_REPLICATION));
        POSTGRES_PROPERTIES.put(PostgresConnectorConfig.DROP_SLOT_ON_STOP.name(), new AdditionalPropertyMetadata(false, ConnectorProperty.Category.CONNECTION_ADVANCED_REPLICATION));
        POSTGRES_PROPERTIES.put(PostgresConnectorConfig.MAX_RETRIES.name(), new AdditionalPropertyMetadata(false, ConnectorProperty.Category.CONNECTION_ADVANCED_REPLICATION));
        POSTGRES_PROPERTIES.put(PostgresConnectorConfig.RETRY_DELAY_MS.name(), new AdditionalPropertyMetadata(false, ConnectorProperty.Category.CONNECTION_ADVANCED_REPLICATION));
        // additional properties added to UI Requirements document section for Replication properties:
        POSTGRES_PROPERTIES.put(PostgresConnectorConfig.STATUS_UPDATE_INTERVAL_MS.name(), new AdditionalPropertyMetadata(false, ConnectorProperty.Category.CONNECTION_ADVANCED_REPLICATION));
        POSTGRES_PROPERTIES.put(PostgresConnectorConfig.XMIN_FETCH_INTERVAL.name(), new AdditionalPropertyMetadata(false, ConnectorProperty.Category.CONNECTION_ADVANCED_REPLICATION));

        // Connection properties - advanced section: publication properties
        POSTGRES_PROPERTIES.put(PostgresConnectorConfig.PUBLICATION_NAME.name(), new AdditionalPropertyMetadata(false, ConnectorProperty.Category.CONNECTION_ADVANCED_PUBLICATION));
        POSTGRES_PROPERTIES.put(PostgresConnectorConfig.PUBLICATION_AUTOCREATE_MODE.name(), new AdditionalPropertyMetadata(false, ConnectorProperty.Category.CONNECTION_ADVANCED_PUBLICATION, enumArrayToList(PostgresConnectorConfig.AutoCreateMode.values())));

        // Filter properties
        POSTGRES_PROPERTIES.put(PostgresConnectorConfig.SCHEMA_INCLUDE_LIST.name(), new AdditionalPropertyMetadata(false, ConnectorProperty.Category.FILTERS));
        POSTGRES_PROPERTIES.put(PostgresConnectorConfig.SCHEMA_EXCLUDE_LIST.name(), new AdditionalPropertyMetadata(false, ConnectorProperty.Category.FILTERS));
        POSTGRES_PROPERTIES.put(PostgresConnectorConfig.TABLE_INCLUDE_LIST.name(), new AdditionalPropertyMetadata(false, ConnectorProperty.Category.FILTERS));
        POSTGRES_PROPERTIES.put(PostgresConnectorConfig.TABLE_EXCLUDE_LIST.name(), new AdditionalPropertyMetadata(false, ConnectorProperty.Category.FILTERS));
        POSTGRES_PROPERTIES.put(PostgresConnectorConfig.COLUMN_INCLUDE_LIST.name(), new AdditionalPropertyMetadata(false, ConnectorProperty.Category.FILTERS));
        POSTGRES_PROPERTIES.put(PostgresConnectorConfig.COLUMN_EXCLUDE_LIST.name(), new AdditionalPropertyMetadata(false, ConnectorProperty.Category.FILTERS));
        POSTGRES_PROPERTIES.put(PostgresConnectorConfig.TABLE_IGNORE_BUILTIN.name(), new AdditionalPropertyMetadata(false, ConnectorProperty.Category.FILTERS));

        // Snapshot properties
        POSTGRES_PROPERTIES.put(PostgresConnectorConfig.SNAPSHOT_MODE.name(), new AdditionalPropertyMetadata(false, ConnectorProperty.Category.CONNECTOR_SNAPSHOT, enumArrayToList(PostgresConnectorConfig.SnapshotMode.values())));
        POSTGRES_PROPERTIES.put(PostgresConnectorConfig.SNAPSHOT_FETCH_SIZE.name(), new AdditionalPropertyMetadata(false, ConnectorProperty.Category.CONNECTOR_SNAPSHOT));
        POSTGRES_PROPERTIES.put(PostgresConnectorConfig.SNAPSHOT_DELAY_MS.name(), new AdditionalPropertyMetadata(false, ConnectorProperty.Category.CONNECTOR_SNAPSHOT));
        POSTGRES_PROPERTIES.put(PostgresConnectorConfig.SNAPSHOT_LOCK_TIMEOUT_MS.name(), new AdditionalPropertyMetadata(false, ConnectorProperty.Category.CONNECTOR_SNAPSHOT));
        POSTGRES_PROPERTIES.put(PostgresConnectorConfig.SNAPSHOT_SELECT_STATEMENT_OVERRIDES_BY_TABLE.name(), new AdditionalPropertyMetadata(false, ConnectorProperty.Category.CONNECTOR_SNAPSHOT));
        POSTGRES_PROPERTIES.put(PostgresConnectorConfig.SNAPSHOT_MODE_CLASS.name(), new AdditionalPropertyMetadata(false, ConnectorProperty.Category.CONNECTOR_SNAPSHOT));

        // Data type mapping properties:
        POSTGRES_PROPERTIES.put(PostgresConnectorConfig.TOMBSTONES_ON_DELETE.name(), new AdditionalPropertyMetadata(false, ConnectorProperty.Category.CONNECTOR));
        POSTGRES_PROPERTIES.put(PostgresConnectorConfig.DECIMAL_HANDLING_MODE.name(), new AdditionalPropertyMetadata(false, ConnectorProperty.Category.CONNECTOR, enumArrayToList(PostgresConnectorConfig.DecimalHandlingMode.values())));
        POSTGRES_PROPERTIES.put(PostgresConnectorConfig.TIME_PRECISION_MODE.name(), new AdditionalPropertyMetadata(false, ConnectorProperty.Category.CONNECTOR, enumArrayToList(TemporalPrecisionMode.values())));
        POSTGRES_PROPERTIES.put(PostgresConnectorConfig.INTERVAL_HANDLING_MODE.name(), new AdditionalPropertyMetadata(false, ConnectorProperty.Category.CONNECTOR, enumArrayToList(PostgresConnectorConfig.IntervalHandlingMode.values())));
        POSTGRES_PROPERTIES.put(PostgresConnectorConfig.BINARY_HANDLING_MODE.name(), new AdditionalPropertyMetadata(false, ConnectorProperty.Category.CONNECTOR, enumArrayToList(PostgresConnectorConfig.BinaryHandlingMode.values())));
        POSTGRES_PROPERTIES.put(PostgresConnectorConfig.HSTORE_HANDLING_MODE.name(), new AdditionalPropertyMetadata(false, ConnectorProperty.Category.CONNECTOR, enumArrayToList(PostgresConnectorConfig.HStoreHandlingMode.values())));

        // Heartbeat properties
        POSTGRES_PROPERTIES.put(Heartbeat.HEARTBEAT_INTERVAL.name(), new AdditionalPropertyMetadata(false, ConnectorProperty.Category.ADVANCED_HEARTBEAT));
        POSTGRES_PROPERTIES.put(Heartbeat.HEARTBEAT_TOPICS_PREFIX.name(), new AdditionalPropertyMetadata(false, ConnectorProperty.Category.ADVANCED_HEARTBEAT));
        POSTGRES_PROPERTIES.put(DatabaseHeartbeatImpl.HEARTBEAT_ACTION_QUERY.name(), new AdditionalPropertyMetadata(false, ConnectorProperty.Category.ADVANCED_HEARTBEAT));

        // Data type mapping properties - Advanced:
        // additional property added to UI Requirements document section for "Data type mapping properties"-advanced section:
        POSTGRES_PROPERTIES.put(PostgresConnectorConfig.CUSTOM_CONVERTERS.name(), new AdditionalPropertyMetadata(false, ConnectorProperty.Category.CONNECTOR_ADVANCED));
        POSTGRES_PROPERTIES.put(PostgresConnectorConfig.SCHEMA_REFRESH_MODE.name(), new AdditionalPropertyMetadata(false, ConnectorProperty.Category.CONNECTOR_ADVANCED, enumArrayToList(PostgresConnectorConfig.SchemaRefreshMode.values())));
        POSTGRES_PROPERTIES.put(PostgresConnectorConfig.TRUNCATE_COLUMN.name(), new AdditionalPropertyMetadata(false, ConnectorProperty.Category.CONNECTOR_ADVANCED));
        POSTGRES_PROPERTIES.put(PostgresConnectorConfig.MASK_COLUMN.name(), new AdditionalPropertyMetadata(false, ConnectorProperty.Category.CONNECTOR_ADVANCED));
        POSTGRES_PROPERTIES.put(PostgresConnectorConfig.MASK_COLUMN_WITH_HASH.name(), new AdditionalPropertyMetadata(false, ConnectorProperty.Category.CONNECTOR_ADVANCED));
        // -PLACEHOLDER- Missing field for datatype.propagate.source.type, filed: https://issues.redhat.com/browse/DBZ-2516
        // -PLACEHOLDER- Missing field for column.propagate.source.typem, filed: https://issues.redhat.com/browse/DBZ-2516
        POSTGRES_PROPERTIES.put(PostgresConnectorConfig.MSG_KEY_COLUMNS.name(), new AdditionalPropertyMetadata(false, ConnectorProperty.Category.CONNECTOR_ADVANCED));
        POSTGRES_PROPERTIES.put(PostgresConnectorConfig.INCLUDE_UNKNOWN_DATATYPES.name(), new AdditionalPropertyMetadata(false, ConnectorProperty.Category.CONNECTOR_ADVANCED));
        POSTGRES_PROPERTIES.put(PostgresConnectorConfig.TOASTED_VALUE_PLACEHOLDER.name(), new AdditionalPropertyMetadata(false, ConnectorProperty.Category.CONNECTOR_ADVANCED));
        POSTGRES_PROPERTIES.put(PostgresConnectorConfig.PROVIDE_TRANSACTION_METADATA.name(), new AdditionalPropertyMetadata(false, ConnectorProperty.Category.CONNECTOR_ADVANCED));
        POSTGRES_PROPERTIES.put(PostgresConnectorConfig.SANITIZE_FIELD_NAMES.name(), new AdditionalPropertyMetadata(false, ConnectorProperty.Category.CONNECTOR_ADVANCED));

        // Advanced configs (aka Runtime configs based on the PoC Requirements document
        POSTGRES_PROPERTIES.put(PostgresConnectorConfig.SKIPPED_OPERATIONS.name(), new AdditionalPropertyMetadata(false, ConnectorProperty.Category.ADVANCED));
        POSTGRES_PROPERTIES.put(PostgresConnectorConfig.EVENT_PROCESSING_FAILURE_HANDLING_MODE.name(), new AdditionalPropertyMetadata(false, ConnectorProperty.Category.ADVANCED, enumArrayToList(PostgresConnectorConfig.EventProcessingFailureHandlingMode.values())));
        POSTGRES_PROPERTIES.put(PostgresConnectorConfig.MAX_BATCH_SIZE.name(), new AdditionalPropertyMetadata(false, ConnectorProperty.Category.ADVANCED));
        POSTGRES_PROPERTIES.put(PostgresConnectorConfig.MAX_QUEUE_SIZE.name(), new AdditionalPropertyMetadata(false, ConnectorProperty.Category.ADVANCED));
        POSTGRES_PROPERTIES.put(PostgresConnectorConfig.POLL_INTERVAL_MS.name(), new AdditionalPropertyMetadata(false, ConnectorProperty.Category.ADVANCED));
        POSTGRES_PROPERTIES.put(PostgresConnectorConfig.RETRIABLE_RESTART_WAIT.name(), new AdditionalPropertyMetadata(false, ConnectorProperty.Category.ADVANCED));
        POSTGRES_PROPERTIES.put(PostgresConnectorConfig.SOURCE_STRUCT_MAKER_VERSION.name(), new AdditionalPropertyMetadata(false, ConnectorProperty.Category.ADVANCED));
    }

    @Override
    public FilterValidationResult validateFilters(Map<String, String> properties) {
        PropertiesValidationResult result = validateProperties(properties);
        if (result.status == Status.INVALID) {
            return FilterValidationResult.invalid(result.propertyValidationResults);
        }

        PostgresConnectorConfig config = new PostgresConnectorConfig(Configuration.from(properties));

        PostgresConnection connection = new PostgresConnection(config.jdbcConfig());
        Set<TableId> tables;
        try {
            tables = connection.readTableNames(config.databaseName(), null, null, new String[]{ "TABLE" });

            List<DataCollection> matchingTables = tables.stream()
                    .filter(tableId -> config.getTableFilters().dataCollectionFilter().isIncluded(tableId))
                    .map(tableId -> new DataCollection(tableId.schema(), tableId.table()))
                    .collect(Collectors.toList());

            return FilterValidationResult.valid(matchingTables);
        }
        catch (SQLException e) {
            throw new DebeziumException(e);
        }
    }

    @Override
    protected ConnectorDescriptor getConnectorDescriptor() {
        return new ConnectorDescriptor("postgres", "PostgreSQL", true);
    }

    @Override
    protected SourceConnector getConnector() {
        return new PostgresConnector();
    }

    @Override
    public Map<String, AdditionalPropertyMetadata> allPropertiesWithAdditionalMetadata() {
        return POSTGRES_PROPERTIES;
    }
}
