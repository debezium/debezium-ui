package io.debezium.configserver;

import static io.restassured.RestAssured.given;

import org.junit.jupiter.api.Test;

import io.quarkus.test.junit.QuarkusTest;

@QuarkusTest
public class ConnectorResourceTest {

    @Test
    public void testHelloEndpoint() {
        given()
          .when().get("/api/connector")
          .then()
             .statusCode(200);
    }
}
