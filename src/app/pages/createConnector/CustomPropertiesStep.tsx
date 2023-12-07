import {
  EmptyState,
  EmptyStateVariant,
  EmptyStateIcon,
  EmptyStateBody,
  Button,
  Level,
  LevelItem,
  TextInput,
  Grid,
  GridItem,
  DescriptionList,
  DescriptionListDescription,
  DescriptionListGroup,
  DescriptionListTerm,
  Label,
  LabelGroup,
  Divider,
  Alert,
  Bullseye,
  Tooltip,
  Title,
  Modal,
  ModalVariant,
} from "@patternfly/react-core";
import {
  CircleIcon,
  CubesIcon,
  MinusCircleIcon,
  PlusCircleIcon,
} from "@patternfly/react-icons";
import { isEmpty } from "lodash";
import React, { FormEvent, useEffect } from "react";
import "./CustomPropertiesStep.css";

interface CustomPropertiesStepProps {
  formData: Record<string, any>;
  updateFormData: (formData: Record<string, string>) => void;
  isCustomPropertiesDirty: boolean;
  updateCustomFormDirty: (isDirty: boolean) => void;
  connectorProperties: Record<string, any>;
}

export const CustomPropertiesStep: React.FC<CustomPropertiesStepProps> = ({
  formData,
  updateFormData,
  connectorProperties,
  isCustomPropertiesDirty,
  updateCustomFormDirty,
}) => {
  const [properties, setProperties] = React.useState<
    Map<string, Record<string, string>>
  >(new Map<string, Record<string, string>>());

  const [isModalOpen, setIsModalOpen] = React.useState<boolean>(false);

  useEffect(() => {
    console.log("Custom Form data:", formData);
    const propertiesCopy = new Map();
    if (!isEmpty(formData)) {
      Object.keys(formData).forEach((key) => {
        propertiesCopy.set(self.crypto.randomUUID(), {
          key,
          value: formData[key],
        });
      });
    }
    propertiesCopy.set(self.crypto.randomUUID(), {
      key: "",
      value: "",
    });

    console.log("Custom Form Properties:", propertiesCopy);
    setProperties(propertiesCopy);
  }, []);

  const addProperty = () => {
    const propertiesCopy = new Map(properties);
    propertiesCopy.set(self.crypto.randomUUID(), {
      key: "",
      value: "",
    });
    setProperties(propertiesCopy);
    updateCustomFormDirty(true);
  };

  const deleteProperty = (id: string) => {
    const propertiesCopy = new Map(properties);
    propertiesCopy.delete(id);
    if (propertiesCopy.size === 0) {
      handleModalToggle();
    } else {
      updateCustomFormDirty(true);
      setProperties(propertiesCopy);
    }
  };

  const handleModalToggle = () => {
    setIsModalOpen(!isModalOpen);
  };

  const updateProperties = (key: string, field: string, value: any) => {
    const propertiesCopy = new Map(properties);
    const exactPropertyCopy = properties.get(key);

    exactPropertyCopy![field] = value;
    updateCustomFormDirty(true);
    propertiesCopy.set(key, exactPropertyCopy!);

    setProperties(propertiesCopy);
  };

  const clearProperties = () => {
    setProperties(new Map());
    updateFormData({});
    updateCustomFormDirty(true);
    handleModalToggle();
  };

  const handlePropertyChange = (
    event: FormEvent<HTMLInputElement>,
    value: string
  ) => {
    event.currentTarget.id.includes("key")
      ? updateProperties(event.currentTarget.id.split("_")[1], "key", value)
      : updateProperties(event.currentTarget.id.split("_")[1], "value", value);
  };

  const saveCustomProperties = () => {
    const returnVal: Record<string, string> = {};
    Array.from(properties).forEach(([key, value]) => {
      if (value.key !== "" && value.value !== "")
        returnVal[value.key] = value.value;
    });
    updateFormData(returnVal);
  };

  return (
    <>
      {properties.size === 0 ? (
        <Bullseye>
          <EmptyState variant={EmptyStateVariant.lg}>
            <EmptyStateIcon icon={CubesIcon} />
            <Title headingLevel="h4" size="lg">
              Custom properties
            </Title>
            <EmptyStateBody>
              Configure the custom property for the selected connector type.
            </EmptyStateBody>
            <Button
              variant="secondary"
              className="pf-u-mt-lg"
              icon={<PlusCircleIcon />}
              onClick={addProperty}
            >
              Configure custom properties
            </Button>
          </EmptyState>
        </Bullseye>
      ) : (
        <Grid hasGutter>
          <GridItem span={8}>
            <>
              {Array.from(properties.keys()).map((key, index) => {
                return (
                  <Grid
                    key={key}
                    style={{ marginTop: "10px", paddingBottom: "10px" }}
                  >
                    <GridItem span={5}>
                      <TextInput
                        value={properties.get(key)!.key}
                        type="text"
                        placeholder="Key"
                        id={"key_" + key}
                        onChange={handlePropertyChange}
                        aria-label="text input example"
                        // isDisabled={
                        //   props.isEditMode && properties.get(key)!.value
                        //     ? true
                        //     : false
                        // }
                      />
                    </GridItem>
                    <GridItem span={1}>
                      <Bullseye>&nbsp; : &nbsp;</Bullseye>
                    </GridItem>

                    <GridItem span={5} style={{ fontSize: "x-large" }}>
                      <TextInput
                        value={properties.get(key)!.value}
                        type="text"
                        placeholder="Value"
                        id={"value_" + key}
                        onChange={handlePropertyChange}
                        aria-label="text input example"
                      />
                    </GridItem>
                    <GridItem
                      span={1}
                      style={{ paddingLeft: "15px", fontSize: "x-large" }}
                    >
                      <Level style={{ flexWrap: "unset" }}>
                        <LevelItem
                          style={
                            isCustomPropertiesDirty ? {} : { display: "none" }
                          }
                        >
                          <Tooltip
                            position="top"
                            content={
                              formData.hasOwnProperty(properties.get(key)!.key)
                                ? "Saved"
                                : "Not saved: either key or value is missing"
                            }
                          >
                            <Alert
                              variant={
                                formData.hasOwnProperty(
                                  properties.get(key)!.key
                                )
                                  ? "success"
                                  : "warning"
                              }
                              isInline={true}
                              isPlain={true}
                              title=""
                            />
                          </Tooltip>
                        </LevelItem>
                        <LevelItem>
                          <Tooltip position="top" content={"Remove"}>
                            <Button
                              variant="link"
                              icon={<MinusCircleIcon />}
                              onClick={() => deleteProperty(key)}
                            />
                          </Tooltip>
                        </LevelItem>
                      </Level>
                    </GridItem>
                  </Grid>
                );
              })}
              <Divider style={{ paddingBottom: "10px" }} />
              <Button
                variant="secondary"
                className="pf-u-mt-lg pf-u-mr-sm"
                // isLoading={validationInProgress}
                onClick={saveCustomProperties}
              >
                Save changes
              </Button>
              <Button
                variant="link"
                className="pf-u-mt-lg pf-u-mr-sm"
                icon={<PlusCircleIcon />}
                onClick={addProperty}
              >
                Add custom properties
              </Button>
            </>
          </GridItem>
          <GridItem span={4} className="custom-properties_json-section">
            <LabelGroup>
              <Label icon={<CircleIcon />}>Already configured properties</Label>
              <Label icon={<CircleIcon />} color="blue">
                Custom properties
              </Label>
            </LabelGroup>
            <DescriptionList
              isCompact={true}
              isFluid={true}
              isHorizontal={true}
              style={{ gap: "0" }}
            >
              <>
                {Object.keys(connectorProperties).map((propKey) => (
                  <DescriptionListGroup key={propKey}>
                    <DescriptionListTerm>{propKey}</DescriptionListTerm>
                    <DescriptionListDescription>
                      {connectorProperties[propKey]?.toString()}
                    </DescriptionListDescription>
                  </DescriptionListGroup>
                ))}
                {!isEmpty(formData) &&
                  Object.keys(formData).map((propKey) => (
                    <DescriptionListGroup
                      key={propKey}
                      style={{ color: "#0066CC" }}
                    >
                      <DescriptionListTerm>{propKey}</DescriptionListTerm>
                      <DescriptionListDescription>
                        {formData[propKey]?.toString()}
                      </DescriptionListDescription>
                    </DescriptionListGroup>
                  ))}
              </>
            </DescriptionList>
          </GridItem>
        </Grid>
      )}
      <Modal
        variant={ModalVariant.small}
        title="Remove custom property"
        isOpen={isModalOpen}
        onClose={handleModalToggle}
        actions={[
          <Button key="confirm" variant="primary" onClick={clearProperties}>
            Confirm
          </Button>,
          <Button key="cancel" variant="link" onClick={handleModalToggle}>
            Cancel
          </Button>,
        ]}
      >
        Remove the configured additional properties.
      </Modal>
    </>
  );
};
