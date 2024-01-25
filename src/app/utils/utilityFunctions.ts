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

export const getConnectorType = (connectorType: string | undefined) => {
  switch (connectorType) {
    case "io.debezium.connector.mysql.MySqlConnector":
      return "mysql";
    case "io.debezium.connector.postgresql.PostgresConnector":
      return "postgres";
    case "io.debezium.connector.mongodb.MongoDbConnector":
      return "mongodb";
    case "io.debezium.connector.sqlserver.SqlServerConnector":
      return "sqlserver";
    case "io.debezium.connector.oracle.OracleConnector":
      return "oracle";
    default:
      return "";
  }
};

export function mapToObject(map: Map<string, string>) {
  const obj = {} as Record<string, string>;
  map.forEach((value, key) => {
    obj[key] = value;
  });
  return obj;
}

export const convertMilliSecToTime = (millisec: number) => {
  const seconds = (millisec / 1000).toFixed(1);
  const minutes = (millisec / (1000 * 60)).toFixed(2);
  const hours = (millisec / (1000 * 60 * 60)).toFixed(2);
  const days = (millisec / (1000 * 60 * 60 * 24)).toFixed(1);
  if (parseInt(seconds) < 60) {
    return seconds + " Sec";
  } else if (parseInt(minutes) < 60) {
    return minutes + " Min";
  } else if (parseInt(hours) < 24) {
    return hours + " Hrs";
  } else {
    return days + " Days";
  }
};

export type TaskStateColor =
  | "blue"
  | "cyan"
  | "green"
  | "orange"
  | "purple"
  | "red"
  | "grey"
  | "gold"
  | undefined;

export const getTaskStatus = (taskState: string): TaskStateColor => {
  let labelColor: TaskStateColor;
  switch (taskState) {
    case "RUNNING":
      labelColor = "green";
      break;
    case "STOPPED":
      labelColor = "orange";
      break;
    case "PAUSED":
      labelColor = "blue";
      break;
    case "FAILED":
    case "DESTROYED":
      labelColor = "red";
      break;
    default:
      labelColor = "blue";
      break;
  }
  return labelColor;
};
