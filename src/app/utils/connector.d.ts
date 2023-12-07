interface Info {
  name: string;
  config: Record<string, string>;
  tasks?: InfoTasks[] | null;
  type: string;
}
interface InfoTasks {
  connector: string;
  task: number;
}

interface ConnectorInfo {
  info: Info;
}

interface Status {
  name: string;
  connector: Connector;
  tasks?: StatusTasks[] | null;
  type: string;
}
interface Connector {
  state: string;
  worker_id: string;
}
interface StatusTasks {
  id: number;
  state: string;
  worker_id: string;
  trace: string;
}

interface DataCollection {
  name: string;
  namespace: string;
  identifier: string;
}

interface ConnectorStatus {
  status: Status;
}
interface ConnectorPlugin {
  id: string;
  displayName: string;
  className: string;
  version: string;
}

interface ConnectorProperties {
  format?: string;
  default?: any;
  title: string;
  description: string;
  type: string;
  nullable?: boolean;
  enum?: string[] | null;
  "x-name": string;
  "x-category": string;
}

interface ConnectorSchema {
  title: string;
  required?: string[] | null;
  type: string;
  properties: Record<string, ConnectorProperties>;
  additionalProperties?: boolean;
  "x-connector-id": string;
  "x-version": string;
  "x-classNames": string;
}

interface ConnectorConfig {
  name: string;
  config: Record<string, string>;
}

interface ConnectorTask {
  connector: string;
  task: number;
}
interface ConnectorConfigResponse {
  name: string;
  config: Record<string, string>;
  tasks: ConnectorTask[];
  type: ConnectorType;
}

enum ConnectorType {
  "source",
  "sink",
}

interface ConnectorNameStatus {
  name: string;
  connector: Connector;
  tasks: StatusTasks[];
}


interface SchemaComponent {
  schemas: Record<string, ConnectorSchema>;
}

interface OpenApiSchema {
  openapi: string;
  info: Info;
  components: SchemaComponent;
}
