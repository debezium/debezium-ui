/*
 * Copyright Debezium Authors.
 *
 * Licensed under the Apache Software License version 2.0, available at http://www.apache.org/licenses/LICENSE-2.0
 */
package io.debezium.configserver;

import io.debezium.configserver.rest.ConnectorURIs;
import io.debezium.configserver.util.Infrastructure;
import io.debezium.configserver.util.PostgresInfrastructureTestProfile;
import io.debezium.testing.testcontainers.Connector;
import io.quarkus.test.junit.QuarkusTest;
import io.quarkus.test.junit.TestProfile;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import static io.restassured.RestAssured.given;
import static org.hamcrest.Matchers.equalTo;
import static org.hamcrest.Matchers.is;

@QuarkusTest
@TestProfile(PostgresInfrastructureTestProfile.class)
public class ValidateConnectorMetricsIT {
    @BeforeEach
    public void resetRunningConnectors() {
        Infrastructure.getDebeziumContainer().deleteAllConnectors();
    }

    @Test
    public void testConnectorMetricsEndpoint() {
        final var connectorName = "my-postgres-connector";
        Infrastructure.getDebeziumContainer().registerConnector(
                connectorName,
                Infrastructure.getPostgresConnectorConfiguration(1));

        Infrastructure.getDebeziumContainer().ensureConnectorState(connectorName, Connector.State.RUNNING);
        Infrastructure.getDebeziumContainer().ensureConnectorTaskState(connectorName, 0, Connector.State.RUNNING);

        given()
                .when().get(ConnectorURIs.API_PREFIX + ConnectorURIs.LIST_CONNECTOR_METRICS_ENDPOINT, 1, connectorName)
                .then().log().all()
                .statusCode(200)
                .body("size()", is(3))
                .body("[0].request.attribute", is("Connected"))
                .body("[0].value", equalTo(true))
                .body("[1].request.attribute", is("MilliSecondsSinceLastEvent"))
                .body("[1].value", equalTo(-1))
                .body("[2].request.attribute", is("TotalNumberOfEventsSeen"))
                .body("[2].value", equalTo(0));
    }
}
