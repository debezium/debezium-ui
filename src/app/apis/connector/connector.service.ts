/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * @license
 * Copyright 2020 JBoss Inc
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
import { BaseService } from "../baseService";
// import { ConnectionValidationResult, Connector, ConnectorType, FilterValidationResult, Metrics, PropertiesValidationResult } from "@debezium/ui-models";


/**
 * The connector service.  Used to fetch connectors and other connector operations.
 */
export class ConnectorService extends BaseService {
  /**
   * Get the details of connector for supplied connection type
   * Example usage:
   *
   * const connectorService = Services.getConnectorService();
   * connectorService.getConnectorInfo('postgres')
   *  .then((cDetails: ConnectorType) => {
   *      alert(cDetails);
   *  })
   * .catch((err: Error) => {
   *      alert(err);
   *  });
   */
  public getConnectorsStatus(baseHref: string): Promise<any> {
    this.logger?.info(
      "[ConnectorService] Getting the list of Connectors and status:",
    );
    const endpoint: string = this.endpoint(
      "connectors/",
      baseHref,
      undefined,
      { expand: "status" }
    );
    return this.httpGet<any>(endpoint);
  }

  public getConnectorsInfo(baseHref: string): Promise<any> {
    this.logger?.info(
      "[ConnectorService] Getting the list of Connectors and Info:",
    );
    const endpoint: string = this.endpoint(
      "connectors/",
      baseHref,
      undefined,
      { expand: "info" }
    );
    return this.httpGet<any>(endpoint);
  }

  public deleteConnector(baseHref: string, connectorName: string): Promise<any> {
    this.logger?.info(
      `[ConnectorService] Delete the ${connectorName} connector:`,
    );
    const endpoint: string = this.endpoint(
      "connectors/:connectorName",
      baseHref,
      {  connectorName }
    );
    return this.httpDelete<any>(endpoint);
  }

  public pauseConnector(baseHref: string, connectorName: string): Promise<any> {
    this.logger?.info(
      `[ConnectorService] Pause the ${connectorName} connector:`,
    );
    const endpoint: string = this.endpoint(
      "connectors/:connectorName/pause ",
      baseHref,
      {  connectorName }
    );
    return this.httpPut<any>(endpoint, {});
  }

  public resumeConnector(baseHref: string, connectorName: string): Promise<any> {
    this.logger?.info(
      `[ConnectorService] Resume the ${connectorName} connector:`,
    );
    const endpoint: string = this.endpoint(
      "connectors/:connectorName/resume ",
      baseHref,
      {  connectorName }
    );
    return this.httpPut<any>(endpoint, {});
  }

  public restartConnector(baseHref: string, connectorName: string): Promise<any> {
    this.logger?.info(
      `[ConnectorService] Restart the ${connectorName} connector:`,
    );
    const endpoint: string = this.endpoint(
      "connectors/:connectorName/restart ",
      baseHref,
      {  connectorName }
    );
    return this.httpPost<any>(endpoint, {});
  }

  public getConnectorPlugins(baseHref: string): Promise<any> {
    this.logger?.info(
      "[ConnectorService] Getting the list of Connector plugins:",
    );
    const endpoint: string = this.endpoint(
      "debezium/connector-plugins",
      baseHref,
      undefined,
    );
    return this.httpGet<any>(endpoint);
  }

  public getConnectorSchema(baseHref: string, connectorId: string): Promise<any> {
    this.logger?.info(
      "[ConnectorService] Getting the OpenAPI schema for the specific connector type id:",
    );
    const endpoint: string = this.endpoint(
      "debezium/:connectorId/schema ",
      baseHref,
      {  connectorId }
    );
    return this.httpGet<any>(endpoint);
  }

  public getConnectorConfig(baseHref: string, connectorName: string): Promise<any> {
    this.logger?.info(
      "[ConnectorService] Getting the connector configuration for:"+ connectorName,
    );
    const endpoint: string = this.endpoint(
      "connectors/:connectorName/config ",
      baseHref,
      {  connectorName }
    );
    return this.httpGet<any>(endpoint);
  }

  public getConnectorStatus(baseHref: string, connectorName: string): Promise<any> {
    this.logger?.info(
      "[ConnectorService] Getting the current connector status for:"+ connectorName,
    );
    const endpoint: string = this.endpoint(
      "connectors/:connectorName/status ",
      baseHref,
      {  connectorName }
    );
    return this.httpGet<any>(endpoint);
  }


  public createConnector(baseHref: string, connectorPayload: ConnectorConfig): Promise<ConnectorConfigResponse> {
    this.logger?.info(`[ConnectorService] Creating a connector name ${connectorPayload.name}`);

    const endpoint: string = this.endpoint(
      "connectors/",
      baseHref,
      ""
    );
    return this.httpPostWithReturn(endpoint, connectorPayload);
  }

  public validateFilters(baseHref: string, filterPayload: Record<string,string>, connectorId: string,): Promise<any> {
    this.logger?.info(`[ConnectorService] Validate the filter properties and get the applied filter response from database`);

    const endpoint: string = this.endpoint(
      "debezium/:connectorId/validate/filters",
      baseHref,
      {  connectorId }
    );
    return this.httpPutWithReturn(endpoint, filterPayload);
  }

  public validateConnection(baseHref: string, connectionPayload: Record<string,string>, connectorId: string,): Promise<any> {
    this.logger?.info(`[ConnectorService] Validate the filter properties and get the applied filter response from database`);

    const endpoint: string = this.endpoint(
      "debezium/:connectorId/validate/connection",
      baseHref,
      {  connectorId }
    );
    return this.httpPutWithReturn(endpoint, connectionPayload);
  }
  

  /**
   * Validate the connection properties for the supplied connection type
   * Example usage:
   *
   * const connectorService = Services.getConnectorService();
   * const body = { "oneParm: oneValue", "twoParam: twoValue"}
   * connectorService.validateConnection('postgres', body)
   *  .then((result: ConnectionValidationResult) => {
   *    if (result.status === 'INVALID') {
   *      alert('status is INVALID');
   *    } else {
   *      alert('status is VALID');
   *    }
   *  });
   */
  // public validateConnection(
  //   connectorTypeId: string,
  //   body: any
  // ): Promise<any> {
  //   this.logger?.info(
  //     "[ConnectorService] Validating connection:",
  //     connectorTypeId
  //   );

  //   const endpoint: string = this.endpoint(
  //     "/connector-types/:connectorTypeId/validation/connection",
  //     "",
  //     { connectorTypeId }
  //   );
  //   return this.httpPostWithReturn(endpoint, body);
  // }

  /**
   * Validate the filters for the supplied connection type
   * Example usage:
   *
   * const connectorService = Services.getConnectorService();
   * const body = { "oneParm: oneValue", "twoParam: twoValue"}
   * connectorService.validateFilters('postgres', body)
   *  .then((result: FilterValidationResult) => {
   *    if (result.status === 'INVALID') {
   *      alert('status is INVALID');
   *    } else {
   *      alert('status is VALID');
   *    }
   *  });
   */
  // public validateFilters(
  //   connectorTypeId: string,
  //   body: any
  // ): Promise<any> {
  //   this.logger?.info(
  //     "[ConnectorService] Validating filters:",
  //     connectorTypeId
  //   );

  //   const endpoint: string = this.endpoint(
  //     "/connector-types/:connectorTypeId/validation/filters",
  //     "",
  //     { connectorTypeId }
  //   );
  //   return this.httpPostWithReturn(endpoint, body);
  // }

  /**
   * Validate the properties for the supplied connection type
   * Example usage:
   *
   * const connectorService = Services.getConnectorService();
   * const body = { "oneParm: oneValue", "twoParam: twoValue"}
   * connectorService.validateProperties('postgres', body)
   *  .then((result: PropertiesValidationResult) => {
   *    if (result.status === 'INVALID') {
   *      alert('status is INVALID');
   *    } else {
   *      alert('status is VALID');
   *    }
   *  });
   */
  public validateProperties(
    connectorTypeId: string,
    body: any
  ): Promise<any> {
    this.logger?.info(
      "[ConnectorService] Validating properties:",
      connectorTypeId
    );

    const endpoint: string = this.endpoint(
      "/connector-types/:connectorTypeId/validation/properties",
      "",
      { connectorTypeId }
    );
    return this.httpPostWithReturn(endpoint, body);
  }

  /**
   * Create Connector using the supplied ConnectorConfiguration
   * Example usage:
   *
   * const connectorService = Services.getConnectorService();
   * const configMap = new Map<string,string>();
   * configMap.set("oneParam","oneValue");
   * configMap.set("twoParam","twoValue");
   * const config = new ConnectorConfiguration("connName", configMap);
   * connectorService.createConnector(config)
   *  .then((result: CreateConnectorResult) => {
   *  });
   */
  // public createConnector(
  //   clusterId: number,
  //   connectorTypeId: string,
  //   body: any
  // ): Promise<void> {
  //   this.logger?.info("[ConnectorService] Creating a connector:");

  //   const endpoint: string = this.endpoint(
  //     "/connector/:clusterId/:connectorTypeId",
  //     "",
  //     { clusterId, connectorTypeId }
  //   );
  //   return this.httpPostWithReturn(endpoint, body);
  // }

  /**
   * Create Connector using the supplied ConnectorConfiguration
   * Example usage:
   *
   * const connectorService = Services.getConnectorService();
   * const configMap = new Map<string,string>();
   * configMap.set("oneParam","oneValue");
   * configMap.set("twoParam","twoValue");
   * const config = new ConnectorConfiguration("connName", configMap);
   * connectorService.createConnector(config)
   *  .then((result: CreateConnectorResult) => {
   *  });
   */
  public updateConnectorConfig(
    clusterId: number,
    connectorName: string,
    body: any
  ): Promise<void> {
    this.logger?.info("[ConnectorService] update a connector:");

    const endpoint: string = this.endpoint(
      "/connectors/:clusterId/:connectorName",
      "",
      { clusterId, connectorName }
    );
    return this.httpPut(endpoint, body);
  }
  /**
   * Get the available connectors for the supplied clusterId
   */
  public getConnectors(clusterId: number): Promise<any[]> {
    this.logger?.info("[ConnectorService] Getting the list of connectors.");

    const endpoint: string = this.endpoint(
      "/connectors/:clusterId",
      "",
      { clusterId }
    );
    return this.httpGet<any[]>(endpoint);
  }

  /**
   * Get the available connector metrics for the supplied clusterId and connector name
   */
  public getConnectorMetrics(
    clusterId: number,
    connectorName: string
  ): Promise<any[]> {
    this.logger?.info("[ConnectorService] Getting the connector metrics.");

    const endpoint: string = this.endpoint(
      "/connectors/:clusterId/:connectorName/metrics",
      "",
      { clusterId, connectorName }
    );
    return this.httpGet<any[]>(endpoint);
  }

  /**
   * Get the Connector config
   */
  // public getConnectorConfig(
  //   clusterId: number,
  //   connectorName: string
  // ): Promise<any> {
  //   this.logger?.info("[ConnectorService] Fetch the connector");

  //   const endpoint: string = this.endpoint(
  //     "/connectors/:clusterId/:connectorName/config",
  //     "",
  //     { clusterId, connectorName }
  //   );
  //   return this.httpGet<any>(endpoint);
  // }

  /**
   * Delete the Connector for the supplied clusterId
   */
  // public deleteConnector(
  //   clusterId: number,
  //   connectorName: string
  // ): Promise<any[]> {
  //   this.logger?.info("[ConnectorService] Delete the connector");

  //   const endpoint: string = this.endpoint(
  //     "/connectors/:clusterId/:connectorName",
  //     "",
  //     { clusterId, connectorName }
  //   );
  //   return this.httpDelete<any>(endpoint);
  // }

  /**
   * Pause the Connector for the supplied clusterId
   */
  // public pauseConnector(
  //   clusterId: number,
  //   connectorName: string,
  //   body: any
  // ): Promise<void> {
  //   this.logger?.info("[ConnectorService] Pause the connector");

  //   const endpoint: string = this.endpoint(
  //     "/connector/:clusterId/:connectorName/pause",
  //     "",
  //     { clusterId, connectorName }
  //   );
  //   return this.httpPut(endpoint, body);
  // }

  /**
   * Resume the Connector for the supplied clusterId
   */
  // public resumeConnector(
  //   clusterId: number,
  //   connectorName: string,
  //   body: any
  // ): Promise<void> {
  //   this.logger?.info("[ConnectorService] Resume the connector");

  //   const endpoint: string = this.endpoint(
  //     "/connector/:clusterId/:connectorName/resume",
  //     "",
  //     { clusterId, connectorName }
  //   );
  //   return this.httpPut(endpoint, body);
  // }

  /**
   * Restart the Connector for the supplied clusterId
   */
  // public restartConnector(
  //   clusterId: number,
  //   connectorName: string,
  //   body: any
  // ): Promise<void> {
  //   this.logger?.info("[ConnectorService] Restart the connector");

  //   const endpoint: string = this.endpoint(
  //     "/connector/:clusterId/:connectorName/restart",
  //     "",
  //     { clusterId, connectorName }
  //   );
  //   return this.httpPost(endpoint, body);
  // }

  /**
   * Restart the Connector Task for the supplied clusterId and connector
   */
  public restartConnectorTask(
    clusterId: number,
    connectorName: string,
    connectorTaskId: number,
    body: any
  ): Promise<void> {
    this.logger?.info("[ConnectorService] Restart the connector task");

    const endpoint: string = this.endpoint(
      "/connector/:clusterId/:connectorName/task/:connectorTaskId/restart",
      "",
      { clusterId, connectorName, connectorTaskId }
    );
    return this.httpPost(endpoint, body);
  }

  /**
   * Get the transform list and their properties for supplied clusterId
   */
  public getTransform(clusterId: number): Promise<any[]> {
    this.logger?.info("[ConnectorService] Getting the list of transform.");

    const endpoint: string = this.endpoint(
      "/:clusterId/transforms.json",
      "",
      { clusterId }
    );
    return this.httpGet<any[]>(endpoint);
  }
}