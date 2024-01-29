import { AppLayoutContext } from "@app/AppLayout";
import { Services } from "@app/apis/services";
import { TransformCard } from "@app/components/TransformCard";
import { mapToObject } from "@app/utils";
import {
  Button,
  EmptyState,
  EmptyStateActions,
  EmptyStateBody,
  EmptyStateFooter,
  EmptyStateHeader,
  EmptyStateIcon,
  EmptyStateVariant,
  Modal,
  ModalVariant,
} from "@patternfly/react-core";
import { CubesIcon, PlusCircleIcon } from "@patternfly/react-icons";
import _, { isEmpty } from "lodash";
import React, { useEffect } from "react";

export interface ITransformData {
  key: string;
  name?: string;
  type?: string;
  config?: any;
}
export interface ITransformStepProps {
  formData: Record<string, any>;
  updateFormData: (data: Record<string, any>) => void;
}

export const TransformsStep: React.FunctionComponent<ITransformStepProps> = ({
  formData,
  updateFormData,
}) => {
  const [transformList, setTransformList] = React.useState<TransformList[]>([]);

  const [transforms, setTransforms] = React.useState<
    Map<number, ITransformData>
  >(new Map<number, ITransformData>());

  const [isModalOpen, setIsModalOpen] = React.useState<boolean>(false);

  const addTransform = () => {
    const transformsCopy = new Map(transforms);
    transformsCopy.set(transformsCopy.size + 1, {
      key: self.crypto.randomUUID(),
      config: {},
    });
    setTransforms(transformsCopy);
  };

  const appLayoutContext = React.useContext(AppLayoutContext);
  const { cluster: clusterUrl, addNewNotification } = appLayoutContext;
  const connectorService = Services.getConnectorService();

  const deleteTransformCallback = React.useCallback(
    (order) => {
      const transformsCopy = new Map(transforms);
      transformsCopy.delete(order);
      const transformResult = new Map<number, any>();
      if (transforms.size > 1) {
        transformsCopy.forEach((value, key) => {
          if (key > order) {
            transformResult.set(+key - 1, value);
          } else if (key < order) {
            transformResult.set(+key, value);
          }
        });
        setTransforms(transformResult);
        saveTransform(transformResult);
      } else {
        setIsModalOpen(true);
      }
    },
    [transforms]
  );

  const clearTransform = () => {
    setTransforms(new Map());
    saveTransform(new Map());
    updateFormData({});
    handleModalToggle();
  };

  const moveTransformOrder = React.useCallback(
    (order, position) => {
      let i = 1;
      let j = transforms.size;
      const transformsCopy = new Map<number, ITransformData>(transforms);
      switch (position) {
        case "top":
          transformsCopy.set(1, transforms.get(order)!);

          while (i < order) {
            transformsCopy.set(i + 1, transforms.get(i)!);
            i++;
          }
          break;
        case "up":
          transformsCopy.set(order - 1, transforms.get(order)!);
          transformsCopy.set(order, transforms.get(order - 1)!);
          break;
        case "down":
          transformsCopy.set(order + 1, transforms.get(order)!);
          transformsCopy.set(order, transforms.get(order + 1)!);
          break;
        case "bottom":
          transformsCopy.set(transforms.size, transforms.get(order)!);

          while (j > order) {
            transformsCopy.set(j - 1, transforms.get(j)!);
            j--;
          }
          break;
        default:
          break;
      }
      setTransforms(transformsCopy);
      saveTransform(transformsCopy);
    },
    [transforms]
  );

  const getNameList = (): string[] => {
    const nameList: string[] = [];
    transforms.forEach((val) => {
      val.name && nameList.push(val.name);
    });
    return nameList;
  };

  const handleModalToggle = () => {
    setIsModalOpen(!isModalOpen);
  };

  const saveTransform = (data: Map<number, ITransformData>) => {
    const transformValues = new Map();
    data.forEach((val) => {
      if (val.name && val.type) {
        transformValues.has("transforms")
          ? transformValues.set(
              "transforms",
              transformValues.get("transforms") + "," + val.name
            )
          : transformValues.set("transforms", val.name);
        transformValues.set(`transforms.${val.name}.type`, val.type);
        for (const [key, value] of Object.entries(val.config)) {
          transformValues.set(`transforms.${val.name}.${key}`, value);
        }
      }
    });
    updateFormData(mapToObject(transformValues));
  };

  const updateTransformCallback = React.useCallback(
    (key: number, field: string, value: any) => {
      const transformsCopy = new Map(transforms);
      const transformCopy = transforms.get(key);
      if (field === "name" || field === "type") {
        transformCopy![field] = value;
        field === "type" && (transformCopy!.config = {});
        transformsCopy.set(key, transformCopy!);
      } else {
        transformCopy!.config = value;
        transformsCopy.set(key, transformCopy!);
      }
      !!transformCopy!.name &&
        !!transformCopy!.type &&
        saveTransform(transformsCopy);
      setTransforms(transformsCopy);
    },
    [transforms, saveTransform, setTransforms]
  );

  useEffect(() => {
    connectorService
      .getTransformsList(clusterUrl)
      .then((transformResponse: any) => {
        setTransformList(transformResponse);
      })
      .catch((err) => {
        addNewNotification("danger", "Something went wrong.", err.message);
      })
      .finally(() => {
        //   setIsLoading(false);
      });
  }, []);

  useEffect(() => {
    if (!isEmpty(formData)) {
      const transformsVal = new Map();
      const transformList = formData.transforms?.split(",");
      transformList.forEach((tName: string, index: number) => {
        const transformData: ITransformData = { key: self.crypto.randomUUID() };
        transformData.name = tName;
        transformData.type = formData[`transforms.${tName}.type`];
        transformData.config = {};
        for (const [key, value] of Object.entries(formData)) {
          if (key.includes(tName) && !key.includes("type")) {
            const fieldName = key.split(`transforms.${tName}.`)[1];
            transformData.config[fieldName] = value;
          }
        }
        transformsVal.set(index + 1, transformData);
      });
      setTransforms(transformsVal);
    }
  }, []);

  const getUniqueTransforms = React.useCallback(() => {
    let uniqueTransformListArray: any[] = [];

    if (transformList && transformList.length !== 0) {
      const uniqueTransforms = new Set<string>();
      uniqueTransformListArray = transformList.filter((tList) => {
        if (uniqueTransforms.has(tList.transform)) {
          return false; // Skip duplicates
        }
        uniqueTransforms.add(tList.transform);
        return true;
      });
    }

    const transformedList = uniqueTransformListArray.map((data, index) => {
      return {
        value: data.transform,
        children: data.properties,
      };
    });
    return transformedList;
  }, [transformList]);

  return (
    <div>
      {transforms.size === 0 ? (
        <EmptyState variant={EmptyStateVariant.sm}>
          <EmptyStateHeader
            titleText="No transformation defined"
            headingLevel="h4"
            icon={<EmptyStateIcon icon={CubesIcon} />}
          />
          <EmptyStateBody>
            Transformation enable single message at a time modification. See
            <a
              href="https://debezium.io/documentation/reference/nightly/transformations/index.html"
              target="_blank"
              rel="noreferrer"
            >
              {" "}
              documentation{" "}
            </a>
            here for more details.
          </EmptyStateBody>
          <EmptyStateFooter>
            <EmptyStateActions>
              <Button
                variant="secondary"
                className="pf-u-mt-lg"
                icon={<PlusCircleIcon />}
                onClick={addTransform}
              >
                Add transformation
              </Button>
            </EmptyStateActions>
          </EmptyStateFooter>
        </EmptyState>
      ) : (
        <>
          {/* <Alert
            variant="info"
            isInline={true}
            title={<p> Transformation enable single message at a time modification. See
              <a href="https://debezium.io/documentation/reference/nightly/transformations/index.html" target="_blank"> documentation </a>
               here for more details. Transforms are applied in the order they are listed.</p>}
          /> */}
          {/* <Grid>
            <GridItem span={10}> */}
          {Array.from(transforms.keys()).map((key, index) => {
            return (
              <TransformCard
                key={transforms.get(key)?.key}
                transformNo={key}
                transformName={transforms.get(key)?.name || ""}
                transformType={transforms.get(key)?.type || ""}
                transformConfig={transforms.get(key)?.config || {}}
                transformNameList={getNameList()}
                transformsOptions={getUniqueTransforms()}
                deleteTransform={deleteTransformCallback}
                updateTransform={updateTransformCallback}
                isTop={key === 1}
                isBottom={key === transforms.size}
                moveTransformOrder={moveTransformOrder}
              />
            );
          })}
          {/* </GridItem>
          </Grid> */}
          {/* <Button
            variant="secondary"
            className="pf-u-mt-lg pf-u-mr-sm"
            onClick={saveTransforms}
          >
            Apply
          </Button> */}
          <Button
            variant="secondary"
            className="pf-u-mt-lg"
            icon={<PlusCircleIcon />}
            onClick={addTransform}
          >
            Add transform
          </Button>
        </>
      )}
      <Modal
        variant={ModalVariant.small}
        title={"Delete transform?"}
        isOpen={isModalOpen}
        onClose={handleModalToggle}
        actions={[
          <Button key="confirm" variant="primary" onClick={clearTransform}>
            confirm
          </Button>,
          <Button key="cancel" variant="link" onClick={handleModalToggle}>
            cancel
          </Button>,
        ]}
      >
        Delete transform
      </Modal>
    </div>
  );
};
