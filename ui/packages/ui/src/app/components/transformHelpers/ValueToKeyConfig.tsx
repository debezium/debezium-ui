import { Grid, GridItem } from '@patternfly/react-core';
import React from 'react';
import { FormInputField } from 'components';

export interface IValueToKeyConfigProps {
  transformConfig?: any;
}

export const ValueToKeyConfig: React.FunctionComponent<IValueToKeyConfigProps> = (props: IValueToKeyConfigProps) => {
  const [fieldNames, setFieldNames] = React.useState<string>('');

  return (
    <Grid hasGutter={true}>
      <GridItem span={9}>
        <FormInputField
          label="Fields"
          description=""
          fieldId="fields"
          isRequired={true}
          name="fields"
          placeholder="field names"
          inputType="text"
          value={fieldNames}
          setFieldValue={setFieldNames}
        />
      </GridItem>
    </Grid>
  );
};
