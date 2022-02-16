import { GetProgramsQuery } from "@api/api-ko.auto";
import { makeStyles, useMediaQuery, useTheme } from "@material-ui/core";
import Box from "@material-ui/core/Box";
import Button from "@material-ui/core/Button";
import Checkbox from "@material-ui/core/Checkbox";
import Paper from "@material-ui/core/Paper";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import TextField from "@material-ui/core/TextField";
import Tooltip from "@material-ui/core/Tooltip";
import { SearchOutlined } from "@material-ui/icons";
import CheckBoxIcon from "@material-ui/icons/CheckBox";
import CheckBoxOutlineBlankIcon from "@material-ui/icons/CheckBoxOutlineBlank";
import Autocomplete from "@material-ui/lab/Autocomplete";
import { RootState } from "@reducers/index";
import { actError } from "@reducers/notify";
import { getProgramChild } from "@reducers/schedule";
import { AsyncTrunkReturned } from "@reducers/type";
import { PayloadAction } from "@reduxjs/toolkit";
import React, { ReactNode, useMemo } from "react";
import { Controller, UseFormMethods } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { EntityScheduleDetailsView } from "../../api/api.auto";
import { d } from "../../locale/LocaleManager";
import { modelSchedule } from "../../models/ModelSchedule";
import { EntityScheduleShortInfo, LearningComesFilterQuery, LearningContentList, LearningContentListForm } from "../../types/scheduleTypes";
import clsx from "clsx";
import FilterListIcon from "@material-ui/icons/FilterList";
import CloseIcon from "@material-ui/icons/Close";
import CancelOutlinedIcon from "@material-ui/icons/CancelOutlined";
import SearchIcon from "@material-ui/icons/Search";

const useStyles = makeStyles(({ spacing, breakpoints }) => ({
  previewContainer: {
    width: "860px",
    [breakpoints.down(650)]: {
      paddingLeft: "99%",
    },
    borderRadius: "4px",
    boxShadow: "0px 11px 15px -7px rgba(0,0,0,0.2), 0px 9px 46px 8px rgba(0,0,0,0.12), 0px 24px 38px 3px rgba(0,0,0,0.14)",
    padding: "26px 20px 10px 20px",
  },
  customizeContentBox: {
    width: "100%",
    maxHeight: "47vh",
    [breakpoints.down(650)]: {
      maxHeight: "60vh",
    },
    overflow: "auto",
    "&::-webkit-scrollbar": {
      width: "3px",
    },
    "&::-webkit-scrollbar-track": {
      boxShadow: "inset 0 0 6px rgba(0,0,0,0.3)",
    },
    "&::-webkit-scrollbar-thumb": {
      borderRadius: "3px",
      backgroundColor: "rgb(220, 220, 220)",
      boxShadow: "inset 0 0 3px rgba(0,0,0,0.5)",
    },
    "&::-webkit-scrollbar-thumb:window-inactive": {
      backgroundColor: "rgba(220,220,220,0.4)",
    },
  },
  button: {
    margin: spacing(1),
    height: 40,
  },
  exectSearchInput: {
    width: 90,
    marignRgiht: -10,
    height: 40,
    boxSizing: "border-box",
    background: "#F0F0F0",
    "& .MuiOutlinedInput-notchedOutline": {
      border: 0,
    },
  },
  searchCon: {
    display: "inline-flex",
    border: "1px solid rgba(0,0,0,0.23)",
    borderRadius: 4,
    boxSizing: "border-box",
    verticalAlign: "top",
    width: "86%",
  },
  searchText: {
    "& .MuiOutlinedInput-notchedOutline": {
      border: 0,
      borderRadius: 0,
    },
  },
  table: {},
  margin: {
    margin: spacing(1),
  },
  flexBox: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  flexBoxGroup: {
    borderBottom: "2px solid #EEEEEE",
    paddingBottom: "10px",
    marginBottom: "10px",
    [breakpoints.down(600)]: {
      borderBottom: "none",
      paddingBottom: "0px",
      marginBottom: "0px",
    },
  },
  fieldset: {
    width: "230px",
    "& .MuiInputBase-root": {
      borderRadius: "10px",
    },
    "& .MuiChip-deleteIcon": {
      display: "none",
    },
  },
  activeSelect: {
    "& .MuiInputBase-root": {
      backgroundColor: "#0E78D5",
    },
    "& .MuiChip-label": {
      width: "170px",
    },
    "& .MuiInputBase-input , .MuiIconButton-label": {
      color: "white",
    },
    "& .MuiAutocomplete-tag": {
      color: "white",
      marginLeft: "12px",
      display: "none",
    },
    "& .MuiAutocomplete-tag:first-of-type": {
      display: "inline-flex",
    },
    "& .MuiChip-deletable": {
      backgroundColor: "#0E78D5",
      color: "white",
      marginLeft: "0px",
      "& .MuiChip-deleteIcon": {
        color: "white",
      },
      width: "78%",
      "& span": {
        position: "absolute",
        left: 0,
      },
    },
  },
  root: {
    marginTop: 8,
    flexGrow: 1,
    display: "flex",
    [breakpoints.down(600)]: {
      paddingBottom: 0,
      marginBottom: 0,
      marginTop: 0,
    },
  },
  filterBox: {
    display: "flex",
    flexWrap: "wrap",
    justifyContent: "center",
    alignItems: "center",
    borderLeft: "2px solid #EEEEEE",
    [breakpoints.down(600)]: {
      borderRight: "2px solid #EEEEEE",
      flexWrap: "unset",
    },
  },
  selectBox: {
    display: "flex",
    alignItems: "flex-start",
    marginTop: "10px",
    [breakpoints.down(600)]: {
      marginTop: "0px",
    },
  },
  assumedBnt: {
    margin: "0 15px 0 15px",
    width: 100,
    borderRadius: "10px",
    backgroundColor: "white",
    color: "gray",
  },
  activeAssumedBnt: {
    margin: "0 15px 0 15px",
    width: 100,
    borderRadius: "10px",
  },
  lessonTitle: {
    display: "flex",
    justifyContent: "space-between",
    "& span": {
      color: "#000000",
      fontWeight: 700,
      fontSize: 23,
      padding: "0 10px 0 10px",
    },
  },
  previewContainerMb: {
    position: "fixed",
    backgroundColor: "white",
    width: "100%",
    top: 0,
    left: 0,
    zIndex: 999,
  },
  lessonTitleMb: {
    display: "flex",
    justifyContent: "space-between",
    padding: "23px 30px 20px 30px",
    "& span": {
      color: "#000000",
      fontWeight: 700,
      fontSize: 16,
      padding: "0 10px 0 10px",
    },
  },
  mobileSearch: {
    width: "80%",
    "& .MuiInputBase-root": {
      borderRadius: "27px",
    },
  },
  scrollSelect: {
    display: "flex",
    alignItems: "center",
    overflow: "auto",
    borderTop: "1px solid #EFEFEF",
    boxShadow: "0px 4px 4px rgb(0 0 0 / 25%)",
    padding: "8px",
    marginTop: "10px",
  },
  resetControl: {
    fontFamily: "Helvetica",
    fontSize: "14px",
    fontWeight: 400,
    marginLeft: 10,
  },
  resultText: {
    lineHeight: "28px",
    background: "#EFEFEF",
    fontSize: "13px",
    height: "28px",
    paddingLeft: "18px",
    color: "#626262",
    display: "flex",
    justifyContent: "space-between",
    paddingRight: "18px",
  },
  saveMb: {
    width: "297px",
    height: "50px",
    background: "#0E78D5",
    borderRadius: "8px",
    textAlign: "center",
    marginTop: "6px",
    fontWeight: 700,
  },
  lessonNameMb: {
    fontFamily: "Helvetica",
    fontSize: "16px",
    fontWeight: 700,
    display: "block",
    whiteSpace: "break-spaces",
    wordBreak: "break-all",
  },
  lessonGroupMb: {
    color: "#666666",
    fontFamily: "Helvetica",
    fontSize: "13px",
    fontWeight: 400,
    display: "block",
    margin: "10px 0px 10px 0px",
  },
  emptyLabel: {
    fontFamily: "Helvetica",
    fontSize: 20,
    fontWeight: 700,
    color: "#ACACAC",
    textAlign: "center",
    marginTop: "16vh",
    marginBottom: "8vh",
  },
  previewDetailMb: {
    overflow: "auto",
    marginBottom: "18px",
    paddingRight: "3%",
    paddingLeft: "3%",
    marginTop: 3,
  },
  lessonsItemMb: {
    display: "flex",
    alignItems: "center",
    borderBottom: "1px solid #D8D8D8",
    padding: "20px 0 16px 0",
  },
  tableRow: {
    "& .MuiTableRow-root.Mui-selected": {
      background: "#E4F1FF",
    },
  },
}));

interface filterGropProps {
  programs: EntityScheduleShortInfo[];
  searchOutcomesList: (filterQueryAssembly: object, assumed?: boolean) => void;
  filterGropuData: LearningComesFilterQuery;
  handelSetProgramChildInfo: (data: GetProgramsQuery[]) => void;
  programChildInfoParent: GetProgramsQuery[];
  filterQuery?: LearningComesFilterQuery;
  setFilterQuery?: (data: LearningComesFilterQuery) => void;
  getFilterQueryAssembly?: (filterData: LearningComesFilterQuery) => void;
  viewSubjectPermission?: boolean;
  checkAssume?: (value: boolean) => void;
  checkAssumed?: boolean;
}

interface InfoProps extends filterGropProps {
  conditionFormMethods: UseFormMethods<LearningContentListForm>;
  saveOutcomesList: (value: string[]) => void;
  learingOutcomeData: LearningContentListForm;
  handleClose: () => void;
  outComeIds: string[];
  scheduleDetial: EntityScheduleDetailsView;
}

function SelectGroup(props: filterGropProps) {
  const classes = useStyles();
  const {
    programs,
    searchOutcomesList,
    handelSetProgramChildInfo,
    programChildInfoParent,
    filterQuery,
    setFilterQuery,
    viewSubjectPermission,
    checkAssume,
    checkAssumed,
  } = props;
  const [programChildInfo, setProgramChildInfo] = React.useState<GetProgramsQuery[]>(programChildInfoParent);

  const dispatch = useDispatch();

  const autocompleteChange = async (value: any | null, name: "subjects" | "categorys" | "subs" | "ages" | "grades" | "programs") => {
    const ids = value?.map((item: any) => {
      return item.id;
    });
    const program_id = ids.pop();
    const is_exist = () =>
      programChildInfo?.some((item) => {
        return item?.program?.id === program_id;
      });
    if (name === "programs" && program_id && !is_exist()) {
      if (viewSubjectPermission) {
        let resultInfo: any;
        resultInfo = (await dispatch(getProgramChild({ program_id: program_id, metaLoading: true }))) as unknown as PayloadAction<
          AsyncTrunkReturned<typeof getProgramChild>
        >;
        if (resultInfo.payload) {
          handelSetProgramChildInfo(
            [resultInfo.payload.programChildInfo as GetProgramsQuery].concat(
              programChildInfo ? (programChildInfo as GetProgramsQuery[]) : []
            )
          );
          setProgramChildInfo(
            [resultInfo.payload.programChildInfo as GetProgramsQuery].concat(
              programChildInfo ? (programChildInfo as GetProgramsQuery[]) : []
            )
          );
        }
      } else {
        dispatch(actError(d("You do not have permission to access this feature.").t("schedule_msg_no_permission")));
      }
    }
    const filterIds = value?.map((item: any) => {
      return item.id;
    });
    const initFilterIds = value?.map((item: any) => {
      return item.id;
    });
    if (program_id !== "1" && filterIds.includes("1"))
      filterIds.splice(
        filterIds.findIndex((id: any) => id === "1"),
        1
      );
    const filterData =
      name === "programs" && !value.length
        ? { programs: [], subjects: [], categorys: [], subs: [], ages: [], grades: [] }
        : {
            ...filterQuery,
            [name]: filterQuery && filterQuery[name].includes("1") && !initFilterIds.includes("1") ? [] : filterIds,
          };
    const filterResult = (
      programChildInfo?.length
        ? (modelSchedule.learningOutcomeFilerGroup(filterData as LearningComesFilterQuery, programChildInfo)
            .query as LearningComesFilterQuery)
        : filterData
    ) as LearningComesFilterQuery;
    setFilterQuery && setFilterQuery(filterResult);
    const values = (item: string[]) => (item.length > 0 ? item : null);
    const filterQueryAssembly = {
      program_ids: values(filterResult.programs),
      subject_ids: values(filterResult.subjects),
      category_ids: values(filterResult.categorys),
      sub_category_ids: values(filterResult.subs),
      age_ids: values(filterResult.ages),
      grade_ids: values(filterResult.grades),
    };
    searchOutcomesList(filterQueryAssembly, checkAssumed);
  };
  const filteredList = useMemo(() => {
    return modelSchedule.learningOutcomeFilerGroup(filterQuery, programChildInfo).assembly;
  }, [filterQuery, programChildInfo]);
  const deduplication = (childItem: EntityScheduleShortInfo[]) => {
    const reduceTemporaryStorage: { [id: string]: boolean } = {};
    return childItem.reduce<EntityScheduleShortInfo[]>((item, next) => {
      if (next !== null)
        if (!reduceTemporaryStorage[next.id as string] && next.id) {
          item.push(next);
          reduceTemporaryStorage[next.id as string] = true;
        }
      return item;
    }, []);
  };
  const defaultValues = (enumType: "subjects" | "categorys" | "subs" | "ages" | "grades") =>
    deduplication(filteredList[enumType])?.filter((item: any) => filterQuery && filterQuery[enumType]?.includes(item.id as string));
  const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
  const checkedIcon = <CheckBoxIcon fontSize="small" />;

  const selectGroup = [
    { name: d("Programs").t("schedule_filter_programs"), data: programs, enum: "programs" },
    { name: d("Subjects").t("schedule_filter_subjects"), data: deduplication(filteredList.subjects), enum: "subjects" },
    { name: d("Category").t("library_label_category"), data: deduplication(filteredList.categorys), enum: "categorys" },
    { name: d("Sub Category").t("schedule_sub_category"), data: deduplication(filteredList.subs), enum: "subs" },
    { name: d("Age").t("assess_label_age"), data: deduplication(filteredList.ages), enum: "ages" },
    { name: d("Grade").t("assess_label_grade"), data: deduplication(filteredList.grades), enum: "grades" },
  ];

  const { breakpoints } = useTheme();
  const mobile = useMediaQuery(breakpoints.down(600));

  const autocompleteValue = (key: string) => {
    return key === "programs"
      ? programs.filter((item) => filterQuery && filterQuery.programs?.includes(item.id as string))
      : defaultValues(key as "subjects" | "categorys" | "subs" | "ages" | "grades");
  };

  return (
    <div className={classes.root}>
      <div className={classes.selectBox}>
        <FilterListIcon style={{ marginTop: "8px" }} />
        <Button
          variant="contained"
          size="medium"
          color="primary"
          onClick={(e) => {
            checkAssume && checkAssume(!checkAssumed);
          }}
          className={checkAssumed ? classes.activeAssumedBnt : classes.assumedBnt}
        >
          {d("Assumed").t("assess_filter_assumed")}
        </Button>
      </div>
      <div className={classes.root}>
        <div className={classes.filterBox}>
          {selectGroup.map((item, index) => (
            <Autocomplete
              key={index}
              id="combo-box-demo"
              options={item.data}
              getOptionLabel={(option: any) => option.name}
              multiple
              limitTags={1}
              onChange={(e: any, newValue) => {
                autocompleteChange(newValue, item.enum as "subjects" | "categorys" | "subs" | "ages" | "grades");
              }}
              value={autocompleteValue(item.enum)}
              disableCloseOnSelect
              renderOption={(option: any, { selected }) => (
                <React.Fragment>
                  <Checkbox color="primary" icon={icon} checkedIcon={checkedIcon} style={{ marginRight: 8 }} checked={selected} />
                  {option.name}
                </React.Fragment>
              )}
              style={{ transform: "scale(0.9)" }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  style={{ marginTop: index > 2 && !mobile ? 16 : 0 }}
                  size={"small"}
                  className={clsx(classes.fieldset, autocompleteValue(item.enum).length ? classes.activeSelect : "")}
                  placeholder={item.name}
                  variant="outlined"
                />
              )}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

interface ScheduleLessonPlanMbProps {
  content_lists: LearningContentList[];
  handleClose: () => void;
  lessonPlanName: string;
  filterQuery?: LearningComesFilterQuery;
  selectedValue?: string;
  getSelectStatus: (index: number, item: LearningContentList) => void;
  learingOutComeTotal: number;
  resetDisabled: number | boolean;
  reset: () => void;
  save: () => void;
  selectGroupTemplate: () => ReactNode;
  saveDisabled: boolean;
  getLearningFiledMb: (ids: string[]) => string | undefined;
  selectIds: string[];
  searchVal: () => void;
  setValueAll: (val: string) => void;
  control: any;
  getValues: any;
}

function ScheduleLessonPlanMb(props: ScheduleLessonPlanMbProps) {
  const {
    content_lists,
    handleClose,
    lessonPlanName,
    getSelectStatus,
    learingOutComeTotal,
    resetDisabled,
    reset,
    save,
    selectGroupTemplate,
    saveDisabled,
    getLearningFiledMb,
    selectIds,
    searchVal,
    control,
    setValueAll,
    getValues,
  } = props;
  const classes = useStyles();
  const [boxHeight, setBoxHeight] = React.useState(window.innerHeight);
  const previewDetailMbHeight = () => {
    const offset = !!navigator.userAgent.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/);
    if (offset) {
      if (window.screen.height < 700) {
        return `${window.screen.height - 450}px`;
      } else if (window.screen.height < 750) {
        return `${window.screen.height - 480}px`;
      }
    }
    return `${offset ? window.screen.height - 540 : window.screen.height - 445}px`;
  };

  window.onresize = () => {
    setBoxHeight(window.innerHeight);
  };

  return (
    <Box className={classes.previewContainerMb} style={{ height: `${boxHeight}px` }}>
      <div className={classes.lessonTitleMb}>
        <span>{d("Add Learning Outcomes").t("library_label_add_learning_outcomes")}</span> <CloseIcon onClick={handleClose} />
      </div>
      <div style={{ textAlign: "center" }}>
        <Controller
          style={{
            borderLeft: 0,
            width: "640px",
          }}
          defaultValue={lessonPlanName}
          name="search_value"
          control={control}
          size="small"
          className={classes.searchText}
          placeholder={d("Search").t("library_label_search")}
          render={(props: { value: any }) => (
            <TextField
              id="outlined-start-adornment"
              placeholder={"Search for Learning outcome"}
              InputProps={{
                startAdornment: <SearchIcon />,
              }}
              onKeyDown={(e) => {
                const code = e.keyCode || e.which || e.charCode;
                if (code === 13) {
                  searchVal();
                }
              }}
              onBlur={(e) => {
                searchVal();
              }}
              onChange={(e) => {
                setValueAll(e.target.value);
              }}
              size="small"
              className={classes.mobileSearch}
            />
          )}
        />
      </div>
      <div className={classes.scrollSelect}>
        {selectGroupTemplate()}
        <span
          className={classes.resetControl}
          style={{ color: resetDisabled ? "#0E78D5" : "#666666", marginTop: "-20px" }}
          onClick={() => {
            if (resetDisabled) reset();
          }}
        >
          {d("Reset").t("schedule_lesson_plan_popup_reset")}
        </span>
      </div>
      <div className={classes.resultText}>
        <span>
          {learingOutComeTotal} {d("Results").t("schedule_lesson_plan_popup_results")}
        </span>
        <span style={{ color: "#0E78D5", fontWeight: 700 }}>
          {selectIds.length} {d("Added").t("schedule_lo_number_added")}
        </span>
      </div>
      <div className={classes.previewDetailMb} style={{ height: previewDetailMbHeight() }}>
        {content_lists.map((item, index) => (
          <div className={classes.lessonsItemMb} style={{ background: selectIds.includes(item?.id) ? "#E4F1FF" : "none" }}>
            <Checkbox
              checked={selectIds?.includes(item?.id)}
              onChange={() => {
                getSelectStatus(index, item);
              }}
              style={{ margin: "0px 6px 0px 6px" }}
              value={item?.id}
              color="primary"
              size="small"
            />
            <div>
              <span className={classes.lessonNameMb}>{item.name}</span>
              <span className={classes.lessonGroupMb}>
                <span
                  style={{
                    color: "black",
                    fontWeight: 600,
                  }}
                >
                  {getLearningFiledMb(item.category_ids)}
                </span>
                {`${getLearningFiledMb(item.sub_category_ids) ? " - " + getLearningFiledMb(item.sub_category_ids) : ""}`}
              </span>
            </div>
          </div>
        ))}
        {content_lists.length < 1 && (
          <p className={classes.emptyLabel} style={{ fontSize: 16 }}>
            {getValues.search_value
              ? d("No matching result").t("schedule_msg_no_matching_result")
              : d("No data available").t("schedule_popup_no_data_available")}
          </p>
        )}
      </div>
      <div style={{ textAlign: "center" }}>
        <Button className={classes.saveMb} color="primary" variant="contained" disabled={saveDisabled} onClick={save}>
          {d("OK").t("general_button_OK")}
        </Button>
      </div>
    </Box>
  );
}

export default function LearingOutcome(props: InfoProps) {
  const classes = useStyles();
  const {
    programs,
    conditionFormMethods,
    saveOutcomesList,
    searchOutcomesList,
    learingOutcomeData,
    handleClose,
    outComeIds,
    scheduleDetial,
    filterGropuData,
    handelSetProgramChildInfo,
    programChildInfoParent,
    viewSubjectPermission,
  } = props;
  const { control, setValue, getValues } = conditionFormMethods;
  const [dom, setDom] = React.useState<HTMLDivElement | null>(null);
  const [selectIds, setSelectIds] = React.useState<string[]>(outComeIds);
  const { outcomeList, outcomeTotal, developmental, skills } = useSelector<RootState, RootState["schedule"]>((state) => state.schedule);
  const content_list = useMemo(() => {
    return modelSchedule.AssemblyLearningOutcome(outcomeList);
  }, [outcomeList]);
  const [filterQuery, setFilterQuery] = React.useState<LearningComesFilterQuery>(filterGropuData);

  const getLearningFiled = (ids: string[]) => {
    const categoryAssembly = modelSchedule.getLearingOutcomeCategory(skills.concat(developmental), ids ?? []);
    return categoryAssembly.map((item) => {
      return (
        <div key={`${item.id}`} style={{ marginTop: "10px" }}>
          <Tooltip title={item.name as string} placement="top-start">
            <span>{item.name}</span>
          </Tooltip>
        </div>
      );
    });
  };

  const getLearningFiledMb = (ids: string[]) => {
    const categoryAssembly = modelSchedule.getLearingOutcomeCategory(skills.concat(developmental), ids ?? []);
    console.log(categoryAssembly);
    return categoryAssembly.length ? categoryAssembly[0].name : "";
  };

  const [checkAssumed, setCheckAssumed] = React.useState<boolean>(learingOutcomeData.is_assumed);

  const getFilterQueryAssembly = (filterData: LearningComesFilterQuery) => {
    const values = (item: string[]) => (item.length > 0 ? item : null);
    return {
      program_ids: values(filterData.programs),
      subject_ids: values(filterData.subjects),
      category_ids: values(filterData.categorys),
      sub_category_ids: values(filterData.subs),
      age_ids: values(filterData.ages),
      grade_ids: values(filterData.grades),
    };
  };

  const content_lists = useMemo(() => {
    const check: LearningContentList[] = [];
    const unCheck: LearningContentList[] = [];
    outComeIds.forEach((id) => {
      const is_exist = content_list.filter((item) => {
        return item.id === id;
      });
      if (is_exist.length > 0) check.unshift({ ...is_exist[0], select: selectIds.includes(id as string) } as LearningContentList);
    });
    content_list.forEach((item) => {
      if (!outComeIds.includes(item.id as string)) {
        unCheck.push({ ...item, select: selectIds.includes(item.id as string) } as LearningContentList);
      }
    });
    return check.concat(unCheck);
  }, [outComeIds, selectIds, content_list]);

  const handleGoOutcomeDetail = (id: string) => {
    window.open(`#/assessments/outcome-edit?outcome_id=${id}&readonly=true`, "_blank");
  };

  /*  const reBytesStr = (str: string, len: number) => {
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
    const CharacterCount = 20;
    return value ? reBytesStr(value, CharacterCount) : "";
  };*/

  const handleOnScroll = () => {
    if (dom) {
      const contentScrollTop = dom.scrollTop; //滚动条距离顶部
      const clientHeight = dom.clientHeight; //可视区域
      const scrollHeight = dom.scrollHeight; //滚动条内容的总高度
      if (contentScrollTop + clientHeight >= scrollHeight) {
        const maxPage = Math.ceil(Number(outcomeTotal) / 10);
        const page = getValues().page + 1;
        if (page > maxPage) return;
        setValue(`page`, page);
        // searchOutcomesList();
      }
    }
  };

  const getSelectStatus = (index: number, item: LearningContentList) => {
    setValue(`content_list[${index}]`, { ...item, select: !item.select });
    if (!item.select) {
      const data = [...selectIds, item.id];
      setSelectIds(data);
    } else {
      const data = selectIds.filter((id) => id !== item.id);
      setSelectIds(data);
    }
  };

  const checkAssume = (value: boolean) => {
    //  dispatch(resetActOutcomeList([]));
    setCheckAssumed(!checkAssumed);
    setValue(`is_assumed`, value);
    setValue(`page`, 1);
    searchOutcomesList(getFilterQueryAssembly(filterQuery), value);
  };

  const reset = () => {
    setFilterQuery({ programs: [], subjects: [], categorys: [], subs: [], ages: [], grades: [] });
    setValue(`search_type`, "all");
    setValue(`search_value`, "");
    setValue(`is_assumed`, -1);
    setValue(`page`, 1);
    setCheckAssumed(false);
    setSelectIds(outComeIds);
    searchOutcomesList(getFilterQueryAssembly({ programs: [], subjects: [], categorys: [], subs: [], ages: [], grades: [] }));
  };

  const setValueAll = (val: string) => {
    setValue(`search_type`, "all");
    setValue(`search_value`, val);
  };

  const resetDisabled = useMemo(() => {
    return (
      filterQuery.programs.length ||
      filterQuery.subjects.length ||
      filterQuery.categorys.length ||
      filterQuery.subs.length ||
      filterQuery.grades.length ||
      filterQuery.ages.length ||
      selectIds.length ||
      checkAssumed
    );
  }, [filterQuery, selectIds, checkAssumed]);

  const saveDisabled = useMemo(() => {
    return !selectIds.length;
  }, [selectIds]);

  const { breakpoints } = useTheme();
  const mobile = useMediaQuery(breakpoints.down(600));

  const save = () => {
    saveOutcomesList(selectIds);
  };

  const searchVal = () => {
    // dispatch(resetActOutcomeList([]));
    setValue(`page`, 1);
    searchOutcomesList(getFilterQueryAssembly(filterQuery), checkAssumed);
  };

  const selectGroupTemplate = () => {
    return (
      <Box className={clsx(classes.flexBox, classes.flexBoxGroup)}>
        <SelectGroup
          programChildInfoParent={programChildInfoParent}
          handelSetProgramChildInfo={handelSetProgramChildInfo}
          programs={programs}
          filterGropuData={filterGropuData}
          searchOutcomesList={searchOutcomesList}
          filterQuery={filterQuery}
          setFilterQuery={setFilterQuery}
          getFilterQueryAssembly={getFilterQueryAssembly}
          viewSubjectPermission={viewSubjectPermission}
          checkAssume={checkAssume}
          checkAssumed={checkAssumed}
        />
      </Box>
    );
  };

  return mobile ? (
    <ScheduleLessonPlanMb
      content_lists={content_lists}
      getSelectStatus={getSelectStatus}
      handleClose={handleClose}
      lessonPlanName={learingOutcomeData.search_value}
      learingOutComeTotal={content_lists.length}
      reset={reset}
      resetDisabled={resetDisabled}
      save={save}
      saveDisabled={saveDisabled}
      getLearningFiledMb={getLearningFiledMb}
      selectGroupTemplate={selectGroupTemplate}
      selectIds={selectIds}
      searchVal={searchVal}
      setValueAll={setValueAll}
      getValues={getValues()}
      control={control}
    />
  ) : (
    <Box className={classes.previewContainer}>
      <div className={classes.lessonTitle}>
        <span>Learning Outcome</span> <CloseIcon onClick={handleClose} style={{ cursor: "pointer" }} />
      </div>
      <Box className={classes.flexBox} style={{ margin: "10px 0px 0px 10px" }}>
        <div
          style={{
            alignItems: "center",
            display: "flex",
            width: "100%",
          }}
        >
          <div className={classes.searchCon}>
            <Controller
              style={{
                borderLeft: 0,
                width: "180px",
                display: "none",
              }}
              as={TextField}
              defaultValue={learingOutcomeData.page}
              name="page"
              control={control}
            />
            <div style={{ position: "relative", width: "100%" }}>
              <Controller
                style={{
                  borderLeft: 0,
                  width: "90%",
                }}
                as={TextField}
                defaultValue={learingOutcomeData.search_value}
                name="search_value"
                control={control}
                size="small"
                InputProps={{
                  startAdornment: <SearchIcon />,
                }}
                onKeyDown={(e: any) => {
                  const code = e.keyCode || e.which || e.charCode;
                  if (code === 13) {
                    searchVal();
                  }
                }}
                className={classes.searchText}
                placeholder={d("Search").t("library_label_search")}
              />
              <CancelOutlinedIcon
                style={{
                  position: "absolute",
                  right: "10px",
                  top: "8px",
                  cursor: "pointer",
                  display: "none",
                }}
                onClick={() => {
                  setValue(`search_value`, "");
                }}
              />
            </div>
          </div>
          <Button
            variant="contained"
            color="primary"
            className={classes.button}
            startIcon={<SearchOutlined />}
            onClick={() => {
              searchVal();
            }}
          >
            {d("Search").t("library_label_search")}
          </Button>
        </div>
      </Box>
      {selectGroupTemplate()}
      <span style={{ color: "#666666", fontWeight: 400, fontSize: 14, marginLeft: 8 }}>
        {content_lists.length} {d("Results").t("schedule_lesson_plan_popup_results")}
      </span>
      <div
        style={{ margin: "10px 0 20px 0" }}
        className={classes.customizeContentBox}
        ref={(dom) => {
          setDom(dom);
        }}
        onScrollCapture={(e) => handleOnScroll()}
      >
        <TableContainer component={Paper}>
          <Table className={classes.table} aria-label="simple table">
            <TableHead style={{ backgroundColor: "#F2F5F7" }}>
              <TableRow>
                <TableCell align="center">&nbsp;</TableCell>
                <TableCell align="center">{d("Learning Outcomes").t("library_label_learning_outcomes")}</TableCell>
                <TableCell align="center">{d("Category").t("library_label_category")}</TableCell>
                <TableCell align="center">{d("Subcategory").t("library_label_subcategory")}</TableCell>
              </TableRow>
            </TableHead>
            <TableBody className={classes.tableRow}>
              {content_lists.map((item, index) => (
                <Controller
                  key={item.id + item.select}
                  name={`content_list[${index}]`}
                  control={control}
                  defaultValue={item}
                  render={(props: { value: LearningContentList }) => (
                    <TableRow
                      key={props.value.id}
                      onClick={() => {
                        handleGoOutcomeDetail(props.value.id);
                      }}
                      selected={selectIds.includes(props.value.id)}
                    >
                      <TableCell align="center">
                        <Checkbox
                          checked={props.value.select}
                          onChange={(e) => {
                            getSelectStatus(index, props.value);
                          }}
                          onClick={(e) => {
                            e.stopPropagation();
                            e.preventDefault();
                          }}
                          style={{ margin: "0px 6px 0px 6px" }}
                          color="primary"
                          size="small"
                        />
                      </TableCell>
                      <TableCell align="center">
                        <Tooltip title={props.value.name as string} placement="top-start">
                          <span
                            style={{
                              wordBreak: "break-word",
                              textAlign: props.value.name.length > 40 ? "left" : "center",
                              display: "block",
                              maxWidth: "300px",
                              margin: "auto",
                            }}
                          >
                            {props.value.name}
                          </span>
                        </Tooltip>
                      </TableCell>
                      <TableCell align="center" style={{ width: "160px" }}>
                        {getLearningFiled(props.value.category_ids)}
                      </TableCell>
                      <TableCell align="center" style={{ width: "160px" }}>
                        {getLearningFiled(props.value.sub_category_ids)}
                      </TableCell>
                    </TableRow>
                  )}
                />
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        {content_lists.length < 1 && (
          <p className={classes.emptyLabel}>
            {getValues().search_value
              ? d("No matching result").t("schedule_msg_no_matching_result")
              : d("No data available").t("schedule_popup_no_data_available")}
          </p>
        )}
      </div>
      <Box className={classes.flexBox}>
        <span
          style={{
            color: "rgb(14, 120, 213)",
            fontWeight: "bold",
            marginLeft: "20px",
          }}
        >
          {selectIds.length} {d("Added").t("schedule_lo_number_added")}
        </span>
        <div>
          <Button variant="outlined" size="large" color="primary" disabled={!resetDisabled} className={classes.margin} onClick={reset}>
            {d("Reset").t("schedule_lesson_plan_popup_reset")}
          </Button>
          <Button
            onClick={() => {
              saveOutcomesList(selectIds);
            }}
            variant="contained"
            size="large"
            color="primary"
            className={classes.margin}
            disabled={saveDisabled || scheduleDetial.complete_assessment}
          >
            {d("OK").t("general_button_OK")}
          </Button>
        </div>
      </Box>
    </Box>
  );
}
