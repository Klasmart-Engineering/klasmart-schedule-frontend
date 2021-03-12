import { Box, Button, TextField } from "@material-ui/core";
import { createStyles, makeStyles } from "@material-ui/core/styles";
import React from "react";
import { d } from "../../locale/LocaleManager";
import { CloudUploadOutlined, HighlightOff, InfoOutlined } from "@material-ui/icons";
import { HtmlTooltip } from "./ScheduleAttachment";
import { SingleUploader } from "../../components/SingleUploader";
import { saveScheduleFeedback } from "../../reducers/schedule";
import { EntityScheduleAccessibleUserView, EntityScheduleFeedbackAddInput } from "../../api/api.auto";
import { useDispatch } from "react-redux";

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
      "& span": {
        color: "#B6B6B6",
        marginRight: "10px",
      },
    },
    submitTemplate: {
      width: "400px",
      "& p": {
        color: "#ADADAD",
        fontSize: "15px",
      },
    },
  })
);

interface FileDataProps {
  name: string;
  btnRef: any;
  handleFileData: (name: string, type: string) => void;
  fileName: string[];
}

function FileDataTemplate(props: FileDataProps) {
  const { fileName, btnRef, name, handleFileData } = props;
  const css = useStyles();
  React.useEffect(() => {
    if (name) handleFileData(name, "insert");
  }, [name, handleFileData]);
  return fileName.length > 0 ? (
    <Box className={css.participantSaveBox}>
      {fileName.map((item: string) => (
        <div className={css.pathBox}>
          <span>{item}</span>{" "}
          <HighlightOff
            onClick={() => {
              handleFileData(item, "delete");
            }}
            className={css.iconField}
          />
        </div>
      ))}
      <CloudUploadOutlined className={css.iconField} style={{ right: "10px", position: "absolute", bottom: "8px" }} ref={btnRef as any} />
    </Box>
  ) : (
    <></>
  );
}

interface SubmitProps {
  due_date: string;
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
          CANCEL
        </Button>
        <Button color="primary" onClick={feedBackSubmit}>
          OK
        </Button>
      </Box>
    </Box>
  );
}

function FeedbackTemplate(props: FeedbackProps) {
  const css = useStyles();
  const { schedule_id, changeModalDate, teacher, className, due_date } = props;
  const [comment, seComment] = React.useState("");
  const [fileName, setFileName] = React.useState<string[]>([]);
  const dispatch = useDispatch();
  const handleOnChange = (value: string | undefined): void => {
    const fileData = [];
    fileData.push(value);
    console.log(fileData);
    /*    fileName.push(value as string)
    setFileName(fileName)*/
  };

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

  const feedBackSubmit = () => {
    const data: EntityScheduleFeedbackAddInput = {
      assignments: [
        {
          name: "list.pdf",
          number: 1,
          url:
            "https://cdk-kl2-test-kl2-s3resources.s3-accelerate.amazonaws.com/schedule_attachment/6049cdee1a2bf67c50bf18bc.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=ASIAXGKUAYT2IVSWPCOR%2F20210311%2Fap-northeast-2%2Fs3%2Faws4_request&X-Amz-Date=20210311T075942Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEGAaDmFwLW5vcnRoZWFzdC0yIkcwRQIhALvjdvQDcK9hEXyFGLPk6EDYxAfmlOt%2BH40NVDYXzByZAiA24XYC9SdFmhDB2zVKr9huaM35zGyNOZfV6DrPJ%2BGq%2ByrVAQiJ%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F8BEAAaDDQ5NDYzNDMyMTE0MCIMlQ3Pa4pHN0lIWytaKqkBi%2BX3TYQC0cOa04oyTV892OpW%2F1fRY8V480eiPhG1PoTCoJsAZUXdHfcLqLpbgvsR8t8T%2FJBwgDGoVyUg3LLNuV9jxpv4OJIQ%2BqvB5XL4AvbfXAHxEN8DnlxcV5dt6esWOSeINKc7pXek%2B42JZR6%2FhF2SWHfhx2ZKEb7dhKj6Cfp3dgzIk202ENQfIaa5mQpSXxFkeWLNWKjWBgt8rFQ94c0Njhfi4DITazDakqeCBjrgASfJ5aZadUSwZ0ky2qAL4dNyG1iQc25K4gM8tk8hB0AI4laCqcY0ICjoLKNwwTqvqFtuoGZx%2FBvgVPWwypSjP5AHvVVrmi77xbW7%2B1O%2F6glGN8BuPMwSH8bYeoAn1GarVkDJ9xH9yMynXoYnhuhq3mi7bpLGLbRbdq%2FJkolKd7M%2F0Xk3C0Cwy7uuJmpqGiMTkNX%2BKrn%2Fp69QEV8WyOgIbNfWROYA9Vqsaj8NQCFb7yXaDPL1mX6pUjmruCbUB%2FL02Sp%2F29YF%2BqEn4k3JhU4HZ1Qel9HOtYBbLqYtRTHYTBzt&X-Amz-SignedHeaders=host&X-Amz-Signature=66b25ba5300bea7606e86385cf2f4d704b61850bf1a08709d5d40a9f4422071e",
        },
      ],
      comment: comment,
      schedule_id: schedule_id,
    };
    dispatch(saveScheduleFeedback(data));
    changeModalDate({
      openStatus: false,
    });
  };

  const handleFileData = (name: string, type: string) => {
    if (type === "delete") {
      fileName.splice(fileName.indexOf(name), 1);
      setFileName([...fileName]);
    } else {
      setFileName([...fileName, name]);
    }
  };

  return (
    <Box className={css.fieldBox}>
      <div className={css.linkTop}></div>
      <span className={css.feedBackTitle}>{d("Student Feedback").t("schedule_student_feedback")}</span>
      <TextField
        className={css.fieldset}
        value={comment}
        onChange={(e) => seComment(e.target.value as string)}
        label={d("Comment").t("schedule_detail_comment")}
      ></TextField>
      <SingleUploader
        partition="schedule_attachment"
        onChange={handleOnChange}
        render={({ uploady, item, btnRef, value, isUploading }) => (
          <>
            <FileDataTemplate btnRef={btnRef} name={item?.file.name} fileName={fileName} handleFileData={handleFileData} />
            {!fileName.length && (
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
                <CloudUploadOutlined
                  className={css.iconField}
                  style={{ right: "10px", position: "absolute", bottom: "38px" }}
                  ref={btnRef as any}
                />
                <span style={{ color: "#999999", fontSize: "12px" }}>
                  {d("You can upload no more than three attachments. ").t("schedule_msg_three_attachment")}
                </span>
              </Box>
            )}
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
        >
          {d("Cancel").t("assess_button_cancel")}
        </Button>
        <Button variant="contained" color="primary" style={{ width: "45%" }} onClick={NoticeTemplate}>
          {d("Submit").t("schedule_button_submit")}
        </Button>
      </Box>
    </Box>
  );
}

interface FeedbackProps {
  schedule_id?: string;
  changeModalDate: (data: object) => void;
  due_date: string;
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
