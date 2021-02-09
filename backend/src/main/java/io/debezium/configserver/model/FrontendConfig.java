/*
 * Copyright Debezium Authors.
 *
 * Licensed under the Apache Software License version 2.0, available at http://www.apache.org/licenses/LICENSE-2.0
 */
package io.debezium.configserver.model;

public class FrontendConfig {

    public FrontendConfig(String baseURI, UIMode mode) {
        this("rest", baseURI, mode);
    }

    public FrontendConfig(String artifactType, String baseURI, UIMode mode) {
        this.artifacts = new FrontendConfigArtifacts(artifactType, baseURI);
        this.mode = mode;
    }

    public enum UIMode {
        dev,
        prod
    }

    public final UIMode mode;
    public final FrontendConfigArtifacts artifacts;

}
