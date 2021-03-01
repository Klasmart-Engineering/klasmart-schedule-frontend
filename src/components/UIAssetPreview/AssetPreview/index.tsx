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
  resourceId: string | undefined;
}
export function AssetPreview(props: PreviewProps) {
  const { resourceId, className } = props;
  const source = typeof resourceId === "object" ? resourceId["source"] : resourceId;
  const path = apiResourcePathById(source);
  const getSuffix = (source: string | undefined) => {
    if (JSON.stringify(source) === "{}" || !source) return;
    return source.substring(source.lastIndexOf(".") + 1, source.length).toLowerCase();
  };
  return (
    <Box display="flex" flexDirection="column" alignItems="center" className={className} width="100%" height="100%">
      {fileFormat.image.indexOf(`.${getSuffix(source)}`) >= 0 && <AssetImg src={path} />}
      {fileFormat.video.indexOf(`.${getSuffix(source)}`) >= 0 && <AssetVideo src={path} />}
      {fileFormat.audio.indexOf(`.${getSuffix(source)}`) >= 0 && <AssetAudio src={path} />}
      {fileFormat.document.indexOf(`.${getSuffix(source)}`) >= 0 && <AssetFile src={source} />}
      {/* {fileFormat.pdf.indexOf(`.${getSuffix(source)}`) >= 0 && <AssetPdf src={path} />} */}
      <Typography variant="body1" style={{ marginTop: "20px" }}>
        {d("File Type").t("library_label_file_type")} : {getSuffix(source)}
      </Typography>
    </Box>
  );
}
