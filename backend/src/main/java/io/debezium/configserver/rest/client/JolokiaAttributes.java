/*
 * Copyright Debezium Authors.
 *
 * Licensed under the Apache Software License version 2.0, available at http://www.apache.org/licenses/LICENSE-2.0
 */
package io.debezium.configserver.rest.client;

import java.io.IOException;
import java.io.InputStream;
import java.nio.charset.StandardCharsets;
import java.util.Collections;
import java.util.List;

import jakarta.enterprise.context.ApplicationScoped;

import org.apache.commons.io.IOUtils;

/**
 * A simple cache configurable Jolokia attributes that are to be fetched for metrics requests.
 *
 * @author Chris Cranford
 */
@ApplicationScoped
public class JolokiaAttributes {

    private final List<String> attributeNames;

    public JolokiaAttributes() {
        try {
            final InputStream stream = getClass().getClassLoader().getResourceAsStream("attributes.txt");
            if (stream != null) {
                attributeNames = IOUtils.readLines(stream, StandardCharsets.UTF_8);
            }
            else {
                attributeNames = Collections.emptyList();
            }
        }
        catch (IOException e) {
            throw new RuntimeException(e);
        }
    }

    public List<String> getAttributeNames() {
        return attributeNames;
    }

}
