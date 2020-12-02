import { Box, FormControl, makeStyles, Select, Typography } from "@material-ui/core";
import React, { useCallback } from "react";
import noOutcomes from "../../assets/icons/noLearningOutcomes.svg";
import { d } from "../../locale/LocaleManager";

const useStyles = makeStyles(({ palette, shadows }) => ({
  noOutComesImage: {
    marginTop: 100,
    marginBottom: 20,
    width: 578,
    height: 578,
  },
  emptyDesc: {
    position: "absolute",
    bottom: 100,
  },
  selectButton: {
    width: 160,
    marginBotton: 20,
    backgroundColor: "white",
    borderRadius: 4,
    boxShadow: shadows[3],
    color: palette.text.primary,
  },
}));

export function NoOutComesList() {
  const css = useStyles();
  return (
    <Box display="flex" flexDirection="column" alignItems="center" position="relative">
      <img className={css.noOutComesImage} alt="empty" src={noOutcomes} />
      <Typography className={css.emptyDesc} variant="body1" color="textSecondary">
        {d("No learning outcome is available.").t("assess_msg_no_lo")}
      </Typography>
    </Box>
  );
}
export interface OutcomesFilterProps {
  value: string;
  onChange?: (vale: OutcomesFilterProps["value"]) => any;
}
export function OutcomesFilter(props: OutcomesFilterProps) {
  const css = useStyles();
  const { onChange } = props;
  const value = props.value ?? "all";
  const handleChange = useCallback(
    (e) => {
      if (onChange) onChange(e.target.value);
    },
    [onChange]
  );
  return (
    <Box display="flex" justifyContent="flex-end" mb={2}>
      <FormControl variant="outlined" size="small" className={css.selectButton}>
        <Select native defaultValue={value} onChange={handleChange}>
          <option value="all">{d("All").t("assess_filter_all")} </option>
          <option value="assumed">{d("Assumed").t("assess_label_assumed")} </option>
          <option value="unassumed">{d("Unassumed").t("assess_filter_unassumed")}</option>
        </Select>
      </FormControl>
    </Box>
  );
}
