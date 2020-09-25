package io.debezium.configserver.model;

import org.eclipse.microprofile.openapi.annotations.enums.SchemaType;
import org.eclipse.microprofile.openapi.annotations.media.Schema;

import java.util.HashMap;
import java.util.Map;

public class ConnectorStatus {

    private String name;
    private State connectorStatus;
    private String connectorType;

    @Schema(example = "{\"0\": \"RUNNING\", \"1\": \"PAUSED\"}")
    private final Map<Long, State> taskStates = new HashMap<>();


    public enum State {
        UNASSIGNED,
        RUNNING,
        PAUSED,
        FAILED,
        DESTROYED
    }

    public ConnectorStatus(String name) {
        this.name = name;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public State getConnectorStatus() {
        return connectorStatus;
    }

    public void setConnectorStatus(State connectorStatus) {
        this.connectorStatus = connectorStatus;
    }

    public Map<Long, State> getTaskStates() {
        return taskStates;
    }

    public State getTaskState(Long taskNumber) {
        return taskStates.get(taskNumber);
    }

    public void setTaskState(Long taskNumber, State state) {
        this.taskStates.put(taskNumber, state);
    }

    public void setConnectorType(String connectorType) {
        switch (connectorType) {
            case "io.debezium.connector.postgresql.PostgresConnector":
                this.connectorType = "PostgreSQL";
                break;
            case "io.debezium.connector.mongodb.MongoDbConnector":
                this.connectorType = "MongoDB";
                break;
            case "io.debezium.connector.mysql.MySqlConnector":
                this.connectorType = "MySQL";
                break;
            case "io.debezium.connector.sqlserver.SqlServerConnector":
                this.connectorType = "SQL Server";
                break;
            default:
                this.connectorType = connectorType;
                break;
        }
    }

    public String getConnectorType() {
        return connectorType;
    }

    @Override
    public String toString() {
        return "ConnectorStatus{" +
                "connectorType='" + connectorType + '\'' +
                ", connectorState=" + connectorStatus +
                ", taskStates=" + taskStates +
                '}';
    }
}
