import { FormControlLabel, makeStyles, Radio, RadioGroup, Typography, useMediaQuery, useTheme } from "@material-ui/core";
import React from "react";
const useStyles = makeStyles(({ palette, breakpoints }) => ({
  radioGroup: {
    flexDirection: "row",
    padding: "7px 0",
  },
  radio: {
    "&:not(:first-child)": {
      marginLeft: 64,
    },
    [breakpoints.down("sm")]: {
      marginLeft: "0 !important",
      marginRight: 0,
    },
  },
  h5pRadio: {
    fontWeight: 700,
  },
  formControlLabel: {
    marginTop: 20,
  },
}));
export enum RadioValue {
  lessonPlan = "lessonPlan",
  score = "score",
}
interface RadioHeaderProps {
  value: RadioValue;
  onChange: (value: RadioValue) => any;
}
export default function RadioHeader(props: RadioHeaderProps) {
  const { value, onChange } = props;
  const css = useStyles();
  const { breakpoints } = useTheme();
  const xs = useMediaQuery(breakpoints.down("xs"));
  const size = xs ? "small" : "medium";
  const radioTypography = xs ? "subtitle2" : "h6";
  return (
    <div>
      <RadioGroup className={css.radioGroup} defaultValue={value} onChange={(e) => onChange(e.target.value as RadioValue)}>
        <FormControlLabel
          className={css.radio}
          color="primary"
          control={<Radio size={size} color="primary" value={RadioValue.lessonPlan} />}
          label={
            <Typography variant={radioTypography} className={css.h5pRadio}>
              {"Lesson Plan Assessment"}
            </Typography>
          }
        />
        <FormControlLabel
          className={css.radio}
          color="primary"
          control={<Radio size={size} color="primary" value={RadioValue.score} />}
          label={
            <Typography variant={radioTypography} className={css.h5pRadio}>
              {"Score Assessment"}
            </Typography>
          }
        />
      </RadioGroup>
    </div>
  );
}
