import { Button, createStyles, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, makeStyles } from "@material-ui/core";
import { AddBoxOutlined, Close, CreateNewFolderOutlined, Folder, IndeterminateCheckBoxOutlined } from "@material-ui/icons";
import { TreeItem, TreeView } from "@material-ui/lab";
import React, { useMemo, useState } from "react";
import { RecursiveFolderItem } from "../../api/extra";
import { d, reportMiss } from "../../locale/LocaleManager";

const useStyles = makeStyles((theme) =>
  createStyles({
    closeBtn: {
      position: "absolute",
      top: theme.spacing(1),
      right: theme.spacing(1),
    },
    treeItem: {
      height: 40,
      fontSize: 18,
      fontWeight: "lighter",
      lineHeight: 40 / 18,
      display: "flex",
      alignItems: "center",
    },
    dialog: {
      minWidth: "50vw",
    },
    dialogActions: {
      width: "100%",
      padding: "16px 22px",
      display: "flex",
    },
    addFolderBtn: {
      marginRight: "auto",
    },
    okBtn: {
      marginLeft: 40,
    },
    folderIcon: {
      marginRight: 10,
      color: "#FBCB2C",
    },
  })
);

const ROOT_ID = "/";

export interface FolderTreeProps {
  folders: RecursiveFolderItem[];
  rootFolderName: string;
  onClose: () => any;
  onAddFolder: (id: string) => any;
  onMove: (id: string) => any;
  open: boolean;
}
export function FolderTree(props: FolderTreeProps) {
  const css = useStyles();
  const { onClose, folders, open, onMove, onAddFolder, rootFolderName } = props;
  const [value, setValue] = useState(ROOT_ID);
  function renderItemList(folderList: RecursiveFolderItem[]) {
    if (folderList.length === 0) return null;
    return folderList.map((folder) => (
      <TreeItem
        key={folder.id}
        nodeId={folder.id as string}
        label={
          <div className={css.treeItem}>
            <Folder className={css.folderIcon} />
            {folder.name}
          </div>
        }
      >
        {renderItemList(folder.next)}
      </TreeItem>
    ));
  }
  return (
    <Dialog open={open}>
      <DialogTitle>
        {reportMiss("Move To", "library_label_move_to")}
        <IconButton onClick={onClose} className={css.closeBtn}>
          <Close />
        </IconButton>
      </DialogTitle>
      <DialogContent dividers>
        <div className={css.dialog}>
          <TreeView
            defaultCollapseIcon={<IndeterminateCheckBoxOutlined />}
            defaultExpandIcon={<AddBoxOutlined />}
            defaultExpanded={[ROOT_ID]}
            onNodeSelect={(e: any, id: string) => setValue(id)}
          >
            <TreeItem nodeId={ROOT_ID} label={rootFolderName}>
              {renderItemList(folders)}
            </TreeItem>
          </TreeView>
        </div>
      </DialogContent>
      <DialogActions>
        <div className={css.dialogActions}>
          <Button
            color="primary"
            variant="outlined"
            startIcon={<CreateNewFolderOutlined />}
            className={css.addFolderBtn}
            onClick={() => onAddFolder(value)}
          >
            {reportMiss("Add a Folder", "library_label_add_folder")}
          </Button>
          <Button color="primary" variant="outlined" onClick={onClose}>
            {d("Cancel").t("library_label_cancel")}
          </Button>
          <Button color="primary" variant="contained" className={css.okBtn} onClick={() => onMove(value)}>
            {d("OK").t("library_label_ok")}
          </Button>
        </div>
      </DialogActions>
    </Dialog>
  );
}

export function useFolderTree() {
  const [active, setActive] = useState(false);
  return useMemo(
    () => ({
      folderTreeActive: active,
      openFolderTree: () => setActive(true),
      closeFolderTree: () => setActive(false),
    }),
    [setActive, active]
  );
}
