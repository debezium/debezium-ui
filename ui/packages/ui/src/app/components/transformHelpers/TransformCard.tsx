import {
  Button,
  Divider,
  Dropdown,
  DropdownItem,
  DropdownToggle,
  ExpandableSection,
  Form,
  Grid,
  GridItem,
  SelectGroup,
  SelectOption,
  Split,
  SplitItem,
  Title,
  Tooltip
} from '@patternfly/react-core';
import { CheckCircleIcon, ExclamationCircleIcon, GripVerticalIcon, TrashIcon } from '@patternfly/react-icons';
import React from 'react';
import {
  RoutingConfig,
  FormInputField,
  ValueToKeyConfig,
  TopicRoutingConfig,
  TypeSelectorComponent,
  TimestampRouterConfig
} from 'components';
import './TransformCard.css';

export interface ITransformCardProps {
  transformNo: number;
  transformName: string;
  transformType: string;
  transformConfig?: any;
  isTop: boolean;
  isBottom: boolean;
  deleteTransform: (order: number) => void;
  moveTransformOrder: (order: number, position: string) => void;
}

export const TransformCard: React.FunctionComponent<ITransformCardProps> = (props: ITransformCardProps) => {
  const [name, setName] = React.useState<string>('');
  const [type, setType] = React.useState<string>('');

  const [isOpen, setIsOpen] = React.useState<boolean>(false);

  const [isExpanded, setIsExpanded] = React.useState<boolean>(true);

  // const [configComplete, setConfigComplete] = React.useState<boolean>(false);

  // const focusout = (e) =>{
  //       if (e.currentTarget === e.target) {
  //         alert("blur (self)");
  //       }
  //       if (!e.currentTarget?.contains(e.relatedTarget)) {
  //         console.log("focusleave");
  //       }
    
  // }

  const onToggle = (isExpandedVal: boolean) => {
    setIsExpanded(isExpandedVal);
  };

  const deleteCard = () => {
    props.deleteTransform(props.transformNo);
  };

  // tslint:disable-next-line: no-shadowed-variable
  const onPositionToggle = isOpenVal => {
    setIsOpen(isOpenVal);
  };
  const onPositionSelect = event => {
    setIsOpen(!isOpen);
    props.moveTransformOrder(props.transformNo, event.currentTarget.id);
    onFocus();
  };
  const onFocus = () => {
    const element = document.getElementById('transform-order-toggle');
    element?.focus();
  };

  const dropdownItems = [
    <DropdownItem key="move_top" component="button" id="top" isDisabled={props.isTop}>
      Move top
    </DropdownItem>,
    <DropdownItem key="move_up" component="button" id="up" isDisabled={props.isTop || (props.isTop && props.isBottom)}>
      Move up
    </DropdownItem>,
    <DropdownItem
      key="move_down"
      component="button"
      id="down"
      isDisabled={(props.isTop && props.isBottom) || props.isBottom}
    >
      Move down
    </DropdownItem>,
    <DropdownItem key="move_bottom" component="button" id="bottom" isDisabled={props.isBottom}>
      Move bottom
    </DropdownItem>
  ];

  const transformConfig = (transformType: string) => {
    switch (transformType) {
      case 'io.debezium.transforms.Filter':
      case 'io.debezium.transforms.ContentBasedRouter':
        return <RoutingConfig transformConfig={props.transformConfig} />;
      case 'io.debezium.transforms.ByLogicalTableRouter':
        return <TopicRoutingConfig transformConfig={props.transformConfig} />;
      case 'org.apache.kafka.connect.transforms.ValueToKey':
        return <ValueToKeyConfig transformConfig={props.transformConfig} />;
      case 'org.apache.kafka.connect.transforms.TimestampRoute':
        return <TimestampRouterConfig transformConfig={props.transformConfig} />;
      default:
        return <></>;
    }
  };

  const option = [
    <SelectGroup label="Debezium" key="group1">
      <SelectOption key={0} value="io.debezium.transforms.Filter" />
      <SelectOption key={1} value="io.debezium.transforms.ContentBasedRouter" />
      <SelectOption key={2} value="io.debezium.transforms.ExtractNewRecordState" isDisabled={true} />
      <SelectOption key={3} value="io.debezium.transforms.ByLogicalTableRouter" />
    </SelectGroup>,
    <Divider key="divider" />,
    <SelectGroup label="Apache kafka" key="group2">
      <SelectOption key={4} value="org.apache.kafka.connect.transforms.ValueToKey" />
      <SelectOption key={5} value="org.apache.kafka.connect.transforms.TimestampRoute" />
      <SelectOption key={6} value="org.apache.kafka.connect.transforms.ExtractField" isDisabled={true} />
      <SelectOption key={7} value="org.apache.kafka.connect.transforms.Cast" isDisabled={true} />
    </SelectGroup>
  ];

  return (
    <Grid>
      <GridItem span={9}>
        <div 
          className={'transform-block pf-u-mt-lg pf-u-p-sm pf-u-pb-lg'} 
          // onBlur={focusout} 
          id='transform-parent'>
          <Split>
            <SplitItem className={'pf-u-pr-sm'}>
              <Tooltip content={<div>Reorder transform</div>}>
                <Dropdown
                  className={'position_toggle'}
                  onSelect={onPositionSelect}
                  isOpen={isOpen}
                  isPlain={true}
                  dropdownItems={dropdownItems}
                  toggle={
                    <DropdownToggle
                      toggleIndicator={null}
                      onToggle={onPositionToggle}
                      aria-label="Applications"
                      id="transform-order-toggle"
                    >
                      <GripVerticalIcon />
                    </DropdownToggle>
                  }
                />
              </Tooltip>
            </SplitItem>
            <SplitItem isFilled={true}>
              <Title headingLevel="h2">
                Transformation # {props.transformNo} &nbsp;
                {name && type && <CheckCircleIcon style={{ color: '#3E8635' }} />}
                {/* <ExclamationCircleIcon style={{color: '#C9190B'}}/> */}
              </Title>
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
                    <TypeSelectorComponent
                      label="Type"
                      description=""
                      fieldId="transform_type"
                      isRequired={true}
                      isDisabled={name === ''}
                      options={option}
                      value={type}
                      setFieldValue={setType}
                    />
                  </GridItem>
                  {type && (
                    <ExpandableSection
                      toggleText={isExpanded ? 'Hide config' : 'Show config'}
                      onToggle={onToggle}
                      isExpanded={isExpanded}
                    >
                      {transformConfig(type)}
                    </ExpandableSection>
                  )}
                </Grid>
              </Form>
            </SplitItem>
            <SplitItem>
              <Tooltip content={<div>Delete transform</div>}>
                <Button variant="link" icon={<TrashIcon />} onClick={deleteCard} />
              </Tooltip>
            </SplitItem>
          </Split>
        </div>
      </GridItem>
    </Grid>
  );
};
