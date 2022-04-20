import { Button } from "@material-ui/core";
import FormControl from "@material-ui/core/FormControl";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Radio from "@material-ui/core/Radio";
import RadioGroup from "@material-ui/core/RadioGroup";
import React from "react";
import { d } from "@locale/LocaleManager";
import { repeatOptionsType } from "../../types/scheduleTypes";

interface InfoProps {
  handleDelete: (repeat_edit_options: repeatOptionsType) => void;
  handleClose: () => void;
  title: string;
}

export default function AlertDialog(props: InfoProps) {
  const { handleDelete, handleClose, title } = props;
  const [radioValue, setRadioValue] = React.useState<repeatOptionsType>("only_current");

  const deleteSchedule = () => {
    handleDelete(radioValue);
  };

  return (
    <div style={{ width: "400px", padding: "0px 30px 0px 30px" }}>
      <p style={{ fontSize: "20px" }}>
        {/* {title} recurring event */}
        {title === "Edit"
          ? d("Edit recurring event").t("schedule_msg_edit_recurring")
          : d("Delete recurring event").t("schedule_msg_delete_recurring")}
      </p>
      <div style={{ paddingLeft: "20px" }}>
        <FormControl component="fieldset">
          <RadioGroup
            aria-label="gender"
            name="gender1"
            value={radioValue}
            onChange={(event: React.ChangeEvent<HTMLInputElement>) => setRadioValue(event.target.value as repeatOptionsType)}
          >
            <FormControlLabel value="only_current" control={<Radio />} label={d("This event").t("schedule_option_this_event")} />
            <FormControlLabel
              value="with_following"
              control={<Radio />}
              label={d("This and following events").t("schedule_option_all_events")}
            />
          </RadioGroup>
        </FormControl>
      </div>
      <div style={{ marginTop: "20px", textAlign: "right" }}>
        <Button color="primary" onClick={handleClose}>
          {d("Cancel").t("assess_label_cancel")}
        </Button>
        <Button color="primary" onClick={deleteSchedule}>
          {/* {title === "Edit" ? "Continue" : title} */}
          {title === "Edit" ? d("CONFIRM").t("schedule_button_confirm") : d("Delete").t("assess_label_delete")}
        </Button>
      </div>
    </div>
  );
}
