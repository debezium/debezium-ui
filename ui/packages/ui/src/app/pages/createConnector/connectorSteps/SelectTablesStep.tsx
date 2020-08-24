import React from "react";
import {
  Title,
  Text,
  TextVariants,
  Flex,
  FlexItem,
  Radio,
  InputGroup,
  TextInput,
  Button,
  Divider,
} from "@patternfly/react-core";
import "./SelectTablesStep.css";
import { SearchIcon } from "@patternfly/react-icons";

// tslint:disable-next-line: no-empty-interface
export interface ISelectTablesStepProps {}
export const SelectTablesStep: React.FunctionComponent<ISelectTablesStepProps> = (
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
      <Flex className="select-tables-step_radioIcon">
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
      <InputGroup className="select-tables-step_searchBar select-tables-step_radioIcon">
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
