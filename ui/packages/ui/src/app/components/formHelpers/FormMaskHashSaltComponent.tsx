import {
  Flex,
  FlexItem,
  FormGroup,
  Grid,
  GridItem,
  InputGroup,
  Select,
  SelectOption,
  SelectVariant, TextInput
} from "@patternfly/react-core";
import { ExclamationCircleIcon } from "@patternfly/react-icons";
import { useField } from "formik";
import * as React from "react";
import "./FormMaskHashSaltComponent.css";
import { HelpInfoIcon } from "./HelpInfoIcon";

export interface IFormMaskHashSaltComponentProps {
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

export const FormMaskHashSaltComponent: React.FunctionComponent<IFormMaskHashSaltComponentProps> = (
  props
) => {
  const [field] = useField(props);
  const [isOpen, setOpen] = React.useState<boolean>(false)
  const [selected, setSelected] = React.useState<boolean>(false)

  /**
   * Return column segment from the supplied string
   * Format of string : columns&&hash||salt
   *   columns - first segment, ended with '&&'
   *   hash    - second segment, preceeded by '&&' and ended with '||'
   *   salt    - third segment, preceeded by '||'
   * @param val the 3 segment string
   */
  const getColsValue = (val: string) => {
    if (val && val.includes("&&")) {
      return val.split("&&")[0];
    }
    return "";
  };

  /**
   * Return hash segment from the supplied string
   * Format of string : columns&&hash||salt
   *   columns - first segment, ended with '&&'
   *   hash    - second segment, preceeded by '&&' and ended with '||'
   *   salt    - third segment, preceeded by '||'
   * @param val the 3 segment string
   */
  const getHashValue = (val: string) => {
    if (val && val.includes("&&")) {
      if (val.split("&&")[1]) {
        return val.split("&&")[1].split("||")[0];
      }
      return "";
    }
    return "";
  };

  /**
   * Return salt segment from the supplied string
   * Format of string : columns&&hash||salt
   *   columns - first segment, ended with '&&'
   *   hash    - second segment, preceeded by '&&' and ended with '||'
   *   salt    - third segment, preceeded by '||'
   * @param val the 3 segment string
   */
  const getSaltValue = (val: string) => {
    if (val && val.includes("&&")) {
      if (val.split("&&")[1]) {
        const trailing = val.split("&&")[1].split("||");
        return trailing[1] ? trailing[1] : "";
      }
      return "";
    }
    return "";
  };

  const onToggle = (open: boolean) => {
    setOpen(open)
  };

  const clearSelection = () => {
    setSelected(false)
    setOpen(false)
  };  

  const onSelect = (e, selection: boolean, isPlaceholder: boolean) => {
    if (isPlaceholder) {
      clearSelection();
    }
    else {
      setSelected(selection)
      setOpen(false)
      let newVal = getColsValue(field.value)+"&&"+selection+"||"+getSaltValue(field.value);
      props.setFieldValue(field.name, newVal, true);
      props.propertyChange(field.name, newVal);
    }
  };
  
  const selectOptions = [
    {"value": "Choose...", isPlaceholder: true},
    {"value": "MD2"},
    {"value": "MD5"}, 
    {"value": "SHA-1"}, 
    {"value": "SHA-256"}, 
    {"value": "SHA-384"}, 
    {"value": "SHA-512"}
  ]

  const handleTextInputChange = (
    val: string,
    event: React.FormEvent<HTMLInputElement>,
  ) => {
    const currentValue = field.value;
    let newVal = '';
    if (event.target.id.includes("column")) {
      newVal = val+"&&"+getHashValue(currentValue)+"||"+getSaltValue(currentValue);
    }else if(event.target.id === "salt") {
      newVal = getColsValue(currentValue)+"&&"+getHashValue(currentValue)+"||"+val;
    }
    // console.log("MaskHashSalt.setFieldValue name: " + field.name + ", value: " + newVal);
    props.setFieldValue(field.name, newVal, true);
    props.propertyChange(field.name, newVal);
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
          <GridItem span={5}>
            <Flex className={'form-mask-hash-salt-component-column'}>
              <FlexItem spacer={{ default: 'spacerXs' }} className="form-mask-hash-salt-component-label">Columns:</FlexItem>
              <FlexItem className={'form-mask-hash-salt-component-column-input'}>
                  <TextInput 
                    data-testid={id}
                    id={id}
                    type={"text"}
                    validated={props.validated}
                    onChange={handleTextInputChange}
                    defaultValue={getColsValue(field.value)}
                    onKeyPress={(event) => handleKeyPress(event as any)}
                  />
              </FlexItem>
            </Flex>
          </GridItem>
          <GridItem span={4}>
            <Flex>
              <FlexItem spacer={{ default: 'spacerXs' }} className="form-mask-hash-salt-component-label">Hash:</FlexItem>
              <FlexItem spacer={{ default: 'spacerXs' }}>
                <Select
                  variant={SelectVariant.single}
                  aria-label="Select Input"
                  onToggle={onToggle}
                  onSelect={onSelect}
                  selections={getHashValue(field.value)}
                  isOpen={isOpen}
                >
                  {selectOptions.map((option, index) => (
                    <SelectOption
                      key={index}
                      value={option.value}
                      isPlaceholder={option.isPlaceholder}
                    />
                  ))}
                </Select>
              </FlexItem>
            </Flex>
          </GridItem>
          <GridItem span={3}>
            <Flex>
              <FlexItem spacer={{ default: 'spacerXs' }} className="form-mask-hash-salt-component-label">Salt:</FlexItem>
              <FlexItem spacer={{ default: 'spacerXs' }}>
                <TextInput
                  data-testid={id}
                  id={"salt"}
                  type={"text"}
                  validated={props.validated}
                  onChange={handleTextInputChange}
                  defaultValue={getSaltValue(field.value)}
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
