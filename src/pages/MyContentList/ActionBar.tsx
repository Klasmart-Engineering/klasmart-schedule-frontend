import { ButtonGroup, Checkbox, FormControlLabel, Grid, InputAdornment, Tooltip, withStyles } from "@material-ui/core";
import Button from "@material-ui/core/Button";
import ClickAwayListener from "@material-ui/core/ClickAwayListener/ClickAwayListener";
import Grow from "@material-ui/core/Grow/Grow";
import Hidden from "@material-ui/core/Hidden";
import InputBase from "@material-ui/core/InputBase/InputBase";
import MenuItem from "@material-ui/core/MenuItem";
import MenuList from "@material-ui/core/MenuList/MenuList";
import Paper from "@material-ui/core/Paper/Paper";
import Popper from "@material-ui/core/Popper/Popper";
import { makeStyles } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField/TextField";
import { MoreHoriz, Search, ViewListOutlined, ViewQuiltOutlined } from "@material-ui/icons";
import LocalBarOutlinedIcon from "@material-ui/icons/LocalBarOutlined";
import React from "react";
import { Link, useHistory, useLocation } from "react-router-dom";
import LayoutBox from "../../components/LayoutBox";
import SecondaryMenu from "./secondaryMenu";
import SortTemplate from "./SortTemplate";
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
}
function SelectTemplateMb(props: ActionBarLayout) {
  const classes = useStyles();
  const [open, setOpen] = React.useState(false);
  const anchorRef = React.useRef<HTMLButtonElement>(null);
  const [value, setValue] = React.useState("");
  const { layout } = props;
  const history = useHistory();
  const { pathname, search } = useLocation();
  const handleChange = (event: any) => {
    setValue(event.target.value);
  };
  const handleSearch = () => {
    const name = value;
    const newUrl = setUrl(search, "name", name);
    history.push(`${pathname}${newUrl}`);
  };
  const renderUserMessage = () => {
    if (layout === "card") {
      return (
        <Link to="/my-content-list?layout=list" style={{ color: "black" }}>
          <ViewListOutlined style={{ fontSize: "40px", marginTop: "8px" }} />
        </Link>
      );
    } else {
      return (
        <Link to="/my-content-list?layout=card" style={{ color: "black" }}>
          <ViewQuiltOutlined style={{ fontSize: "40px", marginTop: "8px" }} />
        </Link>
      );
    }
  };

  const handleClose = (event: React.MouseEvent<EventTarget>) => {
    if (anchorRef.current && anchorRef.current.contains(event.target as HTMLElement)) {
      return;
    }
    setOpen(false);
  };

  function handleListKeyDown(event: React.KeyboardEvent) {
    if (event.key === "Tab") {
      event.preventDefault();
      setOpen(false);
    }
  }
  const handleToggle = () => {
    setOpen((prevOpen) => !prevOpen);
  };
  return (
    <div className={classes.root}>
      <LayoutBox holderMin={40} holderBase={202} mainBase={1517}>
        <Hidden only={["md", "lg", "xl"]}>
          <Grid container spacing={3}>
            <Grid item xs={8} sm={8}>
              <Button variant="contained" color="primary" className={classes.createBtn}>
                Create +
              </Button>
            </Grid>
            <Grid container item xs={4} sm={4} justify="flex-end" alignItems="center" style={{ fontSize: "24px" }}>
              <LocalBarOutlinedIcon />
            </Grid>
            <Grid style={{ display: "none" }} item xs={4} sm={4} className={classes.tabMb}>
              {renderUserMessage()}
              <MoreHoriz style={{ fontSize: "40px" }} onClick={handleToggle} />
              <Popper
                open={open}
                anchorEl={anchorRef.current}
                role={undefined}
                transition
                disablePortal
                style={{ position: "absolute", top: 30, right: 0, zIndex: 999 }}
              >
                {({ TransitionProps, placement }) => (
                  <Grow
                    {...TransitionProps}
                    style={{
                      transformOrigin: placement === "bottom" ? "center top" : "center bottom",
                    }}
                  >
                    <Paper>
                      <ClickAwayListener onClickAway={handleClose}>
                        <MenuList autoFocusItem={open} id="menu-list-grow" onKeyDown={handleListKeyDown}>
                          <MenuItem onClick={handleClose}>Profile</MenuItem>
                          <MenuItem onClick={handleClose}>My account</MenuItem>
                          <MenuItem onClick={handleClose}>Logout</MenuItem>
                        </MenuList>
                      </ClickAwayListener>
                    </Paper>
                  </Grow>
                )}
              </Popper>
            </Grid>
            <Grid item xs={12} sm={12} style={{ textAlign: "center", display: "none" }}>
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
  showMyOnly: boolean;
}
function SelectTemplate(props: SecondaryMenuProps) {
  const classes = useStyles();
  const { layout } = props;
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
    const newUrl = setUrl(search, "myOnly", myOnly);
    history.push(`${pathname}${newUrl}`);
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
                  control={<Checkbox color="primary" onChange={handleIsMyOnly} />}
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
      <SelectTemplateMb layout={layout} />
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
}
export default function ActionBar(props: ActionBarProps) {
  const { layout, status, showMyOnly, subStatus } = props;
  const classes = useStyles();
  return (
    <div className={classes.navigation}>
      <SecondaryMenu layout={layout} status={status} showMyOnly={showMyOnly} />
      <SelectTemplate layout={layout} status={status} showMyOnly={showMyOnly} />
      <SortTemplate status={status} subStatus={subStatus} />
    </div>
  );
}
