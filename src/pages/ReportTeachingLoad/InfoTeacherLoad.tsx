import { Box, Divider, makeStyles } from "@material-ui/core";
import clsx from "clsx";
import React from "react";
import LayoutBox from "../../components/LayoutBox";
const useStyles = makeStyles(() => ({
  colorPart: {
    width: "32px",
    height: "20px",
    backgroundColor: "#78bae6",
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
  divider: {
    marginTop: "20px",
  },
  marginItem: {
    paddingTop: "15px",
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
      title: "0~2 hours",
      opaciity: 0.25,
    },
    {
      title: "2~4 hours",
      opaciity: 0.45,
    },
    {
      title: "4~6 hours",
      opaciity: 0.7,
    },
    {
      title: "More than 6 hours",
      opaciity: 1,
    },
  ];
  return (
    <LayoutBox holderMin={40} holderBase={202} mainBase={1517}>
      <Divider className={css.divider} />
      <Box className={clsx(css.rightContainer, css.flexRight)}>
        {infoList.map((infoItem) => (
          <Box key={infoItem.title} className={clsx(css.rightContainer, css.marginItem)}>
            <div className={css.colorPart} style={{ opacity: infoItem.opaciity }}></div>
            <span>{infoItem.title}</span>
          </Box>
        ))}
      </Box>
    </LayoutBox>
  );
}
