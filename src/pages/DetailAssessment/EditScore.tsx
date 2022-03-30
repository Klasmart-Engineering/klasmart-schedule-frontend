import { makeStyles } from "@material-ui/core";
import TextField from "@material-ui/core/TextField";
import React, { ChangeEvent } from "react";
import { useDispatch } from "react-redux";
import { d } from "../../locale/LocaleManager";
import { AppDispatch } from "../../reducers";
import { actWarning } from "../../reducers/notify";
import { EditScoreProps, FileTypes } from "./type";

const useStyles = makeStyles({
  scoreEditBox: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
});

export function EditScore(props: EditScoreProps) {
  const {
    fileType,
    score,
    onChangeScore,
    editable,
    maxScore,
    attempted,
    // isComplete,
    studentId,
    contentId,
    subType,
  } = props;
  // const [scoreNum, setScoreNum] = React.useState<number | string | undefined>(score);
  const dispatch = useDispatch<AppDispatch>();
  const classes = useStyles();
  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value as unknown as number;
    if (value! > maxScore!) {
      dispatch(actWarning(d("The score you entered cannot exceed the maximum score.").t("assess_msg_exceed_maximum")));
    } else if (Number(value) + "" !== NaN + "") {
      onChangeScore(value, studentId, contentId);
    }
  };
  const subjectiveActivity = (type?: string) => {
    return ["Essay", "SpeakTheWords"].includes(type ?? "");
  };
  const showNotApplicable =
    fileType === FileTypes.Unknown || fileType === FileTypes.NotChildContainer || fileType === FileTypes.NotSupportScoreStandAlone;
  return (
    <div className={classes.scoreEditBox}>
      {showNotApplicable ? (
        d("Not Applicable").t("assessment_not_applicable")
      ) : !attempted ? (
        d("Not Attempted").t("assess_detail_not_attempted")
      ) : fileType === FileTypes.HasChildContainer ? (
        d("Attempted").t("assessment_activity_attempted")
      ) : editable && subjectiveActivity(subType) ? (
        <>
          <TextField style={{ width: "59px", transform: "scale(0.8)" }} value={score} size="small" onChange={handleChange} />/{maxScore}
        </>
      ) : maxScore === 0 ? (
        d("Attempted").t("assessment_activity_attempted")
      ) : (
        `${score} / ${maxScore}`
      )}
    </div>
  );
}
