import { Checkbox, FormControlLabel, Grid, InputAdornment, Menu, MenuItem } from "@material-ui/core";
import Button from "@material-ui/core/Button";
import Hidden from "@material-ui/core/Hidden";
import { makeStyles } from "@material-ui/core/styles";
import TextField, { TextFieldProps } from "@material-ui/core/TextField/TextField";
import { Search } from "@material-ui/icons";
import LocalBarOutlinedIcon from "@material-ui/icons/LocalBarOutlined";
import produce from "immer";
import React, { ChangeEvent, MouseEventHandler, useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { Author, PublishStatus } from "../../api/type";
import LayoutBox from "../../components/LayoutBox";
import { Permission, PermissionType } from "../../components/Permission";
import { d } from "../../locale/LocaleManager";
import CreateOutcomings from "../OutcomeEdit";
import { OutcomeQueryConditionBaseProps } from "./types";

const SEARCH_TEXT_KEY = "SEARCH_TEXT_KEY";

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    marginBottom: "20px",
  },
  createBtn: {
    width: "125px",
    borderRadius: "23px",
    height: "48px",
    backgroundColor: "#0E78D5",
    textTransform: "capitalize",
  },
  nav: {
    cursor: "pointer",
    fontWeight: "bold",
    marginRight: "3px",
    textTransform: "capitalize",
  },
  searchBtn: {
    width: "111px",
    height: "40px",
    backgroundColor: "#0E78D5",
    marginLeft: "20px",
  },
  formControl: {
    minWidth: 136,
    marginLeft: "20px",
  },
  selectEmpty: {
    marginTop: theme.spacing(2),
  },
  switch: {
    display: "none",
    marginRight: "22px",
  },
  navigation: {
    padding: "20px 0px 10px 0px",
  },
  searchText: {
    width: "34%",
  },
  actives: {
    color: "#0E78D5",
  },
  tabMb: {
    textAlign: "right",
    position: "relative",
  },
  switchBtn: {
    width: "60px",
    height: "40px",
  },
  capitalize: {
    textTransform: "capitalize",
  },
  tabs: {
    minHeight: "42px",
    height: "42px",
  },
}));

export function SecondSearchHeaderMb(props: SecondSearchHeaderProps) {
  const classes = useStyles();
  const { value, onChange } = props;
  const { control, reset, getValues } = useForm();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const handleClickSearch = () => {
    const newValue = produce(value, (draft) => {
      const searchText = getValues()[SEARCH_TEXT_KEY];
      searchText ? (draft.search_key = searchText) : delete draft.search_key;
    });
    onChange({ ...newValue, page: 1 });
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const handleClickIconMyonly: MouseEventHandler<SVGSVGElement & HTMLElement> = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleItemClick = (event: any) => {
    setAnchorEl(null);
    const author_name = value.author_name === Author.self ? undefined : Author.self;
    onChange({ ...value, author_name });
  };
  useEffect(() => {
    reset();
  }, [value.search_key, reset]);
  return (
    <div className={classes.root}>
      <LayoutBox holderMin={40} holderBase={202} mainBase={1517}>
        <Hidden only={["md", "lg", "xl"]}>
          <Grid container spacing={3}>
            <Grid item xs={8} sm={8}>
              <Permission value={PermissionType.create_learning_outcome__421}>
                <Button variant="contained" color="primary" className={classes.createBtn} href={`#${CreateOutcomings.routeBasePath}`}>
                  {d("Create").t("assess_label_create")} +
                </Button>
              </Permission>
            </Grid>
            <Grid container item xs={4} sm={4} justify="flex-end" alignItems="center" style={{ fontSize: "24px" }}>
              <LocalBarOutlinedIcon onClick={handleClickIconMyonly} />
              <Menu anchorEl={anchorEl} keepMounted open={Boolean(anchorEl)} onClose={handleClose}>
                <MenuItem selected={value.author_name === Author.self} onClick={handleItemClick}>
                  {d("My Only").t("assess_label_my_only")}
                </MenuItem>
              </Menu>
            </Grid>
            <Grid item xs={12} sm={12} style={{ textAlign: "center" }}>
              <Controller
                as={TextField}
                name={SEARCH_TEXT_KEY}
                control={control}
                style={{ width: "100%", height: "100%" }}
                onBlur={handleClickSearch}
                label={d("Search").t("assess_label_search")}
                variant="outlined"
                size="small"
                defaultValue={value.search_key || ""}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Search style={{ cursor: "pointer" }} onClick={handleClickSearch} />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
          </Grid>
        </Hidden>
      </LayoutBox>
    </div>
  );
}

export interface SecondSearchHeaderProps extends OutcomeQueryConditionBaseProps {}
export function SecondSearchHeader(props: SecondSearchHeaderProps) {
  const classes = useStyles();
  const { value, onChange } = props;
  const { control, reset, getValues } = useForm();
  const handleClickSearch = () => {
    const newValue = produce(value, (draft) => {
      const searchText = getValues()[SEARCH_TEXT_KEY];
      searchText ? (draft.search_key = searchText) : delete draft.search_key;
    });
    onChange({ ...newValue, page: 1 });
  };

  const handleChangeMyonly = (event: ChangeEvent<HTMLInputElement>) => {
    const author = event.target.checked ? Author.self : null;
    onChange(
      produce(value, (draft) => {
        author ? (draft.author_name = author) : delete draft.author_name;
      })
    );
  };
  const handleKeyPress: TextFieldProps["onKeyPress"] = (event) => {
    if (event.key === "Enter") handleClickSearch();
  };
  useEffect(() => {
    reset();
  }, [value.search_key, reset]);
  return (
    <div className={classes.root}>
      <LayoutBox holderMin={40} holderBase={202} mainBase={1517}>
        <Hidden only={["xs", "sm"]}>
          <Grid container spacing={3} style={{ marginTop: "6px" }}>
            <Grid item md={10} lg={8} xl={8}>
              <Controller
                as={TextField}
                name={SEARCH_TEXT_KEY}
                control={control}
                size="small"
                className={classes.searchText}
                onKeyPress={handleKeyPress}
                defaultValue={value.search_key || ""}
                placeholder={d("Search").t("assess_label_search")}
              />
              <Button variant="contained" color="primary" className={classes.searchBtn} onClick={handleClickSearch}>
                <Search /> {d("Search").t("assess_label_search")}
              </Button>
            </Grid>
            <Grid container direction="row" justify="flex-end" alignItems="center" item md={2} lg={4} xl={4}>
              {value.publish_status !== PublishStatus.pending ? (
                <FormControlLabel
                  value="end"
                  control={<Checkbox color="primary" checked={value.author_name === Author.self} onChange={handleChangeMyonly} />}
                  label={d("My Only").t("assess_label_my_only")}
                  labelPlacement="end"
                />
              ) : (
                ""
              )}
            </Grid>
          </Grid>
        </Hidden>
      </LayoutBox>
    </div>
  );
}
