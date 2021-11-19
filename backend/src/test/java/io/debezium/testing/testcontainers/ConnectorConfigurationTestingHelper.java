/*
 * Copyright Debezium Authors.
 *
 * Licensed under the Apache Software License version 2.0, available at http://www.apache.org/licenses/LICENSE-2.0
 */
package io.debezium.testing.testcontainers;

import com.fasterxml.jackson.databind.node.ObjectNode;

import java.lang.reflect.InvocationTargetException;
import java.lang.reflect.Method;

public class ConnectorConfigurationTestingHelper {

    public static ObjectNode getConfig(ConnectorConfiguration config) {
        try {
            Method getConfigurationMethod = config.getClass().getDeclaredMethod("getConfiguration");
            getConfigurationMethod.setAccessible(true);
            return (ObjectNode) getConfigurationMethod.invoke(config);
        }
        catch (NoSuchMethodException | IllegalAccessException | InvocationTargetException e) {
            throw new RuntimeException(e);
        }
    }

}
