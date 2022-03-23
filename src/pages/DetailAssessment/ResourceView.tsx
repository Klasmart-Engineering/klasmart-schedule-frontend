import { ApolloClient, ApolloProvider, createHttpLink, InMemoryCache } from "@apollo/client";
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
  TextField
} from "@material-ui/core";
import { Close } from "@material-ui/icons";
import BorderColorIcon from "@material-ui/icons/BorderColor";
import React, { useMemo, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { d } from "../../locale/LocaleManager";
import AudioView from "./AudioView";
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
  })
);

export const showAudioRecorder = (type?: string) => {
  const types = ["AudioRecorder", "SpeakTheWordsSet", "SpeakTheWords"];
  return types.indexOf(type as string) >= 0;
};
export interface ResourceViewProps {
  open: boolean;
  resourceType: string;
  onClose: () => void;
  answer?: string;
  comment?: string;
  onChangeComment?: (studentId?: string, comment?: string) => void;
  studentId?: string;
  roomId?: string;
  h5pId?: string;
  userId?: string;
  h5pSubId?: string;
}
export function ResourceView(props: ResourceViewProps) {
  const css = useStyles();
  const { resourceType, open, answer, comment, studentId, h5pId, roomId, userId, h5pSubId, onChangeComment, onClose } = props;
  const formMethods = useForm();
  const { control, getValues } = formMethods;
  const handleOk = () => {
    const comment = getValues()["comment"];
    onChangeComment && onChangeComment(studentId, comment);
    onClose();
  };
  const link = createHttpLink({
    uri: `${process.env.REACT_APP_KO_BASE_API}/audio-storage/graphql`,
    credentials: "include",
  });
  const client = new ApolloClient({
    link,
    cache: new InMemoryCache(),
  });
  return (
    <>
      <Dialog open={open}>
        <DialogTitle className={css.title}>
          {(resourceType === "Essay" || showAudioRecorder(resourceType)) && d("Detailed Answer").t("assess_popup_detailed_answer")}
          {resourceType === "ViewComment" && d("View Comments").t("assess_popup_view_comments")}
          {resourceType === "EditComment" && d("Add Comments").t("assess_popup_add_comments")}
          <IconButton onClick={onClose} className={css.closeBtn}>
            <Close />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          {resourceType === "Essay" && <div className={css.detailView}>{answer}</div>}
          {resourceType === "ViewComment" && <div className={css.detailView}>{comment}</div>}
          {showAudioRecorder(resourceType) && (
            <div className={css.detailView}>
              <ApolloProvider client={client}>
                <AudioView resourceType={resourceType} userId={userId as string} roomId={roomId as string} h5pId={h5pId as string} h5pSubId={h5pSubId} client={client} />
              </ApolloProvider>
            </div>
          )}
          {resourceType === "EditComment" && (
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
        </DialogContent>
        {resourceType === "EditComment" && (
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
  return useMemo(
    () => ({
      resourceViewActive: active,
      openResourceView: () => {
        setActive(true);
      },
      closeResourceView: () => setActive(false),
    }),
    [active]
  );
}
