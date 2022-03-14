import { useEffect, useRef, useState } from "react";
import getDrawMethod from "./draw";
import Visualizer from "./visualizer";

export interface AudioVisionProps {
  src: string;
  bars: number;
  barColor: string[];
  height: number;
  width: number;
  pause: boolean;
  volume: number;
  start: number;
  usePlay: boolean;
  useResume: boolean;
}
export const AudioVision = (props: AudioVisionProps) => {
  const { src, bars, barColor, height, width, pause, volume, start, usePlay, useResume } = props;
  const [visualizer, setVisualize] = useState<Visualizer>();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const ctx = canvasRef.current?.getContext("2d");
    const param = { ctx, height, width, bars, barColor };
    const visu = new Visualizer({
      size: bars,
      draw: getDrawMethod(param),
      volume,
    });
    setVisualize(visu);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
 
  useEffect(() => {
    if (pause) {
      visualizer?.pause();
    } else {
      if(start === 0){
        visualizer?.play(src);
        if(useResume) {
          visualizer?.pause()
          visualizer?.resume();
        }
      } else {
        if(usePlay) {
          visualizer?.play(src);
        } else {
          visualizer?.resume();
        }
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pause]);
  useEffect(() => {
    return () => {
      visualizer && visualizer.stop();
    };
  }, [visualizer]);
  return (
    <div>
      <canvas ref={canvasRef} width={width} height={height} />
    </div>
  );
};
