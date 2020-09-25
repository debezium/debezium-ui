package io.debezium.configserver;

import io.debezium.configserver.rest.ConnectorResource;
import io.debezium.configserver.util.Infrastructure;
import io.debezium.configserver.util.PostgresInfrastructureTestProfile;
import io.quarkus.test.junit.QuarkusTest;
import io.quarkus.test.junit.TestProfile;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.io.IOException;
import java.util.Map;

import static io.restassured.RestAssured.given;
import static org.hamcrest.CoreMatchers.equalTo;
import static org.hamcrest.Matchers.is;

@QuarkusTest
@TestProfile(PostgresInfrastructureTestProfile.class)
public class ListPostgresConnectorIT {

    @BeforeEach
    public void resetRunningConnectors() {
        try {
            Infrastructure.getDebeziumContainer().deleteAllConnectors();
        } catch (IOException e) {
            throw new RuntimeException(e);
        }
    }

    @Test
    public void testListConnectorsEndpointEmpty() {
        given().when().get(ConnectorResource.API_PREFIX + ConnectorResource.LIST_CONNECTORS_ENDPOINT, "1")
                .then().log().all()
                .statusCode(200)
                .body("size()", is(0));
    }

    @Test
    public void testListConnectorsEndpoint() {
        final var runningConnectorName = "list-connectors-postgres-connector";
        final var pausedConnectorName = "list-connectors-postgres-connector-paused";
        try {
            Infrastructure.getDebeziumContainer().registerConnector(
                    runningConnectorName,
                    Infrastructure.getPostgresConnectorConfiguration(1));
            Infrastructure.getDebeziumContainer().registerConnector(
                    pausedConnectorName,
                    Infrastructure.getPostgresConnectorConfiguration(2)
                            .with("table.include.list", ".*"));
            Infrastructure.getDebeziumContainer().pauseConnector(pausedConnectorName);
        } catch (IOException e) {
            throw new RuntimeException(e);
        }

        given()
                .when().get(ConnectorResource.API_PREFIX + ConnectorResource.LIST_CONNECTORS_ENDPOINT, "1")
                .then().log().all()
                .statusCode(200)
                .body("size()", is(2))
                .rootPath("find { it.name == '"+ runningConnectorName + "' }")
                    .body("connectorStatus", equalTo("RUNNING"))
                    .body("connectorType", equalTo("PostgreSQL"))
                    .body("name", equalTo(runningConnectorName))
                    .body("taskStates", equalTo(Map.of("0", "RUNNING")))
                .rootPath("find { it.name == '"+ pausedConnectorName + "' }")
                    .body("connectorStatus", equalTo("PAUSED"))
                    .body("connectorType", equalTo("PostgreSQL"))
                    .body("name", equalTo(pausedConnectorName));
    }

}
