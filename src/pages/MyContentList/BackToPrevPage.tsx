import { Button, createStyles, Grid, Hidden, Tooltip, Typography } from "@material-ui/core";
import { makeStyles, Theme, withStyles } from "@material-ui/core/styles";
import React from "react";
import { EntityFolderContentData, EntityFolderItemInfo } from "../../api/api.auto";
import PermissionType from "../../api/PermissionType";
import folderIconUrl from "../../assets/icons/foldericon.svg";
import prevPageUrl from "../../assets/icons/folderprev.svg";
import { usePermission } from "../../hooks/usePermission";
import { d } from "../../locale/LocaleManager";
const LightTooltip = withStyles((theme: Theme) => ({
  tooltip: {
    backgroundColor: theme.palette.common.white,
    color: "rgba(0, 0, 0, 0.87)",
    boxShadow: theme.shadows[1],
    fontSize: 12,
  },
}))(Tooltip);

const useStyles = makeStyles((theme) =>
  createStyles({
    //
    card: {
      width: "86%",
      marginBottom: 40,
      [theme.breakpoints.only("sm")]: {
        width: "90%",
      },
      [theme.breakpoints.only("xs")]: {
        width: "100%",
      },
      position: "relative",
    },
    cardMedia: {
      width: "100%",
      paddingTop: "56.25%",
      position: "relative",
    },
    prevImg: {
      position: "absolute",
      left: "50%",
      top: "50%",
      transform: "translate(-50%, -50%)",
      width: "50%",
    },
    folderName: {
      display: "flex",
      alignItems: "center",
      [theme.breakpoints.down("md")]: {
        marginLeft: 10,
      },
    },
    despWord: {
      fontSize: 18,
      color: "#666666",
      textAlign: "right",
      flex: 1,
      lineHeight: "22px",
      [theme.breakpoints.down("sm")]: {
        fontSize: 14,
      },
    },
    infoWord: {
      fontSize: 22,
      flex: 3,
      marginLeft: 5,
      lineHeight: "22px",
      color: "#000000",
      overflow: "hidden",
      display: "-webkit-box",
      textOverflow: "ellipsis",
      WebkitBoxOrient: "vertical",
      WebkitLineClamp: 3,
      wordBreak: "break-word",
      [theme.breakpoints.down("sm")]: {
        fontSize: 18,
      },
    },
    folderInfoCon: {
      width: "50%",
      display: "flex",
      marginTop: 10,
      [theme.breakpoints.down("md")]: {
        width: "100%",
        fontSize: 16,
      },
    },
    titleCon: {
      display: "flex",
    },
    mbBtnCon: {
      margin: "10px 0",
      textAlign: "right",
    },
  })
);

interface BackToPrevePageProps {
  onGoBack: () => any;
  parentFolderInfo: EntityFolderItemInfo;
  onRenameFolder: (content: NonNullable<EntityFolderContentData>) => any;
}
export function BackToPrevPage(props: BackToPrevePageProps) {
  const css = useStyles();
  const { onGoBack, parentFolderInfo, onRenameFolder } = props;
  const keywords = parentFolderInfo.keywords ? parentFolderInfo.keywords.join(",") : "";
  const perm = usePermission([PermissionType.create_folder_289]);
  const folderInfo = () => {
    return (
      <>
        <div className={css.folderInfoCon}>
          <Typography className={css.despWord}>{"Created by"}:</Typography>
          <Typography className={css.infoWord}>{parentFolderInfo.creator_name}</Typography>
        </div>
        <div className={css.folderInfoCon}>
          <Typography className={css.despWord}>{d("Keywords").t("library_label_keywords")}:</Typography>
          <LightTooltip placement="top" title={keywords}>
            <Typography className={css.infoWord}>{keywords}</Typography>
          </LightTooltip>
        </div>
        <div className={css.folderInfoCon}>
          <Typography className={css.despWord}>{d("Description").t("library_label_description")}:</Typography>
          <LightTooltip placement="top" title={parentFolderInfo.description || ""}>
            <Typography className={css.infoWord}>{parentFolderInfo.description}</Typography>
          </LightTooltip>
        </div>
        <div className={css.folderInfoCon}>
          <Typography className={css.despWord}>{"Contain"}:</Typography>
          <Typography className={css.infoWord}>
            {parentFolderInfo.items_count} {d("items").t("library_label_items")}. {parentFolderInfo.available}{" "}
            {d("visible").t("library_label_visible")}
          </Typography>
        </div>
      </>
    );
  };
  return (
    <>
      <Grid container spacing={2} style={{ borderBottom: "1px solid #e0e0e0", marginBottom: 10 }}>
        <Hidden only={["xs"]}>
          <Grid item xs={12} sm={6} md={4} lg={3} xl={3}>
            <div className={css.card}>
              <div className={css.cardMedia} style={{ marginTop: 10, cursor: "pointer" }} onClick={onGoBack}>
                <img className={css.prevImg} src={prevPageUrl} alt="" />
              </div>
            </div>
          </Grid>
          <Grid item xs={12} sm container justify="center" direction="column">
            <Grid item>
              <div className={css.folderName}>
                <img src={folderIconUrl} alt="" style={{ width: 48, height: 48 }} />
                <Typography variant="h6" className={css.infoWord}>
                  {parentFolderInfo.name}
                </Typography>
              </div>
            </Grid>
            <Grid item container>
              {folderInfo()}
            </Grid>
            <Grid item container justify="flex-end">
              {perm.create_folder_289 && (
                <Button variant="outlined" color="primary" onClick={() => onRenameFolder(parentFolderInfo)}>
                  {d("Edit").t("library_label_edit")}
                </Button>
              )}
            </Grid>
          </Grid>
        </Hidden>
        <Hidden only={["sm", "md", "lg", "xl"]}>
          <Grid item style={{ width: "100%" }}>
            <div className={css.titleCon}>
              <img style={{ width: 48, height: 48, cursor: "pointer" }} src={prevPageUrl} alt="" onClick={onGoBack} />
              <div className={css.folderName}>
                <img src={folderIconUrl} alt="" style={{ width: 24, height: 24 }} />
                <Typography variant="h6" className={css.infoWord}>
                  {parentFolderInfo.name}
                </Typography>
              </div>
            </div>
            {folderInfo()}
            <div className={css.mbBtnCon}>
              {perm.create_folder_289 && (
                <Button variant="outlined" color="primary" onClick={() => onRenameFolder(parentFolderInfo)}>
                  {d("Edit").t("library_label_edit")}
                </Button>
              )}
            </div>
          </Grid>
        </Hidden>
      </Grid>
    </>
  );
}
