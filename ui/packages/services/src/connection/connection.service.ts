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
 * The connection service.  Used to fetch connections and other connection operations.
 */
export class ConnectionService extends BaseService {

    public validateConnection(connectorTypeId: string, input: Map<string, string>): Promise<ConnectionValidationResult> {
        this.logger.info("[ConnectionService] Validating connection:", connectorTypeId);

        const endpoint: string = this.endpoint("/connector-types/:connectorTypeId/validation/connection", { connectorTypeId });
        const body = {
            input
        };
        return this.httpPostWithReturn(endpoint, body);
    }

    public validateFilters(connectorTypeId: string, input: Map<string, string>): Promise<FilterValidationResult> {
        this.logger.info("[ConnectionService] Validating filters:", connectorTypeId);

        const endpoint: string = this.endpoint("/connector-types/:connectorTypeId/validation/filters", { connectorTypeId });
        const body = {
            input
        };
        return this.httpPostWithReturn(endpoint, body);
    }

    public validateProperties(connectorTypeId: string, input: Map<string, string>): Promise<PropertiesValidationResult> {
        this.logger.info("[ConnectionService] Validating properties:", connectorTypeId);

        const endpoint: string = this.endpoint("/connector-types/:connectorTypeId/validation/properties", { connectorTypeId });
        const body = {
            input
        };
        return this.httpPostWithReturn(endpoint, body);
    }

}
