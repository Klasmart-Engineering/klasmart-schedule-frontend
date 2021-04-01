import Checkbox from "@material-ui/core/Checkbox";
import KeyboardArrowDownOutlinedIcon from "@material-ui/icons/KeyboardArrowDownOutlined";
import KeyboardArrowUpOutlinedIcon from "@material-ui/icons/KeyboardArrowUpOutlined";
import { MockOptionsOptionsItem } from "../../api/extra";
import { PermissionType, usePermission } from "../../components/Permission";
import { d } from "../../locale/LocaleManager";
import { getScheduleMockOptionsResponse, ScheduleFilterSubject } from "../../reducers/schedule";
import {
  EntityScheduleClassInfo,
  FilterQueryTypeProps,
  FilterDataItemsProps,
  EntityScheduleSchoolsInfo,
  RolesData,
} from "../../types/scheduleTypes";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../reducers";
import { EntityScheduleFilterClass, EntityScheduleShortInfo } from "../../api/api.auto";
import React from "react";
import { SvgIconProps } from "@material-ui/core/SvgIcon";
import { makeStyles, Theme, createStyles } from "@material-ui/core/styles";
import TreeItem, { TreeItemProps } from "@material-ui/lab/TreeItem";
import Typography from "@material-ui/core/Typography";
import { TreeView } from "@material-ui/lab";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import { PayloadAction } from "@reduxjs/toolkit";
import { AsyncTrunkReturned } from "../../reducers/content";
import AccessibilityNewIcon from "@material-ui/icons/AccessibilityNew";
import clsx from "clsx";
import { Box } from "@material-ui/core";

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
  })
);

type StyledTreeItemProps = TreeItemProps & {
  bgColor?: string;
  color?: string;
  labelIcon?: React.ElementType<SvgIconProps>;
  labelInfo?: string;
  labelText?: string;
  handleChangeShowAnyTime: (is_show: boolean, class_id: string) => void;
  isShowIcon?: boolean;
  isOnlyMine?: boolean;
  item: FilterDataItemsProps;
  handleChangeExits: (data: string[], checked: boolean, node: string[]) => void;
  stateOnlyMine: string[];
  handleSetStateOnlySelectMine: (mine: string, is_check: boolean) => void;
  stateOnlySelectMine: string[];
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
    ...other
  } = props;
  const minimumDom = Array.isArray(props.children) && (props.children as []).length < 1;
  const maxDom = ["School+1", "Others+1", "Programs+1", "ClassTypes+1"].includes(props.nodeId);
  const rgb = Math.floor(Math.random() * 256);
  const nodeValue = props.nodeId.split("+");

  const isDisable = (title: string, existId: string): boolean => {
    const menus = title === "other" ? "Others" : title;
    const filterResult = stateOnlySelectMine.filter((result: string) => {
      const nodeValue = result.split("+");
      return nodeValue[0] === menus;
    });
    return filterResult.length > 0 ? !stateOnlyMine.includes(`${title}+${existId}`) : false;
  };

  return (
    <Box style={{ position: "relative" }}>
      {minimumDom && (
        <Checkbox
          color="primary"
          inputProps={{ "aria-label": "primary checkbox" }}
          onClick={(e) => {
            handleChangeExits([item.id], (e.target as HTMLInputElement).checked, nodeValue);
          }}
          checked={stateOnlyMine.includes(item.id)}
          disabled={isDisable(nodeValue[0], nodeValue[1])}
          style={{ position: "absolute", top: "5px", left: "10px" }}
        />
      )}
      <TreeItem
        label={
          <div className={classes.labelRoot}>
            <div style={{ display: "flex", alignItems: "center", width: "100%" }} className={isOnlyMine ? classes.abbreviation : ""}>
              {LabelIcon && isShowIcon && <LabelIcon color="inherit" className={classes.labelIcon} />}
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
                    handleChangeExits(item.existData, (e.target as HTMLInputElement).checked, nodeValue);
                    handleSetStateOnlySelectMine(item.id, (e.target as HTMLInputElement).checked);
                    e.stopPropagation();
                  }}
                  label="Only Mine"
                  style={{ transform: "scale(0.7)", marginRight: "0px" }}
                />
              </Typography>
            )}
            {minimumDom && ["class", "other"].includes(nodeValue[0]) && (
              <Typography variant="caption" color="inherit" style={{ display: "flex", alignItems: "center", transform: "scale(0.8)" }}>
                <div style={{ width: "12px", height: "12px", backgroundColor: `rgb(${rgb},${rgb},${rgb})`, borderRadius: "20px" }} />{" "}
                <MoreVertIcon
                  onClick={() => {
                    handleChangeShowAnyTime(true, nodeValue[1]);
                  }}
                />
              </Typography>
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
  const [stateOnlyMine, setStateOnlyMine] = React.useState<string[]>([]);
  const [stateOnlySelectMine, setStateOnlySelectMine] = React.useState<string[]>([]);
  const { classOptions, filterOption, user_id } = useSelector<RootState, RootState["schedule"]>((state) => state.schedule);
  const { handleChangeShowAnyTime, handleChangeLoadScheduleView } = props;

  const perm = usePermission([
    PermissionType.view_my_calendar_510,
    PermissionType.view_school_calendar_512,
    PermissionType.create_event_520,
    PermissionType.create_my_schools_schedule_events_522,
  ]);

  const subDataStructures = (id?: string, name?: string, parentName?: string, isShowIcon: boolean = false) => {
    return {
      id: parentName ? `${parentName}+${id}` : (id as string),
      name: name as string,
      isCheck: false,
      child: [],
      isOnlyMine: false,
      showIcon: isShowIcon,
      existData: [],
      isHide: false,
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

  const getConnectionStr = (item: []) => {
    let str = "";
    item.forEach((val: string) => {
      const nodeValue = val.split("+");
      str = `${str},${nodeValue[1]}`;
    });
    return str.substr(1);
  };

  const handleActiveAll = (data: any) => {
    const filterQuery: FilterQueryTypeProps = {
      class_types: getConnectionStr(
        data.filter((v: string) => {
          const nodeValue = v.split("+");
          return nodeValue[0] === "classType";
        })
      ),
      class_ids: getConnectionStr(
        data.filter((v: string) => {
          const nodeValue = v.split("+");
          return nodeValue[0] === "class" || nodeValue[0] === "other";
        })
      ),
      subject_ids: getConnectionStr(
        data.filter((v: string) => {
          const nodeValue = v.split("+");
          return nodeValue[0] === "subjectSub";
        })
      ),
      program_ids: getConnectionStr(
        data.filter((v: string) => {
          const nodeValue = v.split("+");
          return nodeValue[0] === "program";
        })
      ),
    };
    handleChangeLoadScheduleView(filterQuery);
  };

  const handleChangeExits = async (data: string[], checked: boolean, node: string[]) => {
    let setData: any = [];
    let onlyMineData = stateOnlyMine;
    if (checked) {
      if (node[0] === "Others") {
        onlyMineData = stateOnlyMine.filter((v: string) => {
          const nodeValue = v.split("+");
          return nodeValue[0] !== "other";
        });
      }
      setData = [...onlyMineData.concat(data)];
      setStateOnlyMine(setData);
    } else {
      const differenceSet = onlyMineData.filter((ea) => data.every((eb) => eb !== ea));
      setData = [...differenceSet];
      setStateOnlyMine(setData);
    }
    if (node[0] === "program" && checked) {
      let resultInfo: any;
      resultInfo = ((await dispatch(ScheduleFilterSubject({ program_id: node[1], metaLoading: true }))) as unknown) as PayloadAction<
        AsyncTrunkReturned<typeof ScheduleFilterSubject>
      >;
      if (resultInfo.payload.length > 0) {
        const subjectData = resultInfo.payload.map((val: EntityScheduleShortInfo) => {
          return { program_id: node[1], name: val.name, id: val.id };
        });
        setStateSubject([...stateSubject, ...subjectData]);
      }
    }
    if (node[0] === "program" && !checked) {
      stateSubject.forEach((v: InterfaceSubject, index: number) => {
        if (v.program_id === node[1]) stateSubject.splice(index, 1);
      });
      setStateSubject([...stateSubject]);
    }
    handleActiveAll(setData);
  };

  const getClassBySchool = (): FilterDataItemsProps[] => {
    let lists: EntityScheduleClassInfo[] = [];
    const classResult: FilterDataItemsProps[] = [];
    const otherClass: FilterDataItemsProps[] = [];
    if (perm.create_event_520) {
      lists = classOptions.classListOrg.organization?.classes as EntityScheduleClassInfo[];
    } else if (perm.create_my_schools_schedule_events_522) {
      lists = classOptions.classListSchool.school?.classes as EntityScheduleClassInfo[];
    } else {
      lists = classOptions.classListTeacher.user?.classesTeaching as EntityScheduleClassInfo[];
    }
    lists?.forEach((item: EntityScheduleClassInfo) => {
      if (item.schools?.length > 0) {
        // const user_id = "59bc75ea-e5c4-508d-8781-2b5ec0a1dbd3"
        console.log(user_id);
        const isExistTeacher = item.teachers.filter((teacher: RolesData) => {
          return teacher.user_id === user_id;
        });
        const isExistStudent = item.students.filter((studen: RolesData) => {
          return studen.user_id === user_id;
        });
        const is_exist = isExistTeacher.length > 0 || isExistStudent.length > 0;

        item.schools?.forEach((school: EntityScheduleSchoolsInfo) => {
          let filterData = { is: false, index: 0 };
          classResult.forEach((result: FilterDataItemsProps, index: number) => {
            if (result.id === school.school_id) filterData = { is: result.id === school.school_id, index: index };
          });
          if (filterData.is) {
            classResult[filterData.index].child.push(subDataStructures(`${item.class_id}+${school.school_id}`, item.class_name, "class"));
            classResult[filterData.index].isOnlyMine = is_exist;
            classResult[filterData.index].existData.push(`class+${item.class_id}+${school.school_id}` as string);
          } else {
            classResult.push({
              id: `${school.school_id}`,
              name: school.school_name,
              isCheck: false,
              child: [subDataStructures(`${item.class_id}+${school.school_id}`, item.class_name, "class")],
              isOnlyMine: is_exist,
              existData: [`class+${item.class_id}+${school.school_id}` as string],
              isHide: false,
            });
          }
        });
      } else {
        otherClass.push(subDataStructures(item.class_id, item.class_name, "class"));
      }
    });
    return classResult;
  };

  const getClassTypeByFilter = () => {
    return filterOption.classType.map((val: string) => {
      return subDataStructures(val, val, "classType");
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
        name: "Subject",
        isCheck: false,
        child: subject,
        isOnlyMine: false,
        existData: [],
        isHide: false,
      };
      if (subject.length > 0) program.push(subjectSet);
    });
    return program;
  };

  const getOthersByFilter = () => {
    return filterOption.others.map((classItem: EntityScheduleFilterClass) => {
      return subDataStructures(classItem.id, classItem.name, "other", classItem?.operator_role_type === "Student");
    });
  };

  const handleToggle = (event: React.ChangeEvent<{}>, nodeIds: string[]) => {
    console.log((event.target as HTMLInputElement).checked, 888, nodeIds);
  };

  const handleSelect = async (event: React.ChangeEvent<{}>, nodeIds: string[]) => {
    const checked = (event.target as HTMLInputElement).checked;
    const nodeValue = nodeIds[0].split("+");
    if (nodeValue[0] === "program" && checked) {
      let resultInfo: any;
      resultInfo = ((await dispatch(ScheduleFilterSubject({ program_id: nodeValue[1], metaLoading: true }))) as unknown) as PayloadAction<
        AsyncTrunkReturned<typeof ScheduleFilterSubject>
      >;
      if (resultInfo.payload.length > 0) {
        const subjectData = resultInfo.payload.map((val: EntityScheduleShortInfo) => {
          return { program_id: nodeValue[1], name: val.name, id: val.id };
        });
        setStateSubject([...stateSubject, ...subjectData]);
      }
    }
    if (nodeValue[0] === "program" && !checked) {
      stateSubject.forEach((v: InterfaceSubject, index: number) => {
        if (v.program_id === nodeValue[1]) stateSubject.splice(index, 1);
      });
      setStateSubject([...stateSubject]);
    }
  };

  const getOthersExistData = (): string[] => {
    const data: string[] = [];
    filterOption.others.forEach((classItem: EntityScheduleFilterClass) => {
      if (classItem?.operator_role_type !== "Unknown") data.push(`other+${classItem.id}`);
    });
    return data;
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
    },
    {
      id: "Others+1",
      name: "Others",
      isCheck: false,
      child: getOthersByFilter(),
      isOnlyMine: getOthersExistData().length > 0,
      existData: getOthersExistData(),
      isHide: getClassBySchool().length < 1,
    },
    {
      id: "Programs+1",
      name: "Programs",
      isCheck: false,
      child: getProgramByFilter(),
      isOnlyMine: false,
      existData: [],
      isHide: getClassBySchool().length < 1,
    },
    {
      id: "ClassTypes+1",
      name: "ClassTypes",
      isCheck: false,
      child: getClassTypeByFilter(),
      isOnlyMine: false,
      existData: [],
      isHide: getClassBySchool().length < 1,
    },
  ];
  const styledTreeItemTemplate = (treeItem: FilterDataItemsProps[]) => {
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
            >
              {item.child && styledTreeItemTemplate(item.child)}
            </StyledTreeItem>
          </>
        )
      );
    });
  };

  return (
    <TreeView
      className={css.containerRoot}
      defaultExpanded={["1"]}
      defaultCollapseIcon={<KeyboardArrowUpOutlinedIcon className={css.filterArrow} />}
      defaultExpandIcon={<KeyboardArrowDownOutlinedIcon className={css.filterArrow} style={{ cursor: "pointer" }} />}
      onNodeToggle={handleToggle}
      onNodeSelect={handleSelect}
      multiSelect
    >
      {styledTreeItemTemplate(filterData)}
    </TreeView>
  );
}

interface FilterProps {
  handleChangeLoadScheduleView: (filterQuery: FilterQueryTypeProps | []) => void;
  mockOptions: MockOptionsOptionsItem[] | undefined;
  scheduleMockOptions: getScheduleMockOptionsResponse;
  handleChangeShowAnyTime: (is_show: boolean) => void;
}

export default function ScheduleFilter(props: FilterProps) {
  const { handleChangeLoadScheduleView, mockOptions, scheduleMockOptions, handleChangeShowAnyTime } = props;
  return (
    <FilterTemplate
      handleChangeLoadScheduleView={handleChangeLoadScheduleView}
      mockOptions={mockOptions}
      scheduleMockOptions={scheduleMockOptions}
      handleChangeShowAnyTime={handleChangeShowAnyTime}
    />
  );
}
