import { Grid } from "@material-ui/core";
import { createStyles, makeStyles } from "@material-ui/core/styles";
import React from "react";
import { FilterType } from "../../types/scheduleTypes";
import Checkbox from "@material-ui/core/Checkbox";
import KeyboardArrowDownOutlinedIcon from "@material-ui/icons/KeyboardArrowDownOutlined";
import { FlattenedMockOptions } from "../../models/ModelMockOptions";
import KeyboardArrowUpOutlinedIcon from "@material-ui/icons/KeyboardArrowUpOutlined";

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
      fontWeight: 500,
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
  const { flattenedMockOptions } = props;

  const [activeStatus, setActiveStatus] = React.useState({
    Schools: false,
    Teacher: false,
    Classes: false,
    Subjects: false,
    Programs: false,
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

  const activeGather: string[] = [];

  const checkGather = (event: React.ChangeEvent<HTMLInputElement>, id: string) => {
    if (event.target.checked) {
      activeGather.push(id);
    } else {
      activeGather.splice(activeGather.indexOf(id), 1);
    }
  };

  const checkExist = (id: string) => {
    return activeGather.indexOf(id) > -1;
  };

  return (
    <Grid container spacing={2} className={css.fliterRouter}>
      <Grid item xs={12}>
        <span className={css.fliterRowSpan}>All My Schedule</span>
        <Checkbox color="primary" inputProps={{ "aria-label": "secondary checkbox" }} className={css.fliterRowChange} />
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
                  checkGather(e, item.id);
                }}
                checked={checkExist(item.id)}
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
}

export default function ScheduleFilter(props: FilterProps) {
  const { flattenedMockOptions } = props;
  return <FilterTemplate flattenedMockOptions={flattenedMockOptions} />;
}
