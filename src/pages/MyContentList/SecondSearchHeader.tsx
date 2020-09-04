import { Checkbox, FormControlLabel, Grid, InputAdornment, Menu, MenuItem, withStyles } from "@material-ui/core";
import Button from "@material-ui/core/Button";
import Hidden from "@material-ui/core/Hidden";
import InputBase from "@material-ui/core/InputBase/InputBase";
import { makeStyles } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField/TextField";
import { Search } from "@material-ui/icons";
import LocalBarOutlinedIcon from "@material-ui/icons/LocalBarOutlined";
import React, { ChangeEvent, MouseEventHandler, useState } from "react";
import { Author, PublishStatus } from "../../api/api.d";
import LayoutBox from "../../components/LayoutBox";
import { QueryCondition, QueryConditionBaseProps } from "./types";

// function setUrlSearch(search: string, key: string, value: string) {
//   const query = new URLSearchParams(search);
//   value == null ? query.delete(key) : query.set(key, value);
//   return `?${query.toString()}`;
// }

// @ts-ignore
const BootstrapInput = withStyles((theme) => ({
  root: {
    "label + &": {
      marginTop: theme.spacing(3),
    },
  },
  input: {
    borderRadius: 4,
    position: "relative",
    backgroundColor: theme.palette.background.paper,
    border: "1px solid #ced4da",
    fontSize: 16,
    padding: "8px 26px 13px 12px",
    transition: theme.transitions.create(["border-color", "box-shadow"]),
    // Use the system font instead of the default Roboto font.
    fontFamily: [
      "-apple-system",
      "BlinkMacSystemFont",
      '"Segoe UI"',
      "Roboto",
      '"Helvetica Neue"',
      "Arial",
      "sans-serif",
      '"Apple Color Emoji"',
      '"Segoe UI Emoji"',
      '"Segoe UI Symbol"',
    ].join(","),
    "&:focus": {
      borderRadius: 4,
      borderColor: "#80bdff",
      boxShadow: "0 0 0 0.2rem rgba(0,123,255,.25)",
    },
  },
}))(InputBase);

// @ts-ignore
const useStyles = makeStyles((theme) => ({
  root: {
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

export function SecondSearchHeaderMb(props: SecondSearchHeaderProps) {
  const classes = useStyles();
  const { value, onChange } = props;
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [searchText, setSearchText] = useState<QueryCondition['name']>();
  const handleChangeSearchText = (event: ChangeEvent<HTMLInputElement>) => {
    setSearchText(event.target.value);
  };
  const handleClickSearch = () => onChange({...value, name: searchText});
  const handleClose = () => {
    setAnchorEl(null);
  };
  const handleClickIconMyonly: MouseEventHandler<SVGSVGElement & HTMLElement> = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleItemClick = (event: any) => {
    setAnchorEl(null);
    const author = value.author === Author.self ? null : Author.self;
    onChange({ ...value, author })
  };
  return (
    <div className={classes.root}>
      <LayoutBox holderMin={40} holderBase={202} mainBase={1517}>
        <Hidden only={["md", "lg", "xl"]}>
          <Grid container spacing={3}>
            <Grid item xs={8} sm={8}>
              <Button variant="contained" color="primary" className={classes.createBtn} href="/library/content-edit/lesson/material/tab/details/rightside/contentH5p">
                Create +
              </Button>
            </Grid>
            <Grid container item xs={4} sm={4} justify="flex-end" alignItems="center" style={{ fontSize: "24px" }}>
              <LocalBarOutlinedIcon onClick={handleClickIconMyonly} />
              <Menu anchorEl={anchorEl} keepMounted open={Boolean(anchorEl)} onClose={handleClose}>
                <MenuItem selected={value.author === Author.self} onClick={handleItemClick}>
                  My Only
                </MenuItem>
              </Menu>
            </Grid>
            <Grid item xs={12} sm={12} style={{ textAlign: "center" }}>
              <TextField
                id="outlined-basic"
                style={{ width: "100%", height: "100%" }}
                value={searchText}
                onChange={handleChangeSearchText}
                onBlur={handleClickSearch}
                label="Search"
                variant="outlined"
                size="small"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Search style={{ cursor: "pointer" }} onClick={handleClickSearch} />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
          </Grid>
        </Hidden>
      </LayoutBox>
    </div>
  );
}

export interface SecondSearchHeaderProps extends QueryConditionBaseProps {}
export function SecondSearchHeader(props: SecondSearchHeaderProps) {
  const classes = useStyles();
  const { value, onChange } = props;
  const [searchText, setSearchText] = useState<QueryCondition['name']>();
  const handleClickSearch = () => onChange({...value, name: searchText})
  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setSearchText(event.target.value);
  };
  const handleChangeMyonly = (event: ChangeEvent<HTMLInputElement>) => {
    const author = event.target.checked ? Author.self : null;
    onChange({ ...value, author });
  };
  return (
    <div className={classes.root}>
      <LayoutBox holderMin={40} holderBase={202} mainBase={1517}>
        <Hidden only={["xs", "sm"]}>
          <Grid container spacing={3} style={{ marginTop: "6px" }}>
            <Grid item md={10} lg={8} xl={8}>
              <BootstrapInput
                id="filled-multiline-static"
                className={classes.searchText}
                onChange={handleChange}
                placeholder={"Search"}
                defaultValue={value.name}
              />
              <Button variant="contained" color="primary" className={classes.searchBtn} onClick={handleClickSearch}>
                <Search /> Search
              </Button>
            </Grid>
            <Grid container direction="row" justify="flex-end" alignItems="center" item md={2} lg={4} xl={4}>
              {value.publish_status === PublishStatus.published ? (
                <FormControlLabel
                  value="end"
                  control={<Checkbox color="primary" checked={value.author === Author.self} onChange={handleChangeMyonly} />}
                  label="My Only"
                  labelPlacement="end"
                />
              ) : (
                ""
              )}
            </Grid>
          </Grid>
        </Hidden>
      </LayoutBox>
    </div>
  );
}



