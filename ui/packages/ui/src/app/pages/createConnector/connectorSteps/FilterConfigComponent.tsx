import { DataCollection, FilterValidationResult } from "@debezium/ui-models";
import { Services } from "@debezium/ui-services";
import {
  ActionGroup,
  Alert,
  Button,
  Divider,
  Flex,
  FlexItem,
  Form,
  FormGroup,
  Popover,
  Spinner,
  Text,
  TextInput,
  TextVariants,
  Title,
  ToggleGroup,
  ToggleGroupItem,
} from "@patternfly/react-core";
import {
  ExclamationCircleIcon,
  HelpIcon,
  InfoCircleIcon,
} from "@patternfly/react-icons";
import _ from "lodash";
import React, { SetStateAction } from "react";
import { FilterTreeComponent } from "src/app/components";
import {
  ConfirmationButtonStyle,
  ConfirmationDialog,
  fetch_retry,
  mapToObject,
} from "src/app/shared";
import "./FilterConfigComponent.css";

export interface IFilterConfigComponentProps {
  propertyValues: Map<string, string>;
  filterValues: Map<string, string>;
  connectorType: string;
  updateFilterValues: (data: Map<string, string>) => void;
  setIsValidFilter: (val:SetStateAction<boolean>) => void;
  parent: string;
  child: string;
  parentExcludeList: string;
  parentIncludeList: string;
  childExcludeList: string;
  childIncludeList: string;
  i18nFilterParentInfoMsg: string;
  i18nFilterChildInfoMsg: string;
  i18nFilterConfiguration: string;
  i18nFilterPageHeadingText: string;
  i18nFilterParentLabel: string;
  i18nFilterChildLabel: string;
  i18nFilterParentHelperText: string;
  i18nFilterChildHelperText: string;
  i18nInclude: string;
  i18nExclude: string;
  i18nApply: string;
  i18nClearFilters: string;
  i18nInvalidFilterText: string;
  i18nMatchingFilterExpMsg: string;
  i18nNoMatchingFilterExpMsg: string;
  i18nClearFilterText: string;
  i18nFilterExpressionResultText: string;
  i18nCancel: string;
  i18nClear: string;
  i18nClearFilterConfMsg: string;
  i18nNoMatchingTables: string;
  i18nInvalidFilters: string;
  i18nInvalidFilterExpText: string;
}

const formatResponseData = (data: DataCollection[]) => {
  return data.reduce((acc: any, next) => {
    const inx = _.findIndex(acc, { name: next.namespace, id: next.namespace });
    if (inx !== -1) {
      acc[inx].children.push({
        name: next.name,
        id: next.namespace + "_" + next.name,
      });
    } else {
      const newObj = {
        name: next.namespace,
        id: next.namespace,
        children: [
          {
            name: next.name,
            id: next.namespace + "_" + next.name,
          },
        ],
      };
      acc.push(newObj);
    }
    return acc;
  }, []);
};

const getParentExpression = (data: Map<string, string>, parentExclude: string, parentInclude: string): string => {
  return (
    data.get(parentExclude) || data.get(parentInclude) || ""
  );
};

const getChildExpression = (data: Map<string, string>, childExclude: string, childInclude: string): string => {
  return data.get(childExclude) || data.get(childInclude) || "";
};

const getInvalidFilterMsg = (
  filter: string,
  errorMsg: Map<string, string> | undefined
) => {
  let returnVal = "";
  errorMsg?.forEach((val, key) => {
    if (key.includes(filter)) {
      returnVal = val;
    }
  });
  return returnVal;
};

export const FilterConfigComponent: React.FunctionComponent<IFilterConfigComponentProps> = (
  props
) => {
  const [parentFilter, setParentFilter] = React.useState<string>(
    getParentExpression(props.filterValues,props.parentExcludeList,props.parentIncludeList)
  );
  const [childFilter, setChildFilter] = React.useState<string>(
    getChildExpression(props.filterValues, props.childExcludeList, props.childIncludeList)
  );
  const [parentSelected, setParentSelected] = React.useState<string>(
    props.filterValues.has(props.parentExcludeList)
      ? "parentExclude"
      : "parentInclude"
  );
  const [childSelected, setChildSelected] = React.useState<string>(
    props.filterValues.has(props.childExcludeList)
      ? "childExclude"
      : "childInclude"
  );

  const [formData, setFormData] = React.useState<Map<string, string>>(
    new Map()
  );
  const [treeData, setTreeData] = React.useState<any[]>([]);
  const [invalidMsg, setInvalidMsg] = React.useState<Map<string, string>>();
  const [childNo, setChildNo] = React.useState<number>(0);
  const [showClearDialog, setShowClearDialog] = React.useState<boolean>(false);

  const [loading, setLoading] = React.useState(true);
  const [apiError, setApiError] = React.useState<boolean>(false);
  const [errorMsg, setErrorMsg] = React.useState<Error>(new Error());

  const parentFilterInfo = props.i18nFilterParentInfoMsg;
  const childFilterInfo = props.i18nFilterChildInfoMsg;

  const handleParentFilter = (val: string) => {
    setParentFilter(val);
  };
  const handleChildFilter = (val: string) => {
    setChildFilter(val);
  };

  const handleParentToggle = (isSelected: any, event: any) => {
    const id = event.currentTarget.id;
    setParentSelected(id);
  };

  const handleChildToggle = (isSelected: any, event: any) => {
    const id = event.currentTarget.id;
    setChildSelected(id);
  };

  const connectorService = Services.getConnectorService();

  const applyFilter = () => {
    getFilterSchema(true);
  };

  const clearFilter = () => {
    setShowClearDialog(true);
  };

  const getFilterSchema = (
    saveFilter: boolean,
    filterExpression: Map<string, string> = formData
  ) => {
    fetch_retry(connectorService.validateFilters, connectorService, [
      props.connectorType,
      mapToObject(new Map([...props.propertyValues, ...filterExpression])),
    ])
      .then((result: FilterValidationResult) => {
        if (result.status === "INVALID") {
          const errorMap = new Map();
          for (const e of result.propertyValidationResults) {
            errorMap.set(e.property, e.message);
          }
          setInvalidMsg(errorMap);
          props.setIsValidFilter(false);
          setTreeData([]);
          setChildNo(result.matchedCollections.length);
        } else {
          // tslint:disable-next-line: no-unused-expression
          saveFilter && props.updateFilterValues(filterExpression);
          props.setIsValidFilter(true)
          setInvalidMsg(new Map());
          setChildNo(result.matchedCollections.length);
          setTreeData(formatResponseData(result.matchedCollections));
        }
        setLoading(false);
      })
      .catch((err: React.SetStateAction<Error>) => {
        setApiError(true);
        setErrorMsg(err);
      });
  };

  const doCancel = () => {
    setShowClearDialog(false);
  };

  const doClear = () => {
    setParentSelected("parentInclude");
    setChildSelected("childInclude");
    setParentFilter("");
    setChildFilter("");
    setFormData(new Map());
    getFilterSchema(true, new Map());
    setShowClearDialog(false);
  };

  React.useEffect(() => {
    const formDataCopy = new Map(formData);
    if (parentSelected === "parentExclude") {
      formDataCopy.delete(props.parentIncludeList);
      parentFilter
        ? formDataCopy.set(props.parentExcludeList, parentFilter)
        : formDataCopy.delete(props.parentExcludeList);
    } else {
      formDataCopy.delete(props.parentExcludeList);
      parentFilter
        ? formDataCopy.set(props.parentIncludeList, parentFilter)
        : formDataCopy.delete(props.parentIncludeList);
    }
    setFormData(formDataCopy);
    props.setIsValidFilter(false);
  }, [parentSelected, parentFilter]);

  React.useEffect(() => {
    const formDataCopy = new Map(formData);
    if (childSelected === "childExclude") {
      formDataCopy.delete(props.childIncludeList);
      childFilter
        ? formDataCopy.set(props.childExcludeList, childFilter)
        : formDataCopy.delete(props.childExcludeList);
    } else {
      formDataCopy.delete(props.childExcludeList);
      childFilter
        ? formDataCopy.set(props.childIncludeList, childFilter)
        : formDataCopy.delete(props.childIncludeList);
    }
    setFormData(formDataCopy);
    props.setIsValidFilter(false);
  }, [childSelected, childFilter]);

  React.useEffect(() => {
    getFilterSchema(false, props.filterValues);
  }, []);

  return (
    <>
      <Title headingLevel="h2" size="3xl">
        {props.i18nFilterConfiguration}
      </Title>
      <Text component={TextVariants.h2}>
        {props.i18nFilterPageHeadingText}
      </Text>
      <Form className="child-selection-step_form">
        <FormGroup
          label={props.i18nFilterParentLabel}
          fieldId="parent_filter"
          helperText={
            parentSelected === "parentExclude" ? (
              <Text
                component={TextVariants.h4}
                className="child-selection-step_info"
              >
                <InfoCircleIcon />
                {props.i18nFilterParentHelperText}
              </Text>
            ) : (
              ""
            )
          }
          labelIcon={
            <Popover bodyContent={<div>{parentFilterInfo}<br /><a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_Expressions" target="_blank">More Info</a></div>}>
              <button
                aria-label="More info for schema filter field"
                onClick={(e) => e.preventDefault()}
                aria-describedby="simple-form-schema"
                className="pf-c-form__group-label-help"
              >
                <HelpIcon noVerticalAlign={true} />
              </button>
            </Popover>
          }
          helperTextInvalid={
            invalidMsg?.size !== 0
              ? getInvalidFilterMsg("parent", invalidMsg)
              : ""
          }
          helperTextInvalidIcon={<ExclamationCircleIcon />}
          validated={
            invalidMsg?.size !== 0 && getInvalidFilterMsg("parent", invalidMsg)
              ? "error"
              : "default"
          }
        >
          <Flex>
            <FlexItem>
              <TextInput
                value={parentFilter}
                validated={
                  invalidMsg?.size !== 0 &&
                  getInvalidFilterMsg("parent", invalidMsg)
                    ? "error"
                    : "default"
                }
                type="text"
                id="parent_filter"
                aria-describedby="schema_filter-helper"
                name="parent_filter"
                onChange={handleParentFilter}
                placeholder={`e.g ${props.parent}1,${props.parent}2`}
              />
            </FlexItem>
            <FlexItem>
              <ToggleGroup aria-label="Include Exclude schema toggle group">
                <ToggleGroupItem
                  buttonId="parentInclude"
                  isSelected={parentSelected === "parentInclude"}
                  onChange={handleParentToggle}
                  onClick={(e) => e.preventDefault()}
                  text={props.i18nInclude}
                />
                <ToggleGroupItem
                  buttonId="parentExclude"
                  isSelected={parentSelected === "parentExclude"}
                  onChange={handleParentToggle}
                  onClick={(e) => e.preventDefault()}
                  text={props.i18nExclude}
                />
              </ToggleGroup>
            </FlexItem>
          </Flex>
        </FormGroup>
        <FormGroup
          label={props.i18nFilterChildLabel}
          fieldId="child_filter"
          helperText={
            childSelected === "childExclude" ? (
              <Text
                component={TextVariants.h4}
                className="child-selection-step_info"
              >
                <InfoCircleIcon />
                {props.i18nFilterChildHelperText}
              </Text>
            ) : (
              ""
            )
          }
          labelIcon={
            <Popover bodyContent={<div>{childFilterInfo}<br /><a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_Expressions" target="_blank">More Info</a></div>}>
              <button
                aria-label="More info for table filter field"
                onClick={(e) => e.preventDefault()}
                aria-describedby="simple-form-table"
                className="pf-c-form__group-label-help"
              >
                <HelpIcon noVerticalAlign={true} />
              </button>
            </Popover>
          }
          helperTextInvalid={
            invalidMsg?.size !== 0
              ? getInvalidFilterMsg("child", invalidMsg)
              : ""
          }
          helperTextInvalidIcon={<ExclamationCircleIcon />}
          validated={
            invalidMsg?.size !== 0 && getInvalidFilterMsg("child", invalidMsg)
              ? "error"
              : "default"
          }
        >
          <Flex>
            <FlexItem>
              <TextInput
                validated={
                  invalidMsg?.size !== 0 &&
                  getInvalidFilterMsg("child", invalidMsg)
                    ? "error"
                    : "default"
                }
                value={childFilter}
                onChange={handleChildFilter}
                type="text"
                id="child_filter"
                name="child_filter"
                placeholder={`e.g ${props.parent}1.*,${props.parent}2.${props.child}1`}
              />
            </FlexItem>
            <FlexItem>
              <ToggleGroup aria-label="Include Exclude tables toggle group">
                <ToggleGroupItem
                  buttonId="childInclude"
                  isSelected={childSelected === "childInclude"}
                  onChange={handleChildToggle}
                  onClick={(e) => e.preventDefault()}
                  text={props.i18nInclude}
                />
                <ToggleGroupItem
                  buttonId="childExclude"
                  isSelected={childSelected === "childExclude"}
                  onChange={handleChildToggle}
                  onClick={(e) => e.preventDefault()}
                  text={props.i18nExclude}
                />
              </ToggleGroup>
            </FlexItem>
          </Flex>
        </FormGroup>
        <ActionGroup>
          <Button variant="secondary" onClick={applyFilter}>
            {props.i18nApply}
          </Button>
          <Button variant="link" isInline={true} onClick={clearFilter}>
            {props.i18nClearFilters}
          </Button>
        </ActionGroup>
      </Form>
      <Divider />
      {!apiError && (loading ? (
        <Spinner />
      ) : (invalidMsg?.size !== 0) ? (
        <Alert
          variant={"danger"}
          isInline={true}
          title={props.i18nInvalidFilterText}
        />
      ) : props.filterValues.size !== 0 ? (
        <Alert
          variant={childNo !== 0 ? "info" : "warning"}
          isInline={true}
          title={
            childNo !== 0
              ? `${childNo} ${props.i18nMatchingFilterExpMsg}`
              : props.i18nNoMatchingFilterExpMsg
          }
        >
          <p>
            {props.i18nClearFilterText+" "}
            <a onClick={clearFilter}>{props.i18nClearFilters}</a>
          </p>
        </Alert>
      ) : (
        <Alert
          variant="info"
          isInline={true}
          title={`${childNo} ${props.i18nFilterExpressionResultText}`}
        />
      ))}

      <FilterTreeComponent
        treeData={treeData}
        loading={loading}
        apiError={apiError}
        errorMsg={errorMsg}
        invalidMsg={invalidMsg}
        i18nNoMatchingTables={props.i18nNoMatchingTables}
        i18nNoMatchingFilterExpMsg={props.i18nNoMatchingFilterExpMsg}
        i18nInvalidFilters={props.i18nInvalidFilters}
        i18nInvalidFilterExpText={props.i18nInvalidFilterExpText}
      />
      <ConfirmationDialog
        buttonStyle={ConfirmationButtonStyle.NORMAL}
        i18nCancelButtonText={props.i18nCancel}
        i18nConfirmButtonText={props.i18nClear}
        i18nConfirmationMessage={props.i18nClearFilterConfMsg}
        i18nTitle={props.i18nClearFilters}
        showDialog={showClearDialog}
        onCancel={doCancel}
        onConfirm={doClear}
      />
    </>
  );
};
