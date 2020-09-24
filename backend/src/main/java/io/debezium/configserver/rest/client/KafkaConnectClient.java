package io.debezium.configserver.rest.client;

import io.debezium.configserver.model.ConnectConnectorConfigResponse;
import io.debezium.configserver.model.ConnectConnectorStatusResponse;
import org.eclipse.microprofile.rest.client.inject.RegisterRestClient;

import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.ProcessingException;
import javax.ws.rs.Produces;
import java.io.IOException;
import java.util.List;

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

}
