import { Checkbox, FormControlLabel, Grid, Menu, MenuItem } from "@material-ui/core";
import Button from "@material-ui/core/Button";
import Hidden from "@material-ui/core/Hidden";
import { makeStyles } from "@material-ui/core/styles";
import TextField, { TextFieldProps } from "@material-ui/core/TextField/TextField";
import { Search } from "@material-ui/icons";
import LocalBarOutlinedIcon from "@material-ui/icons/LocalBarOutlined";
import produce from "immer";
import React, { ChangeEvent, MouseEventHandler, useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { Author, PublishStatus, SearchContentsRequestContentType } from "../../api/type";
import LayoutBox from "../../components/LayoutBox";
import { PermissionOr, PermissionType } from "../../components/Permission";
import { d } from "../../locale/LocaleManager";
import { QueryCondition, QueryConditionBaseProps } from "./types";

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
    // width: "98px",
    height: "40px",
    backgroundColor: "#0E78D5",
    marginLeft: "20px",
    marginTop: "-4px",
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
    // width: "34%",
    "& .MuiOutlinedInput-notchedOutline": {
      border: 0,
      borderRadius: 0,
    },
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
  exectSearchInput: {
    width: 90,
    marignRgiht: -10,
    height: 40,
    boxSizing: "border-box",
    background: "#F0F0F0",
    "& .MuiOutlinedInput-notchedOutline": {
      border: 0,
    },
  },
  searchCon: {
    display: "inline-flex",
    border: "1px solid rgba(0,0,0,0.23)",
    borderRadius: 4,
    boxSizing: "border-box",
  },
}));

//todo接口
export interface options {
  label?: string;
  value?: string;
}
export const filterOptions = (value: QueryCondition) => {
  if (value.publish_status === PublishStatus.published) {
    return [
      { label: d("All").t("report_label_all"), value: SearchContentsRequestContentType.materialandplan },
      { label: d("Folder").t("library_label_folder"), value: SearchContentsRequestContentType.folder },
      { label: d("Lesson Plan").t("library_label_lesson_plan"), value: SearchContentsRequestContentType.plan },
      { label: d("Lesson Material").t("library_label_lesson_material"), value: SearchContentsRequestContentType.material },
    ];
  } else {
    return [
      { label: d("All").t("report_label_all"), value: SearchContentsRequestContentType.materialandplan },
      { label: d("Lesson Plan").t("library_label_lesson_plan"), value: SearchContentsRequestContentType.plan },
      { label: d("Lesson Material").t("library_label_lesson_material"), value: SearchContentsRequestContentType.material },
    ];
  }
};
const menuItemList = (list: options[]) =>
  list.map((item) => (
    <MenuItem key={item.label} value={item.value}>
      {item.label}
    </MenuItem>
  ));

export enum ExectSearch {
  all = "{all}",
  name = "name",
}
const getExectSearch = () => {
  return [
    { label: "All", value: "{all}" },
    { label: "Name", value: "name" },
  ];
};
export function SecondSearchHeaderMb(props: SecondSearchHeaderProps) {
  const classes = useStyles();
  const { exectSearch, value, onChange, onCreateContent, onChangeExectSearchCondition } = props;
  const { control, reset, getValues } = useForm();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const handleClickSearch = () => {
    const newValue = produce(value, (draft) => {
      const searchText = getValues()[SEARCH_TEXT_KEY];
      searchText ? (draft.name = searchText) : delete draft.name;
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
    const author = value.author === Author.self ? undefined : Author.self;
    onChange(
      produce(value, (draft) => {
        author ? (draft.author = author) : delete draft.author;
      })
    );
  };
  const handleChangeSearch = (event: ChangeEvent<HTMLInputElement>) => {
    // const newValue = produce(value, (draft) => {
    //   const content_name = event.target.value;
    //   draft.content_name = content_name;
    // })
    // onChange({ ...newValue });
    onChangeExectSearchCondition(event.target.value);
  };
  useEffect(() => {
    reset();
  }, [value.name, reset]);
  return (
    <div className={classes.root}>
      <LayoutBox holderMin={40} holderBase={202} mainBase={1517}>
        <Hidden only={["md", "lg", "xl"]}>
          <Grid container spacing={3}>
            <Grid item xs={8} sm={8}>
              <PermissionOr
                value={[
                  PermissionType.create_content_page_201,
                  PermissionType.create_lesson_material_220,
                  PermissionType.create_lesson_plan_221,
                ]}
              >
                <Button variant="contained" color="primary" className={classes.createBtn} onClick={onCreateContent}>
                  {d("Create").t("library_label_create")} +
                </Button>
              </PermissionOr>
            </Grid>
            <Grid container item xs={4} sm={4} justify="flex-end" alignItems="center" style={{ fontSize: "24px" }}>
              {value.publish_status === PublishStatus.published ||
              value.content_type === SearchContentsRequestContentType.assetsandfolder ? (
                <LocalBarOutlinedIcon onClick={handleClickIconMyonly} />
              ) : (
                ""
              )}
              <Menu anchorEl={anchorEl} keepMounted open={Boolean(anchorEl)} onClose={handleClose}>
                <MenuItem selected={value.author === Author.self} onClick={handleItemClick}>
                  {d("My Only").t("library_label_my_only")}
                </MenuItem>
              </Menu>
            </Grid>
            <Grid item xs={12} sm={12} style={{ textAlign: "center", padding: 0 }}>
              {/* <Controller
                as={TextField}
                name={SEARCH_TEXT_KEY}
                control={control}
                style={{ width: "100%", height: "100%" }}
                label={d("Search").t("library_label_search")}
                variant="outlined"
                size="small"
                defaultValue={value.name || ""}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Search style={{ cursor: "pointer" }} onClick={handleClickSearch} />
                    </InputAdornment>
                  ),
                }}
              /> */}
              <div className={classes.searchCon}>
                <TextField
                  className={classes.exectSearchInput}
                  size="small"
                  onChange={handleChangeSearch}
                  // label={d("Content Type").t("library")}
                  value={exectSearch}
                  select
                  SelectProps={{ MenuProps: { transformOrigin: { vertical: -40, horizontal: "left" } } }}
                >
                  {menuItemList(getExectSearch())}
                </TextField>
                <Controller
                  style={{ borderLeft: 0 }}
                  as={TextField}
                  name={SEARCH_TEXT_KEY}
                  control={control}
                  size="small"
                  className={classes.searchText}
                  placeholder={d("Search").t("library_label_search")}
                  defaultValue={value.name || ""}
                />
              </div>
              <Button variant="contained" color="primary" className={classes.searchBtn} onClick={handleClickSearch}>
                <Search /> {d("Search").t("library_label_search")}
              </Button>
            </Grid>
          </Grid>
        </Hidden>
      </LayoutBox>
    </div>
  );
}

export interface SecondSearchHeaderProps extends QueryConditionBaseProps {
  exectSearch: string;
  onCreateContent: () => any;
  onChangeExectSearchCondition: (exectSearch: string) => any;
}
export function SecondSearchHeader(props: SecondSearchHeaderProps) {
  const classes = useStyles();
  const { control, reset, getValues } = useForm();
  const { exectSearch, value, onChange, onChangeExectSearchCondition } = props;
  const handleClickSearch = () => {
    const newValue = produce(value, (draft) => {
      const searchText = getValues()[SEARCH_TEXT_KEY];
      searchText ? (draft.name = searchText) : delete draft.name;
    });
    onChange({ ...newValue, page: 1 });
  };

  const handleChangeMyonly = (event: ChangeEvent<HTMLInputElement>) => {
    const author = event.target.checked ? Author.self : null;
    onChange(
      produce(value, (draft) => {
        author ? (draft.author = author) : delete draft.author;
      })
    );
  };
  const handleKeyPress: TextFieldProps["onKeyPress"] = (event) => {
    if (event.key === "Enter") handleClickSearch();
  };
  const handleChangeFilterOption = (event: ChangeEvent<HTMLInputElement>) => {
    const newValue = produce(value, (draft) => {
      const content_type = event.target.value;
      draft.content_type = content_type;
    });
    onChange({ ...newValue });
  };
  const handleChangeSearch = (event: ChangeEvent<HTMLInputElement>) => {
    // const newValue = produce(value, (draft) => {
    //   const content_name = event.target.value;
    //   draft.content_name = content_name;
    // })
    // onChange({ ...newValue });
    onChangeExectSearchCondition(event.target.value);
  };
  useEffect(() => {
    reset();
  }, [value.name, reset]);
  return (
    <div className={classes.root}>
      <LayoutBox holderMin={40} holderBase={202} mainBase={1517}>
        <Hidden only={["xs", "sm"]}>
          <Grid container spacing={3} style={{ marginTop: "6px" }}>
            <Grid item md={10} lg={8} xl={8}>
              <div className={classes.searchCon}>
                <TextField
                  className={classes.exectSearchInput}
                  size="small"
                  onChange={handleChangeSearch}
                  // label={d("Content Type").t("library")}
                  value={exectSearch}
                  select
                  SelectProps={{ MenuProps: { transformOrigin: { vertical: -40, horizontal: "left" } } }}
                >
                  {menuItemList(getExectSearch())}
                </TextField>
                <Controller
                  style={{ borderLeft: 0 }}
                  as={TextField}
                  name={SEARCH_TEXT_KEY}
                  control={control}
                  size="small"
                  className={classes.searchText}
                  onKeyPress={handleKeyPress}
                  placeholder={d("Search").t("library_label_search")}
                  defaultValue={value.name || ""}
                />
              </div>
              <Button variant="contained" color="primary" className={classes.searchBtn} onClick={handleClickSearch}>
                <Search /> {d("Search").t("library_label_search")}
              </Button>
              {value.content_type !== SearchContentsRequestContentType.assetsandfolder && !value.program_group && (
                <TextField
                  style={{ width: 160, marginLeft: 10 }}
                  size="small"
                  onChange={handleChangeFilterOption}
                  // label={d("Content Type").t("library")}
                  value={value.content_type}
                  select
                  SelectProps={{ MenuProps: { transformOrigin: { vertical: -40, horizontal: "left" } } }}
                >
                  {menuItemList(filterOptions(value))}
                </TextField>
              )}
            </Grid>
            <Grid container direction="row" justify="flex-end" alignItems="center" item md={2} lg={4} xl={4}>
              {value.publish_status === PublishStatus.published ||
              value.content_type === SearchContentsRequestContentType.assetsandfolder ? (
                <FormControlLabel
                  value="end"
                  control={<Checkbox color="primary" checked={value.author === Author.self} onChange={handleChangeMyonly} />}
                  label={d("My Only").t("library_label_my_only")}
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
