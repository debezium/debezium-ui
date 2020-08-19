package io.debezium.configserver.rest;

import java.net.URI;
import java.net.URISyntaxException;
import java.util.Arrays;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.ServiceLoader;

import io.debezium.configserver.model.ConnectorConfig;
import org.eclipse.microprofile.config.inject.ConfigProperty;
import org.eclipse.microprofile.rest.client.RestClientBuilder;
import org.jboss.logging.Logger;
import java.util.stream.Collectors;

import javax.ws.rs.Consumes;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import javax.ws.rs.core.Response.Status;

import io.debezium.DebeziumException;
import io.debezium.configserver.model.ConnectionValidationResult;
import io.debezium.configserver.model.ConnectorType;
import io.debezium.configserver.model.FilterValidationResult;
import io.debezium.configserver.model.PropertiesValidationResult;
import io.debezium.configserver.rest.client.KafkaConnectClient;
import io.debezium.configserver.rest.model.BadRequestResponse;
import io.debezium.configserver.rest.model.ServerError;
import io.debezium.configserver.service.ConnectorIntegrator;

@Path("/api")
public class ConnectorResource {

    private static final Logger LOG = Logger.getLogger(ConnectorResource.class);

    @ConfigProperty(name = "kafka.connect.uri", defaultValue = "http://localhost:9000")
    private String kafkaConnectBaseUri = "http://localhost:9000";

    private final Map<String, ConnectorIntegrator> integrators;

    private final URI kafkaConnectURI;

    public ConnectorResource() {
        Map<String, ConnectorIntegrator> integrators = new HashMap<>();

        ServiceLoader.load(ConnectorIntegrator.class)
                .forEach(integrator -> integrators.put(integrator.getDescriptor().id, integrator));

        this.integrators = Collections.unmodifiableMap(integrators);

        try {
            kafkaConnectURI = new URI(kafkaConnectBaseUri);
        } catch (URISyntaxException e) {
            throw new RuntimeException("Invalid Kafka Connect URI configured!", e);
        }
    }

    @Path("/connector-types")
    @GET
    @Produces(MediaType.APPLICATION_JSON)
    public List<ConnectorType> getConnectorTypes() {
        return integrators.values()
                .stream()
                .map(ConnectorIntegrator::getDescriptor)
                .collect(Collectors.toList());
    }

    @Path("/connector-types/{id}/validation/connection")
    @POST
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public Response validateConnectionProperties(@PathParam("id") String connectorTypeId, Map<String, String> properties) {
        ConnectorIntegrator integrator = integrators.get(connectorTypeId);

        if (integrator == null) {
            return Response.status(Status.BAD_REQUEST)
                    .entity(new BadRequestResponse("Unknown connector type: " + connectorTypeId))
                    .build();
        }

        ConnectionValidationResult validationResult = integrator.validateConnection(properties);

        return Response.ok(validationResult)
                .build();
    }

    @Path("/connector-types/{id}/validation/filters")
    @POST
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public Response validateFilters(@PathParam("id") String connectorTypeId, Map<String, String> properties) {
        ConnectorIntegrator integrator = integrators.get(connectorTypeId);

        if (integrator == null) {
            return Response.status(Status.BAD_REQUEST)
                    .entity(new BadRequestResponse("Unknown connector type: " + connectorTypeId))
                    .build();
        }

        try {
            FilterValidationResult validationResult = integrator.validateFilters(properties);

            return Response.ok(validationResult)
                    .build();
        }
        catch(DebeziumException e) {
            e.printStackTrace();
            return Response.status(Status.INTERNAL_SERVER_ERROR)
                    .entity(new ServerError("Failed to apply table filters", traceAsString(e)))
                    .build();
        }
    }

    @Path("/connector-types/{id}/validation/properties")
    @POST
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public Response validateConnectorProperties(@PathParam("id") String connectorTypeId, Map<String, String> properties) {
        ConnectorIntegrator integrator = integrators.get(connectorTypeId);

        if (integrator == null) {
            return Response.status(Status.BAD_REQUEST)
                    .entity(new BadRequestResponse("Unknown connector type: " + connectorTypeId))
                    .build();
        }

        PropertiesValidationResult validationResult = integrator.validateProperties(properties);

        return Response.ok(validationResult)
                .build();
    }

    private String traceAsString(Exception e) {
        return e.getStackTrace() != null && e.getStackTrace().length > 0 ? Arrays.toString(e.getStackTrace()) : null;
    }

    @Path("/connector/{id}")
    @POST
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public Response createConnector(
            @PathParam("id") String connectorTypeId,
            ConnectorConfig kafkaConnectConfig
            ) {
        if (kafkaConnectConfig.config == null || kafkaConnectConfig.config.isEmpty()) {
            return Response.status(Status.BAD_REQUEST)
                    .entity(new BadRequestResponse("Connector \"config\" property is not set!"))
                    .build();
        }

        if (null == kafkaConnectConfig.name || kafkaConnectConfig.name.isBlank()) {
            return Response.status(Status.BAD_REQUEST)
                    .entity(new BadRequestResponse("Connector \"name\" property is not set!"))
                    .build();
        }

        ConnectorIntegrator integrator = integrators.get(connectorTypeId);
        if (integrator == null) {
            return Response.status(Status.BAD_REQUEST)
                    .entity(new BadRequestResponse("Unknown connector type: " + connectorTypeId))
                    .build();
        }

        PropertiesValidationResult validationResult = integrator.validateProperties(kafkaConnectConfig.config);

        if (validationResult.status == PropertiesValidationResult.Status.INVALID) {
            return Response.status(Status.BAD_REQUEST).entity(validationResult).build();
        }

        KafkaConnectClient kafkaConnectClient = RestClientBuilder.newBuilder()
                .baseUri(kafkaConnectURI)
                .build(KafkaConnectClient.class);

        kafkaConnectConfig.config.put("connector.class", integrator.getDescriptor().className);

        LOG.debug("Sending valid connector config: " + kafkaConnectConfig);
        var result = kafkaConnectClient.createConnector(kafkaConnectConfig);

        return Response.ok(result).build();
    }
}
