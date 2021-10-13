/*
 * Copyright Debezium Authors.
 *
 * Licensed under the Apache Software License version 2.0, available at http://www.apache.org/licenses/LICENSE-2.0
 */
package io.debezium.configserver;

import io.debezium.configserver.rest.ConnectorURIs;
import io.debezium.configserver.rest.KafkaConnectResource;
import io.debezium.configserver.util.NoDatabaseInfrastructureTestProfile;
import io.quarkus.test.junit.QuarkusTest;
import io.quarkus.test.junit.TestProfile;
import org.junit.jupiter.api.Test;

import static io.restassured.RestAssured.given;
import static org.hamcrest.Matchers.containsInAnyOrder;
import static org.hamcrest.Matchers.is;

@QuarkusTest
@TestProfile(NoDatabaseInfrastructureTestProfile.class)
public class KafkaConnectResourceIT {

    @Test
    public void testTopicCreationEnabledEnpoint() {
        given()
                .when().get(ConnectorURIs.API_PREFIX + ConnectorURIs.TOPIC_CREATION_ENABLED, 1)
                .then().log().all()
                .statusCode(200)
                .body(is("true"));
    }

    @Test
    public void testListTransformsEndpoint() {
        given()
          .when().get(ConnectorURIs.API_PREFIX + ConnectorURIs.TRANSFORMS_LIST, 1)
          .then().log().all()
             .statusCode(200)
             .body("size()", is(KafkaConnectResource.ENABLED_TRANSFORMS.size()))
             .body("transform", containsInAnyOrder(KafkaConnectResource.ENABLED_TRANSFORMS.toArray()));
    }

}
