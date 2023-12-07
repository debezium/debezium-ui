import * as React from "react";
import {
  Alert,
  BackToTop,
  Button,
  Modal,
  ModalVariant,
  PageSection,
  PageSectionTypes,
  Skeleton,
  Split,
  SplitItem,
  Switch,
  Text,
  TextContent,
  ToolbarItem,
  Wizard,
  WizardFooterWrapper,
  WizardStep,
  useWizardContext,
} from "@patternfly/react-core";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { AppLayoutContext } from "@app/AppLayout";
import { Services } from "@app/apis/services";
import useFetchDynamicApi from "@app/hooks/useFetchDynamicApi";
import { cloneDeep, filter, isUndefined } from "lodash";
import { ConnectionStep } from "./ConnectionStep";
import "./CreateConnectorWizard.css";
import { FilterStep } from "./FilterStep";
import { DataOptionStep } from "./DataOptionStep";
import { RuntimeOptionStep } from "./RuntimeOptionStep";
import { FormStep, PropertyCategory } from "@app/constants";
import { useCallback, useEffect, useRef, useState } from "react";
import { ReviewStep } from "./ReviewStep";
import { getConnectorClass, isEmpty } from "@app/utils";
import usePostWithReturnApi from "@app/hooks/usePostWithReturnApi";
import { CustomPropertiesStep } from "./CustomPropertiesStep";
import { ConnectorTypeLogo } from "@app/components";
// import TransformationStep from "./TransformationStep";

export const CreateConnectorWizard: React.FunctionComponent = () => {
  let { connectorPlugin } = useParams();
  let locationData = useLocation().state;

  const [isCancelModalOpen, setIsCancelModalOpen] = React.useState(false);

  const [connectionFilled, setConnectionFilled] = React.useState<
    boolean | undefined
  >(false);

  const [connectorName, setConnectorName] = React.useState<Record<string, any>>(
    { name: "" }
  );
  const [connectionFormData, setConnectionFormData] = React.useState<
    Record<string, any>
  >({});

  const [filterFormData, setFilterFormData] = React.useState<
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

  const [connectionValidationMessage, setConnectionValidationMessage] =
    useState<string>("");

  const ref = useRef<HTMLInputElement>(null);

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

  const updateCustomFormData = useCallback(
    (formData: Record<string, string>) => {
      setCustomPropFormData(cloneDeep({ ...formData }));
    },
    []
  );

  const updateCustomFormDirty = useCallback((isDirty: boolean) => {
    setIsCustomPropertiesDirty(isDirty);
  }, []);

  const navigate = useNavigate();

  const cancelConnectorWizard = () => navigate("/");

  const appLayoutContext = React.useContext(AppLayoutContext);
  const { cluster: clusterUrl, addNewNotification } = appLayoutContext;
  const connectorService = Services.getConnectorService();

  const getConnectorSchema = useFetchDynamicApi<OpenApiSchema>(
    clusterUrl,
    connectorService.getConnectorSchema,
    connectorService,
    connectorPlugin
  );

  const {
    data: connectorSchema,
    isLoading: connectorsSchemaLoading,
    error: connectorsSchemaError,
  } = getConnectorSchema;

  useEffect(() => {
    if (connectorSchema) {
      const connectorSchemaObject = connectorSchema.components.schemas;
      const requiredList = Object.values(connectorSchemaObject)[0].required;
      setConnectionFilled(
        !isEmpty(connectorName.name) &&
          requiredList?.every(
            (propertyName: string) =>
              // connectionFormData[propertyName.replace(/\./g, "_")] && connectionFormData[propertyName.replace(/\./g, "_")] !== ""
              connectionFormData[propertyName] &&
              connectionFormData[propertyName] !== ""
          )
      );
    }
  }, [connectionFormData, connectorName]);

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

  const filterProperties = filter(allConnectorProperties, {
    "x-category": PropertyCategory.FILTERS,
  });

  const filterDatabasePost = usePostWithReturnApi<any>();

  const validateConnectionPost = usePostWithReturnApi<any>();

  const {
    response: filterResponse,
    isLoading: filterLoading,
    error: filterError,
    postWithReturn: filterPostWithReturn,
  } = filterDatabasePost;

  const {
    response: validateResponse,
    isLoading: validateLoading,
    error: validateError,
    postWithReturn: validateConnectionPostWithReturn,
  } = validateConnectionPost;

  

  const filterDatabase = useCallback(async () => {
    await filterPostWithReturn(
      clusterUrl,
      connectorService.validateFilters,
      connectorService,
      // filterFormData,

      {
        "connector.class": getConnectorClass(connectorPlugin),
        ...connectionFormData,
        ...filterFormData,
      },
      connectorPlugin
    );

  }, [filterFormData, connectionFormData, connectorName]);

  const validateConnection = useCallback(async () => {
    await validateConnectionPostWithReturn(
      clusterUrl,
      connectorService.validateConnection,
      connectorService,
      // filterFormData,

      {
        "connector.class": getConnectorClass(connectorPlugin),
        ...connectionFormData,
      },
      connectorPlugin
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

  const PageTemplateTitle = (
    <PageSection variant="light">
      <Split>
        <SplitItem>
          <TextContent>
            <Text component="h1">
              {/* <ConnectorTypeLogo type={`.${connectorPlugin}`} size={"30px"} /> &nbsp;  */}
              Create {connectorPlugin} connectors
            </Text>
            <Text component="p">
              Configure {connectorPlugin}
              connector by following the steps below.
            </Text>
          </TextContent>
        </SplitItem>
        {/* <SplitItem isFilled></SplitItem>
        <SplitItem>
          <Switch
            label="Skip additional properties"
            labelOff="Configure additional properties"
            isChecked={isAdvanceChecked}
            onChange={handleAdvanceChange}
            id="Advance-config-switch"
            name="Toggle Hide and Show Advanced Configuration steps"
          />
        </SplitItem> */}
      </Split>
    </PageSection>
  );

  const scrollToTop = () => {
    if (ref.current) {
      ref.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  const createConnectorPost = usePostWithReturnApi<ConnectorConfigResponse>();

  const {
    response: createConnectorResponse,
    isLoading: createConnectorLoading,
    error: createConnectorError,
    postWithReturn: createConnectorPostWithReturn,
  } = createConnectorPost;

  const ConnectionStepFooter = () => {
    const { goToNextStep, goToPrevStep, close } = useWizardContext();

    const [isLoading, setIsLoading] = useState(false);

    async function onValidate() {
      setIsLoading(true);

      connectorService
        .validateConnection(
          clusterUrl,
          {
            "connector.class": getConnectorClass(connectorPlugin),
            ...connectionFormData,
          },
          connectorPlugin!
        )
        .then((validationResponse: any) => {
          scrollToTop();
          if (validationResponse.status === "INVALID") {
            setConnectionValidationStatus(false);
            if (validationResponse.validationResults) {
              const invalidProp: string[] = [];
              validationResponse.validationResults.forEach(
                (element: { property: string | number }) => {
                  invalidProp.push(
                    allConnectorProperties[element.property].title
                  );
                }
              );
              setConnectionValidationMessage(invalidProp.join(", "));
            }
          } else {
            setConnectionValidationStatus(true);
            // setConnectionValidationMessage(" validation valid");
          }
        })
        .catch((err) => {
          addNewNotification("danger", "Something went wrong.", err.message);
        })
        .finally(() => {
          setIsLoading(false);
        });
    }

    const onNext = () => {
      setConnectionValidationStatus(undefined);
      goToNextStep();
    };

    return (
      <WizardFooterWrapper>
        <Button variant="secondary" onClick={goToPrevStep} isDisabled={true}>
          Back
        </Button>
        <Button
          variant="primary"
          onClick={onNext}
          isDisabled={!connectionFilled || isLoading}
        >
          Next
        </Button>
        <ToolbarItem variant="separator" />
        <Button
          variant="secondary"
          onClick={onValidate}
          isLoading={isLoading}
          isDisabled={!connectionFilled || isLoading}
        >
          Validate
        </Button>
        <Button variant="link" onClick={close} isDisabled={isLoading}>
          Cancel
        </Button>
      </WizardFooterWrapper>
    );
  };

  const ReviewStepFooter = () => {
    const { goToNextStep, goToPrevStep, close } = useWizardContext();
    const [isCreateConnectorLoading, setIsCreateConnectorLoading] =
      useState(false);

    async function onNext() {
      setIsCreateConnectorLoading(true);

      connectorService
        .createConnector(clusterUrl, {
          name: connectorName.name,
          config: {
            "connector.class": getConnectorClass(connectorPlugin),
            ...connectionFormData,
            ...filterFormData,
            ...dataOptionFormData,
            ...runtimeFormData,
            ...customPropFormData,
          },
        })
        .then((cConnectorResponse: any) => {
          addNewNotification(
            "success",
            "Create connector successful",
            `Connector ${connectorName.name} created successfully`
          );
          navigate("/");
        })
        .catch((err) => {
          addNewNotification("danger", "Create connector failed", err.message);
        })
        .finally(() => {
          setIsCreateConnectorLoading(false);
        });

      // goToNextStep();
    }

    return (
      <WizardFooterWrapper>
        <Button
          variant="secondary"
          onClick={goToPrevStep}
          isDisabled={isCreateConnectorLoading}
        >
          Back
        </Button>
        <Button
          variant="primary"
          onClick={onNext}
          isLoading={isCreateConnectorLoading}
          isDisabled={isCreateConnectorLoading}
        >
          Submit
        </Button>
        <Button
          variant="link"
          onClick={close}
          isDisabled={isCreateConnectorLoading}
        >
          Cancel
        </Button>
      </WizardFooterWrapper>
    );
  };

  return (
    <>
    <div ref={ref}> </div>
      {PageTemplateTitle}
      <PageSection isFilled type={PageSectionTypes.wizard}>
        <Wizard
          className="connector-config-wizard"
          onClose={() => setIsCancelModalOpen(true)}
          isVisitRequired
        >
          <WizardStep
            name="Connection"
            id="wizard-step-1"
            // footer={{ isNextDisabled: !connectionFilled }}
            footer={<ConnectionStepFooter />}
          >
            {connectorsSchemaLoading ? (
              <React.Fragment>
                <Skeleton
                  width="75%"
                  screenreaderText="Loaded 25% of content"
                />
                <br />
                <Skeleton
                  width="100%"
                  screenreaderText="Loaded 33% of content"
                />
                <br />
                <Skeleton
                  width="75%"
                  screenreaderText="Loaded 50% of content"
                />
                <br />
                <Skeleton
                  width="100%"
                  screenreaderText="Loaded 66% of content"
                />
                <br />
                <Skeleton
                  width="75%"
                  screenreaderText="Loaded 75% of content"
                />
                <br />
                <Skeleton />
              </React.Fragment>
            ) : (
              <div>
                {isUndefined(connectionValidationStatus) ? (
                  <></>
                ) : connectionValidationStatus ? (
                  <Alert
                    variant="success"
                    isInline
                    title="Validation successful"
                  />
                ) : (
                  <Alert
                    variant="danger"
                    isInline
                    title="Validation unsuccessful"
                  >
                    <p>{connectionValidationMessage} value(s) is invalid.</p>{" "}
                  </Alert>
                )}
                <ConnectionStep
                  connectorName={connectorName}
                  connectionBasicProperties={...[...basicProperties]}
                  connectionAdvancedProperties={...advanceProperties}
                  formData={connectionFormData}
                  updateFormData={updateFormData}
                  requiredList={generateRequiredList()}
                />
              </div>
            )}
          </WizardStep>
          <WizardStep
            name="Additional properties"
            id="wizard-step-2"
            isExpandable
            isHidden={locationData.hideAdvance || false}
            steps={[
              <WizardStep
                name="Filter definition"
                id="wizard-step-2a"
                key="wizard-step-2a"
                isHidden={locationData.hideAdvance || false}
              >
                <FilterStep
                  filterProperties={...filterProperties}
                  requiredList={generateRequiredList()}
                  formData={filterFormData}
                  updateFormData={updateFormData}
                  connectionFormData={connectionFormData}
                  connectorPlugin={connectorPlugin || ""}
                  filterDatabase={filterDatabase}
                  clearFilterFormData={clearFilterFormData}
                  deleteFilterExplicitProperty={deleteFilterExplicitProperty}
                />
              </WizardStep>,
              <WizardStep
                name="Transformation"
                id="wizard-step-2b"
                key="wizard-step-2b"
                isHidden={locationData.hideAdvance || false}
              >
                <p>Transform step</p>
                {/* <TransformationStep
                formData={customPropFormData}
                updateFormData={updateCustomFormData}
                isCustomPropertiesDirty={isCustomPropertiesDirty}
                updateCustomFormDirty={updateCustomFormDirty}
                /> */}
              </WizardStep>,
              <WizardStep
                name="Topic creation"
                id="wizard-step-2c"
                key="wizard-step-2c"
                isHidden={locationData.hideAdvance || false}
              >
                <p>Topic creation step</p>
              </WizardStep>,
              <WizardStep
                name="Data options"
                id="wizard-step-2d"
                key="wizard-step-2d"
                isHidden={locationData.hideAdvance || false}
              >
                <DataOptionStep
                  dataOptionProperties={...dataOptionProperties}
                  dataOptionAdvanceProperties={...dataOptionAdvanceProperties}
                  dataOptionSnapshotProperties={...dataOptionSnapshotProperties}
                  formData={connectionFormData}
                  updateFormData={updateFormData}
                  requiredList={generateRequiredList()}
                />
              </WizardStep>,
              <WizardStep
                name="Runtime options"
                id="wizard-step-2e"
                key="wizard-step-2e"
                isHidden={locationData.hideAdvance || false}
              >
                <RuntimeOptionStep
                  runtimeOptionEngineProperties={...runtimeOptionsEngineProperties}
                  runtimeOptionHeartbeatProperties={...runtimeOptionsHeartbeatProperties}
                  formData={connectionFormData}
                  updateFormData={updateFormData}
                  requiredList={generateRequiredList()}
                />
              </WizardStep>,
              <WizardStep
                name="Custom properties"
                id="wizard-step-2f"
                key="wizard-step-2f"
                isHidden={locationData.hideAdvance || false}
              >
                <CustomPropertiesStep
                  formData={customPropFormData}
                  updateFormData={updateCustomFormData}
                  isCustomPropertiesDirty={isCustomPropertiesDirty}
                  updateCustomFormDirty={updateCustomFormDirty}
                  connectorProperties={{
                    ...connectionFormData,
                    ...filterFormData,
                    ...dataOptionFormData,
                    ...runtimeFormData,
                  }}
                />
              </WizardStep>,
            ]}
          />
          {/* <WizardStep name="Additional" id="wizard-step-3">
            <p>Step 3 content</p>
          </WizardStep> */}
          <WizardStep
            name="Review"
            id="wizard-step-3"
            // footer={{ nextButtonText: "Finish" }}
            footer={<ReviewStepFooter />}
          >
            <ReviewStep
              connectorSchema={
                connectorSchema
                  ? Object.values(connectorSchema.components.schemas)[0]
                      .properties
                  : {}
              }
              connectorName={connectorName}
              connectorType={connectorPlugin}
              connectorProperties={{
                ...connectionFormData,
                ...filterFormData,
                ...dataOptionFormData,
                ...runtimeFormData,
              }}
              customProperties={{ ...customPropFormData }}
            />
          </WizardStep>
        </Wizard>
        <BackToTop
          isAlwaysVisible
          onClick={scrollToTop}
          style={{ zIndex: 9999 }}
        />
        <Modal
          variant={ModalVariant.small}
          title={`Delete connector?`}
          titleIconVariant="warning"
          isOpen={isCancelModalOpen}
          onClose={() => setIsCancelModalOpen(false)}
          actions={[
            <Button
              key="confirm"
              variant="primary"
              onClick={cancelConnectorWizard}
            >
              Confirm
            </Button>,
            <Button
              key="cancel"
              variant="link"
              onClick={() => setIsCancelModalOpen(false)}
            >
              Cancel
            </Button>,
          ]}
        >
          Do you want to delete the connector?
        </Modal>
      </PageSection>
      {/* </DashboardWrapper> */}
    </>
  );
};
