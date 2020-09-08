import {
  ConnectorProperty,
  DataCollection,
  FilterValidationResult,
} from "@debezium/ui-models";
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
  Switch,
  Text,
  TextInput,
  TextVariants,
  Title,
} from "@patternfly/react-core";
import { InfoCircleIcon } from "@patternfly/react-icons";
import _ from "lodash";
import React from "react";
import { FilterTreeComponent } from "src/app/components";
import { fetch_retry, mapToObject } from "src/app/shared";
import "./FiltersStepComponent.css";

export interface IFiltersStepComponentProps {
  propertyDefinitions: ConnectorProperty[];
  propertyValues: Map<string, string>;
}

const formatResponceData = (data: DataCollection[]) => {
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

export const FiltersStepComponent: React.FunctionComponent<IFiltersStepComponentProps> = (props) => {
  const [schemaFilter, setSchemaFilter] = React.useState<string>("");
  const [tableFilter, setTableFilter] = React.useState<string>("");
  const [schemaExclusion, setSchemaExclusion] = React.useState<boolean>(false);
  const [tableExclusion, setTableExclusion] = React.useState<boolean>(false);

  const [formData, setFormData] = React.useState<Map<string, string>>(new Map());
  const [apply, setApply] = React.useState<boolean>(false);
  const [treeData, setTreeData] = React.useState<any[]>([]);
  const [invalidMsg, setInvalidMsg] = React.useState<string>('');
  const [tableNo, setTableNo] = React.useState<number>(0);

  const [loading, setLoading] = React.useState(true);
  const [apiError, setApiError] = React.useState<boolean>(false);
  const [errorMsg, setErrorMsg] = React.useState<Error>(new Error());

  const handleSchemaFilter = (val: string) => {
    setSchemaFilter(val);
  };
  const handleTableFilter = (val: string) => {
    setTableFilter(val);
  };

  const handleSchemaExclusion = (isChecked: boolean) => {
    setSchemaExclusion(isChecked);
  };
  const handleTableExclusion = (isChecked: boolean) => {
    setTableExclusion(isChecked);
  };

  const connectorService = Services.getConnectorService();

  const applyFilter = () => {
    setApply(true);
    getFilterSchema();
  }

  const clearFilter = () => {
    setSchemaExclusion(false);
    setTableExclusion(false);
    setSchemaFilter("");
    setTableFilter("");
    setFormData(new Map());
  }

  const getFilterSchema = () => {
    fetch_retry(connectorService.validateFilters, connectorService, [
      "postgres",
      mapToObject(new Map(function* () { yield* props.propertyValues; yield* formData; }())),
    ])
      .then((result: FilterValidationResult) => {
        setLoading(false);
        if (result.status === "INVALID") {
          let resultStr = "";
          for (const e1 of result.propertyValidationResults) {
            resultStr = `${resultStr}\n${e1.property}: ${e1.message}`;
          }
          setInvalidMsg(resultStr);
        } else {
          setInvalidMsg('');
        }
        setTableNo(result.matchedCollections.length);
        setTreeData(formatResponceData(result.matchedCollections));

      })
      .catch((err: React.SetStateAction<Error>) => {
        setApiError(true);
        setErrorMsg(err);
      });
  }

  React.useEffect(() => {
    const formDataCopy = new Map(formData)
    if (schemaExclusion) {
      formDataCopy.delete("schema.include.list")
      schemaFilter ? formDataCopy.set("schema.exclude.list", schemaFilter) : formDataCopy.delete("schema.exclude.list")
    } else {
      formDataCopy.delete("schema.exclude.list")
      schemaFilter ? formDataCopy.set("schema.include.list", schemaFilter) : formDataCopy.delete("schema.include.list")
    }
    setFormData(formDataCopy);
  }, [schemaExclusion, schemaFilter]);

  React.useEffect(() => {
    const formDataCopy = new Map(formData);
    if (tableExclusion) {
      formDataCopy.delete("table.include.list")
      tableFilter ? formDataCopy.set("table.exclude.list", tableFilter) : formDataCopy.delete("table.exclude.list")
    } else {
      formDataCopy.delete("table.exclude.list")
      tableFilter ? formDataCopy.set("table.include.list", tableFilter) : formDataCopy.delete("table.include.list")
    }
    setFormData(formDataCopy);
  }, [tableExclusion, tableFilter]);

  React.useEffect(() => {
    getFilterSchema()
  }, []);

  return (
    <>
      <Title headingLevel="h2" size="3xl">
        Select tables
      </Title>
      <Text component={TextVariants.h2}>
        Start from filtering schemas; tables and colums by entring a
        comma-separated list of regular expresion that match the names of
        schema, table or column.
      </Text>
      <Form isHorizontal={true} className="filters-step-component_form">
        <FormGroup
          label="Schema filter"
          fieldId="schema_filter"
          helperText={
            schemaExclusion ? (
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
        >
          <Flex>
            <FlexItem>
              <TextInput
                value={schemaFilter}
                type="text"
                id="schema_filter"
                aria-describedby="schema_filter-helper"
                name="schema_filter"
                onChange={handleSchemaFilter}
                placeholder="Include the schemas that match the regular expresson"
              />
            </FlexItem>
            <FlexItem>
              <Switch
                id="schema-switch"
                label="Exclusion"
                labelOff="Exclusion"
                isChecked={schemaExclusion}
                onChange={handleSchemaExclusion}
              />
            </FlexItem>
          </Flex>
        </FormGroup>
        <FormGroup
          label="Table filter"
          fieldId="table_filter"
          helperText={
            tableExclusion ? (
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
        >
          <Flex>
            <FlexItem>
              <TextInput
                value={tableFilter}
                onChange={handleTableFilter}
                type="text"
                id="table_filter"
                name="table_filter"
                placeholder="Include the tables that match the regular expresson"
              />
            </FlexItem>
            <FlexItem>
              <Switch
                id="table-switch"
                label="Exclusion"
                labelOff="Exclusion"
                isChecked={tableExclusion}
                onChange={handleTableExclusion}
              />
            </FlexItem>
          </Flex>
        </FormGroup>
        <ActionGroup>
          <Button
            variant="primary"
            onClick={applyFilter}
          >
            Apply
          </Button>
          <Button variant="link" isInline onClick={clearFilter}>
            Clear filters
    </Button>
        </ActionGroup>
      </Form>
      <Divider />
      {apply ? (
        <Alert
          variant="info"
          title={`There are ${treeData.length} schemas and ${tableNo} tables that match the filters.`}

        >
          <p>You can also find all the schemas and tables by clicking <a>Clean the filters</a></p>
        </Alert>
      ) : (

          <Alert
            variant="info"
            title={`There are ${treeData.length} schemas and ${tableNo} tables available for capturing the data change. You can select schema and tables by filtering.`}

          />
        )}

      <FilterTreeComponent
        treeData={treeData}
        loading={loading}
        apiError={apiError}
        errorMsg={errorMsg}
        invalidMsg={invalidMsg}
      />
    </>
  );
};
