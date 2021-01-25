package io.debezium.configserver.rest;

public interface ConnectorURIs {
    String API_PREFIX = "/api";
    String CONNECT_CLUSTERS_ENDPOINT = "/connect-clusters";
    String CONNECTOR_TYPES_ENDPOINT = "/connector-types";
    String CONNECTOR_TYPES_ENDPOINT_FOR_CONNECTOR = "/connector-types/{id}";
    String CONNECTION_VALIDATION_ENDPOINT = "/connector-types/{id}/validation/connection";
    String FILTERS_VALIDATION_ENDPOINT = "/connector-types/{id}/validation/filters";
    String PROPERTIES_VALIDATION_ENDPOINT = "/connector-types/{id}/validation/properties";
    String CREATE_CONNECTOR_ENDPOINT = "/connector/{cluster}/{connector-type-id}";
    String LIST_CONNECTORS_ENDPOINT = "/connectors/{cluster}";
    String MANAGE_CONNECTORS_ENDPOINT = "/connectors/{cluster}/{connector-name}";
    String CONNECTOR_PAUSE_ENDPOINT = "/connector/{cluster}/{connectorname}/pause";
    String CONNECTOR_RESUME_ENDPOINT = "/connector/{cluster}/{connectorname}/resume";
    String CONNECTOR_RESTART_ENDPOINT = "/connector/{cluster}/{connectorname}/restart";
    String CONNECTOR_TASK_RESTART_ENDPOINT = "/connector/{cluster}/{connectorname}/task/{tasknumber}/restart";
}
