import { apiResourcePathById } from "@api/extra";
import { audioClient } from "@api/index";
import { ApolloProvider } from "@apollo/client";
import { SketchChangeProps, UiSketch } from "@components/UISketch";
import {
  Button,
  createStyles,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  InputAdornment,
  makeStyles,
  TextField,
  useMediaQuery,
  useTheme
} from "@material-ui/core";
import { Close, ExitToAppOutlined, ImageOutlined, SaveOutlined, SentimentSatisfied, SentimentSatisfiedOutlined, SentimentVeryDissatisfiedOutlined, SentimentVerySatisfiedOutlined } from "@material-ui/icons";
import BorderColorIcon from "@material-ui/icons/BorderColor";
import { DetailAssessmentResultAssignment, DetailAssessmentResultFeedback } from "@pages/ListAssessment/types";
import React, { useMemo, useRef, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { d } from "../../locale/LocaleManager";
import AudioView from "./AudioView";
import { ImgSelect, ScoreInput } from "./HomefunView";
import { ResourceViewTypeValues, StudenmtViewItemResultProps } from "./type";
const useStyles = makeStyles((theme) =>
  createStyles({
    closeBtn: {
      position: "absolute",
      top: theme.spacing(1),
      right: theme.spacing(1),
    },
    title: {
      borderBottom: "1px solid #eeeeee",
    },
    detailView: {
      padding: "12px",
      lineHeight: "30px",
      maxHeight: "400px",
      minWidth: "400px",
      overflow: "auto",
      textAlign: "center",
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
    okBtn: {
      marginLeft: "40px !important",
    },
    titleBar: {
      fontWeight: 600,
      display: "flex",
      justifyContent: "space-between"
    }
  })
);

export const showAudioRecorder = (type?: string) => {
  const types = ["AudioRecorder", "SpeakTheWordsSet", "SpeakTheWords"];
  return types.indexOf(type as string) >= 0;
};
export interface ResourceViewProps {
  open: boolean;
  resourceType: ResourceViewTypeValues;
  answer?: string;
  comment?: string;
  studentId?: string;
  roomId?: string;
  h5pId?: string;
  userId?: string;
  h5pSubId?: string;
  score?: StudenmtViewItemResultProps["assess_score"];
  assignments?: DetailAssessmentResultFeedback["assignments"];
  hasSaved?: boolean;
  onClose: () => void;
  onChangeComment?: (studentId?: string, comment?: string) => void;
  onChangeScore?: (studentId?: string, score?: StudenmtViewItemResultProps["assess_score"]) => void;
  onOpenDrawFeedback?: (studentId?: string, assignment?: DetailAssessmentResultAssignment) => void;
}
export function ResourceView(props: ResourceViewProps) {
  const css = useStyles();
  const { resourceType, open, answer, comment, studentId, h5pId, roomId, userId, h5pSubId, score, assignments, 
    onChangeComment, onClose, onChangeScore, onOpenDrawFeedback } = props;
  const showClose = resourceType !== ResourceViewTypeValues.editScore && resourceType !== ResourceViewTypeValues.selectImg;
  const showActionBtn = resourceType === ResourceViewTypeValues.editComment || resourceType === ResourceViewTypeValues.editScore || resourceType === ResourceViewTypeValues.selectImg;
  const formMethods = useForm();
  const { control, getValues } = formMethods;
  const handleOk = () => {
    onClose();
    if(resourceType === ResourceViewTypeValues.editComment) {
      const comment = getValues()["comment"];
      onChangeComment && onChangeComment(studentId, comment);
    }
    if(resourceType === ResourceViewTypeValues.editScore) {
      const score = getValues()["assess_score"] as StudenmtViewItemResultProps["assess_score"];
      onChangeScore && onChangeScore(studentId, score);
    }
    if(resourceType === ResourceViewTypeValues.selectImg) {
      const selectedAssignmentId = getValues()["assignments"];
      const selectedAssignment = assignments?.find(item => item.attachment_id === selectedAssignmentId)
      onOpenDrawFeedback && onOpenDrawFeedback(studentId, selectedAssignment)
    }
  };
  return (
    <>
      <Dialog open={open} fullWidth maxWidth={"sm"}>
        <DialogTitle className={resourceType === ResourceViewTypeValues.editScore ? "" : css.title}>
          {(resourceType === ResourceViewTypeValues.essay || showAudioRecorder(resourceType)) && d("Detailed Answer").t("assess_popup_detailed_answer")}
          {resourceType === ResourceViewTypeValues.viewComment && d("View Comments").t("assess_popup_view_comments")}
          {resourceType === ResourceViewTypeValues.editComment && d("Add Comments").t("assess_popup_add_comments")}
          {resourceType === ResourceViewTypeValues.selectImg && "Select File to Provide Feedback"}
          {showClose && 
            <IconButton onClick={onClose} className={css.closeBtn}>
              <Close />
          </IconButton>}
        </DialogTitle>
        <DialogContent>
          {resourceType === ResourceViewTypeValues.essay && <div className={css.detailView}>{answer}</div>}
          {resourceType === ResourceViewTypeValues.viewComment && <div className={css.detailView}>{comment}</div>}
          {showAudioRecorder(resourceType) && (
            <div className={css.detailView}>
              <ApolloProvider client={audioClient}>
                <AudioView
                  resourceType={resourceType}
                  userId={userId as string}
                  roomId={roomId as string}
                  h5pId={h5pId as string}
                  h5pSubId={h5pSubId}
                  client={audioClient}
                />
              </ApolloProvider>
            </div>
          )}
          {resourceType === ResourceViewTypeValues.editComment&& (
            <div className={css.detailView}>
              <Controller
                style={{ width: "100%" }}
                name={"comment"}
                as={TextField}
                control={control}
                defaultValue={comment}
                multiline
                minRows={8}
                maxRows={8}
                variant="outlined"
                placeholder={d("Leave a message to your student!").t("assess_popup_leave_msg")}
                inputProps={{ maxLength: 500 }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <BorderColorIcon style={{ fontSize: "15px", position: "absolute", top: "20px", left: "5px" }} />
                    </InputAdornment>
                  ),
                }}
              />
            </div>
          )}
          {resourceType === ResourceViewTypeValues.editScore && (
            <Controller
              name="assess_score"
              control={control}
              defaultValue={score}
              key={`assess_score:${score}`}
              render={({ value, onChange }) => (
              <ScoreInput
                disabled={false}
                optionNames={[
                  d("Poor").t("assess_score_poor"),
                  d("Fair").t("assess_score_fair"),
                  d("Average").t("assess_score_average"),
                  d("Good").t("assess_score_good"),
                  d("Excellent").t("assess_score_excellent"),
                ]}
                optionValues={[1, 2, 3, 4, 5]}
                optionColors={["#d32f2f", "#DC6F17", "#FFC107", "#A1CC41", "#4CAF50"]}
                optionIcons={[
                  SentimentVeryDissatisfiedOutlined,
                  SentimentVeryDissatisfiedOutlined,
                  SentimentSatisfied,
                  SentimentSatisfiedOutlined,
                  SentimentVerySatisfiedOutlined,
                ]}
                value={value}
                onChange={(e) => onChange(Number(e.target.value))}
              />
              )}
            />
          )}
          {resourceType === ResourceViewTypeValues.selectImg &&
            <>
              <Controller
                name="assignments"
                control={control}
                defaultValue={assignments ? assignments[0].attachment_id : ""}
                render={({ value, onChange }) => (
                  <ImgSelect 
                    assignments={assignments}
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                  />
                )}
              />
            </>
          }
        </DialogContent>
        {showActionBtn && (
          <DialogActions>
            <Button autoFocus onClick={onClose} color="primary" variant="outlined">
              {d("CANCEL").t("general_button_CANCEL")}
            </Button>
            <Button onClick={handleOk} color="primary" variant="contained" className={css.okBtn}>
              {d("OK").t("general_button_OK")}
            </Button>
          </DialogActions>
        )}
      </Dialog>
    </>
  );
}

export function useResourceView() {
  const [active, setActive] = useState(false);
  const [resourceViewShowIndex, setResoutceViewShowIndex] = useState(0);
  return useMemo(
    () => ({
      resourceViewShowIndex,
      resourceViewActive: active,
      openResourceView: () => {
        setResoutceViewShowIndex(resourceViewShowIndex + 1);
        setActive(true);
      },
      closeResourceView: () => setActive(false),
    }),
    [active, resourceViewShowIndex]
  );
}

export interface DrawingFeedbackProps {
  open: boolean;
  attachment?: DetailAssessmentResultAssignment;
  studentId?: string;
  onClose: () => any;
  onOpenSelectImage?: (studentId?: string, hasSaved?: boolean) => void;
  onSaveDrawFeedback?: (studentId?: string, imgObj?: string) => void;
}
export function DrawingFeedback(props: DrawingFeedbackProps) {
  const css = useStyles();
  const { open, attachment, studentId, onClose, onOpenSelectImage, onSaveDrawFeedback } = props;
  const sketchRef = useRef<any>(null);
  const [hasTraces, setHasTraces] = useState<boolean>(false);
  const [hasSaved, setHasSaved] = useState<boolean>(false);
  const pictureUrl = apiResourcePathById(attachment?.review_attachment_id ? attachment.review_attachment_id : attachment?.attachment_id);
  const pictureInitUrl = apiResourcePathById(attachment?.attachment_id);
  const { breakpoints } = useTheme();
  const mobile = useMediaQuery(breakpoints.down(900));

  const handleClickSelectImage = () => {
    onOpenSelectImage && onOpenSelectImage(studentId, hasTraces)
  }

  const handleClickSave = () => {
    setHasSaved(true)
    const current = sketchRef.current;
    const imgObj = current.dataURLtoObject(attachment?.attachment_name, "obj");
    onSaveDrawFeedback && onSaveDrawFeedback(studentId, imgObj)
  }

  const handleChangePic = (value: SketchChangeProps) => {
    const hasTraces = value.isTraces;
    setHasSaved(false);
    setHasTraces(hasTraces);
  }

  return (
    <Dialog open={open} fullWidth maxWidth={"md"}>
      <DialogTitle>
        <div className={css.titleBar}>
          <span>{attachment?.attachment_name}</span>
          <div>
          <Button startIcon={<ImageOutlined />} onClick={handleClickSelectImage}>
            {"Select Image"}
          </Button>
          <Button disabled={hasSaved ? true : !hasTraces} startIcon={<SaveOutlined />} onClick={handleClickSave}>
            {"Save"}
          </Button>
          <Button startIcon={<ExitToAppOutlined/>} onClick={onClose} >
            {"Exit"}
          </Button>
          </div>
        </div>
    </DialogTitle>
    <DialogContent>
      <UiSketch 
        ref={sketchRef} 
        width={mobile ? 600 : 912} 
        height={400} 
        pictureUrl={pictureUrl}
        pictureInitUrl={pictureInitUrl}
        onChange={handleChangePic}
      />
    </DialogContent>
  </Dialog>
  )
}

export function useDrawingFeedback() {
  const [active, setActive] = useState(false);
  return useMemo(
    () => ({
      drawingFeedbackActive: active,
      openDrawingFeedback: () => {
        setActive(true);
      },
      closeDrawingFeedback: () => setActive(false),
    }),
    [active]
  );
}