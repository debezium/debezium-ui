package io.debezium.configserver;

import io.quarkus.test.junit.QuarkusTest;
import org.junit.jupiter.api.Test;

import static io.restassured.RestAssured.given;
import static org.hamcrest.Matchers.containsString;

@QuarkusTest
public class ConnectorResourceIT {

    @Test
    public void testHelloEndpoint() {
        given()
          .when().get("/api/connector-types")
          .then()
             .statusCode(200)
             .body(containsString("PostgresConnector"));
    }

}
