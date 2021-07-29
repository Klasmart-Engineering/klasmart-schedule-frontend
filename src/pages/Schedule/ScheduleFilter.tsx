import { Box } from "@material-ui/core";
import Checkbox from "@material-ui/core/Checkbox";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Popover from "@material-ui/core/Popover";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import { SvgIconProps } from "@material-ui/core/SvgIcon";
import Typography from "@material-ui/core/Typography";
import AccessibilityNewIcon from "@material-ui/icons/AccessibilityNew";
import KeyboardArrowDownOutlinedIcon from "@material-ui/icons/KeyboardArrowDownOutlined";
import KeyboardArrowUpOutlinedIcon from "@material-ui/icons/KeyboardArrowUpOutlined";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import { TreeView } from "@material-ui/lab";
import TreeItem, { TreeItemProps } from "@material-ui/lab/TreeItem";
import { PayloadAction } from "@reduxjs/toolkit";
import clsx from "clsx";
import React, { useMemo } from "react";
import { useDispatch } from "react-redux";
import { EntityScheduleFilterClass, EntityScheduleShortInfo } from "../../api/api.auto";
import { MockOptionsOptionsItem } from "../../api/extra";
import { d, t } from "../../locale/LocaleManager";
import { AsyncTrunkReturned } from "../../reducers/content";
import { getScheduleMockOptionsResponse, ScheduleFilterSubject } from "../../reducers/schedule";
import {
  classTypeLabel,
  EntityScheduleClassesInfo,
  EntityScheduleSchoolInfo,
  FilterDataItemsProps,
  FilterQueryTypeProps,
  memberType,
  modeViewType,
  RolesData,
  timestampType,
  filterOptionItem,
  FilterItemInfo,
} from "../../types/scheduleTypes";
import { modelSchedule } from "../../models/ModelSchedule";
import FilterTree from "../../components/FilterTree";

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
  })
);

type StyledTreeItemProps = TreeItemProps & {
  bgColor?: string;
  color?: string;
  labelIcon?: React.ElementType<SvgIconProps>;
  labelInfo?: string;
  labelText?: string;
  handleChangeShowAnyTime: (is_show: boolean, name: string, class_id: string) => void;
  isShowIcon?: boolean;
  isOnlyMine?: boolean;
  item: FilterDataItemsProps;
  handleChangeExits: (data: string[], checked: boolean, node: FilterItemInfo, existData: string[]) => void;
  stateOnlyMine: string[];
  handleSetStateOnlySelectMine: (mine: string, is_check: boolean) => void;
  stateOnlySelectMine: string[];
  stateOnlySelectMineExistData: any;
  privilegedMembers: (member: memberType) => boolean;
  fullSelectionStatusSet: { id: string; status: boolean }[];
  fullOtherSelectionStatusSet: boolean;
  openClassMenu: (e: React.MouseEvent<HTMLDivElement, MouseEvent>, schoolId: string) => void;
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
    fullSelectionStatusSet,
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
    } else if (item.id === "All_My_Schools") {
      allStatus = fullSelectionStatusSet.every((item: { id: string; status: boolean }) => {
        return item.status;
      });
    } else if (item.name === "All") {
      fullSelectionStatusSet.forEach((item: { id: string; status: boolean }) => {
        if (item.id === filterItem.school_id) allStatus = item.status;
      });
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
                if (!self_id) openClassMenu(e, filterItem.label);
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

function FilterTemplate(props: FilterProps) {
  const css = useStyles();
  const dispatch = useDispatch();
  const [stateSubject, setStateSubject] = React.useState<InterfaceSubject[]>([]);
  const [stateOnlySelectMine, setStateOnlySelectMine] = React.useState<string[]>([]);
  const [showClassMenu, setShowClassMenu] = React.useState<boolean>(false);
  const [checkSchoolId, setCheckSchoolId] = React.useState<string>("");
  const [pageY, setPageY] = React.useState<number>(0);
  const {
    handleChangeShowAnyTime,
    stateOnlyMine,
    handleChangeOnlyMine,
    privilegedMembers,
    filterOption,
    user_id,
    schoolByOrgOrUserData,
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
    const role = privilegedMembers("Teacher") || privilegedMembers("Student");
    return modelSchedule.classDataConversion(user_id, checkSchoolId, schoolByOrgOrUserData, role);
  }, [schoolByOrgOrUserData, checkSchoolId, privilegedMembers, user_id]);

  const getClassBySchool = (): FilterDataItemsProps[] => {
    const classResult: FilterDataItemsProps[] = [];
    const AllExistData: string[] = [];
    schoolByOrgOrUserData?.forEach((schoolItem: EntityScheduleSchoolInfo) => {
      let is_exists: boolean = false;
      const existData: string[] = [];
      const onLyMineData: string[] = [];
      const classesChild = [];
      schoolItem.classes.forEach((classItem: EntityScheduleClassesInfo) => {
        if (classItem.status === "active") {
          const isExistTeacher = classItem.teachers.filter((teacher: RolesData) => {
            return teacher.user_id === user_id;
          });
          const isExistStudent = classItem.students.filter((studen: RolesData) => {
            return studen.user_id === user_id;
          });
          if ((privilegedMembers("Teacher") || privilegedMembers("Student")) && !isExistTeacher.length && !isExistStudent.length) return;
          if (!is_exists)
            is_exists =
              !(privilegedMembers("Teacher") || privilegedMembers("Student")) && (isExistTeacher.length > 0 || isExistStudent.length > 0);
          existData.push(`class+${classItem.class_id}+${schoolItem.school_id}` as string);
          AllExistData.push(`class+${classItem.class_id}+${schoolItem.school_id}` as string);
          if (isExistTeacher.length > 0 || isExistStudent.length > 0)
            onLyMineData.push(`class+${classItem.class_id}+${schoolItem.school_id}` as string);
          classesChild.push(
            subDataStructures(
              `${classItem.class_id}+${schoolItem.school_id}`,
              classItem.class_name,
              "class",
              isExistStudent.length > 0,
              [],
              onLyMineData
            )
          );
        }
      });
      if (classesChild.length > 1) {
        classesChild.unshift(subDataStructures(`All+${schoolItem.school_id}`, d("All").t("assess_filter_all"), "class", false, existData));
        existData.push(`class+All+${schoolItem.school_id}`);
        AllExistData.push(`class+All+${schoolItem.school_id}`);
      }
      if (classesChild.length < 1 && (privilegedMembers("Teacher") || privilegedMembers("Student"))) return;
      classResult.push({
        id: `${schoolItem.school_id}`,
        name: schoolItem.school_name,
        isCheck: false,
        child: [],
        isOnlyMine: is_exists,
        existData: existData,
        isHide: false,
        onLyMineData: onLyMineData,
      });
    });
    if (classResult.length > 1)
      classResult.unshift({
        id: "All_My_Schools",
        name: `${d("All My Schools").t("schedule_filter_all_my_schools")}`,
        isCheck: false,
        child: [],
        isOnlyMine: false,
        existData: AllExistData,
        isHide: false,
        onLyMineData: [],
      });
    return classResult;
  };

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

  const getOthersByFilter = () => {
    const existData: string[] = [];
    let filterOptionOthers: FilterDataItemsProps[] = [];
    filterOptionOthers = filterOption.others.map((classItem: EntityScheduleFilterClass) => {
      existData.push(`other+${classItem.id}`);
      return subDataStructures(classItem.id, classItem.name, "other", classItem?.operator_role_type === "Student");
    });
    if (filterOptionOthers.length > 1)
      filterOptionOthers.unshift(subDataStructures(`All+Others`, d("All").t("assess_filter_all"), "class", false, existData));
    return filterOptionOthers;
  };

  const getOthersExistData = (): string[] => {
    const data: string[] = [];
    filterOption.others.forEach((classItem: EntityScheduleFilterClass) => {
      data.push(`other+${classItem.id}`);
    });
    if (data.length > 1) data.push("class+All+Others");
    return data;
  };

  const getOnLyMineData = (): string[] => {
    const data: string[] = [];
    filterOption.others.forEach((classItem: EntityScheduleFilterClass) => {
      if (!(privilegedMembers("Teacher") || privilegedMembers("Student")) && classItem?.operator_role_type !== "Unknown")
        data.push(`other+${classItem.id}`);
    });
    return data;
  };

  const openClassMenu = (e: React.MouseEvent<HTMLDivElement, MouseEvent>, schoolId: string) => {
    if (schoolId === "All_My_Schools") return;
    setPageY(e.pageY);
    setShowClassMenu(true);
    setCheckSchoolId(schoolId);
  };

  const hideClassMenu = () => {
    setShowClassMenu(false);
  };

  const filterData: FilterDataItemsProps[] = [
    {
      id: "School+1",
      name: d("All My Schools").t("schedule_filter_all_my_schools"),
      isCheck: false,
      child: getClassBySchool(),
      isOnlyMine: false,
      existData: [],
      isHide: getClassBySchool().length < 1,
      onLyMineData: [],
    },
    {
      id: "Others+1",
      name: d("Others").t("schedule_filter_others"),
      isCheck: false,
      child: getOthersByFilter(),
      isOnlyMine: getOnLyMineData().length > 0,
      existData: getOthersExistData(),
      isHide: getOthersByFilter().length < 1,
      onLyMineData: getOnLyMineData(),
    },
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
    const fullSelectionStatus = modelSchedule.FilterSchoolDigital(
      schoolByOrgOrUserData,
      stateOnlyMine,
      user_id,
      privilegedMembers("Teacher") || privilegedMembers("Student")
    );
    const fullOtherSelectionStatus = modelSchedule.FilterOtherDigital(filterOption.others, stateOnlyMine);
    return treeItem.map((item: FilterDataItemsProps) => {
      return (
        !item.isHide && (
          <>
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
              fullSelectionStatusSet={fullSelectionStatus}
              fullOtherSelectionStatusSet={fullOtherSelectionStatus}
              openClassMenu={openClassMenu}
            >
              {item.child && styledTreeItemTemplate(item.child)}
            </StyledTreeItem>
          </>
        )
      );
    });
  };

  const handleSelect = (event, nodeIds) => {
    if (nodeIds[0] === "School+1") setShowClassMenu(false);
  };

  return (
    <>
      <TreeView
        className={css.containerRoot}
        defaultExpanded={["1"]}
        defaultCollapseIcon={<KeyboardArrowUpOutlinedIcon className={css.filterArrow} />}
        defaultExpandIcon={<KeyboardArrowDownOutlinedIcon className={css.filterArrow} style={{ cursor: "pointer" }} />}
        multiSelect
        onNodeSelect={handleSelect}
      >
        {styledTreeItemTemplate(filterData)}
      </TreeView>
      {showClassMenu && (
        <FilterTree
          stateOnlyMine={stateOnlyMine}
          handleChangeOnlyMine={handleChangeOnlyMine}
          hideClassMenu={hideClassMenu}
          pageY={pageY}
          classDataBySchool={getClassDataBySchool}
          handleChangeShowAnyTime={handleChangeShowAnyTime}
        />
      )}
    </>
  );
}

interface FilterProps {
  handleChangeLoadScheduleView: (filterQuery: FilterQueryTypeProps | []) => void;
  mockOptions: MockOptionsOptionsItem[] | undefined;
  scheduleMockOptions: getScheduleMockOptionsResponse;
  handleChangeShowAnyTime: (is_show: boolean, name: string, class_id?: string) => void;
  stateOnlyMine: string[];
  handleChangeOnlyMine: (data: string[]) => void;
  timesTamp: timestampType;
  modelView: modeViewType;
  privilegedMembers: (member: memberType) => boolean;
  filterOption: filterOptionItem;
  user_id: string;
  schoolByOrgOrUserData: EntityScheduleSchoolInfo[];
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
    user_id,
    schoolByOrgOrUserData,
  } = props;
  return (
    <FilterTemplate
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
      user_id={user_id}
      schoolByOrgOrUserData={schoolByOrgOrUserData}
    />
  );
}
