import { Box, TextField } from "@material-ui/core";
import Checkbox from "@material-ui/core/Checkbox";
import Collapse from "@material-ui/core/Collapse";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Popover from "@material-ui/core/Popover";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import { SvgIconProps } from "@material-ui/core/SvgIcon";
import Typography from "@material-ui/core/Typography";
import AccessibilityNewIcon from "@material-ui/icons/AccessibilityNew";
import ArrowDropDownIcon from "@material-ui/icons/ArrowDropDown";
import KeyboardArrowDownOutlinedIcon from "@material-ui/icons/KeyboardArrowDownOutlined";
import KeyboardArrowUpOutlinedIcon from "@material-ui/icons/KeyboardArrowUpOutlined";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import { TreeView } from "@material-ui/lab";
import TreeItem, { TreeItemProps } from "@material-ui/lab/TreeItem";
import { AsyncTrunkReturned } from "@reducers/type";
import { PayloadAction } from "@reduxjs/toolkit";
import clsx from "clsx";
import React, { useMemo } from "react";
import { useDispatch } from "react-redux";
import { ConnectionDirection } from "../../api/api-ko-schema.auto";
import { GetClassFilterListQuery, GetSchoolsFilterListQuery, GetUserQuery } from "../../api/api-ko.auto";
import { EntityScheduleShortInfo } from "../../api/api.auto";
import { MockOptionsOptionsItem } from "../../api/extra";
import FilterTree from "../../components/FilterTree";
import { d, t } from "../../locale/LocaleManager";
import { modelSchedule } from "../../models/ModelSchedule";
import { actError } from "../../reducers/notify";
import { getScheduleMockOptionsResponse, ScheduleFilterSubject } from "../../reducers/schedule";
import {
  classTypeLabel,
  EntityScheduleSchoolInfo,
  FilterDataItemsProps,
  FilterItemInfo,
  filterOptionItem,
  FilterQueryTypeProps,
  memberType,
  modeViewType,
  timestampType,
} from "../../types/scheduleTypes";

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
      fontSize: "18px",
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
    maxlabel: {
      fontWeight: "inherit",
      height: "18px",
      padding: "10px 0px 10px 8px;",
      borderRadius: "16px",
      fontSize: "16px",
      overflowWrap: "break-word",
    },
    fliterRouter: {
      width: "94%",
      margin: "0 auto",
      borderTop: "1px solid #eeeeee",
    },
    abbreviation: {
      width: "56%",
    },
    abbreviationLable: {
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
    classTypeColor: {
      width: "10px",
      height: "10px",
      borderRadius: "10px",
      marginRight: "20px",
    },
    changeColor: {
      "&:hover": {
        backgroundColor: "RGB(245,245,245)",
      },
    },
    schoolTemplateStyleTitle: {
      cursor: "pointer",
      display: "flex",
      alignItems: "center",
      paddingLeft: "1em",
      marginBottom: "0",
    },
    schoolTemplateStyleLabel: {
      cursor: "pointer",
      display: "flex",
      alignItems: "center",
      paddingLeft: "1em",
      marginTop: "-0.4em",
    },
    schoolTemplateStyleMore: {
      color: "RGB(0,98,192)",
      display: "flex",
      alignItems: "center",
      paddingLeft: "5em",
      fontSize: "13px",
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
  })
);

type StyledTreeItemProps = TreeItemProps & {
  bgColor?: string;
  color?: string;
  labelIcon?: React.ElementType<SvgIconProps>;
  labelInfo?: string;
  labelText?: string;
  handleChangeShowAnyTime: (is_show: boolean, name: string, class_id: string, user_id?: string) => void;
  isShowIcon?: boolean;
  isOnlyMine?: boolean;
  item: FilterDataItemsProps;
  handleChangeExits: (data: string[], checked: boolean, node: FilterItemInfo, existData: string[]) => void;
  stateOnlyMine: string[];
  handleSetStateOnlySelectMine: (mine: string, is_check: boolean) => void;
  stateOnlySelectMine: string[];
  stateOnlySelectMineExistData: any;
  privilegedMembers: (member: memberType) => boolean;
  fullOtherSelectionStatusSet: boolean;
  openClassMenu: (pageY: number, schoolItem: { id: string; name: string }) => void;
};

interface InterfaceSubject extends EntityScheduleShortInfo {
  program_id: string;
}

function StyledTreeItem(props: StyledTreeItemProps) {
  const classes = useStyles();
  const {
    labelText,
    labelIcon: LabelIcon,
    labelInfo,
    color,
    bgColor,
    handleChangeShowAnyTime,
    isShowIcon,
    isOnlyMine,
    item,
    stateOnlyMine,
    handleChangeExits,
    handleSetStateOnlySelectMine,
    stateOnlySelectMine,
    stateOnlySelectMineExistData,
    privilegedMembers,
    fullOtherSelectionStatusSet,
    openClassMenu,
    ...other
  } = props;
  const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(null);
  const minimumDom = Array.isArray(props.children) && (props.children as []).length < 1;
  const maxDom = ["School+1", "Others+1", "Programs+1", "ClassTypes+1"].includes(props.nodeId);
  const rgb = Math.floor(Math.random() * 256);
  const [label, self_id, school_id] = props.nodeId.split("+");
  const filterItem: FilterItemInfo = { label: label, self_id: self_id, school_id: school_id };
  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;

  const getClassTypeColor = (label: string) => {
    return [
      { id: "OnlineClass", color: "#0E78D5", icon: "" },
      { id: "OfflineClass", color: "#1BADE5", icon: "" },
      { id: "Homework", color: "#13AAA9", icon: "" },
      { id: "Task", color: "#AFBA0A", icon: "" },
    ].filter((item) => item.id === label)[0].color;
  };

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const isDisable = (): boolean => {
    let id: string = "";
    let menus: string = "";
    if (filterItem.label === "other") {
      menus = "Others+1";
      id = `${filterItem.label}+${filterItem.self_id}`;
    }
    if (filterItem.label === "class" && filterItem.school_id) {
      menus = filterItem.school_id === "Others" ? "Others+1" : filterItem.school_id;
      id = `${filterItem.label}+${filterItem.self_id}+${filterItem.school_id}`;
    }
    return stateOnlySelectMineExistData[menus] ? !stateOnlySelectMineExistData[menus].includes(id) : false;
  };

  const statusCheck = () => {
    let allStatus = false;
    if (item.id === "class+All+Others") {
      allStatus = fullOtherSelectionStatusSet;
    } else {
      allStatus = stateOnlyMine.includes(item.id);
    }
    return allStatus;
  };
  return (
    <Box style={{ position: "relative" }}>
      {((minimumDom && filterItem.self_id !== "nodata" && self_id) || item.id === "All_My_Schools") && (
        <Checkbox
          color="primary"
          inputProps={{ "aria-label": "primary checkbox" }}
          onClick={(e) => {
            handleChangeExits([item.id], (e.target as HTMLInputElement).checked, filterItem, item.existData);
          }}
          checked={statusCheck()}
          disabled={isDisable()}
          style={{ position: "absolute", top: "5px", left: "10px" }}
        />
      )}
      {LabelIcon && isShowIcon && (privilegedMembers("Admin") || privilegedMembers("School")) && (
        <LabelIcon color="inherit" className={classes.labelIcon} />
      )}
      <TreeItem
        label={
          <div className={classes.labelRoot}>
            <div
              style={{ display: "flex", alignItems: "center", width: "58%" }}
              className={isOnlyMine ? classes.abbreviation : ""}
              onClick={(e) => {
                if (!self_id) openClassMenu(e.pageY, { id: filterItem.school_id, name: filterItem.label });
              }}
            >
              <Typography
                variant="body2"
                className={clsx(
                  Array.isArray(props.children) && !props.children ? classes.subsets : classes.label,
                  isOnlyMine ? classes.abbreviationLable : ""
                )}
              >
                {labelText}
              </Typography>
            </div>
            {isOnlyMine && (
              <Typography variant="caption" color="inherit">
                <FormControlLabel
                  control={<Checkbox name="Only Mine" color="primary" />}
                  onClick={(e) => {
                    handleChangeExits(
                      item.onLyMineData,
                      (e.target as HTMLInputElement).checked,
                      { label: "onlyMine", self_id: item.id, school_id: "" },
                      item.existData
                    );
                    handleSetStateOnlySelectMine(item.id, (e.target as HTMLInputElement).checked);
                    e.stopPropagation();
                  }}
                  label={d("Only Mine").t("schedule_filter_only_mine")}
                  style={{ transform: "scale(0.7)", marginRight: "0px" }}
                  checked={stateOnlySelectMine.includes(item.id)}
                />
              </Typography>
            )}
            {minimumDom &&
              filterItem.self_id !== "nodata" &&
              ["class", "other"].includes(filterItem.label) &&
              filterItem.self_id !== "All" && (
                <>
                  <Popover
                    id={id}
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
                        handleChangeShowAnyTime(true, item.name, filterItem.self_id);
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
                    <MoreVertIcon
                      aria-describedby={id}
                      onClick={(e) => {
                        handleClick(e as any);
                      }}
                    />
                  </Typography>
                </>
              )}
            {filterItem.label === "classType" && (
              <div className={classes.classTypeColor} style={{ backgroundColor: getClassTypeColor(self_id) }}></div>
            )}
          </div>
        }
        classes={{
          root: classes.root,
          content: classes.content,
          expanded: classes.expanded,
          selected: classes.selected,
          group: classes.group,
          label: minimumDom ? (maxDom ? classes.maxlabel : classes.label) : classes.subsets,
        }}
        {...other}
      />
    </Box>
  );
}

interface SchoolTemplateProps {
  schoolsConnection?: GetSchoolsFilterListQuery;
  getSchoolsConnection: (cursor: string, value: string, loading: boolean) => any;
  getClassesConnection: (
    cursor: string,
    school_id: string,
    loading: boolean,
    direction: ConnectionDirection.Forward | ConnectionDirection.Backward
  ) => void;
  classesConnection?: GetClassFilterListQuery;
  openClassMenu?: (pageY: number, schoolItem: { id: string; name: string }) => void;
  closeClassMenu?: (type: "class" | "user") => void;
  setUserPageYFun?: () => void;
}
function SchoolTemplate(props: SchoolTemplateProps) {
  const { schoolsConnection, getSchoolsConnection, openClassMenu, closeClassMenu, setUserPageYFun } = props;
  const [checked, setChecked] = React.useState(false);
  const [edges, setEdges] = React.useState<any>([]);
  const [searchValue, setSearchValue] = React.useState<string>("");
  const [timer, setTimer] = React.useState<NodeJS.Timeout | null>(null);
  const handleChange = () => {
    closeClassMenu && closeClassMenu("class");
    setChecked((prev) => !prev);
  };
  const css = useStyles();
  const getSearcherResult = (value: string) => {
    if (timer) clearTimeout(timer);
    const timers = setTimeout(async () => {
      setSearchValue(value);
      await getSchoolsConnection("", value, false);
      setEdges([]);
    }, 500);
    setTimer(timers);
  };
  const getLastCursor = async () => {
    const schoolsConnectionItem = schoolsConnection?.schoolsConnection?.edges!;
    const edge = schoolsConnectionItem && schoolsConnectionItem[schoolsConnectionItem?.length - 1];
    const cursor = edge?.cursor ?? "";
    const edgesResult = await getSchoolsConnection(cursor, searchValue, true);
    edges.length ? setEdges([...edges, ...edgesResult]) : setEdges([...schoolsConnectionItem, ...edges, ...edgesResult]);
    setUserPageYFun && setUserPageYFun();
  };
  return (
    <Box>
      <div onClick={handleChange} className={css.schoolTemplateStyleTitle} style={{ marginBlockStart: "1em" }}>
        <span>
          {checked && <KeyboardArrowUpOutlinedIcon className={css.filterArrow} />}
          {!checked && <KeyboardArrowDownOutlinedIcon className={css.filterArrow} />}
        </span>
        <div className={clsx(css.changeColor, css.subsets)} style={{ width: "83%", paddingLeft: "1em" }}>
          {d("All My Schools").t("schedule_filter_all_my_schools")}
        </div>
      </div>
      <Collapse in={checked}>
        {((schoolsConnection?.schoolsConnection?.totalCount ?? 0) > 5 || searchValue) && (
          <div style={{ textAlign: "center", marginBlockStart: "1em" }}>
            <TextField
              id="filled-size-small"
              size="small"
              placeholder={d("Search School Name").t("schedule_search_school_name")}
              onChange={(e) => {
                getSearcherResult(e.target.value);
              }}
            />
          </div>
        )}
        <div>
          {(edges.length ? edges : schoolsConnection?.schoolsConnection?.edges)?.map((item: any) => {
            return (
              <div className={css.schoolTemplateStyleLabel} style={{ marginBlockStart: "1em", marginBlockEnd: "1em" }} key={item?.node?.id}>
                <Checkbox color="primary" inputProps={{ "aria-label": "primary checkbox" }} style={{ visibility: "hidden" }} />
                <div
                  className={clsx(css.changeColor, css.label)}
                  style={{ width: "78%", paddingLeft: "1em" }}
                  onClick={async (e) => {
                    openClassMenu && openClassMenu(e.pageY, { id: item?.node?.id, name: item?.node?.name });
                  }}
                >
                  {item?.node?.name}
                </div>
              </div>
            );
          })}
        </div>
        {schoolsConnection?.schoolsConnection?.pageInfo?.hasNextPage && (
          <p onClick={getLastCursor} className={css.schoolTemplateStyleMore}>
            {d("See More").t("schedule_detail_see_more")} <ArrowDropDownIcon />
          </p>
        )}
      </Collapse>
    </Box>
  );
}

interface FilterLabelProps {
  name: string;
  id: string;
  handleChangeShowAnyTime: (is_show: boolean, name: string, class_id?: string, user_id?: string) => void;
  handleChangeClassId: (id: string, checked: boolean) => void;
}

function FilterLabel(props: FilterLabelProps) {
  const { id, name, handleChangeShowAnyTime, handleChangeClassId } = props;
  const template = <span style={{ marginLeft: "4px" }}>{name}</span>;
  const primeElement = (
    <Checkbox
      color="primary"
      inputProps={{ "aria-label": "secondary checkbox" }}
      onClick={(e) => {
        handleChangeClassId(id, (e.target as HTMLInputElement).checked);
      }}
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
    <Box style={{ display: "flex", justifyContent: "center", alignItems: "center", paddingLeft: "20px", marginBottom: "10px" }}>
      {primeElement}
      <div className={classes.filterLabel}>
        {template}
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
              handleChangeShowAnyTime(true, name, id);
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
          <MoreVertIcon
            aria-describedby={id}
            onClick={(e) => {
              handleClick(e as any);
            }}
          />
        </Typography>
      </div>
    </Box>
  );
}

interface OtherTemplateProps {
  schoolsConnection?: GetSchoolsFilterListQuery;
  getSchoolsConnection: (cursor: string, value: string, loading: boolean) => any;
  getClassesConnection: (
    cursor: string,
    school_id: string,
    loading: boolean,
    direction: ConnectionDirection.Forward | ConnectionDirection.Backward
  ) => void;
  classesConnection?: GetClassFilterListQuery;
  openClassMenuByOther?: (pageY: number) => void;
  filterOtherClasses: GetClassFilterListQuery;
  getClassesWithoutSchool: (cursor: string, value: string, loading: boolean) => any;
  handleChangeShowAnyTime: (is_show: boolean, name: string, class_id?: string, user_id?: string) => void;
  handleChangeOnlyMine: (data: string[]) => void;
  stateOnlyMine: string[];
  closeClassMenu?: (type: "class" | "user") => void;
  setUndefinedLabelDom: (dom: HTMLDivElement | null) => void;
}
function OtherTemplate(props: OtherTemplateProps) {
  const {
    openClassMenuByOther,
    filterOtherClasses,
    getClassesWithoutSchool,
    handleChangeShowAnyTime,
    handleChangeOnlyMine,
    stateOnlyMine,
    closeClassMenu,
    setUndefinedLabelDom,
  } = props;
  const [checked, setChecked] = React.useState(false);
  const [edges, setEdges] = React.useState<any>([]);
  const [searchValue, setSearchValue] = React.useState<string>("");
  const [timer, setTimer] = React.useState<NodeJS.Timeout | null>(null);
  const handleChange = () => {
    closeClassMenu && closeClassMenu("user");
    setChecked((prev) => !prev);
  };

  const css = useStyles();
  const getSearcherResult = (value: string) => {
    if (timer) clearTimeout(timer);
    const timers = setTimeout(async () => {
      setSearchValue(value);
      await getClassesWithoutSchool("", value, false);
      setEdges([]);
    }, 500);
    setTimer(timers);
  };
  const getLastCursor = async () => {
    const classesConnectionItem = filterOtherClasses?.classesConnection?.edges!;
    const edge = classesConnectionItem && classesConnectionItem[classesConnectionItem?.length - 1];
    const cursor = edge?.cursor ?? "";
    const edgesResult = await getClassesWithoutSchool(cursor, searchValue, true);
    edges.length ? setEdges([...edges, ...edgesResult]) : setEdges([...classesConnectionItem, ...edges, ...edgesResult]);
  };
  const handleChangeClassId = (id: string, checked: boolean) => {
    let data: string[] = [];
    if (checked) {
      const classId = `class+${id}`;
      data = [...stateOnlyMine, classId];
    } else {
      const classId = `class+${id}`;
      data = stateOnlyMine.filter((val) => {
        return classId !== val;
      });
    }
    handleChangeOnlyMine(data);
  };
  return (
    <Box>
      <div onClick={handleChange} className={css.schoolTemplateStyleTitle} style={{ margin: "8px 0px 8px 0px" }}>
        <span>
          {checked && <KeyboardArrowUpOutlinedIcon className={css.filterArrow} />}
          {!checked && <KeyboardArrowDownOutlinedIcon className={css.filterArrow} />}
        </span>
        <div className={clsx(css.changeColor, css.subsets)} style={{ width: "83%", paddingLeft: "1em" }}>
          {d("Others").t("schedule_filter_others")}
        </div>
      </div>
      <Collapse in={checked}>
        {((filterOtherClasses?.classesConnection?.totalCount ?? 0) > 5 || searchValue) && (
          <div style={{ textAlign: "center", marginBlockStart: "1em" }}>
            <TextField
              id="filled-size-small"
              size="small"
              placeholder={d("Search Class Name").t("schedule_search_class_name")}
              onChange={(e) => {
                getSearcherResult(e.target.value);
              }}
            />
          </div>
        )}
        <div>
          <div className={css.schoolTemplateStyleLabel} style={{ marginBlockStart: "1em", marginBlockEnd: "1em" }}>
            <Checkbox color="primary" inputProps={{ "aria-label": "primary checkbox" }} style={{ visibility: "hidden" }} />
            <div
              className={clsx(css.changeColor, css.label)}
              style={{ width: "78%", paddingLeft: "1em" }}
              onClick={async (e) => {
                openClassMenuByOther && openClassMenuByOther(e.pageY);
              }}
              ref={(dom) => {
                setUndefinedLabelDom(dom);
              }}
            >
              {d("Undefined").t("schedule_filter_undefined")}
            </div>
          </div>
          {(edges.length ? edges : filterOtherClasses?.classesConnection?.edges)?.map((item: any) => {
            return (
              <FilterLabel
                key={item?.node?.id}
                id={item?.node?.id}
                name={item?.node?.name}
                handleChangeShowAnyTime={handleChangeShowAnyTime}
                handleChangeClassId={handleChangeClassId}
              />
            );
          })}
        </div>
        {filterOtherClasses?.classesConnection?.pageInfo?.hasNextPage && (
          <p onClick={getLastCursor} className={css.schoolTemplateStyleMore}>
            {d("See More").t("schedule_detail_see_more")} <ArrowDropDownIcon />
          </p>
        )}
      </Collapse>
    </Box>
  );
}

function FilterTemplate(props: FilterProps) {
  const css = useStyles();
  const dispatch = useDispatch();
  const [stateSubject, setStateSubject] = React.useState<InterfaceSubject[]>([]);
  const [stateOnlySelectMine, setStateOnlySelectMine] = React.useState<string[]>([]);
  const [showClassMenu, setShowClassMenu] = React.useState<boolean>(false);
  const [checkSchoolItem, setCheckSchoolItem] = React.useState<{ id: string; name: string }>({ id: "", name: "" });
  const [pageY, setPageY] = React.useState<number>(0);
  const [showUserMenu, setShowUserMenu] = React.useState<boolean>(false);
  const [userPageY, setUserPageY] = React.useState<number>(0);
  const [dom, setDom] = React.useState<HTMLDivElement | null>(null);
  const {
    handleChangeShowAnyTime,
    stateOnlyMine,
    handleChangeOnlyMine,
    privilegedMembers,
    filterOption,
    viewSubjectPermission,
    schoolsConnection,
    getSchoolsConnection,
    getClassesConnection,
    classesConnection,
    getUesrOfUndefined,
    userInUndefined,
    filterOtherClasses,
    getClassesWithoutSchool,
  } = props;
  const [stateOnlySelectMineExistData, setStateOnlySelectMineExistData] = React.useState<any>({});

  const subDataStructures = (
    id?: string,
    name?: string,
    parentName?: string,
    isShowIcon: boolean = false,
    existData?: string[],
    onLyMineData?: string[]
  ) => {
    return {
      id: parentName ? `${parentName}+${id}` : (id as string),
      name: name as string,
      isCheck: false,
      child: [],
      isOnlyMine: false,
      showIcon: isShowIcon,
      existData: existData ?? [],
      isHide: false,
      onLyMineData: onLyMineData ?? [],
    };
  };

  const handleSetStateOnlySelectMine = (mine: string, is_check: boolean) => {
    if (is_check) {
      stateOnlySelectMine.push(mine);
    } else {
      stateOnlySelectMine.splice(stateOnlySelectMine.indexOf(mine), 1);
    }
    setStateOnlySelectMine([...stateOnlySelectMine]);
  };

  const setUndefinedLabelDom = (dom: HTMLDivElement | null) => {
    setDom(dom);
  };

  const handleChangeExits = async (data: string[], checked: boolean, node: FilterItemInfo, existData: string[]) => {
    let setData: any = [];
    let onlyMineData = stateOnlyMine;
    if (checked) {
      if (node.label === "All_My_Schools" || node.self_id === "All") {
        onlyMineData = onlyMineData.concat(existData);
        const onlyResult =
          node.label === "All_My_Schools" ? [] : stateOnlySelectMine.splice(stateOnlySelectMine.indexOf(node.school_id), 1);
        if (node.label === "All_My_Schools") setStateOnlySelectMineExistData({});
        setStateOnlySelectMine([...onlyResult]);
      }
      if (node.label === "onlyMine") {
        if (node.school_id) {
          setStateOnlySelectMineExistData({ ...stateOnlySelectMineExistData, [node.school_id]: data });
        } else {
          setStateOnlySelectMineExistData({ ...stateOnlySelectMineExistData, [node.self_id]: data });
        }
        const differenceSet = onlyMineData.filter((ea) => existData.every((eb) => eb !== ea));
        onlyMineData = [...differenceSet, ...data];
      }
      if (node.label === "Others") {
        onlyMineData = stateOnlyMine.filter((v: string) => {
          const nodeValue = v.split("+");
          return nodeValue[0] !== "other";
        });
      }
      setData = [...onlyMineData.concat(data)];
      handleChangeOnlyMine(setData);
    } else {
      if (node.label === "All_My_Schools" || node.self_id === "All") {
        data = data.concat(existData);
      }
      if (node.label === "class" && node.school_id) {
        data = data.concat([`class+All+${node.school_id}`]);
      }
      if (node.label === "other") {
        data = data.concat([`class+All+Others`]);
      }
      if (node.label === "onlyMine") {
        if (node.school_id) {
          delete stateOnlySelectMineExistData[node.school_id];
          setStateOnlySelectMineExistData({ ...stateOnlySelectMineExistData });
        } else {
          delete stateOnlySelectMineExistData[node.self_id];
          setStateOnlySelectMineExistData({ ...stateOnlySelectMineExistData });
        }
      }
      if (node.label === "class" && node.school_id) {
        data = data.concat([`All_My_Schools`]);
      }
      const differenceSet = onlyMineData.filter((ea) => data.every((eb) => eb !== ea));
      setData = [...differenceSet];
      if (setData < 1) setData.push("All");
      handleChangeOnlyMine(setData);
    }
    if (node.label === "program" && checked) {
      if (viewSubjectPermission) {
        let resultInfo: any;
        resultInfo = ((await dispatch(ScheduleFilterSubject({ program_id: node.self_id, metaLoading: true }))) as unknown) as PayloadAction<
          AsyncTrunkReturned<typeof ScheduleFilterSubject>
        >;
        if (resultInfo.payload.length > 0) {
          const subjectData = resultInfo.payload.map((val: EntityScheduleShortInfo) => {
            return { program_id: node.self_id, name: val.name, id: val.id };
          });
          setStateSubject([...stateSubject, ...subjectData]);
        }
      } else {
        dispatch(actError(d("You do not have permission to access this feature.").t("schedule_msg_no_permission")));
      }
    }
    if (node.label === "program" && !checked) {
      const checkSubject: string[] = [];
      const deepSubject = stateSubject.filter((v: InterfaceSubject, index: number) => {
        if (stateOnlyMine.includes(`subjectSub+${v.id}`)) checkSubject.push(`subjectSub+${v.id}`);
        return v.program_id !== node.self_id;
      });
      const differenceSet = onlyMineData.filter((ea) => checkSubject.concat(data).every((eb) => eb !== ea));
      handleChangeOnlyMine([...differenceSet]);
      setStateSubject(deepSubject);
    }
  };

  const getClassDataBySchool = useMemo(() => {
    return modelSchedule.classDataConversion2(checkSchoolItem.name, checkSchoolItem.id, classesConnection);
  }, [checkSchoolItem, classesConnection]);

  const getUserDataByUndefined = useMemo(() => {
    return modelSchedule.classDataConversion3(d("Undefined").t("schedule_filter_undefined"), userInUndefined);
  }, [userInUndefined]);

  const getClassTypeByFilter = () => {
    return filterOption.classType.map((val: EntityScheduleShortInfo) => {
      return subDataStructures(val.id, t(val.name as classTypeLabel), "classType");
    });
  };

  const getProgramByFilter = () => {
    const program: FilterDataItemsProps[] = [];
    filterOption.programs.forEach((val) => {
      program.push(subDataStructures(val.id, val.name, "program"));
      const subject: FilterDataItemsProps[] = [];
      stateSubject.forEach((v: InterfaceSubject) => {
        if (v.program_id === val.id) subject.push(subDataStructures(v.id, v.name, "subjectSub"));
      });
      const subjectSet = {
        id: `subject+${val.id}`,
        name: d("Subject").t("schedule_detail_subject"),
        isCheck: false,
        child: subject,
        isOnlyMine: false,
        existData: [],
        isHide: false,
        onLyMineData: [],
      };
      if (subject.length > 0) program.push(subjectSet);
    });
    return program;
  };

  const openClassMenu = async (pageY: number, schoolItem: { id: string; name: string }) => {
    setShowClassMenu(false);
    if (schoolItem.id === "All_My_Schools") return;
    await getClassesConnection("", schoolItem.id, true, ConnectionDirection.Forward);
    setPageY(pageY);
    setShowClassMenu(true);
    setCheckSchoolItem(schoolItem);
  };

  const setUserPageYFun = () => {
    setTimeout(() => {
      setUserPageY(dom?.offsetTop ? dom?.offsetTop + 20 : 0);
    }, 300);
  };

  const closeClassMenu = (type: "class" | "user") => {
    if (type === "user") setShowUserMenu(false);
    if (type === "class") {
      setUserPageYFun();
      setShowClassMenu(false);
    }
  };

  const openClassMenuByOther = async (pageY: number) => {
    setShowUserMenu(false);
    await getUesrOfUndefined("", true, ConnectionDirection.Forward);
    setUserPageYFun();
    setShowUserMenu(true);
  };

  const hideClassMenu = () => {
    setShowClassMenu(false);
  };

  const hideUserClassMenu = () => {
    setShowUserMenu(false);
  };

  const filterData: FilterDataItemsProps[] = [
    {
      id: "Programs+1",
      name: d("Programs").t("schedule_filter_programs"),
      isCheck: false,
      child: getProgramByFilter(),
      isOnlyMine: false,
      existData: [],
      isHide: getProgramByFilter().length < 1,
      onLyMineData: [],
    },
    {
      id: "ClassTypes+1",
      name: d("Class Types").t("schedule_filter_class_types"),
      isCheck: false,
      child: getClassTypeByFilter(),
      isOnlyMine: false,
      existData: [],
      isHide: getClassTypeByFilter().length < 1,
      onLyMineData: [],
    },
  ];
  const styledTreeItemTemplate = (treeItem: FilterDataItemsProps[]) => {
    const fullOtherSelectionStatus = modelSchedule.FilterOtherDigital(filterOption.others, stateOnlyMine);
    return treeItem.map((item: FilterDataItemsProps) => {
      return (
        !item.isHide && (
          <div key={item.id}>
            {["School+1", "Programs+1"].includes(item.id) && <div className={css.fliterRouter}></div>}
            <StyledTreeItem
              nodeId={item.id}
              labelText={item.name}
              handleChangeShowAnyTime={handleChangeShowAnyTime}
              isShowIcon={item.showIcon}
              labelIcon={AccessibilityNewIcon}
              isOnlyMine={item.isOnlyMine}
              item={item}
              handleChangeExits={handleChangeExits}
              stateOnlyMine={stateOnlyMine}
              handleSetStateOnlySelectMine={handleSetStateOnlySelectMine}
              stateOnlySelectMine={stateOnlySelectMine}
              stateOnlySelectMineExistData={stateOnlySelectMineExistData}
              privilegedMembers={privilegedMembers}
              fullOtherSelectionStatusSet={fullOtherSelectionStatus}
              openClassMenu={openClassMenu}
            >
              {item.child && styledTreeItemTemplate(item.child)}
            </StyledTreeItem>
          </div>
        )
      );
    });
  };

  const handleSelect = (event: any, nodeIds: any) => {
    if (nodeIds[0] === "School+1") setShowClassMenu(false);
  };

  return (
    <>
      <SchoolTemplate
        openClassMenu={openClassMenu}
        schoolsConnection={schoolsConnection}
        getSchoolsConnection={getSchoolsConnection}
        getClassesConnection={getClassesConnection}
        closeClassMenu={closeClassMenu}
        setUserPageYFun={setUserPageYFun}
      />
      <OtherTemplate
        openClassMenuByOther={openClassMenuByOther}
        schoolsConnection={schoolsConnection}
        getSchoolsConnection={getSchoolsConnection}
        getClassesConnection={getClassesConnection}
        stateOnlyMine={stateOnlyMine}
        handleChangeOnlyMine={handleChangeOnlyMine}
        filterOtherClasses={filterOtherClasses}
        getClassesWithoutSchool={getClassesWithoutSchool}
        handleChangeShowAnyTime={handleChangeShowAnyTime}
        closeClassMenu={closeClassMenu}
        setUndefinedLabelDom={setUndefinedLabelDom}
      />
      <TreeView
        className={css.containerRoot}
        defaultCollapseIcon={<KeyboardArrowUpOutlinedIcon className={css.filterArrow} />}
        defaultExpandIcon={<KeyboardArrowDownOutlinedIcon className={css.filterArrow} style={{ cursor: "pointer" }} />}
        multiSelect
        onNodeSelect={handleSelect}
      >
        {styledTreeItemTemplate(filterData)}
      </TreeView>
      {showClassMenu && (
        <FilterTree
          type="class"
          stateOnlyMine={stateOnlyMine}
          handleChangeOnlyMine={handleChangeOnlyMine}
          hideClassMenu={hideClassMenu}
          pageY={pageY}
          classDataBySchool={getClassDataBySchool}
          handleChangeShowAnyTime={handleChangeShowAnyTime}
          total={classesConnection?.classesConnection?.totalCount!}
          getClassesConnection={getClassesConnection}
          pageInfo={classesConnection?.classesConnection?.pageInfo}
        />
      )}
      {showUserMenu && (
        <FilterTree
          type="user"
          stateOnlyMine={stateOnlyMine}
          handleChangeOnlyMine={handleChangeOnlyMine}
          hideClassMenu={hideUserClassMenu}
          pageY={userPageY}
          classDataBySchool={getUserDataByUndefined}
          handleChangeShowAnyTime={handleChangeShowAnyTime}
          total={userInUndefined?.usersConnection?.totalCount!}
          pageInfo={userInUndefined?.usersConnection?.pageInfo}
          getUesrOfUndefined={getUesrOfUndefined}
        />
      )}
    </>
  );
}

interface FilterProps extends SchoolTemplateProps {
  handleChangeLoadScheduleView: (filterQuery: FilterQueryTypeProps | []) => void;
  mockOptions: MockOptionsOptionsItem[] | undefined;
  scheduleMockOptions: getScheduleMockOptionsResponse;
  handleChangeShowAnyTime: (is_show: boolean, name: string, class_id?: string, user_id?: string) => void;
  stateOnlyMine: string[];
  handleChangeOnlyMine: (data: string[]) => void;
  timesTamp: timestampType;
  modelView: modeViewType;
  privilegedMembers: (member: memberType) => boolean;
  filterOption: filterOptionItem;
  schoolByOrgOrUserData: EntityScheduleSchoolInfo[];
  viewSubjectPermission?: boolean;
  getUesrOfUndefined: (cursor: string, loading: boolean, direction: ConnectionDirection.Forward | ConnectionDirection.Backward) => void;
  userInUndefined: GetUserQuery;
  filterOtherClasses: GetClassFilterListQuery;
  getClassesWithoutSchool: (cursor: string, value: string, loading: boolean) => any;
}

export default function ScheduleFilter(props: FilterProps) {
  const {
    handleChangeLoadScheduleView,
    mockOptions,
    scheduleMockOptions,
    handleChangeShowAnyTime,
    stateOnlyMine,
    handleChangeOnlyMine,
    modelView,
    timesTamp,
    privilegedMembers,
    filterOption,
    schoolByOrgOrUserData,
    viewSubjectPermission,
    schoolsConnection,
    getSchoolsConnection,
    getClassesConnection,
    classesConnection,
    getUesrOfUndefined,
    userInUndefined,
    filterOtherClasses,
    getClassesWithoutSchool,
  } = props;
  return (
    <FilterTemplate
      getClassesWithoutSchool={getClassesWithoutSchool}
      filterOtherClasses={filterOtherClasses}
      userInUndefined={userInUndefined}
      getUesrOfUndefined={getUesrOfUndefined}
      handleChangeLoadScheduleView={handleChangeLoadScheduleView}
      mockOptions={mockOptions}
      scheduleMockOptions={scheduleMockOptions}
      handleChangeShowAnyTime={handleChangeShowAnyTime}
      stateOnlyMine={stateOnlyMine}
      handleChangeOnlyMine={handleChangeOnlyMine}
      modelView={modelView}
      timesTamp={timesTamp}
      privilegedMembers={privilegedMembers}
      filterOption={filterOption}
      schoolByOrgOrUserData={schoolByOrgOrUserData}
      viewSubjectPermission={viewSubjectPermission}
      schoolsConnection={schoolsConnection}
      getSchoolsConnection={getSchoolsConnection}
      getClassesConnection={getClassesConnection}
      classesConnection={classesConnection}
    />
  );
}
