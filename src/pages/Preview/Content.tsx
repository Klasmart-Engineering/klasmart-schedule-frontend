import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import { Close } from "@material-ui/icons";
import { useHistory } from "react-router-dom";

const useStyles = makeStyles((theme) => ({
  preview: {
    backgroundColor: "#032440",
    height: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "column",
  },
  content: {
    width: "60%",
    height: "60%",
  },
  butGroup: {
    display: "flex",
    marginTop: "5%",
  },
  previewButton: {
    marginLeft: "20px",
    borderRadius: "20px",
    width: "120px",
  },
  closeButton: {
    position: "absolute",
    top: 6,
    left: 8,
    color: "white",
  },
}));

function ButtonGroup(Props: ModelProps) {
  const { model } = Props;
  const css = useStyles();
  return (
    <div className={css.butGroup}>
      <Button variant="outlined" color="primary" className={css.previewButton}>
        OK
      </Button>
      <Button
        variant="outlined"
        color="secondary"
        className={css.previewButton}
      >
        Delete
      </Button>
      <Button variant="contained" color="primary" className={css.previewButton}>
        Go editing
      </Button>
      <Button variant="contained" color="primary" className={css.previewButton}>
        Go back
      </Button>
      <Button variant="contained" color="primary" className={css.previewButton}>
        Select
      </Button>
      <Button variant="contained" color="primary" className={css.previewButton}>
        Select
      </Button>
      <Button variant="contained" color="primary" className={css.previewButton}>
        See Detalls
      </Button>
    </div>
  );
}

/**
 * close button template
 * @constructor
 */
function CloseButton() {
  const css = useStyles();
  const history = useHistory();
  const close = () => {
    history.goBack();
  };
  return (
    <Button
      color="default"
      startIcon={<Close />}
      className={css.closeButton}
      onClick={close}
    >
      Preview
    </Button>
  );
}

interface ModelProps {
  model: string;
}
export default function Content(Props: ModelProps) {
  const css = useStyles();
  const { model } = Props;
  return (
    <div className={css.preview}>
      <CloseButton />
      <div className={css.content}>
        <iframe
          src="https://beta-hub.kidsloop.net/?component=library"
          title="iframe example 1"
          style={{ width: "100%", height: "100%" }}
        >
          <p>Your browser does not support iframes.</p>
        </iframe>
      </div>
      <ButtonGroup model={model} />
    </div>
  );
}
