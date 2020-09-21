import { Grid, Tab, Tabs } from "@material-ui/core";
import AppBar from "@material-ui/core/AppBar/AppBar";
import Button from "@material-ui/core/Button";
import Hidden from "@material-ui/core/Hidden";
import { makeStyles } from "@material-ui/core/styles";
import { ArchiveOutlined, HourglassEmptyOutlined, PermMediaOutlined, PublishOutlined } from "@material-ui/icons";
import clsx from "clsx";
import React from "react";
import { Author, OrderBy, PublishStatus, SearchContentsRequestContentType } from "../../api/type";
import LayoutBox from "../../components/LayoutBox";
import { d } from "../../locale/LocaleManager";
import { QueryCondition, QueryConditionBaseProps } from "./types";

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

interface TabPanelProps {
  children?: React.ReactNode;
  index: any;
  value: any;
}

export const isUnpublish = (value: QueryCondition): boolean => {
  return (
    (value.publish_status === PublishStatus.pending && value.author === Author.self) ||
    value.publish_status === PublishStatus.draft ||
    value.publish_status === PublishStatus.rejected
  );
};

export interface FirstSearchHeaderProps extends QueryConditionBaseProps {
  onChangeAssets: (arg: string) => any;
  onCreateContent: () => any;
}
export default function FirstSearchHeader(props: FirstSearchHeaderProps) {
  const css = useStyles();
  const { value, onChange, onCreateContent } = props;
  const unpublish = isUnpublish(value);
  const createHandleClick = (publish_status: QueryCondition["publish_status"]) => () =>
    onChange({ publish_status, content_type: SearchContentsRequestContentType.materialandplan, order_by: OrderBy._created_at, page: 1 });
  const assetsHandleClick = (content_type: QueryCondition["content_type"]) => () =>
    onChange({ content_type, order_by: OrderBy._created_at, page: 1 });
  return (
    <div className={css.root}>
      <LayoutBox holderMin={40} holderBase={202} mainBase={1517}>
        <Hidden only={["xs", "sm"]}>
          <Grid container spacing={3}>
            <Grid item md={3} lg={5} xl={7}>
              <Button onClick={onCreateContent} variant="contained" color="primary" className={css.createBtn}>
                {d("Create").t("library_label_create")} +
              </Button>
            </Grid>
            <Grid container direction="row" justify="space-evenly" alignItems="center" item md={9} lg={7} xl={5}>
              <Button
                onClick={createHandleClick(PublishStatus.published)}
                className={clsx(css.nav, { [css.actives]: value?.publish_status === "published" })}
                startIcon={<PublishOutlined />}
              >
                {d("Published").t("library_label_published")}
              </Button>
              <Button
                onClick={createHandleClick(PublishStatus.pending)}
                className={clsx(css.nav, { [css.actives]: value?.publish_status === "pending" })}
                startIcon={<HourglassEmptyOutlined />}
              >
                {d("Pending").t("library_label_pending")}
              </Button>
              <Button
                onClick={createHandleClick(PublishStatus.draft)}
                className={clsx(css.nav, { [css.actives]: unpublish })}
                startIcon={<PublishOutlined />}
              >
                {d("Unpublished").t("library_label_unpublished")}
              </Button>
              <Button
                onClick={createHandleClick(PublishStatus.archive)}
                className={clsx(css.nav, { [css.actives]: value?.publish_status === "archive" })}
                startIcon={<ArchiveOutlined />}
              >
                {d("Archived").t("library_label_archived")}
              </Button>
              <Button
                onClick={assetsHandleClick(SearchContentsRequestContentType.assets)}
                className={clsx(css.nav, { [css.actives]: value?.content_type === SearchContentsRequestContentType.assets })}
                startIcon={<PermMediaOutlined />}
              >
                {d("Assets").t("library_label_assets")}
              </Button>
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
  const handleChange = (
    event: React.ChangeEvent<{}>,
    publish_status: QueryCondition["publish_status"] | SearchContentsRequestContentType.assets
  ) => {
    if (publish_status === SearchContentsRequestContentType.assets) {
      return onChangeAssets(SearchContentsRequestContentType.assets);
    }
    onChange({ publish_status, order_by: OrderBy._created_at, page: 1, content_type: SearchContentsRequestContentType.materialandplan });
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
                aria-label={d("scrollable force tabs example").t("library_label_scrollable_tabs")}
              >
                <Tab value={PublishStatus.published} label={d("Published").t("library_label_published")} className={classes.capitalize} />
                <Tab value={PublishStatus.pending} label={d("Pending").t("library_label_pending")} className={classes.capitalize} />
                <Tab value={PublishStatus.draft} label={d("Unpublished").t("library_label_unpublished")} className={classes.capitalize} />
                <Tab value={PublishStatus.archive} label={d("Archive").t("library_label_archive")} className={classes.capitalize} />
                <Tab
                  value={SearchContentsRequestContentType.assets}
                  label={d("Assets").t("library_label_assets")}
                  className={classes.capitalize}
                />
              </Tabs>
            </AppBar>
          </Grid>
        </Grid>
      </Hidden>
    </div>
  );
}
