import {
  Button,
  ExpandableSection,
  Flex,
  FlexItem,
  Form,
  FormGroup,
  Grid,
  GridItem,
  Popover,
  Radio,
  Split,
  SplitItem,
  Title,
  Tooltip
} from '@patternfly/react-core';
import { ExclamationCircleIcon, GripVerticalIcon, HelpIcon, TrashIcon } from '@patternfly/react-icons';
import React from 'react';
import { FormInputField } from 'src/app/components/formElements/FormInputField';
import { FormSelectField } from 'src/app/components/formElements/FormSelectField';
import './TransformCard.css';

export interface ITransformCardProps {
  transformNo: number;
  transformName: string;
  transformType: string;
  transformConfig?: any;
  deleteTransform: (order: number) => void;
}

export const TransformCard: React.FunctionComponent<ITransformCardProps> = (props: ITransformCardProps) => {
  const [name, setName] = React.useState<string>('');
  const [type, setType] = React.useState<string>('');

  const [isExpanded, setIsExpanded] = React.useState<boolean>(true);

  const [filterMethod, setFilterMethod] = React.useState<string>('');

  const [language, setLanguage] = React.useState<string>('');
  const [expression, setExpression] = React.useState<string>('');
  const [regex, setRegex] = React.useState<string>('');

  const [nullHandle, setNullHandle] = React.useState<string>('keep');

  const deleteCard = () => {
    props.deleteTransform(props.transformNo);
  };

  const onToggle = (isExpandedVal: boolean) => {
    setIsExpanded(isExpandedVal);
  };

  const filterMethodChange = (_, event) => {
    const { value } = event.currentTarget;
    setFilterMethod(value);
  };

  const typeOptions = [
    { value: 'Select type', label: 'Select type', isPlaceholder: true, disabled: false },
    {
      value: 'io.debezium.transforms.ExtractNewRecordState',
      label: 'io.debezium.transforms.ExtractNewRecordState',
      disabled: false
    },
    {
      value: 'io.debezium.transforms.ContentBasedRouter',
      label: 'io.debezium.transforms.ContentBasedRouter',
      disabled: false
    },
    {
      value: 'io.debezium.transforms.ByLogicalTableRouter',
      label: 'io.debezium.transforms.ByLogicalTableRouter',
      disabled: false
    },
    {
      value: 'org.apache.kafka.connect.transforms.TimestampRouter',
      label: 'org.apache.kafka.connect.transforms.TimestampRouter',
      disabled: true
    },
    {
      value: 'org.apache.kafka.connect.transforms.ValueToKey',
      label: 'org.apache.kafka.connect.transforms.ValueToKey',
      disabled: false
    },
    { value: 'other', label: 'Other', disabled: false }
  ];

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
    <Grid>
      <GridItem span={9}>
        <div className={'transform-block pf-u-mt-lg pf-u-p-sm pf-u-pb-lg'}>
          <Split>
            <SplitItem className={'pf-u-pr-sm'}>
              <GripVerticalIcon />
            </SplitItem>
            <SplitItem isFilled={true}>
              <Title headingLevel="h2">Transformation # {props.transformNo}</Title>
              <Form>
                <Grid hasGutter={true}>
                  <GridItem span={4}>
                    <FormInputField
                      label="Name"
                      description=""
                      fieldId="transform_name"
                      isRequired={true}
                      name="transform_name"
                      placeholder="Name"
                      inputType="text"
                      value={name}
                      setFieldValue={setName}
                    />
                  </GridItem>

                  <GridItem span={8}>
                    <FormSelectField
                      label="Type"
                      description=""
                      fieldId="transform_type"
                      isRequired={true}
                      isDisabled={name === ''}
                      options={typeOptions}
                      value={type}
                      setFieldValue={setType}
                    />
                  </GridItem>
                  {type && name && (
                    <ExpandableSection
                      toggleText={isExpanded ? 'Hide config' : 'Show config'}
                      onToggle={onToggle}
                      isExpanded={isExpanded}
                    >
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
                    </ExpandableSection>
                  )}
                </Grid>
              </Form>
            </SplitItem>
            <SplitItem>
              <Tooltip content={<div>Delete transform</div>}>
                <Button variant="link" icon={<TrashIcon />} onClick={deleteCard}/>
              </Tooltip>
            </SplitItem>
          </Split>
        </div>
      </GridItem>
    </Grid>
  );
};
