import { Box, Button, fade, makeStyles } from "@material-ui/core";
import { Palette, PaletteColor } from "@material-ui/core/styles/createPalette";
import clsx from "clsx";
import React from "react";
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

interface ActionProps {
  publish_status?: "published" | "pending" | "draft" | "archive" | "rejected";
  handleAction: (type: string) => void;
}
export function OperationBtn(props: ActionProps) {
  const css = useStyles();
  const { publish_status, handleAction } = props;
  const handleDelete = () => {
    handleAction("delete");
  };
  const handleRepublish = () => {
    handleAction("publish");
  };
  const handelApprove = () => {
    handleAction("approve");
  };
  const handleReject = () => {
    handleAction("reject");
  };
  const handleEdit = () => {
    handleAction("edit");
  };
  return (
    <Box display="flex" justifyContent="flex-end">
      {publish_status === "published" && (
        <Button variant="outlined" className={clsx(css.btn, css.deleteBtn)} onClick={handleDelete}>
          Remove
        </Button>
      )}
      {(publish_status === "draft" || publish_status === "pending" || publish_status === "rejected" || publish_status === "archive") && (
        <Button variant="outlined" className={clsx(css.btn, css.deleteBtn)} onClick={handleDelete}>
          Delete
        </Button>
      )}
      {(publish_status === "rejected" || publish_status === "pending") && (
        <Button variant="contained" className={clsx(css.btn, css.rejectBtn)} onClick={handleReject}>
          Reject
        </Button>
      )}
      {(publish_status === "published" || publish_status === "draft" || publish_status === "rejected") && (
        <Button variant="contained" className={clsx(css.btn, css.editBtn)} onClick={handleEdit}>
          Edit
        </Button>
      )}
      {publish_status === "pending" && (
        <Button variant="contained" className={clsx(css.btn, css.approveBtn)} onClick={handelApprove}>
          Approve
        </Button>
      )}
      {publish_status === "archive" && (
        <Button variant="contained" className={clsx(css.btn, css.publistedBtn)} onClick={handleRepublish}>
          Republish
        </Button>
      )}
    </Box>
  );
}
