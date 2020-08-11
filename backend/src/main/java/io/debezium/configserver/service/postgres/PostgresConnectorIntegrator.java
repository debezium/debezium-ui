package io.debezium.configserver.service.postgres;

import java.util.Arrays;
import java.util.Collections;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.apache.kafka.common.config.Config;
import org.apache.kafka.common.config.ConfigDef;
import org.apache.kafka.common.config.ConfigDef.ConfigKey;

import io.debezium.configserver.model.ConnectionValidationResult;
import io.debezium.configserver.model.ConnectorProperty;
import io.debezium.configserver.model.ConnectorType;
import io.debezium.configserver.model.GenericValidationResult;
import io.debezium.configserver.model.PropertyValidationResult;
import io.debezium.configserver.service.ConnectorIntegrator;
import io.debezium.connector.postgresql.PostgresConnector;

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

            List<PropertyValidationResult> propertyResults = result.configValues()
                    .stream()
                    .filter(cv -> !cv.errorMessages().isEmpty())
                    .map(cv -> new PropertyValidationResult(cv.name(), cv.errorMessages().get(0)))
                    .collect(Collectors.toList());

            return propertyResults.isEmpty() ? ConnectionValidationResult.valid() : ConnectionValidationResult.invalid(propertyResults);
        }
        catch(Exception e) {
            return ConnectionValidationResult.invalid(Collections.emptyList(), Collections.singletonList(new GenericValidationResult(e.getMessage(), traceAsString(e))));
        }
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
