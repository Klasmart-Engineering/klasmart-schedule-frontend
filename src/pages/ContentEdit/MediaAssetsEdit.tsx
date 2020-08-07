import { makeStyles, Typography, Box } from "@material-ui/core";

import React from "react";

const useStyles = makeStyles((theme) => ({
  assetImg: {
    width: 775,
    Height: 248,
  },
}));

function AssetPreview() {
  const css = useStyles();
  return (
    <Box display="flex" flexDirection="column">
      <img
        className={css.assetImg}
        src="https://beta-hub.kidsloop.net/e23a62b86d44c7ae5eb7993dbb6f7d7d.png"
        alt="assetImg"
      />
      <Typography variant="body1">Content type: jpg</Typography>
    </Box>
  );
}
interface AssetEditProps {
  asset?: any;
}
function AssetEdit(props: AssetEditProps) {
  return null;
}

function AssetPreviewOverlay() {
  return null;
}

interface MediaAssetsEditProps extends AssetEditProps {
  readonly: boolean;
  overlay: boolean;
}

export default function MediaAssetsEdit(props: MediaAssetsEditProps) {
  const { readonly, overlay, asset } = props;
  if (overlay) return <AssetPreviewOverlay />;
  if (readonly) return <AssetPreview />;
  return <AssetEdit asset={asset} />;
}
