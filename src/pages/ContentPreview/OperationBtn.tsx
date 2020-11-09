import { Box, fade, makeStyles } from "@material-ui/core";
import { Palette, PaletteColor } from "@material-ui/core/styles/createPalette";
import clsx from "clsx";
import React from "react";
import { EntityContentInfoWithDetails } from "../../api/api.auto";
import { ContentType, PublishStatus } from "../../api/type";
import { LButton } from "../../components/LButton";
import { Permission, PermissionOr, PermissionType } from "../../components/Permission";
import { d } from "../../locale/LocaleManager";
import { PublishScope } from "../MyContentList/types";

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
  scope: string;
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
  const { scope, publish_status, content_type, onDelete, onPublish, onApprove, onReject, onEdit } = props;
  return (
    <Box display="flex" justifyContent="flex-end">
      {(scope === PublishScope.organization || scope === PublishScope.tempArgument) && publish_status === PublishStatus.published && (
        <Permission value={PermissionType.archive_published_content_273}>
          <LButton variant="outlined" className={clsx(css.btn, css.deleteBtn)} onClick={onDelete}>
            {d("Remove").t("library_label_remove")}
          </LButton>
        </Permission>
      )}
      {(scope === PublishScope.organization || scope === PublishScope.tempArgument) &&
        (publish_status === PublishStatus.draft ||
          publish_status === PublishStatus.pending ||
          publish_status === PublishStatus.rejected) && (
          <LButton variant="outlined" className={clsx(css.btn, css.deleteBtn)} onClick={onDelete}>
            {d("Delete").t("library_label_delete")}
          </LButton>
        )}
      {(scope === PublishScope.organization || scope === PublishScope.tempArgument) && publish_status === PublishStatus.archive && (
        <Permission value={PermissionType.delete_archived_content_275}>
          <LButton variant="outlined" className={clsx(css.btn, css.deleteBtn)} onClick={onDelete}>
            {d("Delete").t("library_label_delete")}
          </LButton>
        </Permission>
      )}
      {(scope === PublishScope.organization || scope === PublishScope.tempArgument) && publish_status === PublishStatus.pending && (
        <Permission value={PermissionType.reject_pending_content_272}>
          <LButton variant="contained" className={clsx(css.btn, css.rejectBtn)} onClick={onReject}>
            {d("Reject").t("library_label_reject")}
          </LButton>
        </Permission>
      )}
      {(scope === PublishScope.organization || scope === PublishScope.tempArgument) &&
        publish_status === PublishStatus.published &&
        content_type === ContentType.plan && (
          <PermissionOr
            value={[
              PermissionType.edit_org_published_content_235,
              PermissionType.edit_lesson_plan_metadata_237,
              PermissionType.edit_lesson_plan_content_238,
            ]}
          >
            <LButton variant="contained" className={clsx(css.btn, css.editBtn)} onClick={onEdit}>
              {d("Edit").t("library_label_edit")}
            </LButton>
          </PermissionOr>
        )}
      {(scope === PublishScope.organization || scope === PublishScope.tempArgument) &&
        publish_status === PublishStatus.published &&
        content_type === ContentType.material && (
          <PermissionOr
            value={[PermissionType.edit_org_published_content_235, PermissionType.edit_lesson_material_metadata_and_content_236]}
          >
            <LButton variant="contained" className={clsx(css.btn, css.editBtn)} onClick={onEdit}>
              {d("Edit").t("library_label_edit")}
            </LButton>
          </PermissionOr>
        )}
      {(scope === PublishScope.organization || scope === PublishScope.tempArgument) &&
        (publish_status === PublishStatus.draft || publish_status === PublishStatus.rejected) && (
          <LButton variant="contained" className={clsx(css.btn, css.editBtn)} onClick={onEdit}>
            {d("Edit").t("library_label_edit")}
          </LButton>
        )}
      {(scope === PublishScope.organization || scope === PublishScope.tempArgument) && publish_status === PublishStatus.pending && (
        <Permission value={PermissionType.approve_pending_content_271}>
          <LButton variant="contained" className={clsx(css.btn, css.approveBtn)} onClick={onApprove}>
            {d("Approve").t("library_label_approve")}
          </LButton>
        </Permission>
      )}
      {(scope === PublishScope.organization || scope === PublishScope.tempArgument) && publish_status === PublishStatus.archive && (
        <Permission value={PermissionType.delete_archived_content_275}>
          <LButton variant="contained" className={clsx(css.btn, css.publistedBtn)} onClick={onPublish}>
            {d("Republish").t("library_label_republish")}
          </LButton>
        </Permission>
      )}
    </Box>
  );
}
