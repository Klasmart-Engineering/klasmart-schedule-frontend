import { Grid } from "@material-ui/core";
import Checkbox from "@material-ui/core/Checkbox";
import { createStyles, makeStyles } from "@material-ui/core/styles";
import KeyboardArrowDownOutlinedIcon from "@material-ui/icons/KeyboardArrowDownOutlined";
import KeyboardArrowUpOutlinedIcon from "@material-ui/icons/KeyboardArrowUpOutlined";
import clsx from "clsx";
import React from "react";
import { MockOptionsItem, MockOptionsOptionsItem } from "../../api/extra";
import { d, t } from "../../locale/LocaleManager";
import { FilterQueryTypeProps, FilterType, ScheduleFilterProps } from "../../types/scheduleTypes";
import { PermissionType, usePermission } from "../../components/Permission";
import { getScheduleMockOptionsResponse } from "../../reducers/schedule";

const useStyles = makeStyles(({ shadows }) =>
  createStyles({
    fliterRouter: {
      width: "94%",
      margin: "0 auto",
      borderTop: "1px solid #eeeeee",
    },
    fliterTitleSpan: {
      fontWeight: 500,
    },
    fliterRowSpan: {
      marginTop: "10px",
      float: "left",
    },
    fliterRowChange: {
      float: "left",
    },
    fliterRowDivChild: {
      maxHeight: "46px",
      transition: "max-height .3s",
      overflow: "hidden",
    },
    fliterDivChild: {
      paddingLeft: "20px",
      marginTop: "6px",
      height: "36px",
    },
    filterArrow: {
      float: "left",
      marginRight: "8px",
      cursor: "pointer",
    },
    emptyFliterRowSpan: {
      marginTop: "10px",
      float: "left",
      fontSize: "14px",
      marginLeft: "30px",
    },
    disabledFliterRowSpan: {
      color: "#cccccc",
      cursor: "not-allowed",
    },
  })
);

function FilterTemplate(props: FilterProps) {
  const css = useStyles();
  const { handleChangeLoadScheduleView, mockOptions, scheduleMockOptions } = props;

  const perm = usePermission([PermissionType.view_my_calendar_510, PermissionType.view_school_calendar_512]);

  const [activeStatus, setActiveStatus] = React.useState({
    Schools: false,
    Teacher: false,
    Classes: false,
    Subjects: false,
    Programs: false,
  });

  const [activeAll, setActiveAll] = React.useState<boolean>(true);

  const [activeGather, setActiveGather] = React.useState<any>({
    Schools: [],
    Teacher: [],
    Classes: [],
    Subjects: [],
    Programs: [],
  });

  const getClassOption = (list: any) => {
    return list.classes.map((item: any) => {
      return { id: item.class_id, name: item.class_name };
    });
  };

  const getTeacherOption = (list: any) => {
    const teachers = list.teachers || [];
    return teachers.map((item: any) => {
      return { id: item.user_id, name: item.user_name };
    });
  };

  const [, setSubject] = React.useState<MockOptionsItem[]>([]);

  const myGather: ScheduleFilterProps[] = [
    { name: "Classes", label: "schedule_filter_classes", child: getClassOption(scheduleMockOptions.classList.organization) },
    { name: "Programs", label: "schedule_filter_programs", child: scheduleMockOptions.programList },
    { name: "Subjects", label: "schedule_filter_subjects", child: scheduleMockOptions.subjectList },
  ];

  const schoolGather: ScheduleFilterProps[] = [
    {
      name: "Schools",
      label: "schedule_filter_schools",
      child: [
        { id: "School-1", name: "School-1" },
        { id: "School-2", name: "School-2" },
      ],
    },
    { name: "Teacher", label: "schedule_filter_teachers", child: getTeacherOption(scheduleMockOptions.teacherList.organization) },
  ];

  const filterGather = perm.view_school_calendar_512 ? schoolGather.concat(myGather) : myGather;

  const changeFilterRow = (type: FilterType) => {
    if (isDisabledFliterRowSpan(type)) return;
    setActiveStatus({ ...activeStatus, [type]: !activeStatus[type] });
  };

  const checkGather = (event: React.ChangeEvent<HTMLInputElement>, id: string, group: string) => {
    if (event.target.checked && activeGather[group].indexOf(id) < 0) {
      activeGather[group].push(id);
    } else {
      activeGather[group].splice(activeGather[group].indexOf(id), 1);
    }
    if (group === "Programs") {
      const subjectResult: MockOptionsItem[] = [];
      mockOptions?.map((item: MockOptionsOptionsItem) => {
        if (activeGather[group].indexOf(item.program.id) > -1) subjectResult.push(item.subject[0]);
      });
      setSubject(subjectResult);
    }
    const filterQuery: FilterQueryTypeProps = {
      org_ids: getConnectionStr(activeGather.Schools),
      teacher_ids: getConnectionStr(activeGather.Teacher),
      class_ids: getConnectionStr(activeGather.Classes),
      subject_ids: getConnectionStr(activeGather.Subjects),
      program_ids: getConnectionStr(activeGather.Programs),
    };
    handleChangeLoadScheduleView(filterQuery);
    setActiveGather(activeGather);
    setActiveAll(false);
    if (activeGather.Schools.length < 1 && perm.view_school_calendar_512) {
      setActiveStatus({ ...activeStatus, Teacher: false, Classes: false });
      if (activeGather.Programs.length < 1) setActiveStatus({ ...activeStatus, Teacher: false, Classes: false, Subjects: false });
    } else if (activeGather.Programs.length < 1) setActiveStatus({ ...activeStatus, Subjects: false });
  };

  const getConnectionStr = (item: []) => {
    let str = "";
    item.forEach((val: string) => {
      str = `${str},${val}`;
    });
    return str.substr(1);
  };

  const handleActiveAll = (event: React.ChangeEvent<HTMLInputElement>) => {
    setActiveAll(event.target.checked);
    const filterQuery: FilterQueryTypeProps = {
      org_ids: getConnectionStr(activeGather.Schools),
      teacher_ids: getConnectionStr(activeGather.Teacher),
      class_ids: getConnectionStr(activeGather.Classes),
      subject_ids: getConnectionStr(activeGather.Subjects),
      program_ids: getConnectionStr(activeGather.Programs),
    };
    handleChangeLoadScheduleView(event.target.checked ? [] : filterQuery);
  };

  const isDisabledFliterRowSpan = (type: FilterType) => {
    return (
      (["Teacher", "Classes"].indexOf(type) > -1 && activeGather.Schools.length < 1 && perm.view_school_calendar_512) ||
      ("Subjects" === type && activeGather.Programs.length < 1)
    );
  };

  return (
    <Grid container spacing={2} className={css.fliterRouter}>
      <Grid item xs={12} style={{ paddingLeft: "0px" }}>
        <Checkbox
          color="primary"
          inputProps={{ "aria-label": "secondary checkbox" }}
          className={css.fliterRowChange}
          checked={activeAll}
          onChange={(e) => {
            handleActiveAll(e);
          }}
        />
        <span className={clsx(css.fliterRowSpan, css.fliterTitleSpan)}>{d("All My Schedule").t("scheudule_filter_all_my_schedule")}</span>
      </Grid>
      {filterGather.map((gather: ScheduleFilterProps, key: number) => (
        <Grid
          item
          xs={12}
          className={css.fliterRowDivChild}
          style={{
            maxHeight: activeStatus[gather.name] ? "5000px" : "46px",
            paddingLeft:
              (perm.view_school_calendar_512 ? ["Teacher", "Classes", "Subjects"] : ["Subjects"]).indexOf(gather.name) > -1
                ? "34px"
                : "8px",
          }}
          key={key}
        >
          <div className={isDisabledFliterRowSpan(gather.name) ? css.disabledFliterRowSpan : ""} style={{ height: "32px" }}>
            {!activeStatus[gather.name] && (
              <KeyboardArrowDownOutlinedIcon
                className={css.filterArrow}
                style={{ cursor: isDisabledFliterRowSpan(gather.name) ? "not-allowed" : "pointer" }}
                onClick={() => changeFilterRow(gather.name)}
              />
            )}
            {activeStatus[gather.name] && (
              <KeyboardArrowUpOutlinedIcon className={css.filterArrow} onClick={() => changeFilterRow(gather.name)} />
            )}
            <span className={css.fliterTitleSpan}>{t(gather.label)}</span>
          </div>
          {gather.child.map((item: MockOptionsItem, index: number) => (
            <div className={css.fliterDivChild} key={index}>
              <Checkbox
                color="primary"
                inputProps={{ "aria-label": "secondary checkbox" }}
                className={css.fliterRowChange}
                onChange={(e) => {
                  checkGather(e, item.id as string, gather.name);
                }}
              />
              <span className={css.fliterRowSpan}>{item.name}</span>
            </div>
          ))}
          {gather.child.length === 0 && (
            <div className={css.fliterDivChild}>
              <span className={css.emptyFliterRowSpan}>{d("No Data").t("schedule_filter_no_data")}</span>
            </div>
          )}
        </Grid>
      ))}
    </Grid>
  );
}

interface FilterProps {
  handleChangeLoadScheduleView: (filterQuery: FilterQueryTypeProps | []) => void;
  mockOptions: MockOptionsOptionsItem[] | undefined;
  scheduleMockOptions: getScheduleMockOptionsResponse;
}

export default function ScheduleFilter(props: FilterProps) {
  const { handleChangeLoadScheduleView, mockOptions, scheduleMockOptions } = props;
  return (
    <FilterTemplate
      handleChangeLoadScheduleView={handleChangeLoadScheduleView}
      mockOptions={mockOptions}
      scheduleMockOptions={scheduleMockOptions}
    />
  );
}
