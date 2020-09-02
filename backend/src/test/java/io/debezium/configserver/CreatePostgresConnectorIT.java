package io.debezium.configserver;

import io.debezium.configserver.util.Infrastructure;
import io.debezium.configserver.util.PostgresInfrastructureTestResourceLifecycleManager;
import io.debezium.testing.testcontainers.Connector;
import io.quarkus.test.common.QuarkusTestResource;
import io.quarkus.test.junit.QuarkusTest;
import io.restassured.http.ContentType;
import org.junit.jupiter.api.Test;

import static org.hamcrest.CoreMatchers.equalTo;
import static io.restassured.RestAssured.given;

@QuarkusTest
@QuarkusTestResource(PostgresInfrastructureTestResourceLifecycleManager.class)
public class CreatePostgresConnectorIT {

    @Test
    public void testCreateConnectorEndpoint() {
        Connector connector = Connector.from(
                "my-postgres-connector",
                Infrastructure.getPostgresConnectorConfiguration(1)
        );

        given().when().contentType(ContentType.JSON).accept(ContentType.JSON).body(connector.toJson())
                .post("/api/connector/{id}", "postgres")
            .then().log().all()
            .statusCode(200)
            .assertThat().body("name", equalTo("my-postgres-connector"))
            .and().rootPath("config")
                .body("['connector.class']", equalTo("io.debezium.connector.postgresql.PostgresConnector"))
                .and().body("['database.hostname']", equalTo(Infrastructure.getPostgresContainer().getContainerInfo().getConfig().getHostName()));
    }

}
