import { Grid } from "@material-ui/core";
import { createStyles, makeStyles } from "@material-ui/core/styles";
import React from "react";
import { FilterType } from "../../types/scheduleTypes";
import Checkbox from "@material-ui/core/Checkbox";
import KeyboardArrowDownOutlinedIcon from "@material-ui/icons/KeyboardArrowDownOutlined";
import { FlattenedMockOptions } from "../../models/ModelMockOptions";
import KeyboardArrowUpOutlinedIcon from "@material-ui/icons/KeyboardArrowUpOutlined";
import clsx from "clsx";

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
  const { flattenedMockOptions, handleChangeLoadScheduleView } = props;

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

  const filterGather = [
    {
      name: "Schools",
      child: [
        { id: "School-1", name: "School-1" },
        { id: "School-2", name: "School-2" },
      ],
    },
    { name: "Teacher", child: flattenedMockOptions.teachers },
    { name: "Classes", child: flattenedMockOptions.classes },
    { name: "Programs", child: flattenedMockOptions.program },
    { name: "Subjects", child: flattenedMockOptions.subject },
  ];

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
    const filterQuery: any = {
      org_ids: getConnectionStr(activeGather.Schools),
      teacher_ids: getConnectionStr(activeGather.Teacher),
      class_ids: getConnectionStr(activeGather.Classes),
      subject_ids: getConnectionStr(activeGather.Subjects),
      program_ids: getConnectionStr(activeGather.Programs),
    };
    handleChangeLoadScheduleView(filterQuery);
    setActiveGather(activeGather);
    setActiveAll(false);
    if (activeGather.Schools.length < 1) {
      setActiveStatus({ ...activeStatus, Teacher: false, Classes: false });
    } else if (activeGather.Programs.length < 1) setActiveStatus({ ...activeStatus, Subjects: false });
  };

  const getConnectionStr = (item: []) => {
    let str = "";
    item.forEach((val: string, key: number) => {
      str = `${str},${val}`;
    });
    return str.substr(1);
  };

  const handleActiveAll = (event: React.ChangeEvent<HTMLInputElement>) => {
    setActiveAll(event.target.checked);
    const filterQuery: any = {
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
      (["Teacher", "Classes"].indexOf(type) > -1 && activeGather.Schools.length < 1) ||
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
        <span className={clsx(css.fliterRowSpan, css.fliterTitleSpan)}>All My Schedule</span>
      </Grid>
      {filterGather.map((gather: any, index: number) => (
        <Grid
          item
          xs={12}
          className={css.fliterRowDivChild}
          style={{
            maxHeight: activeStatus[gather.name as FilterType] ? "5000px" : "46px",
            paddingLeft: ["Teacher", "Classes", "Subjects"].indexOf(gather.name) > -1 ? "34px" : "8px",
          }}
        >
          <div className={isDisabledFliterRowSpan(gather.name) ? css.disabledFliterRowSpan : ""}>
            {!activeStatus[gather.name as FilterType] && (
              <KeyboardArrowDownOutlinedIcon
                className={css.filterArrow}
                style={{ cursor: isDisabledFliterRowSpan(gather.name) ? "not-allowed" : "pointer" }}
                onClick={() => changeFilterRow(gather.name)}
              />
            )}
            {activeStatus[gather.name as FilterType] && (
              <KeyboardArrowUpOutlinedIcon className={css.filterArrow} onClick={() => changeFilterRow(gather.name)} />
            )}
            <span className={css.fliterTitleSpan}>{gather.name}</span>
          </div>
          {gather.child.map((item: any, index: number) => (
            <div className={css.fliterDivChild}>
              <Checkbox
                color="primary"
                inputProps={{ "aria-label": "secondary checkbox" }}
                className={css.fliterRowChange}
                onChange={(e) => {
                  checkGather(e, item.id, gather.name);
                }}
              />
              <span className={css.fliterRowSpan}>{item.name}</span>
            </div>
          ))}
          {gather.child.length === 0 && (
            <div className={css.fliterDivChild}>
              <span className={css.emptyFliterRowSpan}>No Data</span>
            </div>
          )}
        </Grid>
      ))}
    </Grid>
  );
}

interface FilterProps {
  flattenedMockOptions: FlattenedMockOptions;
  handleChangeLoadScheduleView: (query: []) => void;
}

export default function ScheduleFilter(props: FilterProps) {
  const { flattenedMockOptions, handleChangeLoadScheduleView } = props;
  return <FilterTemplate flattenedMockOptions={flattenedMockOptions} handleChangeLoadScheduleView={handleChangeLoadScheduleView} />;
}
