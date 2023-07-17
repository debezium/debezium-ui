import './ConnectorOverview.css';
import { Metrics } from '@debezium/ui-models';
import { Services } from '@debezium/ui-services';
import { Flex, FlexItem, Skeleton, Title } from '@patternfly/react-core';
import {
  CheckCircleIcon,
  ExclamationCircleIcon,
} from '@patternfly/react-icons';
import React from 'react';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { fetch_retry } from 'shared';

export interface IConnectorcOverviewProps {
  clusterId: number;
  connectorName: string;
}

const convertMillisecToTime = (millisec: number) => {
  const seconds = (millisec / 1000).toFixed(1);
  const minutes = (millisec / (1000 * 60)).toFixed(2);
  const hours = (millisec / (1000 * 60 * 60)).toFixed(2);
  const days = (millisec / (1000 * 60 * 60 * 24)).toFixed(1);
  if (millisec <= 0){
    return millisec;
  }  else if (parseInt(seconds) < 60) {
    return seconds + ' Sec';
  } else if (parseInt(minutes) < 60) {
    return minutes + ' Min';
  } else if (parseInt(hours) < 24) {
    return hours + ' Hrs';
  } else {
    return days + ' Days';
  }
};

/**
 * Component for display of Connector Overview
 */
export const ConnectorOverview: React.FunctionComponent<
  IConnectorcOverviewProps
> = (props) => {
  const { t } = useTranslation();
  const [connectorMetrics, setConnectorMetrics] = useState<Metrics[]>();

  const getConnectorMetrics = () => {
    const connectorService = Services.getConnectorService();
    fetch_retry(connectorService.getConnectorMetrics, connectorService, [
      props.clusterId,
      props.connectorName,
    ])
      .then((metrics: Metrics[]) => {
        setConnectorMetrics(metrics);
      })
      .catch((err: React.SetStateAction<Error>) => {
        console.log(err);
      });
  };

  useEffect(() => {
    const getConnectorMetricsInterval = setInterval(
      () => getConnectorMetrics(),
      10000
    );
    return () => clearInterval(getConnectorMetricsInterval);
  }, [props.connectorName, props.clusterId]);

  return (
    <Flex>
      <FlexItem className="overview_metrics_skeleton">
        <Title headingLevel="h3" size={'md'}>
          <b>{t('metrics')}</b>
        </Title>
        {connectorMetrics ? (
          connectorMetrics.map((metrics) => (
            <p>
              {t(metrics.request.attribute)}:{' '}
              {metrics.request.attribute === 'MilliSecondsSinceLastEvent' ? (
                convertMillisecToTime(metrics.value as number)
              ) : typeof metrics.value === 'boolean' ? (
                metrics.value ? (
                  <CheckCircleIcon className="overview_metrics_connected" />
                ) : (
                  <ExclamationCircleIcon style={{ color: '#C9190B' }} />
                )
              ) : (
                metrics.value
              )}
            </p>
          ))
        ) : (
          <>
            <Skeleton
              fontSize="sm"
              screenreaderText="Loading connector metrics"
              width="70%"
            />
            <Skeleton
              fontSize="sm"
              screenreaderText="Loading connector metrics"
              width="85%"
            />
            <Skeleton
              fontSize="sm"
              screenreaderText="Loading connector metrics"
            />
          </>
        )}
      </FlexItem>
    </Flex>
  );
};
