package io.debezium.configserver.model;

import javax.json.bind.annotation.JsonbProperty;

public class ConnectTaskStatus {

    public Long id;

    @JsonbProperty("state")
    public ConnectorStatus.State status;

    @JsonbProperty("worker_id")
    public String workerId;

    @Override
    public String toString() {
        return "ConnectTaskStatus{" +
                "id=" + id +
                ", status=" + status +
                ", workerId='" + workerId + '\'' +
                '}';
    }
}
