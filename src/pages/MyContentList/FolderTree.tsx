import { Button, createStyles, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, makeStyles } from "@material-ui/core";
import { AddBoxOutlined, Close, CreateNewFolderOutlined, Folder, IndeterminateCheckBoxOutlined } from "@material-ui/icons";
import { TreeItem, TreeView } from "@material-ui/lab";
import React, { useMemo, useState } from "react";
import { RecursiveFolderItem } from "../../api/extra";
import { LButton, LButtonProps } from "../../components/LButton";
import { d } from "../../locale/LocaleManager";

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

export const ROOT_ID = "/";

export interface FolderTreeProps {
  folders: RecursiveFolderItem[];
  rootFolderName: string;
  onClose: () => any;
  onAddFolder: (id: string) => any;
  onMove: (id: string) => ReturnType<LButtonProps["onClick"]>;
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
        {d("Move to").t("library_label_move")}
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
            {d("New Folder").t("library_label_new_folder")}
          </Button>
          <Button color="primary" variant="outlined" onClick={onClose}>
            {d("Cancel").t("library_label_cancel")}
          </Button>
          <LButton color="primary" variant="contained" className={css.okBtn} onClick={() => onMove(value)}>
            {d("OK").t("library_label_ok")}
          </LButton>
        </div>
      </DialogActions>
    </Dialog>
  );
}

export function useFolderTree<T>() {
  const [active, setActive] = useState(false);
  const [folderTreeShowIndex, setFolderTreeShowIndex] = useState(0);
  const [referContent, setReferContent] = useState<T>();
  return useMemo(
    () => ({
      folderTreeShowIndex,
      folderTreeActive: active,
      openFolderTree: () => {
        setFolderTreeShowIndex(folderTreeShowIndex + 1);
        setActive(true);
      },
      closeFolderTree: () => setActive(false),
      setReferContent,
      referContent,
    }),
    [setActive, active, referContent, setReferContent, folderTreeShowIndex, setFolderTreeShowIndex]
  );
}
