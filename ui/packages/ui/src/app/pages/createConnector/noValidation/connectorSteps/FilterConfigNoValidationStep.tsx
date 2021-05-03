import {
  ActionGroup,
  Button,
  Divider,
  Form,
  Text,
  TextVariants,
  Title,
} from "@patternfly/react-core";
import _ from "lodash";
import React, { SetStateAction } from "react";
import { useTranslation } from "react-i18next";
import { FilterExcludeFieldComponent } from "src/app/components/FilterExcludeFieldComponent";
import { FilterInputFieldComponent } from "src/app/components/FilterInputFieldComponent";
import { NoPreviewFilterField } from "src/app/components/NoPreviewFilterField";
import {
  ConfirmationButtonStyle,
  ConfirmationDialog,
  getFilterConfigurationPageContent,
} from "src/app/shared";
import "./FilterConfigNoValidationStep.css";

export interface IFilterConfigNoValidationStepProps {
  filterValues: Map<string, unknown>;
  connectorType: string;
  updateFilterValues: (data: Map<string, string>) => void;
  setIsValidFilter: (val: SetStateAction<boolean>) => void;
  selectedConnectorType: string;
}

export const FilterConfigNoValidationStep: React.FunctionComponent<IFilterConfigNoValidationStepProps> = (
  props
) => {
  const { t } = useTranslation(["app"]);
  const [formData, setFormData] = React.useState<Map<string, string>>(
    new Map()
  );
  const [invalidMsg, setInvalidMsg] = React.useState<Map<string, string>>(
    new Map()
  );
  const [showClearDialog, setShowClearDialog] = React.useState<boolean>(false);

  const applyFilter = () => {
    props.updateFilterValues(formData);
    props.setIsValidFilter(true);
  };

  const clearFilter = () => {
    setShowClearDialog(true);
  };

  const doCancel = () => {
    setShowClearDialog(false);
  };

  const doClear = () => {
    props.setIsValidFilter(true);
    setFormData(new Map());
    setShowClearDialog(false);
  };

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
        {filterConfigurationPageContentObj.fieldArray.map((fieldFilter: any) =>
          fieldFilter.preview ? (
            <FilterInputFieldComponent
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
                sampleVal: fieldFilter.valueSample,
              })}
            />
          ) : (
            <NoPreviewFilterField
              key={fieldFilter.field}
              i18nShowFilter={t("showFilter", { field: fieldFilter.field })}
              i18nHideFilter={t("hideFilter", { field: fieldFilter.field })}
            >
              {fieldFilter.excludeFilter ? (
                <FilterExcludeFieldComponent
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
                    sampleVal: fieldFilter.valueSample,
                  })}
                />
              ) : (
                <FilterInputFieldComponent
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
                    sampleVal: fieldFilter.valueSample,
                  })}
                />
              )}
            </NoPreviewFilterField>
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
