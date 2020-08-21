import React, { useRef } from "react";
import { Box, TextField } from "@material-ui/core";
import { CloudUploadOutlined, CloudDownloadOutlined, InfoOutlined } from "@material-ui/icons";
import { withStyles, Theme, makeStyles } from "@material-ui/core/styles";
import Tooltip, { TooltipProps } from "@material-ui/core/Tooltip";

const useStyles = makeStyles(() => ({
  fieldset: {
    marginTop: 20,
    width: "100%",
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

const HtmlTooltip = withStyles((theme: Theme) => ({
  tooltip: {
    backgroundColor: "#FFFFFF",
    maxWidth: 260,
    fontSize: theme.typography.pxToRem(12),
    border: "1px solid #dadde9",
  },
}))(Tooltip);

const tipsText = (
  <div style={{ paddingBottom: "8px" }}>
    <div style={{ color: "#000000", fontWeight: "bold" }}>
      <p>Max: 100MB</p>
      <span>Support files In:</span>
    </div>
    <div style={{ color: "#666666" }}>
      <span>Video (avi, mov,mp4)</span>
      <br />
      <span>Audio (mp3, wav)</span>
      <br />
      <span>Image (jpg, jpeg, png, gif, bmp)</span>
      <br />
      <span>Document (doc, docx, ppt, pptx, xls, xlsx, pdf)</span>
    </div>
  </div>
);

export default function ScheduleAttachment() {
  const css = useStyles();
  const [fileName, setFileName] = React.useState("");
  const fileInputRef = useRef(null);
  const getFileObj = () => {
    // @ts-ignore
    fileInputRef.current.click();
  };
  const onGetFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const fileObj: any = e.target.files;
    setFileName(fileObj[0].name);
  };
  const downloadFile = () => {
    console.log("download");
  };

  return (
    <Box className={css.fieldBox}>
      <TextField disabled className={css.fieldset} label="Attachment" value={fileName}></TextField>
      <HtmlTooltip title={tipsText}>
        <InfoOutlined className={css.iconField} style={{ left: "110px", display: fileName ? "none" : "block" }} />
      </HtmlTooltip>
      <input
        type="file"
        onChange={(e) => {
          onGetFile(e);
        }}
        ref={fileInputRef}
        style={{ display: "none" }}
      />
      {!fileName && <CloudUploadOutlined className={css.iconField} style={{ right: "10px" }} onClick={getFileObj} />}
      {fileName && <CloudDownloadOutlined className={css.iconField} style={{ right: "10px" }} onClick={downloadFile} />}
    </Box>
  );
}
