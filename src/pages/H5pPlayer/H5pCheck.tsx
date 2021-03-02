import { Box, Button, ButtonProps } from "@material-ui/core";
import { Check, Replay, ShowChart } from "@material-ui/icons";
import React, { useState } from "react";

interface H5pCheckProps {
  data: H5pCheckData;
  onCheck: () => any;
  onShowSolution: ButtonProps["onClick"];
  onRetry: ButtonProps["onClick"];
}
interface H5pCheckData {
  checkAnswer?: string;
  tryAgain?: string;
  showSolution?: string;
  score?: string;
}
export function H5pCheck(props: H5pCheckProps) {
  const { data, onShowSolution, onRetry } = props;
  const [showCheck, SetShowCheck] = useState<Boolean>(true);
  const handleCheck = () => {
    SetShowCheck(!showCheck);
  };
  return (
    <Box p={3}>
      {showCheck ? (
        <Button variant="contained" color="primary" startIcon={<Check />} onClick={handleCheck}>
          {data.checkAnswer}
        </Button>
      ) : (
        <Box display="flex">
          <Button variant="contained" color="primary" startIcon={<Replay />} onClick={onRetry}>
            {data.tryAgain}
          </Button>
          <Button variant="contained" color="primary" startIcon={<ShowChart />} onClick={onShowSolution}>
            {data.showSolution}
          </Button>
        </Box>
      )}
    </Box>
  );
}
