package io.debezium.configserver.service;

import java.util.Map;

import io.debezium.configserver.model.ConnectionValidationResult;
import io.debezium.configserver.model.ConnectorType;

public interface ConnectorIntegrator {

    ConnectorType getDescriptor();

    ConnectionValidationResult validateConnection(Map<String, String> properties);
}
