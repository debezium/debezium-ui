import { AppLayoutContext } from "@app/AppLayout";
import { Services } from "@app/apis/services";
import {
  FilterExplicitFields,
  FilterTreeComponent,
  FormInputComponent,
} from "@app/components";
import { FormStep } from "@app/constants";
import { getConnectorClass } from "@app/utils";
import {
  Button,
  Divider,
  Form,
  Toolbar,
  ToolbarContent,
  ToolbarItem,
} from "@patternfly/react-core";
import { cloneDeep, filter, findIndex } from "lodash";
import React, { useCallback, useEffect, useState } from "react";

interface FilterStepProps {
  filterProperties: ConnectorProperties[];
  requiredList: string[] | null | undefined;
  formData: Record<string, any>;
  updateFormData: (key: string, value: any, formStep: FormStep) => void;
  connectionFormData: Record<string, any>;
  connectorPlugin: string;
  filterDatabase: () => Promise<void>;
  clearFilterFormData: () => void;
  deleteFilterExplicitProperty: (
    removeFilterProperty: string,
    addFilterProperty: string,
    value: string
  ) => void;
}

export const FilterStep: React.FC<FilterStepProps> = ({
  filterProperties,
  requiredList,
  updateFormData,
  formData,
  filterDatabase,
  clearFilterFormData,
  deleteFilterExplicitProperty,
  connectionFormData,
  connectorPlugin,
}) => {
  const [treeData, setTreeData] = useState([]);
  const [invalidMsg, setInvalidMsg] = React.useState<Map<string, string>>(
    new Map()
  );
  const [isLoading, setIsLoading] = useState(false);
  const explicitFields: ConnectorProperties[] = [];
  const filterFields: ConnectorProperties[] = [];
  filterProperties.forEach((property) => {
    if (
      property["x-name"].includes("include.list") ||
      property["x-name"].includes("exclude.list")
    ) {
      explicitFields.push(property);
    } else {
      filterFields.push(property);
    }
  });

  useEffect(()=>{
    onFilter();
  },[])

  const explicitProperty: string[] = [];
  explicitFields.forEach((property) => {
    explicitProperty.indexOf(property["x-name"].split(".")[0]) === -1 &&
      explicitProperty.push(property["x-name"].split(".")[0]);
  });
  const appLayoutContext = React.useContext(AppLayoutContext);
  const connectorService = Services.getConnectorService();
  const { cluster: clusterUrl, addNewNotification } = appLayoutContext;

  const applyFilter = () =>{
    onFilter();
  }

  const clearFilter = () =>{
    onFilter(true);
    clearFilterFormData();

  }

  async function onFilter(isClear?:boolean) {
    let filterPayload = {...formData};
    if(isClear){
      filterPayload = {}
    }
    setIsLoading(true);
    connectorService
      .validateFilters(
        clusterUrl,
        {
          "connector.class": getConnectorClass(connectorPlugin),
          ...connectionFormData,
          ...filterPayload,
        },
        connectorPlugin
      )
      .then((filterResponse: any) => {
        if (filterResponse.status === "INVALID") {
          const errorMap = new Map();
          for (const e of filterResponse.validationResults) {
            errorMap.set(e.property, e.message);
          }
          setInvalidMsg(errorMap);
          // props.setIsValidFilter(false);
          setTreeData([]);
        } else {
          setInvalidMsg(new Map());
          setTreeData(formatResponseData(filterResponse.matchingCollections));
        }
      })
      .catch((err) => {
        addNewNotification("danger", "Something went wrong.", err.message);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }

  const formatResponseData = (data: DataCollection[]) => {
    return data.reduce((acc: any, next) => {
      const inx = findIndex(acc, { name: next.namespace, id: next.namespace });
      if (inx !== -1) {
        acc[inx].children.push({
          name: next.name,
          id: next.namespace + "_" + next.name,
        });
      } else {
        const newObj = {
          name: next.namespace,
          id: next.namespace,
          children: [
            {
              name: next.name,
              id: next.namespace + "_" + next.name,
            },
          ],
        };
        acc.push(newObj);
      }
      return acc;
    }, []);
  };

  return (
    <>
      <Form isWidthLimited>
        {explicitProperty.map((propertyField) => {
          return (
            <FilterExplicitFields
              key={propertyField}
              property={propertyField}
              hasBoth={
                filter(explicitFields, function (e) {
                  return (
                    e["x-name"] === `${propertyField}.include.list` ||
                    e["x-name"] === `${propertyField}.exclude.list`
                  );
                }).length === 2
                  ? true
                  : false
              }
              // explicitProperty={explicitFields}
              updateFormData={updateFormData}
              formData={formData}
              deleteFilterExplicitProperty={deleteFilterExplicitProperty}
            />
          );
        })}
        {filterFields.map((property) => {
          return (
            <FormInputComponent
              key={property["x-name"]}
              property={{
                ...cloneDeep(property),
                // "x-name": property["x-name"].replace(/\./g, "_"),
                "x-name": property["x-name"],
              }}
              requiredList={requiredList}
              formStep={FormStep.FILTER}
              updateFormData={updateFormData}
              formData={formData}
            />
          );
        })}
      </Form>

      <Toolbar id="filter-step-toolbar-items">
        <ToolbarContent>
          <ToolbarItem>
            <Button variant="secondary" onClick={applyFilter}>
              Apply filter
            </Button>
          </ToolbarItem>
          <ToolbarItem>
            <Button variant="tertiary" onClick={clearFilter}>
              Clear filters
            </Button>
          </ToolbarItem>
        </ToolbarContent>
      </Toolbar>
      <Divider style={{ paddingTop: "10px" }} />
      {
        isLoading ? <></> : <FilterTreeComponent
        treeData={treeData}
        invalidMsg={invalidMsg}
        filterValues={formData}
        clearFilter={clearFilter}
      />
      }
      
    </>
  );
};
