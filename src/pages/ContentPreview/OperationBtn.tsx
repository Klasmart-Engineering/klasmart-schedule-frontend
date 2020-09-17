import { Box, fade, makeStyles } from "@material-ui/core";
import { Palette, PaletteColor } from "@material-ui/core/styles/createPalette";
import clsx from "clsx";
import React from "react";
import { LButton } from "../../components/LButton";
import { Assets } from "../MyContentList/types";
const createContainedColor = (paletteColor: PaletteColor, palette: Palette) => ({
  color: palette.common.white,
  backgroundColor: paletteColor.main,
  "&:hover": {
    backgroundColor: paletteColor.dark,
  },
});

const createOutlinedColor = (paletteColor: PaletteColor, palette: Palette) => ({
  color: paletteColor.main,
  borderColor: paletteColor.light,
  "&:hover": {
    borderColor: paletteColor.main,
    backgroundColor: fade(paletteColor.main, palette.action.hoverOpacity),
  },
});
const useStyles = makeStyles(({ palette }) => ({
  btn: {
    marginLeft: "10px",
    cursor: "pointer",
  },
  rejectBtn: createContainedColor(palette.error, palette),
  approveBtn: createContainedColor(palette.success, palette),
  publistedBtn: createContainedColor(palette.success, palette),
  editBtn: createContainedColor(palette.primary, palette),
  deleteBtn: createOutlinedColor(palette.error, palette),
}));

export interface ActionProps {
  publish_status?: "published" | "pending" | "draft" | "archive" | "rejected";
  content_type_name?: string;
  onDelete: () => any;
  onPublish: () => any;
  onApprove: () => any;
  onReject: () => any;
  onEdit: () => any;
}
export function OperationBtn(props: ActionProps) {
  const css = useStyles();
  const { publish_status, content_type_name, onDelete, onPublish, onApprove, onReject, onEdit } = props;
  return (
    <Box display="flex" justifyContent="flex-end">
      {publish_status === "published" && (
        <LButton variant="outlined" className={clsx(css.btn, css.deleteBtn)} onClick={onDelete}>
          Remove
        </LButton>
      )}
      {(publish_status === "draft" || publish_status === "pending" || publish_status === "rejected" || publish_status === "archive") && (
        <LButton variant="outlined" className={clsx(css.btn, css.deleteBtn)} onClick={onDelete}>
          Delete
        </LButton>
      )}
      {publish_status === "pending" && (
        <LButton variant="contained" className={clsx(css.btn, css.rejectBtn)} onClick={onReject}>
          Reject
        </LButton>
      )}
      {(publish_status === "published" ||
        publish_status === "draft" ||
        publish_status === "rejected" ||
        content_type_name === Assets.assets_name) && (
        <LButton variant="contained" className={clsx(css.btn, css.editBtn)} onClick={onEdit}>
          Edit
        </LButton>
      )}
      {publish_status === "pending" && (
        <LButton variant="contained" className={clsx(css.btn, css.approveBtn)} onClick={onApprove}>
          Approve
        </LButton>
      )}
      {publish_status === "archive" && (
        <LButton variant="contained" className={clsx(css.btn, css.publistedBtn)} onClick={onPublish}>
          Republish
        </LButton>
      )}
    </Box>
  );
}
