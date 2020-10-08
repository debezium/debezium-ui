package io.debezium.configserver.model;

public class FrontendConfigArtifacts {

    public final String type;
    public final String url;

    public FrontendConfigArtifacts(String type, String url) {
        this.type = type;
        this.url = url;
    }
}
