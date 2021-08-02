import { makeStyles } from "@material-ui/core";
import clsx from "clsx";
import React, { useMemo } from "react";
import { EntityLiveClassSummaryItem } from "../../api/api.auto";
import liveBackUrl from "../../assets/icons/report_reca.svg";
import assessmentBackUrl from "../../assets/icons/report_recl.svg";
import { formatTimeToEng, formatTimeToMonWek } from "../../models/ModelReports";
import { AssignmentSummaryResultItem, LiveClassesSummaryResultItem, ReportInfoBaseProps, ReportType } from "./types";
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
    boxSizing: "border-box",
  },
  leftWrap: {
    flex: 1,
    height: "100%",
    overflowY: "auto",
    paddingTop: 20,
  },
  rightWrap: {
    flex: 1,
    height: "100%",
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
    marginLeft: 50,
  },
  rightItemContent: {
    flex: 5,
    backgroundColor: "#f6f6f6",
    paddingLeft: 26,
  },
  outcomeCon: {
    marginTop: 15,
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
  // assessmentCon: {
  //   display: "flex",
  //   flexDirection: "column",
  // },
  // studyCon: {
  //   flex: 2,
  // },
  // homefunStudyCon: {
  //   flex: 1,
  // },
  // liveLessonCon: {
  //   background: "#8693f0",
  // },
  // studyLessonCon: {
  //   backgroundColor: "#89c4f9",
  // },
  // assignmentColor: {
  //   color: "#89c4f9",
  // },
  // studyTitle: {
  //   fontSize: 18,
  //   fontWeight: 600,
  //   color: "#333",
  //   marginTop: 10,
  // },
  // assessmentLessonCon: {
  //   border: "none",
  //   paddingTop: 0,
  //   paddingBottom: 0,
  //   marginTop: 20,
  // },
  // expandCon: {
  //   textAlign: "center",
  //   color: "#89c4f9",
  // },
  // homeFunLessonWrap: {
  //   display: "flex",
  //   alignItems: "center",
  //   marginTop: 20,
  // },
  // homeFunLessonCon: {
  //   flex: 8,
  //   paddingLeft: 20,
  //   height: 48,
  //   backgroundColor: "#89c4f9",
  //   lineHeight: "48px",
  // },
  noDataCon: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f6f6f6",
    border: "2px dashed #8693f0",
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
  // attentLiveClassColor: {
  //   color: "#8693f0",
  // },
  // absentLiveClassColor: {
  //   color: "#fe9b9b",
  // },
  // attentLiveClassBackColor: {
  //   backgroundColor: "#8693f0",
  // },
  // absentLiveClassBackColor: {
  //   backgroundColor: "#fe9b9b",
  // },
  // completeAssignmentColor: {
  //   color: "#89c4f9",
  // },
  // inCompleteAssignmentColor: {
  //   color: "#a4ddff",
  // },
  // completeAssignmentBackColor: {
  //   backgroundColor: "#89c4f9",
  // },
  // inCompleteAssignmentBackColor: {
  //   backgroundColor: "#a4ddff",
  // },
  liveBackImg: {
    backgroundImage: `url(${liveBackUrl})`,
  },
  assessmentBackImg: {
    backgroundImage: `url(${assessmentBackUrl})`,
  },
  noDataWrap: {
    height: "calc(100% - 58px)",
    marginTop: 30,
    width: "calc(100% - 50px)",
  },
}));
const usePropsStyles = makeStyles(() => ({
  noDataCon: (props: ReportTypeProps) => ({
    color: props.reportType === ReportType.live ? "#8693f0" : "#89c4f9",
    border: `2px dashed ${props.reportType === ReportType.live ? "#8693f0" : "#89c4f9"}`,
  }),
  rightItemTitle: (props: ReportTypeProps) => ({
    flex: 1,
    backgroundColor: props.reportType === ReportType.live ? "#8693f0" : "#89c4f9",
    paddingLeft: 26,
    fontSize: 18,
    fontWeight: 600,
    color: "#fff",
    display: "flex",
    alignItems: "center",
  }),
  spot: (props: ReportTypeProps) => ({
    display: "inline-block",
    width: 10,
    height: 10,
    borderRadius: "50%",
    backgroundColor: props.reportType === ReportType.live ? "#8693f0" : "#89c4f9",
    marginRight: 15,
  }),
  infoFont: (props: ReportTypeProps) => ({
    fontSize: 16,
    fontWeight: 400,
    padding: "10px 0",
    lineHeight: "22px",
    color: props.reportType === ReportType.live ? "#8693f0" : "#89c4f9",
  }),
  timeCon: (props: ReportTypeProps) => ({
    marginLeft: 9,
    fontSize: 14,
    flex: props.reportType === ReportType.live ? 2 : 1,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "#8693f0",
  }),
}));
const useLessonStyles = makeStyles(() => ({
  lessonCon: (props: LeftDataProps | undefined) => ({
    background: props?.type ? (props.type === "home_fun_study" ? "#89c4f9" : "#a4ddff") : props?.absent ? "#fe9b9b" : "#8693f0",
  }),
}));
export type ReportTypeProps = {
  reportType: ReportType;
};
export interface LiveClassesReportProps extends ReportInfoBaseProps {
  data: EntityLiveClassSummaryItem[];
  lessonIndex: number;
}
export function LiveClassesReport(props: LiveClassesReportProps) {
  const css = useStyles();
  const { lessonIndex, reportType, liveClassSummary, assignmentSummary, onChangeLessonIndex } = props;
  console.log(lessonIndex);
  const liveitems = liveClassSummary.items;
  const assessmentitems = assignmentSummary.items;
  const isLive = reportType === ReportType.live;
  const outcomes = useMemo(() => {
    if (isLive) {
      if (liveitems && lessonIndex !== -1 && lessonIndex >= 0) {
        return liveitems[lessonIndex].outcomes;
      }
    } else {
      if (assessmentitems && lessonIndex !== -1 && lessonIndex >= 0) {
        return assessmentitems[lessonIndex].outcomes;
      }
    }
  }, [assessmentitems, lessonIndex, isLive, liveitems]);
  const feedback = useMemo(() => {
    if (liveitems && lessonIndex !== -1 && lessonIndex >= 0) {
      return liveitems[lessonIndex].teacher_feedback;
    }
  }, [lessonIndex, liveitems]);
  const handleClickLessonPlan = (index: number) => {
    onChangeLessonIndex(index);
  };
  return (
    <div className={css.liveClassWrap}>
      <div className={clsx(css.scrollCss, css.leftWrap)}>
        {isLive ? (
          liveitems && liveitems.length ? (
            liveitems.map((item, index) => {
              const showTime =
                index > 0
                  ? formatTimeToMonWek(item.class_start_time || 0) !== formatTimeToMonWek(liveitems[index - 1].class_start_time || 0)
                  : true;
              return (
                <LiveItem
                  reportType={reportType}
                  key={item.schedule_id}
                  showArrow={index === lessonIndex}
                  liveItem={item}
                  showTime={showTime}
                  onClickLessonPlan={() => handleClickLessonPlan(index)}
                />
              );
            })
          ) : (
            <div className={css.noDataWrap}>
              <NoDataCom isPie={false} reportType={reportType} />
            </div>
          )
        ) : assessmentitems && assessmentitems.length ? (
          assessmentitems.map((item, index) => {
            const showTime =
              index > 0
                ? formatTimeToMonWek(item.complete_at || 0) !== formatTimeToMonWek(assessmentitems[index - 1].complete_at || 0)
                : true;
            return (
              <LiveItem
                reportType={reportType}
                key={item.schedule_id}
                showArrow={index === lessonIndex}
                assignmentItem={item}
                showTime={showTime}
                onClickLessonPlan={() => handleClickLessonPlan(index)}
              />
            );
          })
        ) : (
          <div className={css.noDataWrap}>
            <NoDataCom isPie={false} reportType={reportType} />
          </div>
        )}
      </div>
      <div className={css.rightWrap}>
        <RightCom reportType={reportType} outcomes={outcomes} feedBack={feedback} />
      </div>
    </div>
  );
}

export interface RightComProps extends ReportTypeProps {
  outcomes: EntityLiveClassSummaryItem["outcomes"];
  feedBack: EntityLiveClassSummaryItem["teacher_feedback"];
}
export function RightCom(props: RightComProps) {
  const { reportType, outcomes, feedBack } = props;
  const css = useStyles();
  const cssProps = usePropsStyles({ reportType });
  return (
    <>
      <div className={clsx(css.rightItem)}>
        <span className={clsx(cssProps.rightItemTitle)}>{"Learning Outcomes Covered"}</span>
        <div className={css.rightItemContent}>
          {outcomes?.length ? (
            outcomes.map((item) => (
              <div key={item.id} className={css.outcomeCon}>
                <span className={clsx(cssProps.spot)}></span>
                <span className={css.learningOutcomeName}>{item.name}</span>
              </div>
            ))
          ) : (
            <div className={cssProps.infoFont}>{"No Data Available"}</div>
          )}
        </div>
      </div>
      <div className={clsx(css.rightItem)}>
        <span className={clsx(cssProps.rightItemTitle)}>{"Teachers's Feedback"}</span>
        <div className={css.rightItemContent}>
          {feedBack ? (
            <div className={css.teacherFeedback}>{feedBack ? feedBack : "No feedback is available."}</div>
          ) : (
            <div className={cssProps.infoFont}>{"No Data Available"}</div>
          )}
        </div>
      </div>
    </>
  );
}

export interface LiveItemProps {
  showTime: boolean;
  showArrow: boolean;
  liveItem?: LiveClassesSummaryResultItem;
  assignmentItem?: AssignmentSummaryResultItem;
  reportType: ReportType;
  onClickLessonPlan: () => void;
}
export type LeftDataProps = {
  time?: number;
  lpname?: string;
  title?: string;
  absent?: boolean;
  type?: string;
};
export function LiveItem(props: LiveItemProps) {
  const css = useStyles();
  const { showArrow, showTime, reportType, liveItem, assignmentItem, onClickLessonPlan } = props;
  const cssProps = usePropsStyles({ reportType });
  const currentData: LeftDataProps | undefined = useMemo(() => {
    if (liveItem)
      return {
        time: liveItem.class_start_time,
        lpname: liveItem.lesson_plan_name,
        title: liveItem.schedule_title,
        absent: liveItem.absent,
      };
    if (assignmentItem)
      return {
        time: assignmentItem.complete_at,
        lpname: assignmentItem.lesson_plan_name,
        title: assignmentItem.assessment_title,
        type: assignmentItem.assessment_type,
      };
  }, [assignmentItem, liveItem]);
  const cssLessonProps = useLessonStyles(currentData);
  const isLive = reportType === ReportType.live;
  const handleClick = () => {
    onClickLessonPlan();
  };
  return (
    <div className={css.liveItem}>
      {showTime && (
        <div className={css.titleCon}>
          <span className={css.iconCon}></span>
          <span className={css.labelCon}>{formatTimeToMonWek(currentData?.time || 0)}</span>
        </div>
      )}
      <div className={css.contentCon}>
        <div className={css.lessonCon}>
          {<span className={cssProps.timeCon}>{isLive ? formatTimeToEng(currentData?.time || 0, "time") : ""}</span>}
          <div className={clsx(css.lessonInfoCon, cssLessonProps.lessonCon)} onClick={handleClick}>
            <div className={css.lessonName}>{currentData?.title}</div>
            <div>
              <span className={css.lessonPlanName}>{currentData?.lpname}</span>
            </div>
          </div>
          {/* <Arrow showArrow={showArrow} /> */}
          <div className={css.arrowCon} style={{ visibility: showArrow ? "visible" : "hidden" }}>
            <div
              className={clsx(
                css.arrow,
                isLive
                  ? currentData?.absent
                    ? css.absentLiveArrow
                    : css.attendLiveArrow
                  : currentData?.type === "study"
                  ? css.completedStudyArrow
                  : css.inCompleteStudyArrow
              )}
            ></div>
          </div>
        </div>
      </div>
    </div>
  );
}
export interface ArrowProps {
  showArrow: boolean;
}
export function Arrow(props: ArrowProps) {
  const css = useStyles();
  const { showArrow } = props;
  return (
    <div className={css.arrowCon} style={{ visibility: showArrow ? "visible" : "hidden" }}>
      <div className={css.arrow}></div>
    </div>
  );
}
export interface NoDataProps extends ReportTypeProps {
  isPie?: boolean;
  isSquare?: boolean;
}
export function NoDataCom(props: NoDataProps) {
  const { isPie, reportType } = props;
  const css = useStyles();
  const cssProps = usePropsStyles({ reportType });
  return <div className={clsx(css.noDataCon, cssProps.noDataCon, isPie ? css.noDataPieCon : css.noDataSquareCon)}>No Data Available</div>;
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
