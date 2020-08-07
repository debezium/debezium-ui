package io.debezium.configserver.rest;

import java.util.List;

import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;

import io.debezium.configserver.model.Connector;

@Path("/api/connector")
public class ConnectorResource {

    @GET
    @Produces(MediaType.APPLICATION_JSON)
    public List<Connector> getConnectors() {
        return List.of(
                new Connector("io.debezium.connector.postgresql.PostgresConnector", "Postgres", "1.2.1.Final", true),
                new Connector("io.debezium.connector.mysql.MySqlConnector", "MySQL", "1.2.1.Final", false),
                new Connector("io.debezium.connector.sqlserver.SqlServerConnector", "SQL Server", "1.2.1.Final", false),
                new Connector("io.debezium.connector.mongodb.MongoDbConnector", "MongoDB", "1.2.1.Final", false)
        );
    }
}
