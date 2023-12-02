/*
 * Copyright Debezium Authors.
 *
 * Licensed under the Apache Software License version 2.0, available at http://www.apache.org/licenses/LICENSE-2.0
 */
package io.debezium.configserver.rest.client;

import io.debezium.configserver.model.ConnectConnectorConfigResponse;
import io.debezium.configserver.model.ConnectConnectorStatusResponse;
import io.debezium.configserver.model.TransformsInfo;
import org.eclipse.microprofile.rest.client.inject.RegisterRestClient;

import jakarta.ws.rs.Consumes;
import jakarta.ws.rs.DELETE;
import jakarta.ws.rs.GET;
import jakarta.ws.rs.POST;
import jakarta.ws.rs.PUT;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.PathParam;
import jakarta.ws.rs.ProcessingException;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.core.Response;
import java.io.IOException;
import java.util.List;
import java.util.Map;

@RegisterRestClient
public interface KafkaConnectClient {

    @POST
    @Path("/connectors")
    @Produces("application/json")
    String createConnector(ConnectConnectorConfigResponse configuration) throws ProcessingException, IOException;

    @GET
    @Path("/connectors")
    @Produces("application/json")
    List<String> listConnectors() throws ProcessingException, IOException;

    @GET
    @Path("/connectors/{connector-name}")
    @Produces("application/json")
    ConnectConnectorConfigResponse getConnectorInfo(@PathParam("connector-name") String connectorName) throws ProcessingException, IOException;

    @GET
    @Path("/connectors/{connector-name}/status")
    @Produces("application/json")
    ConnectConnectorStatusResponse getConnectorStatus(@PathParam("connector-name") String connectorName) throws ProcessingException, IOException;

    @GET
    @Path("/connectors/{connector-name}/config")
    @Produces("application/json")
    Response getConnectorConfig(@PathParam("connector-name") String connectorName) throws ProcessingException, IOException;

    @DELETE
    @Path("/connectors/{connector-name}")
    Response deleteConnector(@PathParam("connector-name") String connectorName) throws ProcessingException, IOException;

    @PUT
    @Path("/connectors/{connector-name}/config")
    @Produces("application/json")
    @Consumes("application/json")
    Response updateConnectorConfig(@PathParam("connector-name") String connectorName, Map<String, String> config) throws ProcessingException, IOException;

    @PUT
    @Path("/connectors/{connector-name}/pause")
    @Produces("application/json")
    Response pauseConnector(@PathParam("connector-name") String connectorName) throws ProcessingException, IOException;

    @PUT
    @Path("/connectors/{connector-name}/resume")
    @Produces("application/json")
    Response resumeConnector(@PathParam("connector-name") String connectorName) throws ProcessingException, IOException;

    @POST
    @Path("/connectors/{connector-name}/restart")
    @Consumes("application/json")
    @Produces("application/json")
    Response restartConnector(@PathParam("connector-name") String connectorName) throws ProcessingException, IOException;

    @POST
    @Path("/connectors/{connector-name}/tasks/{task-number}/restart")
    @Consumes("application/json")
    @Produces("application/json")
    Response restartConnectorTask(@PathParam("connector-name") String connectorName, @PathParam("task-number") int taskNumber) throws ProcessingException, IOException;

    @GET
    @Path("/debezium/transforms")
    @Produces("application/json")
    List<TransformsInfo> listTransforms() throws ProcessingException, IOException;

    @GET
    @Path("/debezium/topic-creation-enabled")
    @Produces("application/json")
    Boolean isTopicCreationEnabled() throws ProcessingException, IOException;

    @GET
    @Path("/connectors/{connector-name}/metrics")
    @Produces("application/json")
    List<String> getConnectorMetrics(@PathParam("connector-name") String connectorName) throws ProcessingException, IOException;
}
