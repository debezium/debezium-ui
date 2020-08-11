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
    Connection
} from "@debezium/ui-models";
import {BaseService} from "../baseService";

/**
 * The connection service.  Used to fetch connections and also details about individual connections.
 */
export class ConnectionService extends BaseService {

    public getConnections(): Promise<Connection[]> {
        this.logger.info("[ConnectionService] Getting the list of connections.");
        const endpoint: string = this.endpoint("/connection");
        return this.httpGet<Connection[]>(endpoint);
    }

}
