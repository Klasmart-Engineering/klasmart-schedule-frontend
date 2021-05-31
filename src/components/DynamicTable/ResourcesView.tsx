import React from "react";
import { makeStyles, Theme, createStyles } from "@material-ui/core/styles";
import Modal from "@material-ui/core/Modal";
import { ElasticLayerControl } from "../../types/assessmentTypes";
import { Box } from "@material-ui/core";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import InputAdornment from "@material-ui/core/InputAdornment";
import BorderColorIcon from "@material-ui/icons/BorderColor";
import CloseIcon from "@material-ui/icons/Close";
import { d } from "../../locale/LocaleManager";

function getModalStyle() {
  const top = 50;
  const left = 50;

  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`,
  };
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    paper: {
      position: "absolute",
      width: "20%",
      backgroundColor: theme.palette.background.paper,
      boxShadow: theme.shadows[6],
      padding: theme.spacing(2, 4, 3),
      textAlign: "center",
    },
    commentBox: {
      position: "absolute",
      width: "30%",
      backgroundColor: theme.palette.background.paper,
      boxShadow: theme.shadows[6],
      padding: theme.spacing(2, 0, 3, 0),
      textAlign: "center",
      "& h3": {
        textAlign: "initial",
        padding: "0px 0px 20px 20px",
        margin: "0",
        borderBottom: "1px solid #EEEEEE",
      },
    },
    DetailViewBox: {
      position: "absolute",
      backgroundColor: theme.palette.background.paper,
      boxShadow: theme.shadows[6],
      padding: theme.spacing(2, 0, 1, 0),
      textAlign: "center",
      "& h3": {
        textAlign: "initial",
        padding: "0px 20px 20px 20px",
        margin: "0",
        borderBottom: "1px solid #EEEEEE",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
      },
    },
    detailView: {
      padding: "12px",
      lineHeight: "30px",
      maxHeight: "400px",
      minWidth: "600px",
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
  })
);

interface elasticLayerControlProps {
  elasticLayerControlData?: ElasticLayerControl;
  handleElasticLayerControl: (elasticLayerControlData: ElasticLayerControl) => void;
}

interface NoticeProps extends elasticLayerControlProps {
  contentText?: string;
  title?: string;
}

function NoticeTemplate(props: NoticeProps) {
  const { contentText, handleElasticLayerControl } = props;
  const classes = useStyles();
  // getModalStyle is not a pure function, we roll the style only on the first render
  const [modalStyle] = React.useState(getModalStyle);
  return (
    <Box style={modalStyle} className={classes.paper}>
      <p style={{ lineHeight: "28px", color: "#666666" }}>{contentText}</p>
      <span style={{ display: "flex", justifyContent: "flex-end" }}>
        <Button
          color="primary"
          onClick={() => {
            handleElasticLayerControl({ link: "", openStatus: false, type: "" });
          }}
        >
          {d("Cancel").t("library_label_cancel")}
        </Button>
        <Button
          color="primary"
          onClick={() => {
            handleElasticLayerControl({ link: "", openStatus: false, type: "" });
          }}
        >
          {d("OK").t("general_button_OK")}
        </Button>
      </span>
    </Box>
  );
}

interface CommentsProps extends elasticLayerControlProps {
  contentText: string;
  title?: string;
}
function CommentsTemplate(props: CommentsProps) {
  const { handleElasticLayerControl, elasticLayerControlData, title } = props;
  const [commentText, setCommentText] = React.useState(elasticLayerControlData?.contentText);
  const classes = useStyles();
  // getModalStyle is not a pure function, we roll the style only on the first render
  const [modalStyle] = React.useState(getModalStyle);
  const handleChangeComment = elasticLayerControlData?.handleChangeComment!;
  return (
    <Box style={modalStyle} className={classes.commentBox}>
      <h3>{title}</h3>
      <div style={{ padding: "16px" }}>
        <TextField
          id="filled-multiline-flexible"
          style={{ width: "100%" }}
          multiline
          rows={8}
          variant="outlined"
          placeholder={d("Leave a message to your student!").t("assess_popup_leave_msg")}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <BorderColorIcon style={{ fontSize: "15px", position: "absolute", top: "20px", left: "5px" }} />
              </InputAdornment>
            ),
          }}
          value={commentText}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
            if (e.target.value.length <= 500) setCommentText(e.target.value);
          }}
        />
      </div>
      <span style={{ display: "flex", justifyContent: "flex-end" }}>
        <Button
          style={{ marginRight: "16px" }}
          variant="outlined"
          color="primary"
          onClick={() => {
            handleElasticLayerControl({ link: "", openStatus: false, type: "" });
          }}
        >
          {d("Cancel").t("library_label_cancel")}
        </Button>
        <Button
          style={{ marginRight: "16px" }}
          variant="contained"
          color="primary"
          onClick={() => {
            handleChangeComment(commentText!);
          }}
        >
          {d("OK").t("general_button_OK")}
        </Button>
      </span>
    </Box>
  );
}

function DetailedViewTemplate(props: NoticeProps) {
  const { handleElasticLayerControl, contentText, title } = props;
  const classes = useStyles();
  // getModalStyle is not a pure function, we roll the style only on the first render
  const [modalStyle] = React.useState(getModalStyle);
  return (
    <Box style={modalStyle} className={classes.DetailViewBox}>
      <h3>
        {title}{" "}
        <CloseIcon
          style={{ cursor: "pointer" }}
          onClick={() => {
            handleElasticLayerControl({ link: "", openStatus: false, type: "" });
          }}
        />
      </h3>
      <p className={classes.detailView}>{contentText}</p>
    </Box>
  );
}

export default function ResourcesView(props: elasticLayerControlProps) {
  const { elasticLayerControlData, handleElasticLayerControl } = props;

  const handleClose = () => {
    handleElasticLayerControl({ link: "", openStatus: false, type: "" });
  };

  const body = (
    <>
      {elasticLayerControlData?.type === "ViewComment" && (
        <CommentsTemplate
          contentText={
            "There are still students not start their Study activities. You cannot change the assessment after clicking Complete."
          }
          handleElasticLayerControl={handleElasticLayerControl}
          elasticLayerControlData={elasticLayerControlData}
        />
      )}
      {elasticLayerControlData?.type === "AddComment" && (
        <CommentsTemplate
          contentText={
            "There are still students not start their Study activities. You cannot change the assessment after clicking Complete."
          }
          handleElasticLayerControl={handleElasticLayerControl}
          elasticLayerControlData={elasticLayerControlData}
          title={elasticLayerControlData.title}
        />
      )}
      {elasticLayerControlData?.type === "DetailView" && (
        <DetailedViewTemplate
          contentText={elasticLayerControlData.contentText}
          handleElasticLayerControl={handleElasticLayerControl}
          elasticLayerControlData={elasticLayerControlData}
          title={elasticLayerControlData.title}
        />
      )}
      {elasticLayerControlData?.type === "Notice" && (
        <NoticeTemplate
          contentText={
            "There are still students not start their Study activities. You cannot change the assessment after clicking Complete."
          }
          handleElasticLayerControl={handleElasticLayerControl}
          elasticLayerControlData={elasticLayerControlData}
        />
      )}
    </>
  );

  return (
    <div>
      <Modal
        open={elasticLayerControlData?.openStatus ?? false}
        onClose={handleClose}
        aria-labelledby="simple-modal-title"
        aria-describedby="simple-modal-description"
      >
        {body}
      </Modal>
    </div>
  );
}
