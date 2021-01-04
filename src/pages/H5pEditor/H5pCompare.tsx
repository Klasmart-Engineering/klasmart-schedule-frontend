import { Button, createStyles, makeStyles, TextField } from "@material-ui/core";
import React, { useState } from "react";
import { validate } from "../../models/ModelH5pCompare";
import { H5PLibraryContent } from "../../models/ModelH5pSchema";

const useStyles = makeStyles(({ palette }) =>
  createStyles({
    pass: {
      color: "green",
    },
  })
);

interface H5pCompareProps {
  value: H5PLibraryContent;
}
export function H5pCompare(props: H5pCompareProps) {
  const { value } = props;
  const css = useStyles();
  const [targetContent, setTargetContent] = useState<string>();
  const [result, setResult] = useState<string | boolean>(true);
  const handleValidate = () => {
    if (!targetContent) return;
    const target = JSON.parse(targetContent);
    setResult(validate(value, target));
  };
  return (
    <div>
      <TextField onChange={(e) => setTargetContent(e.target.value)} />
      <Button disabled={!targetContent} onClick={handleValidate}>
        Validate
      </Button>
      {result === true ? <p className={css.pass}>pass</p> : <pre>{result}</pre>}
    </div>
  );
}
