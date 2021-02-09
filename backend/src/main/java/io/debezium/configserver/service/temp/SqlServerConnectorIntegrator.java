/*
 * Copyright Debezium Authors.
 *
 * Licensed under the Apache Software License version 2.0, available at http://www.apache.org/licenses/LICENSE-2.0
 */
package io.debezium.configserver.service.temp;

import java.util.Map;

import io.debezium.config.Field;
import io.debezium.connector.sqlserver.SqlServerConnectorConfig;
import org.apache.kafka.connect.source.SourceConnector;

import io.debezium.configserver.model.FilterValidationResult;
import io.debezium.configserver.service.ConnectorIntegratorBase;
import io.debezium.connector.sqlserver.SqlServerConnector;

// TODO: This will live in the actual connector module eventually
public class SqlServerConnectorIntegrator extends ConnectorIntegratorBase {

    @Override
    public FilterValidationResult validateFilters(Map<String, String> properties) {
        throw new UnsupportedOperationException("Not implemented yet");
    }

    @Override
    protected ConnectorDescriptor getConnectorDescriptor() {
        return new ConnectorDescriptor("sqlserver", "SQL Server", false);
    }

    @Override
    protected SourceConnector getConnector() {
        return new SqlServerConnector();
    }

    @Override
    public Field.Set getAllConnectorFields() {
        return SqlServerConnectorConfig.ALL_FIELDS;
    }

    // TODO implement io.debezium.configserver.service.ConnectorIntegratorBase.allPropertiesWithAdditionalMetadata
}
