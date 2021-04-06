import { Button, Checkbox, Chip, FormControlLabel, makeStyles, TextField, Typography } from "@material-ui/core";
import { Search } from "@material-ui/icons";
import ClearRoundedIcon from "@material-ui/icons/ClearRounded";
import clsx from "clsx";
import React, { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { ApiOutcomeSetCreateView, ApiPullOutcomeSetResponse } from "../../api/api.auto";
import { d } from "../../locale/LocaleManager";
import { CheckboxGroup } from "../CheckboxGroup";
import { LButton } from "../LButton";
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
    overflow: "hidden",
    wordBreak: "break-all",
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
    maxHeight: 145,
    overflowY: "scroll",
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
  defaultSelectOutcomeset?: string;
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
    defaultSelectOutcomeset,
  } = props;
  const formMethods = useForm();
  const { control, getValues, watch, setValue } = formMethods;
  const search_key = watch("OUTCOME_SET_NAME") ? watch("OUTCOME_SET_NAME").trim() : watch("OUTCOME_SET_NAME");
  const handleClickSearch = () => {
    onSearchOutcomeSet(search_key);
  };
  const handleClickOk = () => {
    const ids = getValues()["outcomesets"];
    onSetOutcomeSet(ids);
  };
  const handleClickCreate = () => {
    if (!search_key) return;
    return onCreateOutcomeSet(search_key);
  };
  const handleDelete = (set_id: string) => {
    onDeleteSet(set_id);
  };
  const showCreate = (search_key: string) => {
    if (outcomeSetList && outcomeSetList.length > 0 && search_key) {
      const index = outcomeSetList.findIndex((set) => set.set_name === search_key);
      if (index >= 0) {
        return false;
      } else {
        return true;
      }
    } else {
      return true;
    }
  };
  useEffect(() => {
    setValue("outcomesets", [defaultSelectOutcomeset]);
  }, [defaultSelectOutcomeset, setValue]);
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
          inputProps={{ maxLength: 36 }}
        />
        <Button variant="contained" color="primary" className={css.searchBtn} onClick={handleClickSearch}>
          <Search /> {d("Search").t("assess_label_search")}
        </Button>
      </div>
      {showChipList && (
        <div className={css.selectedSetsCon}>
          {selectedOutcomeSet.map((item) => (
            <Chip key={item.set_id} deleteIcon={<ClearRoundedIcon />} label={item.set_name} className={css.chip} onDelete={handleDelete} />
          ))}
        </div>
      )}
      {showSetList && (
        <div className={clsx(css.outcomeSetCon, showChipList ? css.positionCss : "")}>
          <Controller
            name={"outcomesets"}
            control={control}
            defaultValue={[defaultSelectOutcomeset]}
            render={({ ref, ...props }) => (
              <CheckboxGroup
                {...props}
                render={(selecedOutcomesetsContext) => (
                  <div {...{ ref }} className={css.outComeSets}>
                    {outcomeSetList &&
                      outcomeSetList.map((item, index) => (
                        <FormControlLabel
                          style={{
                            display: "block",
                            overflow: "hidden",
                            wordBreak: "break-all",
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
          {search_key && showCreate(search_key) && (
            <LButton className={clsx(css.itemSet, css.createCon)} onClick={handleClickCreate}>
              {d("Create").t("assess_label_create")} {`"${search_key}"`}
            </LButton>
          )}
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
