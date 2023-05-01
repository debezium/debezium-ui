/*
 * Copyright Debezium Authors.
 *
 * Licensed under the Apache Software License version 2.0, available at http://www.apache.org/licenses/LICENSE-2.0
 */
package io.debezium.configserver;

import io.debezium.configserver.rest.ConnectorURIs;
import io.debezium.configserver.util.Infrastructure;
import io.debezium.configserver.util.MongoDbInfrastructureTestProfile;
import io.debezium.connector.mongodb.MongoDbConnectorConfig;
import io.debezium.testing.testcontainers.ConnectorConfiguration;
import io.quarkus.test.junit.QuarkusTest;
import io.quarkus.test.junit.TestProfile;
import io.restassured.http.ContentType;

import org.junit.jupiter.api.Test;

import java.util.Map;

import static io.restassured.RestAssured.given;
import static org.hamcrest.CoreMatchers.equalTo;
import static org.hamcrest.CoreMatchers.hasItems;
import static org.hamcrest.CoreMatchers.is;

@QuarkusTest
@TestProfile(MongoDbInfrastructureTestProfile.class)
public class ValidateMongoDbFiltersIT {

    @Test
    public void testEmptyMongoDbFilters() {
        ConnectorConfiguration config = Infrastructure.getMongoDbConnectorConfiguration(1)
                .with(MongoDbConnectorConfig.CONNECTION_STRING.name(),
                         Infrastructure.getMongoDbContainer().getConnectionString());

        given().when().contentType(ContentType.JSON).accept(ContentType.JSON).body(config.toJson())
            .post(ConnectorURIs.API_PREFIX + ConnectorURIs.FILTERS_VALIDATION_ENDPOINT, "mongodb")
            .then().log().all()
            .statusCode(200)
            .assertThat().body("status", equalTo("VALID"))
                .body("propertyValidationResults.size()", is(0))
                .body("matchedCollections.size()", is(3))
                .body("matchedCollections",
                    hasItems(
                        Map.of("namespace", "rs0.inventory", "name", "customers"),
                        Map.of("namespace", "rs0.inventory", "name", "orders"),
                        Map.of("namespace", "rs0.inventory", "name", "products")
                    ));
    }

    @Test
    public void testValidTableIncludeList() {
        ConnectorConfiguration config = Infrastructure.getMongoDbConnectorConfiguration(1)
                .with(MongoDbConnectorConfig.CONNECTION_STRING.name(),
                         Infrastructure.getMongoDbContainer().getConnectionString())
                .with(MongoDbConnectorConfig.COLLECTION_INCLUDE_LIST.name(), "inventory\\.product.*");

        given().when().contentType(ContentType.JSON).accept(ContentType.JSON).body(config.toJson())
            .post(ConnectorURIs.API_PREFIX + ConnectorURIs.FILTERS_VALIDATION_ENDPOINT, "mongodb")
            .then().log().all()
            .statusCode(200)
            .assertThat().body("status", equalTo("VALID"))
                .body("propertyValidationResults.size()", is(0))
                .body("matchedCollections.size()", is(1))
                .body("matchedCollections",
                    hasItems(
                        Map.of("namespace", "rs0.inventory", "name", "products")
                    ));
    }

    @Test
    public void testValidDatabaseIncludeList() {
        ConnectorConfiguration config = Infrastructure.getMongoDbConnectorConfiguration(1)
                .with(MongoDbConnectorConfig.CONNECTION_STRING.name(),
                         Infrastructure.getMongoDbContainer().getConnectionString())
                .with(MongoDbConnectorConfig.DATABASE_INCLUDE_LIST.name(), "inventory");

        given().when().contentType(ContentType.JSON).accept(ContentType.JSON).body(config.toJson())
            .post(ConnectorURIs.API_PREFIX + ConnectorURIs.FILTERS_VALIDATION_ENDPOINT, "mongodb")
            .then().log().all()
            .statusCode(200)
            .assertThat().body("status", equalTo("VALID"))
                .body("propertyValidationResults.size()", is(0))
                .body("matchedCollections.size()", is(3))
                .body("matchedCollections",
                    hasItems(
                        Map.of("namespace", "rs0.inventory", "name", "customers"),
                        Map.of("namespace", "rs0.inventory", "name", "orders"),
                        Map.of("namespace", "rs0.inventory", "name", "products")
                    ));
    }

    @Test
    public void testDatabaseIncludeListPatternInvalid() {
        ConnectorConfiguration config = Infrastructure.getMongoDbConnectorConfiguration(1)
                .with(MongoDbConnectorConfig.CONNECTION_STRING.name(),
                         Infrastructure.getMongoDbContainer().getConnectionString())
                .with(MongoDbConnectorConfig.DATABASE_INCLUDE_LIST.name(), "+");

        given().when().contentType(ContentType.JSON).accept(ContentType.JSON).body(config.toJson())
            .post(ConnectorURIs.API_PREFIX + ConnectorURIs.FILTERS_VALIDATION_ENDPOINT, "mongodb")
            .then().log().all()
            .statusCode(200)
            .assertThat().body("status", equalTo("INVALID"))
                .body("propertyValidationResults.size()", is(1))
                .body("matchedCollections.size()", is(0))
                .rootPath("propertyValidationResults[0]")
                .body("property", equalTo(MongoDbConnectorConfig.DATABASE_INCLUDE_LIST.name()))
                .body("message", equalTo("The 'database.include.list' value is invalid: A comma-separated list of valid regular expressions is expected, but Dangling meta character '+' near index 0\n+\n^"));
    }

    @Test
    public void testDatabaseExcludeListPatternInvalid() {
        ConnectorConfiguration config = Infrastructure.getMongoDbConnectorConfiguration(1)
                .with(MongoDbConnectorConfig.CONNECTION_STRING.name(),
                         Infrastructure.getMongoDbContainer().getConnectionString())
                .with(MongoDbConnectorConfig.DATABASE_EXCLUDE_LIST.name(), "+");

        given().when().contentType(ContentType.JSON).accept(ContentType.JSON).body(config.toJson())
            .post(ConnectorURIs.API_PREFIX + ConnectorURIs.FILTERS_VALIDATION_ENDPOINT, "mongodb")
            .then().log().all()
            .statusCode(200)
            .assertThat().body("status", equalTo("INVALID"))
                .body("propertyValidationResults.size()", is(1))
                .body("matchedCollections.size()", is(0))
                .rootPath("propertyValidationResults[0]")
                .body("property", equalTo(MongoDbConnectorConfig.DATABASE_EXCLUDE_LIST.name()))
                .body("message", equalTo("The 'database.exclude.list' value is invalid: A comma-separated list of valid regular expressions is expected, but Dangling meta character '+' near index 0\n+\n^"));
    }

}
