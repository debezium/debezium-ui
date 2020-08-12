package io.debezium.configserver.service.postgres;

import java.sql.SQLException;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;

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
}
