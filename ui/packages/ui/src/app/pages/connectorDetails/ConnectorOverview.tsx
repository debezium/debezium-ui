import { ConnectorExpandableView } from '../connectors/ConnectorExpandableView';
import {
  Card,
  CardBody,
  CardTitle,
  Grid,
  GridItem,
  PageSection,
  TextContent,
  TextList,
  TextListItem,
  TextListItemVariants,
  TextListVariants,
} from '@patternfly/react-core';
import { AppLayoutContext } from 'layout';
import React, { FC, Fragment } from 'react';

export type ConnectorOverviewProps = {
  connectorConfiguration: Map<string, string>;
  connectorName: string;
};
export const ConnectorOverview: FC<ConnectorOverviewProps> = ({
  connectorConfiguration,
  connectorName,
}) => {
  const appLayoutContext = React.useContext(AppLayoutContext);
  const clusterID = appLayoutContext.clusterId;

 
  const textListItem = (title: string, value?: any) => (
    <Fragment key={title}>
      {value && (
        <>
          <TextListItem component={TextListItemVariants.dt} style={{overflowWrap: 'anywhere'}}>
            {title}
          </TextListItem>
          <TextListItem component={TextListItemVariants.dd} style={{overflowWrap: 'anywhere'}}>
            {value}
          </TextListItem>
        </>
      )}
    </Fragment>
  );

  return (
    <PageSection isFilled={true}>
      <Grid hasGutter>
        <GridItem span={7}>
          <Card ouiaId="metricsCard" style={{marginBottom: '15px'}}>
            <CardTitle>Metrics</CardTitle>
            <CardBody>
              <ConnectorExpandableView
                clusterId={clusterID}
                connectorName={connectorName}
              />
            </CardBody>
          </Card>
          <Card ouiaId="taskCard">
            <CardTitle>Task</CardTitle>
            <CardBody>Coming soon</CardBody>
          </Card>
        </GridItem>
       
        <GridItem span={5}>
          <Card ouiaId="configCard">
            <CardTitle>Config</CardTitle>
            <CardBody>
              <TextContent>
                <TextList component={TextListVariants.dl}>
                  {Object.entries(connectorConfiguration).map((list) => {
                    return textListItem(list[0], list[1]);
                  })}
                </TextList>
              </TextContent>
            </CardBody>
          </Card>
        </GridItem>
      </Grid>
    </PageSection>
  );
};
