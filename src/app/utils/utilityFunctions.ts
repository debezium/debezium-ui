export const isEmpty = (value: string | undefined | null) => {
  return (
    value == null || (typeof value === "string" && value.trim().length === 0)
  );
};

export const getConnectorClass = (connectorType: string | undefined) => {
  switch (connectorType) {
    case "mysql":
      return "io.debezium.connector.mysql.MySqlConnector";
    case "postgres":
      return "io.debezium.connector.postgresql.PostgresConnector";
    case "mongodb":
      return "io.debezium.connector.mongodb.MongoDbConnector";
    case "sqlserver":
      return "io.debezium.connector.sqlserver.SqlServerConnector";
    case "oracle":
      return "io.debezium.connector.oracle.OracleConnector";
    default:
      return "";
  }
};


export function mapToObject(map:  Map<string, string>) {
  const obj = {} as Record<string, string>;
  map.forEach((value, key) => {
    obj[key] = value;
  });
  return obj;
}