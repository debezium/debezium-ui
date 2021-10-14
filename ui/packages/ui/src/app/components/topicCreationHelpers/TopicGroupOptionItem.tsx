import {
  Button,
  Flex,
  FlexItem,
  Grid,
  GridItem,
  Select,
  SelectOption,
  SelectVariant,
  TextInput
} from "@patternfly/react-core";
import { TrashIcon } from "@patternfly/react-icons";
import * as React from "react";
import "./TopicGroupOptionItem.css";

export interface ITopicGroupOptionItemProps {
  rowId: number;
  itemName?: any;
  itemValue?: any;
  topicGroupOptionProperties: any[];
  topicGroupOptionNameChanged: (rowId: number, itemName: string | undefined) => void;
  topicGroupOptionValueChanged: (rowId: number, itemValue: any) => void;
  deleteTopicGroupOptionItem: (rowId: number) => void;
}

export const TopicGroupOptionItem: React.FunctionComponent<ITopicGroupOptionItemProps> = (
  props
) => {

  const getValueSelectOptions = (pName: string) => {
    const selectOptions: JSX.Element[] = [];
    const theProp = props.topicGroupOptionProperties.find(
      (prop) => prop.name === pName
    );
    if (theProp) {
      const allowed = theProp.allowedValues;
      allowed.forEach((val, index) => {
        selectOptions.push(<SelectOption key={index} value={val} />);
      });
    }
    return selectOptions;
  }
  
  const getGroupOptionPropName = (dName: string) => {
    let result: any;
    if (dName === "Select an option") {
      result = undefined;
    } else {
      const theProp = props.topicGroupOptionProperties.find(
        (prop) => prop.displayName === dName
      );
      if (theProp) {
        result = theProp.name;
      }
    }
    return result;
  }

  const getGroupOptionPropDefaultValue = (dName: string) => {
    let result: any;
    if (dName === "Select an option") {
      result = undefined;
    } else {
      const theProp = props.topicGroupOptionProperties.find(
        (prop) => prop.displayName === dName
      );
      if (theProp && theProp.defaultValue) {
        result = theProp.defaultValue;
      }
    }
    return result;
  }

  const getGroupOptionDisplayName = (pName: string) => {
    let result: any;
    if (!pName) {
      result = "Select an option";
    } else {
      const theProp = props.topicGroupOptionProperties.find(
        (prop) => prop.name === pName
      );
      if (theProp) {
        result = theProp.displayName;
      }
    }
    return result;
  }

  const [selectedOptionName, setSelectedOptionName] = React.useState<string | undefined>(getGroupOptionDisplayName(props.itemName));
  const [isOptionSelectorOpen, setOptionSelectorOpen] = React.useState<boolean>(false);
  const [isOptionValueSelectorOpen, setOptionValueSelectorOpen] = React.useState<boolean>(false);

  const getTopicGroupSelectOptions = () => {
    const options: JSX.Element[] = [];
    options.push(<SelectOption key={0} value={'Choose option...'} isPlaceholder={true} />)
    props.topicGroupOptionProperties.forEach((prop, index) => {
      options.push(<SelectOption key={index+1} value={getGroupOptionDisplayName(prop.name)} />);
    });
    return options;
  };
  
  const onOptionToggle = (open: boolean) => {
    setOptionSelectorOpen(open);
  };

  const clearOptionSelection = () => {
    setSelectedOptionName(undefined);
    props.topicGroupOptionNameChanged(props.rowId, undefined);
    props.topicGroupOptionValueChanged(props.rowId, undefined);
    setOptionSelectorOpen(false);
  };

  const onOptionSelect = (e: any, selection: any, isPlaceholder: any) => {
    if (isPlaceholder) {
      clearOptionSelection();
    } else {
      setSelectedOptionName(selection);
      setOptionSelectorOpen(false);
      props.topicGroupOptionNameChanged(props.rowId, getGroupOptionPropName(selection));
      // init to default value
      props.topicGroupOptionValueChanged(props.rowId, getGroupOptionPropDefaultValue(selection));
    }
  };

  const onOptionValueToggle = (open: boolean) => {
    setOptionValueSelectorOpen(open);
  };

  const onOptionValueSelect = (e: any, selection: any, isPlaceholder: any) => {
    setOptionValueSelectorOpen(false);
    props.topicGroupOptionValueChanged(props.rowId, selection);
  };

  const handleItemValueChange = (val: any) => {
    props.topicGroupOptionValueChanged(props.rowId, val);
  }

  const handleRemoveItemClick = () => {
    props.deleteTopicGroupOptionItem(props.rowId);
  }

  const handleKeyPress = (keyEvent: KeyboardEvent) => {
    // do not allow entry of '.'
    if (keyEvent.key === ".") {
      keyEvent.preventDefault();
    }
  };

  return (
    <Grid>
      <GridItem span={8}>
        <Flex className={"topic-group-option-item-name"}>
          <FlexItem className={"topic-group-option-item-name-input"}>
            <Select
              variant={SelectVariant.single}
              aria-label="Select topic group option"
              isDisabled={false}
              onToggle={onOptionToggle}
              onSelect={onOptionSelect}
              selections={selectedOptionName}
              isOpen={isOptionSelectorOpen}
              placeholderText="Select an option"
            >
              {getTopicGroupSelectOptions()}
          </Select>
          </FlexItem>
        </Flex>
      </GridItem>
      <GridItem span={3}>
        <Flex>
          <FlexItem className={"topic-group-option-item-value-input"}>
            {props.itemName && (props.itemName === 'cleanup_policy' || props.itemName === 'compression_type')
            ?
            <Select
              id={`${props.rowId}value`}
              variant={SelectVariant.single}
              placeholderText="Select value"
              aria-label="Select Value"
              onToggle={onOptionValueToggle}
              onSelect={onOptionValueSelect}
              selections={props.itemValue}
              isOpen={isOptionValueSelectorOpen}
            >
              {getValueSelectOptions(props.itemName)}
            </Select>
            :
            <TextInput
              id={`${props.rowId}value`}
              type={"number"}
              min={-1}
              onChange={handleItemValueChange}
              value={props.itemValue}
              onKeyPress={(event) => handleKeyPress(event as any)}
            />
            }
          </FlexItem>
        </Flex>
      </GridItem>
      <GridItem span={1}>
        <Flex>
          <FlexItem>
            <Button variant="link" icon={<TrashIcon />} onClick={handleRemoveItemClick} id='tooltip-selector' />
          </FlexItem>
        </Flex>
      </GridItem>
    </Grid>
  );
};
