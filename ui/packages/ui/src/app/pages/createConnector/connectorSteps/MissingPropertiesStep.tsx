import {
  Alert,
  Bullseye,
  Button,
  EmptyState,
  EmptyStateBody,
  EmptyStateIcon,
  EmptyStateVariant,
  Grid,
  GridItem,
  Level,
  LevelItem,
  Split,
  SplitItem,
  TextInput,
  Title,
} from '@patternfly/react-core';
import {
  CubesIcon,
  MinusCircleIcon,
  PlusCircleIcon,
} from '@patternfly/react-icons';
import { PageLoader } from 'components';
import _ from 'lodash';
import React, { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { ApiError, WithLoader } from 'shared';

export interface IMissingProperties {
  key: any;
  value: any;
}

export interface IMissingPropertiesStepProps {
  missingProperties: { [key: string]: string };
  updateMissingPropertiesValues: (data: any) => void;
  setIsMissingPropertiesDirty: (data: boolean) => void;
  selectedConnectorType: string;
  clusterId: string;
}

const TransformAlert: FC = () => {
  // const { t } = useTranslation();
  return (
    <>
      Configure the missing properties for the selected connector type.
      {/* <a
        href="https://debezium.io/documentation/reference/transformations/index.html"
        target="_blank"
      >
        {t('documentation')}
      </a>{' '}
      {t('moreDetails')} */}
    </>
  );
};

export const MissingPropertiesStep: React.FunctionComponent<
  IMissingPropertiesStepProps
> = (props) => {
  const { t } = useTranslation();

  const [properties, setProperties] = React.useState<
    Map<string, IMissingProperties>
  >(new Map<string, IMissingProperties>());

  //   const [responseData, setResponseData] = React.useState({});

  // tslint:disable-next-line: variable-name
  const [loading, _setLoading] = React.useState(false);
  // tslint:disable-next-line: variable-name
  const [apiError, _setApiError] = React.useState<boolean>(false);
  // tslint:disable-next-line: variable-name
  const [errorMsg, _setErrorMsg] = React.useState<Error>(new Error());

  const addProperty = () => {
    const propertiesCopy = new Map(properties);
    propertiesCopy.set('' + Math.floor(Math.random() * 100000), {
      key: '',
      value: '',
    });
    setProperties(propertiesCopy);
    props.setIsMissingPropertiesDirty(true);
  };

  const deleteProperty = (order) => {
    const propertiesCopy = new Map(properties);
    propertiesCopy.delete(order);

    props.setIsMissingPropertiesDirty(true);
    setProperties(propertiesCopy);
  };

  React.useEffect(() => {
    if (!_.isEmpty(props.missingProperties)) {
      const propertiesCopy = new Map();
      Object.keys(props.missingProperties).forEach((key) => {
        propertiesCopy.set('' + Math.floor(Math.random() * 100000), {
          key,
          value: props.missingProperties[key],
        });
      });
      setProperties(propertiesCopy);
    }
  }, []);

  //   const saveTransforms = () => {
  //     const cardsValid: any[] = [];
  //     nameTypeCheckRef.map.forEach((input: any) => {
  //       cardsValid.push(input.check());
  //     });

  //     Promise.all(cardsValid).then(
  //       (d) => {
  //         props.setIsTransformDirty(false);
  //       },
  //       (e) => {
  //         props.setIsTransformDirty(true);
  //       }
  //     );
  //   };

  //   const handleModalToggle = () => {
  //     setIsModalOpen(!isModalOpen);
  //   };

  const updateProperties = (key: string, field: string, value: any) => {
    const propertiesCopy = new Map(properties);
    const propertyCopy = properties.get(key);
    if (value) {
      propertyCopy![field] = value;
      props.setIsMissingPropertiesDirty(true);
      propertiesCopy.set(key, propertyCopy!);
    }

    setProperties(propertiesCopy);
  };

  const saveMissingProperties = () => {
    const missingPropertiesValue = {};
    properties.forEach((val) => {
      if (val.key && val.value) {
        missingPropertiesValue[val.key] = val.value;
      }
    });
    props.updateMissingPropertiesValues(missingPropertiesValue);
  };

  //   React.useEffect(() => {
  //     if (props.transformsValues.size > 0) {
  //       const transformsVal = new Map();
  //       const transformList = props.transformsValues
  //         .get('transforms')
  //         ?.split(',');
  //       transformList.forEach((tName, index) => {
  //         const transformData: ITransformData = { key: Math.random() * 10000 };
  //         transformData.name = tName;
  //         transformData.type = props.transformsValues.get(
  //           `transforms.${tName}.type`
  //         );
  //         transformData.config = {};
  //         for (const [key, value] of props.transformsValues.entries()) {
  //           if (key.includes(tName) && !key.includes('type')) {
  //             const fieldName = key.split(`transforms.${tName}.`)[1];
  //             transformData.config[fieldName] = value;
  //           }
  //         }
  //         transformsVal.set(index + 1, transformData);
  //         setTransforms(transformsVal);
  //       });
  //     }
  //     props.setIsTransformDirty(false);
  //   }, []);

  //   React.useEffect(() => {
  //     const connectorService = Services.getConnectorService();
  //     fetch_retry(connectorService.getTransform, connectorService, [
  //       props.clusterId,
  //     ])
  //       .then((cConnectors: any[]) => {
  //         setLoading(false);
  //         setResponseData(cConnectors);
  //       })
  //       .catch((err: React.SetStateAction<Error>) => {
  //         setApiError(true);
  //         setErrorMsg(err);
  //       });
  //   }, []);

  const handlePropertyChange = (
    value: string,
    event: React.FormEvent<HTMLInputElement>
  ) => {
    console.log(event.currentTarget.id);
    event.currentTarget.id.includes('key')
      ? updateProperties(event.currentTarget.id.split('_')[1], 'key', value)
      : updateProperties(event.currentTarget.id.split('_')[1], 'value', value);
  };

  return (
    <WithLoader
      error={apiError}
      loading={loading}
      loaderChildren={<PageLoader />}
      errorChildren={
        <ApiError
          i18nErrorTitle={t('apiErrorTitle')}
          i18nErrorMsg={t('apiErrorMsg')}
          error={errorMsg}
        />
      }
    >
      {() => (
        <div>
          {properties.size === 0 ? (
            <EmptyState variant={EmptyStateVariant.small}>
              <EmptyStateIcon icon={CubesIcon} />
              <Title headingLevel="h4" size="lg">
                Configure missing properties
              </Title>
              <EmptyStateBody>
                <TransformAlert />
              </EmptyStateBody>
              <Button
                variant="secondary"
                className="pf-u-mt-lg"
                icon={<PlusCircleIcon />}
                onClick={addProperty}
              >
                Configure missing properties
              </Button>
            </EmptyState>
          ) : (
            <>
              <Alert
                variant="info"
                isInline={true}
                title={
                  <p>
                    <TransformAlert />
                  </p>
                }
              />
              <Grid style={{ marginTop: '10px' }}>
                <GridItem span={9}>
                  {Array.from(properties.keys()).map((key, index) => {
                    return (
                      <Grid key={key} style={{ marginTop: '10px' }}>
                        <GridItem span={5}>
                          <TextInput
                            value={properties.get(key)!.key}
                            type="text"
                            placeholder="Key"
                            id={'key_' + key}
                            onChange={handlePropertyChange}
                            aria-label="text input example"
                          />
                        </GridItem>
                        <GridItem span={1}>
                          <Bullseye>&nbsp; : &nbsp;</Bullseye>
                        </GridItem>

                        <GridItem span={5} style={{ fontSize: 'x-large' }}>
                          <TextInput
                            value={properties.get(key)!.value}
                            type="text"
                            placeholder="Value"
                            id={'value_' + key}
                            onChange={handlePropertyChange}
                            aria-label="text input example"
                          />
                        </GridItem>
                        <GridItem span={1} style={{paddingLeft: "15px",fontSize: 'x-large' }}>
                          <Button
                            variant="link"
                            icon={<MinusCircleIcon />}
                            onClick={() => deleteProperty(key)}
                          />
                        </GridItem>
                      </Grid>
                    );
                  })}
                </GridItem>
              </Grid>

              <Button
                variant="secondary"
                className="pf-u-mt-lg pf-u-mr-sm"
                onClick={saveMissingProperties}
              >
                {t('apply')}
              </Button>
              <Button
                variant="link"
                className="pf-u-mt-lg pf-u-mr-sm"
                icon={<PlusCircleIcon />}
                onClick={addProperty}
              >
                Add missing property
              </Button>
            </>
          )}
        </div>
      )}
    </WithLoader>
  );
};
