import { Grid } from "@material-ui/core";
import { createStyles, makeStyles } from "@material-ui/core/styles";
import React from "react";

const useStyle = makeStyles(() =>
  createStyles({
    dataBlock: {
      display: "flex",
      alignItems: "flex-start",
    },
    blockRight: {
      maxWidth: "227px",
      color: "#666666",
      wordWrap: "break-word",
      wordBreak: "normal",
    },
    square: {
      height: "12px",
      width: "12px",
      minWidth: "12px",
      maxWidth: "12px",
      marginTop: "6px",
      marginRight: "16px",
    },
    blockCount: {
      fontSize: "20px",
      fontWeight: "bold",
      marginTop: "10px",
      color: "#000",
    },
    totalType: {
      paddingTop: "20px",
      borderTop: "1px solid #e9e9e9",
    },
  })
);

interface ITotalType {
  totalType: { label: string; data: string | number; idx: number }[];
  colors: string[];
  isLearningOutcomeAchieved: boolean;
}

export default function LearningOutcomeAchievedTotalType(props: ITotalType) {
  const css = useStyle();
  const { totalType, colors, isLearningOutcomeAchieved } = props;
  const renderLineFooterBlock = (content: string, count: string | number, index: number) => {
    return (
      <div className={css.dataBlock} key={index}>
        <div
          className={css.square}
          style={{
            background: colors[index],
            border: isLearningOutcomeAchieved && index === 1 ? "1px solid #0e78d5" : "",
            boxSizing: "border-box",
          }}
        ></div>
        <div className={css.blockRight}>
          {content}
          <div className={css.blockCount}>{count}</div>
        </div>
      </div>
    );
  };
  return (
    <div>
      <Grid container wrap={"nowrap"} justify={"space-around"} className={css.totalType}>
        {totalType.map((item) => {
          return renderLineFooterBlock(item.label, item.data, item.idx);
        })}
      </Grid>
    </div>
  );
}
