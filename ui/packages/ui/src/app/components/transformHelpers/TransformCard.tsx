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
import { CheckCircleIcon, GripVerticalIcon, TrashIcon } from '@patternfly/react-icons';
import React from 'react';
import { NameInputField, TypeSelectorComponent, TransformConfig } from 'components';
import './TransformCard.css';
import _ from 'lodash';
import { getFormattedConfig } from 'shared';
import { useTranslation } from 'react-i18next';

export interface ITransformCardProps {
  transformNo: number;
  transformName: string;
  transformType: string;
  transformConfig: any;
  transformNameList: string[];
  isTop: boolean;
  isBottom: boolean;
  deleteTransform: (order: number) => void;
  moveTransformOrder: (order: number, position: string) => void;
  updateTransform: (key: number, field: string, value: any) => void;
  transformsData: any;
  setIsTransformDirty: (data: boolean) => void;
  selectedConnectorType: string;
}

const getOptions = response => {
  const TransformData: any[] = [];
  response.forEach(data => {
    data.transform.includes('io.debezium') ? TransformData.unshift(data) : TransformData.push(data);
  });
  const dbzTransform: JSX.Element[] = [];
  const apacheTransform: JSX.Element[] = [];
  TransformData.forEach((data, index) => {
    data.transform.includes('io.debezium')
      ? dbzTransform.push(<SelectOption key={index} value={`${data.transform}`} isDisabled={!data.enabled} />)
      : apacheTransform.push(<SelectOption key={index} value={`${data.transform}`} isDisabled={!data.enabled} />);
  });

  return [
    <SelectGroup label="Debezium" key="group1">
      {dbzTransform}
    </SelectGroup>,
    <Divider key="divider" />,
    <SelectGroup label="Apache kafka" key="group2">
      {apacheTransform}
    </SelectGroup>
  ];
};

export const TransformCard = React.forwardRef<any, ITransformCardProps>((props, ref) => {
  const { t } = useTranslation();
  
  const [isOpen, setIsOpen] = React.useState<boolean>(false);
  const [isExpanded, setIsExpanded] = React.useState<boolean>(true);
  const [nameIsValid, setNameIsValid] = React.useState<boolean>(true);

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
      {t("moveTop")}
    </DropdownItem>,
    <DropdownItem key="move_up" component="button" id="up" isDisabled={props.isTop || (props.isTop && props.isBottom)}>
      {t("moveUp")}
    </DropdownItem>,
    <DropdownItem
      key="move_down"
      component="button"
      id="down"
      isDisabled={(props.isTop && props.isBottom) || props.isBottom}
    >
      {t("moveDown")}
    </DropdownItem>,
    <DropdownItem key="move_bottom" component="button" id="bottom" isDisabled={props.isBottom}>
      {t("moveBottom")}
    </DropdownItem>
  ];
  const updateNameType = (value: string, field?: string) => {
    if (field) {
      value === '' || props.transformNameList.includes(value) ? setNameIsValid(false) : setNameIsValid(true);
      props.updateTransform(props.transformNo, 'name', value);
    } else {
      props.updateTransform(props.transformNo, 'type', value);
    }
  };

  return (
    <Grid>
      <GridItem span={12}>
        <div className={'transform-block pf-u-mt-lg pf-u-p-sm pf-u-pb-lg'} id="transform-parent">
          <Split>
            <SplitItem className={'pf-u-pr-sm'}>
              <Tooltip content={<div>{t("reorderTransform")}</div>}>
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
                {props.transformName && props.transformType && <CheckCircleIcon style={{ color: '#3E8635' }} />}
                {/* <ExclamationCircleIcon style={{color: '#C9190B'}}/> */}
              </Title>
              <Form>
                <Grid hasGutter={true}>
                  <GridItem span={4}>
                    <NameInputField
                      label="Name"
                      description={t("transformNameDescription")}
                      fieldId="transform_name"
                      isRequired={true}
                      name="transform_name"
                      placeholder="Name"
                      inputType="text"
                      value={props.transformName}
                      setFieldValue={updateNameType}
                      isInvalid={!nameIsValid}
                      invalidText={props.transformName ? t("uniqueName") : t("nameRequired")}
                    />
                  </GridItem>

                  <GridItem span={8}>
                    <TypeSelectorComponent
                      label="Type"
                      description={t("transformTypeDescription")}
                      fieldId="transform_type"
                      isRequired={true}
                      isDisabled={props.transformName === ''}
                      options={getOptions(props.transformsData)}
                      value={props.transformType}
                      setFieldValue={updateNameType}
                    />
                  </GridItem>
                </Grid>
              </Form>
              {props.transformType && (
                <ExpandableSection
                  toggleText={isExpanded ? t("hideConfig") : t('showConfig')}
                  onToggle={onToggle}
                  isExpanded={isExpanded}
                >
                  <TransformConfig
                    ref={ref}
                    transformConfigOptions={getFormattedConfig(props.transformsData, props.transformType)}
                    transformConfigValues={props.transformConfig}
                    updateTransform={props.updateTransform}
                    transformNo={props.transformNo}
                    setIsTransformDirty={props.setIsTransformDirty}
                    nameIsValid={nameIsValid}
                    transformType={props.transformType}
                  />
                </ExpandableSection>
              )}
            </SplitItem>
            <SplitItem>

                <Button variant="link" icon={<TrashIcon />} onClick={deleteCard} id="tooltip-selector"/>
               
            </SplitItem>
          </Split>
        </div>
      </GridItem>
    </Grid>
  );
});
