import React, { useRef, forwardRef, useImperativeHandle } from "react";
import { SketchField, Tools } from "react-sketch-master";
import { Box } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import Slider from "@material-ui/core/Slider";
import CreateIcon from "@material-ui/icons/Create";
import DeleteIcon from "@material-ui/icons/Delete";
import TouchAppIcon from "@material-ui/icons/TouchApp";
import RedoIcon from "@material-ui/icons/Redo";
import UndoIcon from "@material-ui/icons/Undo";
import OpenWithIcon from "@material-ui/icons/OpenWith";
import TextFieldsIcon from "@material-ui/icons/TextFields";
import Divider from "@material-ui/core/Divider";
import CheckIcon from "@material-ui/icons/Check";
import CloseIcon from "@material-ui/icons/Close";
import Tooltip from "@material-ui/core/Tooltip";
import Popper from "@material-ui/core/Popper";
import Fade from "@material-ui/core/Fade";
import TextField from "@material-ui/core/TextField";

const useStyles = makeStyles(({ shadows }) => ({
  sliderBox: {
    width: 180,
  },
  toolsBar: {
    display: "flex",
    justifyContent: "space-evenly",
    border: "1px solid black",
    borderRadius: "20px",
    alignItems: "center",
    height: "80px",
  },
  fieldItem: {
    width: "30px",
    height: "30px",
    borderRadius: "30px",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    cursor: "pointer",
    "& div": {
      width: "20px",
      height: "20px",
      borderRadius: "20px",
    },
  },
  toolSelected: {
    padding: "6px",
    backgroundColor: "black",
    color: "white",
    borderRadius: "10px",
  },
  toolUnSelected: {
    padding: "6px",
  },
  textField: {
    marginTop: "-90px",
    padding: "6px",
    border: "1px solid",
    display: "flex",
    alignItems: "center",
    borderRadius: "10px",
  },
}));
export interface UiSketchProps {
  width: number;
  height: number;
  pictureUrl?: string;
}

const Operations: {
  Pencil: string;
  Select: string;
  Text: string;
  Pan: string;
} = {
  Pencil: "pencil",
  Select: "select",
  Text: "text",
  Pan: "pan",
};

function valuetext(value: number) {
  return `${value}`;
}

export const UiSketch = forwardRef<HTMLDivElement, UiSketchProps>((props, ref) => {
  const { width, height, pictureUrl } = props;
  const css = useStyles();
  const sketchRef = useRef<any>(null);
  const [color, setColor] = React.useState<string>("#E60313");
  const [lineWidth, setLineWidth] = React.useState<number | number[]>(10);
  const [tool, setTool] = React.useState<string>(Tools.Pencil);
  const [currentOperation, setCurrentOperation] = React.useState<string>(Operations.Pencil);
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [text, SetText] = React.useState<string>("");
  const fieldItemColor = ["#E60313", "#F5A101", "#FED900", "#3DB135", "#02FCFC", "#0068B7", "#A6569D", "#A6569D", "#9F4500", "#000000"];

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(anchorEl ? null : event.currentTarget);
  };

  const open = Boolean(anchorEl);
  const id = open ? "simple-popper" : undefined;

  // @ts-ignore
  useImperativeHandle(ref, () => ({
    isTraces: isTraces,
    dataURLtoBlob: dataURLtoBlob,
    chooseImage: chooseImage,
  }));

  React.useEffect(() => {
    if (pictureUrl) chooseImage(pictureUrl);
  }, [pictureUrl]);

  const dataURLtoBlob = (imageName: string) => {
    const base64Data = sketchRef.current.toDataURL();
    const byteString = atob(base64Data.split(",")[1]);
    const mimeString = base64Data.split(",")[0].split(":")[1].split(";")[0];
    const ab = new ArrayBuffer(byteString.length);
    const ia = new Uint8Array(ab);
    for (let i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }
    const BlobModel = new Blob([ab], { type: mimeString });
    const fd = new FormData();
    fd.append("upfile", BlobModel, imageName + ".png");
    return fd;
  };

  const chooseImage = (url: string) => {
    sketchRef.current.addImg(url);
  };

  const isTraces = () => {
    return sketchRef.current.canUndo();
  };

  const fieldItem = () => {
    return (
      <>
        {fieldItemColor.map((c) => {
          return (
            <div
              className={css.fieldItem}
              onClick={() => {
                setColor(c);
                setTool(Tools.DefaultTool);
                setTimeout(() => {
                  setTool(tool);
                });
              }}
              style={{ border: `1px solid ${c}` }}
            >
              <div key={c} style={{ backgroundColor: c, boxShadow: `0px 0px 8px 0px ${c}` }}></div>
            </div>
          );
        })}
      </>
    );
  };
  const handleChangeSetLineWidth = (event: any, value: number | number[]) => {
    setLineWidth(value);
    setTool(Tools.DefaultTool);
    setTool(tool);
  };
  return (
    <Box>
      <SketchField ref={sketchRef} lineColor={color} tool={tool} width={width} height={height} lineWidth={lineWidth} />
      <div className={css.toolsBar} style={{ width: width }}>
        {fieldItem()}
        <Divider orientation="vertical" flexItem />
        <div className={css.sliderBox}>
          <Typography id="discrete-slider" gutterBottom>
            Weight
          </Typography>
          <Slider
            defaultValue={lineWidth}
            getAriaValueText={valuetext}
            aria-labelledby="discrete-slider"
            valueLabelDisplay="auto"
            step={10}
            marks
            min={10}
            max={100}
            onChange={handleChangeSetLineWidth}
          />
        </div>
        <Tooltip title="Pen">
          <CreateIcon
            style={{ color: color, border: currentOperation === Operations.Pencil ? "1px dashed black" : "none" }}
            onClick={() => {
              setCurrentOperation(Operations.Pencil);
              setTool(Tools.Pencil);
            }}
          />
        </Tooltip>
        <Tooltip title="Select">
          <TouchAppIcon
            style={{ border: currentOperation === Operations.Select ? "1px dashed black" : "none" }}
            onClick={() => {
              setCurrentOperation(Operations.Select);
              setTool(Tools.Select);
            }}
          />
        </Tooltip>

        <Tooltip title="Pan">
          <OpenWithIcon
            style={{ border: currentOperation === Operations.Pan ? "1px dashed black" : "none" }}
            onClick={() => {
              setCurrentOperation(Operations.Pan);
              setTool(Tools.Pan);
            }}
          />
        </Tooltip>

        <Tooltip title="Text">
          <div aria-describedby={id} onClick={handleClick}>
            <TextFieldsIcon
              style={{ border: currentOperation === Operations.Text ? "1px dashed black" : "none" }}
              onClick={() => {
                setCurrentOperation(Operations.Text);
                setTool(Tools.Select);
              }}
            />
          </div>
        </Tooltip>
        <Popper id={id} open={open} placement={"top"} anchorEl={anchorEl} transition>
          {({ TransitionProps }) => (
            <Fade {...TransitionProps} timeout={350}>
              <div className={css.textField}>
                <TextField
                  id="standard-basic"
                  size="small"
                  label="Text"
                  onChange={(e) => {
                    SetText(e.target.value);
                  }}
                />
                <CheckIcon
                  style={{ color: "blue", marginLeft: "10px" }}
                  onClick={() => {
                    sketchRef.current.addText(text);
                  }}
                />
                <CloseIcon
                  style={{ color: "red", marginLeft: "10px" }}
                  onClick={() => {
                    setAnchorEl(null);
                  }}
                />
              </div>
            </Fade>
          )}
        </Popper>

        <Tooltip title="Undo">
          <UndoIcon
            onClick={() => {
              sketchRef.current.undo();
            }}
          />
        </Tooltip>

        <Tooltip title="Redo">
          <RedoIcon
            onClick={() => {
              sketchRef.current.redo();
            }}
          />
        </Tooltip>

        <Tooltip title="Clean">
          <DeleteIcon
            onClick={() => {
              sketchRef.current.clear();
            }}
          />
        </Tooltip>
      </div>
    </Box>
  );
});
