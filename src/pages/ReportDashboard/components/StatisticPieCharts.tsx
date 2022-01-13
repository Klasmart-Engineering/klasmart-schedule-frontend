import { useEffect, useRef } from "react";

interface Props {
  width: number;
  height: number;
  colors: string[];
  value: number[]; // The sum of items in the value variable must equal 100;
}

export default function StatisticPieCharts(props: Props) {
  const { value, colors } = props;
  const ref = useRef<HTMLCanvasElement | null>();

  const draw = () => {
    const context = ref.current?.getContext("2d") as CanvasRenderingContext2D;
    const MIN = Math.min(props.width, props.height);
    let endDeg,
      beginDeg = 2;
    if (context) {
      context.clearRect(0, 0, props.width, props.height);
      const radius = MIN / 2 - 12 < 0 ? 0 : MIN / 2 - 12;
      for (let i = 0; i < value.length; i++) {
        context.beginPath();
        endDeg = beginDeg + (value[i] / 100) * 2 * Math.PI;
        context.arc(props.width / 2, props.height / 2, radius, beginDeg, endDeg);
        beginDeg = endDeg;
        context.lineWidth = 12;
        context.strokeStyle = colors[i];
        context.stroke();
      }
    }
  };

  useEffect(() => {
    if (ref.current) {
      draw();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value, props.width]);

  return (
    <canvas
      width={props.width}
      height={props.height}
      ref={(node) => {
        ref.current = node;
        draw();
      }}
    ></canvas>
  );
}
