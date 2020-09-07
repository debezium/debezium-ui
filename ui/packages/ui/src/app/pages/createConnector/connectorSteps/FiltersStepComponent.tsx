import {
  ConnectorProperty,
  DataCollection,
  FilterValidationResult,
} from "@debezium/ui-models";
import { Services } from "@debezium/ui-services";
import {
  ActionGroup,
  Alert,
  AlertActionCloseButton,
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

export const FiltersStepComponent: React.FunctionComponent<IFiltersStepComponentProps> = () => {
  const [schemaFilter, setSchemaFilter] = React.useState<string>("");
  const [tableFilter, setTableFilter] = React.useState<string>("");
  const [schemaExclusion, setSchemaExclusion] = React.useState<boolean>(false);
  const [tableExclusion, setTableExclusion] = React.useState<boolean>(false);

  const [apply, setApply] = React.useState<boolean>(false);

  const [treeData, setTreeData] = React.useState<any[]>([]);

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

  //Hard coding the propertyValues, later it will be passed from CreateConnectorPage 
  const propertyValues: Map<string, string> = new Map();
  propertyValues.set("database.hostname", "192.168.122.1");
  propertyValues.set("database.port", "5432");
  propertyValues.set("database.user", "postgres");
  propertyValues.set("database.password", "indra");
  propertyValues.set("database.dbname", "postgres");
  propertyValues.set("database.server.name", "fullfillment");

  React.useEffect(() => {
    fetch_retry(connectorService.validateFilters, connectorService, [
      "postgres",
      mapToObject(propertyValues),
    ])
      .then((result: FilterValidationResult) => {
        setLoading(false);
        if (result.status === "INVALID") {
          let resultStr = "";
          for (const e1 of result.propertyValidationResults) {
            resultStr = `${resultStr}\n${e1.property}: ${e1.message}`;
          }
          alert("filters are INVALID.  Results: \n" + resultStr);
        } else {
          setTreeData(formatResponceData(result.matchedCollections));
        }
      })
      .catch((err: React.SetStateAction<Error>) => {
        setApiError(true);
        setErrorMsg(err);
      });
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
            onClick={() => {
              setApply(!apply);
            }}
          >
            Apply
          </Button>
        </ActionGroup>
      </Form>
      <Divider />
      {apply && (
        <Alert
          isInline={true}
          variant="info"
          title="Result shows the schema and tables that you want to capture data changes."
          actionClose={
            <AlertActionCloseButton
              onClose={() => alert("Clicked the close button")}
            />
          }
        >
          <p>
            <a href="#">20 tables</a> have been excluded by the filtering. You
            could also find all the schema and table by clicking{" "}
            <a href="#">Clean the filters</a>
          </p>
        </Alert>
      )}

      <FilterTreeComponent
        treeData={treeData}
        loading={loading}
        apiError={apiError}
        errorMsg={errorMsg}
      />
    </>
  );
};
