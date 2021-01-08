import { IconButton, makeStyles } from "@material-ui/core";
import { ExpandMore } from "@material-ui/icons";
import React from "react";
import { reportMiss } from "../../locale/LocaleManager";

const useStyles = makeStyles(() => ({
  navBar: {
    heigth: "44px",
    lineHeight: "44px",
    color: "#fff",
    fontFamily: "Open Sans,sans-serif",
    fontWeight: 600,
    paddingLeft: "20px",
    position: "relative",
    backgroundColor: "rgb(9, 84, 149)",
    cursor: "pointer",
    boxSizing: "border-box",
  },
  downIcon: {
    position: "absolute",
    top: "50%",
    right: "30px",
    transform: "translateY(-50%)",
    color: "#fff",
  },
}));

interface H5pHeaderNavbarProps {
  contentType: string;
  library?: string | undefined;
  setShowOther: (value: boolean) => any;
  showOther: boolean;
}

export default function H5pHeaderNavbar(props: H5pHeaderNavbarProps) {
  const { contentType, library, setShowOther, showOther } = props;
  const css = useStyles();
  return (
    <div className={css.navBar} style={{ width: library ? "50%" : "100%", margin: "0 auto" }} onClick={() => setShowOther(!showOther)}>
      {contentType ? contentType : reportMiss("Select content type", "h5p_select_content_type")}
      <IconButton className={css.downIcon} type="submit" aria-label="search">
        <ExpandMore />
      </IconButton>
    </div>
  );
}
