import { Box, BoxProps, Typography } from "@material-ui/core";
import React from "react";
import { apiResourcePathById } from "../../../api/extra";
import { d } from "../../../locale/LocaleManager";
import { fileFormat } from "../../../pages/ContentEdit/MediaAssetsEdit";
import AssetAudio from "./AssetAudio";
import AssetFile from "./AssetFile";
import AssetImg from "./AssetImg";
import AssetVideo from "./AssetVideo";

interface PreviewProps extends BoxProps {
  fileType?: string;
  resourceId: string | undefined;
}
export function AssetPreview(props: PreviewProps) {
  const { fileType, resourceId, className } = props;
  const source = typeof resourceId === "object" ? resourceId["source"] : resourceId;
  const path = apiResourcePathById(source);
  const getSuffix = (source: string | undefined) => {
    if (JSON.stringify(source) === "{}" || !source) return;
    return source.substring(source.lastIndexOf(".") + 1, source.length).toLowerCase();
  };
  return (
    <Box display="flex" flexDirection="column" alignItems="center" className={className} width="100%" height="100%">
      {(fileType === "image" || fileFormat.image.indexOf(`.${getSuffix(source)}`) >= 0) && <AssetImg src={path} />}
      {(fileType === "video" || fileFormat.video.indexOf(`.${getSuffix(source)}`) >= 0) && <AssetVideo src={path} />}
      {(fileType === "audio" || fileFormat.audio.indexOf(`.${getSuffix(source)}`) >= 0) && <AssetAudio src={path} />}
      {(fileType === "document" || fileFormat.document.indexOf(`.${getSuffix(source)}`) >= 0) && <AssetFile src={path} />}
      <Typography variant="body1" style={{ marginTop: "40px" }}>
        {d("File Type").t("library_label_file_type")} : {getSuffix(source)}
      </Typography>
    </Box>
  );
}
