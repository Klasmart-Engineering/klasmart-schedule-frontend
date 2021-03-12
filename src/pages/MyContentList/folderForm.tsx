import { Button, createStyles, Dialog, DialogActions, DialogContent, DialogTitle, makeStyles, TextField } from "@material-ui/core";
import React, { useMemo, useState } from "react";
import { LButton } from "../../components/LButton";
import { d } from "../../locale/LocaleManager";

const useStyles = makeStyles((theme) =>
  createStyles({
    dialog: {
      minWidth: "50vw",
    },
    dialogActions: {
      width: "100%",
      padding: "16px 22px",
      display: "flex",
    },
    okBtn: {
      marginLeft: 40,
    },
  })
);

export interface FolderFormProps {
  open: boolean;
  onClose: () => any;
  onAddFolder: () => any;
}
export function FolderForm(props: FolderFormProps) {
  const css = useStyles();
  const { open, onClose, onAddFolder } = props;
  return (
    <Dialog open={open}>
      <DialogTitle>{d("New Folder").t("library_label_new_folder")}</DialogTitle>
      <DialogContent dividers>
        <form noValidate autoComplete="off">
          <TextField id="standard-basic" label="Standard" />
          <TextField id="filled-basic" label="Filled" variant="filled" />
          <TextField id="outlined-basic" label="Outlined" variant="outlined" />
        </form>
      </DialogContent>
      <DialogActions>
        <Button color="primary" variant="outlined" onClick={onClose}>
          {d("Cancel").t("library_label_cancel")}
        </Button>
        <LButton color="primary" variant="contained" className={css.okBtn} onClick={onAddFolder}>
          {d("OK").t("library_label_ok")}
        </LButton>
      </DialogActions>
    </Dialog>
  );
}

export function useFolderForm<T>() {
  const [active, setActive] = useState(false);
  const [folderFormShowIndex, setFolderFormShowIndex] = useState(2);
  return useMemo(
    () => ({
      folderFormShowIndex,
      folderFormActive: active,
      openFolderForm: () => {
        setFolderFormShowIndex(folderFormShowIndex + 1);
        setActive(true);
      },
      closeFolderForm: () => setActive(false),
    }),
    [setActive, active, folderFormShowIndex, setFolderFormShowIndex]
  );
}
