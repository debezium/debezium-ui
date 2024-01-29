import {
  Button,
  Form,
  FormSection,
  Grid,
  GridItem,
} from "@patternfly/react-core";
import React, { useCallback, useEffect } from "react";
import topicCreationResponse from "../../assets/mockResponse/topicCreation.json";
import { cloneDeep, isEmpty } from "lodash";
import { FormInputComponent, TopicCreationGroup } from "@app/components";
import { FormStep } from "@app/constants";
import { PlusCircleIcon } from "@patternfly/react-icons";
import { mapToObject } from "@app/utils";

interface TopicCreationStepProps {
  formData: Record<string, any>;
  updateFormData: (data: Record<string, any>) => void;
}

export interface ITopicGroup {
  key: string;
  name?: string;
  include?: string;
  exclude?: string;
  overrideDefault?: any;
}

export const TopicCreationStep: React.FC<TopicCreationStepProps> = ({
  formData,
  updateFormData,
}) => {
  const [topicCreationDefaultData, setTopicCreationDefaultData] =
    React.useState<Record<string, any>>({});

  const [topicGroups, setTopicGroups] = React.useState<
    Map<number, ITopicGroup>
  >(new Map<number, ITopicGroup>());
  const [isModalOpen, setIsModalOpen] = React.useState<boolean>(false);

  const updateLocalFormData = useCallback(
    (key: string, value: any, formStep: FormStep) => {
      setTopicCreationDefaultData(
        cloneDeep({ ...topicCreationDefaultData, [key]: value })
      );
      updateFormData({
        ...formData,
        ...topicCreationDefaultData,
        [key]: value,
      });
    },
    [
      topicCreationDefaultData,
      setTopicCreationDefaultData,
      formData,
      updateFormData,
    ]
  );

  const addTopicGroup = () => {
    const topicGroupsCopy = new Map(topicGroups);
    topicGroupsCopy.set(topicGroupsCopy.size + 1, {
      key: self.crypto.randomUUID(),
      overrideDefault: {},
    });
    setTopicGroups(topicGroupsCopy);
  };

  const deleteTopicGroupCallback = React.useCallback(
    (order) => {
      const topicGroupsCopy = new Map(topicGroups);
      topicGroupsCopy.delete(order);
      const transformResult = new Map<number, any>();
      if (topicGroups.size > 1) {
        topicGroupsCopy.forEach((value, key) => {
          if (key > order) {
            transformResult.set(+key - 1, value);
          } else if (key < order) {
            transformResult.set(+key, value);
          }
        });
        setTopicGroups(transformResult);
        saveTopicGroup(transformResult);
      } else {
        setIsModalOpen(true);
      }
    },
    [topicGroups]
  );

  const clearTransform = () => {
    setTopicGroups(new Map());
    saveTopicGroup(new Map());
    updateFormData({});
    handleModalToggle();
  };

  const getNameList = (): string[] => {
    const nameList: string[] = [];
    topicGroups.forEach((val) => {
      val.name && nameList.push(val.name);
    });
    return nameList;
  };

  const handleModalToggle = () => {
    setIsModalOpen(!isModalOpen);
  };

  const saveTopicGroup = (data: Map<number, ITopicGroup>) => {
    const topicGroupValues = new Map();
    data.forEach((val) => {
      if (val.name) {
        topicGroupValues.has("topic.creation.groups")
          ? topicGroupValues.set(
              "topic.creation.groups",
              topicGroupValues.get("topic.creation.groups") + "," + val.name
            )
          : topicGroupValues.set("topic.creation.groups", val.name);
        val.include &&
          topicGroupValues.set(
            `topic.creation.${val.name}.include`,
            val.include
          );
        val.exclude &&
          topicGroupValues.set(
            `topic.creation.${val.name}.exclude`,
            val.exclude
          );
        for (const [key, value] of Object.entries(val.overrideDefault)) {
          topicGroupValues.set(`topic.creation.${val.name}.${key}`, value);
        }
      }
    });
    updateFormData({
      ...mapToObject(topicGroupValues),
      ...topicCreationDefaultData,
    });
  };

  const updateTopicGroupsCallback = React.useCallback(
    (key: number, field: string, value: any) => {
      const topicGroupsCopy = new Map(topicGroups);
      const topicGroupCopy = topicGroups.get(key);
      if (field === "name" || field === "include" || field === "exclude") {
        topicGroupCopy![field] = value;
        topicGroupsCopy.set(key, topicGroupCopy!);
      } else {
        topicGroupCopy!.overrideDefault = value;
        topicGroupsCopy.set(key, topicGroupCopy!);
      }
      !!topicGroupCopy!.name &&
        !!(topicGroupCopy!.include || topicGroupCopy!.exclude) &&
        saveTopicGroup(topicGroupsCopy);
      setTopicGroups(topicGroupsCopy);
    },
    [topicGroups, setTopicGroups]
  );

  useEffect(() => {
    const topicCreationDefaults: Record<string, string> = {};
    formData &&
      Object.keys(formData).forEach((key) => {
        if (key.includes("topic.creation.default")) {
          topicCreationDefaults[key] = formData[key];
        }
      });
    setTopicCreationDefaultData(topicCreationDefaults);
  }, []);

    useEffect(() => {
      if (!isEmpty(formData) && !!formData["topic.creation.groups"]) {
        const topicGroupsVal = new Map();
        const topicGroupList = formData["topic.creation.groups"]?.split(",");
        topicGroupList.forEach((tName: string, index: number) => {
          const topicGroupData: ITopicGroup = { key: self.crypto.randomUUID() };
          topicGroupData.name = tName;
          if(formData[`topic.creation.${tName}.include`])  topicGroupData.include = formData[`topic.creation.${tName}.include`];
          if(formData[`topic.creation.${tName}.exclude`])  topicGroupData.exclude = formData[`topic.creation.${tName}.exclude`];
 
          topicGroupData.overrideDefault = {};
        //   for (const [key, value] of Object.entries(formData)) {
        //     if (key.includes(tName) && !key.includes("type")) {
        //       const fieldName = key.split(`transforms.${tName}.`)[1];
        //       transformData.config[fieldName] = value;
        //     }
        //   }
        topicGroupsVal.set(index + 1, topicGroupData);
        });
        setTopicGroups(topicGroupsVal);
      }
    }, []);

  return (
    <>
      <Form isWidthLimited>
        <FormSection title="Topic creation defaults" titleElement="h4">
          <Grid hasGutter={true}>
            {topicCreationResponse.defaults.map((property) => {
              return (
                <GridItem key={property["x-name"]} span={6}>
                  <FormInputComponent
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
                  />
                </GridItem>
              );
            })}
          </Grid>
        </FormSection>
        <FormSection title="Topic groups" titleElement="h4">
          {topicGroups.size === 0 &&
            "No Topic group have been defined click on 'Add topic group' to add one."}
          {Array.from(topicGroups.keys()).map((key, index) => {
            return (
              <TopicCreationGroup
                key={topicGroups.get(key)?.key}
                topicGroupNo={key}
                topicGroupName={topicGroups.get(key)?.name || ""}
                topicGroupInclude={topicGroups.get(key)?.include || ""}
                topicGroupExclude={topicGroups.get(key)?.exclude || ""}
                topicGroupConfig={topicGroups.get(key)?.overrideDefault || {}}
                topicGroupNameList={getNameList()}
                deleteTransform={deleteTopicGroupCallback}
                updateTransform={updateTopicGroupsCallback}
              />
            );
          })}
          <Button
            variant="secondary"
            className="pf-u-mt-lg"
            icon={<PlusCircleIcon />}
            onClick={addTopicGroup}
            style={{ width: "200px" }}
          >
            Add topic group
          </Button>
        </FormSection>
      </Form>
    </>
  );
};
