
import { FormInputComponent } from "@app/components";
import { FormStep } from "@app/constants";
import {
  Form,
  FormFieldGroupExpandable,
  FormFieldGroupHeader,
} from "@patternfly/react-core";
import { cloneDeep, isNil } from "lodash";
import React, { useCallback } from "react";

interface DataOptionStepProps {
  dataOptionProperties: ConnectorProperties[];
  dataOptionAdvanceProperties: ConnectorProperties[];
  dataOptionSnapshotProperties: ConnectorProperties[];
  formData: Record<string, any>;
  updateFormData: (key: string, value: any, formStep: FormStep) => void;
  requiredList: string[] | null | undefined;
}

export const DataOptionStep: React.FC<DataOptionStepProps> = ({
  dataOptionProperties,
  dataOptionAdvanceProperties,
  dataOptionSnapshotProperties,
  formData,
  updateFormData,
  requiredList,
}) => {
  return (
    <Form isWidthLimited>
      {dataOptionProperties && dataOptionProperties.length !== 0 && (
        <FormFieldGroupExpandable
          isExpanded
          toggleAriaLabel="Details"
          header={
            <FormFieldGroupHeader
              titleText={{
                text: "Mapping properties",
                id: "mapping-properties",
              }}
              // titleDescription="Field group 3 description text."
            />
          }
        >
          {dataOptionProperties.map((property) => {
            return (
              <FormInputComponent
                property={{
                  ...cloneDeep(property),
                  // "x-name": property["x-name"].replace(/\./g, "_"),
                  "x-name": property["x-name"],
                }}
                requiredList={requiredList}
                formStep={FormStep.DATA_OPTION}
                updateFormData={updateFormData}
                formData={formData}
                key={property.title}
              />
            );
          })}
        </FormFieldGroupExpandable>
      )}

      {dataOptionAdvanceProperties &&
        dataOptionAdvanceProperties.length !== 0 && (
          <FormFieldGroupExpandable
            isExpanded
            toggleAriaLabel="Details"
            header={
              <FormFieldGroupHeader
                titleText={{
                  text: "Mapping advance properties",
                  id: "mapping-properties",
                }}
                // titleDescription="Field group 3 description text."
              />
            }
          >
            {dataOptionAdvanceProperties.map((property) => {
              return (
                <FormInputComponent
                  property={{
                    ...cloneDeep(property),
                    // "x-name": property["x-name"].replace(/\./g, "_"),
                    "x-name": property["x-name"],
                  }}
                  requiredList={requiredList}
                  formStep={FormStep.DATA_OPTION}
                  updateFormData={updateFormData}
                  formData={formData}
                  key={property.title}
                />
              );
            })}
          </FormFieldGroupExpandable>
        )}
      {dataOptionSnapshotProperties &&
        dataOptionSnapshotProperties.length !== 0 && (
          <FormFieldGroupExpandable
            isExpanded
            toggleAriaLabel="Details"
            header={
              <FormFieldGroupHeader
                titleText={{
                  text: "Snapshot properties",
                  id: "snapshot-properties",
                }}
                // titleDescription="Field group 3 description text."
              />
            }
          >
            {dataOptionSnapshotProperties.map((property) => {
              return (
                <FormInputComponent
                  property={{
                    ...cloneDeep(property),
                    // "x-name": property["x-name"].replace(/\./g, "_"),
                    "x-name": property["x-name"],
                  }}
                  requiredList={requiredList}
                  formStep={FormStep.DATA_OPTION}
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
