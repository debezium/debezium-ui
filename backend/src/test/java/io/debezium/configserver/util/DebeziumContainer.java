/*
 * Copyright Debezium Authors.
 *
 * Licensed under the Apache Software License version 2.0, available at http://www.apache.org/licenses/LICENSE-2.0
 */
package io.debezium.configserver.util;

import io.debezium.configserver.model.ConnectorStatus;
import okhttp3.OkHttpClient;
import okhttp3.Request;
import okhttp3.RequestBody;
import okhttp3.Response;
import org.awaitility.Awaitility;

import javax.json.Json;
import javax.json.JsonArray;
import javax.json.JsonObject;
import javax.json.JsonReader;
import javax.json.JsonString;
import java.io.IOException;
import java.io.StringReader;
import java.util.Collections;
import java.util.List;
import java.util.concurrent.Future;
import java.util.concurrent.TimeUnit;
import java.util.stream.Collectors;

// FIXME eventually to be moved to the parent in Debezium main repo!
public class DebeziumContainer extends io.debezium.testing.testcontainers.DebeziumContainer {

    protected final static OkHttpClient CLIENT = new OkHttpClient();

    public DebeziumContainer(String containerImageName) {
        super(containerImageName);
    }

    public DebeziumContainer(Future<String> image) {
        super(image);
    }

    /**
     * Returns the "/connectors/<connector>" endpoint.
     */
    public String getConnectorURI(String connectorName) {
        return getConnector(connectorName);
    }

    /**
     * Returns the "/connectors/<connector>/pause" endpoint.
     */
    public String getPauseConnectorURI(String connectorName) {
        return getConnectorURI(connectorName) + "/pause";
    }

    /**
     * Returns the "/connectors/<connector>/status" endpoint.
     */
    public String getConnectorStatusURI(String connectorName) {
        return getConnectorURI(connectorName) + "/status";
    }

    /**
     * Returns the "/connectors/<connector>" endpoint.
     */
    public String getConnectorsURI() {
        return getConnectors();
    }

    protected JsonArray parseJsonArray(String JSONString) {
        JsonReader reader = Json.createReader(new StringReader(JSONString));
        JsonArray parsedArray = reader.readArray();
        reader.close();
        return parsedArray;
    }

    protected JsonObject parseJsonObject(String JSONString) {
        JsonReader reader = Json.createReader(new StringReader(JSONString));
        JsonObject parsedObject = reader.readObject();
        reader.close();
        return parsedObject;
    }

    protected static Response executeRequest(Request request) throws IOException {
        return CLIENT.newCall(request).execute();
    }

    protected static Response executeRequestSuccessful(Request request) throws IOException {
        var response = executeRequest(request);
        var responseBodyContent = "{empty response body}";
        if (!response.isSuccessful()) {
            var responseBody = response.body();
            if (null != responseBody) {
                responseBodyContent = responseBody.string();
                responseBody.close();
            }
            throw new IOException("Unexpected response: " + response + " Response Body: " + responseBodyContent);
        }
        return response;
    }

    public boolean connectorIsNotRegistered(String connectorName) throws IOException {
        try (var response = executeRequest(new Request.Builder().url(getConnector(connectorName)).get().build())) {
            var connectorIsNotRegistered = response.code() == 404;
            response.close();
            return connectorIsNotRegistered;
        }
    }

    protected void deleteDebeziumConnector(String connectorName) throws IOException {
        executeRequestSuccessful(new Request.Builder().url(getConnectorURI(connectorName)).delete().build()).close();
    }

    public void deleteConnector(String connectorName) throws IOException {
        deleteDebeziumConnector(connectorName);

        Awaitility.await()
                .atMost(10, TimeUnit.SECONDS)
                .until(() -> connectorIsNotRegistered(connectorName));
    }

    public List<String> getRegisteredConnectors() throws IOException {
        var request = new Request.Builder().url(getConnectorsURI()).get().build();
        try(var responseBody = executeRequestSuccessful(request).body()) {
            if (null != responseBody) {
                var string = responseBody.string();
                responseBody.close();
                return parseJsonArray(string).getValuesAs(JsonString.class).stream()
                        .map(JsonString::getString)
                        .collect(Collectors.toList());
            }
        }
        return Collections.emptyList();
    }

    public boolean isConnectorConfigured(String connectorName) throws IOException {
        var request = new Request.Builder().url(getConnectorURI(connectorName)).get().build();
        try (var response = executeRequest(request)) {
            var isConnectorConfigured = response.isSuccessful();
            response.close();
            return isConnectorConfigured;
        }
    }

    public void ensureConnectorRegistered(String connectorName) {
        Awaitility.await()
                .atMost(10, TimeUnit.SECONDS)
                .until(() -> isConnectorConfigured(connectorName));
    }

    public void deleteAllConnectors() throws IOException {
        var connectorNames = getRegisteredConnectors();

        for (String connectorName : connectorNames) {
            deleteDebeziumConnector(connectorName);
        }

        Awaitility.await()
                .atMost(10, TimeUnit.SECONDS)
                .until(() -> getRegisteredConnectors().size() == 0);
    }

    public ConnectorStatus.State getConnectorState(String connectorName) throws IOException {
        final Request request = new Request.Builder().url(getConnectorStatusURI(connectorName)).get().build();
        var responseBody = executeRequestSuccessful(request).body();
        if (null != responseBody) {
            JsonObject parsedObject = parseJsonObject(responseBody.string());
            responseBody.close();
            return ConnectorStatus.State.valueOf(parsedObject.getJsonObject("connector").getString("state"));
        }
        return null;
    }

    public ConnectorStatus.State getConnectorTaskState(String connectorName, int taskNumber) throws IOException {
        final Request request = new Request.Builder().url(getConnectorStatusURI(connectorName)).get().build();
        var responseBody = executeRequestSuccessful(request).body();
        if (null != responseBody) {
            JsonObject parsedObject = parseJsonObject(responseBody.string());
            responseBody.close();
            return ConnectorStatus.State.valueOf(parsedObject.getJsonArray("tasks").getJsonObject(taskNumber).getString("state"));
        }
        return null;
    }

    public void pauseConnector(String connectorName) throws IOException {
        final Request request = new Request.Builder()
                .url(getPauseConnectorURI(connectorName))
                .put(RequestBody.create("", JSON))
                .build();
        executeRequestSuccessful(request).close();

        Awaitility.await()
                .atMost(10, TimeUnit.SECONDS)
                .until(() -> getConnectorState(connectorName) == ConnectorStatus.State.PAUSED);
    }

    public void ensureConnectorState(String connectorName, ConnectorStatus.State status) throws IOException {
        Awaitility.await()
                .atMost(10, TimeUnit.SECONDS)
                .until(() -> getConnectorState(connectorName) == status);
    }
    public void ensureConnectorTaskState(String connectorName, int taskNumber, ConnectorStatus.State status) throws IOException {
        Awaitility.await()
                .atMost(10, TimeUnit.SECONDS)
                .until(() -> getConnectorTaskState(connectorName, taskNumber) == status);
    }
}
