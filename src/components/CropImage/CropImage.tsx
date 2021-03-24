import { Button, Dialog, DialogActions, DialogContent, DialogTitle, makeStyles } from "@material-ui/core";
import { FileLike } from "@rpldy/shared";
import "cropperjs/dist/cropper.css";
import React, { ReactNode, useCallback, useMemo, useState } from "react";
import Cropper from "react-cropper";
import { d } from "../../locale/LocaleManager";

const useStyles = makeStyles(({ breakpoints }) => ({
  cropper: {
    width: "100%",
  },
  dialogContent: {
    display: "flex",
  },
  dialogActions: {
    display: "flex",
    justifyContent: "center",
    marginTop: 40,
    marginBottom: 40,
  },
  button: {
    "&:not(:first-child)": {
      marginLeft: 40,
    },
  },
}));

const getUrlFromFile = (file: FileLike): Promise<string> => {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.readAsDataURL((file as unknown) as Blob);
  });
};

const getFileFromCanvas = (canvas: HTMLCanvasElement, file: FileLike): Promise<FileLike> => {
  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (blob) {
        const result = (blob as unknown) as FileLike;
        result.name = file.name;
        result.lastModified = file.lastModified;
        resolve(result);
      } else {
        reject(new Error("My Error: Canvas is empty"));
      }
    }, file.type);
  });
};

type CropResolve = (file: FileLike) => any;
interface CropImageRenderProps {
  crop: (file: FileLike) => Promise<FileLike>;
}

interface CropImageProps {
  aspectRatio?: number;
  maxWidth?: number;
  maxHeight?: number;
  render: (props: CropImageRenderProps) => ReactNode;
}
export function CropImage(props: CropImageProps) {
  const { render, aspectRatio, maxWidth, maxHeight } = props;
  const css = useStyles();
  const [cropper, setCropper] = useState<Cropper>();
  const [[file, src, resolve, reject], setCropState] = useState<[FileLike?, string?, CropResolve?, Function?]>([]);
  const crop = useMemo<CropImageRenderProps["crop"]>(
    () => async (file) => {
      return new Promise(async (resolve, reject) => {
        const url = await getUrlFromFile(file);
        if (!url) return Promise.reject();
        setCropState([file, url, resolve, reject]);
      });
    },
    []
  );
  const handleConfirm = useCallback(async () => {
    if (!cropper || !file) return;
    const canvas = cropper.getCroppedCanvas({ maxWidth, maxHeight });
    const resultFile = await getFileFromCanvas(canvas, file);
    setCropState([]);
    if (resolve) resolve(resultFile);
  }, [resolve, cropper, file, maxWidth, maxHeight]);
  const handleCancel = useCallback(() => {
    setCropState([]);
    reject && reject();
  }, [reject]);
  return (
    <>
      <Dialog maxWidth="md" fullWidth open={!!src}>
        <DialogTitle>{d("Clip Image").t("library_label_clip_image")}</DialogTitle>
        <DialogContent classes={{ root: css.dialogContent }}>
          <Cropper
            className={css.cropper}
            aspectRatio={aspectRatio}
            src={src}
            viewMode={2}
            dragMode="none"
            zoomable={false}
            guides
            // minCropBoxHeight={360}
            // minCropBoxWidth={640}
            background
            responsive
            autoCropArea={0.9}
            checkOrientation={false}
            onInitialized={setCropper}
          />
        </DialogContent>
        <DialogActions classes={{ root: css.dialogActions }}>
          <Button className={css.button} variant="contained" onClick={handleConfirm} color="primary">
            {d("OK").t("general_button_OK")}
          </Button>
          <Button className={css.button} variant="contained" onClick={handleCancel} color="primary">
            {d("CANCEL").t("general_button_CANCEL")}
          </Button>
        </DialogActions>
      </Dialog>
      {render({ crop })}
    </>
  );
}
