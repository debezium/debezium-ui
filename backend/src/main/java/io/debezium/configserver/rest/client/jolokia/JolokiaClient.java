/*
 * Copyright Debezium Authors.
 *
 * Licensed under the Apache Software License version 2.0, available at http://www.apache.org/licenses/LICENSE-2.0
 */
package io.debezium.configserver.rest.client.jolokia;

import java.util.ArrayList;
import java.util.List;

import javax.management.MalformedObjectNameException;

import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;

import org.jolokia.client.BasicAuthenticator;
import org.jolokia.client.J4pClient;
import org.jolokia.client.exception.J4pException;
import org.jolokia.client.request.J4pReadRequest;
import org.jolokia.client.request.J4pReadResponse;

@ApplicationScoped
public class JolokiaClient {
    public static final int DEFAULT_JOLOKIA_PORT = 8778;
    @Inject
    private JolokiaAttributes jolokiaAttributes;

    public List<String> getAttributeNames() {
        return jolokiaAttributes.getAttributeNames();
    }

    public List<J4pReadResponse> getMetrics(String jolokiaUrl, String connectorType, String serverName, List<String> attributeNames) {
        List<J4pReadResponse> metrics = new ArrayList<>();
        try {
            J4pClient client = getJolokiaClient(jolokiaUrl);
            String mbeanName = String.format("debezium.%s:type=connector-metrics,context=streaming,server=%s", connectorType, serverName);

            for (String attributeName : attributeNames) {
                J4pReadRequest request = new J4pReadRequest(mbeanName, attributeName);
                J4pReadResponse response = client.execute(request);
                metrics.add(response);
            }
        }
        catch (MalformedObjectNameException | J4pException e) {
            throw new RuntimeException(e);
        }
        return metrics;
    }

    private J4pClient getJolokiaClient(String jolokiaUrl) {
        return J4pClient.url(jolokiaUrl)
                .authenticator(new BasicAuthenticator().preemptive())
                .connectionTimeout(3000)
                .build();
    }
}
