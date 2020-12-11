package io.debezium.configserver.service.temp;

import java.util.Map;

import io.debezium.config.Field;
import io.debezium.connector.mysql.MySqlConnectorConfig;
import org.apache.kafka.connect.source.SourceConnector;

import io.debezium.configserver.model.FilterValidationResult;
import io.debezium.configserver.service.ConnectorIntegratorBase;
import io.debezium.connector.mysql.MySqlConnector;

// TODO: This will live in the actual connector module eventually
public class MySqlConnectorIntegrator extends ConnectorIntegratorBase {

    @Override
    public FilterValidationResult validateFilters(Map<String, String> properties) {
        throw new UnsupportedOperationException("Not implemented yet");
    }

    @Override
    protected ConnectorDescriptor getConnectorDescriptor() {
        return new ConnectorDescriptor("mysql", "MySQL", false);
    }

    @Override
    protected SourceConnector getConnector() {
        return new MySqlConnector();
    }

    @Override
    public Field.Set getAllConnectorFields() {
        return MySqlConnectorConfig.ALL_FIELDS;
    }

    // TODO implement io.debezium.configserver.service.ConnectorIntegratorBase.allPropertiesWithAdditionalMetadata
}
