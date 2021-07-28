import { Grid, GridItem, Split, SplitItem, Switch } from '@patternfly/react-core';
import React from 'react';
import { FormInputField, HelpInfoIcon } from 'components';
import './TopicRoutingConfig.css';

export interface ITopicRoutingConfigProps {
  transformConfig?: any;
}

export const TopicRoutingConfig: React.FunctionComponent<ITopicRoutingConfigProps> = (
  props: ITopicRoutingConfigProps
) => {
  const [uniqueKey, setUniqueKey] = React.useState<boolean>(true);

  const [fieldName, setFieldName] = React.useState<string>('__dbz__physicalTableIdentifier');

  const [topicReplacement, setTopicReplacement] = React.useState<string>('');
  const [topicRegex, setTopicRegex] = React.useState<string>('');

  const [keyReplacement, setKeyReplacement] = React.useState<string>('');
  const [keyRegex, setKeyRegex] = React.useState<string>('');

  const handleChange = (value: boolean) => {
    setUniqueKey(value);
  };

  return (
    <Grid hasGutter={true}>
      <GridItem span={3}>
        <FormInputField
          label="Topic replacement"
          description=""
          fieldId="topic_replacement"
          isRequired={true}
          name="topic_replacement"
          placeholder="replacement"
          inputType="text"
          value={topicReplacement}
          setFieldValue={setTopicReplacement}
        />
      </GridItem>
      <GridItem span={9}>
        <FormInputField
          label="Topic regex"
          description=""
          fieldId="topic_regex"
          isRequired={true}
          name="topic_regex"
          placeholder="regex"
          inputType="text"
          value={topicRegex}
          setFieldValue={setTopicRegex}
        />
      </GridItem>
      <GridItem span={6}>
        <Split>
          <SplitItem>
            <Switch
              id="filter_key_unique"
              name="filter_key_unique"
              label="Enforce key uniqueness"
              labelOff="Enforce key uniqueness"
              isChecked={uniqueKey}
              onChange={handleChange}
              className={'topic_routing'}
            />
          </SplitItem>
          <SplitItem>
            <HelpInfoIcon label="Enforce key uniqueness" description="" />
          </SplitItem>
        </Split>
      </GridItem>
      <GridItem span={3} />
      {uniqueKey && (
        <>
          <GridItem span={6}>
            <FormInputField
              label="Key field name"
              description=""
              fieldId="filter_key name"
              isRequired={true}
              name="filter_key_name"
              placeholder="Filed name"
              inputType="text"
              value={fieldName}
              setFieldValue={setFieldName}
            />
          </GridItem>
          <GridItem span={6} />
          <GridItem span={3}>
            <FormInputField
              label="Key field replacement"
              description=""
              fieldId="key_replacement"
              isRequired={false}
              name="key_replacement"
              placeholder="replacement"
              inputType="text"
              value={keyReplacement}
              setFieldValue={setKeyReplacement}
            />
          </GridItem>
          <GridItem span={9}>
            <FormInputField
              label="Key field regex"
              description=""
              fieldId="key_regex"
              isRequired={false}
              name="key_regex"
              placeholder="regex"
              inputType="text"
              value={keyRegex}
              setFieldValue={setKeyRegex}
            />
          </GridItem>
        </>
      )}
    </Grid>
  );
};
