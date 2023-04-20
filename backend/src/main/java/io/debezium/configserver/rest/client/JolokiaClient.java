/*
 * Copyright Debezium Authors.
 *
 * Licensed under the Apache Software License version 2.0, available at http://www.apache.org/licenses/LICENSE-2.0
 */
package io.debezium.configserver.rest.client;

import java.util.List;
import java.util.stream.Collectors;

import javax.management.MalformedObjectNameException;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;

import org.eclipse.microprofile.config.inject.ConfigProperty;
import org.jolokia.client.BasicAuthenticator;
import org.jolokia.client.J4pClient;
import org.jolokia.client.exception.J4pException;
import org.jolokia.client.request.J4pReadRequest;
import org.jolokia.client.request.J4pReadResponse;

@ApplicationScoped
public class JolokiaClient {

    public static final String PROPERTY_JOLOKIA_CLIENT_URI = "jolokia.client.uri";

    @ConfigProperty(name = PROPERTY_JOLOKIA_CLIENT_URI)
    private String jolokiaUrl;

    @Inject
    JolokiaAttributes jolokiaAttributes;

    public List<String> getAttributeNames() {
        return jolokiaAttributes.getAttributeNames();
    }

    public List<J4pReadResponse> getMetrics(String connectorType, String serverName, List<String> attributeNames) {
        final J4pClient client = getJolokiaClient();
        return attributeNames.stream().map(attributeName -> {
            try {
                return getMetrics(client, connectorType, serverName, attributeName);
            }
            catch (MalformedObjectNameException | J4pException e) {
                throw new RuntimeException(e);
            }
        }).collect(Collectors.toList());
    }

    public J4pReadResponse getMetrics(J4pClient client, String connectorType, String serverName, String attributeName)
            throws MalformedObjectNameException, J4pException {
        String mbeanName = String.format("debezium.%s:type=connector-metrics,context=streaming,server=%s", connectorType, serverName);
        J4pReadRequest request = new J4pReadRequest(mbeanName, attributeName);
        return client.execute(request);
    }

    private J4pClient getJolokiaClient() {
        return J4pClient.url(jolokiaUrl)
                .authenticator(new BasicAuthenticator().preemptive())
                .connectionTimeout(3000)
                .useProxyFromEnvironment()
                .build();
    }
}
