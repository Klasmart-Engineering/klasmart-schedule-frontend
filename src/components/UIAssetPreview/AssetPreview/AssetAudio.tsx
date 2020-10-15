import Box from "@material-ui/core/Box";
import Slider from "@material-ui/core/Slider";
import { makeStyles } from "@material-ui/core/styles";
import FastForwardOutlinedIcon from "@material-ui/icons/FastForwardOutlined";
import FastRewindOutlinedIcon from "@material-ui/icons/FastRewindOutlined";
import PauseCircleFilledIcon from "@material-ui/icons/PauseCircleFilled";
import PlayCircleFilledOutlinedIcon from "@material-ui/icons/PlayCircleFilledOutlined";
import React, { useEffect } from "react";
import audioUrl from "../../../assets/icons/music.svg";
const useStyles = makeStyles({
  wrap: {
    width: "100%",
    height: "494px",
  },
  audioCon: {
    margin: "137px auto",
  },
  audioImg: {
    width: "73px",
    height: "60px",
    verticalAlign: "middle",
  },
  controls: {
    width: "80%",
    height: 50,
    display: "flex",
    color: "#fff",
    alignItems: "center",
    background: "#009688",
    margin: "0 auto",
  },
  tools: {
    width: "100px",
    display: "flex",
    justifyContent: "space-around",
  },
  itemTool: {
    cursor: "pointer",
  },
  progress: {
    flex: 1,
    marginLeft: "10px",
    marginRight: "10px",
    color: "#fff",
  },
});

interface Audio {
  src: string | undefined;
}

export default function AssetAudio(props: Audio) {
  const classes = useStyles();
  const [value, setValue] = React.useState<number>(0);
  const [isplay, setIsplay] = React.useState<boolean>(false);

  const handleChange = (event: any, newValue: number | number[]) => {
    const audio = document.getElementById("audio") as HTMLAudioElement;
    setValue(newValue as number);
    audio.currentTime = audio.duration * (newValue as number) * 0.01;
  };

  const handlePlay = () => {
    const audio = document.getElementById("audio") as HTMLAudioElement;
    setIsplay(!isplay);
    isplay ? audio.pause() : audio.play();
  };
  useEffect(() => {
    const audio = document.getElementById("audio") as HTMLAudioElement;
    const timer = setInterval(() => {
      isplay ? setValue((audio.currentTime / audio.duration) * 100) : clearInterval(timer);
    }, 500);
  });
  return (
    <Box className={classes.wrap}>
      <img className={classes.audioCon} src={audioUrl} alt="" />
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
      <audio id="audio" style={{ width: "100%" }} src={props.src}></audio>
    </Box>
  );
}
