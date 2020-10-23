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
      float: "right",
    },
    fliterRowDivChild: {
      maxHeight: "46px",
      transition: "max-height .3s",
      overflow: "hidden",
    },
    fliterDivChild: {
      paddingLeft: "10px",
      marginTop: "6px",
      height: "36px",
    },
    filterArrow: {
      float: "right",
      marginRight: "10px",
      cursor: "pointer",
    },
    emptyFliterRowSpan: {
      marginTop: "10px",
      float: "left",
      fontSize: "14px",
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
    { name: "Schools", child: [] },
    { name: "Teacher", child: flattenedMockOptions.teachers },
    { name: "Classes", child: flattenedMockOptions.classes },
    { name: "Subjects", child: flattenedMockOptions.subject },
    { name: "Programs", child: flattenedMockOptions.program },
  ];

  const changeFilterRow = (type: FilterType) => {
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

  return (
    <Grid container spacing={2} className={css.fliterRouter}>
      <Grid item xs={12}>
        <span className={clsx(css.fliterRowSpan, css.fliterTitleSpan)}>All My Schedule</span>
        <Checkbox
          color="primary"
          inputProps={{ "aria-label": "secondary checkbox" }}
          className={css.fliterRowChange}
          checked={activeAll}
          onChange={(e) => {
            handleActiveAll(e);
          }}
        />
      </Grid>
      {filterGather.map((gather: any, index: number) => (
        <Grid
          item
          xs={12}
          className={css.fliterRowDivChild}
          style={{ maxHeight: activeStatus[gather.name as FilterType] ? "5000px" : "46px" }}
        >
          <span className={css.fliterTitleSpan}>{gather.name}</span>
          {!activeStatus[gather.name as FilterType] && (
            <KeyboardArrowDownOutlinedIcon className={css.filterArrow} onClick={() => changeFilterRow(gather.name)} />
          )}
          {activeStatus[gather.name as FilterType] && (
            <KeyboardArrowUpOutlinedIcon className={css.filterArrow} onClick={() => changeFilterRow(gather.name)} />
          )}
          {gather.child.map((item: any, index: number) => (
            <div className={css.fliterDivChild}>
              <span className={css.fliterRowSpan}>{item.name}</span>
              <Checkbox
                color="primary"
                inputProps={{ "aria-label": "secondary checkbox" }}
                className={css.fliterRowChange}
                onChange={(e) => {
                  checkGather(e, item.id, gather.name);
                }}
              />
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
