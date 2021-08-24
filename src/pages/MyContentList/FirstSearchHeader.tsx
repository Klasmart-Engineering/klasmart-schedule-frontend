import { Grid, Menu, MenuItem, MenuProps, Tab, Tabs } from "@material-ui/core";
import AppBar from "@material-ui/core/AppBar/AppBar";
import Button from "@material-ui/core/Button";
import Hidden from "@material-ui/core/Hidden";
import { makeStyles, withStyles } from "@material-ui/core/styles";
import { ArchiveOutlined, PermMediaOutlined, PublishOutlined } from "@material-ui/icons";
import ArrowDropDownOutlinedIcon from "@material-ui/icons/ArrowDropDownOutlined";
import clsx from "clsx";
import React from "react";
import { Author, OrderBy, PublishStatus, SearchContentsRequestContentType } from "../../api/type";
import LayoutBox from "../../components/LayoutBox";
import { Permission, PermissionOr, PermissionType, usePermission } from "../../components/Permission";
import { d } from "../../locale/LocaleManager";
import { PendingBlueIcon, PendingIcon, UnPubBlueIcon, UnPubIcon } from "../OutcomeList/Icons";
import { QueryCondition, QueryConditionBaseProps } from "./types";
export const StyledMenu = withStyles({
  paper: {
    border: "1px solid #d3d4d5",
  },
})((props: MenuProps) => (
  <Menu
    elevation={0}
    getContentAnchorEl={null}
    anchorOrigin={{
      vertical: "bottom",
      horizontal: "center",
    }}
    transformOrigin={{
      vertical: "top",
      horizontal: "center",
    }}
    {...props}
  />
));
const useStyles = makeStyles((theme) => ({
  root: {
    marginTop: 20,
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
    marginLeft: 20,
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
  selectedTab: {
    color: "rgba(0, 0, 0, 0.54) !important",
  },
  active: {
    color: "#0E78D5 !important",
  },
}));
export const isUnpublish = (value: QueryCondition): boolean => {
  return (
    (value.publish_status === PublishStatus.pending && value.author === Author.self) ||
    value.publish_status === PublishStatus.draft ||
    value.publish_status === PublishStatus.rejected
  );
};
export interface FirstSearchHeaderProps extends QueryConditionBaseProps {
  onChangeAssets: (contentType: string, scope: string) => any;
  onCreateContent: () => any;
  onNewFolder: () => any;
}
export default function FirstSearchHeader(props: FirstSearchHeaderProps) {
  const css = useStyles();
  const { value, onChange, onCreateContent, onNewFolder } = props;
  const unpublish = isUnpublish(value);
  const [anchorCreate, setAnchorCreate] = React.useState<null | HTMLElement>(null);

  const handleClickCreate = (event: any) => {
    setAnchorCreate(event?.currentTarget);
  };

  const handleCreateClose = () => setAnchorCreate(null);

  const createHandleClick = (publish_status: QueryCondition["publish_status"]) => () =>
    onChange({
      publish_status,
      content_type: SearchContentsRequestContentType.materialandplan,
      order_by: OrderBy._updated_at,
      page: 1,
    });

  const assetsHandleClick = (content_type: QueryCondition["content_type"]) => () =>
    onChange({
      content_type,
      order_by: OrderBy._updated_at,
      page: 1,
    });
  const handleClickNewFolder = () => {
    setAnchorCreate(null);
    onNewFolder();
  };
  return (
    <div className={css.root}>
      <LayoutBox holderMin={40} holderBase={202} mainBase={1517}>
        <Hidden only={["xs", "sm"]}>
          <Grid container spacing={3}>
            <Grid item md={2} lg={4} xl={5}>
              <PermissionOr
                value={[
                  PermissionType.create_content_page_201,
                  PermissionType.create_lesson_material_220,
                  PermissionType.create_lesson_plan_221,
                ]}
              >
                {(value.publish_status === PublishStatus.published ||
                  value.content_type === SearchContentsRequestContentType.assetsandfolder) && (
                  <Button
                    onClick={handleClickCreate}
                    variant="contained"
                    color="primary"
                    className={css.createBtn}
                    endIcon={<ArrowDropDownOutlinedIcon />}
                  >
                    {d("Create").t("library_label_create")}
                  </Button>
                )}
              </PermissionOr>
              <StyledMenu anchorEl={anchorCreate} keepMounted open={Boolean(anchorCreate)} onClose={handleCreateClose}>
                {value.publish_status === PublishStatus.published && (
                  <>
                    <MenuItem
                      onClick={() => {
                        value.content_type = SearchContentsRequestContentType.material;
                        onCreateContent();
                      }}
                    >
                      {d("Lesson Material").t("library_label_lesson_material")}
                    </MenuItem>
                    <MenuItem
                      onClick={() => {
                        value.content_type = SearchContentsRequestContentType.plan;
                        onCreateContent();
                      }}
                    >
                      {d("Lesson Plan").t("library_label_lesson_plan")}
                    </MenuItem>
                  </>
                )}
                {value.content_type === SearchContentsRequestContentType.assetsandfolder && (
                  <MenuItem onClick={onCreateContent}>{d("Assets").t("library_label_assets")}</MenuItem>
                )}
                <Permission value={PermissionType.create_folder_289}>
                  <MenuItem onClick={handleClickNewFolder}>{d("New Folder").t("library_label_new_folder")}</MenuItem>
                </Permission>
              </StyledMenu>
            </Grid>
            <Grid container direction="row" justify="flex-end" alignItems="center" item md={10} lg={8} xl={7}>
              <Permission value={PermissionType.published_content_page_204}>
                <Button
                  onClick={createHandleClick(PublishStatus.published)}
                  className={clsx(css.nav, {
                    [css.actives]: value?.publish_status === PublishStatus.published,
                  })}
                  startIcon={<PublishOutlined />}
                >
                  {d("Published").t("library_label_published")}
                </Button>
              </Permission>

              <Permission value={PermissionType.pending_content_page_203}>
                <Button
                  onClick={createHandleClick(PublishStatus.pending)}
                  className={clsx(css.nav, {
                    [css.actives]: value?.publish_status === PublishStatus.pending && value.author !== Author.self,
                  })}
                  startIcon={value?.publish_status === "pending" && value.author !== Author.self ? <PendingBlueIcon /> : <PendingIcon />}
                >
                  {d("Pending").t("library_label_pending")}
                </Button>
              </Permission>

              <Permission value={PermissionType.unpublished_content_page_202}>
                <Button
                  onClick={createHandleClick(PublishStatus.draft)}
                  className={clsx(css.nav, {
                    [css.actives]: unpublish,
                  })}
                  startIcon={unpublish ? <UnPubBlueIcon /> : <UnPubIcon />}
                >
                  {d("Unpublished").t("library_label_unpublished")}
                </Button>
              </Permission>

              <Permission value={PermissionType.archived_content_page_205}>
                <Button
                  onClick={createHandleClick(PublishStatus.archive)}
                  className={clsx(css.nav, {
                    [css.actives]: value?.publish_status === PublishStatus.archive,
                  })}
                  startIcon={<ArchiveOutlined />}
                >
                  {d("Archived").t("library_label_archived")}
                </Button>
              </Permission>
              <Permission value={PermissionType.create_asset_page_301}>
                <Button
                  onClick={assetsHandleClick(SearchContentsRequestContentType.assetsandfolder)}
                  className={clsx(css.nav, {
                    [css.actives]: value?.content_type === SearchContentsRequestContentType.assetsandfolder,
                  })}
                  startIcon={<PermMediaOutlined />}
                >
                  {d("Assets").t("library_label_assets")}
                </Button>
              </Permission>
            </Grid>
          </Grid>
        </Hidden>
      </LayoutBox>
    </div>
  );
}
export function FirstSearchHeaderMb(props: FirstSearchHeaderProps) {
  const classes = useStyles();
  const { value, onChange, onChangeAssets } = props;
  const perm = usePermission([
    PermissionType.published_content_page_204,
    PermissionType.pending_content_page_203,
    PermissionType.unpublished_content_page_202,
    PermissionType.archived_content_page_205,
    PermissionType.create_asset_page_301,
  ]);

  const handleChange = (
    event: React.ChangeEvent<{}>,
    publish_status: QueryCondition["publish_status"] | SearchContentsRequestContentType.assetsandfolder
  ) => {
    if (publish_status === SearchContentsRequestContentType.assetsandfolder) {
      return onChangeAssets(SearchContentsRequestContentType.assetsandfolder, "default");
    }

    onChange({
      publish_status,
      order_by: OrderBy._updated_at,
      page: 1,
      content_type: SearchContentsRequestContentType.materialandplan,
    });
  };

  return (
    <div className={classes.root}>
      <Hidden only={["md", "lg", "xl"]}>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={12}>
            <AppBar position="static" color="inherit">
              <Tabs
                value={value?.publish_status || value.content_type}
                onChange={handleChange}
                variant="scrollable"
                scrollButtons="on"
                indicatorColor="primary"
                textColor="primary"
              >
                {perm.published_content_page_204 && (
                  <Tab value={PublishStatus.published} label={d("Published").t("library_label_published")} className={classes.capitalize} />
                )}
                {perm.pending_content_page_203 && (
                  <Tab
                    value={PublishStatus.pending}
                    label={d("Pending").t("library_label_pending")}
                    classes={{
                      selected: classes.selectedTab,
                    }}
                    className={clsx(classes.capitalize, classes.selectedTab, {
                      [classes.active]: value?.publish_status === PublishStatus.pending && value?.author !== Author.self,
                    })}
                  />
                )}
                {perm.unpublished_content_page_202 &&
                  (value?.publish_status === PublishStatus.pending && value?.author === Author.self ? (
                    <Tab
                      value={PublishStatus.pending}
                      label={d("Unpublished").t("library_label_unpublished")}
                      className={classes.capitalize}
                    />
                  ) : value?.publish_status === PublishStatus.rejected ? (
                    <Tab
                      value={PublishStatus.rejected}
                      label={d("Unpublished").t("library_label_unpublished")}
                      className={classes.capitalize}
                    />
                  ) : (
                    <Tab
                      value={PublishStatus.draft}
                      label={d("Unpublished").t("library_label_unpublished")}
                      className={classes.capitalize}
                    />
                  ))}
                {perm.archived_content_page_205 && (
                  <Tab value={PublishStatus.archive} label={d("Archived").t("library_label_archived")} className={classes.capitalize} />
                )}
                {perm.create_asset_page_301 && (
                  <Tab
                    value={SearchContentsRequestContentType.assetsandfolder}
                    label={d("Assets").t("library_label_assets")}
                    className={classes.capitalize}
                  />
                )}
              </Tabs>
            </AppBar>
          </Grid>
        </Grid>
      </Hidden>
    </div>
  );
}
