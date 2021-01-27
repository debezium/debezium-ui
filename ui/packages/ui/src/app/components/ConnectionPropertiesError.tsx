import { PropertyValidationResult } from '@debezium/ui-models/dist/js/ui.model';
import React from 'react';

export interface IConnectionPropertiesErrorProps{
    connectionPropsMsg: PropertyValidationResult[];
    validationErrorMsg: string;
}

export const ConnectionPropertiesError : React.FunctionComponent<IConnectionPropertiesErrorProps> = (props)=>{
    if (props.connectionPropsMsg.length !== 0) {
        return (
          <ul>
            {props.connectionPropsMsg.map((item, index) => (
              <li key={index}>
                {item.property === 'Generic' ? `${item.displayName}: ${item.message}` : props.validationErrorMsg}
              </li>
            ))}
          </ul>
        );
      } else {
        return <div>{props.validationErrorMsg}</div>;
      }
}