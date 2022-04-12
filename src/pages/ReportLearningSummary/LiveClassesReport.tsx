import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  makeStyles,
  Theme,
  Tooltip,
  Typography,
  withStyles,
} from "@material-ui/core";
import { ChangeHistoryOutlined, CheckOutlined, ClearOutlined, InfoOutlined } from "@material-ui/icons";
import { RootState } from "@reducers/index";
import { queryOutcomesByAssessmentId } from "@reducers/report";
import clsx from "clsx";
import React, { useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useQuery } from ".";
import { EntityAssignmentsSummaryItemV2, EntityLiveClassSummaryItem, EntityLiveClassSummaryItemV2 } from "../../api/api.auto";
import liveBackUrl from "../../assets/icons/report_reca.svg";
import assessmentBackUrl from "../../assets/icons/report_recl.svg";
import { d } from "../../locale/LocaleManager";
import { formatTimeToEng, formatTimeToMonWek } from "../../models/ModelReports";
import {
  AssignmentSummaryResultItem,
  LiveClassesSummaryResultItem,
  OutcomeStatus,
  QueryLearningSummaryTimeFilterCondition,
  ReportInfoBaseProps,
  ReportType,
} from "./types";
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
    maxHeight: 584,
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
    minHeight: 45,
    paddingLeft: 20,
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-around",
    paddingTop: 10,
    paddingBottom: 10,
  },
  lessonName: {
    fontSize: 16,
    color: "#fff",
    fontWeight: 600,
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
    // flex: 1,
    height: "50%",
    flexDirection: "column",
    marginTop: 50,
    marginLeft: 50,
  },
  rightItemStyle: {
    position: "relative",
  },
  rightItemContent: {
    flex: 5,
    backgroundColor: "#f6f6f6",
    paddingLeft: 26,
    overflowY: "auto",
    paddingBottom: 10,
  },
  outcomeCon: {
    marginTop: 15,
    display: "flex",
    alignItems: "center",
  },
  learningOutcomeName: {
    fontSize: 16,
    fontWeight: 400,
    color: "#666",
    wordBreak: "break-all",
    verticalAlign: "text-top",
  },
  teacherFeedback: {
    fontSize: 16,
    fontWeight: 400,
    color: "#666",
    padding: "10px 0",
    lineHeight: "22px",
    wordBreak: "break-all",
  },
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
    width: 275,
    height: 40,
    color: "#fff",
    lineHeight: "40px",
    fontSize: 18,
    fontWeight: 600,
    position: "relative",
  },
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
  statusCon: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  statusConStyle: {
    position: "absolute",
    left: "0",
    bottom: "0",
    backgroundColor: "#eaeaea",
    width: "100%",
    height: "26px",
  },
  customWidth: {
    maxWidth: "343px",
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
  }),
  viewAllCon: (props: ReportTypeProps) => ({
    height: "calc(100% - 108px)",
    paddingRight: 10,
    color: props.reportType === ReportType.live ? "#8693f0" : "#89c4f9",
    lineHeight: "77px",
    cursor: "pointer",
  }),
}));
const useLessonStyles = makeStyles(() => ({
  lessonCon: (props: LeftDataProps | undefined) => ({
    // (props.type === "home_fun_study" ? "#89c4f9" : "#a4ddff")
    background: props?.type ? "#89c4f9" : props?.absent ? "#fe9b9b" : "#8693f0",
  }),
  timeCon: (props: LeftDataProps | undefined) => ({
    color: props?.type ? (props.type === "home_fun_study" ? "#89c4f9" : "#a4ddff") : props?.absent ? "#fe9b9b" : "#8693f0",
  }),
}));
const LightTooltip = withStyles((theme: Theme) => ({
  tooltip: {
    width: "343px",
    backgroundColor: theme.palette.common.white,
    color: "rgb(0, 0, 0)",
    boxShadow: theme.shadows[1],
    fontSize: 12,
  },
}))(Tooltip);
export type ReportTypeProps = {
  reportType: QueryLearningSummaryTimeFilterCondition["summary_type"];
};
export interface LiveClassesReportProps extends ReportInfoBaseProps {
  data: EntityLiveClassSummaryItem[];
  lessonIndex: number;
}
export function LiveClassesReport(props: LiveClassesReportProps) {
  const css = useStyles();
  const dispatch = useDispatch();
  const { reportWeeklyOutcomes } = useSelector<RootState, RootState["report"]>((state) => state.report);
  const { student_id } = useQuery();
  const { lessonIndex, reportType, liveClassSummary, assignmentSummary, onChangeLessonIndex } = props;
  const liveitems = liveClassSummary.items;
  const assessmentitems = assignmentSummary.items;
  const isLive = reportType === ReportType.live;

  const outcomes = lessonIndex === -1 ? [] : reportWeeklyOutcomes;

  const key = useMemo(() => {
    if (isLive) {
      if (liveitems?.length && lessonIndex >= 0) {
        return liveitems[lessonIndex].schedule_id;
      } else {
        return "liveitems";
      }
    } else {
      if (assessmentitems?.length && lessonIndex >= 0) {
        return assessmentitems[lessonIndex].assessment_id;
      } else {
        return "assessmentitems";
      }
    }
  }, [lessonIndex, isLive, liveitems, assessmentitems]);

  const feedback = useMemo(() => {
    if (isLive) {
      if (liveitems?.length && lessonIndex >= 0) {
        return liveitems[lessonIndex].teacher_feedback;
      }
    } else {
      if (assessmentitems?.length && lessonIndex >= 0) {
        return assessmentitems[lessonIndex].teacher_feedback;
      }
    }
  }, [assessmentitems, isLive, lessonIndex, liveitems]);
  const handleClickLessonPlan = (item: EntityAssignmentsSummaryItemV2 | EntityLiveClassSummaryItemV2, index: number) => {
    onChangeLessonIndex(index);

    dispatch(queryOutcomesByAssessmentId({ assessment_id: item.assessment_id, student_id, metaLoading: true }));
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
                  onClickLessonPlan={() => handleClickLessonPlan(item, index)}
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
                onClickLessonPlan={() => handleClickLessonPlan(item, index)}
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
        <RightCom
          reportType={reportType}
          outcomes={outcomes}
          feedBack={feedback}
          hasLiveItems={!!liveitems}
          hasAssessmentItems={!!assessmentitems}
          lessonIndex={lessonIndex}
          rightComkey={key!}
        />
      </div>
    </div>
  );
}
export interface AllOutcomesProps extends ReportTypeProps {
  open: boolean;
  outcomes: EntityLiveClassSummaryItem["outcomes"];
  onClose: () => void;
}
export function AllOutcomes(props: AllOutcomesProps) {
  const css = useStyles();
  const { open, outcomes, onClose } = props;
  // const cssProps = usePropsStyles({ reportType });
  return (
    <Dialog open={open}>
      <DialogTitle>{d("Learning Outcomes Covered").t("report_learning_outcomes_covered")}</DialogTitle>
      <DialogContent dividers style={{ maxHeight: 280 }}>
        {outcomes?.map((item, index) => (
          <div key={item.id} className={css.outcomeCon}>
            {item.status === OutcomeStatus.achieved && <CheckOutlined style={{ color: "#1aa21e", marginRight: 3 }} />}
            {item.status === OutcomeStatus.partially && <ChangeHistoryOutlined style={{ color: "#f1c621", marginRight: 3 }} />}
            {item.status === OutcomeStatus.not_achieved && <ClearOutlined style={{ color: "#d52a2a", marginRight: 3 }} />}
            <span className={css.learningOutcomeName}>{item.name}</span>
          </div>
        ))}
      </DialogContent>
      <DialogActions>
        <Button color="primary" variant="contained" onClick={onClose}>
          {d("OK").t("general_button_OK")}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
export interface RightComProps extends ReportTypeProps {
  outcomes: EntityLiveClassSummaryItem["outcomes"];
  feedBack: EntityLiveClassSummaryItem["teacher_feedback"];
  hasLiveItems: boolean;
  hasAssessmentItems: boolean;
  lessonIndex: number;
  rightComkey: string;
}
export function RightCom(props: RightComProps) {
  const { reportType, outcomes, feedBack, hasLiveItems, hasAssessmentItems, lessonIndex, rightComkey } = props;
  const [open, setOpen] = useState(false);
  const css = useStyles();
  const cssProps = usePropsStyles({ reportType });
  const isLive = reportType === ReportType.live;
  const noOutcomesDataText = useMemo(() => {
    if (isLive) {
      if (hasLiveItems) {
        if (lessonIndex === -1) {
          return d("Please select a class from the list on the left to view the results.").t("report_no_class");
        } else {
          return d("No learning outcomes are available").t("report_no_learning_outcome");
        }
      } else {
        return d("No Data Available").t("report_no_data_available");
      }
    } else {
      if (hasAssessmentItems) {
        if (lessonIndex === -1) {
          return d("Please select an assessment from the list on the left to view the results.").t("report_no_assessment");
        } else {
          return d("No learning outcomes are available").t("report_no_learning_outcome");
        }
      } else {
        return d("No Data Available").t("report_no_data_available");
      }
    }
  }, [hasAssessmentItems, hasLiveItems, isLive, lessonIndex]);
  const noFeedbackDataText = useMemo(() => {
    if (isLive) {
      if (hasLiveItems) {
        if (lessonIndex === -1) {
          return d("Please select a class from the list on the left to view the results.").t("report_no_class");
        } else {
          return d("No feedback is available").t("report_no_feedback");
        }
      } else {
        return d("No Data Available").t("report_no_data_available");
      }
    } else {
      if (hasAssessmentItems) {
        if (lessonIndex === -1) {
          return d("Please select an assessment from the list on the left to view the results.").t("report_no_assessment");
        } else {
          return d("No feedback is available").t("report_no_feedback");
        }
      } else {
        return d("No Data Available").t("report_no_data_available");
      }
    }
  }, [isLive, hasLiveItems, lessonIndex, hasAssessmentItems]);
  const handleClickViewAll = () => {
    setOpen(true);
  };
  const handleCoseAllOutcomes = () => {
    setOpen(false);
  };
  return (
    <>
      <AllOutcomes reportType={reportType} open={open} outcomes={outcomes} onClose={handleCoseAllOutcomes} />
      <div className={clsx(css.rightItem, css.rightItemStyle)} key={rightComkey}>
        <span className={clsx(cssProps.rightItemTitle)}>
          {d("Learning Outcomes Covered").t("report_learning_outcomes_covered")}
          <LightTooltip
            placement="top-start"
            classes={{ tooltip: css.customWidth }}
            title={
              <div style={{ fontSize: 14, color: "#000" }}>
                <Typography variant="body1">
                  {/* {"Observable competency that can be demonstrated by the student by the end of the lesson."} */}
                  {d("Observable competency that can be demonstrated by the student by the end of the lesson.").t(
                    "report_msg_learning_outcomes_covered"
                  )}
                </Typography>
              </div>
            }
          >
            <InfoOutlined style={{ marginLeft: "10px" }} />
          </LightTooltip>
        </span>
        <div className={clsx(css.scrollCss, css.rightItemContent)}>
          {outcomes?.length ? (
            outcomes.slice(0, 3).map((item, index) => (
              <div key={item.id} className={css.outcomeCon}>
                {/* <span className={clsx(cssProps.spot)}></span> */}
                {item.status === OutcomeStatus.achieved && <CheckOutlined style={{ color: "#1aa21e", marginRight: 3 }} />}
                {item.status === OutcomeStatus.partially && <ChangeHistoryOutlined style={{ color: "#f1c621", marginRight: 3 }} />}
                {item.status === OutcomeStatus.not_achieved && <ClearOutlined style={{ color: "#d52a2a", marginRight: 3 }} />}
                <span className={css.learningOutcomeName}>{item.name}</span>
              </div>
            ))
          ) : (
            <div className={cssProps.infoFont}>{noOutcomesDataText}</div>
          )}
          {outcomes && outcomes?.length > 3 && (
            <Typography onClick={handleClickViewAll} className={cssProps.viewAllCon} align="right" variant="body1">
              {d("View All").t("report_lsr_view_all")}
              {" >"}
            </Typography>
          )}
        </div>
        <div className={clsx(css.statusCon, css.statusConStyle)}>
          <>
            <CheckOutlined style={{ color: "#1aa21e" }} />
            <Typography>{d("Achieved").t("report_label_achieved")}</Typography>
          </>
          <>
            <ChangeHistoryOutlined style={{ color: "#f1c621", marginLeft: 3 }} />
            <Typography>{d("In Progress").t("assessment_in_progress")}</Typography>
          </>
          <>
            <ClearOutlined style={{ color: "#d52a2a", marginLeft: 3 }} />
            <Typography>{d("Not Achieved").t("report_label_not_achieved")}</Typography>
          </>
        </div>
      </div>
      <div className={clsx(css.rightItem)}>
        <span className={clsx(cssProps.rightItemTitle)}>{d("Teacher’s Feedback").t("report_teacher_feedback")}</span>
        <div className={css.rightItemContent}>
          {feedBack ? <div className={css.teacherFeedback}>{feedBack}</div> : <div className={cssProps.infoFont}>{noFeedbackDataText}</div>}
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
  reportType: QueryLearningSummaryTimeFilterCondition["summary_type"];
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
          {
            <span className={clsx(cssProps.timeCon, cssLessonProps.timeCon)}>
              {isLive ? formatTimeToEng(currentData?.time || 0, "time") : ""}
            </span>
          }
          <div className={clsx(css.lessonInfoCon, cssLessonProps.lessonCon)} onClick={handleClick}>
            <div className={css.lessonName}>{currentData?.title}</div>
            {currentData?.lpname && (
              <div>
                <span className={css.lessonPlanName}>{currentData?.lpname}</span>
              </div>
            )}
          </div>
          <div className={css.arrowCon} style={{ visibility: showArrow ? "visible" : "hidden" }}>
            <div
              className={clsx(
                css.arrow,
                isLive ? (currentData?.absent ? css.absentLiveArrow : css.attendLiveArrow) : css.completedStudyArrow
                // : currentData?.type === "study"
                // ? css.completedStudyArrow
                // : css.inCompleteStudyArrow
              )}
            ></div>
          </div>
        </div>
      </div>
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
  return (
    <div className={clsx(css.noDataCon, cssProps.noDataCon, isPie ? css.noDataPieCon : css.noDataSquareCon)}>
      {d("No Data Available").t("report_no_data_available")}
    </div>
  );
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
