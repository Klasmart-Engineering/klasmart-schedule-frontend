import { Button, Checkbox, FormControlLabel, Grid, Hidden, makeStyles, Menu, MenuItem } from "@material-ui/core";
import LocalBarOutlinedIcon from "@material-ui/icons/LocalBarOutlined";
import produce from "immer";
import React, { ChangeEvent, MouseEventHandler, useMemo, useState } from "react";
import { useHistory } from "react-router-dom";
import { Author, MilestoneStatus } from "../../api/type";
import LayoutBox from "../../components/LayoutBox";
import { Permission, PermissionType } from "../../components/Permission";
import { d } from "../../locale/LocaleManager";
import MilestoneEdit from "../MilestoneEdit";
import { ListSearch } from "./ListSearch";
import { MilestoneListExectSearch, MilestoneQueryConditionBaseProps } from "./types";

const getMilestoneListSearchCondition = () => {
  return [
    {
      label: d("All").t("assess_filter_all"),
      value: MilestoneListExectSearch.all,
    },
    {
      label: d("Description").t("assess_label_description"),
      value: MilestoneListExectSearch.description,
    },

    {
      label: d("Milestone Name").t("assess_milestone_detail_name"),
      value: MilestoneListExectSearch.name,
    },
    {
      label: d("Short Code").t("assess_label_short_code"),
      value: MilestoneListExectSearch.shortcode,
    },
  ];
};

const useStyles = makeStyles((theme) => ({
  createBtn: {
    width: "125px",
    borderRadius: "23px",
    height: "48px",
    backgroundColor: "#0E78D5",
    textTransform: "capitalize",
  },
}));

export interface SecondSearchHeaderProps extends MilestoneQueryConditionBaseProps {}
export default function SeacondSearchHeader(props: SecondSearchHeaderProps) {
  const css = useStyles();
  const history = useHistory();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const { value, onChange } = props;
  const { search_key, description, name, shortcode } = value;
  const searchFieldDefaultValue = useMemo(() => {
    if (search_key) return MilestoneListExectSearch.all;
    if (description) return MilestoneListExectSearch.description;
    if (name) return MilestoneListExectSearch.name;
    if (shortcode) return MilestoneListExectSearch.shortcode;
    return MilestoneListExectSearch.all;
  }, [description, name, search_key, shortcode]);
  const searchTextDefaultValue = useMemo(() => {
    if (search_key) return search_key;
    if (description) return description;
    if (name) return name;
    if (shortcode) return shortcode;
    return "";
  }, [description, name, search_key, shortcode]);
  const handleClickSearch = (searchField: MilestoneListExectSearch, searchText: string) => {
    const newValue = produce(value, (draft) => {
      if (searchField === MilestoneListExectSearch.all) {
        delete draft.description;
        delete draft.name;
        delete draft.shortcode;
      }
      if (searchField === MilestoneListExectSearch.description) {
        delete draft.search_key;
        delete draft.name;
        delete draft.shortcode;
      }
      if (searchField === MilestoneListExectSearch.name) {
        delete draft.search_key;
        delete draft.description;
        delete draft.shortcode;
      }
      if (searchField === MilestoneListExectSearch.shortcode) {
        delete draft.search_key;
        delete draft.description;
        delete draft.name;
      }
      draft[searchField] = searchText;
    });
    onChange({ ...newValue, page: 1 });
  };
  const handleChangeMyonly = (event: ChangeEvent<HTMLInputElement>) => {
    const author = event.target.checked ? Author.self : null;
    const newValue = produce(value, (draft) => {
      author ? (draft.author_id = author) : delete draft.author_id;
    });
    onChange({ ...newValue, page: 1 });
  };

  const handleClickCreate = () => {
    history.push(`${MilestoneEdit.routeRedirectDefault}`);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const handleClickIconMyonly: MouseEventHandler<SVGSVGElement & HTMLElement> = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleItemClick = (event: any) => {
    setAnchorEl(null);
    const author_id = value.author_id === Author.self ? undefined : Author.self;
    onChange(
      produce(value, (draft) => {
        author_id ? (draft.author_id = author_id) : delete draft.author_id;
      })
    );
  };
  return (
    <>
      <LayoutBox holderMin={40} holderBase={202} mainBase={1517}>
        <Hidden only={["xs", "sm"]}>
          <div style={{ marginBottom: 20 }}>
            <Grid container spacing={3}>
              <Grid item md={10} lg={8} xl={8}>
                <ListSearch
                  searchFieldList={getMilestoneListSearchCondition()}
                  searchFieldDefaultValue={searchFieldDefaultValue}
                  searchTextDefaultValue={searchTextDefaultValue}
                  onSearch={handleClickSearch}
                />
              </Grid>
              <Grid container direction="row" justify="flex-end" alignItems="center" item md={2} lg={4} xl={4}>
                {value.status === MilestoneStatus.published && (
                  <FormControlLabel
                    value="end"
                    control={<Checkbox color="primary" checked={value.author_id === Author.self} onChange={handleChangeMyonly} />}
                    label={d("Show My Content").t("assess_label_my_only")}
                    labelPlacement="end"
                  />
                )}
              </Grid>
            </Grid>
          </div>
        </Hidden>
        <Hidden only={["md", "lg", "xl"]}>
          <Grid container spacing={3}>
            <Grid item xs={8} sm={8}>
              <Permission value={PermissionType.create_milestone_422}>
                <Button variant="contained" color="primary" className={css.createBtn} onClick={handleClickCreate}>
                  {d("Create").t("library_label_create")}
                </Button>
              </Permission>
            </Grid>
            <Grid container item xs={4} sm={4} justify="flex-end" alignItems="center" style={{ fontSize: "24px" }}>
              {value.status === MilestoneStatus.published && (
                <>
                  <LocalBarOutlinedIcon onClick={handleClickIconMyonly} />
                  <Menu anchorEl={anchorEl} keepMounted open={Boolean(anchorEl)} onClose={handleClose}>
                    <MenuItem selected={value.author_id === Author.self} onClick={handleItemClick}>
                      {d("Show My Content").t("assess_label_my_only")}
                    </MenuItem>
                  </Menu>
                </>
              )}
            </Grid>
          </Grid>
          <Grid item xs={12} sm={12} style={{ textAlign: "center" }}>
            <ListSearch
              searchFieldList={getMilestoneListSearchCondition()}
              searchFieldDefaultValue={searchFieldDefaultValue}
              searchTextDefaultValue={searchTextDefaultValue}
              onSearch={handleClickSearch}
            />
          </Grid>
        </Hidden>
      </LayoutBox>
    </>
  );
}
