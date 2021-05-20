import { Box, fade, makeStyles } from "@material-ui/core";
import { Palette, PaletteColor } from "@material-ui/core/styles/createPalette";
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
