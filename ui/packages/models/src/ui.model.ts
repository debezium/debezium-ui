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


/**
 * Model which represents a connector
 */
// tslint:disable-next-line: interface-name
export interface Connector {
    className: string;
    displayName: string;
    version: string;
    enabled: boolean;
}

/**
 * Model which represents a property validation result
 */
// tslint:disable-next-line: interface-name
export interface PropertyValidationResult {
    property: string;
    message: string;
}

/**
 * Model which represents a properties validation result
 */
// tslint:disable-next-line: interface-name
export interface PropertiesValidationResult {
    status: 'VALID' | 'INVALID';
    propertyValidationResults: PropertyValidationResult[];
}

/**
 * Model which represents a connector validation result
 */
// tslint:disable-next-line: interface-name
export interface ConnectionValidationResult {
    status: 'VALID' | 'INVALID';
    propertyValidationResults: PropertyValidationResult[];
    genericValidationResults: GenericValidationResult[];
}

/**
 * Model which represents a connector property
 */
// tslint:disable-next-line: interface-name
export interface ConnectorProperty {
    description: string;
    displayName: string;
    name: string;
    type: 'BOOLEAN' | 'STRING' | 'INT' | 'SHORT' | 'LONG' | 'DOUBLE' | 'LIST' | 'CLASS' | 'PASSWORD';
}

/**
 * Model which represents a connectory type
 */
// tslint:disable-next-line: interface-name
export interface ConnectorType {
    className: string;
    displayName: string;
    version: string;
    enabled: boolean;
    properties: ConnectorProperty[];
}

/**
 * Model which represents a data collection
 */
// tslint:disable-next-line: interface-name
export interface DataCollection {
    name: string;
    namespace: string;
}

/**
 * Model which represents a filter validation result
 */
// tslint:disable-next-line: interface-name
export interface FilterValidationResult {
    status: 'VALID' | 'INVALID';
    propertyValidationResults: PropertyValidationResult[];
    matchedCollections: DataCollection[];
}

/**
 * Model which represents a generic validation result
 */
// tslint:disable-next-line: interface-name
export interface GenericValidationResult {
    message: string;
    trace: string;
}
