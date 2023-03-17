import { TRANSFORMS as transforms } from './transforms';
import './SMTExampleModel.css';
import {
  Flex,
  FlexItem,
  Form,
  FormGroup,
  Grid,
  GridItem,
  HelperText,
  HelperTextItem,
  Label,
  List,
  ListItem,
  Modal,
  ModalVariant,
  Radio,
  Text,
  TextContent,
  TextVariants,
} from '@patternfly/react-core';
import {
  AngleDoubleRightIcon,
  ExternalLinkAltIcon,
} from '@patternfly/react-icons';
import { TypeSelectorComponent } from './TypeSelectorComponent';
import _ from 'lodash';
import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';

interface ISMTExampleModalProps {
  isExampleModalOpen: boolean;
  handleExampleModalToggle: () => void;
  transformsOptions: any;
  transformType: string;
  setFieldValue: (value: any) => void;
  withMemory?: boolean;
}

enum indicatorType {
  ADD = 'add',
  REMOVE = 'remove',
}

enum recordPropertiesValues {
  TOPIC = 'topic',
  EVENT_HEADER = 'eventHeader',
  KEY = 'key',
  VALUE = 'value',
}

const recordProperties = [
  recordPropertiesValues.TOPIC,
  recordPropertiesValues.EVENT_HEADER,
  recordPropertiesValues.KEY,
  recordPropertiesValues.VALUE,
];

const addIndicators = (text: string, type: indicatorType) => {
  const addRemoveIndicators =
    type === indicatorType.ADD
      ? text.replace(/^/gm, '+  ')
      : text.replace(/^/gm, '-  ');
  return addRemoveIndicators;
};

export type recordType = {
  topic: string;
  eventHeader: string;
  key: string;
  value: string;
};

export const SMTExampleModal: React.FunctionComponent<
  ISMTExampleModalProps
> = ({
  isExampleModalOpen,
  handleExampleModalToggle,
  transformsOptions,
  transformType,
  setFieldValue,
  withMemory = false,
}) => {
  const { t } = useTranslation();

  const [selectedSMT, setSelectedSMT] = React.useState<string>('');
  const [matchingCondition, setMatchingCondition] =
    React.useState<boolean>(true);
  const [play, setPlay] = React.useState<boolean>(false);

  const [originalRecord, setOriginalRecord] = React.useState<recordType>({
    topic: '',
    eventHeader: ``,
    key: ``,
    value: ``,
  });

  const [transformedRecord, setTransformedRecord] = React.useState<recordType>({
    topic: '',
    eventHeader: ``,
    key: ``,
    value: ``,
  });

  const [affectedRecord, setAffectedRecord] = React.useState<string[]>([]);

  const [eventType, setEventType] = React.useState<string>('');

  const handleChange = (_, event) => {
    const { value } = event.currentTarget;
    setMatchingCondition(value === 'true' ? true : false);
  };

  const toggleModel = () => {
    !withMemory && setSelectedSMT('');
    setMatchingCondition(true);
    handleExampleModalToggle();
  };

  const getTransformURL = () => {
    const transformURLParan = transforms[selectedSMT]?.route;
    if (selectedSMT.includes('debezium')) {
      return `https://debezium.io/documentation/reference/transformations/${transformURLParan}`;
    } else {
      return `https://kafka.apache.org/documentation/#org.apache.kafka.connect.transforms.${transformURLParan}`;
    }
  };

  useEffect(() => {
    if (transformType) {
      setSelectedSMT(transformType);
    }
  }, [transformType]);

  useEffect(() => {
    setPlay(false);
    setAffectedRecord([]);
    setEventType('');
    if (selectedSMT) {
      setOriginalRecord({ ...transforms[selectedSMT]?.originalEvent });
    }
  }, [selectedSMT, matchingCondition]);

  useEffect(() => {
    setMatchingCondition(true);
  }, [selectedSMT]);

  useEffect(() => {
    if (play) {
      const transformedRecord = transforms[selectedSMT]?.transformedEvent;
      if (!matchingCondition && transforms[selectedSMT]?.notMatchingCondition) {
        const notMatchingConditionRecord =
          transforms[selectedSMT]?.notMatchingCondition;
        if (notMatchingConditionRecord === 'event-pass') {
          setEventType('event-pass');
          setOriginalRecord({ ...originalRecord });
          setTransformedRecord({ ...originalRecord });
        } else if (notMatchingConditionRecord === 'event-drop') {
          setEventType('event-drop');
          setOriginalRecord({
            topic: addIndicators(
              originalRecord[recordPropertiesValues.TOPIC],
              indicatorType.REMOVE
            ),
            eventHeader: addIndicators(
              originalRecord[recordPropertiesValues.EVENT_HEADER],
              indicatorType.REMOVE
            ),
            key: addIndicators(
              originalRecord[recordPropertiesValues.KEY],
              indicatorType.REMOVE
            ),
            value: addIndicators(
              originalRecord[recordPropertiesValues.VALUE],
              indicatorType.REMOVE
            ),
          });
        }
      } else {
        if (transformedRecord !== 'event-pass') {
          setEventType('event-transformed');
          setAffectedRecord(Object.keys(transformedRecord));
          let addedObj = {};
          Object.keys(transformedRecord).forEach((key) => {
            addedObj = {
              ...addedObj,
              [key]: addIndicators(transformedRecord[key], indicatorType.ADD),
            };
          });
          let removedObj = {};
          Object.keys(transformedRecord).forEach((key) => {
            removedObj = {
              ...removedObj,
              [key]: addIndicators(originalRecord[key], indicatorType.REMOVE),
            };
          });
          setOriginalRecord({ ...originalRecord, ...removedObj });
          setTransformedRecord({ ...originalRecord, ...addedObj });
        } else if (transformedRecord === 'event-pass') {
          setEventType('event-pass');
          setOriginalRecord({ ...originalRecord });
          setTransformedRecord({ ...originalRecord });
        } else if (transformedRecord === 'event-drop') {
          setEventType('event-drop');
          setOriginalRecord({
            topic: addIndicators(
              originalRecord[recordPropertiesValues.TOPIC],
              indicatorType.REMOVE
            ),
            eventHeader: addIndicators(
              originalRecord[recordPropertiesValues.EVENT_HEADER],
              indicatorType.REMOVE
            ),
            key: addIndicators(
              originalRecord[recordPropertiesValues.KEY],
              indicatorType.REMOVE
            ),
            value: addIndicators(
              originalRecord[recordPropertiesValues.VALUE],
              indicatorType.REMOVE
            ),
          });
        }
      }
    }
  }, [play]);

  return (
    <Modal
      variant={ModalVariant.large}
      title={'Single message transform example'}
      isOpen={isExampleModalOpen}
      description={
        <TextContent>
          <Text component={TextVariants.p}>
            Below we have taken a standard Debezium event/record as an example
            to understand the effect of transformation. Select a SMT from the
            dropdown and then based on the selected SMT if applicable you toggle
            between the conditions to see the transformation effect. &nbsp;
          </Text>
        </TextContent>
      }
      onClose={toggleModel}
    >
      <Form isHorizontal className="exampleForm">
        <TypeSelectorComponent
          label="Type"
          description={t('transformTypeDescription')}
          fieldId="transform_type"
          isRequired={true}
          isDisabled={false}
          options={transformsOptions}
          value={selectedSMT}
          setFieldValue={setSelectedSMT}
          isInvalid={false}
          invalidText={t('typeRequired')}
          helperText={
            selectedSMT ? (
              <div className="pf-c-form__helper-text">
                Learn more about&nbsp;
                <a href={getTransformURL()} target="_blank">
                  {selectedSMT} <ExternalLinkAltIcon />
                </a>
              </div>
            ) : null
          }
        />
        {selectedSMT && transforms[selectedSMT]?.condition && (
          <FormGroup label={'SMT configured with:'} fieldId={'condition'}>
            <TextContent>
              <Text className="smt_condition">
                <code>
                  <i>
                    {transforms[selectedSMT]?.condition.value.join(' and ')}
                  </i>
                </code>
              </Text>
            </TextContent>
            {transforms[selectedSMT]?.condition.conditionToggle && (
              <Flex>
                <FlexItem>
                  <Radio
                    isChecked={matchingCondition === true}
                    name="condition-toggle"
                    onChange={handleChange}
                    // label="Event with matching condition"
                    label={
                      <TextContent>
                        <Text
                          component={TextVariants.small}
                          className="smt_condition_radio"
                        >
                          Event with matching condition
                        </Text>
                      </TextContent>
                    }
                    id="matchingCondition"
                    value="true"
                  />
                </FlexItem>
                <FlexItem>
                  <Radio
                    isChecked={matchingCondition === false}
                    name="condition-toggle"
                    onChange={handleChange}
                    // label="Event with non-matching condition"
                    label={
                      <TextContent>
                        <Text
                          component={TextVariants.small}
                          className="smt_condition_radio"
                        >
                          Event with non-matching condition
                        </Text>
                      </TextContent>
                    }
                    id="non-matchingCondition"
                    value="false"
                  />
                </FlexItem>
              </Flex>
            )}
          </FormGroup>
        )}
      </Form>
      <Grid className="diff-area">
        <GridItem span={6} style={{ textAlign: 'center' }}>
          <TextContent>
            <Text component={TextVariants.h4}>
              <b>Original event/record</b>
            </Text>
          </TextContent>
          <List isPlain className="event_box">
            {recordProperties.map((property) => (
              <ListItem
                key={property}
                className={
                  play && eventType === 'event-drop'
                    ? 'removed'
                    : affectedRecord.includes(property)
                    ? 'removed'
                    : ''
                }
              >
                <Grid>
                  <GridItem span={3}>
                    <Label
                      color={
                        play && eventType === 'event-drop'
                          ? 'red'
                          : affectedRecord.includes(property)
                          ? 'red'
                          : undefined
                      }
                    >
                      {_.upperFirst(property)}
                    </Label>
                  </GridItem>
                  <GridItem span={9}>
                    <pre>
                      <code>{selectedSMT ? originalRecord[property] : ''}</code>
                    </pre>
                  </GridItem>
                </Grid>
              </ListItem>
            ))}
          </List>
        </GridItem>
        <GridItem span={1} className="play_button">
          <AngleDoubleRightIcon
            size="lg"
            style={!!selectedSMT ? { cursor: 'pointer' } : {}}
            disabled={!selectedSMT}
            onClick={() => setPlay(true)}
          />
        </GridItem>
        <GridItem span={5} className="transformed-block">
          <TextContent>
            <Text component={TextVariants.h4}>
              <b>After transformation event/record</b>
            </Text>
          </TextContent>
          <List
            isPlain
            className={
              eventType === 'event-drop'
                ? 'event_box event-dropped'
                : 'event_box'
            }
          >
            {eventType !== 'event-drop' &&
              recordProperties.map((property) => (
                <ListItem
                  key={property}
                  className={
                    selectedSMT && play && affectedRecord.includes(property)
                      ? 'added'
                      : ''
                  }
                >
                  <pre>
                    <code>
                      {selectedSMT && play ? transformedRecord[property] : ''}
                    </code>
                  </pre>
                </ListItem>
              ))}
            {eventType === 'event-drop' && (
              <p className="empty-text">Event/Record dropped</p>
            )}
          </List>
        </GridItem>
      </Grid>
      {transforms[selectedSMT]?.note && (
        <HelperText>
        <HelperTextItem><b><i>{'Note: '}</i></b>{transforms[selectedSMT]?.note}</HelperTextItem>
      </HelperText>
      )}
      
    </Modal>
  );
};
