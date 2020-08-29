import { ButtonGroup, Checkbox, FormControlLabel, Grid, InputAdornment, Menu, MenuItem, Tooltip, withStyles } from "@material-ui/core";
import Button from "@material-ui/core/Button";
import Hidden from "@material-ui/core/Hidden";
import InputBase from "@material-ui/core/InputBase/InputBase";
import { makeStyles } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField/TextField";
import { Search, ViewListOutlined, ViewQuiltOutlined } from "@material-ui/icons";
import LocalBarOutlinedIcon from "@material-ui/icons/LocalBarOutlined";
import React, { useEffect } from "react";
import { useHistory, useLocation } from "react-router-dom";
import LayoutBox from "../../components/LayoutBox";
import SecondaryMenu from "./secondaryMenu";
import { SortTemplate, SortTemplateMb } from "./SortTemplate";
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

interface ActionBarLayout {
  layout: string;
  name: string;
  myOnly: boolean;
}
function SelectTemplateMb(props: ActionBarLayout) {
  const classes = useStyles();
  const [value, setValue] = React.useState("");
  const { name, myOnly } = props;
  const history = useHistory();
  const { pathname, search } = useLocation();
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [selected, setSelected] = React.useState<boolean>(false);
  const handleChange = (event: any) => {
    setValue(event.target.value);
  };
  const handleSearch = (event: any) => {
    const name = event.target.value;
    const newUrl = setUrl(search, "name", name);
    history.push(`${pathname}${newUrl}`);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const handleShowMyOnluy = (event: any) => {
    setAnchorEl(event.currentTarget);
  };
  const handleItemClick = (event: any) => {
    setSelected(!selected);
    setAnchorEl(null);
    const myOnly: any = !selected;
    const newUrl = setUrl(search, "myOnly", myOnly);
    history.push(`${pathname}${newUrl}`);
  };
  const handleCreate = () => {
    history.push(`/library/content-edit/lesson/material/tab/details/rightside/contentH5p`);
  };
  useEffect(() => {
    setValue(name);
    setSelected(myOnly);
  }, [name, myOnly]);
  return (
    <div className={classes.root}>
      <LayoutBox holderMin={40} holderBase={202} mainBase={1517}>
        <Hidden only={["md", "lg", "xl"]}>
          <Grid container spacing={3}>
            <Grid item xs={8} sm={8}>
              <Button variant="contained" color="primary" className={classes.createBtn} onClick={handleCreate}>
                Create +
              </Button>
            </Grid>
            <Grid container item xs={4} sm={4} justify="flex-end" alignItems="center" style={{ fontSize: "24px" }}>
              <LocalBarOutlinedIcon onClick={handleShowMyOnluy} />
              <Menu anchorEl={anchorEl} keepMounted open={Boolean(anchorEl)} onClose={handleClose}>
                <MenuItem selected={selected} onClick={(event) => handleItemClick(event)}>
                  My Only
                </MenuItem>
              </Menu>
            </Grid>
            <Grid item xs={12} sm={12} style={{ textAlign: "center" }}>
              <TextField
                id="outlined-basic"
                style={{ width: "100%", height: "100%" }}
                value={value}
                onChange={handleChange}
                onBlur={handleSearch}
                label="Search"
                variant="outlined"
                size="small"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Search style={{ cursor: "pointer" }} onClick={handleSearch} />
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
interface SecondaryMenuProps {
  layout: string;
  status: string;
  showMyOnly: boolean; //是否显示myOnly按钮
  myOnly: boolean; // myonly按钮选中状态
  name: string;
}
function SelectTemplate(props: SecondaryMenuProps) {
  const classes = useStyles();
  const { layout, myOnly, name } = props;
  const history = useHistory();
  const { pathname, search } = useLocation();
  const [searchInput, setSearchInput] = React.useState("");
  const handleSearch = (event: any) => {
    const name = searchInput;
    const newUrl = setUrl(search, "name", name);
    history.push(`${pathname}${newUrl}`);
  };
  const handleChange = (event: any) => {
    setSearchInput(event.target.value);
  };
  const handleIsMyOnly = (event: any) => {
    const myOnly = event.target.checked;
    console.log(typeof myOnly);
    const newUrl = setUrl(search, "myOnly", myOnly);
    history.push(`${pathname}${newUrl}`);
  };
  useEffect(() => {
    setSearchInput(name);
  }, [name]);
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
                value={searchInput}
              />
              <Button variant="contained" color="primary" className={classes.searchBtn} onClick={handleSearch}>
                <Search /> Search
              </Button>
            </Grid>
            <Grid container direction="row" justify="flex-end" alignItems="center" item md={2} lg={4} xl={4}>
              {props.showMyOnly ? (
                <FormControlLabel
                  value="end"
                  control={<Checkbox color="primary" checked={myOnly} onChange={handleIsMyOnly} />}
                  label="My Only"
                  labelPlacement="end"
                />
              ) : (
                ""
              )}

              <ButtonGroup aria-label="outlined primary button group" className={classes.switch}>
                <Button
                  variant="contained"
                  style={{
                    backgroundColor: layout === "card" ? "#FFFF" : "#0E78D5",
                    color: layout === "card" ? "black" : "#FFFF",
                  }}
                  className={classes.switchBtn}
                  href="#/my-content-list?layout=list"
                >
                  <Tooltip title="List">
                    <ViewListOutlined />
                  </Tooltip>
                </Button>
                <Button
                  variant="contained"
                  style={{
                    backgroundColor: layout === "card" ? "#0E78D5" : "#FFFF",
                    color: layout === "card" ? "#FFFF" : "black",
                  }}
                  className={classes.switchBtn}
                  href="#/my-content-card?layout=card"
                >
                  <Tooltip title="Card">
                    <ViewQuiltOutlined />
                  </Tooltip>
                </Button>
              </ButtonGroup>
            </Grid>
          </Grid>
        </Hidden>
      </LayoutBox>
      <SelectTemplateMb layout={layout} name={name} myOnly={myOnly} />
    </div>
  );
}

function setUrl(search: string, param: string, value: string) {
  const query = new URLSearchParams(search);
  let newUrl: any;
  if (query.get(param)) {
    if (!value) {
      query.delete(param);
    } else {
      query.set(param, value);
    }
    newUrl = "?" + query.toString();
  } else {
    if (value) {
      newUrl = `${search}&${param}=${value}`;
    } else {
      newUrl = search;
    }
  }
  return newUrl;
}

interface ActionBarProps {
  layout: string;
  status: string;
  showMyOnly: boolean;
  subStatus: string;
  myOnly: boolean;
  sortBy: string;
  name: string;
  onHandleBulkAction: (act: string) => void;
}
export default function ActionBar(props: ActionBarProps) {
  const { layout, status, showMyOnly, subStatus, myOnly, sortBy, name } = props;
  const classes = useStyles();
  return (
    <div className={classes.navigation}>
      <SecondaryMenu layout={layout} status={status} showMyOnly={showMyOnly} />
      <SelectTemplate layout={layout} status={status} showMyOnly={showMyOnly} myOnly={myOnly} name={name} />
      <SortTemplate status={status} subStatus={subStatus} sortBy={sortBy} onHandleBulkAction={props.onHandleBulkAction} />
      <SortTemplateMb status={status} subStatus={subStatus} sortBy={sortBy} onHandleBulkAction={props.onHandleBulkAction} />
    </div>
  );
}
