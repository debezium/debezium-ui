package io.debezium.configserver.service;

import java.util.Map;

import io.debezium.configserver.model.AdditionalPropertyMetadata;
import io.debezium.configserver.model.ConnectionValidationResult;
import io.debezium.configserver.model.ConnectorType;
import io.debezium.configserver.model.FilterValidationResult;
import io.debezium.configserver.model.PropertiesValidationResult;

public interface ConnectorIntegrator {

    ConnectorType getDescriptor();

    Map<String, AdditionalPropertyMetadata> allPropertiesWithAdditionalMetadata();

    /**
     * Validates the set of connection-related properties.
     */
    ConnectionValidationResult validateConnection(Map<String, String> properties);

    /**
     * Validates the set of filter-related properties and returns the matching data collection(s).
     */
    FilterValidationResult validateFilters(Map<String, String> properties);

    /**
     * Validates an arbitrary set of connector properties.
     */
    PropertiesValidationResult validateProperties(Map<String, String> properties);
}
