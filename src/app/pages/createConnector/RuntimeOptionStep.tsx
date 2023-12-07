
import { FormInputComponent } from "@app/components";
import { FormStep } from "@app/constants";
import {
  Form,
  FormFieldGroupExpandable,
  FormFieldGroupHeader,
} from "@patternfly/react-core";
import { cloneDeep, isNil } from "lodash";
import React, { useCallback } from "react";

interface RuntimeOptionStepProps {
  runtimeOptionEngineProperties: ConnectorProperties[];
  runtimeOptionHeartbeatProperties: ConnectorProperties[];
  formData: Record<string, any>;
  updateFormData: (key: string, value: any, formStep: FormStep) => void;
  requiredList: string[] | null | undefined;
}

export const RuntimeOptionStep: React.FC<RuntimeOptionStepProps> = ({
  runtimeOptionEngineProperties,
  runtimeOptionHeartbeatProperties,
  formData,
  updateFormData,
  requiredList,
}) => {
  return (
    <Form isWidthLimited>
      {runtimeOptionEngineProperties &&
        runtimeOptionEngineProperties.length !== 0 && (
          <FormFieldGroupExpandable
            isExpanded
            toggleAriaLabel="Details"
            header={
              <FormFieldGroupHeader
                titleText={{
                  text: "Engine properties",
                  id: "engine-properties",
                }}
                // titleDescription="Field group 3 description text."
              />
            }
          >
            {runtimeOptionEngineProperties.map((property) => {
              return (
                <FormInputComponent
                  property={{
                    ...cloneDeep(property),
                    // "x-name": property["x-name"].replace(/\./g, "_"),
                    "x-name": property["x-name"],
                  }}
                  requiredList={requiredList}
                  formStep={FormStep.RUNTIME_OPTION}
                  updateFormData={updateFormData}
                  formData={formData}
                  key={property.title}
                />
              );
            })}
          </FormFieldGroupExpandable>
        )}
      {runtimeOptionHeartbeatProperties &&
        runtimeOptionHeartbeatProperties.length !== 0 && (
          <FormFieldGroupExpandable
            isExpanded
            toggleAriaLabel="Details"
            header={
              <FormFieldGroupHeader
                titleText={{
                  text: "Heartbeat properties",
                  id: "heartbeat-properties",
                }}
                // titleDescription="Field group 3 description text."
              />
            }
          >
            {runtimeOptionHeartbeatProperties.map((property) => {
              return (
                <FormInputComponent
                  property={{
                    ...cloneDeep(property),
                    // "x-name": property["x-name"].replace(/\./g, "_"),
                    "x-name": property["x-name"],
                  }}
                  requiredList={requiredList}
                  formStep={FormStep.RUNTIME_OPTION}
                  updateFormData={updateFormData}
                  formData={formData}
                  key={property.title}
                />
              );
            })}
          </FormFieldGroupExpandable>
        )}
    </Form>
  );
};
