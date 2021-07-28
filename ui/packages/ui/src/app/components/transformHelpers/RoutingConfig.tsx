import { Flex, FlexItem, FormGroup, Grid, GridItem, Popover, Radio } from '@patternfly/react-core';
import { ExclamationCircleIcon, HelpIcon } from '@patternfly/react-icons';
import React from 'react';
import { FormInputField, FormSelectField } from 'components';

export interface IRoutingConfigProps {
  transformConfig?: any;
}

export const RoutingConfig: React.FunctionComponent<IRoutingConfigProps> = (
  props: IRoutingConfigProps
) => {

  const [filterMethod, setFilterMethod] = React.useState<string>('');

  const [language, setLanguage] = React.useState<string>('');
  const [expression, setExpression] = React.useState<string>('');
  const [regex, setRegex] = React.useState<string>('');

  const [nullHandle, setNullHandle] = React.useState<string>('keep');

  const filterMethodChange = (_, event) => {
    const { value } = event.currentTarget;
    setFilterMethod(value);
  };

  const LanguageOptions = [
    { value: 'Language', label: 'Language', isPlaceholder: true, disabled: false },
    {
      value: 'jsr223.groovy',
      label: 'jsr223.groovy',
      disabled: false
    },
    {
      value: 'jsr223.graal.js',
      label: 'jsr223.graal.js',
      disabled: false
    },
    { value: 'other', label: 'Other', disabled: false }
  ];

  const NullHandelOption = [
    {
      value: 'keep',
      label: 'Keep',
      disabled: false
    },
    {
      value: 'drop',
      label: 'Drop',
      disabled: false
    },
    { value: 'evaluate', label: 'Evaluate', disabled: false }
  ];

  return (

      <Grid hasGutter={true}>
        <GridItem span={6}>
          <FormGroup
            label="Filter target topic via"
            fieldId="transform_filter"
            isRequired={true}
            labelIcon={
              <Popover
                bodyContent={
                  <div>
                    msg
                    <br />
                    <a
                      href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_Expressions"
                      target="_blank"
                    >
                      More Info
                    </a>
                  </div>
                }
              >
                <button
                  aria-label="More info for filter field"
                  onClick={e => e.preventDefault()}
                  aria-describedby="simple-form-filter"
                  className="pf-c-form__group-label-help"
                >
                  <HelpIcon noVerticalAlign={true} />
                </button>
              </Popover>
            }
            helperTextInvalidIcon={<ExclamationCircleIcon />}
          >
            <Flex>
              <FlexItem>
                {' '}
                <Radio
                  isChecked={filterMethod === 'topic.regex'}
                  name="filter_method"
                  onChange={filterMethodChange}
                  label="regex"
                  id="filter_method"
                  value="topic.regex"
                />
              </FlexItem>
              <FlexItem>
                <Radio
                  isChecked={filterMethod === 'topic.expression'}
                  name="filter_method"
                  onChange={filterMethodChange}
                  label="expression"
                  id="filter_method"
                  value="topic.expression"
                />
              </FlexItem>
            </Flex>
          </FormGroup>
        </GridItem>
        <GridItem span={6} />
        {filterMethod &&
          (filterMethod === 'topic.expression' ? (
            <>
              <GridItem span={3}>
                <FormSelectField
                  label="Language"
                  description=""
                  fieldId="filter_language"
                  isRequired={true}
                  isDisabled={false}
                  options={LanguageOptions}
                  value={language}
                  setFieldValue={setLanguage}
                />
              </GridItem>
              <GridItem span={9}>
                <FormInputField
                  label="Expression"
                  description=""
                  fieldId="filter_expression"
                  isRequired={true}
                  name="filter_expression"
                  placeholder="expression"
                  inputType="text"
                  value={expression}
                  setFieldValue={setExpression}
                />
              </GridItem>
            </>
          ) : (
            <>
              <GridItem span={9}>
                <FormInputField
                  label="Regex"
                  description=""
                  fieldId="filter_regex"
                  isRequired={true}
                  name="filter_regex"
                  placeholder="regex"
                  inputType="text"
                  value={regex}
                  setFieldValue={setRegex}
                />
              </GridItem>
              <GridItem span={3} />
            </>
          ))}

        <GridItem span={3}>
          <FormSelectField
            label="Null handler"
            description=""
            fieldId="filter_null_handler"
            isRequired={true}
            isDisabled={false}
            options={NullHandelOption}
            value={nullHandle}
            setFieldValue={setNullHandle}
          />
        </GridItem>
      </Grid>
  );
};
