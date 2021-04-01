import { Button, Checkbox, Chip, FormControlLabel, makeStyles, TextField, Typography } from "@material-ui/core";
import { Search } from "@material-ui/icons";
import ClearIcon from "@material-ui/icons/Clear";
import clsx from "clsx";
import React from "react";
import { Controller, useForm } from "react-hook-form";
import { ApiOutcomeSetCreateView, ApiPullOutcomeSetResponse } from "../../api/api.auto";
import { d } from "../../locale/LocaleManager";
import { CheckboxGroup } from "../CheckboxGroup";
const useStyles = makeStyles((theme) => ({
  addSetsCon: {
    fontSize: 18,
    color: "#666666",
    lineHeight: "22px",
    marginBottom: 10,
  },
  searchTextCon: {
    width: 250,
  },
  searchBtn: {
    width: "111px",
    height: "40px",
    backgroundColor: "#0E78D5",
    marginLeft: "20px",
  },
  outcomeSetCon: {
    width: 250,
    maxHeight: 276,
    boxShadow: "0px 5px 5px -3px rgba(0,0,0,0.20), 0px 3px 14px 2px rgba(0,0,0,0.12), 0px 8px 10px 1px rgba(0,0,0,0.14)",
    borderRadius: "4px",
    boxSizing: "border-box",
    paddingTop: 5,
    background: "#fff",

    "& .MuiFormControlLabel-root": {
      marginTop: 10,
      fontSize: 16,
      lineHeight: "19px",
      marginLeft: 10,
    },
  },
  itemSet: {
    fontSize: 16,
    cursor: "pointer",
  },
  createCon: {
    color: "#0e78d5",
    marginBottom: 10,
    marginLeft: 10,
    marginTop: 10,
  },
  action: {
    textAlign: "right",
    borderTop: "1px solid #eeeeee",
    height: 56,
    lineHeight: "56px",
    "& .MuiButton-containedPrimary": {
      marginRight: 10,
    },
  },
  outComeSets: {
    width: "100%",
    maxHeight: 109,
  },
  chip: {
    borderRadius: "4px",
    fontSize: 16,
    margin: theme.spacing(0.5),
  },
  selectedSetsCon: {
    marginTop: 10,
    marginBottom: 10,
  },
  positionCss: {
    position: "absolute",
    top: 163,
  },
}));

export interface OutcomeSetProps {
  title: string;
  showChipList?: boolean;
  showSetList: boolean;
  onSearchOutcomeSet: (set_name: string) => any;
  onCreateOutcomeSet: (set_name: string) => any;
  onSetOutcomeSet: (ids: string[]) => any;
  selectedOutcomeSet: ApiOutcomeSetCreateView[];
  outcomeSetList: ApiPullOutcomeSetResponse["sets"];
  onDeleteSet: (set_id: string) => any;
}
export function OutcomeSet(props: OutcomeSetProps) {
  const css = useStyles();
  const {
    showChipList = false,
    showSetList,
    onSearchOutcomeSet,
    onCreateOutcomeSet,
    onSetOutcomeSet,
    selectedOutcomeSet,
    outcomeSetList,
    onDeleteSet,
    title,
  } = props;
  const formMethods = useForm();
  const { control, getValues, watch } = formMethods;
  const handleClickSearch = () => {
    const set_name = getValues()["OUTCOME_SET_NAME"];
    onSearchOutcomeSet(set_name);
  };
  const handleClickOk = () => {
    const ids = getValues()["outcomesets"];
    onSetOutcomeSet(ids);
  };
  const handleClickCreate = () => {
    const set_name = getValues()["OUTCOME_SET_NAME"];
    onCreateOutcomeSet(set_name);
  };
  const handleDelete = (set_id: string) => {
    onDeleteSet(set_id);
  };
  return (
    <>
      <div>
        <Typography className={css.addSetsCon}>{title}</Typography>
        <Controller
          className={css.searchTextCon}
          as={TextField}
          control={control}
          name={"OUTCOME_SET_NAME"}
          size="small"
          placeholder={d("Search").t("assess_label_search")}
          defaultValue={""}
        />
        <Button variant="contained" color="primary" className={css.searchBtn} onClick={handleClickSearch}>
          <Search /> {d("Search").t("assess_label_search")}
        </Button>
      </div>
      {showChipList && (
        <div className={css.selectedSetsCon}>
          {selectedOutcomeSet.map((item) => (
            <Chip key={item.set_id} deleteIcon={<ClearIcon />} label={item.set_name} className={css.chip} onDelete={handleDelete} />
          ))}
        </div>
      )}
      {showSetList && (
        <div className={clsx(css.outcomeSetCon, showChipList ? css.positionCss : "")}>
          <Controller
            name={"outcomesets"}
            control={control}
            defaultValue={[]}
            render={({ ref, ...props }) => (
              <CheckboxGroup
                {...props}
                render={(selecedOutcomesetsContext) => (
                  <div {...{ ref }} className={css.outComeSets}>
                    {outcomeSetList &&
                      outcomeSetList.map((item) => (
                        <FormControlLabel
                          style={{
                            display: "block",
                            background: selecedOutcomesetsContext.hashValue[item.set_id as string] ? "#ccc" : "",
                          }}
                          control={
                            <Checkbox
                              style={{ display: "none" }}
                              color="primary"
                              value={item.set_id}
                              checked={selecedOutcomesetsContext.hashValue[item.set_id as string] || false}
                              onChange={selecedOutcomesetsContext.registerChange}
                            />
                          }
                          label={item.set_name}
                          key={item.set_id}
                        />
                      ))}
                  </div>
                )}
              />
            )}
          />
          <div className={clsx(css.itemSet, css.createCon)} onClick={handleClickCreate}>
            {d("Create").t("assess_label_create")} "{watch("OUTCOME_SET_NAME")}"
          </div>
          <div className={css.action}>
            <Button color="primary" variant="contained" onClick={handleClickOk}>
              {d("OK").t("general_button_OK")}
            </Button>
          </div>
        </div>
      )}
    </>
  );
}
