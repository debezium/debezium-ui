import { Grid, GridItem } from '@patternfly/react-core';
import React from 'react';
import { FormInputField } from 'components';

export interface ITimestampRouterConfigProps {
  transformConfig?: any;
}

export const TimestampRouterConfig: React.FunctionComponent<ITimestampRouterConfigProps> = (
  props: ITimestampRouterConfigProps
) => {
  const [timestampFormat, setTimestampFormat] = React.useState<string>('yyyyMMdd');
  const [topicFormat, setTopicFormat] = React.useState<string>('${topic}-${timestamp}');

  return (
    <Grid hasGutter={true}>
      <GridItem span={3}>
        <FormInputField
          label="Timestamp format"
          description=""
          fieldId="timestamp_format"
          isRequired={true}
          name="timestamp_format"
          placeholder=""
          inputType="text"
          value={timestampFormat}
          setFieldValue={setTimestampFormat}
        />
      </GridItem>
      <GridItem span={6}>
        <FormInputField
          label="Topic format"
          description=""
          fieldId="topic_format"
          isRequired={true}
          name="topic_format"
          placeholder=""
          inputType="text"
          value={topicFormat}
          setFieldValue={setTopicFormat}
        />
      </GridItem>
    </Grid>
  );
};
