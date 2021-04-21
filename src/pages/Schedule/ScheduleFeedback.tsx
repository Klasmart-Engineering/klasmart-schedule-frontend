import { Box, Button, LinearProgress, TextField, Typography } from "@material-ui/core";
import { createStyles, makeStyles } from "@material-ui/core/styles";
import { AccessTime, CloudUploadOutlined, InfoOutlined } from "@material-ui/icons";
import CancelIcon from "@material-ui/icons/Cancel";
import { PayloadAction } from "@reduxjs/toolkit";
import { BatchItem } from "@rpldy/shared";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router";
import { EntityFeedbackAssignmentView, EntityScheduleAccessibleUserView, EntityScheduleFeedbackAddInput } from "../../api/api.auto";
import { apiResourcePathById } from "../../api/extra";
import { FileLikeWithId, FileSizeUnit, MultipleUploader, MultipleUploaderErrorType } from "../../components/MultipleUploader";
import { d } from "../../locale/LocaleManager";
import { RootState } from "../../reducers";
import { AsyncTrunkReturned } from "../../reducers/content";
import { actError, actSuccess, actWarning } from "../../reducers/notify";
import { getScheduleNewetFeedback, saveScheduleFeedback } from "../../reducers/schedule";
import { HtmlTooltip } from "./ScheduleAttachment";

const useStyles = makeStyles(({ shadows }) =>
  createStyles({
    fieldBox: {
      position: "relative",
      paddingTop: "20px",
    },
    fieldset: {
      marginTop: 20,
      width: "100%",
    },
    linkTop: {
      width: "96%",
      height: "1px",
      borderTop: "solid #EEEEEE 1px",
      margin: "0 auto",
    },
    feedBackTitle: {
      fontSize: "1.3rem",
      fontWeight: "bold",
      display: "block",
      marginTop: "15px",
    },
    participantSaveBox: {
      width: "100%",
      minHeight: "120px",
      border: "1px solid rgba(0, 0, 0, 0.23)",
      marginTop: "20px",
      borderRadius: "5px",
      padding: "0px 0px 20px 0px",
      position: "relative",
    },
    iconField: {
      cursor: "pointer",
    },
    pathBox: {
      wordBreak: "break-all",
      padding: "8px 8px 8px 8px",
      display: "flex",
      "& a": {
        color: "#B6B6B6",
        marginRight: "10px",
        textDecoration: "none",
      },
    },
    submitTemplate: {
      width: "400px",
      "& p": {
        color: "#ADADAD",
        fontSize: "15px",
        fontWeight: "bold",
      },
    },
    fileItem: {
      display: "flex",
      alignItems: "center",
    },
    iconLeft: {
      marginLeft: 10,
    },
    linearProcess: {
      width: 32,
      margin: "0 10px",
    },
  })
);

interface FileDataProps {
  handleFileData: (name: string, type: string) => void;
  fileName?: Pick<FileLikeWithId, "id" | "name">[] | undefined;
  batch?: BatchItem[];
  isUploading?: boolean;
}

function FileDataTemplate(props: FileDataProps) {
  const { fileName, handleFileData, batch, isUploading } = props;
  const css = useStyles();
  const sourceDownload = (attachmentId?: string) => {
    return apiResourcePathById(attachmentId);
  };
  const textEllipsis = (value: string | undefined) => {
    return value && value.length > 30 ? `${value.substring(0, 30)} ....` : value;
  };
  return (
    <Box className={css.participantSaveBox}>
      {fileName?.map((item) => (
        <div className={css.pathBox}>
          <a href={sourceDownload(item.id)} target="_blank" rel="noopener noreferrer">
            {textEllipsis(item.name)}
          </a>{" "}
          <CancelIcon
            style={{ color: "#666666" }}
            onClick={() => {
              handleFileData(item.id!, "delete");
            }}
            className={css.iconField}
          />
        </div>
      ))}
      {isUploading &&
        batch?.map((item) => (
          <div key={item.id} className={css.fileItem}>
            <Typography component="div" noWrap variant="body1">
              <div className={css.pathBox}>
                <span>{textEllipsis(item.file.name)}</span>
              </div>
            </Typography>
            {item.completed === 100 ? (
              ""
            ) : item.completed === 0 ? (
              <AccessTime className={css.iconLeft} />
            ) : (
              <div className={css.fileItem}>
                <LinearProgress className={css.linearProcess} variant="determinate" value={item.completed} />
                <Typography variant="caption" component="span" color="textSecondary">
                  {`${Math.round(item.completed || 0)}%`}
                </Typography>
              </div>
            )}
          </div>
        ))}
    </Box>
  );
}

interface SubmitProps {
  due_date?: number;
  className?: EntityScheduleAccessibleUserView;
  teacher?: EntityScheduleAccessibleUserView[];
  handleClose: () => void;
  feedBackSubmit: () => void;
  due_time?: string;
}
function SubmitTemplate(props: SubmitProps) {
  const { teacher, className, handleClose, feedBackSubmit, due_time } = props;
  const css = useStyles();
  return (
    <Box className={css.submitTemplate}>
      <p>{d("Your assignment will be submitted for assessment.").t("schedule_msg_submit")}</p>
      <p>
        {d("Class").t("report_label_class")}: {className?.name ?? d("No Class").t("schedule_assignment_no_class")}
      </p>
      <p>
        {d("Teacher").t("assess_column_teacher")}:{" "}
        {teacher?.map((item: EntityScheduleAccessibleUserView) => (
          <span>{item?.name} </span>
        ))}
      </p>
      <p>
        {d("Due Date").t("schedule_detail_due_date")}: {due_time}
      </p>
      <Box style={{ textAlign: "right" }}>
        <Button color="primary" onClick={handleClose}>
          {d("CANCEL").t("general_button_CANCEL")}
        </Button>
        <Button color="primary" onClick={feedBackSubmit}>
          {d("OK").t("general_button_OK")}
        </Button>
      </Box>
    </Box>
  );
}

function FeedbackTemplate(props: FeedbackProps) {
  const css = useStyles();
  const { schedule_id, changeModalDate, teacher, className, due_date, includeTable, due_time, is_hidden } = props;
  const [comment, seComment] = React.useState("");
  const [fileName, setFileName] = React.useState<Pick<FileLikeWithId, "id" | "name">[] | undefined>([]);
  const dispatch = useDispatch();
  const history = useHistory();
  const handleOnChange = (value: Pick<FileLikeWithId, "id" | "name">[] | undefined): void => {
    setFileName(value);
  };
  const { feedbackData } = useSelector<RootState, RootState["schedule"]>((state) => state.schedule);

  React.useEffect(() => {
    if (feedbackData.schedule_id) {
      seComment(feedbackData.comment as string);
      const feedbackDataAssembly = feedbackData?.assignments?.map((item: EntityFeedbackAssignmentView) => {
        return { name: item.attachment_name, id: item.attachment_id };
      });
      setFileName(feedbackDataAssembly);
    } else {
      seComment("");
      setFileName([]);
    }
  }, [feedbackData]);

  React.useEffect(() => {
    if (schedule_id) dispatch(getScheduleNewetFeedback(schedule_id));
  }, [dispatch, schedule_id]);

  const getTipsText = () => {
    return (
      <div style={{ paddingBottom: "8px" }}>
        <div style={{ color: "#000000", fontWeight: "bold" }}>
          <p>
            {d("Max").t("schedule_detail_max")}: 100MB/{d("each").t("schedule_attachment_size_each")}
          </p>
          <span>{d("Support files in").t("schedule_detail_support_files_in")}:</span>
        </div>
        <div style={{ color: "#666666" }}>
          <span>{d("Video").t("schedule_detail_video")} (avi, mov,mp4)</span>
          <br />
          <span>{d("Audio").t("schedule_detail_audio")} (mp3, wav)</span>
          <br />
          <span>{d("Image").t("schedule_detail_image")} (jpg, jpeg, png, gif, bmp)</span>
          <br />
          <span>{d("Document").t("schedule_detail_document")} (doc, docx, ppt, pptx, xls, xlsx, pdf)</span>
        </div>
      </div>
    );
  };

  const NoticeTemplate = () => {
    if (is_hidden) {
      dispatch(actWarning(d("This event has been hidden").t("schedule_msg_hidden")));
      return;
    }
    if (!feedbackData.is_allow_submit) {
      dispatch(actWarning(d("You cannot submit again because your assignment has already been assessed.").t("schedule_msg_cannot_submit")));
      return;
    }
    if (fileName!.length < 1) {
      dispatch(actWarning(d("You can upload only one attachment. ").t("schedule_msg_one_attachment")));
      return;
    }
    changeModalDate({
      openStatus: true,
      enableCustomization: true,
      customizeTemplate: (
        <SubmitTemplate
          handleClose={() => {
            changeModalDate({
              openStatus: false,
            });
          }}
          feedBackSubmit={feedBackSubmit}
          className={className}
          due_time={due_time}
          teacher={teacher}
        />
      ),
    });
  };

  const feedBackSubmit = async () => {
    const assignments = fileName?.map((item: Pick<FileLikeWithId, "id" | "name">, index: number) => {
      return { attachment_name: item.name, number: index, attachment_id: item.id };
    });
    const data: EntityScheduleFeedbackAddInput = {
      assignments: assignments,
      comment: comment,
      schedule_id: schedule_id,
    };
    let resultInfo: any;
    resultInfo = ((await dispatch(saveScheduleFeedback(data))) as unknown) as PayloadAction<
      AsyncTrunkReturned<typeof saveScheduleFeedback>
    >;
    if (resultInfo.payload) {
      dispatch(actSuccess(d("Saved Successfully.").t("assess_msg_save_successfully")));
      history.push(`/schedule/calendar/rightside/${includeTable ? "scheduleTable" : "scheduleList"}/model/preview`);
      changeModalDate({
        openStatus: false,
      });
    }
  };

  const handleFileData = (id: string, type: string) => {
    if (type === "delete") {
      fileName?.map((item: Pick<FileLikeWithId, "id" | "name">, index: number) => {
        if (item.id === id) fileName.splice(index, 1);
      });
      setFileName([...fileName!]);
    }
  };

  const IsExpired = (due_date?: number): boolean => {
    return due_date ? Date.now() > (due_date as number) * 1000 : false;
  };

  return (
    <Box className={css.fieldBox}>
      <div className={css.linkTop}></div>
      <span className={css.feedBackTitle}>{d("Student Feedback").t("schedule_student_feedback")}</span>
      <TextField
        className={css.fieldset}
        value={comment}
        onChange={(e) => {
          if (e.target.value.length <= 100) seComment(e.target.value as string);
        }}
        label={d("Comment").t("schedule_detail_comment")}
      ></TextField>
      <MultipleUploader
        partition="schedule_attachment"
        accept=".avi,.mov,.mp4,.mp3,.wav,.jpg,.jpeg,.png,.gif,.bmp,.doc,.docx,.ppt,.pptx,.xls,.xlsx,.pdf"
        {...props}
        maxAmount={3}
        onChange={(value) => handleOnChange(value)}
        value={fileName}
        maxSize={100 * FileSizeUnit.M}
        onError={(error) =>
          Promise.reject(
            dispatch(
              actError(
                error.type === MultipleUploaderErrorType.MaxAmountError
                  ? d("You can upload no more than three attachments. ").t("schedule_msg_three_attachment")
                  : d("The attachment you uploaded does not meet the requirement.").t("schedule_msg_attachment")
              )
            )
          )
        }
        render={({ btnRef, value, isUploading, batch }) => (
          <>
            {(value!.length > 0 || isUploading) && (
              <FileDataTemplate fileName={fileName} batch={batch?.items} isUploading={isUploading} handleFileData={handleFileData} />
            )}
            {!isUploading && value!.length < 1 && (
              <Box style={{ position: "relative" }}>
                <TextField
                  disabled
                  className={css.fieldset}
                  label={d("Upload Assignment").t("schedule_upload_assignment")}
                  required
                ></TextField>
                <HtmlTooltip title={getTipsText()}>
                  <InfoOutlined className={css.iconField} style={{ left: "168px", position: "absolute", top: "36px" }} />
                </HtmlTooltip>
                <span style={{ color: "#999999", fontSize: "12px" }}>
                  {d("You can upload no more than three attachments. ").t("schedule_msg_three_attachment")}
                </span>
              </Box>
            )}
            <CloudUploadOutlined
              className={css.iconField}
              style={{ right: "10px", position: "absolute", bottom: value!.length > 0 ? "66px" : "90px" }}
              ref={btnRef as any}
            />
          </>
        )}
      />
      <Box className={css.fieldset}>
        <Button
          variant="outlined"
          color="primary"
          style={{ width: "45%", marginRight: "10%" }}
          onClick={() => {
            setFileName([]);
          }}
          disabled={IsExpired(due_date)}
        >
          {d("Cancel").t("assess_button_cancel")}
        </Button>
        <Button variant="contained" color="primary" style={{ width: "45%" }} onClick={NoticeTemplate} disabled={IsExpired(due_date)}>
          {d("Submit").t("schedule_button_submit")}
        </Button>
      </Box>
    </Box>
  );
}

interface FeedbackProps {
  schedule_id?: string;
  changeModalDate: (data: object) => void;
  due_date?: number;
  className?: EntityScheduleAccessibleUserView;
  teacher?: EntityScheduleAccessibleUserView[];
  includeTable?: boolean;
  due_time?: string;
  is_hidden?: boolean;
}

export default function ScheduleFeedback(props: FeedbackProps) {
  const { schedule_id, changeModalDate, due_date, className, teacher, includeTable, due_time, is_hidden } = props;
  return (
    <FeedbackTemplate
      schedule_id={schedule_id}
      changeModalDate={changeModalDate}
      className={className}
      due_date={due_date}
      due_time={due_time}
      teacher={teacher}
      includeTable={includeTable}
      is_hidden={is_hidden}
    />
  );
}
