import { createStyles, makeStyles, Slider } from "@material-ui/core";
import PauseCircleFilledIcon from "@material-ui/icons/PauseCircleFilled";
import PlayCircleFilledOutlinedIcon from "@material-ui/icons/PlayCircleFilledOutlined";
import { useEffect, useRef, useState } from "react";
import getDrawMethod from "./draw";
import Visualizer from "./visualizer";

const useStyles = makeStyles((theme) =>
  createStyles({
    progress: {
      flex: 1,
      marginLeft: "10px",
      marginRight: "10px",
      color: "#0E78D5",
    },
    itemTool: {
      cursor: "pointer",
      color: "#0E78D5",
    },
    tools: {
      width: "100%",
      display: "flex",
      justifyContent: "space-around",
    },
  })
);
export interface AudioVisionProps {
  src: string;
  bars: number;
  barColor: string[];
  height: number;
  width: number;
  volume: number;
}
export const AudioVision = (props: AudioVisionProps) => {
  const css = useStyles();
  const { src, bars, barColor, height, width, volume } = props;
  const [visualizer, setVisualize] = useState<Visualizer>();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [duration, setDuration] = useState<number>(0);
  const [pauseTime, setPauseTime] = useState<number>(0);
  useEffect(() => {
    const ctx = canvasRef.current?.getContext("2d");
    const param = { ctx, height, width, bars, barColor };
    const visu = new Visualizer({
      size: bars,
      draw: getDrawMethod(param),
      volume,
    });
    setVisualize(visu);
    const audio = audioRef.current;
    if(audio) audio.volume = 0;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  useEffect(() => {
    return () => {
      visualizer && visualizer.stop();
    };
  }, [visualizer]);
  const [value, setValue] = useState<number>(0);
  const [isplay, setIsplay] = useState<boolean>(false);
  const handleChange = (event: any, newValue: number | number[]) => {
    const audio = audioRef.current;
    if (!audio) return;
    setValue(newValue as number);
    audio.currentTime = audio.duration * (newValue as number) * 0.01;
    if(isplay) {
      visualizer?.play(src, audio.currentTime)
    }
  };

  const handlePlay = () => {
    const audio = audioRef.current;
    if (!audio) return;
    setIsplay(!isplay);
    if(isplay) {
      setPauseTime(audio.currentTime)
      audio.pause();
      visualizer?.pause();
    } else {
      audio.play();
      if(audio.currentTime === 0) {
        visualizer?.play(src, audio.currentTime)
      } else {
        if(Math.abs(audio.currentTime - pauseTime) < 0.0003) {
          visualizer?.resume();
        } else {
          visualizer?.resume();
          visualizer?.play(src, audio.currentTime);
        }
      }
    }
  };
  
  const handleTimeUpdate = () => {
    const audio = audioRef.current;
    if(audio?.currentTime) {
      if((audio.currentTime - duration) >= 0) {
        setIsplay(false);
      }
      setValue((audio.currentTime / duration) * 100)
    }
  }
  const handleOnCanPlay = () => {
    setDuration(audioRef.current?.duration as number)
  }
  const audioRef = useRef<HTMLAudioElement>(null);
  return (
    <div>
      <canvas ref={canvasRef} width={width} height={height} />
      <div className={css.tools}>
        <Slider className={css.progress} value={value} onChange={handleChange} aria-labelledby="continuous-slider" />
        {isplay ? (
          <PauseCircleFilledIcon className={css.itemTool} onClick={handlePlay} />
        ) : (
          <PlayCircleFilledOutlinedIcon className={css.itemTool} onClick={handlePlay} />
        )}
      </div>
      <audio src={src} controlsList="nodownload" onCanPlay={handleOnCanPlay} onTimeUpdate={handleTimeUpdate} ref={audioRef} />
    </div>
  );
};
