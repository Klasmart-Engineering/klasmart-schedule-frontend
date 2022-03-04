import { Box, fade, IconButton, makeStyles } from "@material-ui/core";
import { Palette, PaletteColor } from "@material-ui/core/styles/createPalette";
import ClearIcon from "@material-ui/icons/Clear";
import DeleteOutlineIcon from "@material-ui/icons/DeleteOutline";
import DoneIcon from "@material-ui/icons/Done";
import EditOutlinedIcon from "@material-ui/icons/EditOutlined";
import PublishOutlinedIcon from "@material-ui/icons/PublishOutlined";
import RemoveCircleOutlineIcon from "@material-ui/icons/RemoveCircleOutline";
import clsx from "clsx";
import React from "react";
import { EntityContentInfoWithDetails, EntityContentPermission } from "../../api/api.auto";
import { Author, ContentType, PublishStatus } from "../../api/type";
import { LButton } from "../../components/LButton";
import { d } from "../../locale/LocaleManager";
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
  remove: {
    color: "#D32F2F",
  },
  unarchive: {
    color: "#0E78D5",
  },
  rePublishColor: {
    color: "#0E78D5",
  },
  editMbBtn: {
    width: "24px",
    height: 32,
    fontSize: "12px",
  },
  approveIconColor: {
    color: "#4CAF50",
  },
  rejectColor: {
    color: "#D32F2F",
  },
  mbBtn: {
    padding: 0,
    fontSize: 12,
    marginRight: "5px",
  },
}));

export interface ActionProps {
  permission?: EntityContentPermission;
  author: string | null;
  isMine: boolean | undefined;
  publish_status: EntityContentInfoWithDetails["publish_status"];
  content_type?: EntityContentInfoWithDetails["content_type"];
  onDelete: () => any;
  onPublish: () => any;
  onApprove: () => any;
  onReject: () => any;
  onEdit: () => any;
}
export function OperationBtn(props: ActionProps) {
  const css = useStyles();
  const { permission, author, publish_status, content_type, onDelete, onPublish, onApprove, onReject, onEdit } = props;
  return (
    <Box display="flex" justifyContent="flex-end">
      {publish_status === PublishStatus.published && permission?.allow_delete && (
        <LButton variant="outlined" className={clsx(css.btn, css.deleteBtn)} onClick={onDelete}>
          {d("Remove").t("library_label_remove")}
        </LButton>
      )}
      {(publish_status === PublishStatus.draft ||
        (publish_status === PublishStatus.pending && author === Author.self) ||
        publish_status === PublishStatus.rejected) && (
        <LButton variant="outlined" className={clsx(css.btn, css.deleteBtn)} onClick={onDelete}>
          {d("Delete").t("library_label_delete")}
        </LButton>
      )}

      {publish_status === PublishStatus.archive && permission?.allow_delete && (
        <LButton variant="outlined" className={clsx(css.btn, css.deleteBtn)} onClick={onDelete}>
          {d("Delete").t("library_label_delete")}
        </LButton>
      )}
      {publish_status === PublishStatus.pending && author !== Author.self && permission?.allow_reject && (
        <LButton variant="contained" className={clsx(css.btn, css.rejectBtn)} onClick={onReject}>
          {d("Reject").t("library_label_reject")}
        </LButton>
      )}

      {publish_status === PublishStatus.published && content_type === ContentType.plan && permission?.allow_edit && (
        <LButton variant="contained" className={clsx(css.btn, css.editBtn)} onClick={onEdit}>
          {d("Edit").t("library_label_edit")}
        </LButton>
      )}

      {publish_status === PublishStatus.published && content_type === ContentType.material && permission?.allow_edit && (
        <LButton variant="contained" className={clsx(css.btn, css.editBtn)} onClick={onEdit}>
          {d("Edit").t("library_label_edit")}
        </LButton>
      )}
      {(publish_status === PublishStatus.draft || publish_status === PublishStatus.rejected) && (
        <LButton variant="contained" className={clsx(css.btn, css.editBtn)} onClick={onEdit}>
          {d("Edit").t("library_label_edit")}
        </LButton>
      )}
      {publish_status === PublishStatus.pending &&
        // author !== Author.self &&
        permission?.allow_approve && (
          <LButton variant="contained" className={clsx(css.btn, css.approveBtn)} onClick={onApprove}>
            {d("Approve").t("library_label_approve")}
          </LButton>
        )}

      {publish_status === PublishStatus.archive && permission?.allow_republish && (
        <LButton variant="contained" className={clsx(css.btn, css.publistedBtn)} onClick={onPublish}>
          {d("Republish").t("library_label_republish")}
        </LButton>
      )}
    </Box>
  );
}

export function OperationBtnMb(props: ActionProps) {
  const css = useStyles();
  const { permission, author, publish_status, content_type, onDelete, onPublish, onApprove, onReject, onEdit } = props;
  return (
    <Box display="flex" justifyContent="flex-end">
      {publish_status === PublishStatus.published && permission?.allow_delete && (
        <LButton as={IconButton} replace className={clsx(css.remove, css.mbBtn)} onClick={onDelete}>
          <RemoveCircleOutlineIcon />
        </LButton>
      )}
      {(publish_status === PublishStatus.draft ||
        (publish_status === PublishStatus.pending && author === Author.self) ||
        publish_status === PublishStatus.rejected) && (
        <LButton as={IconButton} replace className={clsx(css.remove, css.mbBtn)} onClick={onDelete}>
          <DeleteOutlineIcon />
        </LButton>
      )}
      {publish_status === PublishStatus.archive && permission?.allow_delete && (
        <LButton as={IconButton} replace className={clsx(css.remove, css.mbBtn)} onClick={onDelete}>
          <DeleteOutlineIcon onClick={onDelete} />
        </LButton>
      )}
      {publish_status === PublishStatus.pending && author !== Author.self && permission?.allow_reject && (
        <LButton as={IconButton} replace className={clsx(css.rejectColor, css.mbBtn)} onClick={onReject}>
          <ClearIcon />
        </LButton>
      )}
      {publish_status === PublishStatus.published && content_type === ContentType.plan && permission?.allow_edit && (
        <LButton as={IconButton} replace className={clsx(css.mbBtn)} onClick={onEdit}>
          <EditOutlinedIcon onClick={onEdit} />
        </LButton>
      )}
      {publish_status === PublishStatus.published && content_type === ContentType.material && permission?.allow_edit && (
        <LButton as={IconButton} replace className={clsx(css.mbBtn)} onClick={onEdit}>
          <EditOutlinedIcon onClick={onEdit} />
        </LButton>
      )}
      {(publish_status === PublishStatus.draft || publish_status === PublishStatus.rejected) && (
        <LButton as={IconButton} replace className={clsx(css.mbBtn)} onClick={onEdit}>
          <EditOutlinedIcon onClick={onEdit} />
        </LButton>
      )}
      {publish_status === PublishStatus.pending && permission?.allow_approve && (
        <LButton as={IconButton} replace className={clsx(css.approveIconColor, css.mbBtn)} onClick={onApprove}>
          <DoneIcon />
        </LButton>
      )}
      {publish_status === PublishStatus.archive && permission?.allow_republish && (
        <LButton as={IconButton} replace className={clsx(css.rePublishColor, css.mbBtn)} onClick={onPublish}>
          <PublishOutlinedIcon />
        </LButton>
      )}
    </Box>
  );
}
