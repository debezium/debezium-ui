package io.debezium.configserver;

import com.fasterxml.jackson.databind.node.ObjectNode;
import io.debezium.configserver.rest.ConnectorResource;
import io.debezium.configserver.util.Infrastructure;
import io.debezium.configserver.util.PostgresInfrastructureTestProfile;
import io.debezium.testing.testcontainers.ConnectorConfigurationTestingHelper;
import io.quarkus.test.junit.QuarkusTest;
import io.quarkus.test.junit.TestProfile;
import io.restassured.http.ContentType;
import org.junit.jupiter.api.Test;

import java.util.Map;

import static io.restassured.RestAssured.given;
import static org.hamcrest.CoreMatchers.containsString;
import static org.hamcrest.CoreMatchers.equalTo;
import static org.hamcrest.CoreMatchers.hasItems;
import static org.hamcrest.CoreMatchers.is;

@QuarkusTest
@TestProfile(PostgresInfrastructureTestProfile.class)
public class ValidatePostgresFiltersIT {

    @Test
    public void testEmptyPostgresFilters() {
        ObjectNode config = ConnectorConfigurationTestingHelper.getConfig(
            Infrastructure.getPostgresConnectorConfiguration(1)
                .with("database.hostname", "localhost")
                .with("database.port", Infrastructure.getPostgresContainer().getMappedPort(5432))
        );

        given().when().contentType(ContentType.JSON).accept(ContentType.JSON).body(config.toString())
            .post(ConnectorResource.API_PREFIX + ConnectorResource.FILTERS_VALIDATION_ENDPOINT, "postgres")
            .then().log().all()
            .statusCode(200)
            .assertThat().body("status", equalTo("VALID"))
                .body("propertyValidationResults.size()", is(0))
                .body("matchedCollections.size()", is(6))
                .body("matchedCollections",
                    hasItems(
                        Map.of("namespace", "inventory", "name", "spatial_ref_sys"),
                        Map.of("namespace", "inventory", "name", "geom"),
                        Map.of("namespace", "inventory", "name", "products_on_hand"),
                        Map.of("namespace", "inventory", "name", "customers"),
                        Map.of("namespace", "inventory", "name", "orders"),
                        Map.of("namespace", "inventory", "name", "products")
                    ));
    }

    @Test
    public void testValidTableIncludeList() {
        ObjectNode config = ConnectorConfigurationTestingHelper.getConfig(
                Infrastructure.getPostgresConnectorConfiguration(1)
                        .with("database.hostname", "localhost")
                        .with("database.port", Infrastructure.getPostgresContainer().getMappedPort(5432))
                        .with("table.include.list", "inventory\\.product.*")
        );

        given().when().contentType(ContentType.JSON).accept(ContentType.JSON).body(config.toString())
            .post(ConnectorResource.API_PREFIX + ConnectorResource.FILTERS_VALIDATION_ENDPOINT, "postgres")
            .then().log().all()
            .statusCode(200)
            .assertThat().body("status", equalTo("VALID"))
                .body("propertyValidationResults.size()", is(0))
                .body("matchedCollections.size()", is(2))
                .body("matchedCollections",
                    hasItems(
                        Map.of("namespace", "inventory", "name", "products_on_hand"),
                        Map.of("namespace", "inventory", "name", "products")
                    ));;
    }

    @Test
    public void testValidSchemaIncludeList() {
        ObjectNode config = ConnectorConfigurationTestingHelper.getConfig(
            Infrastructure.getPostgresConnectorConfiguration(1)
                .with("database.hostname", "localhost")
                .with("database.port", Infrastructure.getPostgresContainer().getMappedPort(5432))
                .with("schema.include.list", "inventory")
        );

        given().when().contentType(ContentType.JSON).accept(ContentType.JSON).body(config.toString())
            .post(ConnectorResource.API_PREFIX + ConnectorResource.FILTERS_VALIDATION_ENDPOINT, "postgres")
            .then().log().all()
            .statusCode(200)
            .assertThat().body("status", equalTo("VALID"))
                .body("propertyValidationResults.size()", is(0))
                .body("matchedCollections.size()", is(6))
                .body("matchedCollections",
                    hasItems(
                        Map.of("namespace", "inventory", "name", "spatial_ref_sys"),
                        Map.of("namespace", "inventory", "name", "geom"),
                        Map.of("namespace", "inventory", "name", "products_on_hand"),
                        Map.of("namespace", "inventory", "name", "customers"),
                        Map.of("namespace", "inventory", "name", "orders"),
                        Map.of("namespace", "inventory", "name", "products")
                    ));
    }

    @Test
    public void testSchemaIncludeListPatternException() {
        ObjectNode config = ConnectorConfigurationTestingHelper.getConfig(
            Infrastructure.getPostgresConnectorConfiguration(1)
                .with("database.hostname", "localhost")
                .with("database.port", Infrastructure.getPostgresContainer().getMappedPort(5432))
                .with("schema.include.list", "+")
        );

        given().when().contentType(ContentType.JSON).accept(ContentType.JSON).body(config.toString())
            .post(ConnectorResource.API_PREFIX + ConnectorResource.FILTERS_VALIDATION_ENDPOINT, "postgres")
            .then().log().all()
            .statusCode(500)
            .assertThat().body("details", containsString("Dangling meta character '+' near index 0"));
    }

}
