import { withStyles } from "@material-ui/core";
import { Grid } from "@material-ui/core";
import FormControl from "@material-ui/core/FormControl";
import Hidden from "@material-ui/core/Hidden";
import InputBase from "@material-ui/core/InputBase/InputBase";
import NativeSelect from "@material-ui/core/NativeSelect/NativeSelect";
import { makeStyles } from "@material-ui/core/styles";
import Tab from "@material-ui/core/Tab";
import Tabs from "@material-ui/core/Tabs";
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

interface SubUnpublishedProps {
  subStatus: string;
}
function SubUnpublished(props: SubUnpublishedProps) {
  const classes = useStyles();
  const history = useHistory();
  const { pathname, search } = useLocation();
  const { subStatus } = props;
  const [value, setValue] = React.useState(0);
  const handleChange = (event: React.ChangeEvent<{}>, newValue: number) => {
    setValue(newValue);
    let value: string = "";
    if (newValue === 0) {
      value = "draft";
    }
    if (newValue === 1) {
      value = "pending";
    }
    if (newValue === 2) {
      value = "rejected";
    }
    const newUrl = setUrl(search, "subStatus", value);
    history.push(`${pathname}${newUrl}`);
  };

  useEffect(() => {
    function getDefaultValue() {
      let defaultValue = 0;
      if (subStatus === "draft") defaultValue = 0;
      if (subStatus === "pending") defaultValue = 1;
      if (subStatus === "rejected") defaultValue = 2;
      return defaultValue;
    }
    setValue(getDefaultValue());
  }, [subStatus]);
  return (
    <Tabs className={classes.tabs} value={value} onChange={handleChange} indicatorColor="primary" textColor="primary" centered>
      <Tab value={0} label="Draft" />
      <Tab value={1} label="Waiting for Approval" />
      <Tab value={2} label="Rejected" />
    </Tabs>
  );
}

interface StatusProps {
  status: string;
  subStatus: string;
}
export default function SortTemplate(props: StatusProps) {
  const history = useHistory();
  const { pathname, search } = useLocation();
  const classes = useStyles();
  const { status, subStatus } = props;
  const [value, setValue] = React.useState(0);
  const [orderValue, setOrderValue] = React.useState(0);
  const handleChange = (event: any) => {
    setValue(event.target.value);
    // 掉接口
    // 拿到选择后的content进行批量操作
    console.log(event.target.value);
  };
  const handleOrderChange = (event: any) => {
    setOrderValue(event.target.value);
    const newUrl = setUrl(search, "sortBy", event.target.value);
    history.push(`${pathname}${newUrl}`);
  };
  useEffect(() => {
    setValue(0);
    setOrderValue(0);
  }, [status]);
  function setBulkAction() {
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
      case "archived":
        actions = ["republished", "delete"];
        break;
      default:
        actions = [];
    }
    return actions;
  }
  const actions = setBulkAction();
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
                <SubUnpublished subStatus={status} />
              </Grid>
            ) : (
              <Hidden only={["xs", "sm"]}>
                <Grid item md={6}></Grid>
              </Hidden>
            )}
            <Grid container direction="row" justify="flex-end" alignItems="center" item sm={6} xs={6} md={3}>
              <FormControl>
                <NativeSelect id="demo-customized-select-native" value={orderValue} onChange={handleOrderChange} input={<BootstrapInput />}>
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
      <SortTemplateMb status={status} subStatus={subStatus} />
    </div>
  );
}
function SortTemplateMb(props: StatusProps) {
  const classes = useStyles();
  const [value, setValue] = React.useState("");
  const [orderValue, setOrderValue] = React.useState("");
  const handleChange = (event: any) => {
    setValue(event.target.value);
  };
  const handleOrderChange = (event: any) => {
    setOrderValue(event.target.value);
  };
  const { status, subStatus } = props;
  return (
    <div className={classes.root}>
      <LayoutBox holderMin={40} holderBase={202} mainBase={1517}>
        <Hidden only={["md", "lg", "xl"]}>
          <hr style={{ borderColor: "#e0e0e0" }} />
          <Grid container spacing={3} alignItems="center" style={{ marginTop: "6px" }}>
            <Grid item sm={6} xs={6} md={6}>
              <FormControl variant="outlined">
                <NativeSelect id="demo-customized-select-native" value={value} onChange={handleChange} input={<BootstrapInput />}>
                  <option value={10}>Bulk Actions</option>
                  <option value={20}>Remove</option>
                  <option value={30}>Bulk Remove</option>
                </NativeSelect>
              </FormControl>
            </Grid>
            <Grid container direction="row" justify="flex-end" alignItems="center" item sm={6} xs={6} md={3}>
              <FormControl>
                <NativeSelect id="demo-customized-select-native" value={orderValue} onChange={handleOrderChange} input={<BootstrapInput />}>
                  <option value="">Display By </option>
                  <option value={10}>Material Name(A-Z)</option>
                  <option value={20}>Material Name(Z-A)</option>
                  <option value={30}>Created On(New-Old)</option>
                  <option value={30}>Created On(Old-New)</option>
                </NativeSelect>
              </FormControl>
            </Grid>
          </Grid>
          {status === "unpublished" ? (
            <Grid container alignItems="center" style={{ marginTop: "6px" }}>
              <Grid item sm={8} xs={8}>
                <SubUnpublished subStatus={subStatus} />
              </Grid>
              <Grid container justify="flex-end" alignItems="center" item sm={4} xs={4}>
                <ImportExportIcon />
              </Grid>
            </Grid>
          ) : (
            <Hidden only={["xs", "sm"]}>
              <Grid item md={6}></Grid>
            </Hidden>
          )}
        </Hidden>
      </LayoutBox>
    </div>
  );
}
