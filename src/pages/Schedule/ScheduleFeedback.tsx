import { Box, Button, LinearProgress, TextField, Typography } from "@material-ui/core";
import { createStyles, makeStyles } from "@material-ui/core/styles";
import React from "react";
import { d } from "../../locale/LocaleManager";
import { AccessTime, CloudUploadOutlined, HighlightOff, InfoOutlined } from "@material-ui/icons";
import { HtmlTooltip } from "./ScheduleAttachment";
import { getScheduleNewetFeedback, saveScheduleFeedback } from "../../reducers/schedule";
import { EntityFeedbackAssignmentView, EntityScheduleAccessibleUserView, EntityScheduleFeedbackAddInput } from "../../api/api.auto";
import { useDispatch, useSelector } from "react-redux";
import { FileLikeWithId, FileSizeUnit, MultipleUploader } from "../../components/MultipleUploader";
import { actSuccess, actWarning } from "../../reducers/notify";
import { BatchItem } from "@rpldy/shared";
import { RootState } from "../../reducers";
import { apiResourcePathById } from "../../api/extra";

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
      height: "120px",
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
  status: "finish" | "progress";
  batch?: BatchItem[];
}

function FileDataTemplate(props: FileDataProps) {
  const { fileName, handleFileData, status, batch } = props;
  const css = useStyles();
  const sourceDownload = (attachmentId?: string) => {
    return apiResourcePathById(attachmentId);
  };
  return (
    <Box className={css.participantSaveBox}>
      {status === "finish" &&
        fileName?.map((item) => (
          <div className={css.pathBox}>
            <a href={sourceDownload(item.id)} target="_blank" rel="noopener noreferrer">
              {item.name}
            </a>{" "}
            <HighlightOff
              onClick={() => {
                handleFileData(item.id!, "delete");
              }}
              className={css.iconField}
            />
          </div>
        ))}
      {status === "progress" &&
        batch?.map((item) => (
          <div key={item.id} className={css.fileItem}>
            <Typography component="div" noWrap variant="body1">
              <div className={css.pathBox}>
                <span>{item.file.name}</span>
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
  className: string;
  teacher?: EntityScheduleAccessibleUserView[];
  handleClose: () => void;
  feedBackSubmit: () => void;
}
function SubmitTemplate(props: SubmitProps) {
  const { due_date, teacher, className, handleClose, feedBackSubmit } = props;
  const css = useStyles();
  return (
    <Box className={css.submitTemplate}>
      <p>{d("Your assignment will be submitted for assessment.").t("schedule_msg_submit")}</p>
      <p>
        {d("Class").t("report_label_class")}: {className}
      </p>
      <p>
        {d("Teacher").t("assess_column_teacher")}:{" "}
        {teacher?.map((item: EntityScheduleAccessibleUserView) => (
          <span>{item?.name} </span>
        ))}
      </p>
      <p>
        {d("Due Date").t("schedule_detail_due_date")}: {due_date}
      </p>
      <Box style={{ textAlign: "right" }}>
        <Button color="primary" onClick={handleClose}>
          {d("Cancel").t("library_label_cancel")}
        </Button>
        <Button color="primary" onClick={feedBackSubmit}>
          {d("Ok").t("assess_button_ok")}
        </Button>
      </Box>
    </Box>
  );
}

function FeedbackTemplate(props: FeedbackProps) {
  const css = useStyles();
  const { schedule_id, changeModalDate, teacher, className, due_date } = props;
  const [comment, seComment] = React.useState("");
  const [fileName, setFileName] = React.useState<Pick<FileLikeWithId, "id" | "name">[] | undefined>([]);
  const dispatch = useDispatch();
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
    }
  }, [feedbackData]);

  React.useEffect(() => {
    if (schedule_id) dispatch(getScheduleNewetFeedback(schedule_id));
  }, [dispatch, schedule_id]);

  const getTipsText = () => {
    return (
      <div style={{ paddingBottom: "8px" }}>
        <div style={{ color: "#000000", fontWeight: "bold" }}>
          <p>{d("Max").t("schedule_detail_max")}: 100MB</p>
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
    if (feedbackData.is_allow_submit) {
      dispatch(actWarning(d("You cannot submit again because your assignment has already been assessed.").t("schedule_msg_cannot_submit")));
      return;
    }
    if (fileName!.length < 1) {
      dispatch(actWarning("请填写附件上传"));
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
          due_date={due_date}
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
    await dispatch(saveScheduleFeedback(data));
    dispatch(actSuccess(d("Save Successfully.").t("assess_msg_save_successfully")));
    changeModalDate({
      openStatus: false,
    });
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
    return Date.now() > (due_date as number) * 1000;
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
        accept="*"
        {...props}
        maxAmount={3}
        onChange={(value) => handleOnChange(value)}
        value={fileName}
        maxSize={100 * FileSizeUnit.M}
        onError={(error) =>
          Promise.reject(dispatch(actWarning(d("The attachment you uploaded does not meet the requirement.").t("schedule_msg_attachment"))))
        }
        render={({ btnRef, value, isUploading, batch }) => (
          <>
            {value!.length > 0 && <FileDataTemplate fileName={fileName} handleFileData={handleFileData} status="finish" />}
            {isUploading && <FileDataTemplate batch={batch?.items} handleFileData={handleFileData} status="progress" />}
            {!batch?.items && value!.length < 1 && (
              <Box style={{ position: "relative" }}>
                <TextField
                  disabled
                  className={css.fieldset}
                  label={d("Upload Assignment").t("schedule_upload_assignment")}
                  required
                ></TextField>
                <HtmlTooltip title={getTipsText()}>
                  <InfoOutlined className={css.iconField} style={{ left: "110px", position: "absolute", top: "36px" }} />
                </HtmlTooltip>
                <span style={{ color: "#999999", fontSize: "12px" }}>
                  {d("You can upload no more than three attachments. ").t("schedule_msg_three_attachment")}
                </span>
              </Box>
            )}
            <CloudUploadOutlined
              className={css.iconField}
              style={{ right: "10px", position: "absolute", bottom: "90px" }}
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
  className: string;
  teacher?: EntityScheduleAccessibleUserView[];
}

export default function ScheduleFeedback(props: FeedbackProps) {
  const { schedule_id, changeModalDate, due_date, className, teacher } = props;
  return (
    <FeedbackTemplate
      schedule_id={schedule_id}
      changeModalDate={changeModalDate}
      className={className}
      due_date={due_date}
      teacher={teacher}
    />
  );
}
