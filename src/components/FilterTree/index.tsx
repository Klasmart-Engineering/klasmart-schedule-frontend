import { Box } from "@material-ui/core";
import Checkbox from "@material-ui/core/Checkbox";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import IconButton from "@material-ui/core/IconButton";
import Popover from "@material-ui/core/Popover";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import Tooltip from "@material-ui/core/Tooltip";
import Typography from "@material-ui/core/Typography";
import { ArrowBackIosOutlined, ArrowForwardIosOutlined, FirstPageOutlined, LastPageOutlined } from "@material-ui/icons";
import AccessibilityNewIcon from "@material-ui/icons/AccessibilityNew";
import CloseIcon from "@material-ui/icons/Close";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import React from "react";
import * as Types from "../../api/api-ko-schema.auto";
import { ConnectionDirection } from "@api/api-ko-schema.auto";
import { d } from "@locale/LocaleManager";
import { FilterSchoolInfo } from "../../types/scheduleTypes";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      padding: "0px 6px 0px 6px",
    },
    containerRoot: {
      flexGrow: 1,
      padding: "0px 10px 20px 10px;",
    },
    filterArrow: {
      float: "left",
      marginRight: "8px",
      cursor: "pointer",
    },
    content: {
      padding: "6px",
    },
    group: {
      marginLeft: 0,
      "& $content": {
        paddingLeft: theme.spacing(2),
      },
    },
    expanded: {},
    selected: {},
    label: {
      fontWeight: "inherit",
      height: "18px",
      padding: "10px 0px 10px 8px;",
      borderRadius: "16px",
      fontSize: "15px",
      overflowWrap: "break-word",
      overflow: "hidden",
      textOverflow: "ellipsis",
      whiteSpace: "nowrap",
    },
    labelRoot: {
      marginTop: "-10px",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
    },
    labelIcon: {
      marginRight: theme.spacing(1),
      position: "absolute",
      top: "14px",
      left: "-6px",
    },
    labelText: {
      fontWeight: "inherit",
      flexGrow: 1,
      overflowWrap: "break-word",
    },
    subsets: {
      fontWeight: "bold",
      height: "20px",
      padding: "10px 0px 10px 8px;",
      borderRadius: "16px",
      fontSize: "15px",
      overflow: "hidden",
      textOverflow: "ellipsis",
      whiteSpace: "nowrap",
      overflowWrap: "break-word",
    },
    maxLabel: {
      fontWeight: "inherit",
      height: "18px",
      padding: "10px 0px 10px 8px;",
      borderRadius: "16px",
      fontSize: "16px",
      overflowWrap: "break-word",
    },
    filterRouter: {
      width: "94%",
      margin: "0 auto",
      borderTop: "1px solid #eeeeee",
    },
    abbreviation: {
      width: "56%",
    },
    abbreviationLabel: {
      overflow: "hidden",
      textOverflow: "ellipsis",
      whiteSpace: "nowrap",
      overflowWrap: "break-word",
    },
    typography: {
      padding: "10px",
      fontSize: "12px",
      cursor: "pointer",
    },
    filterLabel: {
      padding: "9px",
      width: "78%",
      borderRadius: "16px",
      cursor: "pointer",
      marginLeft: "-8px",
      "&:hover": {
        backgroundColor: "#F5F5F5",
      },
      display: "flex",
      justifyContent: "space-between",
    },
    filterLabelActive: {
      marginLeft: "-8px",
      padding: "9px",
      width: "78%",
      borderRadius: "16px",
      cursor: "pointer",
      backgroundColor: "rgba(14, 120, 213, 0.08)",
    },
  })
);

function FilterOnlyMineBox() {
  return (
    <Typography variant="caption" color="inherit">
      <FormControlLabel
        control={<Checkbox name="Only Mine" color="primary" />}
        label={d("Only Mine").t("schedule_filter_only_mine")}
        style={{ transform: "scale(0.7)", marginRight: "0px" }}
      />
    </Typography>
  );
}

interface FilterLabelProps {
  name: string;
  id: string;
  showIcon: boolean;
  handleChangeShowAnyTime: (is_show: boolean, name: string, class_id?: string, user_id?: string) => void;
  hideActive: boolean;
  handleChangeClassId: (id: string, checked: boolean) => void;
  check: boolean;
  disabled: boolean;
  type?: "user" | "class";
}

function FilterLabel(props: FilterLabelProps) {
  const { name, id, showIcon, handleChangeShowAnyTime, hideActive, handleChangeClassId, check, disabled, type } = props;
  const template = <span style={{ fontWeight: 500, fontSize: "15px", marginLeft: "4px" }}>{name}</span>;
  const primeElement = (
    <Checkbox
      disabled={disabled && !check}
      checked={check}
      color="primary"
      onClick={(e) => {
        handleChangeClassId(id, (e.target as HTMLInputElement).checked);
      }}
      inputProps={{ "aria-label": "secondary checkbox" }}
    />
  );
  const classes = useStyles();
  const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(null);
  const open = Boolean(anchorEl);
  const oid = open ? "simple-popover" : undefined;
  const handleClose = () => {
    setAnchorEl(null);
  };
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const rgb = Math.floor(Math.random() * 256);
  return (
    <Box style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
      <AccessibilityNewIcon style={{ visibility: showIcon ? "visible" : "hidden" }} />
      {primeElement}
      <div className={classes.filterLabel}>
        {template}
        {FilterOnlyMineBox}
        <Popover
          id={oid}
          open={open}
          anchorEl={anchorEl}
          onClose={handleClose}
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "center",
          }}
          transformOrigin={{
            vertical: "bottom",
            horizontal: "center",
          }}
        >
          <Typography
            className={classes.typography}
            onClick={() => {
              handleChangeShowAnyTime(true, name, type === "class" ? id : "", type === "user" ? id : "");
              setAnchorEl(null);
            }}
          >
            {d("View Anytime Study").t("schedule_filter_view_any_time_study")}
          </Typography>
        </Popover>
        <Typography variant="caption" color="inherit" style={{ display: "flex", alignItems: "center", transform: "scale(0.8)" }}>
          <div
            style={{
              width: "12px",
              height: "12px",
              backgroundColor: `rgb(${rgb},${rgb},${rgb})`,
              borderRadius: "20px",
              display: "none",
            }}
          />{" "}
          {hideActive && (
            <MoreVertIcon
              aria-describedby={id}
              onClick={(e) => {
                handleClick(e as any);
              }}
            />
          )}
        </Typography>
      </div>
    </Box>
  );
}

function FilterOverall(props: FilterTreeProps) {
  const {
    classDataBySchool,
    handleChangeShowAnyTime,
    pageY,
    hideClassMenu,
    handleChangeOnlyMine,
    stateOnlyMine,
    total,
    pageInfo,
    getClassesConnection,
    getUserOfUndefined,
    type,
  } = props;
  // const total = classDataBySchool.classes.length;
  const pageSize = 5;
  const [page, setPage] = React.useState(1);
  const [checkMine, setCheckMine] = React.useState(false);
  const handleChange = async (cursor: string, direction: ConnectionDirection.Forward | ConnectionDirection.Backward, page: number) => {
    if (type === "user") {
      getUserOfUndefined && (await getUserOfUndefined(cursor, true, direction));
    } else {
      getClassesConnection && (await getClassesConnection(cursor, classDataBySchool.school_id, true, direction));
    }
    setPage(page);
  };
  const reBytesStr = (str: string, len: number) => {
    let bytesNum = 0;
    let afterCutting = "";
    for (let i = 0, lens = str.length; i < lens; i++) {
      bytesNum += str.charCodeAt(i) > 255 ? 2 : 1;
      if (bytesNum > len) break;
      afterCutting = str.substring(0, i + 1);
    }
    return bytesNum > len ? `${afterCutting} ....` : afterCutting;
  };

  const textEllipsis = (value?: string) => {
    const CharacterCount = 16;
    return value ? reBytesStr(value, CharacterCount) : "";
  };

  const getCLassData = (t: string) => {
    let data: string[] = [];
    if (t === "Mine") {
      const filterMine = classDataBySchool.classes.filter((item) => {
        return item.showIcon;
      });
      data = filterMine.map((item) => {
        return `${type}+${item.class_id}+${classDataBySchool.school_id}`;
      });
    }
    if (t === "All") {
      data = classDataBySchool.classes.map((item) => {
        return `${type}+${item.class_id}+${classDataBySchool.school_id}`;
      });
    }
    return data;
  };
  const handleChangeClassId = (id: string, checked: boolean) => {
    let data: string[];
    if (checked) {
      if (["Mine", "All"].includes(id)) {
        data = getCLassData(id);
      } else {
        const classId = `${type}+${id}+${classDataBySchool.school_id}`;
        data = [...stateOnlyMine, classId];
      }
    } else {
      if (["Mine", "All"].includes(id)) {
        data = stateOnlyMine.filter((val) => {
          return getCLassData(id).indexOf(val) === -1;
        });
      } else {
        const classId = `${type}+${id}+${classDataBySchool.school_id}`;
        data = stateOnlyMine.filter((val) => {
          return classId !== val;
        });
      }
    }
    handleChangeOnlyMine(data);
  };

  const stateOnlyMineCheck = (id: string) => {
    const cid = `${type}+${id}+${classDataBySchool.school_id}`;
    return stateOnlyMine.includes(cid);
  };

  const template = !total ? (
    <div style={{ textAlign: "center", padding: "16px" }}>{d("No Data").t("schedule_filter_no_data")}</div>
  ) : (
    <>
      <ul style={{ marginLeft: "-50px" }}>
        {classDataBySchool.classes.map((item) => {
          return (
            <FilterLabel
              key={item.class_id}
              hideActive={true}
              name={item.name}
              id={item.class_id}
              showIcon={item.showIcon}
              handleChangeShowAnyTime={handleChangeShowAnyTime}
              handleChangeClassId={handleChangeClassId}
              check={stateOnlyMineCheck(item.class_id)}
              disabled={checkMine}
              type={type}
            />
          );
        })}
      </ul>
      {pageSize < total && (
        <Box style={{ display: "flex", justifyContent: "space-evenly", width: "60%", margin: "auto", padding: "2px 0px 3px 0px" }}>
          <IconButton
            size="small"
            color="inherit"
            disabled={!pageInfo?.hasPreviousPage}
            onClick={() => {
              handleChange("", ConnectionDirection.Forward, 1);
            }}
          >
            <FirstPageOutlined fontSize="small" />
          </IconButton>
          <IconButton
            size="small"
            color="inherit"
            disabled={!pageInfo?.hasPreviousPage}
            onClick={() => {
              handleChange(pageInfo?.startCursor as string, ConnectionDirection.Backward, page - 1);
            }}
          >
            <ArrowBackIosOutlined fontSize="small" style={{ width: "14px" }} />
          </IconButton>
          <span
            style={{
              fontSize: "14px",
              paddingTop: "2px",
            }}
          >
            {page}/{Math.ceil(total / pageSize)}
          </span>
          <IconButton
            size="small"
            color="inherit"
            disabled={!pageInfo?.hasNextPage}
            onClick={() => {
              handleChange(pageInfo?.endCursor as string, ConnectionDirection.Forward, page + 1);
            }}
          >
            <ArrowForwardIosOutlined fontSize="small" style={{ width: "14px" }} />
          </IconButton>
          <IconButton
            size="small"
            color="inherit"
            disabled={!pageInfo?.hasNextPage}
            onClick={() => {
              handleChange("", ConnectionDirection.Backward, Math.ceil(total / pageSize));
            }}
          >
            <LastPageOutlined fontSize="small" />
          </IconButton>
        </Box>
      )}
    </>
  );
  return (
    <Box
      style={{
        position: "absolute",
        width: "280px",
        left: "23.1%",
        top: pageY + "px",
        zIndex: 999,
        boxShadow: "0px 3px 3px -2px rgb(0 0 0 / 20%), 0px 3px 4px 0px rgb(0 0 0 / 14%), 0px 1px 8px 0px rgb(0 0 0 / 12%)",
        backgroundColor: "white",
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 10px 0px 10px" }}>
        <span style={{ fontSize: "17px", fontWeight: "bold" }}>
          <Tooltip title={classDataBySchool.school_name as string} placement="top-start">
            <span>{textEllipsis(classDataBySchool.school_name)}</span>
          </Tooltip>
          {classDataBySchool.onlyMine && (
            <Typography variant="caption" color="inherit">
              <FormControlLabel
                control={
                  <Checkbox
                    name="Only Mine"
                    onClick={(e) => {
                      setCheckMine((e.target as HTMLInputElement).checked);
                      handleChangeClassId("Mine", (e.target as HTMLInputElement).checked);
                    }}
                    color="primary"
                    style={{ marginTop: "-4px" }}
                  />
                }
                label={d("Only Mine").t("schedule_filter_only_mine")}
                style={{ transform: "scale(0.7)", marginRight: "0px" }}
              />
            </Typography>
          )}
        </span>
        <CloseIcon
          style={{ cursor: "pointer" }}
          onClick={() => {
            hideClassMenu();
          }}
        />
      </div>
      {template}
    </Box>
  );
}

interface FilterTreeProps {
  classDataBySchool: FilterSchoolInfo;
  handleChangeShowAnyTime: (is_show: boolean, name: string, class_id?: string, user_id?: string) => void;
  pageY: number;
  hideClassMenu: () => void;
  handleChangeOnlyMine: (data: string[]) => void;
  stateOnlyMine: string[];
  total?: number;
  type?: "user" | "class";
  getClassesConnection?: (
    cursor: string,
    school_id: string,
    loading: boolean,
    direction: ConnectionDirection.Forward | ConnectionDirection.Backward
  ) => void;
  getUserOfUndefined?: (cursor: string, loading: boolean, direction: ConnectionDirection.Forward | ConnectionDirection.Backward) => void;
  pageInfo?: Types.Maybe<
    { __typename?: "ConnectionPageInfo" } & Pick<Types.ConnectionPageInfo, "hasNextPage" | "hasPreviousPage" | "startCursor" | "endCursor">
  >;
}

export default function FilterTree(props: FilterTreeProps) {
  const {
    classDataBySchool,
    handleChangeShowAnyTime,
    pageY,
    hideClassMenu,
    handleChangeOnlyMine,
    stateOnlyMine,
    total,
    getClassesConnection,
    type,
    pageInfo,
    getUserOfUndefined,
  } = props;
  return (
    <FilterOverall
      stateOnlyMine={stateOnlyMine}
      handleChangeOnlyMine={handleChangeOnlyMine}
      hideClassMenu={hideClassMenu}
      classDataBySchool={classDataBySchool}
      handleChangeShowAnyTime={handleChangeShowAnyTime}
      pageY={pageY}
      total={total}
      getClassesConnection={getClassesConnection}
      pageInfo={pageInfo}
      type={type}
      getUserOfUndefined={getUserOfUndefined}
    />
  );
}
