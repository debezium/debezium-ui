import { ConnectorProperty } from "@debezium/ui-models";
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
  TreeView,
} from "@patternfly/react-core";
import { InfoCircleIcon } from "@patternfly/react-icons";
import React from "react";
import { PropertyCategory } from "src/app/shared";
import "./FiltersStepComponent.css";

export interface IFiltersStepComponentProps {
  propertyDefinitions: ConnectorProperty[];
  propertyValues: Map<string, string>;
  onValidateProperties: (
    connectorProperties: Map<string, string>,
    category: PropertyCategory
  ) => void;
}

export const FiltersStepComponent: React.FunctionComponent<IFiltersStepComponentProps> = () => {
  const [schemaFilter, setSchemaFilter] = React.useState<string>("");
  const [tableFilter, setTableFilter] = React.useState<string>("");
  const [schemaExclusion, setSchemaExclusion] = React.useState<boolean>(false);
  const [tableExclusion, setTableExclusion] = React.useState<boolean>(false);

  const [apply, setApply] = React.useState<boolean>(false);

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

  const [activeItems, setActiveItems] = React.useState<any>();

  const onClick = (evt: any, treeViewItem: any, parentItem: any) => {
    setActiveItems([treeViewItem, parentItem]);
  };

  const options = [
    {
      name: "ApplicationLauncher",
      id: "AppLaunch",
      children: [
        {
          name: "Application 1",
          id: "App1",
        },
        {
          name: "Application 2",
          id: "App2",
        },
      ],
      defaultExpanded: true,
    },
    {
      name: "Cost Management",
      id: "Cost",
      children: [
        {
          name: "Application 3",
          id: "App3",
        },
      ],
    },
    {
      name: "Sources",
      id: "Sources",
      children: [
        {
          name: "Application 4",
          id: "App4",
        },
      ],
    },
    {
      name: "newTest",
      id: "Long",
      children: [{ name: "Application 5", id: "App5" }],
    },
  ];

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
          <Button variant="primary" onClick={() => {setApply(!apply)}}>Apply</Button>
        </ActionGroup>
      </Form>
      <Divider />
      {apply && <Alert
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
      </Alert>}
      
      <TreeView
        data={options}
        activeItems={activeItems}
        onSelect={onClick}
        hasBadges={true}
      />
    </>
  );
};
