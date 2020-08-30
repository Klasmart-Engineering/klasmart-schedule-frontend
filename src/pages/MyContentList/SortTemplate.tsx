import { Grid, Menu, MenuItem, withStyles } from "@material-ui/core";
import FormControl from "@material-ui/core/FormControl";
import Hidden from "@material-ui/core/Hidden";
import InputBase from "@material-ui/core/InputBase/InputBase";
import NativeSelect from "@material-ui/core/NativeSelect/NativeSelect";
import { makeStyles } from "@material-ui/core/styles";
import Tab from "@material-ui/core/Tab";
import Tabs from "@material-ui/core/Tabs";
import { MoreHoriz } from "@material-ui/icons";
import ImportExportIcon from "@material-ui/icons/ImportExport";
import React, { useEffect } from "react";
import { useHistory, useLocation } from "react-router-dom";
import LayoutBox from "../../components/LayoutBox";
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

function setUrl(search: string, param: string, value: string) {
  const query = new URLSearchParams(search);
  let newUrl: any;
  console.log(typeof value);
  if (query.get(param)) {
    if (!value || value === "0") {
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

interface SubUnpublishedProps {
  subStatus: string;
}
function SubUnpublished(props: SubUnpublishedProps) {
  const classes = useStyles();
  const history = useHistory();
  const { pathname, search } = useLocation();
  const { subStatus } = props;
  const [value, setValue] = React.useState<string>("draft");
  const handleChange = (event: React.ChangeEvent<{}>, newValue: string) => {
    setValue(newValue);
    const newUrl = setUrl(search, "subStatus", newValue);
    history.push(`${pathname}${newUrl}`);
  };
  useEffect(() => {
    setValue(subStatus || "draft");
  }, [subStatus]);
  return (
    <Tabs className={classes.tabs} value={value} onChange={handleChange} indicatorColor="primary" textColor="primary" centered>
      <Tab value={"draft"} label="Draft" />
      <Tab value={"pending"} label="Waiting for Approval" />
      <Tab value={"rejected"} label="Rejected" />
    </Tabs>
  );
}
function setBulkAction(status: string) {
  let actions: string[];
  switch (status) {
    case "published":
      actions = ["moveToArchived"];
      break;
    case "pending":
      actions = [];
      break;
    case "unpublished":
      actions = ["delete"];
      break;
    case "archive":
      actions = ["republish", "delete"];
      break;
    case "sort":
      actions = ["Material Name(A-Z)", "Material Name(Z-A)", "Created On(New-Old)", "Created On(Old-New)"];
      break;
    default:
      actions = [];
  }
  return actions;
}
interface StatusProps {
  status: string;
  subStatus: string;
  sortBy: string;
  onHandleBulkAction: (act: string) => void;
}
export function SortTemplate(props: StatusProps) {
  const history = useHistory();
  const { pathname, search } = useLocation();
  const classes = useStyles();
  const { status, subStatus, sortBy } = props;
  const [value, setValue] = React.useState(0);
  const handleChange = (event: any) => {
    setValue(event.target.value);
    // 掉接口
    // 拿到选择后的content进行批量操作
    if (status === "published" || status === "unpublished") {
      if (event.target.value === "1") {
        props.onHandleBulkAction("delete");
      }
    }
    if (status === "archive") {
      if (event.target.value === "1") {
        props.onHandleBulkAction("publish");
      }
      if (event.target.value === "2") {
        props.onHandleBulkAction("delete");
      }
    }
    setValue(0);
  };
  const handleOrderChange = (event: any) => {
    const newUrl = setUrl(search, "sortBy", event.target.value);
    history.push(`${pathname}${newUrl}`);
  };
  useEffect(() => {
    setValue(0);
  }, []);
  const actions = setBulkAction(status);
  const options = actions.map((item, index) => (
    <option key={item + index} value={index + 1}>
      {item}
    </option>
  ));
  return (
    <div className={classes.root}>
      <LayoutBox holderMin={40} holderBase={202} mainBase={1517}>
        <Hidden only={["xs", "sm"]}>
          <hr style={{ borderColor: "#e0e0e0" }} />
          <Grid container spacing={3} alignItems="center" style={{ marginTop: "6px" }}>
            <Grid item sm={6} xs={6} md={3}>
              {actions.length > 0 && (
                <FormControl variant="outlined">
                  <NativeSelect id="demo-customized-select-native" value={value} onChange={handleChange} input={<BootstrapInput />}>
                    <option value={0}>Bulk Actions</option>
                    {options}
                  </NativeSelect>
                </FormControl>
              )}
            </Grid>
            {status === "unpublished" ? (
              <Grid item md={6}>
                <SubUnpublished subStatus={subStatus} />
              </Grid>
            ) : (
              <Hidden only={["xs", "sm"]}>
                <Grid item md={6}></Grid>
              </Hidden>
            )}
            <Grid container direction="row" justify="flex-end" alignItems="center" item sm={6} xs={6} md={3}>
              <FormControl>
                <NativeSelect id="demo-customized-select-native" value={sortBy} onChange={handleOrderChange} input={<BootstrapInput />}>
                  <option value={0}>Display By </option>
                  <option value={10}>Material Name(A-Z)</option>
                  <option value={20}>Material Name(Z-A)</option>
                  <option value={30}>Created On(New-Old)</option>
                  <option value={40}>Created On(Old-New)</option>
                </NativeSelect>
              </FormControl>
            </Grid>
          </Grid>
        </Hidden>
      </LayoutBox>
    </div>
  );
}
const sortOptions = ["Material Name(A-Z)", "Material Name(Z-A)", "Created On(New-Old)", "Created On(Old-New)"];

export function SortTemplateMb(props: StatusProps) {
  const history = useHistory();
  const classes = useStyles();
  const { pathname, search } = useLocation();
  const { status, subStatus, sortBy } = props;
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [anchorElLeft, setAnchorElLeft] = React.useState<null | HTMLElement>(null);
  const [selectedIndex, setSelectedIndex] = React.useState<number>();
  const { onHandleBulkAction } = props;
  const showActions = (event: any) => {
    setAnchorElLeft(event.currentTarget);
  };
  const handleActionItemClick = (event: any, index: number) => {
    setAnchorElLeft(null);
    if (status === "archive" && index === 0) {
      onHandleBulkAction("publish");
    } else {
      onHandleBulkAction("delete");
    }
  };
  const handleClose = () => {
    setAnchorElLeft(null);
  };
  const showSort = (event: any) => {
    setAnchorEl(event.currentTarget);
  };
  const handleMenuItemClick = (event: any, index: number) => {
    selectedIndex === index ? setSelectedIndex(undefined) : setSelectedIndex(index);
    setAnchorEl(null);
    console.log(index, selectedIndex);
    let newUrl: string;
    if (index === selectedIndex) {
      newUrl = setUrl(search, "sortBy", "");
    } else {
      newUrl = setUrl(search, "sortBy", String((index + 1) * 10));
    }
    history.push(`${pathname}${newUrl}`);
  };
  const handleSortClose = () => {
    setAnchorEl(null);
  };
  const actions = setBulkAction(status);
  useEffect(() => {
    if (sortBy) {
      setSelectedIndex(Number(sortBy) / 10 - 1);
    }
  }, [sortBy]);
  return (
    <div className={classes.root}>
      <LayoutBox holderMin={40} holderBase={202} mainBase={1517}>
        <Hidden only={["md", "lg", "xl"]}>
          <hr style={{ borderColor: "#e0e0e0" }} />
          <Grid container alignItems="center" style={{ marginTop: "6px", position: "relative" }}>
            <Grid item sm={10} xs={10}>
              {status === "unpublished" && <SubUnpublished subStatus={subStatus} />}
            </Grid>
            <Grid container justify="flex-end" alignItems="center" item sm={2} xs={2}>
              {actions.length > 0 && <MoreHoriz onClick={showActions} />}
              <Menu anchorEl={anchorElLeft} keepMounted open={Boolean(anchorElLeft)} onClose={handleClose}>
                {actions.map((item, index) => (
                  <MenuItem key={item} onClick={(event) => handleActionItemClick(event, index)}>
                    {item}
                  </MenuItem>
                ))}
              </Menu>
              <ImportExportIcon onClick={showSort} />
              <Menu anchorEl={anchorEl} keepMounted open={Boolean(anchorEl)} onClose={handleSortClose}>
                {sortOptions.map((item, index) => (
                  <MenuItem key={item} selected={index === selectedIndex} onClick={(event) => handleMenuItemClick(event, index)}>
                    {item}
                  </MenuItem>
                ))}
              </Menu>
            </Grid>
          </Grid>
        </Hidden>
      </LayoutBox>
    </div>
  );
}
