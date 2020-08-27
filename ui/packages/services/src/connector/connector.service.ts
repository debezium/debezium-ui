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

import {
    ConnectionValidationResult, FilterValidationResult, PropertiesValidationResult
} from "@debezium/ui-models";
import {BaseService} from "../baseService";

/**
 * The connector service.  Used to fetch connectors and other connector operations.
 */
export class ConnectorService extends BaseService {

    /**
     * Validate the connection properties for the supplied connection type
     * Example usage:
     * 
     * const connectorService = Services.getConnectorService();
     * const inputMap = new Map<string,string>();
     * inputMap.set("oneParam","oneValue");
     * inputMap.set("twoParam","twoValue");
     * connectorService.validateConnection('postgres', inputMap)
     *  .then((result: ConnectionValidationResult) => {
     *    if (result.status === 'INVALID') {
     *      alert('status is INVALID');
     *    } else {
     *      alert('status is VALID');
     *    }
     *  });
     */
    public validateConnection(connectorTypeId: string, input: Map<string, string>): Promise<ConnectionValidationResult> {
        this.logger.info("[ConnectorService] Validating connection:", connectorTypeId);

        const endpoint: string = this.endpoint("/connector-types/:connectorTypeId/validation/connection", { connectorTypeId });
        const body = {
            input
        };
        return this.httpPostWithReturn(endpoint, body);
    }

    /**
     * Validate the filters for the supplied connection type
     * Example usage:
     * 
     * const connectorService = Services.getConnectorService();
     * const inputMap = new Map<string,string>();
     * inputMap.set("oneParam","oneValue");
     * inputMap.set("twoParam","twoValue");
     * connectorService.validateFilters('postgres', inputMap)
     *  .then((result: FilterValidationResult) => {
     *    if (result.status === 'INVALID') {
     *      alert('status is INVALID');
     *    } else {
     *      alert('status is VALID');
     *    }
     *  });
     */
    public validateFilters(connectorTypeId: string, input: Map<string, string>): Promise<FilterValidationResult> {
        this.logger.info("[ConnectorService] Validating filters:", connectorTypeId);

        const endpoint: string = this.endpoint("/connector-types/:connectorTypeId/validation/filters", { connectorTypeId });
        const body = {
            input
        };
        return this.httpPostWithReturn(endpoint, body);
    }

    /**
     * Validate the properties for the supplied connection type
     * Example usage:
     * 
     * const connectorService = Services.getConnectorService();
     * const inputMap = new Map<string,string>();
     * inputMap.set("oneParam","oneValue");
     * inputMap.set("twoParam","twoValue");
     * connectorService.validateProperties('postgres', inputMap)
     *  .then((result: PropertiesValidationResult) => {
     *    if (result.status === 'INVALID') {
     *      alert('status is INVALID');
     *    } else {
     *      alert('status is VALID');
     *    }
     *  });
     */
    public validateProperties(connectorTypeId: string, input: Map<string, string>): Promise<PropertiesValidationResult> {
        this.logger.info("[ConnectorService] Validating properties:", connectorTypeId);

        const endpoint: string = this.endpoint("/connector-types/:connectorTypeId/validation/properties", { connectorTypeId });
        const body = {
            input
        };
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
    // public createConnector(connectorConfig: ConnectorConfiguration): Promise<PropertiesValidationResult> {
    //     this.logger.info("[ConnectorService] Creating a connector:", connectorConfig.name);

    //     const endpoint: string = this.endpoint("/connector-types/:connectorTypeId/validation/properties", { connectorTypeId });
    //     const body = {
    //         input
    //     };
    //     return this.httpPostWithReturn(endpoint, body);
    // }

}
