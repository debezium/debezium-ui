package io.debezium.configserver.model;

import javax.json.bind.annotation.JsonbProperty;
import java.util.List;

public class ConnectConnectorStatusResponse {

    public enum Type {
        sink,
        source
    }

    @JsonbProperty("connector")
    public ConnectConnectorStatus connectorStatus;

    public String name;

    @JsonbProperty("tasks")
    public List<ConnectTaskStatus> taskStates;

    @JsonbProperty("type")
    public Type connectorType;

    @Override
    public String toString() {
        return "ConnectConnectorStatusResponse{" +
                "name='" + name + '\'' +
                ", connectorStatus=" + connectorStatus +
                ", taskStates=" + taskStates +
                ", connectorType=" + connectorType +
                '}';
    }
}
