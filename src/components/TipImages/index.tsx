import { Box, makeStyles, Typography } from "@material-ui/core";
import React, { Fragment } from "react";
import AnyTimeNoData from "../../assets/icons/any_time_no_data.png";
import comingsoonIconUrl from "../../assets/icons/coming soon.svg";
import emptyIconUrl from "../../assets/icons/empty.svg";
import noFilesIconUrl from "../../assets/icons/nofiles.svg";
import noPermissionUrl from "../../assets/icons/permission.jpg";
import achievementEmptyUrl from "../../assets/icons/noLearningOutcomes.svg";
import { d, t } from "../../locale/LocaleManager";

const useStyles = makeStyles(({ breakpoints }) => ({
  emptyImage: {
    marginTop: 200,
    marginBottom: 40,
  },
  emptyDesc: {
    marginBottom: "auto",
  },
  emptyContainer: {
    textAlign: "center",
  },
}));

export enum TipImagesType {
  empty = "empty",
  commingSoon = "commingSoon",
  noResults = "noResults",
  noPermission = "noPermission",
  achievementEmpty = "achievementEmpty",
}
export type TextLabel =
  | "library_msg_no_results_found"
  | "library_label_empty"
  | "library_msg_coming_soon"
  | "library_error_no_permissions"
  | "report_msg_no_data"
  | "report_msg_no_plan";
interface TipImagesProps {
  type: TipImagesType;
  text: TextLabel;
}
export function TipImages(props: TipImagesProps) {
  const { type, text } = props;
  const css = useStyles();
  let src = "";
  if (type === TipImagesType.empty) {
    src = emptyIconUrl;
  }
  if (type === TipImagesType.commingSoon) {
    src = comingsoonIconUrl;
  }
  if (type === TipImagesType.noResults) {
    src = noFilesIconUrl;
  }
  if (type === TipImagesType.noPermission) {
    src = noPermissionUrl;
  }
  if (type === TipImagesType.achievementEmpty) {
    src = achievementEmptyUrl;
  }
  return (
    <Fragment>
      <Box className={css.emptyContainer}>
        <img className={css.emptyImage} alt={type} src={src} />
        <Typography className={css.emptyDesc} variant="body1" color="textSecondary">
          {t(text)}
        </Typography>
      </Box>
    </Fragment>
  );
}
export const permissionTip = <TipImages type={TipImagesType.noPermission} text="library_error_no_permissions" />;
export const emptyTip = <TipImages type={TipImagesType.empty} text="library_label_empty" />;
export const comingsoonTip = <TipImages type={TipImagesType.commingSoon} text="library_msg_coming_soon" />;
export const resultsTip = <TipImages type={TipImagesType.noResults} text="library_msg_no_results_found" />;
export const achievementEmpty = <TipImages type={TipImagesType.achievementEmpty} text="report_msg_no_data" />;
export const emptyTipAndCreate = <TipImages type={TipImagesType.empty} text="report_msg_no_plan" />;

export function NoOutcome() {
  return (
    <div style={{ width: "100%", textAlign: "center", margin: "10vh auto" }}>
      <img src={AnyTimeNoData} alt="" />
      <p>{d("No learning outcome is available.").t("assess_msg_no_lo")}</p>
    </div>
  );
}
