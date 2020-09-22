import { Button, Dialog, DialogActions, DialogContent, DialogTitle, makeStyles } from "@material-ui/core";
import { FileLike } from "@rpldy/shared";
import "cropperjs/dist/cropper.css";
import React, { ReactNode, useCallback, useMemo, useState } from "react";
import Cropper from "react-cropper";

const useStyles = makeStyles(({ breakpoints }) => ({
  dialog: {
    minWidth: 800,
    [breakpoints.down("sm")]: {
      width: '70%',
    },
  }
}));

const getUrlFromFile = (file: FileLike): Promise<string> => {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.readAsDataURL(file as unknown as Blob);
  });
};

const getFileFromCanvas = (canvas: HTMLCanvasElement, file: FileLike): Promise<FileLike> => {
	return new Promise((resolve, reject) => {
		canvas.toBlob((blob) => {
			if (blob) {
        const result = blob as unknown as FileLike;
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
  render: (props: CropImageRenderProps) => ReactNode;
}
export function CropImage(props: CropImageProps) {
  const { render } = props;
  const css = useStyles();
  const [cropper, setCropper] = useState<Cropper>();
  const [[file, src, resolve, reject], setCropState] = useState<[FileLike?, string?, CropResolve?, Function?]>([]);
  const crop = useMemo<CropImageRenderProps['crop']>(() => async (file) => {
    return new Promise(async (resolve, reject) => {
      const url = await getUrlFromFile(file);
      if (!url) return Promise.reject();
      setCropState([file, url, resolve, reject]);
    });
  }, []);
  const handleConfirm = useCallback(async () => {
    if (!cropper || !file) return;
    const canvas = cropper.getCroppedCanvas();
    const resultFile = await getFileFromCanvas(canvas, file);
    if (resolve) resolve(resultFile);
  }, [resolve, cropper, file]);
  return <>
    <Dialog maxWidth="md" fullWidth open>
      <DialogTitle>{"Crop Images"}</DialogTitle>
      <DialogContent>
        <Cropper
          style={{ height: 400, width: "100%" }}
          aspectRatio={16/9}
          src="https%3A%2F%2Fkl2-test.kidsloop.net%2Fv1/contents_resources/thumbnail-5f69ad4f89f8d0ba359ba915.jpeg"
          viewMode={1}
          dragMode="none"
          zoomable={false}
          guides
          minCropBoxHeight={180}
          minCropBoxWidth={320}
          background
          responsive
          autoCropArea={1}
          checkOrientation={false}
          onInitialized={setCropper}
        />
      </DialogContent>
      <DialogActions>
        <Button variant="contained" autoFocus onClick={handleConfirm} color="primary">Ok</Button>
      </DialogActions>
    </Dialog>
    {render({ crop })}
  </>;
}