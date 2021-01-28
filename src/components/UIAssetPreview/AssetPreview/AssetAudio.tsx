import Box from "@material-ui/core/Box";
import Slider from "@material-ui/core/Slider";
import { makeStyles } from "@material-ui/core/styles";
import FastForwardOutlinedIcon from "@material-ui/icons/FastForwardOutlined";
import FastRewindOutlinedIcon from "@material-ui/icons/FastRewindOutlined";
import PauseCircleFilledIcon from "@material-ui/icons/PauseCircleFilled";
import PlayCircleFilledOutlinedIcon from "@material-ui/icons/PlayCircleFilledOutlined";
import React, { useEffect, useReducer, useRef } from "react";
import audioUrl from "../../../assets/icons/music.svg";
import AssetLoading from "./AssetLoading";
const useStyles = makeStyles({
  wrap: {
    width: "100%",
    height: "100%",
    textAlign: "center",
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
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isplay, setIsplay] = React.useState<boolean>(false);
  const [loaded, dispatchLoaded] = useReducer(() => true, false);

  const handleChange = (event: any, newValue: number | number[]) => {
    const audio = audioRef.current;
    if (!audio) return;
    setValue(newValue as number);
    audio.currentTime = audio.duration * (newValue as number) * 0.01;
  };

  const handlePlay = () => {
    const audio = audioRef.current;
    if (!audio) return;
    setIsplay(!isplay);
    isplay ? audio.pause() : audio.play();
  };
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    const timer = setInterval(() => {
      isplay ? setValue((audio.currentTime / audio.duration) * 100) : clearInterval(timer);
    }, 500);
  });
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !props.src) return;
    audio.load();
  }, [props.src]);
  return (
    <Box className={classes.wrap}>
      {!loaded && <AssetLoading />}
      {loaded && (
        <>
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
        </>
      )}
      <audio id="audio" onCanPlayThrough={(e) => dispatchLoaded()} style={{ width: "100%" }} src={props.src} ref={audioRef}></audio>
    </Box>
  );
}
