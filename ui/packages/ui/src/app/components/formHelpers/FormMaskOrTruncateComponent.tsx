import {
  Flex,
  FlexItem,
  FormGroup,
  Grid,
  GridItem,
  InputGroup,
  TextInput,
} from "@patternfly/react-core";
import { ExclamationCircleIcon } from "@patternfly/react-icons";
import { useField } from "formik";
import * as React from "react";
import "./FormMaskOrTruncateComponent.css";
import { HelpInfoIcon } from "./HelpInfoIcon";

export interface IFormMaskOrTruncateComponentProps {
  label: string;
  description: string;
  name: string;
  fieldId: string;
  helperTextInvalid?: any;
  isRequired: boolean;
  validated?: "default" | "success" | "warning" | "error" | undefined;
  propertyChange: (name: string, selection: any) => void;
  setFieldValue: (
    field: string,
    value: any,
    shouldValidate?: boolean | undefined
  ) => void;
}

export const FormMaskOrTruncateComponent: React.FunctionComponent<IFormMaskOrTruncateComponentProps> = (
  props
) => {
  const [field] = useField(props);

  const handleTextInputChange = (
    val: string,
    event: React.FormEvent<HTMLInputElement>
  ) => {
    const currentValue = field.value;
    let newVal = "";
    if (event.target.id.includes("column")) {
      if (currentValue.includes("&&")) {
        const n = currentValue.split("&&")[1];
        newVal = val + "&&" + n;
      } else {
        newVal = val + "&&";
      }
    } else {
      if (currentValue.includes("&&")) {
        const columnList = currentValue.split("&&")[0];
        newVal = columnList + "&&" + val;
      } else {
        newVal = "&&" + val;
      }
    }
    props.setFieldValue(field.name, newVal, true);
  };

  const id = field.name;
  const handleKeyPress = (keyEvent: KeyboardEvent) => {
    // do not allow entry of '.' or '-'
    if (keyEvent.key === "." || keyEvent.key === "-") {
      keyEvent.preventDefault();
    }
  };

  return (
    <FormGroup
      label={props.label}
      isRequired={props.isRequired}
      labelIcon={
        <HelpInfoIcon label={props.label} description={props.description} />
      }
      helperTextInvalid={props.helperTextInvalid}
      helperTextInvalidIcon={<ExclamationCircleIcon />}
      fieldId={id}
      validated={props.validated}
    >
      <InputGroup>
        <Grid>
          <GridItem span={9}>
            <Flex className={'form-mask-or-truncate-component-column'}>
              <FlexItem spacer={{ default: 'spacerXs' }}>Columns:</FlexItem>
              <FlexItem className={'form-mask-or-truncate-component-column-input'}>
                <TextInput 
                  data-testid={id}
                  id={id}
                  type={"text"}
                  validated={props.validated}
                  onChange={handleTextInputChange}
                  defaultValue={field.value.split("&&")[0]}
                  onKeyPress={(event) => handleKeyPress(event as any)}
                />
              </FlexItem>
            </Flex>
          </GridItem>
          <GridItem span={3}>
            <Flex>
              <FlexItem spacer={{ default: 'spacerXs' }}>n:</FlexItem>
              <FlexItem>
                <TextInput
                  min={"1"}
                  data-testid={id}
                  id={"n"}
                  type={"number"}
                  validated={props.validated}
                  onChange={handleTextInputChange}
                  defaultValue={field.value.split("&&")[1]}
                  onKeyPress={(event) => handleKeyPress(event as any)}
                />
              </FlexItem>
            </Flex>
          </GridItem>
        </Grid>
      </InputGroup>
    </FormGroup>
  );
};
