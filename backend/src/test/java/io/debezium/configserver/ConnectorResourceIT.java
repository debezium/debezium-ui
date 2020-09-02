package io.debezium.configserver;

import io.quarkus.test.junit.QuarkusTest;
import org.junit.jupiter.api.Test;

import static io.restassured.RestAssured.given;
import static org.hamcrest.Matchers.containsString;
import static org.hamcrest.Matchers.equalTo;
import static org.hamcrest.Matchers.is;

@QuarkusTest
public class ConnectorResourceIT {

    @Test
    public void testConnectorTypesEndpoint() {
        given()
          .when().get("/api/connector-types")
          .then()
             .statusCode(200)
             .body(containsString("PostgresConnector"));
    }

    @Test
    public void testClustersEndpoint() {
        given()
          .when().get("/api/connect-clusters")
          .then().log().all()
             .statusCode(200)
             .body("size()", is(1))
             .and().body("[0]", equalTo("http://localhost:8083"));
    }

}
