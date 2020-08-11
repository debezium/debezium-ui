package io.debezium.configserver.service.postgres;

import java.sql.SQLException;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;

import org.apache.kafka.common.config.Config;
import org.apache.kafka.common.config.ConfigDef;
import org.apache.kafka.common.config.ConfigDef.ConfigKey;
import org.apache.kafka.common.config.ConfigValue;

import io.debezium.DebeziumException;
import io.debezium.config.Configuration;
import io.debezium.config.Field;
import io.debezium.configserver.model.ConnectionValidationResult;
import io.debezium.configserver.model.ConnectorProperty;
import io.debezium.configserver.model.ConnectorType;
import io.debezium.configserver.model.DataCollection;
import io.debezium.configserver.model.FilterValidationResult;
import io.debezium.configserver.model.GenericValidationResult;
import io.debezium.configserver.model.PropertiesValidationResult;
import io.debezium.configserver.model.PropertiesValidationResult.Status;
import io.debezium.configserver.model.PropertyValidationResult;
import io.debezium.configserver.service.ConnectorIntegrator;
import io.debezium.connector.postgresql.PostgresConnector;
import io.debezium.connector.postgresql.PostgresConnectorConfig;
import io.debezium.connector.postgresql.connection.PostgresConnection;
import io.debezium.relational.TableId;

// TODO: This will live in the PG connector module eventually
public class PostgresConnectorIntegrator implements ConnectorIntegrator {

    @Override
    public ConnectorType getDescriptor() {
        PostgresConnector instance = new PostgresConnector();

        List<ConnectorProperty> properties = instance.config()
            .configKeys()
            .values()
            .stream()
            .map(this::toConnectorProperty)
            .collect(Collectors.toList());

        return new ConnectorType("postgres", PostgresConnector.class.getName(), "PostgreSQL", instance.version(), true, properties);
    }

    @Override
    public ConnectionValidationResult validateConnection(Map<String, String> properties) {
        PostgresConnector instance = new PostgresConnector();

        try {
            Config result = instance.validate(properties);
            List<PropertyValidationResult> propertyResults = toPropertyValidationResults(result);

            return propertyResults.isEmpty() ? ConnectionValidationResult.valid() : ConnectionValidationResult.invalid(propertyResults);
        }
        catch(Exception e) {
            return ConnectionValidationResult.invalid(Collections.emptyList(), Collections.singletonList(new GenericValidationResult(e.getMessage(), traceAsString(e))));
        }
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
    public PropertiesValidationResult validateProperties(Map<String, String> properties) {
        List<Field> fields = new ArrayList<>();
        PostgresConnectorConfig.ALL_FIELDS.forEach(field -> {
            if (properties.containsKey(field.name())) {
                fields.add(field);
            }
        });

        Configuration config = Configuration.from(properties);
        Map<String, ConfigValue> results = config.validate(Field.setOf(fields));
        Config result = new Config(new ArrayList<>(results.values()));

        List<PropertyValidationResult> propertyResults = toPropertyValidationResults(result);

        return propertyResults.isEmpty() ? PropertiesValidationResult.valid() : PropertiesValidationResult.invalid(propertyResults);
    }

    private List<PropertyValidationResult> toPropertyValidationResults(Config result) {
        List<PropertyValidationResult> propertyResults = result.configValues()
                .stream()
                .filter(cv -> !cv.errorMessages().isEmpty())
                .map(cv -> new PropertyValidationResult(cv.name(), cv.errorMessages().get(0)))
                .collect(Collectors.toList());
        return propertyResults;
    }

    private String traceAsString(Exception e) {
        return e.getStackTrace() != null && e.getStackTrace().length > 0 ? Arrays.toString(e.getStackTrace()) : null;
    }

    private ConnectorProperty toConnectorProperty(ConfigKey configKey) {
        return new ConnectorProperty(
                configKey.name,
                configKey.displayName,
                configKey.documentation,
                toConnectorPropertyType(configKey.type()),
                configKey.defaultValue
        );
    }

    private ConnectorProperty.Type toConnectorPropertyType(ConfigDef.Type type) {
        switch(type) {
            case BOOLEAN:
                return ConnectorProperty.Type.BOOLEAN;
            case CLASS:
                return ConnectorProperty.Type.CLASS;
            case DOUBLE:
                return ConnectorProperty.Type.DOUBLE;
            case INT:
                return ConnectorProperty.Type.INT;
            case LIST:
                return ConnectorProperty.Type.LIST;
            case LONG:
                return ConnectorProperty.Type.LONG;
            case PASSWORD:
                return ConnectorProperty.Type.PASSWORD;
            case SHORT:
                return ConnectorProperty.Type.SHORT;
            case STRING:
                return ConnectorProperty.Type.STRING;
            default:
                throw new IllegalArgumentException("Unsupported property type: " + type);
        }
    }
}
