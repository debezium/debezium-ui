import './IncrementalSnapshot.css';
import { DataCollection, FilterValidationResult } from '@debezium/ui-models';
import { Services } from '@debezium/ui-services';
import {
  ActionGroup,
  Text,
  Button,
  Divider,
  EmptyState,
  EmptyStateBody,
  EmptyStateIcon,
  EmptyStateVariant,
  Form,
  PageSection,
  PageSectionVariants,
  TextVariants,
  Title,
  Wizard,
  FormGroup,
  TextInput,
  EmptyStateSecondaryActions,
  Level,
  LevelItem,
  Modal,
  ModalVariant,
} from '@patternfly/react-core';
import { CubesIcon } from '@patternfly/react-icons';
import { FilterTreeComponent, HelpInfoIcon, JsonViewer } from 'components';
import { t } from 'i18next';
import _ from 'lodash';
import React, { FC, useState } from 'react';
import { fetch_retry } from 'shared';

export type IncrementalSnapshotProps = {
  actionConnectorName: string;
  connectorConfig: Map<string, string>;
};

const formatResponseData = (data: DataCollection[]) => {
  return data.reduce((acc: any, next) => {
    const inx = _.findIndex(acc, { name: next.namespace, id: next.namespace });
    if (inx !== -1) {
      acc[inx].children.push({
        name: next.name,
        id: next.namespace + '_' + next.name,
      });
    } else {
      const newObj = {
        name: next.namespace,
        id: next.namespace,
        children: [
          {
            name: next.name,
            id: next.namespace + '_' + next.name,
          },
        ],
      };
      acc.push(newObj);
    }
    return acc;
  }, []);
};

export const IncrementalSnapshot: FC<IncrementalSnapshotProps> = ({
  actionConnectorName,
  connectorConfig,
}) => {
  const [setupIncrementalSnapshot, setSetupIncrementalSnapshot] =
    useState(false);
  const [stepIdReached, setStepIdReached] = useState(1);

  const [IncrementalSnapshotEnabled, setIncrementalSnapshotEnabled] = useState(false);

  const [isEnableModalOpen, setIsEnableModalOpen] = useState(false);

  const [treeData, setTreeData] = React.useState<any[]>([]);
  const [invalidMsg, setInvalidMsg] = React.useState<Map<string, string>>(
    new Map()
  );
  const [childNo, setChildNo] = React.useState<number>(0);
  const [loading, setLoading] = React.useState(true);
  const [apiError, setApiError] = React.useState<boolean>(false);
  const [errorMsg, setErrorMsg] = React.useState<Error>(new Error());

  const startIncrementalSnapshotConfig = () => {
    setSetupIncrementalSnapshot(true);
  };

  //   const { stepIdReached } = stepIdReached;

  const handleEnableModalToggle = () => {
    setIsEnableModalOpen(!isEnableModalOpen);
    setIncrementalSnapshotEnabled(true);
  }

  const INCREMENTAL_SNAPSHOT = (
    <div>
      {'Incremental snapshot'}{' '}
      <span className="pf-m-required" style={{ color: '#C9190B' }}>
        {' '}
        *
      </span>
    </div>
  );

  const onNext = ({ id }: any) => {
    setStepIdReached(stepIdReached < id ? id : stepIdReached);
  };
  const closeWizard = () => {
    console.log('close wizard');
    setSetupIncrementalSnapshot(false);
  };

  const connectorService = Services.getConnectorService();

  const getFilterSchema = () =>
    // saveFilter: boolean,
    // filterExpression: Map<string, string> = formData
    {
      setLoading(true);
      if (apiError) {
        setApiError(false);
        setErrorMsg(new Error());
      }
      fetch_retry(connectorService.validateFilters, connectorService, [
        connectorConfig['connector.id'],
        connectorConfig,
      ])
        .then((result: FilterValidationResult) => {
          if (result.status === 'INVALID') {
            const errorMap = new Map();
            for (const e of result.propertyValidationResults) {
              errorMap.set(e.property, e.message);
            }
            setInvalidMsg(errorMap);
            //   props.setIsValidFilter(false);
            setTreeData([]);
            setChildNo(result.matchedCollections.length);
          } else {
            //   saveFilter && props.updateFilterValues(filterExpression);
            //   props.setIsValidFilter(true);
            setInvalidMsg(new Map());
            setChildNo(result.matchedCollections.length);
            setTreeData(formatResponseData(result.matchedCollections));
          }
          // isColumnOrFieldFilterApplied(filterExpression);
          setLoading(false);
        })
        .catch((err: React.SetStateAction<Error>) => {
          setApiError(true);
          setErrorMsg(err);
        });
    };

  const applyFilter = () => {
    getFilterSchema();
  };

  React.useEffect(() => {
    getFilterSchema();
  }, []);

  const ReviewContent = {
    type: 'INCREMENTAL',
    'data-collection': [
      'databaseName.schemaName.tableName1',
      'databaseName.schemaName.tableName2',
    ],
    'additional-collection': '...',
  };

  const steps = [
    {
      name: INCREMENTAL_SNAPSHOT,
      component: (
        <>
          <Text component={TextVariants.h2} style={{ whiteSpace: 'pre-line' }}>
            Select tables for incremental snapshots by entering comma-separated
            list of regular expressions.
          </Text>
          <Form className="child-selection-step_form">
            <div style={{ width: '70%' }}>
              <FormGroup
                label={'Incremental snapshot filter'}
                isRequired={true}
                labelIcon={
                  <HelpInfoIcon
                    label={'Incremental snapshot filter'}
                    description={'props.infoText'}
                  />
                }
              >
                <TextInput
                  name={'tableFilter'}
                  onChange={() => {}}
                  value={''}
                  onBlur={() => {}}
                  aria-label={'tableFilter'}
                  placeholder="e.g. databaseName.schemaName.tableName1, databaseName.schemaName.tableName1, ..."
                  //   validated={props.validated}
                  type={'text'}
                />
              </FormGroup>
              <FormGroup
                label={'Snapshot data filter'}
                labelIcon={
                  <HelpInfoIcon
                    label={'Snapshot data filter'}
                    description={'props.infoText'}
                  />
                }
              >
                <TextInput
                  name={'dataFilter'}
                  onChange={() => {}}
                  value={''}
                  onBlur={() => {}}
                  aria-label={'dataFilter'}
                  placeholder="e.g. LAST_UPDATE_DATE >= STR_TO_DATE('2023-01-01', '%Y-%m-%d')"
                  //   validated={props.validated}
                  type={'text'}
                />
              </FormGroup>
            </div>
            <ActionGroup>
              <Button variant="secondary" onClick={applyFilter}>
                {t('apply')}
              </Button>
              <Button variant="link" isInline={true} onClick={() => {}}>
                {t('clearFilters')}
              </Button>
            </ActionGroup>
          </Form>
          <Divider />
          <FilterTreeComponent
            treeData={treeData}
            loading={loading}
            apiError={apiError}
            errorMsg={errorMsg}
            columnOrFieldFilter={false}
            invalidMsg={invalidMsg}
            childNo={childNo}
            filterValues={new Map()}
            clearFilter={() => {}}
            i18nApiErrorTitle={t('apiErrorTitle')}
            i18nApiErrorMsg={t('apiErrorMsg')}
            i18nNoMatchingTables={'No matching tables'}
            i18nNoMatchingFilterExpMsg={'No matching filter expression'}
            i18nInvalidFilters={'Invalid filters'}
            i18nInvalidFilterText={'Invalid filter text'}
            i18nMatchingFilterExpMsg={
              'matching table(s) for incremental snapshots'
            }
            i18nClearFilterText={'Clear filter text'}
            i18nClearFilters={t('clearFilters')}
            i18nFilterExpressionResultText={'Filter expression result'}
            i18nColumnOrFieldFilter={_.capitalize('Column or field filter')}
            i18nInvalidFilterExpText={''}
          />
          {/* <ConfirmationDialog
          buttonStyle={ConfirmationButtonStyle.NORMAL}
          i18nCancelButtonText={t('cancel')}
          i18nConfirmButtonText={t('clear')}
          i18nConfirmationMessage={t('clearFilterConfMsg')}
          i18nTitle={t('clearFilters')}
          showDialog={showClearDialog}
          onCancel={doCancel}
          onConfirm={doClear}
        /> */}
        </>
      ),
    },

    {
      name: 'Review',
      component: (
        <>
          <Text component={TextVariants.h2}>
            {' '}
            {`Review the signal to be sent to starting the incremental snapshot for connector ${actionConnectorName}. click 'Finish' to send the signal`}{' '}
          </Text>
          <JsonViewer propertyValues={ReviewContent} />
        </>
      ),
      canJumpTo: stepIdReached >= 2,
      nextButtonText: 'Finish',
    },
  ];
  const incrementSnapshotHelperText = IncrementalSnapshotEnabled ? `Please click 'Start incremental snapshot' to configure and start a new incremental snapshot for ${actionConnectorName} connector.` : `Incremental snapshot is currently not enabled on ${actionConnectorName} connector. Please enable the Incremental snapshot and then click 'Start incremental snapshot' to configure and start a new incremental snapshot for ${actionConnectorName} connector.`

  return (
    <>
    <PageSection
      variant={PageSectionVariants.light}
      style={{ padding: '15px 5px' }}
    >
      {!setupIncrementalSnapshot ? (
        <EmptyState variant={EmptyStateVariant.large}>
          <EmptyStateIcon icon={CubesIcon} />
          <Title headingLevel="h4" size="lg">
            {IncrementalSnapshotEnabled ? 'No incremental snapshots available' : 'Incremental snapshot is not enabled'}
          </Title>
          <EmptyStateBody>
            {/* {`Please click 'Start incremental snapshot' to configure and start a new incremental snapshot for ${actionConnectorName} connector.`} */}
            {incrementSnapshotHelperText}
          </EmptyStateBody>
          <Button variant="primary" onClick={startIncrementalSnapshotConfig} isDisabled={!IncrementalSnapshotEnabled}>
            Start incremental snapshot
          </Button>
          <EmptyStateSecondaryActions>
            {/* <Level>
              <LevelItem> */}
                <Button variant="link" onClick={()=> setIsEnableModalOpen(true)} isDisabled={IncrementalSnapshotEnabled}>Enable Incremental snapshot</Button>
              {/* </LevelItem>
              <LevelItem> */}
                <Button variant="link" isDisabled={!IncrementalSnapshotEnabled} onClick={()=> setIncrementalSnapshotEnabled(false)}>Disable Incremental snapshot</Button>
              {/* </LevelItem>
            </Level> */}
          </EmptyStateSecondaryActions>
        </EmptyState>
      ) : (
        <Wizard
          className="incremental-snapshot-wizard"
          navAriaLabel={`Incremental snapshot steps`}
          mainAriaLabel={`Incremental snapshot content`}
          steps={steps}
          onClose={closeWizard}
          onNext={onNext}
          height={750}
        />
      )}
    </PageSection>
    <Modal
          variant={ModalVariant.medium}
          title="Enable Incremental snapshot"
          isOpen={isEnableModalOpen}
          onClose={()=> setIsEnableModalOpen(false)}
          actions={[
            <Button key="confirm" variant="primary" onClick={handleEnableModalToggle}>
              Confirm
            </Button>,
            <Button key="cancel" variant="link" onClick={()=> setIsEnableModalOpen(false)}>
              Cancel
            </Button>
          ]}
        >
         <Form className="child-selection-step_form">
            
              <FormGroup
                label={'Signaling data collection'}
                isRequired={true}
                labelIcon={
                  <HelpInfoIcon
                    label={'Signaling data collection'}
                    description={'The name of the data collection that is used to send signals/commands to Debezium. Signaling is disabled when not set.'}
                  />
                }
              >
                <TextInput
                  name={'Signaling_data_collection'}
                  onChange={() => {}}
                  value={''}
                  onBlur={() => {}}
                  aria-label={'Signaling_data_collection'}
                //   placeholder="e.g. databaseName.schemaName.tableName1, databaseName.schemaName.tableName1, ..."
                  //   validated={props.validated}
                  type={'text'}
                />
              </FormGroup>
           
           
          </Form>
        </Modal>
    </>
  );
};
