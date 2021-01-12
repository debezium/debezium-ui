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
import "./TableSelectionStep.css";

export interface ITableSelectionStepProps {
  propertyValues: Map<string, string>;
  filterValues: Map<string, string>;
  connectorType: string;
  updateFilterValues: (data: Map<string, string>) => void;
  setIsValidFilter: (val:SetStateAction<boolean>) => void;
  i18nFilterSchemaInfoMsg: string;
  i18nFilterTableInfoMsg: string;
  i18nTableSelection: string;
  i18nFilterPageHeadingText: string;
  i18nSchemaFilter: string;
  i18nSchemaFilterHelperText: string;
  i18nInclude: string;
  i18nExclude: string;
  i18nTableFilter: string;
  i18nTableFilterHelperText: string;
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

const getSchemaExpression = (data: Map<string, string>): string => {
  return (
    data.get("schema.exclude.list") || data.get("schema.include.list") || ""
  );
};

const getTableExpression = (data: Map<string, string>): string => {
  return data.get("table.exclude.list") || data.get("table.include.list") || "";
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

export const TableSelectionStep: React.FunctionComponent<ITableSelectionStepProps> = (
  props
) => {
  const [schemaFilter, setSchemaFilter] = React.useState<string>(
    getSchemaExpression(props.filterValues)
  );
  const [tableFilter, setTableFilter] = React.useState<string>(
    getTableExpression(props.filterValues)
  );
  const [schemaSelected, setSchemaSelected] = React.useState<string>(
    props.filterValues.has("schema.exclude.list")
      ? "schemaExclude"
      : "schemaInclude"
  );
  const [tableSelected, setTableSelected] = React.useState<string>(
    props.filterValues.has("schema.exclude.list")
      ? "tableExclude"
      : "tableInclude"
  );

  const [formData, setFormData] = React.useState<Map<string, string>>(
    new Map()
  );
  const [treeData, setTreeData] = React.useState<any[]>([]);
  const [invalidMsg, setInvalidMsg] = React.useState<Map<string, string>>();
  const [tableNo, setTableNo] = React.useState<number>(0);
  const [showClearDialog, setShowClearDialog] = React.useState<boolean>(false);

  const [loading, setLoading] = React.useState(true);
  const [apiError, setApiError] = React.useState<boolean>(false);
  const [errorMsg, setErrorMsg] = React.useState<Error>(new Error());

  const schemaFilterInfo = props.i18nFilterSchemaInfoMsg;
  const tableFilterInfo = props.i18nFilterTableInfoMsg;

  const handleSchemaFilter = (val: string) => {
    setSchemaFilter(val);
  };
  const handleTableFilter = (val: string) => {
    setTableFilter(val);
  };

  const handleSchemaToggle = (isSelected: any, event: any) => {
    const id = event.currentTarget.id;
    setSchemaSelected(id);
  };

  const handleTableToggle = (isSelected: any, event: any) => {
    const id = event.currentTarget.id;
    setTableSelected(id);
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
          setTableNo(result.matchedCollections.length);
        } else {
          // tslint:disable-next-line: no-unused-expression
          saveFilter && props.updateFilterValues(filterExpression);
          props.setIsValidFilter(true)
          setInvalidMsg(new Map());
          setTableNo(result.matchedCollections.length);
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
    setSchemaSelected("schemaInclude");
    setTableSelected("tableInclude");
    setSchemaFilter("");
    setTableFilter("");
    setFormData(new Map());
    getFilterSchema(true, new Map());
    setShowClearDialog(false);
  };

  React.useEffect(() => {
    const formDataCopy = new Map(formData);
    if (schemaSelected === "schemaExclude") {
      formDataCopy.delete("schema.include.list");
      schemaFilter
        ? formDataCopy.set("schema.exclude.list", schemaFilter)
        : formDataCopy.delete("schema.exclude.list");
    } else {
      formDataCopy.delete("schema.exclude.list");
      schemaFilter
        ? formDataCopy.set("schema.include.list", schemaFilter)
        : formDataCopy.delete("schema.include.list");
    }
    setFormData(formDataCopy);
    props.setIsValidFilter(false);
  }, [schemaSelected, schemaFilter]);

  React.useEffect(() => {
    const formDataCopy = new Map(formData);
    if (tableSelected === "tableExclude") {
      formDataCopy.delete("table.include.list");
      tableFilter
        ? formDataCopy.set("table.exclude.list", tableFilter)
        : formDataCopy.delete("table.exclude.list");
    } else {
      formDataCopy.delete("table.exclude.list");
      tableFilter
        ? formDataCopy.set("table.include.list", tableFilter)
        : formDataCopy.delete("table.include.list");
    }
    setFormData(formDataCopy);
    props.setIsValidFilter(false);
  }, [tableSelected, tableFilter]);

  React.useEffect(() => {
    getFilterSchema(false, props.filterValues);
  }, []);

  return (
    <>
      <Title headingLevel="h2" size="3xl">
        {props.i18nTableSelection}
      </Title>
      <Text component={TextVariants.h2}>
        {props.i18nFilterPageHeadingText}
      </Text>
      <Form className="table-selection-step_form">
        <FormGroup
          label={props.i18nSchemaFilter}
          fieldId="schema_filter"
          helperText={
            schemaSelected === "schemaExclude" ? (
              <Text
                component={TextVariants.h4}
                className="table-selection-step_info"
              >
                <InfoCircleIcon />
                {props.i18nSchemaFilterHelperText}
              </Text>
            ) : (
              ""
            )
          }
          labelIcon={
            <Popover bodyContent={<div>{schemaFilterInfo}<br /><a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_Expressions" target="_blank">More Info</a></div>}>
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
              ? getInvalidFilterMsg("schema", invalidMsg)
              : ""
          }
          helperTextInvalidIcon={<ExclamationCircleIcon />}
          validated={
            invalidMsg?.size !== 0 && getInvalidFilterMsg("schema", invalidMsg)
              ? "error"
              : "default"
          }
        >
          <Flex>
            <FlexItem>
              <TextInput
                value={schemaFilter}
                validated={
                  invalidMsg?.size !== 0 &&
                  getInvalidFilterMsg("schema", invalidMsg)
                    ? "error"
                    : "default"
                }
                type="text"
                id="schema_filter"
                aria-describedby="schema_filter-helper"
                name="schema_filter"
                onChange={handleSchemaFilter}
                placeholder="e.g schema1,schema2"
              />
            </FlexItem>
            <FlexItem>
              <ToggleGroup aria-label="Include Exclude schema toggle group">
                <ToggleGroupItem
                  buttonId="schemaInclude"
                  isSelected={schemaSelected === "schemaInclude"}
                  onChange={handleSchemaToggle}
                  onClick={(e) => e.preventDefault()}
                  text={props.i18nInclude}
                />
                <ToggleGroupItem
                  buttonId="schemaExclude"
                  isSelected={schemaSelected === "schemaExclude"}
                  onChange={handleSchemaToggle}
                  onClick={(e) => e.preventDefault()}
                  text={props.i18nExclude}
                />
              </ToggleGroup>
            </FlexItem>
          </Flex>
        </FormGroup>
        <FormGroup
          label={props.i18nTableFilter}
          fieldId="table_filter"
          helperText={
            tableSelected === "tableExclude" ? (
              <Text
                component={TextVariants.h4}
                className="table-selection-step_info"
              >
                <InfoCircleIcon />
                {props.i18nTableFilterHelperText}
              </Text>
            ) : (
              ""
            )
          }
          labelIcon={
            <Popover bodyContent={<div>{tableFilterInfo}<br /><a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_Expressions" target="_blank">More Info</a></div>}>
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
              ? getInvalidFilterMsg("table", invalidMsg)
              : ""
          }
          helperTextInvalidIcon={<ExclamationCircleIcon />}
          validated={
            invalidMsg?.size !== 0 && getInvalidFilterMsg("table", invalidMsg)
              ? "error"
              : "default"
          }
        >
          <Flex>
            <FlexItem>
              <TextInput
                validated={
                  invalidMsg?.size !== 0 &&
                  getInvalidFilterMsg("table", invalidMsg)
                    ? "error"
                    : "default"
                }
                value={tableFilter}
                onChange={handleTableFilter}
                type="text"
                id="table_filter"
                name="table_filter"
                placeholder="e.g schema1.*,schema2.table1"
              />
            </FlexItem>
            <FlexItem>
              <ToggleGroup aria-label="Include Exclude tables toggle group">
                <ToggleGroupItem
                  buttonId="tableInclude"
                  isSelected={tableSelected === "tableInclude"}
                  onChange={handleTableToggle}
                  onClick={(e) => e.preventDefault()}
                  text={props.i18nInclude}
                />
                <ToggleGroupItem
                  buttonId="tableExclude"
                  isSelected={tableSelected === "tableExclude"}
                  onChange={handleTableToggle}
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
          variant={tableNo !== 0 ? "info" : "warning"}
          isInline={true}
          title={
            tableNo !== 0
              ? `${tableNo} ${props.i18nMatchingFilterExpMsg}`
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
          title={`${tableNo} ${props.i18nFilterExpressionResultText}`}
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
