/*
 * Copyright Debezium Authors.
 *
 * Licensed under the Apache Software License version 2.0, available at http://www.apache.org/licenses/LICENSE-2.0
 */
package io.debezium.configserver.model;

public class FrontendConfigArtifacts {

    public final String type;
    public final String url;

    public FrontendConfigArtifacts(String type, String url) {
        this.type = type;
        this.url = url;
    }
}
