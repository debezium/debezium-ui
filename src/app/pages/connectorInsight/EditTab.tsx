import { AppLayoutContext } from "@app/AppLayout";
import { Services } from "@app/apis/services";
import useFetchDynamicApi from "@app/hooks/useFetchDynamicApi";
import {
  Button,
  Skeleton,
  ToolbarItem,
  Tooltip,
  Wizard,
  WizardFooterWrapper,
  WizardStep,
  useWizardContext,
} from "@patternfly/react-core";
import React, { useCallback, useEffect, useState } from "react";
import {
  ConnectionStep,
  CustomPropertiesStep,
  DataOptionStep,
  FilterStep,
  ReviewStep,
  RuntimeOptionStep,
  TopicCreationStep,
  TransformsStep,
} from "../createConnector";
import { getConnectorType } from "@app/utils";
import { FormStep, PropertyCategory } from "@app/constants";
import { cloneDeep, filter } from "lodash";
import usePostWithReturnApi from "@app/hooks/usePostWithReturnApi";

interface EditTabProps {
  connectorConfiguration: Record<string, string> | null;
  // Add any props you need for the EditTab component
}

const EditTab: React.FC<EditTabProps> = ({ connectorConfiguration }) => {
  // Add your component logic here

  const [connectorName, setConnectorName] = useState<Record<string, any>>({
    name: "",
  });

  const [connectionFormData, setConnectionFormData] = useState<
    Record<string, any>
  >({});

  const [filterFormData, setFilterFormData] = React.useState<
    Record<string, any>
  >({});

  const [transformFormData, setTransformFormData] = React.useState<
    Record<string, any>
  >({});

  const [topicGroupFormData, setTopicGroupFormData] = React.useState<
    Record<string, any>
  >({});

  const [dataOptionFormData, setDataOptionFormData] = React.useState<
    Record<string, any>
  >({});

  const [runtimeFormData, setRuntimeFormData] = React.useState<
    Record<string, any>
  >({});

  const [customPropFormData, setCustomPropFormData] = React.useState<
    Record<string, any>
  >({});

  const [isCustomPropertiesDirty, setIsCustomPropertiesDirty] = useState(false);

  const [connectionValidationStatus, setConnectionValidationStatus] = useState<
    boolean | undefined
  >(undefined);

  const appLayoutContext = React.useContext(AppLayoutContext);
  const { cluster: clusterUrl, addNewNotification } = appLayoutContext;
  const connectorService = Services.getConnectorService();

  const getConnectorSchema = useFetchDynamicApi<OpenApiSchema>(
    clusterUrl,
    connectorService.getConnectorSchema,
    connectorService,
    getConnectorType(connectorConfiguration?.["connector.class"])
  );

  const {
    data: connectorSchema,
    isLoading: connectorsSchemaLoading,
    error: connectorsSchemaError,
  } = getConnectorSchema;

  const generateConnectorProperties = () => {
    const connectorProperties = {} as Record<string, ConnectorProperties>;
    if (connectorSchema) {
      const connectorSchemaObject = connectorSchema.components.schemas;
      const properties = Object.values(connectorSchemaObject)[0].properties;
      for (const [property, value] of Object.entries(properties)) {
        // const updatedProperty = property.replace(/\./g, "_");
        const updatedProperty = property;
        connectorProperties[updatedProperty] = value;
      }
    }
    return connectorProperties;
  };

  const generateRequiredList = () => {
    let requiredList = [] as string[] | null | undefined;
    if (connectorSchema) {
      const connectorSchemaObject = connectorSchema.components.schemas;
      const required = Object.values(connectorSchemaObject)[0].required;
      requiredList = required;
    }
    return requiredList;
  };

  const allConnectorProperties = generateConnectorProperties();

  const basicProperties = filter(allConnectorProperties, {
    "x-category": PropertyCategory.BASIC,
  });

  const advanceProperties = filter(allConnectorProperties, {
    "x-category":
      PropertyCategory.ADVANCED_GENERAL ||
      PropertyCategory.ADVANCED_SSL ||
      PropertyCategory.ADVANCED_PUBLICATION ||
      PropertyCategory.ADVANCED_REPLICATION,
  });

  const filterProperties = filter(allConnectorProperties, {
    "x-category": PropertyCategory.FILTERS,
  });

  const dataOptionProperties = filter(allConnectorProperties, {
    "x-category": PropertyCategory.DATA_OPTIONS_GENERAL,
  });

  const dataOptionAdvanceProperties = filter(allConnectorProperties, {
    "x-category": PropertyCategory.DATA_OPTIONS_ADVANCED,
  });

  const dataOptionSnapshotProperties = filter(allConnectorProperties, {
    "x-category": PropertyCategory.DATA_OPTIONS_SNAPSHOT,
  });

  const runtimeOptionsEngineProperties = filter(allConnectorProperties, {
    "x-category": PropertyCategory.RUNTIME_OPTIONS_ENGINE,
  });

  const runtimeOptionsHeartbeatProperties = filter(allConnectorProperties, {
    "x-category": PropertyCategory.RUNTIME_OPTIONS_HEARTBEAT,
  });

  const filterDatabasePost = usePostWithReturnApi<any>();

  const {
    response: filterResponse,
    isLoading: filterLoading,
    error: filterError,
    postWithReturn: filterPostWithReturn,
  } = filterDatabasePost;

  const updateTransFormData = useCallback(
    (formData: Record<string, string>) => {
      setTransformFormData(cloneDeep({ ...formData }));
    },
    []
  );

  const updateTopicGroupFormData = useCallback(
    (formData: Record<string, string>) => {
      setTopicGroupFormData(cloneDeep({ ...formData }));
    },
    []
  );

  const updateCustomFormData = useCallback(
    (formData: Record<string, string>) => {
      setCustomPropFormData(cloneDeep({ ...formData }));
    },
    []
  );

  const updateCustomFormDirty = useCallback((isDirty: boolean) => {
    setIsCustomPropertiesDirty(isDirty);
  }, []);

  const filterDatabase = useCallback(async () => {
    await filterPostWithReturn(
      clusterUrl,
      connectorService.validateFilters,
      connectorService,
      // filterFormData,

      {
        "connector.class": connectorConfiguration?.["connector.class"],
        ...connectionFormData,
        ...filterFormData,
      },
      getConnectorType(connectorConfiguration?.["connector.class"])
    );
  }, [filterFormData, connectionFormData, connectorName]);

  const clearFilterFormData = useCallback(() => {
    setFilterFormData({});
  }, []);

  const deleteFilterExplicitProperty = useCallback(
    (
      removeFilterProperty: string,
      addFilterProperty: string,
      value: string
    ) => {
      const newFilterFormData = cloneDeep({ ...filterFormData });
      delete newFilterFormData[removeFilterProperty];
      newFilterFormData[addFilterProperty] = value;
      setFilterFormData(newFilterFormData);
    },
    [filterFormData]
  );

  useEffect(() => {
    if (connectorConfiguration) {
      setConnectorName({ name: connectorConfiguration["name"] });

      const basicProperties = filter(allConnectorProperties, {
        "x-category": PropertyCategory.BASIC,
      });

      const advanceProperties = filter(allConnectorProperties, {
        "x-category":
          PropertyCategory.ADVANCED_GENERAL ||
          PropertyCategory.ADVANCED_SSL ||
          PropertyCategory.ADVANCED_PUBLICATION ||
          PropertyCategory.ADVANCED_REPLICATION,
      });

      const filteredProperties = Object.keys(connectorConfiguration).filter(
        (key) => {
          const isInBasicProperties = basicProperties.some(
            (property) => property["x-name"] === key
          );
          const isInAdvanceProperties = advanceProperties.some(
            (property) => property["x-name"] === key
          );
          return isInBasicProperties || isInAdvanceProperties;
        }
      );

      const filteredConnectorConfiguration = filteredProperties.reduce(
        (acc: Record<string, any>, key: string) => {
          acc[key] = connectorConfiguration[key];
          return acc;
        },
        {}
      );

      setConnectionFormData({ ...filteredConnectorConfiguration });

      setFilterFormData({ ...connectorConfiguration });
    }
  }, [ connectorConfiguration]);

  const updateFormData = useCallback(
    (key: string, value: any, formStep: FormStep) => {
      switch (formStep) {
        case FormStep.CONNECTOR_NAME:
          setConnectorName({ [key]: value });
          break;
        case FormStep.CONNECTION:
          setConnectionValidationStatus(undefined);
          setConnectionFormData(
            cloneDeep({ ...connectionFormData, [key]: value })
          );
          break;
        case FormStep.FILTER:
          setFilterFormData(cloneDeep({ ...filterFormData, [key]: value }));
          break;
        case FormStep.DATA_OPTION:
          setDataOptionFormData(
            cloneDeep({ ...dataOptionFormData, [key]: value })
          );
          break;
        case FormStep.RUNTIME_OPTION:
          setRuntimeFormData(cloneDeep({ ...runtimeFormData, [key]: value }));
          break;
        case FormStep.CUSTOM_PROPERTIES:
          setCustomPropFormData(
            cloneDeep({ ...customPropFormData, [key]: value })
          );
          break;
      }
    },
    [
      connectionFormData,
      filterFormData,
      dataOptionFormData,
      runtimeFormData,
      customPropFormData,
    ]
  );

  const StepFooter = () => {
    const { goToNextStep, goToPrevStep, activeStep } = useWizardContext();

    // const onNext = () => {
    //   // setConnectionValidationStatus(undefined);
    //   goToNextStep();
    // };

    return (
      <WizardFooterWrapper>
        <Button
          variant="tertiary"
          onClick={goToPrevStep}
          isDisabled={activeStep.name === "Connection"}
        >
          Back
        </Button>

        <Button
          variant="secondary"
          onClick={goToNextStep}
          isDisabled={activeStep.name === "Review"}
        >
          Next
        </Button>
        <ToolbarItem variant="separator" />
        {/* <Tooltip content={<div>Save changes made in all the steps.</div>}> */}
        <Button variant="primary">Save updates</Button>
        {/* </Tooltip>
        <Tooltip content={<div>Discard all changes.</div>}> */}
        <Button variant="link">Discard updates</Button>
        {/* </Tooltip> */}
      </WizardFooterWrapper>
    );
  };

  return (
    <div>
      <Wizard
        className="connector-config-wizard"
        //   onClose={() => setIsCancelModalOpen(true)}
        // isVisitRequired
      >
        <WizardStep
          name="Connection"
          id="wizard-step-1-connection"
          // footer={{ isNextDisabled: !connectionFilled }}
          footer={<StepFooter />}
        >
          {connectorsSchemaLoading ? (
            <React.Fragment>
              <Skeleton width="75%" screenreaderText="Loaded 25% of content" />
              <br />
              <Skeleton width="100%" screenreaderText="Loaded 33% of content" />
              <br />
              <Skeleton width="75%" screenreaderText="Loaded 50% of content" />
              <br />
              <Skeleton width="100%" screenreaderText="Loaded 66% of content" />
              <br />
              <Skeleton width="75%" screenreaderText="Loaded 75% of content" />
              <br />
              <Skeleton />
            </React.Fragment>
          ) : (
            <ConnectionStep
              connectorName={connectorName}
              connectionBasicProperties={[...basicProperties]}
              connectionAdvancedProperties={[...advanceProperties]}
              formData={connectionFormData}
              updateFormData={updateFormData}
              requiredList={generateRequiredList()}
            />
          )}
        </WizardStep>
        <WizardStep
          name="Additional properties"
          id="wizard-step-2-additional"
          // isExpandable

          steps={[
            <WizardStep
              name="Filter definition"
              id="wizard-step-2-filter"
              key="wizard-step-2-filter"
              footer={<StepFooter />}
            >
              <FilterStep
                filterProperties={[...filterProperties]}
                requiredList={generateRequiredList()}
                formData={filterFormData}
                updateFormData={updateFormData}
                connectionFormData={connectionFormData}
                connectorPlugin={getConnectorType(
                  connectorConfiguration?.["connector.class"]
                )}
                filterDatabase={filterDatabase}
                clearFilterFormData={clearFilterFormData}
                deleteFilterExplicitProperty={deleteFilterExplicitProperty}
              />
            </WizardStep>,
            <WizardStep
              name="Transformation"
              id="wizard-step-2-transform"
              key="wizard-step-2-smt"
              footer={<StepFooter />}
            >
              <TransformsStep
                formData={transformFormData}
                updateFormData={updateTransFormData}
              />
            </WizardStep>,
            <WizardStep
              name="Topic creation"
              id="wizard-step-2-topic"
              key="wizard-step-2-topic-creation"
              footer={<StepFooter />}
            >
              <TopicCreationStep
                formData={topicGroupFormData}
                updateFormData={updateTopicGroupFormData}
              />
            </WizardStep>,
            <WizardStep
              name="Data options"
              id="wizard-step-2-data"
              key="wizard-step-2-data-options"
              footer={<StepFooter />}
            >
              <DataOptionStep
                dataOptionProperties={[...dataOptionProperties]}
                dataOptionAdvanceProperties={[...dataOptionAdvanceProperties]}
                dataOptionSnapshotProperties={[...dataOptionSnapshotProperties]}
                formData={connectionFormData}
                updateFormData={updateFormData}
                requiredList={generateRequiredList()}
              />
            </WizardStep>,
            <WizardStep
              name="Runtime options"
              id="wizard-step-2-runtime"
              key="wizard-step-2-runtime-options"
              footer={<StepFooter />}
            >
              <RuntimeOptionStep
                runtimeOptionEngineProperties={[
                  ...runtimeOptionsEngineProperties,
                ]}
                runtimeOptionHeartbeatProperties={[
                  ...runtimeOptionsHeartbeatProperties,
                ]}
                formData={connectionFormData}
                updateFormData={updateFormData}
                requiredList={generateRequiredList()}
              />
            </WizardStep>,
            <WizardStep
              name="Custom properties"
              id="wizard-step-2-custom"
              key="wizard-step-2-custom-property"
              footer={<StepFooter />}
            >
              <CustomPropertiesStep
                formData={customPropFormData}
                updateFormData={updateCustomFormData}
                isCustomPropertiesDirty={isCustomPropertiesDirty}
                updateCustomFormDirty={updateCustomFormDirty}
                connectorProperties={{
                  ...connectionFormData,
                  ...filterFormData,
                  // ...transformFormData,
                  // ...topicGroupFormData,
                  ...dataOptionFormData,
                  ...runtimeFormData,
                }}
              />
            </WizardStep>,
          ]}
        />
        <WizardStep
          name="Review"
          id="wizard-step-3-review"
          footer={<StepFooter />}
        >
          <ReviewStep
            connectorName={connectorName}
            connectorType={getConnectorType(
              connectorConfiguration?.["connector.class"]
            )}
            connectorProperties={{
              ...connectorConfiguration,
            }}
            transformProperties={{}}
            topicGroupProperties={{}}
            customProperties={{}}
          />
        </WizardStep>
      </Wizard>
    </div>
  );
};

export default EditTab;
