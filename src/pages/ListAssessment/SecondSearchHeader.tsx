import { Grid, Hidden, MenuItem, TextField } from "@material-ui/core";
import React, { ChangeEvent } from "react";
import { UseFormMethods } from "react-hook-form";
import { ExectSeachType } from "../../api/type";
import { AssessmentType, AssessmentTypeValues } from "../../components/AssessmentType";
import LayoutBox from "../../components/LayoutBox";
import { d } from "../../locale/LocaleManager";
import { ListSearch, SearchComProps } from "./ListSearch";
import { AssessmentQueryCondition, AssessmentQueryConditionBaseProps, SearchListForm } from "./types";
const searchFieldList = () => {
  return [
    { label: d("All").t("assess_search_all"), value: ExectSeachType.all },
    // { label: "CLass Name", value: ExectSeachType.class_name },
    { label: d("Teacher Name").t("schedule_label_teacher_name"), value: ExectSeachType.teacher_name },
  ];
};
export interface SecondSearchHeaderProps extends AssessmentQueryConditionBaseProps {
  onChangeAssessmentType: (assessment_type: string) => void;
  formMethods: UseFormMethods<SearchListForm>;
}
export function SecondSearchHeader(props: SecondSearchHeaderProps) {
  const { value, formMethods, onChange, onChangeAssessmentType } = props;
  const handleClickSearch = (
    searchField: SearchComProps["searchFieldDefaultValue"],
    searchText: SearchComProps["searchTextDefaultValue"]
  ) => {
    const query_key = searchText;
    const query_type = searchField as AssessmentQueryCondition["query_type"];
    onChange({ ...value, query_key, query_type, page: 1 });
  };
  const handleChangeAssessmentType = (assessment_type: string) => {
    const _assessment_type = assessment_type as AssessmentTypeValues;
    // onChange({ assessment_type: _assessment_type });
    onChangeAssessmentType(_assessment_type);
  };
  return (
    <div style={{ marginBottom: 20 }}>
      <LayoutBox holderMin={40} holderBase={202} mainBase={1517}>
        <Hidden only={["xs", "sm"]}>
          <Grid container spacing={3} style={{ marginTop: "6px" }}>
            <Grid item md={12} lg={12} xl={12}>
              <ListSearch
                searchTextDefaultValue={value.query_key ?? ""}
                searchFieldDefaultValue={value.query_type ?? ""}
                searchFieldList={searchFieldList()}
                onSearch={handleClickSearch}
                formMethods={formMethods}
              />
              <AssessmentType type={value.assessment_type as AssessmentTypeValues} onChangeAssessmentType={handleChangeAssessmentType} />
            </Grid>
          </Grid>
        </Hidden>
        <Hidden only={["md", "lg", "xl"]}>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={12}>
              <ListSearch
                searchTextDefaultValue={value.query_key ?? ""}
                searchFieldDefaultValue={value.query_type}
                searchFieldList={searchFieldList()}
                onSearch={handleClickSearch}
                formMethods={formMethods}
              />
            </Grid>
          </Grid>
        </Hidden>
      </LayoutBox>
    </div>
  );
}

export interface options {
  label?: string;
  value?: string;
}
export type DropdownListProps = {
  label?: string;
  value: string;
  list: options[];
  style?: Record<string, any>;
  onChange: (value: DropdownListProps["value"]) => void;
};
export function DropdownList(props: DropdownListProps) {
  const { label, value, list, style, onChange } = props;
  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    onChange(event.target.value);
  };
  return (
    <TextField
      style={{ ...style }}
      label={label}
      value={value}
      onChange={handleChange}
      size="small"
      select
      SelectProps={{ MenuProps: { transformOrigin: { vertical: -40, horizontal: "left" } } }}
    >
      {list.map((item) => (
        <MenuItem key={item.label} value={item.value}>
          {item.label}
        </MenuItem>
      ))}
    </TextField>
  );
}
