import { Box } from "@material-ui/core";
import Checkbox from "@material-ui/core/Checkbox";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Popover from "@material-ui/core/Popover";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import { SvgIconProps } from "@material-ui/core/SvgIcon";
import Typography from "@material-ui/core/Typography";
import AccessibilityNewIcon from "@material-ui/icons/AccessibilityNew";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import { TreeItemProps } from "@material-ui/lab/TreeItem";
import React, { useMemo } from "react";
import { d } from "../../locale/LocaleManager";
import { FilterDataItemsProps, memberType, FilterItemInfo, FilterSchoolInfo } from "../../types/scheduleTypes";
import CloseIcon from "@material-ui/icons/Close";
import Pagination from "@material-ui/lab/Pagination";

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
};

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
  class_name: string;
  class_id: string;
  showIcon: boolean;
  handleChangeShowAnyTime: (is_show: boolean, name: string, class_id?: string) => void;
}

function FilterLabel(props: FilterLabelProps) {
  const { class_name, class_id, showIcon, handleChangeShowAnyTime } = props;
  const css = useStyles();
  const name = <span style={{ fontWeight: 500, fontSize: "15px", marginLeft: "4px" }}>{class_name}</span>;
  const primeElement = <Checkbox defaultChecked color="primary" inputProps={{ "aria-label": "secondary checkbox" }} />;
  const classes = useStyles();
  const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(null);
  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;
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
      <div className={css.filterLabel}>
        {name}
        {FilterOnlyMineBox}
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
              handleChangeShowAnyTime(true, class_name, class_id);
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

function FilterOverall(props: FilterTreeProps) {
  const { classDataBySchool, handleChangeShowAnyTime } = props;
  const total = classDataBySchool.classes.length;
  const pageSize = 2;
  const [page, setPage] = React.useState(1);
  const handleChange = (event: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
  };
  const getClassDataBySchool = useMemo(() => {
    const classes = classDataBySchool.classes.filter((item, index) => {
      return index < page * pageSize;
    });
    return { ...classDataBySchool, classes: classes };
  }, [page, pageSize, classDataBySchool]);
  return (
    <Box
      style={{
        position: "absolute",
        width: "300px",
        left: "450px",
        top: "530px",
        zIndex: 999,
        boxShadow: "10px 10px 5px #888888",
        backgroundColor: "white",
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 10px 10px 10px" }}>
        <span style={{ fontSize: "17px", fontWeight: "bold" }}>
          {classDataBySchool.school_name}
          {classDataBySchool.onlyMine && (
            <Typography variant="caption" color="inherit">
              <FormControlLabel
                control={<Checkbox name="Only Mine" color="primary" style={{ marginTop: "-4px" }} />}
                label={d("Only Mine").t("schedule_filter_only_mine")}
                style={{ transform: "scale(0.7)", marginRight: "0px" }}
              />
            </Typography>
          )}
        </span>
        <CloseIcon />
      </div>
      {classDataBySchool.classes.length > 1 && (
        <FilterLabel class_name="全部学校" class_id="" showIcon={false} handleChangeShowAnyTime={handleChangeShowAnyTime} />
      )}
      <ul style={{ margin: "0px 0px 0px -26px" }}>
        {getClassDataBySchool.classes.map((item) => {
          return (
            <FilterLabel
              class_name={item.class_name}
              class_id={item.class_id}
              showIcon={item.showIcon}
              handleChangeShowAnyTime={handleChangeShowAnyTime}
            />
          );
        })}
      </ul>
      <Pagination
        count={total / pageSize}
        style={{ display: "flex", justifyContent: "center", padding: "12px" }}
        size="small"
        page={page}
        onChange={handleChange}
      />
    </Box>
  );
}

interface FilterTreeProps {
  classDataBySchool: FilterSchoolInfo;
  handleChangeShowAnyTime: (is_show: boolean, name: string, class_id?: string) => void;
}

export default function FilterTree(props: FilterTreeProps) {
  const { classDataBySchool, handleChangeShowAnyTime } = props;
  return <FilterOverall classDataBySchool={classDataBySchool} handleChangeShowAnyTime={handleChangeShowAnyTime} />;
}
