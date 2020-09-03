import { Button, TextField } from "@material-ui/core";
import React from "react";

interface CustomizeRejectTemplateProps {
  handleClose: () => void;
}

export default function CustomizeRejectTemplate(props: CustomizeRejectTemplateProps) {
  const { handleClose } = props;

  return (
    <div style={{ width: "400px", padding: "0px 30px 0px 0px" }}>
      <h2 style={{ fontSize: "20px" }}>Edit recurring event</h2>
      <p>Please specify the reason of rejection.</p>
      <div>
        <TextField id="standard-basic" label="Reason" autoFocus variant="standard" fullWidth />
      </div>
      <div style={{ marginTop: "20px", textAlign: "right" }}>
        <Button color="primary" onClick={handleClose}>
          Cancel
        </Button>
        <Button color="primary" onClick={handleClose}>
          Ok
        </Button>
      </div>
    </div>
  );
}
