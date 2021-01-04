import { Button, createStyles, Grid, makeStyles, TextField } from "@material-ui/core";
import React, { Fragment, useState } from "react";
import { H5pValidateResult, validate } from "../../models/ModelH5pCompare";
import { H5PLibraryContent } from "../../models/ModelH5pSchema";

const useStyles = makeStyles(({ palette }) =>
  createStyles({
    compare: {
      paddingTop: 40,
      paddingLeft: "25%",
      paddingRight: "25%",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
    },
    pass: {
      color: "green",
    },
    fail: {
      color: "red",
    },
    errorTips: {
      display: "flex",
      justifyContent: "space-around",
    },
    errorTipItem: {
      width: "45%",
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
  const [result, setResult] = useState<H5pValidateResult>();
  const handleValidate = () => {
    if (!targetContent || !value) return;
    const target = JSON.parse(targetContent);
    setResult(validate(value, target));
  };
  return (
    <div className={css.compare}>
      <Grid container justify="space-around">
        <Grid item xs={1}>
          <Button size="large" variant="contained" color="primary" disabled={!targetContent || !value} onClick={handleValidate}>
            Validate
          </Button>
        </Grid>
        <Grid item xs={10}>
          <TextField size="small" onChange={(e) => setTargetContent(e.target.value)} fullWidth />
        </Grid>
      </Grid>
      {result === true ? (
        <p className={css.pass}>pass</p>
      ) : (
        <Fragment>
          {!!targetContent && !!value && <p className={css.fail}>fail!</p>}
          {typeof result === "object" && (
            <div className={css.errorTips}>
              <div className={css.errorTipItem}>
                目标格式：
                <br />
                <pre>{result?.targetJSON}</pre>
              </div>
              <div className={css.errorTipItem}>
                当前格式: <br />
                <pre>{result?.currentJSON}</pre>
              </div>
            </div>
          )}
        </Fragment>
      )}
    </div>
  );
}
