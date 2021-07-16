import { Box, Button, ButtonProps, fade, Hidden, IconButton, makeStyles, Typography, useMediaQuery, useTheme } from "@material-ui/core";
import { Palette, PaletteColor } from "@material-ui/core/styles/createPalette";
import { ArrowBack, CancelOutlined, Check, Clear, ClearSharp, Create, Delete, Publish, Save } from "@material-ui/icons";
import CancelOutlinedIcon from "@material-ui/icons/CancelOutlined";
import CreateOutlinedIcon from "@material-ui/icons/CreateOutlined";
import DeleteOutlinedIcon from "@material-ui/icons/DeleteOutlined";
import PublishOutlinedIcon from "@material-ui/icons/PublishOutlined";
import SaveOutlinedIcon from "@material-ui/icons/SaveOutlined";
import clsx from "clsx";
import React from "react";
import { UseFormMethods } from "react-hook-form";
import { useHistory } from "react-router-dom";
import { MilestoneDetailResult, MilestoneStatus } from "../../api/type";
import { LButton, LButtonProps } from "../../components/LButton";
import { PermissionType, usePermission } from "../../components/Permission";
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

const useStyles = makeStyles(({ palette, breakpoints }) => ({
  arrowBack: {
    color: palette.common.black,
    marginRight: 28,
    [breakpoints.down("sm")]: {
      marginRight: 16,
    },
  },
  kidsloopLogo: {
    width: 140,
    marginRight: 16,
  },
  title: {
    marginRight: "auto",
    [breakpoints.down("sm")]: {
      fontSize: 16,
    },
  },
  headerButton: {
    fontWeight: "bold",
    borderRadius: 27,
    marginLeft: 50,
  },
  iconButton: {
    marginRight: 16,
    padding: 5,
    border: "thin solid currentColor",
  },
  redButton: createContainedColor(palette.error, palette),
  redOutlinedButton: createOutlinedColor(palette.error, palette),
  greenButton: createContainedColor(palette.success, palette),
  primaryIconButton: createContainedColor(palette.primary, palette),
  radioGroup: {
    flexDirection: "row",
    padding: "7px 0",
    marginTop: 16,
  },
  radio: {
    "&:not(:first-child)": {
      marginLeft: 64,
    },
    [breakpoints.down("sm")]: {
      marginRight: 0,
    },
  },
  deleteButton: {
    border: "1px solid red",
    borderRadius: "28px",
    color: "red",
    fontWeight: 700,
  },
  editButton: {
    marginRight: "10px",
  },
  editBtn: {
    marginRight: "50px",
    paddingLeft: "25px",
    paddingRight: "25px",
  },
  deleteBtn: {
    paddingLeft: "20px",
    paddingRight: "20px",
  },
  saveButton: {
    width: "32px !important",
    height: "32px",
    borderRadius: "50%",
    backgroundColor: "green",
    minWidth: "32px",
  },
}));
export const GENERALMILESTONE = "general";

export interface MilestoneHeaderProps {
  milestoneDetail?: MilestoneDetailResult;
  milestone_id: string;
  onCancel: ButtonProps["onClick"];
  onSave: LButtonProps["onClick"];
  onPublish: LButtonProps["onClick"];
  onEdit: ButtonProps["onClick"];
  onDelete: ButtonProps["onClick"];
  onReject: ButtonProps["onClick"];
  onApprove: LButtonProps["onClick"];
  canEdit: boolean;
  formMethods: UseFormMethods<MilestoneDetailResult>;
  isMyself: boolean;
  is_unpub: boolean;
}
export function MilestoneHeader(props: MilestoneHeaderProps) {
  const history = useHistory();
  const css = useStyles();
  const { breakpoints } = useTheme();
  const sm = useMediaQuery(breakpoints.down("sm"));
  const {
    milestone_id,
    canEdit,
    onCancel,
    onPublish,
    onSave,
    onEdit,
    onDelete,
    onReject,
    onApprove,
    formMethods,
    milestoneDetail,
    isMyself,
    is_unpub,
  } = props;
  const status = milestoneDetail?.status || MilestoneStatus.draft;
  const canClick = status === MilestoneStatus.draft || status === MilestoneStatus.rejected;
  const {
    formState: { isDirty },
  } = formMethods;
  const perm = usePermission([
    PermissionType.edit_my_unpublished_milestone_487,
    PermissionType.delete_org_pending_milestone_489,
    PermissionType.edit_published_milestone_441,
    PermissionType.delete_my_pending_milestone_490,
    PermissionType.delete_unpublished_milestone_449,
    PermissionType.delete_my_unpublished_milestone_488,
    PermissionType.delete_published_milestone_450,
    PermissionType.approve_pending_milestone_491,
    PermissionType.reject_pending_milestone_492,
  ]);
  const goBack = () => {
    history.go(-1);
  };
  const getHeaderButtons = () => {
    return (
      <>
        {status === MilestoneStatus.draft && (
          <>
            {!milestone_id || canEdit ? (
              <>
                <Button
                  variant="contained"
                  endIcon={<CancelOutlinedIcon />}
                  className={clsx(css.headerButton, css.redButton)}
                  onClick={onCancel}
                >
                  {d("Cancel").t("assess_label_cancel")}
                </Button>
                <LButton
                  variant="contained"
                  endIcon={<SaveOutlinedIcon />}
                  color="primary"
                  className={css.headerButton}
                  disabled={!isDirty}
                  onClick={onSave}
                >
                  {d("Save").t("assess_label_save")}
                </LButton>
                <LButton
                  variant="contained"
                  endIcon={<PublishOutlinedIcon />}
                  className={clsx(css.headerButton, css.greenButton)}
                  onClick={onPublish}
                  disabled={!milestone_id ? true : isDirty}
                >
                  {d("Publish").t("assess_label_publish")}
                </LButton>
              </>
            ) : isMyself ? (
              <>
                <Button
                  variant="contained"
                  endIcon={<CreateOutlinedIcon />}
                  color="primary"
                  className={clsx(css.headerButton, css.editButton, css.editBtn)}
                  onClick={onEdit}
                >
                  {d("Edit").t("library_label_edit")}
                </Button>
                <Button
                  variant="outlined"
                  endIcon={<DeleteOutlinedIcon />}
                  className={clsx(css.deleteButton, css.deleteBtn)}
                  onClick={onDelete}
                >
                  {d("Delete").t("assess_label_delete")}
                </Button>
              </>
            ) : (
              perm.edit_my_unpublished_milestone_487 && (
                <>
                  <Button
                    variant="contained"
                    endIcon={<CreateOutlinedIcon />}
                    color="primary"
                    className={clsx(css.headerButton, css.editButton, css.editBtn)}
                    onClick={onEdit}
                  >
                    {d("Edit").t("library_label_edit")}
                  </Button>
                  <Button
                    variant="outlined"
                    endIcon={<DeleteOutlinedIcon />}
                    className={clsx(css.deleteButton, css.deleteBtn)}
                    onClick={onDelete}
                  >
                    {d("Delete").t("assess_label_delete")}
                  </Button>
                </>
              )
            )}
          </>
        )}
        {status === MilestoneStatus.pending && (
          <>
            {isMyself
              ? perm.delete_my_pending_milestone_490 && (
                  <Button
                    variant="outlined"
                    endIcon={<DeleteOutlinedIcon />}
                    className={clsx(css.deleteButton, css.deleteBtn)}
                    onClick={onDelete}
                  >
                    {d("Delete").t("assess_label_delete")}
                  </Button>
                )
              : perm.delete_org_pending_milestone_489 && (
                  <Button
                    variant="outlined"
                    endIcon={<DeleteOutlinedIcon />}
                    className={clsx(css.deleteButton, css.deleteBtn)}
                    onClick={onDelete}
                  >
                    {d("Delete").t("assess_label_delete")}
                  </Button>
                )}
            {!is_unpub && (
              <>
                {perm.reject_pending_milestone_492 && (
                  <Button variant="contained" endIcon={<Clear />} className={clsx(css.headerButton, css.redButton)} onClick={onReject}>
                    {d("Reject").t("assess_label_reject")}
                  </Button>
                )}
                {perm.approve_pending_milestone_491 && (
                  <LButton variant="contained" endIcon={<Check />} className={clsx(css.headerButton, css.greenButton)} onClick={onApprove}>
                    {d("Approve").t("assess_label_approve")}
                  </LButton>
                )}
              </>
            )}
          </>
        )}
        {status === MilestoneStatus.rejected && (
          <>
            {!canEdit ? (
              <>
                {perm.edit_my_unpublished_milestone_487 && (
                  <Button
                    variant="contained"
                    endIcon={<CreateOutlinedIcon />}
                    color="primary"
                    className={clsx(css.headerButton, css.editButton, css.editBtn)}
                    onClick={onEdit}
                  >
                    {d("Edit").t("library_label_edit")}
                  </Button>
                )}
                <Button
                  variant="outlined"
                  endIcon={<DeleteOutlinedIcon />}
                  className={clsx(css.deleteButton, css.deleteBtn)}
                  onClick={onDelete}
                >
                  {d("Delete").t("assess_label_delete")}
                </Button>
              </>
            ) : (
              <>
                <Button
                  variant="contained"
                  endIcon={<CancelOutlinedIcon />}
                  className={clsx(css.headerButton, css.redButton)}
                  onClick={onCancel}
                >
                  {d("Cancel").t("assess_label_cancel")}
                </Button>
                <LButton
                  variant="contained"
                  endIcon={<SaveOutlinedIcon />}
                  color="primary"
                  className={css.headerButton}
                  disabled={!isDirty}
                  onClick={onSave}
                >
                  {d("Save").t("assess_label_save")}
                </LButton>
                <LButton
                  variant="contained"
                  endIcon={<PublishOutlinedIcon />}
                  className={clsx(css.headerButton, css.greenButton)}
                  onClick={onPublish}
                  disabled={isDirty}
                >
                  {d("Publish").t("assess_label_publish")}
                </LButton>
              </>
            )}
          </>
        )}
        {status === MilestoneStatus.published && (
          <>
            {perm.edit_published_milestone_441 && (
              <Button
                variant="contained"
                endIcon={<CreateOutlinedIcon />}
                color="primary"
                className={clsx(css.headerButton, css.editButton, css.editBtn)}
                onClick={onEdit}
              >
                {d("Edit").t("library_label_edit")}
              </Button>
            )}
            {perm.delete_published_milestone_450 && (
              <Button
                variant="outlined"
                endIcon={<DeleteOutlinedIcon />}
                className={clsx(css.deleteButton, css.deleteBtn)}
                onClick={onDelete}
              >
                {d("Delete").t("assess_label_delete")}
              </Button>
            )}
          </>
        )}
      </>
    );
  };
  const getHeaderButtonsSmallScreen = () => {
    return (
      <>
        {status === MilestoneStatus.draft && (
          <>
            {!milestone_id || canEdit ? (
              <>
                <IconButton className={clsx(css.iconButton, css.redButton)} color="primary" onClick={onCancel}>
                  <CancelOutlined fontSize="small" />
                </IconButton>
                <LButton
                  disabled={!isDirty}
                  className={clsx(css.iconButton, css.primaryIconButton, css.saveButton)}
                  color="primary"
                  onClick={onSave}
                >
                  <Save fontSize="small" />
                </LButton>
                <IconButton
                  disabled={canClick ? !canClick : !isDirty}
                  className={clsx(css.iconButton, css.greenButton)}
                  color="primary"
                  onClick={onPublish}
                >
                  <Publish fontSize="small" />
                </IconButton>
              </>
            ) : isMyself ? (
              <>
                <IconButton color="primary" className={clsx(css.iconButton, css.editButton, css.greenButton)} onClick={onEdit}>
                  <Create fontSize="small" />
                </IconButton>
                <IconButton className={clsx(css.iconButton, css.redButton)} color="primary" onClick={onDelete}>
                  <Delete fontSize="small" />
                </IconButton>
              </>
            ) : (
              perm.edit_my_unpublished_milestone_487 && (
                <>
                  <IconButton color="primary" className={clsx(css.iconButton, css.editButton, css.greenButton)} onClick={onEdit}>
                    <Create fontSize="small" />
                  </IconButton>
                  <IconButton className={clsx(css.iconButton, css.redButton)} color="primary" onClick={onDelete}>
                    <Delete fontSize="small" />
                  </IconButton>
                </>
              )
            )}
          </>
        )}
        {status === MilestoneStatus.pending && (
          <>
            {isMyself
              ? perm.delete_my_pending_milestone_490 && (
                  <IconButton className={clsx(css.iconButton, css.redButton)} color="primary" onClick={onDelete}>
                    <Delete fontSize="small" />
                  </IconButton>
                )
              : perm.delete_org_pending_milestone_489 && (
                  <IconButton className={clsx(css.iconButton, css.redButton)} color="primary" onClick={onDelete}>
                    <Delete fontSize="small" />
                  </IconButton>
                )}
            {!is_unpub && (
              <>
                {perm.reject_pending_milestone_492 && (
                  <IconButton className={clsx(css.iconButton, css.redButton)} color="primary" onClick={onReject}>
                    <ClearSharp fontSize="small" />
                  </IconButton>
                )}
                {perm.approve_pending_milestone_491 && (
                  <IconButton className={clsx(css.iconButton, css.greenButton)} color="primary" onClick={onApprove}>
                    <Check fontSize="small" />
                  </IconButton>
                )}
              </>
            )}
          </>
        )}
        {status === MilestoneStatus.rejected && (
          <>
            {!canEdit ? (
              <>
                {perm.edit_my_unpublished_milestone_487 && (
                  <IconButton color="primary" className={clsx(css.iconButton, css.editButton, css.greenButton)} onClick={onEdit}>
                    <Create fontSize="small" />
                  </IconButton>
                )}
                <IconButton className={clsx(css.iconButton, css.redButton)} color="primary" onClick={onDelete}>
                  <Delete fontSize="small" />
                </IconButton>
              </>
            ) : (
              <>
                <IconButton className={clsx(css.iconButton, css.redButton)} color="primary" onClick={onCancel}>
                  <CancelOutlined fontSize="small" />
                </IconButton>
                <LButton
                  disabled={!isDirty}
                  className={clsx(css.iconButton, css.primaryIconButton, css.saveButton)}
                  color="primary"
                  onClick={onSave}
                >
                  <Save fontSize="small" />
                </LButton>
                <IconButton
                  disabled={canClick ? !canClick : !isDirty}
                  className={clsx(css.iconButton, css.greenButton)}
                  color="primary"
                  onClick={onPublish}
                >
                  <Publish fontSize="small" />
                </IconButton>
              </>
            )}
          </>
        )}
        {status === MilestoneStatus.published && (
          <>
            {perm.edit_published_milestone_441 && (
              <IconButton color="primary" className={clsx(css.iconButton, css.editButton, css.greenButton)} onClick={onEdit}>
                <Create fontSize="small" />
              </IconButton>
            )}
            {perm.delete_published_milestone_450 && (
              <IconButton className={clsx(css.iconButton, css.redButton)} color="primary" onClick={onDelete}>
                <Delete fontSize="small" />
              </IconButton>
            )}
          </>
        )}
      </>
    );
  };
  return (
    <>
      <Box display="flex" alignItems="center" pl={sm ? 2 : 3} pr={10} height={72} boxShadow={3}>
        <Button size="small" className={css.arrowBack} onClick={goBack}>
          <ArrowBack fontSize={sm ? "small" : "default"} />
        </Button>
        {/* <Hidden smDown>
          <img className={css.kidsloopLogo} src={KidsloopLogo} alt="kidsloop logo" />
        </Hidden> */}
        <Typography variant="h6" className={css.title}>
          {sm ? d("Create New Milestone").t("assess_create_new_milestone") : d("For Organizations").t("assess_label_for_organizations")}
        </Typography>
        <Hidden smDown>{milestoneDetail?.type !== GENERALMILESTONE ? getHeaderButtons() : ""}</Hidden>
      </Box>
      <Hidden smDown>
        <Box display="flex" alignItems="center" pl={5} pr={10} height={64} boxShadow={2}>
          <Typography variant="h6" className={css.title}>
            {milestone_id
              ? d("Milestone Details").t("assess_milestone_details")
              : d("Create New Milestone").t("assess_create_new_milestone")}
          </Typography>
        </Box>
      </Hidden>
      <Hidden mdUp>
        <Box display="flex" justifyContent="flex-end" pt={3}>
          {milestoneDetail?.type !== GENERALMILESTONE ? getHeaderButtonsSmallScreen() : ""}
        </Box>
      </Hidden>
    </>
  );
}
