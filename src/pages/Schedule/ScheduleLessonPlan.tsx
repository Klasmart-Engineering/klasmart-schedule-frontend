import { makeStyles } from "@material-ui/core/styles";
import React, { useMemo } from "react";
import Box from "@material-ui/core/Box";
import CloseIcon from "@material-ui/icons/Close";
import { TextField, Button, Radio } from "@material-ui/core";
import SearchIcon from "@material-ui/icons/Search";
import FilterListIcon from "@material-ui/icons/FilterList";
import { GetProgramsQuery } from "@api/api-ko.auto";
import { useDispatch } from "react-redux";
import { getProgramChild } from "@reducers/schedule";
import { PayloadAction } from "@reduxjs/toolkit";
import { AsyncTrunkReturned } from "@reducers/type";
import { actError } from "@reducers/notify";
import { d } from "@locale/LocaleManager";
import { modelSchedule } from "@models/ModelSchedule";
import { EntityScheduleShortInfo, LearningComesFilterQuery } from "../../types/scheduleTypes";
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
  searchValue: {
    display: "flex",
    justifyContent: "space-between",
    padding: "26px 10px 10px 6px",
  },
  root: {
    marginTop: 10,
    flexGrow: 1,
    display: "flex",
    borderBottom: "2px solid #EEEEEE",
    paddingBottom: "20px",
    marginBottom: "10px",
  },
  fieldset: {
    width: "230px",
    "& .MuiInputBase-root": {
      borderRadius: "50px",
    },
  },
  margin: {
    margin: spacing(1),
    width: 104,
  },
  customizeContentBox: {
    width: "100%",
    maxHeight: "48vh",
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
    alignItems: "center",
    height: "50%",
    paddingLeft: "8px",
  },
  filterBox: {
    display: "flex",
    flexWrap: "wrap",
    justifyContent: "center",
    alignItems: "center",
    borderLeft: "2px solid #EEEEEE",
  },
}));

interface LessonPlanProps {
  programs: EntityScheduleShortInfo[];
  searchOutcomesList: (filterQueryAssembly: object) => void;
  filterGropuData: LearningComesFilterQuery;
  handelSetProgramChildInfo: (data: GetProgramsQuery[]) => void;
  programChildInfoParent: GetProgramsQuery[];
  viewSubjectPermission?: boolean;
  filterQuery?: LearningComesFilterQuery;
  setFilterQuery?: (data: LearningComesFilterQuery) => void;
  getFilterQueryAssembly?: (filterData: LearningComesFilterQuery) => void;
  handleClose: () => void;
  lessonPlans: EntityLessonPlanForSchedule[];
  autocompleteChange: (value: any | null, name: string) => void;
}

interface filterGropProps {
  programs: EntityScheduleShortInfo[];
  searchOutcomesList: (filterQueryAssembly: object) => void;
  filterGropuData: LearningComesFilterQuery;
  handelSetProgramChildInfo: (data: GetProgramsQuery[]) => void;
  programChildInfoParent: GetProgramsQuery[];
  filterQuery?: LearningComesFilterQuery;
  setFilterQuery?: (data: LearningComesFilterQuery) => void;
  getFilterQueryAssembly?: (filterData: LearningComesFilterQuery) => void;
  viewSubjectPermission?: boolean;
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
    searchOutcomesList(filterQueryAssembly);
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
  const groupLabel = [
    { id: "Organization Content", name: "Organization Content" },
    { id: "Badanamu Content", name: "Badanamu Content" },
    { id: "More Featured Content", name: "More Featured Content" },
  ];
  const selectGroup = [
    { name: d("Programs").t("schedule_filter_programs"), data: programs, enum: "programs" },
    { name: d("Subjects").t("schedule_filter_subjects"), data: deduplication(filteredList.subjects), enum: "subjects" },
    { name: d("Category").t("library_label_category"), data: deduplication(filteredList.categorys), enum: "categorys" },
    { name: d("Sub Category").t("schedule_sub_category"), data: deduplication(filteredList.subs), enum: "subs" },
    { name: d("Age").t("assess_label_age"), data: deduplication(filteredList.ages), enum: "ages" },
    { name: d("Grade").t("assess_label_grade"), data: deduplication(filteredList.grades), enum: "grades" },
  ];
  return (
    <div className={classes.root}>
      <div className={classes.groupBox}>
        <FilterListIcon />
        <Autocomplete
          id="combo-box-demo"
          options={groupLabel}
          getOptionLabel={(option: any) => option.name}
          multiple
          limitTags={1}
          onChange={(e: any, newValue) => {
            autocompleteChange(newValue, "programs");
          }}
          disableCloseOnSelect
          renderOption={(option: any, { selected }) => (
            <React.Fragment>
              <Checkbox color="primary" icon={icon} checkedIcon={checkedIcon} style={{ marginRight: 8 }} checked={selected} />
              {option.name}
            </React.Fragment>
          )}
          style={{ transform: "scale(0.9)" }}
          renderInput={(params) => <TextField {...params} size={"small"} className={classes.fieldset} label="Group" variant="outlined" />}
        />
      </div>
      <div className={classes.filterBox}>
        {selectGroup.map((item, index) => (
          <Autocomplete
            id="combo-box-demo"
            options={item.data}
            getOptionLabel={(option: any) => option.name}
            multiple
            limitTags={1}
            onChange={(e: any, newValue) => {
              autocompleteChange(newValue, item.enum as "subjects" | "categorys" | "subs" | "ages" | "grades");
            }}
            value={
              item.enum === "programs"
                ? programs.filter((item) => filterQuery && filterQuery.programs?.includes(item.id as string))
                : defaultValues(item.enum as "subjects" | "categorys" | "subs" | "ages" | "grades")
            }
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
                style={{ marginTop: index > 2 ? 16 : 0 }}
                size={"small"}
                className={classes.fieldset}
                label={item.name}
                variant="outlined"
              />
            )}
          />
        ))}
      </div>
    </div>
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
    lessonPlans,
    autocompleteChange,
  } = props;
  const [filterQuery, setFilterQuery] = React.useState<LearningComesFilterQuery>(filterGropuData);
  const [selectedValue, setSelectedValue] = React.useState("a");
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedValue(event.target.value);
  };
  const save = () => {
    const value = lessonPlans.filter((item) => item.id === selectedValue);
    autocompleteChange(value[0], "lesson_plan_id");
  };
  return (
    <Box className={classes.previewContainer}>
      <div className={classes.lessonTitle}>
        <span>Lesson Plan Search</span> <CloseIcon />
      </div>
      <div className={classes.searchValue}>
        <TextField
          id="outlined-start-adornment"
          placeholder="Search for lesson plan"
          InputProps={{
            startAdornment: <SearchIcon />,
          }}
          size="small"
          style={{ width: "90%" }}
        />
        <Button variant="contained" style={{ background: "#0E78D5", color: "white", marginLeft: 10, width: "100px" }}>
          Search
        </Button>
      </div>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
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
        />
      </div>
      <span style={{ color: "#666666", fontWeight: 400, fontSize: 14, marginLeft: 8 }}>152 results</span>
      <div style={{ margin: "20px 0 20px 0" }} className={classes.customizeContentBox}>
        <TableContainer component={Paper}>
          <Table aria-label="simple table">
            <TableHead style={{ backgroundColor: "#F2F5F7" }}>
              <TableRow>
                <TableCell align="center">{d("Lesson Plan").t("schedule_detail_lesson_plan")}</TableCell>
                <TableCell align="center">Library</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {lessonPlans.map((item, index) => (
                <TableRow key={index}>
                  <TableCell align="left" style={{ paddingLeft: 50 }}>
                    <Radio
                      checked={selectedValue === item.id}
                      onChange={handleChange}
                      value={item.id}
                      name="radio-button-demo"
                      color="primary"
                    />
                    {item.name}
                  </TableCell>
                  <TableCell align="center">{item.group_name}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </div>
      <div style={{ textAlign: "end" }}>
        <Button variant="outlined" size="large" color="primary" className={classes.margin}>
          Reset
        </Button>
        <Button variant="contained" size="large" color="primary" className={classes.margin} onClick={save}>
          {d("Save").t("library_label_save")}
        </Button>
      </div>
    </Box>
  );
}
