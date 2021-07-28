import { makeStyles } from "@material-ui/core";
import { SearchOutlined } from "@material-ui/icons";
import React, { useMemo } from "react";
import { d } from "../../locale/LocaleManager";
import Box from "@material-ui/core/Box";
import TextField from "@material-ui/core/TextField";
import MenuItem from "@material-ui/core/MenuItem";
import Button from "@material-ui/core/Button";
import Checkbox from "@material-ui/core/Checkbox";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import { Controller, UseFormMethods } from "react-hook-form";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import AddCircleOutlinedIcon from "@material-ui/icons/AddCircleOutlined";
import { LearningContentListForm, LearningContentList } from "../../types/scheduleTypes";
import RemoveCircleOutlinedIcon from "@material-ui/icons/RemoveCircleOutlined";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../reducers";
import { modelSchedule } from "../../models/ModelSchedule";
import { EntityScheduleDetailsView } from "../../api/api.auto";
import { resetActOutcomeList } from "../../reducers/schedule";

const useStyles = makeStyles((theme) => ({
  previewContainer: {
    width: document.body.clientWidth < 650 ? "99%" : "760px",
    borderRadius: "4px",
    boxShadow: "0px 11px 15px -7px rgba(0,0,0,0.2), 0px 9px 46px 8px rgba(0,0,0,0.12), 0px 24px 38px 3px rgba(0,0,0,0.14)",
    padding: "26px 20px 10px 20px",
  },
  customizeContentBox: {
    width: "100%",
    maxHeight: document.body.clientWidth < 650 ? "65vh" : "56vh",
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
    margin: theme.spacing(1),
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
  },
  searchText: {
    "& .MuiOutlinedInput-notchedOutline": {
      border: 0,
      borderRadius: 0,
    },
  },
  table: {},
  margin: {
    margin: theme.spacing(1),
  },
  flexBox: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
}));

interface InfoProps {
  conditionFormMethods: UseFormMethods<LearningContentListForm>;
  saveOutcomesList: () => void;
  searchOutcomesList: () => void;
  learingOutcomeData: LearningContentListForm;
  handleClose: () => void;
  outComeIds: string[];
  scheduleDetial: EntityScheduleDetailsView;
}

export default function LearingOutcome(props: InfoProps) {
  const classes = useStyles();
  const dispatch = useDispatch();
  const { conditionFormMethods, saveOutcomesList, searchOutcomesList, learingOutcomeData, handleClose, outComeIds, scheduleDetial } = props;
  const { control, setValue, getValues } = conditionFormMethods;
  const [dom, setDom] = React.useState<HTMLDivElement | null>(null);
  const [selectNum, setSelectNum] = React.useState<number>(learingOutcomeData.content_list.filter((item) => item.select).length);
  const { outcomeList, outcomeTotal } = useSelector<RootState, RootState["schedule"]>((state) => state.schedule);
  const content_list = useMemo(() => {
    return modelSchedule.AssemblyLearningOutcome(outcomeList) as LearningContentList[];
  }, [outcomeList]);

  const content_lists = content_list.map((item) => {
    return { ...item, select: outComeIds.includes(item.id) || scheduleDetial.outcome_ids?.includes(item.id) };
  });

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
        searchOutcomesList();
      }
    }
  };

  const getSelectStatus = (index: number, item: LearningContentList) => {
    dispatch(resetActOutcomeList([]));
    setValue(`content_list[${index}]`, { ...item, select: !item.select });
    const num = getValues().content_list.filter((item) => item.select).length;
    setSelectNum(num);
  };

  const checkAssume = (value: boolean) => {
    dispatch(resetActOutcomeList([]));
    setValue(`is_assumed`, value);
    searchOutcomesList();
  };

  const filterCode = [
    { lable: "All", value: "all" },
    { lable: "author", value: "author" },
    { lable: "code", value: "shortCode" },
    { lable: "description", value: "description" },
    { lable: "keywords", value: "keyWord" },
    { lable: "name", value: "loName" },
    { lable: "set", value: "loSet" },
  ];
  const templateOption = filterCode.map((item, index) => {
    return (
      <MenuItem key={index} value={item.value}>
        {item.lable}
      </MenuItem>
    );
  });

  return (
    <Box className={classes.previewContainer}>
      <Box className={classes.flexBox}>
        <div
          style={{
            alignItems: "center",
            display: "flex",
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
            <Controller
              as={TextField}
              control={control}
              name="search_type"
              className={classes.exectSearchInput}
              defaultValue={learingOutcomeData.search_type || "all"}
              size="small"
              select
              SelectProps={{
                MenuProps: {
                  transformOrigin: {
                    vertical: -40,
                    horizontal: "left",
                  },
                },
              }}
            >
              {templateOption}
            </Controller>
            <Controller
              style={{
                borderLeft: 0,
                width: "180px",
              }}
              as={TextField}
              defaultValue={learingOutcomeData.search_value}
              name="search_value"
              control={control}
              size="small"
              className={classes.searchText}
              placeholder={d("Search").t("library_label_search")}
            />
          </div>
          <Button
            variant="contained"
            color="primary"
            className={classes.button}
            startIcon={<SearchOutlined />}
            onClick={searchOutcomesList}
          >
            Search
          </Button>
        </div>
        <Controller
          name="is_assumed"
          control={control}
          defaultValue={learingOutcomeData.is_assumed}
          render={(props: { value: boolean | undefined }) => (
            <FormControlLabel
              control={
                <Checkbox
                  onChange={(e) => {
                    checkAssume(e.target.checked);
                  }}
                  checked={props.value}
                  name="checkedB"
                  color="primary"
                />
              }
              label="Assumed"
            />
          )}
        />
      </Box>
      <div
        style={{ margin: "20px 0 20px 0" }}
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
                <TableCell align="center">Learning Outcomes</TableCell>
                <TableCell align="center">Short Code</TableCell>
                <TableCell align="center">Assumed</TableCell>
                <TableCell align="center">Learning Outcome Set</TableCell>
                <TableCell align="center">&nbsp;</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {content_lists.map((item, index) => (
                <Controller
                  name={`content_list[${index}]`}
                  control={control}
                  defaultValue={item}
                  render={(props: { value: LearningContentList }) => (
                    <TableRow key={props.value.id}>
                      <TableCell component="th" scope="row" align="center">
                        {props.value.name}
                      </TableCell>
                      <TableCell align="center">{props.value.shortCode}</TableCell>
                      <TableCell align="center">{props.value.assumed ? "Yes" : ""}</TableCell>
                      <TableCell align="center">
                        <ul>
                          {props.value.learningOutcomeSet.map((set) => {
                            return <li style={{ marginTop: "10px" }}>{set.set_name}</li>;
                          })}
                        </ul>
                      </TableCell>
                      <TableCell align="center">
                        {!props.value.select && (
                          <AddCircleOutlinedIcon
                            onClick={() => getSelectStatus(index, props.value)}
                            style={{ color: "#4CAF50", cursor: "pointer" }}
                          />
                        )}
                        {props.value.select && (
                          <RemoveCircleOutlinedIcon
                            onClick={() => getSelectStatus(index, props.value)}
                            style={{ color: "#D32F2F", cursor: "pointer" }}
                          />
                        )}
                      </TableCell>
                    </TableRow>
                  )}
                />
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </div>
      <Box className={classes.flexBox}>
        <span
          style={{
            color: "rgb(14, 120, 213)",
            fontWeight: "bold",
            marginLeft: "20px",
          }}
        >
          {selectNum} Added
        </span>
        <div>
          <Button variant="outlined" size="large" color="primary" className={classes.margin} onClick={handleClose}>
            Cancel
          </Button>
          <Button onClick={saveOutcomesList} variant="contained" size="large" color="primary" className={classes.margin}>
            Save
          </Button>
        </div>
      </Box>
    </Box>
  );
}
