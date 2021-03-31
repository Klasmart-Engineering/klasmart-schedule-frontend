import Checkbox from "@material-ui/core/Checkbox";
import KeyboardArrowDownOutlinedIcon from "@material-ui/icons/KeyboardArrowDownOutlined";
import KeyboardArrowUpOutlinedIcon from "@material-ui/icons/KeyboardArrowUpOutlined";
import { MockOptionsOptionsItem } from "../../api/extra";
import { PermissionType, usePermission } from "../../components/Permission";
import { d } from "../../locale/LocaleManager";
import { getScheduleMockOptionsResponse, ScheduleFilterSubject } from "../../reducers/schedule";
import { EntityScheduleClassInfo, FilterQueryTypeProps, FilterDataItemsProps, EntityScheduleSchoolsInfo } from "../../types/scheduleTypes";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../reducers";
import { EntityScheduleShortInfo } from "../../api/api.auto";
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
  })
);

type StyledTreeItemProps = TreeItemProps & {
  bgColor?: string;
  color?: string;
  labelIcon?: React.ElementType<SvgIconProps>;
  labelInfo?: string;
  labelText?: string;
  handleChangeShowAnyTime: (is_show: boolean, class_id: string) => void;
};

interface InterfaceSubject extends EntityScheduleShortInfo {
  program_id: string;
}

function StyledTreeItem(props: StyledTreeItemProps) {
  const classes = useStyles();
  const { labelText, labelIcon: LabelIcon, labelInfo, color, bgColor, handleChangeShowAnyTime, ...other } = props;
  const minimumDom = Array.isArray(props.children) && (props.children as []).length < 1;
  const maxDom = ["School+1", "Others+1", "Programs+1", "ClassTypes+1"].includes(props.nodeId);
  const rgb = Math.floor(Math.random() * 256);
  const nodeValue = props.nodeId.split("+");

  console.log(nodeValue);

  return (
    <TreeItem
      label={
        <div className={classes.labelRoot}>
          <div style={{ display: "flex", alignItems: "center" }}>
            {LabelIcon && <LabelIcon color="inherit" className={classes.labelIcon} />}
            <Typography variant="body2" className={Array.isArray(props.children) && !props.children ? classes.subsets : classes.label}>
              {labelText}
            </Typography>
          </div>
          {labelText === "School 1" && (
            <Typography variant="caption" color="inherit">
              <FormControlLabel
                control={<Checkbox name="Only Mine" color="primary" />}
                onClick={(e) => {
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
  );
}

function FilterTemplate(props: FilterProps) {
  const css = useStyles();
  const dispatch = useDispatch();
  const [stateSubject, setStateSubject] = React.useState<InterfaceSubject[]>([]);
  const { classOptions, filterOption } = useSelector<RootState, RootState["schedule"]>((state) => state.schedule);
  const { handleChangeShowAnyTime } = props;

  const perm = usePermission([
    PermissionType.view_my_calendar_510,
    PermissionType.view_school_calendar_512,
    PermissionType.create_event_520,
    PermissionType.create_my_schools_schedule_events_522,
  ]);

  const subDataStructures = (id?: string, name?: string, parentName?: string) => {
    return { id: parentName ? `${parentName}+${id}` : (id as string), name: name as string, isCheck: false, child: [], isOnlyMine: false };
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
        item.schools?.forEach((school: EntityScheduleSchoolsInfo) => {
          let filterData = { is: false, index: 0 };
          classResult.forEach((result: FilterDataItemsProps, index: number) => {
            if (result.id === school.school_id) filterData = { is: result.id === school.school_id, index: index };
          });
          if (filterData.is) {
            classResult[filterData.index].child.push(subDataStructures(item.class_id, item.class_name, "class"));
          } else {
            classResult.push({
              id: `${school.school_id}`,
              name: school.school_name,
              isCheck: false,
              child: [subDataStructures(item.class_id, item.class_name, "class")],
              isOnlyMine: false,
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

  const getProgramByfilter = () => {
    const program: FilterDataItemsProps[] = [];
    filterOption.programs.forEach((val) => {
      program.push(subDataStructures(val.id, val.name, "program"));
      const subject: FilterDataItemsProps[] = [];
      stateSubject.forEach((v: InterfaceSubject) => {
        if (v.program_id === val.id) subject.push(subDataStructures(v.id, v.name, "subjectSub"));
      });
      const subjectSet = { id: `subject+${val.id}`, name: "Subject", isCheck: false, child: subject, isOnlyMine: false };
      if (subject.length > 0) program.push(subjectSet);
    });
    return program;
  };

  const handleToggle = (event: React.ChangeEvent<{}>, nodeIds: string[]) => {
    console.log((event.target as HTMLInputElement).checked, 888, nodeIds);
  };

  const handleSelect = async (event: React.ChangeEvent<{}>, nodeIds: string[]) => {
    const checked = (event.target as HTMLInputElement).checked;
    const nodeValue = nodeIds[0].split("+");
    if (nodeValue[0] === "program" && checked) {
      let resultInfo: any;
      resultInfo = ((await dispatch(ScheduleFilterSubject({ program_id: nodeValue[1] }))) as unknown) as PayloadAction<
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

  const filterData: FilterDataItemsProps[] = [
    {
      id: "School+1",
      name: d("All My Schools").t("schedule_filter_all_my_schools"),
      isCheck: false,
      child: getClassBySchool(),
      isOnlyMine: false,
    },
    { id: "Others+1", name: "Others", isCheck: false, child: [subDataStructures("fas", "subject", "other")], isOnlyMine: false },
    { id: "Programs+1", name: "Programs", isCheck: false, child: getProgramByfilter(), isOnlyMine: false },
    { id: "ClassTypes+1", name: "ClassTypes", isCheck: false, child: getClassTypeByFilter(), isOnlyMine: false },
  ];
  const styledTreeItemTemplate = (treeItem: FilterDataItemsProps[]) => {
    return treeItem.map((item: FilterDataItemsProps) => {
      return (
        <>
          {["School+1", "Programs+1"].includes(item.id) && <div className={css.fliterRouter}></div>}
          <StyledTreeItem nodeId={item.id} labelText={item.name} handleChangeShowAnyTime={handleChangeShowAnyTime}>
            {item.child && styledTreeItemTemplate(item.child)}
          </StyledTreeItem>
        </>
      );
    });
  };

  return (
    <TreeView
      className={css.containerRoot}
      defaultExpanded={["1"]}
      defaultCollapseIcon={<KeyboardArrowUpOutlinedIcon className={css.filterArrow} />}
      defaultExpandIcon={<KeyboardArrowDownOutlinedIcon className={css.filterArrow} style={{ cursor: "pointer" }} />}
      defaultEndIcon={<Checkbox color="primary" inputProps={{ "aria-label": "primary checkbox" }} />}
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
