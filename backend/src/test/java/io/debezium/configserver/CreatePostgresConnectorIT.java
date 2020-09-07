package io.debezium.configserver;

import io.debezium.configserver.rest.ConnectorResource;
import io.debezium.configserver.util.Infrastructure;
import io.debezium.configserver.util.PostgresInfrastructureTestProfile;
import io.debezium.testing.testcontainers.Connector;
import io.quarkus.test.junit.QuarkusTest;
import io.quarkus.test.junit.TestProfile;
import io.restassured.http.ContentType;
import org.junit.jupiter.api.Test;

import static org.hamcrest.CoreMatchers.equalTo;
import static io.restassured.RestAssured.given;
import static org.hamcrest.Matchers.is;

@QuarkusTest
@TestProfile(PostgresInfrastructureTestProfile.class)
public class CreatePostgresConnectorIT {

    @Test
    public void testPostgresClustersEndpoint() {
        given()
                .when().get(ConnectorResource.API_PREFIX + ConnectorResource.CONNECT_CLUSTERS_ENDPOINT)
                .then().log().all()
                .statusCode(200)
                .body("size()", is(1))
                .and().body(
                    "[0]",
                    equalTo("http://" + Infrastructure.getDebeziumContainer().getHost()
                            + ":" + Infrastructure.getDebeziumContainer().getMappedPort(8083)
                    )
        );
    }

    @Test
    public void testCreateConnectorEndpoint() {
        Connector connector = Connector.from(
                "my-postgres-connector",
                Infrastructure.getPostgresConnectorConfiguration(1)
        );

        given().when().contentType(ContentType.JSON).accept(ContentType.JSON).body(connector.toJson())
                .post(ConnectorResource.API_PREFIX + ConnectorResource.CREATE_CONNECTOR_ENDPOINT, 1, "postgres")
            .then().log().all()
            .statusCode(200)
            .assertThat().body("name", equalTo("my-postgres-connector"))
            .and().rootPath("config")
                .body("['connector.class']", equalTo("io.debezium.connector.postgresql.PostgresConnector"))
                .and().body("['database.hostname']", equalTo(Infrastructure.getPostgresContainer().getContainerInfo().getConfig().getHostName()));
    }

}
