package io.debezium.configserver;

import static io.restassured.RestAssured.given;
import static org.hamcrest.Matchers.containsString;

import org.junit.jupiter.api.Test;

import io.quarkus.test.junit.QuarkusTest;

@QuarkusTest
public class ConnectorResourceTest {

    @Test
    public void testHelloEndpoint() {
        given()
          .when().get("/api/connector-types")
          .then()
             .statusCode(200)
             .body(containsString("PostgresConnector"));
    }
}
