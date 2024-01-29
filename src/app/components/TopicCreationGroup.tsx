import {
  Button,
  Card,
  CardBody,
  CardTitle,
  FormGroup,
  FormHelperText,
  FormSection,
  FormSelect,
  FormSelectOption,
  Grid,
  GridItem,
  HelperText,
  HelperTextItem,
  Popover,
  Split,
  SplitItem,
  TextInput,
  Title,
  Tooltip,
} from "@patternfly/react-core";
import {
  ExclamationCircleIcon,
  HelpIcon,
  PlusCircleIcon,
  TrashIcon,
} from "@patternfly/react-icons";
import React, { useCallback, useEffect } from "react";
import { validate } from "./FormInputComponent";
import { cloneDeep } from "lodash";
import topicCreationResponse from "../assets/mockResponse/topicCreation.json";
import { FormStep } from "@app/constants";

interface TopicCreationGroupProps {
  topicGroupNo: number;
  topicGroupName: string;
  topicGroupInclude: string;
  topicGroupExclude: string;
  topicGroupConfig: any;
  topicGroupNameList: string[];
  deleteTransform: (transformNo: number) => void;
  updateTransform: (key: number, field: string, value: any) => void;
}

export interface ITopicOptions {
  topicOptions?: any;
}

export const TopicCreationGroup: React.FC<TopicCreationGroupProps> = ({
  topicGroupName,
  topicGroupNo,
  topicGroupInclude,
  topicGroupExclude,
  topicGroupConfig,
  topicGroupNameList,
  deleteTransform,
  updateTransform,
}) => {
  const [transformCardFormData, setTransformCardFormData] = React.useState<
    Record<string, any>
  >({});

  const [topicOptions, setTopicOptions] = React.useState<
    Map<string, ITopicOptions>
  >(new Map<string, ITopicOptions>());

  const addTopicOption = () => {
    if (topicOptions.size < topicCreationResponse.groups.options.length) {
      const topicGroupsCopy = new Map(topicOptions);
      topicGroupsCopy.set(self.crypto.randomUUID(), {});
      setTopicOptions(topicGroupsCopy);
    }
  };

  const deleteTopicOption = useCallback(
    (key: string) => {
      const topicGroupsCopy = new Map(topicOptions);
      topicGroupsCopy.delete(key);
      setTopicOptions(topicGroupsCopy);
    },
    [topicOptions, setTopicOptions]
  );

  const updateFormData = useCallback(
    (key: string, value: any, formStep: FormStep) => {
      setTransformCardFormData(
        cloneDeep({ ...transformCardFormData, [key]: value })
      );
      updateTransform(
        topicGroupNo,
        key,
        cloneDeep({ ...transformCardFormData, [key]: value })
      );
    },
    [
      transformCardFormData,
      updateTransform,
      topicGroupNo,
      setTransformCardFormData,
    ]
  );

  const [nameIsValid, setNameIsValid] = React.useState<validate>("default");

  const [selectedOptionsList, setSelectedOptionsList] = React.useState<
    string[]
  >([]);

  const updateSelectedOptionsList = useCallback(
    (value: string) => {
      const selectedOptionsListCopy = [...selectedOptionsList];
      selectedOptionsListCopy.push(value);
      setSelectedOptionsList(selectedOptionsListCopy);
    },
    [selectedOptionsList, setSelectedOptionsList]
  );

  const removeSelectedOptionsList = useCallback(
    (value: string) => {
      const selectedOptionsListCopy = [...selectedOptionsList];
      const newArray = selectedOptionsListCopy.filter((item) => item !== value);
      setSelectedOptionsList(newArray);
    },
    [selectedOptionsList, setSelectedOptionsList]
  );

  const clearSelectedOptionsList = useCallback(() => {
    setSelectedOptionsList([]);
  }, [setSelectedOptionsList]);

  // useEffect(() => {
  //   if (transformType) {
  //     setSelected(transformType);
  //     setInputValue(transformType);
  //     setTransformCardFormData(cloneDeep({ ...transformConfig }));
  //   }
  // }, []);

  // const onFocus = () => {
  //   const element = document.getElementById('transform-order-toggle');
  //   element?.focus();
  // };

  const deleteCard = () => {
    deleteTransform(topicGroupNo);
  };

  //   const handleNameChange = (_event: any, name: string) => {
  //     setTransformationName(name);
  //     if (name !== "") {
  //       setValidated("success");
  //     } else {
  //       setValidated("error");
  //     }
  //   };

  // useEffect(() => {
  //   if (transformsOptions && !isEmpty(transformsOptions)) {
  //     let newSelectOptions: SelectOptionProps[] = transformsOptions;

  //     // Filter menu items based on the text input value when one exists
  //     if (filterValue) {
  //       newSelectOptions = transformsOptions.filter((menuItem) =>
  //         String(menuItem.value)
  //           .toLowerCase()
  //           .includes(filterValue.toLowerCase())
  //       );

  //       // When no options are found after filtering, display 'No results found'
  //       if (!newSelectOptions.length) {
  //         newSelectOptions = [
  //           {
  //             isDisabled: false,
  //             children: `No results found for "${filterValue}"`,
  //             value: "no results",
  //           },
  //         ];
  //       }

  //       // Open the menu when the input value changes and the new value is not empty
  //       if (!isOpen) {
  //         setIsOpen(true);
  //       }
  //       setSelectOptions(newSelectOptions);
  //       setActiveItem(null);
  //       setFocusedItemIndex(null);
  //     }
  //   }
  // }, [filterValue]);

  const updateTopicGroupField = (value: string, field: string) => {
    if (field === "topic-group-name") {
      value === "" || topicGroupNameList.includes(value)
        ? setNameIsValid("error")
        : setNameIsValid("default");
      updateTransform(topicGroupNo, "name", value);
    } else {
      if (field === "topic-group-include") {
        updateTransform(topicGroupNo, "include", value);
      } else if (field === "topic-group-exclude") {
        updateTransform(topicGroupNo, "exclude", value);
      }
    }
  };

  const handleInputChange = (event: any, name: string) => {
    updateTopicGroupField(name, event.target.name);
  };

  return (
    <>
      <Card ouiaId="transform_card" style={{ marginBottom: "20px" }}>
        <CardTitle>
          <Split>
            <SplitItem isFilled={true}>
              <Split>
                <SplitItem>
                  <Title headingLevel="h3">
                    Topic group #{topicGroupNo} &nbsp;
                    {/* {!!transformName && !!transformType && (
                      <CheckCircleIcon style={{ color: "#3E8635" }} />
                    )} */}
                  </Title>
                </SplitItem>
                <SplitItem isFilled></SplitItem>
              </Split>
            </SplitItem>
            <SplitItem>
              <Tooltip content={<div>Delete topic group</div>}>
                <Button
                  variant="link"
                  icon={<TrashIcon />}
                  onClick={deleteCard}
                  id="tooltip-selector"
                />
              </Tooltip>
            </SplitItem>
          </Split>
        </CardTitle>
        <CardBody>
          <Grid hasGutter={true}>
            <GridItem span={4}>
              <FormGroup
                label="Name"
                labelIcon={
                  <Popover
                    bodyContent={
                      <div>Enter a unique name for the topic group.</div>
                    }
                  >
                    <button
                      type="button"
                      aria-label="More info for name field"
                      onClick={(e) => e.preventDefault()}
                      aria-describedby="simple-form-name-01"
                      className="pf-v5-c-form__group-label-help"
                    >
                      <HelpIcon />
                    </button>
                  </Popover>
                }
                isRequired
                fieldId="topic-group-name"
              >
                <TextInput
                  isRequired
                  validated={nameIsValid}
                  type="text"
                  id="topic-group-name"
                  name="topic-group-name"
                  aria-describedby="topic-group-name-helper"
                  value={topicGroupName}
                  onChange={handleInputChange}
                />
                <FormHelperText>
                  <HelperText>
                    <HelperTextItem
                      icon={
                        nameIsValid === "error" ? (
                          <ExclamationCircleIcon />
                        ) : (
                          <></>
                        )
                      }
                      variant={nameIsValid}
                    >
                      {nameIsValid === "error"
                        ? topicGroupName === ""
                          ? "Topic group name is required."
                          : "Enter a topic group name that is unique from other existing topic group."
                        : ""}
                    </HelperTextItem>
                  </HelperText>
                </FormHelperText>
              </FormGroup>
            </GridItem>

            <GridItem span={12}>
              <FormGroup
                label="Topic includes"
                fieldId="topic-group-include"
                labelIcon={
                  <Popover
                    bodyContent={
                      <div>
                        Enter the list of topics to include in the topic group.
                        The list can be comma separated or a regular expression.
                      </div>
                    }
                  >
                    <button
                      type="button"
                      aria-label="More info for name field"
                      onClick={(e) => e.preventDefault()}
                      aria-describedby="simple-form-name-01"
                      className="pf-v5-c-form__group-label-help"
                    >
                      <HelpIcon />
                    </button>
                  </Popover>
                }
              >
                <TextInput
                  type="text"
                  id="topic-group-include"
                  name="topic-group-include"
                  aria-describedby="topic-group-include-helper"
                  value={topicGroupInclude}
                  onChange={handleInputChange}
                />
              </FormGroup>
            </GridItem>
            <GridItem span={12}>
              <FormGroup
                label="Topic exclude"
                fieldId="topic-group-exclude"
                labelIcon={
                  <Popover
                    bodyContent={
                      <div>
                        Enter the list of topics to exclude in the topic group.
                        The list can be comma separated or a regular expression.
                      </div>
                    }
                  >
                    <button
                      type="button"
                      aria-label="More info for name field"
                      onClick={(e) => e.preventDefault()}
                      aria-describedby="simple-form-name-01"
                      className="pf-v5-c-form__group-label-help"
                    >
                      <HelpIcon />
                    </button>
                  </Popover>
                }
              >
                <TextInput
                  type="text"
                  id="topic-group-exclude"
                  name="topic-group-exclude"
                  aria-describedby="topic-group-exclude-helper"
                  value={topicGroupExclude}
                  onChange={handleInputChange}
                />
              </FormGroup>
            </GridItem>
          </Grid>
          <FormSection title="Topic options" titleElement="h4">
            <Card ouiaId="transform_card" style={{ marginBottom: "20px" }}>
              <CardBody>
                {/* {isEmpty(topicGroupConfig)
                  ? "No topic group options have been defined. Click on 'Add options' to add one."
                  : ()} */}
                {Array.from(topicOptions.keys()).map((key, index) => {
                  return (
                    <TopicOptionsSelect
                      key={key}
                      uniqueKey={key}
                      selectedOptionsList={selectedOptionsList}
                      updateSelectedOptionsList={updateSelectedOptionsList}
                      removeSelectedOptionsList={removeSelectedOptionsList}
                      clearSelectedOptionsList={clearSelectedOptionsList}
                      deleteTopicOption={deleteTopicOption}
                    />
                  );
                })}

                <div>
                  <Button
                    variant="secondary"
                    isDisabled={
                      topicOptions.size ===
                      topicCreationResponse.groups.options.length
                    }
                    className="pf-u-mt-lg"
                    icon={<PlusCircleIcon />}
                    onClick={addTopicOption}
                    style={{ width: "200px" }}
                  >
                    Add options
                  </Button>
                </div>
              </CardBody>
            </Card>
          </FormSection>
        </CardBody>
      </Card>
    </>
  );
};

type TopicOptionsSelectProps = {
  uniqueKey: string;
  selectedOptionsList: string[];
  updateSelectedOptionsList: (value: string) => void;
  removeSelectedOptionsList: (value: string) => void;
  clearSelectedOptionsList: () => void;
  deleteTopicOption: (key: string) => void;
};

const TopicOptionsSelect: React.FC<TopicOptionsSelectProps> = ({
  uniqueKey,
  selectedOptionsList,
  updateSelectedOptionsList,
  removeSelectedOptionsList,
  clearSelectedOptionsList,
  deleteTopicOption,
}) => {
  const [topicOptionSelectValue, setTopicOptionSelectValue] =
    React.useState("");
  const [topicOptionSelectOptions, setTopicOptionSelectOptions] =
    React.useState<
      {
        value: string;
        label: string;
        disabled: boolean;
      }[]
    >([]);

  const onTopicOptionChange = (
    _event: React.FormEvent<HTMLSelectElement>,
    value: string
  ) => {
    if (value === "please choose") {
      clearSelectedOptionsList();
    } else {
      updateSelectedOptionsList(value);
    }
    setTopicOptionSelectValue(value);
  };

  const deleteTopicOptionValue = () => {
    if (topicOptionSelectValue !== "") {
      removeSelectedOptionsList(topicOptionSelectValue);
    }

    deleteTopicOption(uniqueKey);
  };

  useEffect(() => {
    const options = topicCreationResponse.groups.options.map((option) => {
      const selected = selectedOptionsList.includes(option["x-name"]);
      return {
        value: option["x-name"],
        label: option.title,
        disabled: selected,
      };
    });
    options.unshift({
      value: "please choose",
      label: "Select one",
      disabled: false,
    });
    setTopicOptionSelectOptions(options);
  }, [selectedOptionsList]);

  return (
    <Grid hasGutter style={{ paddingBottom: "5px" }}>
      <GridItem span={7}>
        <FormSelect
          value={topicOptionSelectValue}
          onChange={onTopicOptionChange}
          aria-label="FormSelect Input"
          ouiaId="BasicFormSelect"
        >
          {topicOptionSelectOptions.map((option, index) => (
            <FormSelectOption
              isDisabled={option.disabled || !!topicOptionSelectValue}
              key={index}
              value={option.value}
              label={option.label}
            />
          ))}
        </FormSelect>
      </GridItem>
      <GridItem span={4}>
        <TextInput
          type="text"
          isDisabled={
            topicOptionSelectValue === "please choose" ||
            topicOptionSelectValue === ""
          }
          id="topic-options-value"
          name="topic-options-value"
          aria-describedby="topic-options-value-helper"
          value={""}
          onChange={() => {}}
        />
        {/* <FormInputComponent
                    property={{
                      ...cloneDeep(property),
                      // "x-name": property["x-name"].replace(/\./g, "_"),
                      "x-name": property["x-name"],
                    }}
                    requiredList={[]}
                    formStep={FormStep.TOPIC_CREATION}
                    updateFormData={updateLocalFormData}
                    formData={topicCreationDefaultData}
                    key={property["x-name"]}
                  /> */}
      </GridItem>
      <GridItem span={1}>
        <Tooltip content={<div>Delete topic option</div>}>
          <Button
            variant="link"
            icon={<TrashIcon />}
            onClick={deleteTopicOptionValue}
            id="tooltip-selector"
          />
        </Tooltip>
      </GridItem>
    </Grid>
  );
};
