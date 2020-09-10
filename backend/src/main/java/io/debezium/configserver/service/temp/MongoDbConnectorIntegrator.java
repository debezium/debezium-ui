package io.debezium.configserver.service.temp;

import java.util.Map;

import org.apache.kafka.connect.source.SourceConnector;

import io.debezium.configserver.model.FilterValidationResult;
import io.debezium.configserver.service.ConnectorIntegratorBase;
import io.debezium.connector.mongodb.MongoDbConnector;

// TODO: This will live in the actual connector module eventually
public class MongoDbConnectorIntegrator extends ConnectorIntegratorBase {

    @Override
    public FilterValidationResult validateFilters(Map<String, String> properties) {
        throw new UnsupportedOperationException("Not implemented yet");
    }

    @Override
    protected ConnectorDescriptor getConnectorDescriptor() {
        return new ConnectorDescriptor("mongodb", "MongoDB", false);
    }

    @Override
    protected SourceConnector getConnector() {
        return new MongoDbConnector();
    }

    // TODO implement io.debezium.configserver.service.ConnectorIntegratorBase.allPropertiesWithAdditionalMetadata
}
