import { Box, TextField } from "@material-ui/core";
import { makeStyles, Theme, withStyles } from "@material-ui/core/styles";
import Tooltip from "@material-ui/core/Tooltip";
import { CloudDownloadOutlined, CloudUploadOutlined, InfoOutlined } from "@material-ui/icons";
import React from "react";
import { useLocation } from "react-router-dom";
import { apiResourcePathById } from "../../api/extra";
import { d } from "../../locale/LocaleManager";
import CancelIcon from "@material-ui/icons/Cancel";
import { FileLikeWithId, FileSizeUnit, MultipleUploader, MultipleUploaderErrorType } from "../../components/MultipleUploader";
import { actError } from "../../reducers/notify";
import { useDispatch } from "react-redux";
import CircularProgress, { CircularProgressProps } from "@material-ui/core/CircularProgress";
import Typography from "@material-ui/core/Typography";

function CircularProgressWithLabel(props: CircularProgressProps & { value: number }) {
  return (
    <Box position="absolute" display="inline-flex">
      <CircularProgress variant="determinate" {...props} />
      <Box top={48} left={-131} bottom={0} right={0} position="absolute" display="flex" alignItems="center" justifyContent="center">
        <Typography variant="caption" component="div" color="textSecondary">{`${Math.round(props.value)}%`}</Typography>
      </Box>
    </Box>
  );
}

const useStyles = makeStyles(() => ({
  fieldset: {
    marginTop: 20,
    width: "100%",
  },
  fieldsetDisabled: {
    marginTop: 20,
    width: "100%",
    "& .Mui-disabled": {
      color: "rgba(0, 0, 0, 0.54)",
    },
  },
  fieldBox: {
    position: "relative",
  },
  iconField: {
    position: "absolute",
    top: "48%",
    cursor: "pointer",
  },
}));

export const HtmlTooltip = withStyles((theme: Theme) => ({
  tooltip: {
    backgroundColor: "#FFFFFF",
    maxWidth: 260,
    fontSize: theme.typography.pxToRem(12),
    border: "1px solid #dadde9",
  },
}))(Tooltip);

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

interface ScheduleAttachmentProps {
  setAttachmentId: (id: string) => void;
  attachmentId: string;
  attachmentName: string;
  setAttachmentName: (name: string) => void;
  specificStatus?: boolean;
  setSpecificStatus?: (value: boolean) => void;
  isStudent: boolean;
  isDisabled: boolean;
}

const useQuery = () => {
  const { search } = useLocation();
  const query = new URLSearchParams(search);
  const schedule_id = query.get("schedule_id") || "";
  return { schedule_id };
};

export default function ScheduleAttachment(props: ScheduleAttachmentProps) {
  const { setAttachmentId, attachmentName, setAttachmentName, attachmentId, isStudent, isDisabled } = props;
  const css = useStyles();
  const { schedule_id } = useQuery();
  const dispatch = useDispatch();
  const [fileName, setFileName] = React.useState<Pick<FileLikeWithId, "id" | "name">[] | undefined>([]);
  const handleOnChange = (value: Pick<FileLikeWithId, "id" | "name">[] | undefined): void => {
    setAttachmentId(value![0].id as string);
    setAttachmentName(value![0].name as string);
    setFileName(value);
  };

  const [downloadUrl, setDownloadUrl] = React.useState<string | undefined>(attachmentId);

  React.useEffect(() => {
    if (attachmentId) {
      const url: string | undefined = apiResourcePathById(attachmentId);
      setDownloadUrl(url);
    }
  }, [attachmentId]);

  const deleteItem = () => {
    setAttachmentName("");
    setAttachmentId("");
    setFileName([]);
  };

  React.useEffect(() => {
    if (!schedule_id) {
      setAttachmentName("");
    }
  }, [schedule_id, setAttachmentName]);

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

  const textEllipsis = (value: string) => {
    const CharacterCount = 30;
    return value ? reBytesStr(value, CharacterCount) : "";
  };

  return (
    <>
      <MultipleUploader
        partition="schedule_attachment"
        accept=".avi,.mov,.mp4,.mp3,.wav,.jpg,.jpeg,.png,.gif,.bmp,.doc,.docx,.ppt,.pptx,.xls,.xlsx,.pdf"
        {...props}
        maxAmount={1}
        onChange={(value) => handleOnChange(value)}
        value={fileName}
        maxSize={100 * FileSizeUnit.M}
        onError={(error) =>
          Promise.reject(
            dispatch(
              actError(
                error.type === MultipleUploaderErrorType.MaxAmountError
                  ? d("You can upload only one attachment. ").t("schedule_msg_one_attachment")
                  : d("The attachment you uploaded does not meet the requirement.").t("schedule_msg_attachment")
              )
            )
          )
        }
        render={({ btnRef, value, isUploading, batch }) => (
          <Box className={css.fieldBox}>
            <TextField
              disabled
              className={isDisabled ? css.fieldset : css.fieldsetDisabled}
              label={d("Attachment").t("schedule_detail_attachment")}
              value={textEllipsis(attachmentName)}
            ></TextField>
            <HtmlTooltip title={getTipsText()}>
              <InfoOutlined
                className={css.iconField}
                style={{ left: "110px", display: attachmentName ? "none" : "block", color: "rgba(0, 0, 0, 0.54)" }}
              />
            </HtmlTooltip>
            {isUploading && (
              <CircularProgressWithLabel
                style={{ width: "36px", height: "36px", position: "absolute", top: "30px", right: "48px" }}
                value={batch?.items[0].completed as number}
              />
            )}
            {!isStudent && !attachmentName && !isDisabled && (
              <CloudUploadOutlined className={css.iconField} style={{ right: attachmentName ? "50px" : "10px" }} ref={btnRef as any} />
            )}
            {attachmentName && !isStudent && !isDisabled && (
              <CancelIcon className={css.iconField} style={{ right: "50px", color: "#666666" }} onClick={deleteItem} />
            )}
            <a href={downloadUrl} target="_blank" rel="noopener noreferrer">
              {attachmentName && !isDisabled && <CloudDownloadOutlined className={css.iconField} style={{ right: "10px" }} />}
            </a>
          </Box>
        )}
      />
    </>
  );
}
