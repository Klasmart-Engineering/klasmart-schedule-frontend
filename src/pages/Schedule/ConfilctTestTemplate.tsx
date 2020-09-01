import { Button } from "@material-ui/core";
import FormControl from "@material-ui/core/FormControl";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Radio from "@material-ui/core/Radio";
import RadioGroup from "@material-ui/core/RadioGroup";
import React from "react";
export default function AlertDialog() {
  const [radioValue, setRadioValue] = React.useState("");

  return (
    <div style={{ width: "400px", padding: "0px 30px 0px 30px" }}>
      <p style={{ fontSize: "20px" }}>Edit recurring event</p>
      <div style={{ paddingLeft: "20px" }}>
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
      <div style={{ marginTop: "20px", textAlign: "right" }}>
        <Button color="primary">Cancel</Button>
        <Button color="primary">Delete</Button>
      </div>
    </div>
  );
}
