/*
 * Copyright Debezium Authors.
 *
 * Licensed under the Apache Software License version 2.0, available at http://www.apache.org/licenses/LICENSE-2.0
 */
package io.debezium.configserver.util;

import java.io.IOException;
import java.io.InputStream;
import java.util.Properties;

public class PropertiesReader {

    private static PropertiesReader DEBEZIUM_PROPERTIES_READER = null;
    private final Properties properties;

    public PropertiesReader(String propertyFileName) throws IOException {
        InputStream is = getClass().getClassLoader().getResourceAsStream(propertyFileName);
        this.properties = new Properties();
        this.properties.load(is);
    }

    public static PropertiesReader debeziumPropertiesReader() {
        if (null == DEBEZIUM_PROPERTIES_READER) {
            try {
                DEBEZIUM_PROPERTIES_READER = new PropertiesReader("debezium-build.properties");
            }
            catch (IOException e) {
                throw new RuntimeException(e);
            }
        }
        return DEBEZIUM_PROPERTIES_READER;
    }

    public String getProperty(String propertyName) {
        return this.properties.getProperty(propertyName);
    }
}
