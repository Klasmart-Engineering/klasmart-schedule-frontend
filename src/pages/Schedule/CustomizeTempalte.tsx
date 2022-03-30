import { makeStyles, useMediaQuery, useTheme } from "@material-ui/core";
import Box from "@material-ui/core/Box";
import Tooltip from "@material-ui/core/Tooltip";
import { CloseOutlined, DeleteOutlined, EditOutlined, VisibilityOff } from "@material-ui/icons";
import AssignmentOutlinedIcon from "@material-ui/icons/AssignmentOutlined";
import GetAppIcon from "@material-ui/icons/GetApp";
import LiveTvOutlinedIcon from "@material-ui/icons/LiveTvOutlined";
import LocalLibraryOutlinedIcon from "@material-ui/icons/LocalLibraryOutlined";
import SchoolOutlinedIcon from "@material-ui/icons/SchoolOutlined";
import { actError } from "@reducers/notify";
import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useHistory } from "react-router";
import { EntityScheduleViewDetail } from "../../api/api.auto";
import { apiLivePath, apiResourcePathById } from "../../api/extra";
import PermissionType from "../../api/PermissionType";
import { Permission } from "../../components/Permission";
import { usePermission } from "../../hooks/usePermission";
import { d, t } from "../../locale/LocaleManager";
import { getScheduleLiveToken, scheduleShowOption, scheduleUpdateStatus } from "../../reducers/schedule";
import { classTypeLabel, EntityScheduleShortInfo, memberType, ScheduleEditExtend, scheduleInfoViewProps } from "../../types/scheduleTypes";
import ScheduleButton from "./ScheduleButton";

const useStyles = makeStyles(({ breakpoints }) => ({
  previewContainer: {
    width: "600px",
    borderRadius: "4px",
    boxShadow: "0px 11px 15px -7px rgba(0,0,0,0.2), 0px 9px 46px 8px rgba(0,0,0,0.12), 0px 24px 38px 3px rgba(0,0,0,0.14)",
    [breakpoints.down(650)]: {
      width: "99%",
    },
  },
  title: {
    fontSize: "24px",
    fontWeight: "bold",
  },
  date: {
    color: "#666",
  },
  time: {
    fontSize: "18px",
    color: "black",
  },
  firstIcon: {
    color: "#0e78d5",
    cursor: "pointer",
    marginLeft: "25px",
  },
  lastIcon: {
    color: "red",
    marginLeft: "25px",
    cursor: "pointer",
  },
  disableLastIcon: {
    color: "gray",
    marginLeft: "25px",
    cursor: "no-drop",
  },
  lastButton: {
    margin: "0 20px !important",
  },
  buttonPart: {
    display: "flex",
    justifyContent: "flex-end",
    padding: "6%",
  },
  checkPlan: {
    color: "#E02020",
    fontWeight: "bold",
    paddingTop: "10px",
    textAlign: "left",
    width: "90%",
    marginLeft: "8%",
  },
  customizeTitleBox: {
    display: "flex",
    width: "94%",
    height: "2rem",
    boxShadow: "0px 0px 6px gray",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "3%",
    "& span": {
      fontSize: "1.4rem",
      [breakpoints.down(650)]: {
        fontSize: "0.8rem",
      },
      fontWeight: "bold",
      overflow: "hidden",
      textOverflow: "ellipsis",
      whiteSpace: "nowrap",
    },
  },
  customizeContentBox: {
    width: "100%",
    maxHeight: "56vh",
    [breakpoints.down(650)]: {
      maxHeight: "65vh",
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
  contentRow: {
    marginTop: "28px",
    display: "flex",
    "& span": {
      display: "block",
    },
  },
  row: {
    fontWeight: "bold",
    width: "18%",
    textAlign: "left",
    fontSize: "1.1rem",
    paddingLeft: "8%",
    [breakpoints.down(650)]: {
      fontSize: "0.9rem",
      width: "30%",
    },
  },
  row2: {
    width: "60%",
    wordBreak: "break-word",
    fontWeight: 500,
    paddingLeft: "6%",
    fontSize: "1rem",
    [breakpoints.down(650)]: {
      fontSize: "0.8rem",
      paddingLeft: "38px",
    },
  },
  previewContainerMb: {
    position: "fixed",
    backgroundColor: "white",
    width: "100%",
    top: 0,
    left: 0,
  },
  eventIcon: {
    fontSize: "34px",
  },
  previewDetailMb: {
    marginTop: "20px",
    overflow: "auto",
    marginBottom: "18px",
    paddingRight: "3%",
  },
  previewDetailSubMb: {
    marginBottom: "18px",
    "& span:last-child": {
      display: "block",
      marginTop: "6px",
      fontSize: "15px",
      wordBreak: "break-word",
    },
    "& span:first-child": {
      fontSize: "13px",
      fontWeight: 600,
      color: "#A9A9A9",
    },
  },
  lessonText: {
    width: "60%",
    wordBreak: "break-word",
    paddingLeft: "6%",
    [breakpoints.down(650)]: {
      paddingLeft: "38px",
    },
  },
  timeMb: {
    fontWeight: 600,
    display: "block",
    marginTop: "6px",
    color: "#5E5F61",
  },
  titleMb: {
    display: "block",
    marginLeft: "18px",
    fontWeight: "bold",
    fontSize: "18px",
    marginTop: "8px",
  },
}));

interface InfoProps {
  handleDelete: (scheduleInfo: EntityScheduleViewDetail) => void;
  handleClose: () => void;
  scheduleInfo: scheduleInfoViewProps;
  toLive: () => void;
  changeModalDate: (data: object) => void;
  checkLessonPlan: boolean;
  handleChangeHidden: (is_hidden: boolean) => void;
  isHidden: boolean;
  refreshView: (template: string) => void;
  ScheduleViewInfo: EntityScheduleViewDetail;
  privilegedMembers: (member: memberType) => boolean;
}

interface InfoMbProps extends InfoProps {
  handleEditSchedule: (scheduleInfo: EntityScheduleViewDetail) => void;
  handleHide: () => void;
  disableDelete: () => void;
  deleteHandle: () => void;
  showDelete: () => void;
  textEllipsis: (characterCount: number, values?: string) => string;
  timestampToTime: (timestamp: number, is_yaer: boolean, is_month?: boolean) => string;
  multiStructure: (item?: EntityScheduleShortInfo[]) => string[] | undefined;
  handleGoLive: (scheduleInfos: ScheduleEditExtend) => void;
}

function CustomizeTempalteMb(props: InfoMbProps) {
  const classes = useStyles();
  const dispatch = useDispatch();
  const {
    handleClose,
    ScheduleViewInfo,
    privilegedMembers,
    handleEditSchedule,
    handleHide,
    disableDelete,
    showDelete,
    deleteHandle,
    timestampToTime,
    multiStructure,
    handleGoLive,
  } = props;
  const eventColor = [
    { id: "OnlineClass", color: "#0E78D5", icon: <LiveTvOutlinedIcon className={classes.eventIcon} />, title: "LIVE" },
    { id: "OfflineClass", color: "#1BADE5", icon: <SchoolOutlinedIcon className={classes.eventIcon} />, title: "Class" },
    { id: "Homework", color: "#13AAA9", icon: <LocalLibraryOutlinedIcon className={classes.eventIcon} />, title: "Study" },
    { id: "Task", color: "#AFBA0A", icon: <AssignmentOutlinedIcon className={classes.eventIcon} />, title: "Task" },
  ];
  const eventTemplate = eventColor.filter((item) => item.id === ScheduleViewInfo.class_type_label?.id);
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

  const monthArr = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Spt", "Oct", "Nov", "Dec"];
  const weekArr = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

  const [stateFlag, setStateFlag] = React.useState<boolean>(true);

  const sameDay = (timestampStart: number, timestampEnd: number): string => {
    const timestampDate = new Date(timestampStart * 1000);
    const timestampDateEnd = new Date(timestampEnd * 1000);
    const dateNumFun = (num: number) => (num < 10 ? `0${num}` : num);
    const [Y, M, D, W, h, m] = [
      (timestampDate as Date).getFullYear(),
      (timestampDate as Date).getMonth(),
      (timestampDate as Date).getDate(),
      (timestampDate as Date).getDay(),
      dateNumFun((timestampDate as Date).getHours()),
      dateNumFun((timestampDate as Date).getMinutes()),
    ];
    if (new Date(timestampStart * 1000).toDateString() === new Date(timestampEnd * 1000).toDateString()) {
      return `${weekArr[W]}, ${monthArr[M]} ${D}, ${Y} ${h}:${m}  |  ${dateNumFun((timestampDateEnd as Date).getHours())}:${dateNumFun(
        (timestampDateEnd as Date).getMinutes()
      )}`;
    } else {
      return "";
    }
  };

  useEffect(() => {
    if (stateFlag) {
      if (
        (!ScheduleViewInfo.lesson_plan || !ScheduleViewInfo.lesson_plan?.is_auth) &&
        ScheduleViewInfo.class_type_label?.id !== "Task" &&
        !ScheduleViewInfo.is_home_fun &&
        !ScheduleViewInfo.is_review
      ) {
        dispatch(
          actError(d("Oops! The lesson plan included for this lesson has already been deleted!").t("schedule_msg_recall_lesson_plan"))
        );
      }
      if (ScheduleViewInfo.review_status === "failed") {
        dispatch(
          actError(
            d("System failed to generate a review session on {value}. Please try again.").t("schedule_review_popup_fail_notice", {
              value: timestampToTime(ScheduleViewInfo.due_at as number, true),
            })
          )
        );
      }
      if (ScheduleViewInfo.review_status === "pending") {
        dispatch(
          actError(d("System is generating adaptive learning lesson plan for each student.").t("schedule_review_popup_pending_notice"))
        );
      }
      setStateFlag(false);
    }
  }, [ScheduleViewInfo, timestampToTime, dispatch, stateFlag]);

  return (
    <Box className={classes.previewContainerMb} style={{ height: `${window.innerHeight}px` }}>
      <div style={{ textAlign: "end", padding: "4.6%" }}>
        {ScheduleViewInfo.exist_feedback && ScheduleViewInfo.is_hidden && !privilegedMembers("Student") && (
          <VisibilityOff style={{ color: "#000000" }} onClick={handleHide} className={classes.lastIcon} />
        )}
        {!ScheduleViewInfo.is_hidden && disableDelete() && ScheduleViewInfo.review_status !== "success" && (
          <DeleteOutlined className={classes.disableLastIcon} />
        )}
        {!ScheduleViewInfo.is_hidden && showDelete() && ScheduleViewInfo.review_status !== "success" && (
          <Permission
            value={PermissionType.delete_event_540}
            render={(value) =>
              value && (
                <DeleteOutlined
                  className={classes.lastIcon}
                  onClick={() => {
                    deleteHandle();
                  }}
                />
              )
            }
          />
        )}
        {!ScheduleViewInfo.is_review && (
          <EditOutlined
            className={classes.firstIcon}
            onClick={() => {
              handleEditSchedule(ScheduleViewInfo);
              document.body.scrollTop = document.documentElement.scrollTop = 0;
            }}
          />
        )}
        <CloseOutlined className={classes.lastIcon} style={{ color: "#000000" }} onClick={handleClose} />
      </div>
      <div style={{ paddingLeft: "8%", paddingRight: "2%" }}>
        <div style={{ color: eventTemplate[0].color, display: "flex", justifyContent: "flex-start", alignItems: "center" }}>
          {eventTemplate[0].icon}
          <span className={classes.titleMb}>{eventTemplate[0].title}</span>
        </div>
        <div>
          <Tooltip title={ScheduleViewInfo.title as string} placement="top-start">
            <h2 style={{ margin: "16px 0 3px 0px" }}>{ScheduleViewInfo.title}</h2>
          </Tooltip>
          <span
            className={classes.timeMb}
            style={{
              visibility: ScheduleViewInfo.class_type_label?.id === "Homework" ? "visible" : "hidden",
            }}
          >
            {d("Due on").t("schedule_study_due_on")} {timestampToTime(ScheduleViewInfo.due_at as number, true)}
          </span>
          <span
            className={classes.timeMb}
            style={{
              display: ScheduleViewInfo.class_type_label?.id === "Homework" ? "none" : "block",
              visibility: ScheduleViewInfo.class_type_label?.id !== "Homework" ? "visible" : "hidden",
            }}
          >
            {sameDay(ScheduleViewInfo.start_at as number, ScheduleViewInfo.end_at as number) !== ""
              ? sameDay(ScheduleViewInfo.start_at as number, ScheduleViewInfo.end_at as number)
              : timestampToTime(ScheduleViewInfo.start_at as number, false)}
          </span>
          <span
            className={classes.timeMb}
            style={{
              visibility:
                ScheduleViewInfo.class_type_label?.id !== "Homework" &&
                !sameDay(ScheduleViewInfo.start_at as number, ScheduleViewInfo.end_at as number)
                  ? "visible"
                  : "hidden",
            }}
          >
            {timestampToTime(ScheduleViewInfo.end_at as number, false)}
          </span>
        </div>
        <div className={classes.previewDetailMb} style={{ height: previewDetailMbHeight() }}>
          {ScheduleViewInfo.is_review && (
            <div className={classes.previewDetailSubMb}>
              <span>{d("Class Type").t("schedule_detail_class_type")} </span>
              <span>{d("Review").t("schedule_lable_class_type_review")}</span>
            </div>
          )}
          {!ScheduleViewInfo.is_review && (
            <div className={classes.previewDetailSubMb}>
              <span>{d("Description").t("assess_label_description")}</span>
              <span>{!ScheduleViewInfo.description ? "N/A" : ScheduleViewInfo.description}</span>
            </div>
          )}
          {ScheduleViewInfo.is_review && (
            <div className={classes.previewDetailSubMb}>
              <span>{d("Date Range").t("schedule_review_popup_date_range")} </span>
              <span>
                {" "}
                {timestampToTime(ScheduleViewInfo.content_start_at as number, false, true)} ~{" "}
                {timestampToTime(ScheduleViewInfo.content_end_at as number, false, true)}
              </span>
            </div>
          )}
          <div className={classes.previewDetailSubMb}>
            <span>{d("Class Name").t("assess_detail_class_name")}</span>
            <span>{ScheduleViewInfo.class ? ScheduleViewInfo.class?.name : "N/A"}</span>
          </div>
          <div className={classes.previewDetailSubMb}>
            <span>{d("Teacher").t("schedule_detail_teacher")}</span>
            <span>{multiStructure(ScheduleViewInfo.teachers)}</span>
          </div>
          {!privilegedMembers("Student") &&
            !privilegedMembers("Student") &&
            !(
              ScheduleViewInfo.review_status === "success" &&
              ScheduleViewInfo.personalized_review_students?.length !== ScheduleViewInfo.students?.length
            ) && (
              <div className={classes.previewDetailSubMb}>
                <span>{d("Student").t("assess_detail_student")}</span>
                <span>{multiStructure(ScheduleViewInfo.students)}</span>
              </div>
            )}
          {!ScheduleViewInfo.is_review && (
            <>
              <div className={classes.previewDetailSubMb}>
                <span>{d("Lesson Plan").t("schedule_detail_lesson_plan")}</span>
                <span>
                  <div style={{ fontWeight: 500 }}>{ScheduleViewInfo.lesson_plan?.name}</div>
                  {ScheduleViewInfo.lesson_plan?.materials?.map((material: EntityScheduleShortInfo) => {
                    return <div style={{ marginTop: "10px" }}>{material.name}</div>;
                  })}
                </span>
              </div>
              <div className={classes.previewDetailSubMb}>
                <span>{d("Room ID").t("schedule_popup_room_id")}</span>
                <span>{ScheduleViewInfo.room_id}</span>
              </div>
              <div className={classes.previewDetailSubMb}>
                <span>{d("Attachment").t("schedule_detail_attachment")}</span>
                <span style={{ display: "flex", alignItems: "center" }}>
                  {ScheduleViewInfo.attachment?.id ? (
                    <>
                      {ScheduleViewInfo.attachment?.name}{" "}
                      <GetAppIcon
                        onClick={() => {
                          window.open(`${apiResourcePathById(ScheduleViewInfo.attachment?.id)}`, "_blank");
                        }}
                        style={{ color: "#0E78D5", cursor: "pointer", fontSize: "20px", marginLeft: "10px" }}
                      />
                    </>
                  ) : (
                    "N/A"
                  )}
                </span>
              </div>
            </>
          )}
          {ScheduleViewInfo.is_review && (
            <>
              {ScheduleViewInfo.review_status === "success" &&
                !privilegedMembers("Student") &&
                ScheduleViewInfo.personalized_review_students?.length !== ScheduleViewInfo.students?.length && (
                  <>
                    <div className={classes.previewDetailSubMb}>
                      <span> {d("Students with Personalized Lesson Plans").t("schedule_review_popup_student_list")}</span>
                      <span>{multiStructure(ScheduleViewInfo.personalized_review_students)}</span>
                    </div>
                    <div className={classes.previewDetailSubMb}>
                      <span>
                        {d("Students who receive a random Lesson Plan due to no enough content to review").t(
                          "schedule_review_popup_random_student_list"
                        )}
                      </span>
                      <span>{multiStructure(ScheduleViewInfo.random_review_students)}</span>
                    </div>
                  </>
                )}
              <div className={classes.previewDetailSubMb}>
                <span> {d("Program").t("schedule_detail_program")}</span>
                <span>{ScheduleViewInfo.program?.name}</span>
              </div>
              <div className={classes.previewDetailSubMb}>
                <span>{d("Subject").t("assess_label_subject")}</span>
                <span>{multiStructure(ScheduleViewInfo.subjects)}</span>
              </div>
            </>
          )}
        </div>
      </div>
      {ScheduleViewInfo.class_type_label?.id !== "Task" && !ScheduleViewInfo.is_home_fun && (
        <div style={{ display: "flex", justifyContent: "space-around", paddingRight: "20px" }}>
          <ScheduleButton
            handleClose={handleClose}
            scheduleInfo={ScheduleViewInfo}
            templateType="schedulePopup"
            handleGoLive={handleGoLive}
          />
        </div>
      )}
    </Box>
  );
}

export default function CustomizeTempalte(props: InfoProps) {
  const classes = useStyles();
  const history = useHistory();
  const dispatch = useDispatch();
  const {
    handleDelete,
    handleClose,
    scheduleInfo,
    changeModalDate,
    toLive,
    checkLessonPlan,
    handleChangeHidden,
    isHidden,
    refreshView,
    ScheduleViewInfo,
    privilegedMembers,
  } = props;
  const monthArr = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Spt", "Oct", "Nov", "Dec"];
  const weekArr = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  // const { liveToken } = useSelector<RootState, RootState["schedule"]>((state) => state.schedule);
  const perm = usePermission([PermissionType.attend_live_class_as_a_student_187]);
  const permissionShowLive = perm.attend_live_class_as_a_student_187;

  const timestampToTime = (timestamp: number, is_yaer: boolean, is_month?: boolean): string => {
    if (!timestamp) return "N/A";
    const timestampDate = new Date(timestamp * 1000);
    const dateNumFun = (num: number) => (num < 10 ? `0${num}` : num);
    const [Y, M, D, W, h, m] = [
      (timestampDate as Date).getFullYear(),
      (timestampDate as Date).getMonth(),
      (timestampDate as Date).getDate(),
      (timestampDate as Date).getDay(),
      dateNumFun((timestampDate as Date).getHours()),
      dateNumFun((timestampDate as Date).getMinutes()),
    ];
    if (is_month) return `${monthArr[M]} ${D}`;
    if (is_yaer) return `${weekArr[W]}, ${monthArr[M]} ${D}, ${Y}`;
    return `${weekArr[W]}, ${monthArr[M]} ${D}, ${Y} ${h}:${m}`;
  };

  const handleEditSchedule = (scheduleInfo: EntityScheduleViewDetail): void => {
    const currentTime = Math.floor(new Date().getTime());
    if (scheduleInfo.class_type_label?.id === "Homework" || scheduleInfo.class_type_label?.id === "Task") {
      if (scheduleInfo.due_at !== 0 && (scheduleInfo.due_at as number) * 1000 < currentTime) {
        changeModalDate({
          title: "",
          // text: "You cannot edit this event after the due date",
          text: d("You cannot edit this event after the due date.").t("schedule_msg_edit_due_date"),
          openStatus: true,
          enableCustomization: false,
          buttons: [
            {
              label: d("OK").t("schedule_button_ok"),
              event: () => {
                changeModalDate({ openStatus: false, enableCustomization: false });
              },
            },
          ],
          handleClose: () => {
            changeModalDate({ openStatus: false, enableCustomization: false });
          },
        });
        return;
      }
    }
    handleClose();
    history.push(`/schedule/calendar/rightside/scheduleTable/model/edit?schedule_id=${ScheduleViewInfo.id}`);
  };

  const handleGoLive = async (scheduleInfos: ScheduleEditExtend) => {
    const currentTime = Math.floor(new Date().getTime());
    const isSafari = navigator.userAgent.indexOf("Safari") > -1 && navigator.userAgent.indexOf("Chrome") < 0;
    let winRef: Window | null = window;
    if (isSafari) {
      if (ScheduleViewInfo.start_at! * 1000 - currentTime > 15 * 60 * 1000) {
        changeModalDate({
          title: "",
          text: d("You can only start a class 15 minutes before the start time.").t("schedule_msg_start_minutes"),
          openStatus: true,
          enableCustomization: false,
          buttons: [
            {
              label: d("OK").t("schedule_button_ok"),
              event: () => {
                changeModalDate({
                  enableCustomization: true,
                  customizeTemplate: (
                    <CustomizeTempalte
                      handleDelete={() => {
                        handleDelete(ScheduleViewInfo);
                      }}
                      handleClose={() => {
                        changeModalDate({ openStatus: false, enableCustomization: false });
                      }}
                      scheduleInfo={scheduleInfo}
                      toLive={toLive}
                      changeModalDate={changeModalDate}
                      checkLessonPlan={checkLessonPlan}
                      handleChangeHidden={handleChangeHidden}
                      isHidden={isHidden}
                      refreshView={refreshView}
                      ScheduleViewInfo={ScheduleViewInfo}
                      privilegedMembers={privilegedMembers}
                    />
                  ),
                  openStatus: true,
                  handleClose: () => {
                    changeModalDate({ openStatus: false });
                  },
                  showScheduleInfo: true,
                });
              },
            },
          ],
          handleClose: () => {
            changeModalDate({ openStatus: false, enableCustomization: false });
          },
        });
        return;
      }
      winRef = window.open("", "_blank");
    }
    if (permissionShowLive && ScheduleViewInfo.class_type_label?.id! === "Homework") {
      let resultInfo: any;
      resultInfo = await dispatch(getScheduleLiveToken({ schedule_id: scheduleInfo.id, live_token_type: "live", metaLoading: true }));
      handleClose();
      dispatch(scheduleUpdateStatus({ schedule_id: scheduleInfo.id, status: { status: "Started" } }));
      if (isSafari) {
        resultInfo.payload.token ? winRef && (winRef.location = apiLivePath(resultInfo.payload.token)) : winRef?.close();
      } else {
        resultInfo.payload.token && window.open(apiLivePath(resultInfo.payload.token), "_blank");
      }
      return;
    }
    if (ScheduleViewInfo.start_at! * 1000 - currentTime > 15 * 60 * 1000) {
      changeModalDate({
        title: "",
        text: d("You can only start a class 15 minutes before the start time.").t("schedule_msg_start_minutes"),
        openStatus: true,
        enableCustomization: false,
        buttons: [
          {
            label: d("OK").t("schedule_button_ok"),
            event: () => {
              changeModalDate({
                enableCustomization: true,
                customizeTemplate: (
                  <CustomizeTempalte
                    handleDelete={() => {
                      handleDelete(ScheduleViewInfo);
                    }}
                    handleClose={() => {
                      changeModalDate({ openStatus: false, enableCustomization: false });
                    }}
                    scheduleInfo={scheduleInfo}
                    toLive={toLive}
                    changeModalDate={changeModalDate}
                    checkLessonPlan={checkLessonPlan}
                    handleChangeHidden={handleChangeHidden}
                    isHidden={isHidden}
                    refreshView={refreshView}
                    ScheduleViewInfo={ScheduleViewInfo}
                    privilegedMembers={privilegedMembers}
                  />
                ),
                openStatus: true,
                handleClose: () => {
                  changeModalDate({ openStatus: false });
                },
                showScheduleInfo: true,
              });
            },
          },
        ],
        handleClose: () => {
          changeModalDate({ openStatus: false, enableCustomization: false });
        },
      });
      return;
    }
    let resultInfo: any;
    resultInfo = await dispatch(getScheduleLiveToken({ schedule_id: scheduleInfo.id, live_token_type: "live", metaLoading: true }));
    handleClose();
    dispatch(scheduleUpdateStatus({ schedule_id: ScheduleViewInfo.id as string, status: { status: "Started" } }));
    if (isSafari) {
      resultInfo.payload.token ? winRef && (winRef.location = apiLivePath(resultInfo.payload.token)) : winRef?.close();
    } else {
      resultInfo.payload.token && window.open(apiLivePath(resultInfo.payload.token), "_blank");
    }
  };

  const deleteHandle = () => {
    if (ScheduleViewInfo.class_type_label?.id === "Homework" && ScheduleViewInfo.exist_assessment && !ScheduleViewInfo.is_home_fun) {
      changeModalDate({
        title: "",
        // text: "You cannot edit this event after the due date",
        text: d("This event cannot be deleted because some students already made progress for Study activities.").t(
          "schedule_msg_cannot_delete_study"
        ),
        openStatus: true,
        enableCustomization: false,
        buttons: [
          {
            label: d("OK").t("schedule_button_ok"),
            event: () => {
              changeModalDate({ openStatus: false, enableCustomization: false });
            },
          },
        ],
        handleClose: () => {
          changeModalDate({ openStatus: false, enableCustomization: false });
        },
      });
      return;
    }
    if (ScheduleViewInfo.exist_feedback) {
      changeModalDate({
        title: "",
        text: d("This event cannot be deleted because assignments have already been uploaded. Do you want to hide it instead?").t(
          "schedule_msg_hide"
        ),
        openStatus: true,
        enableCustomization: false,
        buttons: [
          {
            label: d("CANCEL").t("schedule_button_cancel"),
            event: () => {
              changeModalDate({
                openStatus: false,
              });
            },
          },
          {
            label: d("OK").t("schedule_button_ok"),
            event: () => {
              handleHide();
            },
          },
        ],
        handleClose: () => {
          changeModalDate({ openStatus: false, enableCustomization: false });
        },
      });
    } else {
      handleDelete(ScheduleViewInfo);
    }
  };

  const handleHide = async () => {
    await dispatch(
      scheduleShowOption({
        schedule_id: ScheduleViewInfo.id as string,
        show_option: { show_option: ScheduleViewInfo.is_hidden ? "visible" : "hidden" },
      })
    );
    handleChangeHidden(!ScheduleViewInfo.is_hidden);
    refreshView(
      ScheduleViewInfo.is_hidden
        ? d("This event is visible again.").t("schedule_msg_visible")
        : d("This event has been hidden").t("schedule_msg_hidden")
    );
    changeModalDate({
      openStatus: false,
    });
  };

  const multiStructure = (item?: EntityScheduleShortInfo[]) => {
    return item?.map((ite: EntityScheduleShortInfo, key: number) => {
      return `${ite.name}${key + 1 < item?.length ? "," : ` (${item.length})`} `;
    });
  };

  const disableDelete = () => {
    if (!ScheduleViewInfo.is_home_fun && ScheduleViewInfo.class_type_label?.id === "Homework") {
      return ScheduleViewInfo.complete_assessment;
    } else {
      return ScheduleViewInfo.status !== "NotStart";
    }
  };

  const showDelete = () => {
    return !ScheduleViewInfo.is_home_fun && ScheduleViewInfo.class_type_label?.id === "Homework"
      ? ScheduleViewInfo.status !== "Closed"
      : ScheduleViewInfo.status === "NotStart";
  };

  const reBytesStr = (str: string, len: number) => {
    let bytesNum = 0;
    let afterCutting = "";
    for (let i = 0, lens = str.length; i < lens; i++) {
      bytesNum += str.charCodeAt(i) > 255 ? 2 : 1;
      if (bytesNum > len) break;
      afterCutting = str.substring(0, i + 1);
    }
    return bytesNum > len ? `${afterCutting} ....` : afterCutting;
  };

  const textEllipsis = (characterCount: number, value?: string) => {
    return value ? reBytesStr(value, characterCount) : "";
  };

  const { breakpoints } = useTheme();
  const mobile = useMediaQuery(breakpoints.down(600));

  return mobile ? (
    <CustomizeTempalteMb
      handleEditSchedule={handleEditSchedule}
      handleHide={handleHide}
      disableDelete={disableDelete}
      deleteHandle={deleteHandle}
      showDelete={showDelete}
      ScheduleViewInfo={ScheduleViewInfo}
      changeModalDate={changeModalDate}
      checkLessonPlan={checkLessonPlan}
      handleChangeHidden={handleChangeHidden}
      handleClose={handleClose}
      handleDelete={handleDelete}
      isHidden={isHidden}
      privilegedMembers={privilegedMembers}
      refreshView={refreshView}
      scheduleInfo={scheduleInfo}
      textEllipsis={textEllipsis}
      multiStructure={multiStructure}
      timestampToTime={timestampToTime}
      handleGoLive={handleGoLive}
      toLive={toLive}
    />
  ) : (
    <Box className={classes.previewContainer}>
      <div className={classes.customizeTitleBox}>
        <Tooltip title={ScheduleViewInfo.title as string} placement="top-start">
          <span>{ScheduleViewInfo.title}</span>
        </Tooltip>
        <div>
          {ScheduleViewInfo.exist_feedback && ScheduleViewInfo.is_hidden && !privilegedMembers("Student") && (
            <VisibilityOff style={{ color: "#000000" }} onClick={handleHide} className={classes.lastIcon} />
          )}
          {!ScheduleViewInfo.is_hidden && disableDelete() && ScheduleViewInfo.review_status !== "success" && (
            <DeleteOutlined className={classes.disableLastIcon} />
          )}
          {!ScheduleViewInfo.is_hidden && showDelete() && ScheduleViewInfo.review_status !== "success" && (
            <Permission
              value={PermissionType.delete_event_540}
              render={(value) =>
                value && (
                  <DeleteOutlined
                    className={classes.lastIcon}
                    onClick={() => {
                      deleteHandle();
                    }}
                  />
                )
              }
            />
          )}
          {!ScheduleViewInfo.is_review && (
            <EditOutlined className={classes.firstIcon} onClick={() => handleEditSchedule(ScheduleViewInfo)} />
          )}
        </div>
      </div>
      {(!ScheduleViewInfo.lesson_plan || !ScheduleViewInfo.lesson_plan?.is_auth) &&
        ScheduleViewInfo.class_type_label?.id !== "Task" &&
        !ScheduleViewInfo.is_home_fun &&
        !ScheduleViewInfo.is_review && (
          <p className={classes.checkPlan}>
            {d("Oops! The lesson plan included for this lesson has already been deleted!").t("schedule_msg_recall_lesson_plan")}
          </p>
        )}
      {ScheduleViewInfo.review_status === "failed" && (
        <p className={classes.checkPlan}>
          {d("System failed to generate a review session on {value}. Please try again.").t("schedule_review_popup_fail_notice", {
            value: timestampToTime(ScheduleViewInfo.due_at as number, true),
          })}
        </p>
      )}
      {ScheduleViewInfo.review_status === "pending" && (
        <p className={classes.checkPlan} style={{ color: "#666666" }}>
          {d("System is generating adaptive learning lesson plan for each student.").t("schedule_review_popup_pending_notice")}
        </p>
      )}
      <div className={classes.customizeContentBox}>
        {!ScheduleViewInfo.is_review && (
          <p className={classes.contentRow}>
            <span className={classes.row}>{d("Description").t("assess_label_description")}</span>
            <span className={classes.row2}>{!ScheduleViewInfo.description ? "N/A" : ScheduleViewInfo.description}</span>
          </p>
        )}
        <p className={classes.contentRow}>
          <span className={classes.row}>{d("Class Type").t("schedule_detail_class_type")}</span>
          <span className={classes.row2}>
            {ScheduleViewInfo.is_review
              ? d("Review").t("schedule_lable_class_type_review")
              : t(ScheduleViewInfo.class_type?.name as classTypeLabel)}
          </span>
        </p>
        {ScheduleViewInfo.is_review && (
          <>
            <p className={classes.contentRow}>
              <span className={classes.row}>{d("Due Date").t("schedule_detail_due_date")}</span>
              <span className={classes.row2}>{timestampToTime(ScheduleViewInfo.due_at as number, true)}</span>
            </p>
            <p className={classes.contentRow}>
              <span className={classes.row}>{d("Date Range").t("schedule_review_popup_date_range")}</span>
              <span className={classes.row2}>
                {timestampToTime(ScheduleViewInfo.content_start_at as number, false, true)}~
                {timestampToTime(ScheduleViewInfo.content_end_at as number, false, true)}
              </span>
            </p>
          </>
        )}
        {!ScheduleViewInfo.is_review && (
          <>
            <p className={classes.contentRow}>
              <span className={classes.row}>{d("Room ID").t("schedule_popup_room_id")}</span>
              <span className={classes.row2}>{ScheduleViewInfo.room_id}</span>
            </p>
            {ScheduleViewInfo.class_type_label?.id !== "Homework" && (
              <>
                <p className={classes.contentRow}>
                  <span className={classes.row}>{d("Start Time").t("schedule_detail_start_time")}</span>
                  <span className={classes.row2}>{timestampToTime(ScheduleViewInfo.start_at as number, false)}</span>
                </p>
                <p className={classes.contentRow}>
                  <span className={classes.row}>{d("End Time").t("schedule_detail_end_time")}</span>
                  <span className={classes.row2}>{timestampToTime(ScheduleViewInfo.end_at as number, false)}</span>
                </p>
              </>
            )}
          </>
        )}
        <p className={classes.contentRow}>
          <span className={classes.row}>{d("Class Name").t("assess_detail_class_name")}</span>
          <span className={classes.row2}>{ScheduleViewInfo.class ? ScheduleViewInfo.class?.name : "N/A"}</span>
        </p>
        <p className={classes.contentRow}>
          <span className={classes.row}>{d("Teacher").t("schedule_detail_teacher")}</span>
          <span className={classes.row2}>{multiStructure(ScheduleViewInfo.teachers)}</span>
        </p>
        {!privilegedMembers("Student") &&
          !(
            ScheduleViewInfo.review_status === "success" &&
            ScheduleViewInfo.personalized_review_students?.length !== ScheduleViewInfo.students?.length
          ) && (
            <p className={classes.contentRow}>
              <span className={classes.row}>{d("Student").t("assess_detail_student")}</span>
              <span className={classes.row2}>{multiStructure(ScheduleViewInfo.students)}</span>
            </p>
          )}
        {!ScheduleViewInfo.is_review && (
          <>
            {ScheduleViewInfo.lesson_plan && (
              <p className={classes.contentRow}>
                <span className={classes.row}>{d("Lesson Plan").t("schedule_detail_lesson_plan")}</span>
                <span className={classes.lessonText}>
                  <div style={{ fontWeight: 500 }}>{ScheduleViewInfo.lesson_plan?.name}</div>
                  {ScheduleViewInfo.lesson_plan?.materials?.map((material: EntityScheduleShortInfo) => {
                    return <div style={{ marginTop: "10px" }}>{material.name}</div>;
                  })}
                </span>
              </p>
            )}
            <p className={classes.contentRow}>
              <span className={classes.row}>{d("Attachment").t("schedule_detail_attachment")}</span>
              <span className={classes.row2} style={{ display: "flex" }}>
                {ScheduleViewInfo.attachment?.id ? (
                  <>
                    {ScheduleViewInfo.attachment?.name}{" "}
                    <GetAppIcon
                      onClick={() => {
                        window.open(`${apiResourcePathById(ScheduleViewInfo.attachment?.id)}`, "_blank");
                      }}
                      style={{ color: "#0E78D5", cursor: "pointer", fontSize: "20px", marginLeft: "10px" }}
                    />
                  </>
                ) : (
                  "N/A"
                )}
              </span>
            </p>
          </>
        )}
        {ScheduleViewInfo.is_review && (
          <>
            {ScheduleViewInfo.review_status === "success" &&
              !privilegedMembers("Student") &&
              ScheduleViewInfo.personalized_review_students?.length !== ScheduleViewInfo.students?.length && (
                <>
                  <p className={classes.contentRow}>
                    <span className={classes.row}>
                      {d("Students with Personalized Lesson Plans").t("schedule_review_popup_student_list")}
                    </span>
                    <span className={classes.row2}>{multiStructure(ScheduleViewInfo.personalized_review_students)}</span>
                  </p>
                  <p className={classes.contentRow}>
                    <span className={classes.row}>
                      {d("Students who receive a random Lesson Plan due to no enough content to review").t(
                        "schedule_review_popup_random_student_list"
                      )}
                    </span>
                    <span className={classes.row2}>{multiStructure(ScheduleViewInfo.random_review_students)}</span>
                  </p>
                </>
              )}
            <p className={classes.contentRow}>
              <span className={classes.row}>{d("Program").t("schedule_detail_program")}</span>
              <span className={classes.row2}>{ScheduleViewInfo.program?.name}</span>
            </p>
            <p className={classes.contentRow}>
              <span className={classes.row}>{d("Subject").t("assess_label_subject")}</span>
              <span className={classes.row2}>{multiStructure(ScheduleViewInfo.subjects)}</span>
            </p>
          </>
        )}
      </div>
      {ScheduleViewInfo.class_type_label?.id !== "Task" && !ScheduleViewInfo.is_home_fun && (
        <div className={classes.buttonPart}>
          <ScheduleButton
            scheduleInfo={ScheduleViewInfo}
            handleClose={handleClose}
            templateType="schedulePopup"
            handleGoLive={handleGoLive}
          />
        </div>
      )}
    </Box>
  );
}
