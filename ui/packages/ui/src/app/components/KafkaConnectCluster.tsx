import { Services } from "@debezium/ui-services";
import { Form } from '@patternfly/react-core';
import * as React from 'react';
import { fetch_retry } from "src/app/shared";
import { BasicSelectInput } from '../components';

export interface IKafkaConnectCluster {
  handleChange: (value: string, event: any) => void;
}
export const KafkaConnectCluster: React.FC<IKafkaConnectCluster> = (props) => {

  const [connectClusters, setConnectClusters] = React.useState<string[]>([""]);
  
  React.useEffect(() => {
    const globalsService = Services.getGlobalsService();
    fetch_retry(globalsService.getConnectCluster, globalsService)
      .then((cClusters: string[]) => {
        setConnectClusters([...cClusters]);
      })
      .catch((err: React.SetStateAction<Error>) => {
        alert(err);
      });
  }, [setConnectClusters]);

  return (
    <div className="kafka-connect">
      <div className="kafka-connect__cluster">
        <Form>
          <BasicSelectInput
            options={connectClusters}
            label="Kafka connect cluster"
            fieldId="kafka-connect-cluster"
            propertyChange={props.handleChange}
          />
        </Form>
      </div>
    </div>
  );
}
