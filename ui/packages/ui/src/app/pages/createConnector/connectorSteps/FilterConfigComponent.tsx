import { DataCollection, FilterValidationResult } from "@debezium/ui-models";
import { Services } from "@debezium/ui-services";
import {
  ActionGroup,
  Alert,
  Button,
  Divider,
  Form,
  Spinner,
  Text,
  TextVariants,
  Title,
} from "@patternfly/react-core";
import _ from "lodash";
import React, { SetStateAction } from "react";
import { useTranslation } from "react-i18next";
import { FilterTreeComponent } from "src/app/components";
import { FilterExcludeFieldComponent } from "src/app/components/FilterExcludeFieldComponent";
import { FilterInputFieldComponent } from "src/app/components/FilterInputFieldComponent";
import {
  ConfirmationButtonStyle,
  ConfirmationDialog,
  fetch_retry,
  getFilterConfigurationPageContent,
  mapToObject,
} from "src/app/shared";
import "./FilterConfigComponent.css";

export interface IFilterConfigComponentProps {
  propertyValues: Map<string, string>;
  filterValues: Map<string, string>;
  connectorType: string;
  updateFilterValues: (data: Map<string, string>) => void;
  setIsValidFilter: (val: SetStateAction<boolean>) => void;
  selectedConnectorType: string;
}

const formatResponseData = (data: DataCollection[]) => {
  return data.reduce((acc: any, next) => {
    const inx = _.findIndex(acc, { name: next.namespace, id: next.namespace });
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

export const FilterConfigComponent: React.FunctionComponent<IFilterConfigComponentProps> = (
  props
) => {
  const { t } = useTranslation(["app"]);
  const [formData, setFormData] = React.useState<Map<string, string>>(
    new Map()
  );
  const [treeData, setTreeData] = React.useState<any[]>([]);
  const [invalidMsg, setInvalidMsg] = React.useState<Map<string, string>>(
    new Map()
  );
  const [childNo, setChildNo] = React.useState<number>(0);
  const [showClearDialog, setShowClearDialog] = React.useState<boolean>(false);

  const [loading, setLoading] = React.useState(true);
  const [apiError, setApiError] = React.useState<boolean>(false);
  const [errorMsg, setErrorMsg] = React.useState<Error>(new Error());

  const connectorService = Services.getConnectorService();

  const applyFilter = () => {
    getFilterSchema(true);
  };

  const clearFilter = () => {
    setShowClearDialog(true);
  };

  const getFilterSchema = (
    saveFilter: boolean,
    filterExpression: Map<string, string> = formData
  ) => {
    fetch_retry(connectorService.validateFilters, connectorService, [
      props.connectorType,
      mapToObject(new Map([...props.propertyValues, ...filterExpression])),
    ])
      .then((result: FilterValidationResult) => {
        if (result.status === "INVALID") {
          const errorMap = new Map();
          for (const e of result.propertyValidationResults) {
            errorMap.set(e.property, e.message);
          }
          setInvalidMsg(errorMap);
          props.setIsValidFilter(false);
          setTreeData([]);
          setChildNo(result.matchedCollections.length);
        } else {
          // tslint:disable-next-line: no-unused-expression
          saveFilter && props.updateFilterValues(filterExpression);
          props.setIsValidFilter(true);
          setInvalidMsg(new Map());
          setChildNo(result.matchedCollections.length);
          setTreeData(formatResponseData(result.matchedCollections));
        }
        setLoading(false);
      })
      .catch((err: React.SetStateAction<Error>) => {
        setApiError(true);
        setErrorMsg(err);
      });
  };

  const doCancel = () => {
    setShowClearDialog(false);
  };

  const doClear = () => {
    props.setIsValidFilter(true);
    setFormData(new Map());
    getFilterSchema(true, new Map());
    setShowClearDialog(false);
  };

  React.useEffect(() => {
    getFilterSchema(false, props.filterValues);
  }, []);

  React.useEffect(() => {
    if (formData.size === 0) {
      props.setIsValidFilter(true);
    } else {
      props.setIsValidFilter(false);
    }
  }, [formData]);

  const filterConfigurationPageContentObj: any = getFilterConfigurationPageContent(
    props.selectedConnectorType || ""
  );

  return (
    <>
      <Title headingLevel="h2" size="3xl">
        {t("filterConfiguration")}
      </Title>
      <Text component={TextVariants.h2}>
        {t("filterPageHeadingText", {
          parent: filterConfigurationPageContentObj.fieldArray[0].field,
          child: filterConfigurationPageContentObj.fieldArray[1].field,
        })}
      </Text>
      <Form className="child-selection-step_form">
        {filterConfigurationPageContentObj.fieldArray.map(
          (fieldFilter: any) => (
            fieldFilter.excludeFilter ? (<FilterExcludeFieldComponent
              key={fieldFilter.field}
              fieldName={fieldFilter.field}
              filterValues={props.filterValues}
              setFormData={setFormData}
              formData={formData}
              invalidMsg={invalidMsg}
              fieldExcludeList={`${fieldFilter.field}.exclude.list`}
              fieldPlaceholder={fieldFilter.valueSample}
              i18nFilterExcludeFieldLabel={t("filterExcludeFieldLabel", {
                field: _.capitalize(fieldFilter.field),
              })}
              i18nFilterFieldInfoMsg={t("filterFieldInfoMsg", {
                field: `${fieldFilter.field} exclude`,
                sampleVal: fieldFilter.valueSample
              })}
            />) : (<FilterInputFieldComponent
              key={fieldFilter.field}
              fieldName={fieldFilter.field}
              filterValues={props.filterValues}
              setFormData={setFormData}
              formData={formData}
              invalidMsg={invalidMsg}
              fieldExcludeList={`${fieldFilter.field}.exclude.list`}
              fieldIncludeList={`${fieldFilter.field}.include.list`}
              fieldPlaceholder={fieldFilter.valueSample}
              i18nFilterFieldLabel={t("filterFieldLabel", {
                field: _.capitalize(fieldFilter.field),
              })}
              i18nFilterFieldHelperText={t("filterFieldHelperText", {
                field: fieldFilter.field,
              })}
              i18nInclude={t("include")}
              i18nExclude={t("exclude")}
              i18nFilterFieldInfoMsg={t("filterFieldInfoMsg", {
                field: fieldFilter.field,
                sampleVal: fieldFilter.valueSample
              })}
            />)
          )
        )}
        <ActionGroup>
          <Button variant="secondary" onClick={applyFilter}>
            {t("apply")}
          </Button>
          <Button variant="link" isInline={true} onClick={clearFilter}>
            {t("clearFilters")}
          </Button>
        </ActionGroup>
      </Form>
      <Divider />
      {!apiError &&
        (loading ? (
          <Spinner />
        ) : invalidMsg?.size !== 0 ? (
          <Alert
            variant={"danger"}
            isInline={true}
            title={t("invalidFilterText", {
              name: filterConfigurationPageContentObj.fieldArray[1].field,
            })}
          />
        ) : props.filterValues.size !== 0 ? (
          <Alert
            variant={childNo !== 0 ? "info" : "warning"}
            isInline={true}
            title={
              childNo !== 0
                ? `${childNo} ${t("matchingFilterExpMsg", {
                    name: filterConfigurationPageContentObj.fieldArray[1].field,
                  })}`
                : `${t("noMatchingFilterExpMsg", {
                    name: filterConfigurationPageContentObj.fieldArray[1].field,
                  })}`
            }
          >
            <p>
              {t("clearFilterText", {
                parent: filterConfigurationPageContentObj.fieldArray[0].field,
                child: filterConfigurationPageContentObj.fieldArray[1].field,
              }) + " "}
              <a onClick={clearFilter}>{t("clearFilters")}</a>
            </p>
          </Alert>
        ) : (
          <Alert
            variant="info"
            isInline={true}
            title={`${childNo} ${t("filterExpressionResultText", {
              name: filterConfigurationPageContentObj.fieldArray[1].field,
            })}`}
          />
        ))}

      <FilterTreeComponent
        treeData={treeData}
        loading={loading}
        apiError={apiError}
        errorMsg={errorMsg}
        invalidMsg={invalidMsg}
        i18nNoMatchingTables={t("noMatchingTables", {
          name: filterConfigurationPageContentObj.fieldArray[1].field,
        })}
        i18nNoMatchingFilterExpMsg={t("noMatchingFilterExpMsg", {
          name: filterConfigurationPageContentObj.fieldArray[1].field,
        })}
        i18nInvalidFilters={t("invalidFilters")}
        i18nInvalidFilterExpText={t("invalidFilterExpText", {
          name: filterConfigurationPageContentObj.fieldArray[1].field,
        })}
      />
      <ConfirmationDialog
        buttonStyle={ConfirmationButtonStyle.NORMAL}
        i18nCancelButtonText={t("cancel")}
        i18nConfirmButtonText={t("clear")}
        i18nConfirmationMessage={t("clearFilterConfMsg")}
        i18nTitle={t("clearFilters")}
        showDialog={showClearDialog}
        onCancel={doCancel}
        onConfirm={doClear}
      />
    </>
  );
};
