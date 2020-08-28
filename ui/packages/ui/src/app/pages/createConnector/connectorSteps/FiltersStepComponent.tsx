import { ConnectorProperty } from "@debezium/ui-models";
import {
  Button,
  Divider,
  Flex,
  FlexItem,
  InputGroup,
  Radio,
  Text,
  TextInput,
  TextVariants,
  Title,
} from "@patternfly/react-core";
import { SearchIcon } from "@patternfly/react-icons";
import React from "react";
import "./FiltersStepComponent.css";

// tslint:disable-next-line: no-empty-interface
export interface IFiltersStepComponentProps {
  propertyDefinitions: ConnectorProperty[];
  propertyValues: Map<string,string>;
  onValidateProperties: (connectorProperties: Map<string,string>) => void;
  onSaveProperties: (connectorProperties: Map<string,string>) => void;
}

export const FiltersStepComponent: React.FunctionComponent<IFiltersStepComponentProps> = (
  props
) => {

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
      <Flex className="filters-step-component_radioIcon">
        <FlexItem>
          <Radio
            isChecked={true}
            name="radio-inclusion"
            // tslint:disable-next-line
            onChange={() => {
              // tslint:disable-next-line
              console.log("");
            }}
            label="Inclusion"
            id="radio-inclusion"
          />
        </FlexItem>
        <FlexItem>
          <Radio
            isChecked={false}
            name="radio-exclusion"
            // tslint:disable-next-line
            onChange={() => {
              // tslint:disable-next-line
              console.log("");
            }}
            label="Exclusion"
            id="radio-exclusion"
          />
        </FlexItem>
      </Flex>
      <InputGroup className="filters-step-component_searchBar filters-step-component_radioIcon">
        <TextInput
          name="textInput11"
          id="textInput11"
          type="search"
          aria-label="search input example"
          placeholder="Filter by expression, enter * for all schemas and tables"
        />
        <Button variant="control" aria-label="search button for search input">
          <SearchIcon />
        </Button>
      </InputGroup>
      <Divider />
    </>
  );
};
