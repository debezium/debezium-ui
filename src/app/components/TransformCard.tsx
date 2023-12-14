import {
  Split,
  SplitItem,
  Tooltip,
  Title,
  Button,
  Grid,
  GridItem,
  Form,
  FormGroup,
  FormHelperText,
  HelperText,
  HelperTextItem,
  TextInput,
  Select,
  SelectList,
  SelectOption,
  SelectOptionProps,
  MenuToggle,
  MenuToggleElement,
  TextInputGroup,
  TextInputGroupMain,
  TextInputGroupUtilities,
  SelectGroup,
  Divider,
  DropdownItem,
  Card,
  CardBody,
  CardFooter,
  CardTitle,
  FormFieldGroupExpandable,
  FormFieldGroupHeader,
} from "@patternfly/react-core";
import {
  CheckCircleIcon,
  ExclamationCircleIcon,
  TrashIcon,
  TimesIcon,
} from "@patternfly/react-icons";
import React, { useCallback, useEffect } from "react";
import { FormInputComponent, validate } from "./FormInputComponent";
import { cloneDeep, find, isEmpty } from "lodash";
import { FormStep } from "@app/constants";
import { TransformOrderDropdown } from "./TransformOrderDropdown";

interface TransformCardProps {
  transformNo: number;
  transformName: string;
  transformType: string;
  transformConfig: any;
  transformNameList: string[];
  transformsOptions: { value: any; children: any }[] | null;
  deleteTransform: (transformNo: number) => void;
  updateTransform: (key: number, field: string, value: any) => void;
  isTop: boolean;
  isBottom: boolean;
  moveTransformOrder: (transformNo: number, position: string) => void;
}

export const TransformCard: React.FC<TransformCardProps> = ({
  transformName,
  transformNo,
  transformConfig,
  transformNameList,
  transformType,
  transformsOptions,
  deleteTransform,
  updateTransform,
  isTop,
  isBottom,
  moveTransformOrder,
}) => {
  const [transformCardFormData, setTransformCardFormData] = React.useState<
    Record<string, any>
  >({});

  const updateFormData = useCallback(
    (key: string, value: any, formStep: FormStep) => {
      setTransformCardFormData(
        cloneDeep({ ...transformCardFormData, [key]: value })
      );
      updateTransform(
        transformNo,
        key,
        cloneDeep({ ...transformCardFormData, [key]: value })
      );
    },
    [
      transformCardFormData,
      updateTransform,
      transformNo,
      setTransformCardFormData,
    ]
  );

  const [isOpen, setIsOpen] = React.useState(false);
  const [selected, setSelected] = React.useState<string>(transformType);
  const [inputValue, setInputValue] = React.useState<string>("");
  const [filterValue, setFilterValue] = React.useState<string>("");
  const [selectOptions, setSelectOptions] = React.useState<SelectOptionProps[]>(
    transformsOptions!
  );
  const [focusedItemIndex, setFocusedItemIndex] = React.useState<number | null>(
    null
  );
  const [activeItem, setActiveItem] = React.useState<string | null>(null);
  const textInputRef = React.useRef<HTMLInputElement>();

  const [nameIsValid, setNameIsValid] = React.useState<validate>("default");

  useEffect(() => {
    transformsOptions && setSelectOptions(transformsOptions);
  }, [transformsOptions]);

  useEffect(() => {
    if (transformType) {
      setSelected(transformType);
      setInputValue(transformType);
      setTransformCardFormData(cloneDeep({ ...transformConfig }));
    }
  }, []);

  const onPositionSelect = useCallback(
    (
      event?: React.MouseEvent<Element, MouseEvent> | undefined,
      value?: string | number | undefined
    ) => {
      moveTransformOrder(transformNo, event!.currentTarget.id);
      // onFocus();
    },
    [moveTransformOrder, transformNo]
  );

  // const onFocus = () => {
  //   const element = document.getElementById('transform-order-toggle');
  //   element?.focus();
  // };

  const deleteCard = () => {
    deleteTransform(transformNo);
  };

  //   const handleNameChange = (_event: any, name: string) => {
  //     setTransformationName(name);
  //     if (name !== "") {
  //       setValidated("success");
  //     } else {
  //       setValidated("error");
  //     }
  //   };

  useEffect(() => {
    if (transformsOptions && !isEmpty(transformsOptions)) {
      let newSelectOptions: SelectOptionProps[] = transformsOptions;

      // Filter menu items based on the text input value when one exists
      if (filterValue) {
        newSelectOptions = transformsOptions.filter((menuItem) =>
          String(menuItem.value)
            .toLowerCase()
            .includes(filterValue.toLowerCase())
        );

        // When no options are found after filtering, display 'No results found'
        if (!newSelectOptions.length) {
          newSelectOptions = [
            {
              isDisabled: false,
              children: `No results found for "${filterValue}"`,
              value: "no results",
            },
          ];
        }

        // Open the menu when the input value changes and the new value is not empty
        if (!isOpen) {
          setIsOpen(true);
        }
        setSelectOptions(newSelectOptions);
        setActiveItem(null);
        setFocusedItemIndex(null);
      }
    }
  }, [filterValue]);

  const updateNameType = (value: string, field?: string) => {
    if (field) {
      value === "" || transformNameList.includes(value)
        ? setNameIsValid("error")
        : setNameIsValid("default");
      updateTransform(transformNo, "name", value);
    } else {
      updateTransform(transformNo, "type", value);
    }
  };

  const handleNameChange = (_event: any, name: string) => {
    updateNameType(name, "name");
  };

  const onToggleClick = () => {
    setIsOpen(!isOpen);
  };

  const onSelect = (
    _event: React.MouseEvent<Element, MouseEvent> | undefined,
    value: string | number | undefined
  ) => {
    if (value && value !== "no results") {
      setInputValue(value as string);
      setFilterValue("");
      setSelected(value as string);
      updateNameType(value as string);
    }
    setIsOpen(false);
    setFocusedItemIndex(null);
    setActiveItem(null);
  };

  const onTextInputChange = (
    _event: React.FormEvent<HTMLInputElement>,
    value: string
  ) => {
    setInputValue(value);
    setFilterValue(value);
  };

  const handleMenuArrowKeys = (key: string) => {
    let indexToFocus;

    if (isOpen) {
      if (key === "ArrowUp") {
        // When no index is set or at the first index, focus to the last, otherwise decrement focus index
        if (focusedItemIndex === null || focusedItemIndex === 0) {
          indexToFocus = selectOptions!.length - 1;
        } else {
          indexToFocus = focusedItemIndex - 1;
        }
      }

      if (key === "ArrowDown") {
        // When no index is set or at the last index, focus to the first, otherwise increment focus index
        if (
          focusedItemIndex === null ||
          focusedItemIndex === selectOptions!.length - 1
        ) {
          indexToFocus = 0;
        } else {
          indexToFocus = focusedItemIndex + 1;
        }
      }

      setFocusedItemIndex(indexToFocus!);
      const focusedItem = selectOptions!.filter((option) => !option.isDisabled)[
        indexToFocus!
      ];
      setActiveItem(`select-typeahead-${focusedItem.value.replace(" ", "-")}`);
    }
  };

  const onInputKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    const enabledMenuItems = selectOptions!.filter(
      (option) => !option.isDisabled
    );
    const [firstMenuItem] = enabledMenuItems;
    const focusedItem = focusedItemIndex
      ? enabledMenuItems[focusedItemIndex]
      : firstMenuItem;

    switch (event.key) {
      // Select the first available option
      case "Enter":
        if (isOpen && focusedItem.value !== "no results") {
          setInputValue(String(focusedItem.children));
          setFilterValue("");
          setSelected(String(focusedItem.children));
          updateNameType(String(focusedItem.children));
        }

        setIsOpen((prevIsOpen) => !prevIsOpen);
        setFocusedItemIndex(null);
        setActiveItem(null);

        break;
      case "Tab":
      case "Escape":
        setIsOpen(false);
        setActiveItem(null);
        break;
      case "ArrowUp":
      case "ArrowDown":
        event.preventDefault();
        handleMenuArrowKeys(event.key);
        break;
    }
  };

  const toggle = (toggleRef: React.Ref<MenuToggleElement>) => (
    <MenuToggle
      ref={toggleRef}
      variant="typeahead"
      onClick={onToggleClick}
      isDisabled={transformName === "" || nameIsValid === "error"}
      isExpanded={isOpen}
      isFullWidth
    >
      <TextInputGroup isPlain>
        <TextInputGroupMain
          value={inputValue}
          onClick={onToggleClick}
          onChange={onTextInputChange}
          onKeyDown={onInputKeyDown}
          id="typeahead-select-input"
          autoComplete="off"
          innerRef={textInputRef}
          placeholder="Select a state"
          {...(activeItem && { "aria-activedescendant": activeItem })}
          role="combobox"
          isExpanded={isOpen}
          aria-controls="select-typeahead-listbox"
        />

        <TextInputGroupUtilities>
          {!!inputValue && (
            <Button
              variant="plain"
              onClick={() => {
                setSelected("");
                updateNameType("");
                setInputValue("");
                setFilterValue("");
                textInputRef?.current?.focus();
              }}
              aria-label="Clear input value"
            >
              <TimesIcon aria-hidden />
            </Button>
          )}
        </TextInputGroupUtilities>
      </TextInputGroup>
    </MenuToggle>
  );

  const dropdownItems = [
    <DropdownItem key="move_top" component="button" id="top" isDisabled={isTop}>
      Move top
    </DropdownItem>,
    <DropdownItem
      key="move_up"
      component="button"
      id="up"
      isDisabled={isTop || (isTop && isBottom)}
    >
      Move up
    </DropdownItem>,
    <DropdownItem
      key="move_down"
      component="button"
      id="down"
      isDisabled={(isTop && isBottom) || isBottom}
    >
      Move down
    </DropdownItem>,
    <DropdownItem
      key="move_bottom"
      component="button"
      id="bottom"
      isDisabled={isBottom}
    >
      Move bottom
    </DropdownItem>,
  ];

  const getOptions = () => {
    const TransformData: { value: any; children: any }[] = [];
    transformsOptions &&
      !isEmpty(transformsOptions) &&
      transformsOptions.forEach((data) => {
        data.value.includes("io.debezium")
          ? TransformData.unshift(data)
          : TransformData.push(data);
      });
    const dbzTransform: JSX.Element[] = [];
    const apacheTransform: JSX.Element[] = [];
    TransformData.forEach((data, index) => {
      data.value.includes("io.debezium")
        ? dbzTransform.push(
            <SelectOption
              key={data.value}
              isFocused={focusedItemIndex === index}
              onClick={() => {
                setSelected(data.value);
                updateNameType(data.value);
              }}
              id={`select-typeahead-${data.value.replace(" ", "-")}`}
              value={`${data.value}`}
              ref={null}
            >
              {data.value}
            </SelectOption>
          )
        : apacheTransform.push(
            <SelectOption
              key={data.value}
              isFocused={focusedItemIndex === index}
              onClick={() => {
                setSelected(data.value);
                updateNameType(data.value);
              }}
              id={`select-typeahead-${data.value.replace(" ", "-")}`}
              value={`${data.value}`}
              ref={null}
            >
              {data.value}
            </SelectOption>
          );
    });

    return [
      <SelectGroup label="Debezium" key="group1">
        <SelectList>{dbzTransform}</SelectList>
      </SelectGroup>,
      <Divider key="divider" />,
      <SelectGroup label="Apache Kafka" key="group2">
        <SelectList>{apacheTransform}</SelectList>
      </SelectGroup>,
    ];
  };

  return (
    <>
      <Card ouiaId="transform_card" style={{ marginBottom: "20px" }}>
        <CardTitle>
          <Split>
            <SplitItem className={"pf-u-pr-sm"}>
              <Tooltip content={<div>Reorder transform</div>}>
                <TransformOrderDropdown
                  dropdownItems={dropdownItems}
                  onPositionSelect={onPositionSelect}
                />
              </Tooltip>
            </SplitItem>
            <SplitItem isFilled={true}>
              <Split>
                <SplitItem>
                  <Title headingLevel="h3">
                    Transformation #{transformNo} &nbsp;
                    {!!transformName && !!transformType && (
                      <CheckCircleIcon style={{ color: "#3E8635" }} />
                    )}
                  </Title>
                </SplitItem>
                <SplitItem isFilled></SplitItem>
              </Split>
            </SplitItem>
            <SplitItem>
              <Tooltip content={<div>Delete Transform</div>}>
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
          <Form>
            <Grid hasGutter={true}>
              <GridItem span={4}>
                <FormGroup label="Name" isRequired fieldId="transform-name">
                  <TextInput
                    isRequired
                    validated={nameIsValid}
                    type="text"
                    id="transform-form-name"
                    name="transform-form-name"
                    aria-describedby="transform-form-name-helper"
                    value={transformName}
                    onChange={handleNameChange}
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
                          ? transformName === ""
                            ? "Connector name is required."
                            : "Enter a connector name that is unique from other existing connectors."
                          : ""}
                      </HelperTextItem>
                    </HelperText>
                  </FormHelperText>
                </FormGroup>
              </GridItem>

              <GridItem span={8}>
                <FormGroup
                  label="Transformation class"
                  isRequired
                  fieldId="transform-type"
                >
                  <Select
                    id="typeahead-select"
                    isOpen={isOpen}
                    selected={selected || transformType}
                    onSelect={onSelect}
                    onOpenChange={() => {
                      setIsOpen(false);
                    }}
                    toggle={toggle}
                  >
                    <SelectList id="select-typeahead-listbox">
                      {inputValue === ""
                        ? getOptions()
                        : selectOptions.map((data, index) => (
                            <SelectOption
                              key={data.value}
                              isFocused={focusedItemIndex === index}
                              onClick={() => {
                                setSelected(data.value);
                                updateNameType(data.value);
                              }}
                              id={`select-typeahead-${data.value.replace(
                                " ",
                                "-"
                              )}`}
                              value={`${data.value}`}
                              ref={null}
                            >
                              {data.value}
                            </SelectOption>
                          ))}
                    </SelectList>
                  </Select>
                </FormGroup>
              </GridItem>
            </Grid>
          </Form>
        </CardBody>
        <CardFooter>
          {transformsOptions &&
            !isEmpty(transformsOptions) &&
            !!transformName &&
            !!selected && (
              <Form isWidthLimited>
                <FormFieldGroupExpandable
                  isExpanded
                  toggleAriaLabel="Details"
                  header={
                    <FormFieldGroupHeader
                      titleText={{
                        text: "Configuration",
                        id: "connector-transform-config-properties",
                      }}
                      // titleDescription="Field group 3 description text."
                    />
                  }
                >
                  {Object.entries(
                    find(transformsOptions, (obj) => obj.value === selected)!
                      .children
                  ).map(([key, value]) => {
                    return (
                      <FormInputComponent
                        property={{
                          ...cloneDeep(
                            value as Omit<ConnectorProperties, "x-category">
                          ),
                          "x-name": (
                            value as Omit<ConnectorProperties, "x-category">
                          )["x-name"],
                        }}
                        requiredList={[]}
                        formStep={FormStep.TRANSFORM}
                        updateFormData={updateFormData}
                        formData={transformCardFormData}
                        key={key}
                      />
                    );
                  })}
                </FormFieldGroupExpandable>
              </Form>
            )}
        </CardFooter>
      </Card>
    </>
  );
};
