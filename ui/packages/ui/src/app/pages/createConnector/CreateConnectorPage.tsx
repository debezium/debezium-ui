import {
  ConnectionValidationResult,
  ConnectorConfiguration,
  ConnectorProperty,
  ConnectorType
} from "@debezium/ui-models";
import { Services } from "@debezium/ui-services";
import {
  Breadcrumb,
  BreadcrumbItem,
  Button, Level,
  LevelItem,
  PageSection,
  PageSectionVariants,
  TextContent,
  Title,
  TitleSizes,
  Wizard,

  WizardContextConsumer, WizardFooter
} from "@patternfly/react-core";
import { Form, Formik } from 'formik';
import _ from 'lodash';
import React from "react";
import { useHistory } from "react-router-dom";
import {
  fetch_retry,
  getAdvancedPropertyDefinitions,
  getBasicPropertyDefinitions,
  getDataOptionsPropertyDefinitions,
  getFilterPropertyDefinitions,
  getRuntimeOptionsPropertyDefinitions,
  mapToObject,
  PropertyCategory
} from "src/app/shared";
import * as Yup from 'yup';
import {
  ConfigureConnectorTypeComponent,
  ConnectorTypeStepComponent,
  DataOptionsComponent,
  FiltersStepComponent,
  RuntimeOptionsComponent
} from "./connectorSteps";
import "./CreateConnectorPage.css";
/**
 * Put the enabled types first, then the disabled types.  alpha sort each group
 * @param connectorTypes
 */
function getSortedConnectorTypes(connectorTypes: ConnectorType[]) {
  const enabledTypes: ConnectorType[] = connectorTypes
    .filter((cType) => cType.enabled)
    .sort((thisType, thatType) => {
      return thisType.displayName.localeCompare(thatType.displayName);
    });

  const disabledTypes: ConnectorType[] = connectorTypes
    .filter((cType) => !cType.enabled)
    .sort((thisType, thatType) => {
      return thisType.displayName.localeCompare(thatType.displayName);
    });

  return [...enabledTypes, ...disabledTypes];
}

export const CreateConnectorPage: React.FunctionComponent = () => {
  const [stepIdReached, setStepIdReached] = React.useState(1);
  const [selectedConnectorType, setSelectedConnectorType] = React.useState<
    string | undefined
  >();
  const [
    selectedConnectorPropertyDefns,
    setSelectedConnectorPropertyDefns,
  ] = React.useState<ConnectorProperty[]>([]);
  const [connectorTypes, setConnectorTypes] = React.useState<ConnectorType[]>([]);
  const [filterValues, setFilterValues] = React.useState<Map<string, string>>(
    new Map<string, string>()
  );
  const [basicPropValues, setBasicPropValues] = React.useState<
    Map<string, string>
  >(new Map<string, string>());
  const [advancedPropValues, setAdvancedPropValues] = React.useState<
    Map<string, string>
  >(new Map<string, string>());
  const [optionsPropValues, setOptionsPropValues] = React.useState<
    Map<string, string>
  >(new Map<string, string>());

  const [loading, setLoading] = React.useState(true);
  const [apiError, setApiError] = React.useState<boolean>(false);
  const [errorMsg, setErrorMsg] = React.useState<Error>(new Error());

  const [validationSchema, setValidationSchema] = React.useState({})
  const [formProperties, setFormProperties] = React.useState({})
  const [formInitialValues, setFormInitialValues] = React.useState({})

  React.useEffect(() => {

    if (stepIdReached === 2) {
      const basicProperty = formatPropertyDefinitions(getBasicPropertyDefinitions(selectedConnectorPropertyDefns));
      const advancedGeneralProperty = formatPropertyDefinitions(getAdvancedPropertyDefinitions(selectedConnectorPropertyDefns).filter(defn => defn.category === PropertyCategory.ADVANCED_GENERAL));
      const advancedReplicationProperty = formatPropertyDefinitions(getAdvancedPropertyDefinitions(selectedConnectorPropertyDefns).filter(defn => defn.category === PropertyCategory.ADVANCED_REPLICATION));
      const advancedPublicationProperty = formatPropertyDefinitions(getAdvancedPropertyDefinitions(selectedConnectorPropertyDefns).filter(defn => defn.category === PropertyCategory.ADVANCED_PUBLICATION));

      setFormProperties({
        "basicProperty": basicProperty,
        "advancedGeneralProperty": advancedGeneralProperty,
        "advancedReplicationProperty": advancedReplicationProperty,
        "advancedPublicationProperty": advancedPublicationProperty
      });
      
      setFormInitialValues(getInitialValues(_.union(
        basicProperty,
        advancedGeneralProperty,
        advancedReplicationProperty,
        advancedPublicationProperty)));

      // Just added String and Password type
      const basicValidationSchema = {};
      basicProperty.map((key: any) => {
        if (key.type === "STRING") {
          basicValidationSchema[key.name] = Yup.string();
        } else if (key.type === "PASSWORD") {
          basicValidationSchema[key.name] = Yup.string();
        }else if (key.type === "INT") {
          basicValidationSchema[key.name] = Yup.string();
        }
        if (key.isMandatory) {
          basicValidationSchema[key.name] = basicValidationSchema[key.name].required(`${key.displayName} is required`);
        }
      })
      setValidationSchema(Yup.object().shape({ ...basicValidationSchema }));

    } else if (stepIdReached === 4) {
      const mappingProperty = formatPropertyDefinitions(getDataOptionsPropertyDefinitions(selectedConnectorPropertyDefns).filter(defn => defn.category === PropertyCategory.DATA_OPTIONS_GENERAL || defn.category === PropertyCategory.DATA_OPTIONS_ADVANCED));
      const snapshotProperty = formatPropertyDefinitions(getDataOptionsPropertyDefinitions(selectedConnectorPropertyDefns).filter(defn => defn.category === PropertyCategory.DATA_OPTIONS_SNAPSHOT));

      setFormProperties({
        "mappingProperty": mappingProperty,
        "snapshotProperty": snapshotProperty
      });
      setFormInitialValues(getInitialValues(_.union(mappingProperty, snapshotProperty)));
      setValidationSchema(Yup.object().shape({}));

    } else if (stepIdReached === 5) {
      const engineProperty = formatPropertyDefinitions(getRuntimeOptionsPropertyDefinitions(selectedConnectorPropertyDefns).filter(defn => defn.category === PropertyCategory.RUNTIME_OPTIONS_ENGINE));
      const heartbeatProperty = formatPropertyDefinitions(getRuntimeOptionsPropertyDefinitions(selectedConnectorPropertyDefns).filter(defn => defn.category === PropertyCategory.RUNTIME_OPTIONS_HEARTBEAT));

      setFormProperties({
        "engineProperty": engineProperty,
        "heartbeatProperty": heartbeatProperty
      });
      setFormInitialValues(getInitialValues(_.union(engineProperty, heartbeatProperty)));
      setValidationSchema(Yup.object().shape({}));
    }
  }, [stepIdReached]);
  const history = useHistory();

  const onFinish = () => {
    // Merge the individual category properties values into a single map for the config
    const allPropValues = new Map<string, string>();
    basicPropValues.forEach((v, k) => allPropValues.set(k, v));
    advancedPropValues.forEach((v, k) => allPropValues.set(k, v));
    filterValues.forEach((v, k) => allPropValues.set(k, v));

    // TODO: Need to have a name input on one of the pages
    const connName = "myConnector";

    // ConnectorConfiguration for the create
    const connectorConfig = {
      name: connName,
      config: mapToObject(allPropValues),
    } as ConnectorConfiguration;

    // TODO: On finish, create the connector.
    //   If valid, the connector will be created and redirect to connectors page.
    //   If invalid, the user is shown a list of issues that must be corrected.
    alert(JSON.stringify(connectorConfig));

    // const connectorService = Services.getConnectorService();
    // connectorService.createConnector(connectorConfig)
    //  .then(() => {
    //   //  Do something
    // });

    history.push("/app");
  };

  const onCancel = () => {
    history.push("/app");
  };

  const formatPropertyDefinitions = (propertyValues: ConnectorProperty[]) => {
    const orderedPropertyDefinitions = propertyValues.sort((a, b) => (
      { orderInCategory: Number.MAX_VALUE, ...a }.orderInCategory -
      { orderInCategory: Number.MAX_VALUE, ...b }.orderInCategory));

    return orderedPropertyDefinitions.map((key: { name: string }) => {
      key.name = key.name.replace(/\./g, '_');
      return key;
    })
  }

  const onNext = ({ id }: any) => {
    setStepIdReached(stepIdReached < id ? id : stepIdReached);
  };
  const getInitialValues = (combined: any) => {
    const combinedValue: any = {};

    combined.map((key: { name: string; defaultValue: string }) => {
      if (!combinedValue[key.name]) {
        combinedValue[key.name] = key.defaultValue || "";
      }
    })
    return combinedValue;
  }
  const onConnectorTypeChanged = (cType: string | undefined): void => {
    setSelectedConnectorType(cType);
    // Categorize the properties and reset the overall state
    const connType = connectorTypes.find((conn) => conn.id === cType);
    setSelectedConnectorPropertyDefns(connType!.properties);
    initPropertyValues();
  };

  const initPropertyValues = (): void => {
    setFilterValues(new Map<string, string>());
    setBasicPropValues(new Map<string, string>());
    setAdvancedPropValues(new Map<string, string>());
    setOptionsPropValues(new Map<string, string>());
  };

  const handleConnectionProperties = (
    basicPropertyValues: Map<string, string>,
    advancePropertyValues: Map<string, string>
  ): void => {
    setBasicPropValues(basicPropertyValues);
    setAdvancedPropValues(advancePropertyValues);
    validateProperties(
      new Map(
        (function*() {
          yield* basicPropertyValues;
          yield* advancePropertyValues;
        })()
      )
    );
  };

  const handleValidateProperties = (
    propertyValues: Map<string, string>,
    category: PropertyCategory
  ): void => {
    validateProperties(propertyValues);
  };

  const validateProperties = (propertyValues: Map<string, string>) => {
    // alert("Validate Properties: " + JSON.stringify(mapToObject(propertyValues)));
    const connectorService = Services.getConnectorService();
    fetch_retry(connectorService.validateConnection, connectorService, [
      "postgres",
      mapToObject(new Map(propertyValues)),
    ])
      .then((result: ConnectionValidationResult) => {
        if (result.status === "INVALID") {
          let resultStr = "";
          for (const e1 of result.propertyValidationResults) {
            resultStr = `${resultStr}\n${e1.property}: ${e1.message}`;
          }
          alert(
            "connection props are INVALID. Property Results: \n" + resultStr
          );
        } else {
          alert("connection props are VALID");
        }
      })
      .catch((err: React.SetStateAction<Error>) => {
        alert("Error Validation Connection Properties !: " + err);
      });
  };
  
  // Update the filter values
  const handleFilterUpdate = (filterValue: Map<string, string>) => {
    setFilterValues(new Map(filterValue));
  };

  React.useEffect(() => {
    const globalsService = Services.getGlobalsService();
    fetch_retry(globalsService.getConnectorTypes, globalsService)
      .then((cTypes: ConnectorType[]) => {
        setLoading(false);
        setConnectorTypes(getSortedConnectorTypes(cTypes));
      })
      .catch((err: React.SetStateAction<Error>) => {
        setApiError(true);
        setErrorMsg(err);
      });
  }, [setConnectorTypes]);

  // Init the selected connector type to first 'enabled' connectortype
  React.useEffect(() => {
    // tslint:disable-next-line: no-unused-expression
    connectorTypes[0]?.id && setSelectedConnectorType(connectorTypes[0].id);

    // tslint:disable-next-line: no-unused-expression
    connectorTypes[0]?.properties &&
      setSelectedConnectorPropertyDefns(connectorTypes[0]!.properties);

    // Init the connector property values
    initPropertyValues();
  }, [connectorTypes]);

  const basicPropValuesTemp: Map<string, string> = new Map();
  basicPropValuesTemp.set("database.hostname", "192.168.122.1");
  basicPropValuesTemp.set("database.port", "5432");
  basicPropValuesTemp.set("database.user", "postgres");
  basicPropValuesTemp.set("database.password", "indra");
  basicPropValuesTemp.set("database.dbname", "postgres");
  basicPropValuesTemp.set("database.server.name", "fullfillment");
  console.log(formProperties)
  return (
    <>
      <PageSection
        variant={PageSectionVariants.light}
        className="create-connector-page_breadcrumb"
      >
        <Breadcrumb>
          <BreadcrumbItem to="/">Connectors</BreadcrumbItem>
          <BreadcrumbItem isActive={true}>Create Connector</BreadcrumbItem>
        </Breadcrumb>
        <Level hasGutter={true}>
          <LevelItem>
            <TextContent>
              <Title headingLevel="h3" size={TitleSizes["2xl"]}>
                {"Configure a connector"}
              </Title>
            </TextContent>
          </LevelItem>
        </Level>
      </PageSection>

      <div className="app-page-section-border-bottom">
        <Formik
          enableReinitialize={true}
          initialValues={formInitialValues}
          validationSchema={validationSchema}
          onSubmit={values => {
            let basicValueMap = new Map<string, string>();
            basicValueMap = _.transform(
              values,
              (result, val: string, key: string) => {
                result[key.replace(/_/g, ".")] = val;
              }
            );

            if (stepIdReached === 3) {
              handleValidateProperties(
                basicValueMap,
                PropertyCategory.BASIC
              );
            } else if (stepIdReached === 5) {
              handleValidateProperties(
                basicValueMap,
                PropertyCategory.DATA_OPTIONS_GENERAL
              );
            } else if (stepIdReached === 6) {
              handleValidateProperties(
                basicValueMap,
                PropertyCategory.RUNTIME_OPTIONS_ENGINE
              );
            }
          }}
        >
          {({
            errors,
            touched,
            handleSubmit,
            setFieldValue,
            validateForm
          }) => {

            const wizardSteps = [
              {
                id: 1,
                name: "Connector Type",
                component: (
                  <ConnectorTypeStepComponent
                    connectorTypesList={connectorTypes}
                    loading={loading}
                    apiError={apiError}
                    errorMsg={errorMsg}
                    selectedConnectorType={selectedConnectorType}
                    onSelectionChange={onConnectorTypeChanged}
                  />
                ),
                enableNext: selectedConnectorType !== undefined,
              },
              {
                id: 2,
                name: "Properties",
                component: (
                  <ConfigureConnectorTypeComponent
                    formPropertiesDef={formProperties}
                    errors={errors}
                    touched={touched}
                    setFieldValue={setFieldValue}
                  />
                ),
                canJumpTo: stepIdReached >= 2,
              },
              {
                id: 3,
                name: "Filters",
                component: (
                  <FiltersStepComponent
                    propertyDefinitions={getFilterPropertyDefinitions(
                      selectedConnectorPropertyDefns
                    )}
                    propertyValues={basicPropValuesTemp}
                    filterValues={filterValues}
                    updateFilterValues={handleFilterUpdate}
                  />
                ),
                canJumpTo: stepIdReached >= 3,
              },
              {
                id: 4,
                name: "Data Options",
                component: (
                  <DataOptionsComponent
                    formPropertiesDef={formProperties}
                    errors={errors}
                    touched={touched}
                    setFieldValue={setFieldValue}
                  />
                ),
                canJumpTo: stepIdReached >= 4,
              },
              {
                id: 5,
                name: "Runtime Options",
                type: 'button',
                component: (
                  <RuntimeOptionsComponent
                    formPropertiesDef={formProperties}
                    errors={errors}
                    touched={touched}
                    setFieldValue={setFieldValue}
                  />
                ),
                canJumpTo: stepIdReached >= 5,
                nextButtonText: "Finish",
              },
            ];
            return (
              <Form className="pf-c-form">
                <Wizard
                  onClose={onCancel}
                  onNext={onNext}
                  onSave={onFinish}
                  steps={wizardSteps}
                  className="create-connector-page_wizard"
                  nextButtonText="Validate & Continue"
                  footer={<CustomFooter handleSubmit={handleSubmit} validateForm={validateForm} />}
                />
              </Form>
            )
          }}
        </Formik>
      </div>
    </>
  );
};

export const CustomFooter = ({ handleSubmit, validateForm }) => {
  return (
    <WizardFooter>
      <WizardContextConsumer>
        {({ activeStep, goToStepByName, goToStepById, onNext, onBack, onClose }) => {
          const validateAndContinue = (goToNext) => {
            validateForm().then((err) => {
              handleSubmit();
              if (_.isEmpty(err)) {
                goToNext();
              }
            })
          };

          if (activeStep.name === 'Connector Type') {
            return (
              <>
                <Button variant="primary" type="button" onClick={onNext} >
                  Next
              </Button>
                <Button variant="secondary" onClick={onBack}>
                  Back
              </Button>
                <Button variant="link" onClick={onClose}>
                  Cancel
              </Button>
              </>
            )
          }
          return (
            <>
              <Button variant="primary" type="button" onClick={() => validateAndContinue(onNext)}>
                Continue
              </Button>
              <Button variant="secondary" onClick={onBack}>
                Back
              </Button>
              <Button variant="link" onClick={onClose}>
                Cancel
              </Button>
            </>
          )
        }}
      </WizardContextConsumer>
    </WizardFooter>
  )
}