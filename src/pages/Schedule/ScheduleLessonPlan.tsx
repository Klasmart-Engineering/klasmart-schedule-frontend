import { makeStyles } from "@material-ui/core/styles";
import React, { ReactNode, useMemo } from "react";
import Box from "@material-ui/core/Box";
import CloseIcon from "@material-ui/icons/Close";
import { TextField, Button, Radio, LinearProgress, useTheme, useMediaQuery } from "@material-ui/core";
import SearchIcon from "@material-ui/icons/Search";
import FilterListIcon from "@material-ui/icons/FilterList";
import { GetProgramsQuery } from "@api/api-ko.auto";
import { useDispatch, useSelector } from "react-redux";
import { getProgramChild } from "@reducers/schedule";
import { PayloadAction } from "@reduxjs/toolkit";
import { AsyncTrunkReturned } from "@reducers/type";
import { actError } from "@reducers/notify";
import { d } from "@locale/LocaleManager";
import { modelSchedule } from "@models/ModelSchedule";
import { EntityScheduleShortInfo, LearningComesFilterQuery, LessonPlanFilterQuery } from "../../types/scheduleTypes";
import CheckBoxOutlineBlankIcon from "@material-ui/icons/CheckBoxOutlineBlank";
import CheckBoxIcon from "@material-ui/icons/CheckBox";
import Autocomplete from "@material-ui/lab/Autocomplete";
import Checkbox from "@material-ui/core/Checkbox";
import TableContainer from "@material-ui/core/TableContainer";
import Paper from "@material-ui/core/Paper";
import Table from "@material-ui/core/Table";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import TableCell from "@material-ui/core/TableCell";
import TableBody from "@material-ui/core/TableBody";
import { EntityLessonPlanForSchedule } from "@api/api.auto";
import { RootState } from "@reducers/index";
import clsx from "clsx";

const useStyles = makeStyles(({ spacing, breakpoints }) => ({
  previewContainer: {
    width: "960px",
    [breakpoints.down(650)]: {
      paddingLeft: "99%",
    },
    borderRadius: "4px",
    boxShadow: "0px 11px 15px -7px rgba(0,0,0,0.2), 0px 9px 46px 8px rgba(0,0,0,0.12), 0px 24px 38px 3px rgba(0,0,0,0.14)",
    padding: "26px 20px 10px 20px",
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
  searchValue: {
    display: "flex",
    justifyContent: "space-between",
    padding: "26px 10px 10px 6px",
  },
  root: {
    marginTop: 10,
    flexGrow: 1,
    display: "flex",
    paddingBottom: "20px",
    marginBottom: "10px",
    [breakpoints.down(600)]: {
      paddingBottom: 0,
      marginBottom: 0,
      marginTop: 0,
    },
  },
  fieldset: {
    width: "230px",
    "& .MuiInputBase-root": {
      borderRadius: "10px",
    },
  },
  margin: {
    margin: spacing(1),
    width: 104,
  },
  customizeContentBox: {
    width: "100%",
    maxHeight: "43vh",
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
  groupBox: {
    display: "flex",
    alignItems: "flex-start",
    height: "50%",
    paddingLeft: "8px",
    borderBottom: "2px solid #EEEEEE",
    marginBottom: "10px",
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
  previewContainerMb: {
    position: "fixed",
    backgroundColor: "white",
    width: "100%",
    top: 0,
    left: 0,
  },
  mobileSearch: {
    width: "80%",
    "& .MuiInputBase-root": {
      borderRadius: "27px",
    },
  },
  previewDetailMb: {
    overflow: "auto",
    marginBottom: "18px",
    paddingRight: "3%",
    paddingLeft: "3%",
  },
  activeSelect: {
    "& .MuiInputBase-root": {
      backgroundColor: "#0E78D5",
    },
    "& .MuiInputBase-input , .MuiIconButton-label": {
      color: "white",
    },
    "& .MuiAutocomplete-tag": {
      color: "white",
      marginLeft: "12px",
    },
    "& .MuiChip-deletable": {
      backgroundColor: "#0E78D5",
      color: "white",
      marginLeft: "0px",
      "& .MuiChip-deleteIcon": {
        color: "white",
      },
    },
  },
  emptyLabel: {
    fontFamily: "Helvetica",
    fontSize: 20,
    fontWeight: 700,
    color: "#ACACAC",
    textAlign: "center",
    marginTop: "16vh",
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
  },
  lessonsItemMb: {
    display: "flex",
    alignItems: "center",
    borderBottom: "1px solid #D8D8D8",
    padding: "20px 0 16px 0",
  },
  saveMb: {
    width: "297px",
    height: "50px",
    background: "#0E78D5",
    borderRadius: "8px",
    textAlign: "center",
    marginTop: "6px",
  },
  lessonNameMb: {
    fontFamily: "Helvetica",
    fontSize: "16px",
    fontWeight: 700,
    display: "block",
  },
  lessonGroupMb: {
    color: "#666666",
    fontFamily: "Helvetica",
    fontSize: "13px",
    fontWeight: 400,
    display: "block",
    margin: "10px 0px 10px 0px",
  },
  selectBox: {
    display: "flex",
    alignItems: "center",
    marginTop: "10px",
    [breakpoints.down(600)]: {
      marginTop: "0px",
    },
  },
}));

interface LessonPlanProps {
  programs: EntityScheduleShortInfo[];
  searchOutcomesList: (filterQueryAssembly: object) => void;
  filterGropuData: LearningComesFilterQuery;
  handelSetProgramChildInfo: (data: GetProgramsQuery[]) => void;
  programChildInfoParent?: GetProgramsQuery[];
  viewSubjectPermission?: boolean;
  filterQuery?: LearningComesFilterQuery;
  setFilterQuery?: (data: LearningComesFilterQuery) => void;
  getFilterQueryAssembly?: (filterData: LearningComesFilterQuery) => void;
  handleClose: () => void;
  lessonPlans: EntityLessonPlanForSchedule[];
  autocompleteChange: (value: any | null, name: string) => void;
  lessonPlanCondition: LessonPlanFilterQuery;
  lessonPlanId?: string;
}

interface filterGropProps {
  programs: EntityScheduleShortInfo[];
  searchOutcomesList: (filterQueryAssembly: object) => void;
  filterGropuData: LearningComesFilterQuery;
  handelSetProgramChildInfo: (data: GetProgramsQuery[]) => void;
  programChildInfoParent?: GetProgramsQuery[];
  filterQuery?: LearningComesFilterQuery;
  setFilterQuery?: (data: LearningComesFilterQuery) => void;
  getFilterQueryAssembly?: (filterData: LearningComesFilterQuery) => void;
  viewSubjectPermission?: boolean;
  lessonQuery: any;
  setLessonQuery: (data: any) => void;
  lessonPlanName: string;
  groupSelect: string[];
  setGroupSelect: (data: any) => void;
  setLessonPlanName: (data: any) => void;
  inquiryAssembly: (filterQueryData?: LearningComesFilterQuery, loadPages?: boolean, lessonName?: string, group?: string[]) => void;
  setProgramChildInfo: (data: any) => void;
  programChildInfo?: GetProgramsQuery[];
}

function SelectGroup(props: filterGropProps) {
  const classes = useStyles();
  const {
    programs,
    handelSetProgramChildInfo,
    filterQuery,
    viewSubjectPermission,
    inquiryAssembly,
    setProgramChildInfo,
    programChildInfo,
  } = props;

  const dispatch = useDispatch();

  const { breakpoints } = useTheme();
  const mobile = useMediaQuery(breakpoints.down(600));

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
        resultInfo = (await dispatch(
          getProgramChild({
            program_id: program_id,
            metaLoading: true,
          })
        )) as unknown as PayloadAction<AsyncTrunkReturned<typeof getProgramChild>>;
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
    inquiryAssembly(filterData as LearningComesFilterQuery);
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

  const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
  const checkedIcon = <CheckBoxIcon fontSize="small" />;

  const defaultValues = (enumType: "subjects" | "categorys" | "subs" | "ages" | "grades") =>
    deduplication(filteredList[enumType])?.filter((item: any) => filterQuery && filterQuery[enumType]?.includes(item.id as string));

  const selectGroup = [
    { name: d("Programs").t("schedule_filter_programs"), data: programs, enum: "programs" },
    { name: d("Subjects").t("schedule_filter_subjects"), data: deduplication(filteredList.subjects), enum: "subjects" },
    { name: d("Category").t("library_label_category"), data: deduplication(filteredList.categorys), enum: "categorys" },
    { name: d("Sub Category").t("schedule_sub_category"), data: deduplication(filteredList.subs), enum: "subs" },
    { name: d("Age").t("assess_label_age"), data: deduplication(filteredList.ages), enum: "ages" },
    { name: d("Grade").t("assess_label_grade"), data: deduplication(filteredList.grades), enum: "grades" },
  ];

  const autocompleteValue = (key: string) => {
    return key === "programs"
      ? programs.filter((item) => filterQuery && filterQuery.programs?.includes(item.id as string))
      : defaultValues(key as "subjects" | "categorys" | "subs" | "ages" | "grades");
  };

  return (
    <>
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
    </>
  );
}

interface ScheduleLessonPlanMbProps {
  assemblingLessonPlans: EntityLessonPlanForSchedule[];
  handleClose: () => void;
  lessonPlanName: string;
  setLessonPlanName: (data: any) => void;
  inquiryAssembly: (filterQueryData?: LearningComesFilterQuery, loadPages?: boolean, lessonName?: string, group?: string[]) => void;
  filterQuery?: LearningComesFilterQuery;
  selectedValue?: string;
  handleChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  lessonPlansTotal: number;
  page: number;
  setPage: (data: any) => void;
  resetDisabled: string | number | true | undefined;
  reset: () => void;
  save: () => void;
  selectGroupTemplate: () => ReactNode;
  lessonPlans: EntityLessonPlanForSchedule[];
}

function ScheduleLessonPlanMb(props: ScheduleLessonPlanMbProps) {
  const {
    assemblingLessonPlans,
    handleClose,
    lessonPlanName,
    setLessonPlanName,
    inquiryAssembly,
    filterQuery,
    selectedValue,
    handleChange,
    lessonPlansTotal,
    page,
    setPage,
    resetDisabled,
    reset,
    save,
    selectGroupTemplate,
  } = props;
  const classes = useStyles();
  const [dom, setDom] = React.useState<HTMLDivElement | null>(null);
  const [loading, setLoading] = React.useState(false);
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

  const handleOnScroll = async () => {
    if (dom) {
      const contentScrollTop = dom.scrollTop; //滚动条距离顶部
      const clientHeight = dom.clientHeight; //可视区域
      const scrollHeight = dom.scrollHeight; //滚动条内容的总高度
      if (contentScrollTop + clientHeight >= scrollHeight) {
        const maxPage = Math.ceil(Number(lessonPlansTotal) / 10);
        if (page + 1 > maxPage) return;
        setLoading(true);
        await inquiryAssembly(filterQuery, true);
        setLoading(false);
        setPage(page + 1);
      }
    }
  };

  return (
    <Box className={classes.previewContainerMb} style={{ height: `${window.innerHeight}px` }}>
      <div className={classes.lessonTitleMb}>
        <span>{d("Lesson Plan Search").t("schedule_lesson_plan_search")}</span> <CloseIcon onClick={handleClose} />
      </div>
      <div style={{ textAlign: "center" }}>
        <TextField
          id="outlined-start-adornment"
          placeholder={d("Search for lesson plan").t("schedule_popup_search_for_lesson_plan")}
          InputProps={{
            startAdornment: <SearchIcon />,
          }}
          onChange={(e) => {
            setLessonPlanName(e.target.value);
          }}
          value={lessonPlanName}
          onKeyDown={(e) => {
            const code = e.keyCode || e.which || e.charCode;
            if (code === 13) inquiryAssembly(filterQuery, false);
          }}
          onBlur={(e) => {
            inquiryAssembly(filterQuery, false);
          }}
          size="small"
          className={classes.mobileSearch}
        />
      </div>
      <div className={classes.scrollSelect}>
        {selectGroupTemplate()}
        <span
          className={classes.resetControl}
          style={{ color: resetDisabled ? "#0E78D5" : "#666666" }}
          onClick={() => {
            if (resetDisabled) reset();
          }}
        >
          {d("Reset").t("schedule_lesson_plan_popup_reset")}
        </span>
      </div>
      <div className={classes.resultText}>
        {lessonPlansTotal} {d("Results").t("schedule_lesson_plan_popup_results")}
      </div>
      <div
        ref={(dom) => {
          setDom(dom);
        }}
        onScrollCapture={(e) => {
          const maxPage = Math.ceil(Number(lessonPlansTotal) / 10);
          if (page + 1 > maxPage) return;
          handleOnScroll();
        }}
        className={classes.previewDetailMb}
        style={{ height: previewDetailMbHeight() }}
      >
        {assemblingLessonPlans.map((item, index) => (
          <div className={classes.lessonsItemMb}>
            <Radio
              checked={selectedValue === item?.id}
              onChange={handleChange}
              value={item?.id}
              style={{ margin: "0px 6px 0px 6px", transform: "scale(0.8)" }}
              name="radio-button-demo"
              color="primary"
            />
            <div>
              <span className={classes.lessonNameMb}>{item.name}</span>
              <span className={classes.lessonGroupMb}>{item.group_name}</span>
            </div>
          </div>
        ))}
        {assemblingLessonPlans.length < 1 && (
          <p className={classes.emptyLabel} style={{ fontSize: 16 }}>
            {lessonPlanName
              ? d("No matching result").t("schedule_msg_no_matching_result")
              : d("No data available").t("schedule_popup_no_data_available")}
          </p>
        )}
        <LinearProgress style={{ visibility: loading ? "visible" : "hidden" }} />
      </div>
      <div style={{ textAlign: "center" }}>
        <Button className={classes.saveMb} color="primary" variant="contained" disabled={!selectedValue} onClick={save}>
          {d("OK").t("general_button_OK")}
        </Button>
      </div>
    </Box>
  );
}

export default function ScheduleLessonPlan(props: LessonPlanProps) {
  const classes = useStyles();
  const {
    programs,
    searchOutcomesList,
    filterGropuData,
    handelSetProgramChildInfo,
    programChildInfoParent,
    viewSubjectPermission,
    getFilterQueryAssembly,
    autocompleteChange,
    lessonPlanCondition,
    lessonPlanId,
    handleClose,
  } = props;
  const { lessonPlans, lessonPlansTotal } = useSelector<RootState, RootState["schedule"]>((state) => state.schedule);
  const [filterQuery, setFilterQuery] = React.useState<LearningComesFilterQuery>(filterGropuData);
  const [lessonQuery, setLessonQuery] = React.useState<LessonPlanFilterQuery>(lessonPlanCondition);
  const [selectedValue, setSelectedValue] = React.useState(lessonPlanId);
  const [dom, setDom] = React.useState<HTMLDivElement | null>(null);
  const [page, setPage] = React.useState<number>(1);
  const [loading, setLoading] = React.useState(false);
  const [lessonPlanName, setLessonPlanName] = React.useState<string>(lessonQuery.lesson_plan_name);
  const [groupSelect, setGroupSelect] = React.useState<string[]>(lessonQuery.group_names);
  const [programChildInfo, setProgramChildInfo] = React.useState<GetProgramsQuery[] | undefined>(programChildInfoParent);

  const resetDisabled = useMemo(() => {
    return (
      filterQuery.programs.length ||
      filterQuery.subjects.length ||
      filterQuery.categorys.length ||
      filterQuery.subs.length ||
      filterQuery.grades.length ||
      filterQuery.ages.length ||
      groupSelect.length ||
      selectedValue
    );
  }, [filterQuery, groupSelect, selectedValue]);

  const { breakpoints } = useTheme();
  const mobile = useMediaQuery(breakpoints.down(600));

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedValue(event.target.value);
  };

  const assemblingLessonPlans = useMemo(() => {
    let value = null;
    const lessonPlansDeep = [...lessonPlans];
    lessonPlansDeep.forEach((item, index) => {
      if (item.id === lessonPlanId) {
        value = item;
        lessonPlansDeep.splice(index, 1);
      }
    });
    return value ? [value, ...lessonPlansDeep] : lessonPlansDeep;
  }, [lessonPlans, lessonPlanId]);

  const save = async () => {
    const value = lessonPlans.filter((item) => item.id === selectedValue);
    await autocompleteChange(value[0], "lesson_plan_id");
    handleClose();
  };

  const reset = () => {
    const defaultData = {
      program_ids: [],
      subject_ids: [],
      category_ids: [],
      sub_category_ids: [],
      age_ids: [],
      grade_ids: [],
      group_names: [],
      lesson_plan_name: "",
      page_size: 10,
      page: 1,
    };
    setFilterQuery({ ages: [], categorys: [], grades: [], programs: [], subjects: [], subs: [] });
    setGroupSelect([]);
    setLessonPlanName("");
    setSelectedValue(lessonPlanId);
    searchOutcomesList(defaultData);
  };

  const selectGroupTemplate = () => {
    return (
      <>
        <div className={classes.selectBox}>
          <FilterListIcon />
          <Autocomplete
            id="combo-box-demo"
            options={groupLabel}
            getOptionLabel={(option: any) => option.name}
            multiple
            limitTags={1}
            value={groupLabel.filter((item) => groupSelect?.includes(item.id))}
            onChange={(e: any, newValue) => {
              autocompleteLessonChange(newValue);
            }}
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
                size={"small"}
                className={clsx(classes.fieldset, groupSelect.length ? classes.activeSelect : "")}
                placeholder={d("Group").t("schedule_lesson_plan_popup_group")}
                variant="outlined"
              />
            )}
          />
        </div>
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
          lessonQuery={lessonQuery}
          setLessonQuery={setLessonQuery}
          lessonPlanName={lessonPlanName}
          groupSelect={groupSelect}
          setGroupSelect={setGroupSelect}
          setLessonPlanName={setLessonPlanName}
          inquiryAssembly={inquiryAssembly}
          programChildInfo={programChildInfo}
          setProgramChildInfo={setProgramChildInfo}
        />
      </>
    );
  };

  const handleOnScroll = async () => {
    if (dom) {
      const contentScrollTop = dom.scrollTop; //滚动条距离顶部
      const clientHeight = dom.clientHeight; //可视区域
      const scrollHeight = dom.scrollHeight; //滚动条内容的总高度
      if (contentScrollTop + clientHeight >= scrollHeight) {
        const maxPage = Math.ceil(Number(lessonPlansTotal) / 10);
        if (page + 1 > maxPage) return;
        setLoading(true);
        await inquiryAssembly(filterQuery, true);
        setLoading(false);
        setPage(page + 1);
      }
    }
  };

  const inquiryAssembly = async (
    filterQueryData?: LearningComesFilterQuery,
    loadPages?: boolean,
    lessonName?: string,
    group?: string[]
  ) => {
    const filterResult = (
      programChildInfo?.length
        ? (modelSchedule.learningOutcomeFilerGroup(filterQueryData as LearningComesFilterQuery, programChildInfo)
            .query as LearningComesFilterQuery)
        : filterQueryData
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
      group_names: group ?? groupSelect,
      lesson_plan_name: lessonName ? lessonName : lessonPlanName,
      page_size: 10,
      page: loadPages ? page + 1 : 1,
    };
    if (!loadPages) setPage(1);
    await searchOutcomesList(filterQueryAssembly);
  };

  const autocompleteLessonChange = (value: any | null) => {
    const ids = value?.map((item: any) => {
      return item.id;
    });
    setGroupSelect(ids);
    inquiryAssembly(filterQuery, false, "", ids);
  };

  const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
  const checkedIcon = <CheckBoxIcon fontSize="small" />;
  const groupLabel = [
    { id: "Organization Content", name: "Organization Content" },
    { id: "Badanamu Content", name: "Badanamu Content" },
    { id: "More Featured Content", name: "More Featured Content" },
  ];

  const inSide = () => {
    return lessonPlans.filter((item) => item.id === selectedValue);
  };

  return mobile ? (
    <ScheduleLessonPlanMb
      assemblingLessonPlans={assemblingLessonPlans}
      handleChange={handleChange}
      handleClose={handleClose}
      lessonPlanName={lessonPlanName}
      lessonPlansTotal={lessonPlansTotal}
      resetDisabled={resetDisabled}
      setLessonPlanName={setLessonPlanName}
      inquiryAssembly={inquiryAssembly}
      filterQuery={filterQuery}
      selectedValue={selectedValue}
      selectGroupTemplate={selectGroupTemplate}
      page={page}
      setPage={setPage}
      reset={reset}
      save={save}
      lessonPlans={lessonPlans}
    />
  ) : (
    <Box className={classes.previewContainer}>
      <div className={classes.lessonTitle}>
        <span>{d("Lesson Plan Search").t("schedule_lesson_plan_search")}</span>{" "}
        <CloseIcon onClick={handleClose} style={{ cursor: "pointer" }} />
      </div>
      <div className={classes.searchValue}>
        <TextField
          id="outlined-start-adornment"
          placeholder={d("Search for lesson plan").t("schedule_popup_search_for_lesson_plan")}
          InputProps={{
            startAdornment: <SearchIcon />,
          }}
          value={lessonPlanName}
          onChange={(e) => {
            setLessonPlanName(e.target.value);
          }}
          size="small"
          style={{ width: "90%" }}
        />
        <Button
          onClick={() => {
            inquiryAssembly(filterQuery, false);
          }}
          variant="contained"
          style={{ background: "#0E78D5", color: "white", marginLeft: 10, width: "100px" }}
        >
          {d("Search").t("schedule_button_search")}
        </Button>
      </div>
      <div className={classes.groupBox}>{selectGroupTemplate()}</div>
      <span style={{ color: "#666666", fontWeight: 400, fontSize: 14, marginLeft: 8 }}>
        {lessonPlansTotal} {d("Results").t("schedule_lesson_plan_popup_results")}
      </span>
      <div
        ref={(dom) => {
          setDom(dom);
        }}
        onScrollCapture={(e) => handleOnScroll()}
        style={{ margin: "20px 0 20px 0", minHeight: "40vh" }}
        className={classes.customizeContentBox}
      >
        <TableContainer component={Paper}>
          <Table aria-label="simple table">
            <TableHead style={{ backgroundColor: "#F2F5F7" }}>
              <TableRow>
                <TableCell align="center">{d("Lesson Plan").t("schedule_detail_lesson_plan")}</TableCell>
                <TableCell align="center">{d("Library").t("schedule_lesson_plan_popup_library")}</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {assemblingLessonPlans.map((item, index) => (
                <TableRow key={index}>
                  <TableCell align="left" style={{ paddingLeft: 50 }}>
                    <Radio
                      checked={selectedValue === item?.id}
                      onChange={handleChange}
                      value={item?.id}
                      name="radio-button-demo"
                      color="primary"
                    />
                    <span style={{ whiteSpace: "pre" }}>{item?.name}</span>
                  </TableCell>
                  <TableCell align="center">{item?.group_name}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        {assemblingLessonPlans.length < 1 && (
          <p className={classes.emptyLabel}>
            {lessonPlanName
              ? d("No matching result").t("schedule_msg_no_matching_result")
              : d("No data available").t("schedule_popup_no_data_available")}
          </p>
        )}
        <LinearProgress style={{ visibility: loading ? "visible" : "hidden" }} />
      </div>
      <div style={{ textAlign: "end" }}>
        <Button variant="outlined" size="large" color="primary" disabled={!resetDisabled} className={classes.margin} onClick={reset}>
          {d("Reset").t("schedule_lesson_plan_popup_reset")}
        </Button>
        <Button
          variant="contained"
          size="large"
          color="primary"
          disabled={!selectedValue || !inSide().length}
          className={classes.margin}
          onClick={save}
        >
          {d("Save").t("library_label_save")}
        </Button>
      </div>
    </Box>
  );
}
