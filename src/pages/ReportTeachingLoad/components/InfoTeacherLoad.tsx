import { Box, makeStyles } from "@material-ui/core";
import clsx from "clsx";
import React from "react";
import { d } from "../../../locale/LocaleManager";
const useStyles = makeStyles(() => ({
  colorPart: {
    width: "32px",
    height: "20px",
    marginRight: "10px",
    marginLeft: "32px",
  },
  flexRight: {
    display: "flex",
    justifyContent: "flex-end",
  },
  rightContainer: {
    display: "flex",
    alignItems: "center",
    flexWrap: "wrap",
    "& span": {
      color: "black",
      fontWeight: 500,
      fontSize: "14px",
    },
  },
  marginItem: {
    paddingTop: "32px",
  },
}));
interface InfoListItem {
  title: string;
  color: string;
}

export function InfoTeacherLoad() {
  const css = useStyles();
  const infoList: InfoListItem[] = [
    {
      title: d("0 Hour").t("report_label_0_hour"),
      color: "rgba(174,174,174,0.15)",
    },
    {
      title: d("0~2 Hours").t("report_label_0_2_hours"),
      color: "rgba(230,239,255,1)",
    },
    {
      title: d("2~4 Hours").t("report_label_2_4_hours"),
      color: "rgba(163,199,255,1)",
    },
    {
      title: d("4~6 Hours").t("report_label_4_6_hours"),
      color: "rgba(74,144,255,1)",
    },
    {
      title: d("More than 6 Hours").t("report_label_more_than_6_hours"),
      color: "rgba(0,98,255,1)",
    },
  ];
  return (
    // <LayoutBox holderMin={40} holderBase={202} mainBase={1517}>
      <Box className={clsx(css.rightContainer, css.flexRight)}>
        {infoList.map((infoItem) => (
          <Box key={infoItem.title} className={clsx(css.rightContainer, css.marginItem)}>
            <div className={css.colorPart} style={{ backgroundColor: infoItem.color }}></div>
            <span>{infoItem.title}</span>
          </Box>
        ))}
      </Box>
    // </LayoutBox>
  );
}
