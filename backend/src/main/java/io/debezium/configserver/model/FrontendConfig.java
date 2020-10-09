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
