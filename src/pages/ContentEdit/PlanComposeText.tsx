import React, { ReactNode } from "react";
import { Button, Box, ButtonGroup, makeStyles, Typography, FormControl, InputLabel, Select } from "@material-ui/core";
import { NavLink } from "react-router-dom";
import { DashboardOutlined, BookOutlined } from "@material-ui/icons";
import AddIcon from "@material-ui/icons/Add";
import lessonPlanBgUrl from "../../assets/icons/lesson-plan-bg.svg";
import clsx from "clsx";

const useStyles = makeStyles(({ palette, shadows }) => ({
  planComposeText: {
    background: `url(${lessonPlanBgUrl}) center repeat`,
    width: "100%",
    height: "100%",
    paddingLeft: 40,
    paddingRight: 40,
    boxSizing: "border-box",
  },
  headerButtonGroup: {
    position: "absolute",
    top: -46,
    right: -40,
  },
  headerButton: {
    width: 60,
    height: 40,
    backgroundColor: palette.common.white,
    "&.active": {
      color: palette.primary.contrastText,
      backgroundColor: palette.primary.main,
    },
    "&:hover": {
      backgroundColor: palette.action.disabledOpacity,
    },
  },
  headerBox: {
    display: "flex",
    alignItems: "center",
    height: 68,
    backgroundColor: "transparent",
    borderBottom: "3px solid #000",
    borderRadius: 3,
  },
  headerBoxText: {
    fontWeight: 700,
    textAlign: "center",
    fontFamily: "Helvetica, Helvetica-Bold",
  },
  headerBoxTextLeft: {
    width: "40%",
  },
  headerBoxTextRight: {
    width: "60%",
  },
  DropAbleBox: {
    padding: 15,
    //  marginTop:56,
    border: "2px dashed #666",
    boxSizing: "border-box",
    borderRadius: 4,
    display: "flex",
    alignItems: "center",
    color: "#666",
  },
  segment: {
    marginTop: 50,
    paddingLeft: 5,
    display: "flex",
    width: "100%",
  },
  segmentFlow: {
    flex: 2,
    display: "flex",
    alignItems: "center",
  },

  indexUI: {
    width: 40,
    height: 40,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#098",
    borderRadius: "50%",
    color: palette.common.white,
  },
  materialBox: {
    width: 291,
    height: 44,
    marginTop: 0,
    backgroundColor: "white",
    color: "rgba(0,0,0,.87)",
    display: "flex",
    alignItems: "center",
  },
  noMaterialBox: {
    width: 291,
    height: 44,
    justifyContent: "center",
    display: "flex",
    alignItems: "center",
  },
  segmentCondition: {
    flex: 3,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    color: palette.text.primary,
  },
  selectButton: {
    width: 140,
    backgroundColor: "white",
    borderRadius: 4,
    boxShadow: shadows[3],
    color: palette.text.primary,
  },
  goTo: {
    fontSize: 20,
    fontFamily: "Helvetica, Helvetica-Bold",
    fontWeight: 700,
    textAlign: "center",
    color: "#000000",
    width: 80,
    marginTop: 10,
  },
  addMoreBox: {
    width: 291,
    height: 44,
    marginTop: 56,
    border: "2px dashed #666",
    boxSizing: "border-box",
    borderRadius: 4,
    display: "flex",
    alignItems: "center",
    color: "#666",
  },
  addMoreBoxIcon: {
    marginLeft: 15,
    marginRight: 10,
  },
}));
const conditionsList = [
  { label: "If Correct", value: "ifCorrect" },
  { label: "If Wrong", value: "ifWrong" },
  { value: "ifScoreDown60", label: "If Score<60" },
  { value: "ifScoreUp60", label: "ifScore>=60" },
  { label: "No Condition", value: "noCondition" },
];
const mainFlowList = [
  { label: "MainFlow1", value: "1" },
  { label: "MainFlow2", value: "2" },
  { label: "MainFlow3", value: "3" },
  { label: "MainFlow4", value: "4" },
];

interface DrappableBoxProps {
  enable?: boolean;
  children?: ReactNode;
}
function DrappableBox(props: DrappableBoxProps) {
  const { enable, children } = props;
  const css = useStyles();
  if (!enable) {
    return <Box>{children}</Box>;
  }
  return <Box className={css.DropAbleBox}>{children}</Box>;
}

interface selectDate {
  value: string;
  label: string;
}
interface ConditionSelectProps {
  label: "Conditions" | "MainFlow";
  selectValue?: string;
  selectDate: selectDate[];
  disable?: boolean;
}
function ConditionSelect(props: ConditionSelectProps) {
  const css = useStyles();
  const { label, selectDate, selectValue, disable } = props;
  let ItemIdx = -1;
  const optionNodes = selectDate.map((optionItems) => {
    return (
      <option key={++ItemIdx} value={optionItems.value}>
        {optionItems.label}
      </option>
    );
  });
  return (
    <Box>
      <FormControl variant="outlined" size="small" disabled={disable} className={css.selectButton}>
        <InputLabel>{label}</InputLabel>
        <Select
          native
          value={selectValue}
          // onChange={handleChange}
          label={label}
          inputProps={{
            name: label,
          }}
        >
          <option aria-label="None" value="" />
          {optionNodes}
        </Select>
      </FormControl>
    </Box>
  );
}

interface SegmentConditionSetValueProps {
  conditionsValue?: "ifCorrect" | "ifScoreUp60";
  conditionsValuePair?: "ifWrong" | "ifScoreDown60";
}
function SegmentConditionSetValue(props: SegmentConditionSetValueProps) {
  const { conditionsValue, conditionsValuePair } = props;
  const css = useStyles();
  return (
    <Box className={css.segmentCondition}>
      <Box display="flex">
        <ConditionSelect label="Conditions" selectValue={conditionsValue} selectDate={conditionsList}></ConditionSelect>
        <Box className={css.goTo}>go to</Box>
        <ConditionSelect label="MainFlow" selectDate={mainFlowList}></ConditionSelect>
      </Box>
      <Box display="flex" mt={2}>
        <ConditionSelect label="Conditions" selectValue={conditionsValuePair} disable selectDate={conditionsList}></ConditionSelect>
        <Box className={css.goTo}>go to</Box>
        <ConditionSelect label="MainFlow" selectDate={mainFlowList}></ConditionSelect>
      </Box>
    </Box>
  );
}

interface SegmentConditionProps {
  condition?: "ifCorrect" | "ifWrong" | "ifScoreUp60" | "ifScoreDown60" | "noCondition";
}
function SegmentCondition(props: SegmentConditionProps) {
  const { condition } = props;
  const css = useStyles();
  if (condition === "ifCorrect" || condition === "ifWrong")
    return <SegmentConditionSetValue conditionsValue="ifCorrect" conditionsValuePair="ifWrong"></SegmentConditionSetValue>;
  if (condition === "ifScoreUp60" || condition === "ifScoreDown60")
    return <SegmentConditionSetValue conditionsValue="ifScoreUp60" conditionsValuePair="ifScoreDown60"></SegmentConditionSetValue>;
  if (condition === "noCondition")
    return (
      <Box className={css.segmentCondition}>
        <Box display="flex">
          <ConditionSelect label="Conditions" selectValue="noCondition" selectDate={conditionsList}></ConditionSelect>
          <Box className={css.goTo}>go to</Box>
          <ConditionSelect label="MainFlow" selectDate={mainFlowList}></ConditionSelect>
        </Box>
      </Box>
    );
  else return <SegmentConditionSetValue></SegmentConditionSetValue>;
}

interface DrappableType {
  droppableType?: "material";
}
export interface SegmentText {
  segmentId?: string;
  condition?: "ifCorrect" | "ifWrong" | "ifScoreUp60" | "ifScoreDown60";
  material?: any;
  next?: SegmentText[];
}
interface SegmentProps extends SegmentText, DrappableType {}
function Segment(props: SegmentProps) {}
interface PlanComposeTextProps extends DrappableType {
  plan: SegmentText;
}
export default function PlanComposeText(props: PlanComposeTextProps) {
  const { plan, droppableType } = props;
  const css = useStyles();

  return (
    <Box className={css.planComposeText}>
      <Box position="relative">
        <ButtonGroup className={css.headerButtonGroup}>
          <Button
            component={NavLink}
            activeClassName="active"
            variant="contained"
            className={css.headerButton}
            to="/content-edit/lesson/plan/tab/details/rightside/planComposeText"
          >
            <Typography variant="h6">A</Typography>
          </Button>
          <Button
            component={NavLink}
            activeClassName="active"
            variant="contained"
            className={css.headerButton}
            to="/content-edit/lesson/plan/tab/details/rightside/planComposeGraphic"
          >
            <DashboardOutlined />
          </Button>
        </ButtonGroup>
        <Box className={css.headerBox}>
          <Typography className={clsx(css.headerBoxText, css.headerBoxTextLeft)} variant="h6">
            Main Flow
          </Typography>
          <Typography className={clsx(css.headerBoxText, css.headerBoxTextRight)} variant="h6">
            Condition&Branch
          </Typography>
        </Box>
      </Box>

      {/* content */}
      <Box className={css.segment}>
        <Box className={css.segmentFlow}>
          <Box mr={2} className={css.indexUI}>
            <Typography variant="h6">1</Typography>
          </Box>
          <DrappableBox enable={droppableType === "material"}>
            <Box boxShadow={3} className={css.materialBox}>
              <BookOutlined className={css.addMoreBoxIcon}></BookOutlined>
              <Typography component="div" variant="body1" noWrap>
                Snow Leopard Memory GameSnow Leopard Memory Game
              </Typography>
            </Box>
          </DrappableBox>
        </Box>
        <SegmentCondition></SegmentCondition>
      </Box>
      <Box className={css.segment}>
        <Box className={css.segmentFlow}>
          <Box mr={2} className={css.indexUI}>
            <Typography variant="h6">2</Typography>
          </Box>
          <DrappableBox enable>
            <Box className={css.noMaterialBox}>
              <Typography>Selecting a lesson material.</Typography>
            </Box>
          </DrappableBox>
        </Box>
        <SegmentCondition></SegmentCondition>
      </Box>
      {/* 虚线框add more */}
      <Box className={css.addMoreBox}>
        <AddIcon className={css.addMoreBoxIcon}></AddIcon>
        <Typography>Add one more lesson material.</Typography>
      </Box>
    </Box>
  );
}
