package io.debezium.configserver.model;

public class DataCollection {

    // schema or catalog
    public String namespace;
    public String name;

    public DataCollection(String namespace, String name) {
        this.namespace = namespace;
        this.name = name;
    }
}
