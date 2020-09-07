import React, { useEffect } from "react";
import { makeStyles } from "@material-ui/core";
import FastForwardOutlinedIcon from "@material-ui/icons/FastForwardOutlined";
import FastRewindOutlinedIcon from "@material-ui/icons/FastRewindOutlined";
import PlayCircleFilledOutlinedIcon from "@material-ui/icons/PlayCircleFilledOutlined";
import PauseCircleFilledIcon from "@material-ui/icons/PauseCircleFilled";
import Box from "@material-ui/core/Box";
import Slider from "@material-ui/core/Slider";

const useStyles = makeStyles({
  wrap: {
    width: "100%",
    position: "relative",
  },
  video: {
    width: "100%",
    marginTop: "36px",
  },
  controls: {
    width: "100%",
    height: "50px",
    backgroundColor: "#0e78d5",
    marginTop: "-4px",
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
  videoUrl: string;
}

export default function AssetVideo(props: video) {
  const classes = useStyles();
  const [value, setValue] = React.useState<number>(0);
  const [isplay, setIsplay] = React.useState<boolean>(false);

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
    <Box className={classes.wrap}>
      {/* {
        isplay
        ? <PauseCircleOutlineIcon className={classes.videoTool} />
        : <PlayCircleFilledIcon className={classes.videoTool} />
      } */}
      <video id="video" className={classes.video} src={props.videoUrl} onClick={handlePlay}></video>
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
  );
}
