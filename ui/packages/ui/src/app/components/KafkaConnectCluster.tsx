import { Services } from "@debezium/ui-services";
import { Form } from '@patternfly/react-core';
import * as React from 'react';
import { fetch_retry } from "src/app/shared";
import { BasicSelectInput } from '../components';

export interface IKafkaConnectCluster {
  handleChange: (clusterId: number) => void;
}

export const KafkaConnectCluster: React.FC<IKafkaConnectCluster> = (props) => {

  const [connectClusters, setConnectClusters] = React.useState<string[]>([""]);

  const handleClusterChange = (value: string, event: any) => {
    const index = connectClusters.indexOf(value) + 1
    props.handleChange(index);
  }
  
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
            propertyChange={handleClusterChange}
          />
        </Form>
      </div>
    </div>
  );
}
