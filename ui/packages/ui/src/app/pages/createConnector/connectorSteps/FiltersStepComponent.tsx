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
import React from "react";
import { FilterTreeComponent } from "src/app/components";
import {
  ConfirmationButtonStyle,
  ConfirmationDialog,
  fetch_retry,
  mapToObject,
} from "src/app/shared";
import "./FiltersStepComponent.css";

export interface IFiltersStepComponentProps {
  propertyValues: Map<string, string>;
  filterValues: Map<string, string>;
  connectorType: string;
  updateFilterValues: (data: Map<string, string>) => void;
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

export const FiltersStepComponent: React.FunctionComponent<IFiltersStepComponentProps> = (
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
        setLoading(false);
        if (result.status === "INVALID") {
          const errorMap = new Map();
          for (const e of result.propertyValidationResults) {
            errorMap.set(e.property, e.message);
          }
          setInvalidMsg(errorMap);
        } else {
          // tslint:disable-next-line: no-unused-expression
          saveFilter && props.updateFilterValues(filterExpression);
          setInvalidMsg(new Map());
          setTableNo(result.matchedCollections.length);
          setTreeData(formatResponseData(result.matchedCollections));
        }
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
  }, [tableSelected, tableFilter]);

  React.useEffect(() => {
    getFilterSchema(false, props.filterValues);
  }, []);

  return (
    <>
      <Title headingLevel="h2" size="3xl">
        Select tables
      </Title>
      <Text component={TextVariants.h2}>
        Start from filtering schemas; tables and columns by entering a
        comma-separated list of regular expression that match the names of
        schema, table or column.
      </Text>
      <Form isHorizontal={true} className="filters-step-component_form">
        <FormGroup
          label="Schema filter"
          fieldId="schema_filter"
          helperText={
            schemaSelected === "schemaExclude" ? (
              <Text
                component={TextVariants.h4}
                className="filters-step-component_info"
              >
                <InfoCircleIcon />
                This filter will exclude the schema that matches the expression.
              </Text>
            ) : (
              ""
            )
          }
          labelIcon={
            <Popover bodyContent={<div>e.g schema1,schema2</div>}>
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
                placeholder="Include the schemas that match the regular expression"
              />
            </FlexItem>
            <FlexItem>
              <ToggleGroup aria-label="Default with single selectable">
                <ToggleGroupItem
                  buttonId="schemaInclude"
                  isSelected={schemaSelected === "schemaInclude"}
                  onChange={handleSchemaToggle}
                  onClick={(e) => e.preventDefault()}
                >
                  Include
                </ToggleGroupItem>
                <ToggleGroupItem
                  buttonId="schemaExclude"
                  isSelected={schemaSelected === "schemaExclude"}
                  onChange={handleSchemaToggle}
                  onClick={(e) => e.preventDefault()}
                >
                  Exclude
                </ToggleGroupItem>
              </ToggleGroup>
            </FlexItem>
          </Flex>
        </FormGroup>
        <FormGroup
          label="Table filter"
          fieldId="table_filter"
          helperText={
            tableSelected === "tableExclude" ? (
              <Text
                component={TextVariants.h4}
                className="filters-step-component_info"
              >
                <InfoCircleIcon />
                This filter will exclude the tables that matches the expression.
              </Text>
            ) : (
              ""
            )
          }
          labelIcon={
            <Popover bodyContent={<div>e.g schema1.*,schema2.table1</div>}>
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
                placeholder="Include the tables that match the regular expression"
              />
            </FlexItem>
            <FlexItem>
              <ToggleGroup aria-label="Default with single selectable">
                <ToggleGroupItem
                  buttonId="tableInclude"
                  isSelected={tableSelected === "tableInclude"}
                  onChange={handleTableToggle}
                  onClick={(e) => e.preventDefault()}
                >
                  Include
                </ToggleGroupItem>
                <ToggleGroupItem
                  buttonId="tableExclude"
                  isSelected={tableSelected === "tableExclude"}
                  onChange={handleTableToggle}
                  onClick={(e) => e.preventDefault()}
                >
                  Exclude
                </ToggleGroupItem>
              </ToggleGroup>
            </FlexItem>
          </Flex>
        </FormGroup>
        <ActionGroup>
          <Button variant="primary" onClick={applyFilter}>
            Apply
          </Button>
          <Button variant="link" isInline={true} onClick={clearFilter}>
            Clear filters
          </Button>
        </ActionGroup>
      </Form>
      <Divider />
      {invalidMsg?.size !== 0 ? (
        <Alert
          variant={"danger"}
          isInline={true}
          title={"The input expression for filtering tables are invalid."}
        />
      ) : props.filterValues.size !== 0 ? (
        <Alert
          variant={tableNo !== 0 ? "info" : "warning"}
          isInline={true}
          title={
            tableNo !== 0
              ? `The specified filters result in ${tableNo} tables for which changes will be captured`
              : "The specified filters do not result in any matching tables"
          }
        >
          <p>
            You can also find all the schemas and tables by clicking{" "}
            <a onClick={clearFilter}>All tables</a>
          </p>
        </Alert>
      ) : (
        <Alert
          variant="info"
          isInline={true}
          title={`There are ${tableNo} tables available for capturing the data change. You can also select schema and tables by filtering.`}
        />
      )}

      <FilterTreeComponent
        treeData={treeData}
        loading={loading}
        apiError={apiError}
        errorMsg={errorMsg}
      />
      <ConfirmationDialog
        buttonStyle={ConfirmationButtonStyle.NORMAL}
        i18nCancelButtonText={"Cancel"}
        i18nConfirmButtonText={"Clear"}
        i18nConfirmationMessage={
          "You will clear all the filtering expression if you perform the clear filters. \nAre you sure you want to clear."
        }
        i18nTitle={"Clear all filters?"}
        showDialog={showClearDialog}
        onCancel={doCancel}
        onConfirm={doClear}
      />
    </>
  );
};
