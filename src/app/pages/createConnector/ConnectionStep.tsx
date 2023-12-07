import { FormInputComponent, validate } from "@app/components";
import { FormStep } from "@app/constants";
import {
  BackToTop,
  Button,
  Form,
  FormFieldGroupExpandable,
  FormFieldGroupHeader,
  FormGroup,
  FormHelperText,
  HelperText,
  HelperTextItem,
  TextInput,
} from "@patternfly/react-core";
import { ExclamationCircleIcon, TrashIcon } from "@patternfly/react-icons";
import { cloneDeep, isNil } from "lodash";
import React, { FormEvent, useCallback, useRef } from "react";

interface ConnectionStepProps {
  connectionBasicProperties: ConnectorProperties[];
  connectionAdvancedProperties: ConnectorProperties[];
  connectorName: Record<string, any>;
  formData: Record<string, any>;
  updateFormData: (key: string, value: any, formStep: FormStep) => void;
  requiredList: string[] | null | undefined;
}

export const ConnectionStep: React.FC<ConnectionStepProps> = ({
  connectionBasicProperties,
  connectionAdvancedProperties,
  connectorName,
  formData,
  updateFormData,
  requiredList,
}) => {
  // const ref = useRef<HTMLInputElement>(null);

  const [validated, setValidated] = React.useState<validate>("default");

  const handleNameChange = (
    _event: FormEvent<HTMLInputElement>,
    value: string
  ) => {
    if (value === "") {
      setValidated("error");
    } else {
      setValidated("default");
    }
    updateFormData("name", value, FormStep.CONNECTOR_NAME);
  };

  //   const scrollToTop = () => {
  //     console.log("scroll to top");
  //     if(ref.current){
  //       ref.current.scrollIntoView({behavior: 'smooth'});
  //     }

  // };

  return (
    <>
      <Form
        isWidthLimited
        // ref={ref}
      >
        <FormGroup label="Connector name" isRequired fieldId="connector-name">
          <TextInput
            isRequired
            validated={validated}
            type="text"
            id="simple-form-name-01"
            name="simple-form-name-01"
            aria-describedby="simple-form-name-01-helper"
            value={connectorName.name}
            onChange={handleNameChange}
          />
          <FormHelperText>
            <HelperText>
              <HelperTextItem
                icon={validated === "error" ? <ExclamationCircleIcon /> : <></>}
                variant={validated}
              >
                {validated === "error"
                  ? "Connector name is required."
                  : "Enter a connector name that is unique from other existing connectors."}
              </HelperTextItem>
            </HelperText>
          </FormHelperText>
        </FormGroup>

        {connectionBasicProperties &&
          connectionBasicProperties.length !== 0 && (
            <FormFieldGroupExpandable
              isExpanded
              toggleAriaLabel="Details"
              header={
                <FormFieldGroupHeader
                  titleText={{
                    text: "Basic Connection Properties",
                    id: "basic-connection-properties",
                  }}
                  // titleDescription="Field group 3 description text."
                />
              }
            >
              {connectionBasicProperties.map((property) => {
                return (
                  <FormInputComponent
                    property={{
                      ...cloneDeep(property),
                      // "x-name": property["x-name"].replace(/\./g, "_"),
                      "x-name": property["x-name"],
                    }}
                    requiredList={requiredList}
                    formStep={FormStep.CONNECTION}
                    updateFormData={updateFormData}
                    formData={formData}
                    key={property.title}
                  />
                );
              })}
            </FormFieldGroupExpandable>
          )}

        {connectionAdvancedProperties &&
          connectionAdvancedProperties.length !== 0 && (
            <FormFieldGroupExpandable
              isExpanded
              toggleAriaLabel="Details"
              header={
                <FormFieldGroupHeader
                  titleText={{
                    text: "Advance Connection Properties",
                    id: "advance-connection-properties",
                  }}
                  // titleDescription="Field group 3 description text."
                />
              }
            >
              {connectionAdvancedProperties.map((property) => {
                return (
                  <FormInputComponent
                    property={{
                      ...cloneDeep(property),
                      // "x-name": property["x-name"].replace(/\./g, "_"),
                      "x-name": property["x-name"],
                    }}
                    requiredList={requiredList}
                    formStep={FormStep.CONNECTION}
                    updateFormData={updateFormData}
                    formData={formData}
                    key={property.title}
                  />
                );
              })}
            </FormFieldGroupExpandable>
          )}
      </Form>
      {/* <BackToTop isAlwaysVisible onClick={scrollToTop} style={{zIndex: 9999}}/> */}
    </>
  );
};
