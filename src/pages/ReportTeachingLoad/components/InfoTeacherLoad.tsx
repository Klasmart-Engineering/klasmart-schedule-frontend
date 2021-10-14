import { Box, makeStyles } from "@material-ui/core";
import clsx from "clsx";
import React from "react";
import { d } from "../../../locale/LocaleManager";
const useStyles = makeStyles(() => ({
  colorPart: {
    width: "32px",
    height: "20px",
    backgroundColor: "#0062FF",
  },
  flexRight: {
    display: "flex",
    justifyContent: "flex-end",
  },
  rightContainer: {
    display: "flex",
    alignItems: "center",
    flexWrap: "wrap",
    "& div": {
      marginRight: "10px",
    },
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
  opaciity: number;
}

export function InfoTeacherLoad() {
  const css = useStyles();
  const infoList: InfoListItem[] = [
    {
      title: d("0 Hour").t("report_label_0_hour"),
      opaciity: 0.1,
    },
    {
      title: d("0~2 Hours").t("report_label_0_2_hours"),
      opaciity: 0.25,
    },
    {
      title: d("2~4 Hours").t("report_label_2_4_hours"),
      opaciity: 0.45,
    },
    {
      title: d("4~6 Hours").t("report_label_4_6_hours"),
      opaciity: 0.7,
    },
    {
      title: d("More than 6 Hours").t("report_label_more_than_6_hours"),
      opaciity: 1,
    },
  ];
  return (
    // <LayoutBox holderMin={40} holderBase={202} mainBase={1517}>
      <Box className={clsx(css.rightContainer, css.flexRight)}>
        {infoList.map((infoItem) => (
          <Box key={infoItem.title} className={clsx(css.rightContainer, css.marginItem)}>
            <div className={css.colorPart} style={{ opacity: infoItem.opaciity }}></div>
            <span>{infoItem.title}</span>
          </Box>
        ))}
      </Box>
    // </LayoutBox>
  );
}
