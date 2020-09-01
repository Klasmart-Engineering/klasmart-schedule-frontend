import FormControl from "@material-ui/core/FormControl";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Radio from "@material-ui/core/Radio";
import RadioGroup from "@material-ui/core/RadioGroup";
import React from "react";
export default function AlertDialog() {
  const [radioValue, setRadioValue] = React.useState("");

  return (
    <div>
      <FormControl component="fieldset">
        <RadioGroup
          aria-label="gender"
          name="gender1"
          value={radioValue}
          onChange={(event: React.ChangeEvent<HTMLInputElement>) => setRadioValue(event.target.value)}
        >
          <FormControlLabel value="only_current" control={<Radio />} label="This event" />
          <FormControlLabel value="with_following" control={<Radio />} label="This and following events" />
        </RadioGroup>
      </FormControl>
    </div>
  );
}
