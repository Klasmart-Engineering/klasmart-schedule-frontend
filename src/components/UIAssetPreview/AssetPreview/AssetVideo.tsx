import { makeStyles } from "@material-ui/core";
import Box from "@material-ui/core/Box";
import Slider from "@material-ui/core/Slider";
import FastForwardOutlinedIcon from "@material-ui/icons/FastForwardOutlined";
import FastRewindOutlinedIcon from "@material-ui/icons/FastRewindOutlined";
import PauseCircleFilledIcon from "@material-ui/icons/PauseCircleFilled";
import PlayCircleFilledOutlinedIcon from "@material-ui/icons/PlayCircleFilledOutlined";
import React, { useEffect, useReducer } from "react";
import AssetLoading from "./AssetLoading";

const useStyles = makeStyles({
  wrap: {
    width: "100%",
    height: "100%",
    position: "relative",
  },
  video: {
    width: "80%",
    marginTop: "36px",
  },
  controls: {
    width: "80%",
    height: "50px",
    backgroundColor: "#0e78d5",
    marginTop: "-4px",
    marginLeft: "10%",
    display: "flex",
    alignItems: "center",
  },
  tools: {
    width: "100px",
    display: "flex",
    justifyContent: "space-around",
  },
  itemTool: {
    cursor: "pointer",
    color: "#fff",
  },
  progress: {
    flex: 1,
    marginLeft: "10px",
    marginRight: "10px",
    color: "#fff",
  },
  videoTool: {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
  },
});

interface video {
  src: string | undefined;
}

export default function AssetVideo(props: video) {
  const classes = useStyles();
  const [value, setValue] = React.useState<number>(0);
  const [isplay, setIsplay] = React.useState<boolean>(false);
  const [loaded, dispatchLoaded] = useReducer(() => true, false);
  const display = loaded ? "block" : "none";
  const handleChange = (event: any, newValue: number | number[]) => {
    const video = document.getElementById("video") as HTMLVideoElement;
    setValue(newValue as number);
    video.currentTime = video.duration * (newValue as number) * 0.01;
  };

  const handlePlay = () => {
    const video = document.getElementById("video") as HTMLVideoElement;
    setIsplay(!isplay);
    isplay ? video.pause() : video.play();
  };

  useEffect(() => {
    const video = document.getElementById("video") as HTMLVideoElement;
    const timer = setInterval(() => {
      isplay ? setValue((video.currentTime / video.duration) * 100) : clearInterval(timer);
    }, 500);
  });
  return (
    <>
      {!loaded && <AssetLoading />}
      <Box className={classes.wrap} style={{ display }}>
        <video id="video" className={classes.video} src={props.src} onCanPlayThrough={(e) => dispatchLoaded()} onClick={handlePlay}></video>
        <Box className={classes.controls}>
          <Box className={classes.tools}>
            <FastRewindOutlinedIcon className={classes.itemTool} />
            {isplay ? (
              <PauseCircleFilledIcon className={classes.itemTool} onClick={handlePlay} />
            ) : (
              <PlayCircleFilledOutlinedIcon className={classes.itemTool} onClick={handlePlay} />
            )}

            <FastForwardOutlinedIcon className={classes.itemTool} />
          </Box>
          <Slider className={classes.progress} value={value} onChange={handleChange} aria-labelledby="continuous-slider" />
        </Box>
      </Box>
    </>
  );
}
