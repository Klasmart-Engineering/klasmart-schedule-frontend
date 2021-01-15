import { IconButton, makeStyles } from "@material-ui/core";
import { ExpandMore } from "@material-ui/icons";
import React from "react";
import imgUrl from "../../assets/icons/h5p_icon.png";
import { reportMiss } from "../../locale/LocaleManager";

const useStyles = makeStyles(() => ({
  navBar: {
    height: "70px",
    lineHeight: "70px",
    color: "#000",
    fontFamily: "Open Sans,sans-serif",
    fontWeight: 600,
    position: "relative",
    // backgroundColor: "rgb(9, 84, 149)",
    cursor: "pointer",
    boxSizing: "border-box",
    "& img": {
      maxHeight: "80%",
    },
    display: "flex",
    alignItems: "center",
    border: "1px solid #697585",
  },
  downIcon: {
    position: "absolute",
    top: "50%",
    right: "30px",
    transform: "translateY(-50%)",
    color: "#000",
  },
}));

interface H5pHeaderNavbarProps {
  title: string;
  onExpand: (value: boolean) => void;
  expand: boolean;
}

export default function H5pHeaderNavbar(props: H5pHeaderNavbarProps) {
  const { title, onExpand, expand } = props;
  const css = useStyles();

  const handleClick = () => {
    onExpand(!expand);
  };

  return (
    <div className={css.navBar} onClick={handleClick}>
      <img src={imgUrl} alt="" />
      {title ? title : reportMiss("Select content type", "h5p_select_content_type")}
      <IconButton className={css.downIcon} type="submit" aria-label="search">
        <ExpandMore />
      </IconButton>
    </div>
  );
}
