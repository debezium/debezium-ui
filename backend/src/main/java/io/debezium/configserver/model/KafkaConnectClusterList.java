package io.debezium.configserver.model;

import org.eclipse.microprofile.openapi.annotations.enums.SchemaType;
import org.eclipse.microprofile.openapi.annotations.media.Schema;

import java.net.URI;
import java.util.ArrayList;
import java.util.Collection;

@Schema(implementation = String.class, type = SchemaType.ARRAY, example = "[\"http://localhost:1234\"]")
public class KafkaConnectClusterList extends ArrayList<URI> {

    public KafkaConnectClusterList(int initialCapacity) {
        super(initialCapacity);
    }

    public KafkaConnectClusterList() {
        super();
    }

    public KafkaConnectClusterList(Collection<? extends URI> c) {
        super(c);
    }
}
