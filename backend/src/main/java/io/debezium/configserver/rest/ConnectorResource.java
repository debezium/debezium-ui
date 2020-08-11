package io.debezium.configserver.rest;

import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.ServiceLoader;
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

import io.debezium.configserver.model.ConnectionValidationResult;
import io.debezium.configserver.model.ConnectorType;
import io.debezium.configserver.model.PropertiesValidationResult;
import io.debezium.configserver.rest.model.BadRequestResponse;
import io.debezium.configserver.service.ConnectorIntegrator;

@Path("/api")
public class ConnectorResource {

    private final Map<String, ConnectorIntegrator> integrators;

    public ConnectorResource() {
        Map<String, ConnectorIntegrator> integrators = new HashMap<>();

        ServiceLoader.load(ConnectorIntegrator.class)
                .forEach(integrator -> integrators.put(integrator.getDescriptor().id, integrator));

        this.integrators = Collections.unmodifiableMap(integrators);
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
}
