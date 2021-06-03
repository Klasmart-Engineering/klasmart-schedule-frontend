import { Box, BoxProps, Typography } from "@material-ui/core";
import React from "react";
import { apiResourcePathById } from "../../../api/extra";
import { d } from "../../../locale/LocaleManager";
import { fileFormat } from "../../../pages/ContentEdit/MediaAssetsEdit";
import AssetAudio from "./AssetAudio";
import AssetFile from "./AssetFile";
import AssetImg from "./AssetImg";
import AssetPdf from "./AssetPdf";
import AssetVideo from "./AssetVideo";

interface PreviewProps extends BoxProps {
  resourceId: string | undefined;
  isHideFileType?: boolean;
}
export function AssetPreview(props: PreviewProps) {
  const { resourceId, isHideFileType, className } = props;
  const source = typeof resourceId === "object" ? resourceId["source"] : resourceId;

  const path = apiResourcePathById(source);
  const isHeight = fileFormat.document.indexOf(`.${getSuffix(source)}`) >= 0 || fileFormat.pdf.indexOf(`.${getSuffix(source)}`) >= 0;
  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      className={className}
      width="100%"
      height={isHeight ? "100vh" : "100%"}
      onContextMenu={(e) => {
        e.preventDefault();
        return false;
      }}
    >
      {fileFormat.image.indexOf(`.${getSuffix(source)}`) >= 0 && <AssetImg key={source} src={path} />}
      {fileFormat.video.indexOf(`.${getSuffix(source)}`) >= 0 && <AssetVideo key={source} src={path} />}
      {fileFormat.audio.indexOf(`.${getSuffix(source)}`) >= 0 && <AssetAudio key={source} src={path} />}
      {fileFormat.document.indexOf(`.${getSuffix(source)}`) >= 0 && <AssetFile key={source} src={source} />}
      {fileFormat.pdf.indexOf(`.${getSuffix(source)}`) >= 0 && <AssetPdf key={source} src={path} />}
      {!isHideFileType && (
        <Typography variant="body1" style={{ marginTop: "20px" }}>
          {d("File Type").t("library_label_file_type")} : {getSuffix(source)}
        </Typography>
      )}
    </Box>
  );
}
export const getSuffix = (source: string | undefined) => {
  if (JSON.stringify(source) === "{}" || !source) return;
  return source.substring(source.lastIndexOf(".") + 1, source.length).toLowerCase();
};
