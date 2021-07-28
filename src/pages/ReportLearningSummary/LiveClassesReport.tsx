import { Collapse, IconButton, makeStyles, styled } from "@material-ui/core";
import ArrowDropDownIcon from "@material-ui/icons/ArrowDropDown";
import clsx from "clsx";
import React, { useState } from "react";
import { EntityLiveClassSummaryItem } from "../../api/api.auto";
import liveBackUrl from "../../assets/icons/report_reca.svg";
import assessmentBackUrl from "../../assets/icons/report_recl.svg";
import { d } from "../../locale/LocaleManager";
import { LiveClassesSummaryResult, ReportType } from "./types";
const useStyles = makeStyles(({ breakpoints, props }) => ({
  scrollCss: {
    "&::-webkit-scrollbar": {
      width: "4px",
    },
    "&::-webkit-scrollbar-track": {
      // boxShadow: "inset 0 0 6px rgba(0,0,0,0.3)",
    },
    "&::-webkit-scrollbar-thumb": {
      borderRadius: "4px",
      backgroundColor: "#d1d1d1",
      // boxShadow: "inset 0 0 3px rgba(0,0,0,0.5)",
    },
    "&::-webkit-scrollbar-thumb:window-inactive": {
      backgroundColor: "rgba(220,220,220,0.4)",
    },
  },
  liveClassWrap: {
    display: "flex",
    height: 604,
    padding: "20px 58px",
  },
  leftWrap: {
    flex: 1,
    // background: "red",
    height: "100%",
    overflowY: "scroll",
    paddingRight: 20,
  },
  rightWrap: {
    flex: 1,
    height: "100%",
    paddingLeft: 50,
    display: "flex",
    flexDirection: "column",
    borderLeft: "1px dashed #d7d7d7",
  },
  liveItem: {},
  titleCon: {
    display: "flex",
    alignItems: "center",
  },
  iconCon: {
    width: 16,
    height: 16,
    background: "#d7d7d7",
    borderRadius: "50%",
    marginRight: 8,
  },
  labelCon: {
    fontSize: 18,
    fontWeight: 600,
    color: "#333333",
  },
  contentCon: {
    marginLeft: 8,
    display: "flex",
    flexDirection: "column",
  },
  lessonCon: {
    paddingTop: 10,
    paddingBottom: 10,
    display: "flex",
    borderLeft: "1px dashed #d7d7d7",
  },
  timeCon: {
    marginLeft: 9,
    fontSize: 14,
    flex: 2,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "#8693f0",
  },
  lessonInfoCon: {
    flex: 8,
    height: 90,
    paddingLeft: 20,
  },
  lessonName: {
    fontSize: 16,
    color: "#fff",
    fontWeight: 600,
    marginTop: 15,
  },
  lessonPlanName: {
    display: "inline-block",
    borderRadius: 15,
    paddingLeft: "10px",
    paddingRight: "10px",
    color: "#fff",
    fontSize: 14,
    backgroundColor: "rgba(255,255,255,0.32)",
    height: 26,
    lineHeight: "26px",
    marginTop: 15,
  },
  arrowCon: {
    flex: 1,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  arrow: {
    width: 28,
    height: 28,
    opacity: 1,
    background: "linear-gradient(to bottom right, #fff 0%, #fff 49.9%, #fff 50%, #8693f0 100%)",
    transform: "rotate(-45deg)",
  },
  attendLiveArrow: {
    background: "linear-gradient(to bottom right, #fff 0%, #fff 49.9%, #fff 50%, #8693f0 100%)",
  },
  absentLiveArrow: {
    background: "linear-gradient(to bottom right, #fff 0%, #fff 49.9%, #fff 50%, #fe9b9b 100%)",
  },
  completedStudyArrow: {
    background: "linear-gradient(to bottom right, #fff 0%, #fff 49.9%, #fff 50%, #89c4f9 100%)",
  },
  inCompleteStudyArrow: {
    background: "linear-gradient(to bottom right, #fff 0%, #fff 49.9%, #fff 50%, #a4ddff 100%)",
  },
  rightItem: {
    display: "flex",
    flex: 1,
    flexDirection: "column",
    marginTop: 50,
  },
  rightItemTitle: {
    flex: 1,
    backgroundColor: "#8693f0",
    paddingLeft: 26,
    fontSize: 18,
    fontWeight: 600,
    color: "#fff",
    display: "flex",
    alignItems: "center",
  },
  rightItemContent: {
    flex: 5,
    backgroundColor: "#f6f6f6",
    paddingLeft: 26,
  },
  outcomeCon: {
    marginTop: 15,
  },
  spot: {
    display: "inline-block",
    width: 10,
    height: 10,
    borderRadius: "50%",
    backgroundColor: "#8693f0",
    marginRight: 15,
  },
  learningOutcomeName: {
    fontSize: 16,
    fontWeight: 400,
    color: "#666",
  },
  teacherFeedback: {
    fontSize: 16,
    fontWeight: 400,
    color: "#666",
    padding: "10px 0",
    lineHeight: "22px",
  },
  assessmentCon: {
    display: "flex",
    flexDirection: "column",
  },
  studyCon: {
    flex: 2,
  },
  homefunStudyCon: {
    flex: 1,
  },
  liveLessonCon: {
    background: "#8693f0",
  },
  studyLessonCon: {
    backgroundColor: "#89c4f9",
  },
  assignmentColor: {
    color: "#89c4f9",
  },
  studyTitle: {
    fontSize: 18,
    fontWeight: 600,
    color: "#333",
    marginTop: 10,
  },
  assessmentLessonCon: {
    border: "none",
    paddingTop: 0,
    paddingBottom: 0,
    marginTop: 20,
  },
  expandCon: {
    textAlign: "center",
    color: "#89c4f9",
  },
  homeFunLessonWrap: {
    display: "flex",
    alignItems: "center",
    marginTop: 20,
  },
  homeFunLessonCon: {
    flex: 8,
    paddingLeft: 20,
    height: 48,
    backgroundColor: "#89c4f9",
    lineHeight: "48px",
  },
  noDataCon: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f6f6f6",
    border: "2px dashed #8693f0",
    color: "#8693fc",
    fontSize: 20,
  },
  noDataPieCon: {
    width: 276,
    height: 276,
    borderRadius: "50%",
  },
  noDataSquareCon: {
    width: "100%",
    height: "100%",
    borderRadius: "15px",
  },
  rectCon: {
    display: "inline-block",
    width: 210,
    height: 40,
    color: "#fff",
    lineHeight: "40px",
    fontSize: 18,
    fontWeight: 600,
    position: "relative",
  },
  attentLiveClassColor: {
    color: "#8693f0",
  },
  absentLiveClassColor: {
    color: "#fe9b9b",
  },
  attentLiveClassBackColor: {
    backgroundColor: "#8693f0",
  },
  absentLiveClassBackColor: {
    backgroundColor: "#fe9b9b",
  },
  completeAssignmentColor: {
    color: "#89c4f9",
  },
  inCompleteAssignmentColor: {
    color: "#a4ddff",
  },
  completeAssignmentBackColor: {
    backgroundColor: "#89c4f9",
  },
  inCompleteAssignmentBackColor: {
    backgroundColor: "#a4ddff",
  },
  liveBackImg: {
    backgroundImage: `url(${liveBackUrl})`,
  },
  assessmentBackImg: {
    backgroundImage: `url(${assessmentBackUrl})`,
  },
}));
export interface LiveClassesReportProps {
  data: EntityLiveClassSummaryItem[];
  reportType: ReportType;
  liveClassSummary: LiveClassesSummaryResult;
}
export function LiveClassesReport(props: LiveClassesReportProps) {
  const css = useStyles();
  const { data, reportType, liveClassSummary } = props;
  const { items } = liveClassSummary;
  return (
    <div className={css.liveClassWrap}>
      <div className={clsx(css.scrollCss, css.leftWrap)}>
        {reportType === ReportType.live && <div style={{ marginTop: 20 }}></div>}
        {!items && (
          <div style={{ height: "calc(100% - 40px)" }}>
            <NoDataCom isPie={false} />
          </div>
        )}
        {items && items.length && reportType === ReportType.live && [1, 2, 3].map((item) => <LiveItem liveItem={data[0]} />)}
        {reportType === ReportType.assignment && <AssessmentCom />}
      </div>
      <div className={css.rightWrap}>
        <div className={clsx(css.rightItem)}>
          <span className={clsx(css.rightItemTitle, reportType === ReportType.assignment ? css.studyLessonCon : "")}>
            Learning Outcomes Covered
          </span>
          <div className={css.rightItemContent}>
            {[1, 2, 3].map((item) => (
              <div className={css.outcomeCon}>
                <span className={clsx(css.spot, reportType === ReportType.assignment ? css.studyLessonCon : "")}></span>
                <span className={css.learningOutcomeName}>Learning outcomes1</span>
              </div>
            ))}
          </div>
        </div>
        <div className={clsx(css.rightItem)}>
          <span className={clsx(css.rightItemTitle, reportType === ReportType.assignment ? css.studyLessonCon : "")}>
            Teachers's Feedback
          </span>
          <div className={css.rightItemContent}>
            <div className={css.teacherFeedback}>No feedback is available.</div>
          </div>
        </div>
      </div>
    </div>
  );
}

export interface LiveItemProps {
  liveItem: EntityLiveClassSummaryItem;
}
export function LiveItem(props: LiveItemProps) {
  const css = useStyles();
  // const { liveItem } = props;
  return (
    <div className={css.liveItem}>
      <div className={css.titleCon}>
        <span className={css.iconCon}></span>
        <span className={css.labelCon}>Jul 12, Monday</span>
      </div>
      <div className={css.contentCon}>
        {[1, 2].map((item) => (
          <div className={css.lessonCon}>
            <span className={css.timeCon}>10:00 AM</span>
            <div className={clsx(css.lessonInfoCon, css.liveLessonCon)}>
              <div className={css.lessonName}>Lesson Name</div>
              <div>
                <span className={css.lessonPlanName}>Lesson Plan Name</span>
              </div>
            </div>
            <Arrow />
          </div>
        ))}
      </div>
    </div>
  );
}

export function Arrow() {
  const css = useStyles();
  return (
    <div className={css.arrowCon}>
      <div className={css.arrow}></div>
    </div>
  );
}

const useExpand = () => {
  const [open, setOpen] = useState(false);
  const toggle = () => setOpen(!open);
  const [open2, setOpen2] = useState(false);
  const toggle2 = () => {
    console.log(2);
    return setOpen2(!open2);
  };
  return {
    collapse: { in: open },
    expandMore: { open, onClick: toggle },
    collaspe2: { in: open2 },
    expandMore2: { open2, onClick: toggle2 },
  };
};
interface ExpandBtnProps {
  open?: boolean;
  open2?: boolean;
}
const ExpandBtn = styled(IconButton)((props: ExpandBtnProps) => ({
  color: "#0e78d5",
  transform: props.open ? "rotate(180deg)" : "none",
}));
export function AssessmentCom() {
  const css = useStyles();
  const expand = useExpand();
  return (
    <div className={css.assessmentCon}>
      <div className={css.studyCon}>
        <div className={css.studyTitle}>Study</div>
        {[1, 2].map((item) => (
          <div className={clsx(css.lessonCon, css.assessmentLessonCon)}>
            <div className={clsx(css.lessonInfoCon, css.studyLessonCon)}>
              <div className={css.lessonName}>Lesson Name</div>
              <div>
                <span className={css.lessonPlanName}>Lesson Plan Name</span>
              </div>
            </div>
            <Arrow />
          </div>
        ))}
        <div className={css.expandCon}>
          {expand.expandMore.open ? d("See Less").t("assess_detail_see_less") : d("See More").t("assess_detail_see_more")}
          <ExpandBtn {...expand.expandMore}>
            <ArrowDropDownIcon />
          </ExpandBtn>
        </div>
        <Collapse {...expand.collapse} unmountOnExit>
          {[1, 2, 3].map((item) => (
            <div className={clsx(css.lessonCon, css.assessmentLessonCon)}>
              <div className={clsx(css.lessonInfoCon, css.studyLessonCon)}>
                <div className={css.lessonName}>Lesson Name</div>
                <div>
                  <span className={css.lessonPlanName}>Lesson Plan Name</span>
                </div>
              </div>
              <Arrow />
            </div>
          ))}
        </Collapse>
      </div>
      <div className={css.homefunStudyCon}>
        <div className={css.studyTitle}>Home Fun Study</div>
        {[1, 2].map((item) => (
          <div className={css.homeFunLessonWrap}>
            <div className={clsx(css.homeFunLessonCon)}>
              <span className={css.lessonName}>Lesson Name</span>
            </div>
            <Arrow />
          </div>
        ))}
      </div>
      <div className={css.expandCon}>
        {expand.expandMore2.open2 ? d("See Less").t("assess_detail_see_less") : d("See More").t("assess_detail_see_more")}
        <ExpandBtn {...expand.expandMore2}>
          <ArrowDropDownIcon />
        </ExpandBtn>
      </div>
      <Collapse {...expand.collaspe2} unmountOnExit>
        {[1, 2, 3].map((item) => (
          <div className={css.homeFunLessonWrap}>
            <div className={clsx(css.homeFunLessonCon)}>
              <span className={css.lessonName}>Lesson Name</span>
            </div>
            <Arrow />
          </div>
        ))}
      </Collapse>
    </div>
  );
}

export interface NoDataProps {
  isPie?: boolean;
  isSquare?: boolean;
}
export function NoDataCom(props: NoDataProps) {
  const { isPie } = props;
  const css = useStyles();

  return <div className={clsx(css.noDataCon, isPie ? css.noDataPieCon : css.noDataSquareCon)}>No Data Available</div>;
}

export interface RectProps {
  title: string;
  reportType: ReportType;
}
export function RectCom(props: RectProps) {
  const css = useStyles();
  const { title, reportType } = props;
  const isLiveClass = reportType === ReportType.live;
  return <div className={clsx(css.rectCon, isLiveClass ? css.liveBackImg : css.assessmentBackImg)}>{title}</div>;
}
