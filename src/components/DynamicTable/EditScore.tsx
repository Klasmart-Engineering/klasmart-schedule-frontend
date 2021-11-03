import { makeStyles } from "@material-ui/core";
import TextField from "@material-ui/core/TextField";
import React from "react";
import { useDispatch } from "react-redux";
import { d } from "../../locale/LocaleManager";
import { AppDispatch } from "../../reducers";
import { actWarning } from "../../reducers/notify";
import { EditScoreProps } from "./types";

const useStyles = makeStyles({
  scoreEditBox: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
});

export function EditScore(props: EditScoreProps) {
  const {
    score,
    handleChangeScore,
    index,
    editable,
    isSubjectiveActivity,
    maxScore,
    attempted,
    isComplete,
    is_h5p,
    student_id,
    not_applicable_scoring,
    has_sub_items,
  } = props;
  const [scoreNum, setScoreNum] = React.useState<number | string | undefined>(score);
  const dispatch = useDispatch<AppDispatch>();
  const classes = useStyles();
  return (
    <div className={classes.scoreEditBox}>
      {is_h5p ? (
        has_sub_items ? (
          attempted ? (
            d("Attempted").t("assessment_activity_attempted")
          ) : (
            d("Not Attempted").t("assess_option_not_attempted")
          )
        ) : not_applicable_scoring ? (
          d("Not Applicable").t("assessment_not_applicable")
        ) : attempted ? (
          <>
            {editable && !isComplete && isSubjectiveActivity ? (
              <>
                <TextField
                  style={{ width: "59px", transform: "scale(0.8)" }}
                  value={scoreNum}
                  id="standard-size-small"
                  size="small"
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    const value = e.target.value as unknown as number;
                    if (value! > maxScore!) {
                      dispatch(actWarning(d("The score you entered cannot exceed the maximum score.").t("assess_msg_exceed_maximum")));
                    } else if (Number(value) + "" !== NaN + "") {
                      const computerValue = String(value).replace(/^(.*\..{1}).*$/, "$1");
                      handleChangeScore(Number(computerValue), index, student_id);
                      setScoreNum(computerValue);
                    }
                  }}
                />{" "}
                / {maxScore}
              </>
            ) : (
              <>
                {scoreNum} / {maxScore}
              </>
            )}
          </>
        ) : (
          d("Not Attempted").t("assess_option_not_attempted")
        )
      ) : (
        d("Not Applicable").t("assessment_not_applicable")
      )}
    </div>
  );
}
