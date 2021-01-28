import { Button, Grid, IconButton, InputBase, makeStyles, Paper, Typography } from "@material-ui/core";
import { Search } from "@material-ui/icons";
import clsx from "clsx";
import React from "react";
import { ContentTypeList } from "../../api/type";
import { reportMiss } from "../../locale/LocaleManager";
import { MockData } from "./types/index";

const useStyles = makeStyles((theme) => ({
  header_container: {
    borderBottom: "1px solid #eee",
    paddingBottom: "20px",
    // paddingLeft: "20px",
    // paddingRight: "10px",
  },
  selectButton: {
    cursor: "pointer",
    border: "1px solid #fff",
    "&:hover": {
      textDecoration: "underline",
    },
  },
  box_selected: {
    marginTop: "0px",
    "& .MuiGrid-item": {
      padding: "10px 0",
    },
    [theme.breakpoints.up("md")]: {
      width: "65%",
    },
    [theme.breakpoints.down("md")]: {
      width: "90%",
    },
    paddingLeft: "20px",
    paddingRight: "10px",
  },
  firstChild: {
    paddingLeft: "20px !important",
  },
  activeLink: {
    textDecoration: "underline",
    border: "1px solid #1a93f4",
    // fontWeight: 700,
  },
  searchBox: {
    width: "100%",
    padding: "5px 20px 5px 20px",
    // paddingLeft: '20px',
    marginTop: "10px",
    border: "2px solid #eee",
    boxShadow: "none",
    borderRadius: "20px",
    position: "relative",
    marginBottom: "10px",
  },
  searchInput: {
    width: "90%",
    fontSize: "20px",
  },
  searchButton: {
    position: "absolute",
    right: "10px",
    top: "50%",
    transform: "translateY(-50%)",
  },
  navBar: {
    heigth: "44px",
    lineHeight: "44px",
    color: "#474f5a",
    fontFamily: "Open Sans,sans-serif",
    fontWeight: 600,
    paddingLeft: "20px",
    position: "relative",
  },
  back_searchBox: {
    backgroundColor: "#697585",
    paddingLeft: "20px",
    paddingRight: "20px",
  },
  all_content_types: {
    paddingLeft: "20px",
    paddingRight: "10px",
  },
  downIcon: {
    position: "absolute",
    top: "50%",
    right: "30px",
    transform: "translateY(-50%)",
  },
}));

interface H5pHeaderProps {
  contentTypeList: (ContentTypeList[0] | MockData)[];
  sortList: (type: string) => void;
  searchChange: (value: string) => void;
}

export default function H5pHeader(props: H5pHeaderProps) {
  const { contentTypeList, sortList, searchChange } = props;
  const [activeOption, setActiveOption] = React.useState("");

  const css = useStyles();

  const handleSelect = (type: string) => {
    setActiveOption(type);
    sortList(type);
  };

  return (
    <div className={css.header_container}>
      <Grid container style={{ width: "100%" }} className={css.back_searchBox}>
        <Paper className={css.searchBox}>
          <InputBase
            placeholder={reportMiss("Search for Content Types", "h5p_content_types")}
            inputProps={{ "aria-label": "search for Content Types" }}
            className={css.searchInput}
            onChange={(e) => searchChange(e.target.value)}
          />
          <IconButton className={css.searchButton} type="submit" aria-label="search">
            <Search />
          </IconButton>
        </Paper>
      </Grid>
      <Grid container alignItems="center" className={css.all_content_types}>
        <Grid item>
          <Typography variant="h6">{reportMiss("All Content Types", "h5p_all_content_types")}</Typography>
        </Grid>
        <Grid item>
          ({contentTypeList && contentTypeList.length} {reportMiss("results", "h5p_results")})
        </Grid>
      </Grid>
      <Grid container spacing={5} alignItems="center" className={css.box_selected}>
        <Grid item xs={2} sm={2} md={2} lg={2} xl={2} className={css.firstChild}>
          {reportMiss("show", "h5p_show")}:{" "}
        </Grid>
        <Grid item xs={4} sm={3} md={3} lg={3} xl={3}>
          <Button
            className={clsx(css.selectButton, activeOption === "popularFirst" ? css.activeLink : "")}
            onClick={() => handleSelect("popularFirst")}
          >
            {reportMiss("Popular First", "h5p_popular_first")}
          </Button>
        </Grid>
        <Grid item xs={4} sm={3} md={3} lg={3} xl={3}>
          <Button
            className={clsx(css.selectButton, activeOption === "NewestFirst" ? css.activeLink : "")}
            onClick={() => handleSelect("NewestFirst")}
          >
            {reportMiss("Newest First", "h5p_newest_first")}
          </Button>
        </Grid>
        <Grid item xs={2} sm={3} md={3} lg={3} xl={3}>
          <Button className={clsx(css.selectButton, activeOption === "aToZ" ? css.activeLink : "")} onClick={() => handleSelect("aToZ")}>
            {reportMiss("A to Z", "h5p_a_to_z")}
          </Button>
        </Grid>
      </Grid>
    </div>
  );
}
