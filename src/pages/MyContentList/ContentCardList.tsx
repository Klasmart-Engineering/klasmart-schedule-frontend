import {
  Card,
  CardActionArea,
  CardActions,
  CardContent,
  CardMedia,
  Checkbox,
  Collapse,
  createStyles,
  FormControl,
  Grid,
  IconButton,
  MenuItem,
  Select,
  styled,
  Typography,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { CheckBox, CheckBoxOutlineBlank, ExpandMore } from "@material-ui/icons";
import ClearIcon from "@material-ui/icons/Clear";
import DeleteOutlineIcon from "@material-ui/icons/DeleteOutline";
import DoneIcon from "@material-ui/icons/Done";
import EditOutlinedIcon from "@material-ui/icons/EditOutlined";
import FolderOpenIcon from "@material-ui/icons/FolderOpen";
import PublishOutlinedIcon from "@material-ui/icons/PublishOutlined";
import RemoveCircleOutlineIcon from "@material-ui/icons/RemoveCircleOutline";
import ShareIcon from "@material-ui/icons/Share";
import { Pagination } from "@material-ui/lab";
import clsx from "clsx";
import React, { Fragment, useState } from "react";
import { Controller, UseFormMethods } from "react-hook-form";
import { EntityFolderContentData, EntityFolderItemInfo, EntityOrganizationProperty } from "../../api/api.auto";
import { Author, ContentType, PublishStatus } from "../../api/type";
import { CheckboxGroup, CheckboxGroupContext } from "../../components/CheckboxGroup";
import LayoutBox from "../../components/LayoutBox";
import { LButton, LButtonProps } from "../../components/LButton";
import { Permission, PermissionType, usePermission } from "../../components/Permission";
import { Thumbnail } from "../../components/Thumbnail";
import { d } from "../../locale/LocaleManager";
import { BackToPrevPage } from "./BackToPrevPage";
import { isUnpublish } from "./FirstSearchHeader";
import { ContentListForm, ContentListFormKey, QueryCondition } from "./types";
const calcGridWidth = (n: number, p: number) => (n === 1 ? "100%" : `calc(100% * ${n / (n - 1 + p)})`);

const ASSETS_NAME = "Assets";

const useStyles = makeStyles((theme) =>
  createStyles({
    gridContainer: {
      [theme.breakpoints.only("xl")]: {
        width: calcGridWidth(4, 0.86),
      },
      [theme.breakpoints.only("lg")]: {
        width: calcGridWidth(4, 0.86),
      },
      [theme.breakpoints.only("md")]: {
        width: calcGridWidth(3, 0.86),
      },
      [theme.breakpoints.only("sm")]: {
        width: calcGridWidth(2, 0.9),
      },
      [theme.breakpoints.only("xs")]: {
        width: calcGridWidth(1, 1),
      },
    },
    card: {
      width: "86%",
      marginBottom: 40,
      [theme.breakpoints.only("sm")]: {
        width: "90%",
      },
      [theme.breakpoints.only("xs")]: {
        width: "100%",
      },
      position: "relative",
    },
    cardContent: {
      padding: "10px 8px 4px 10px",
    },
    cardMedia: {
      width: "100%",
      paddingTop: "56.25%",
      position: "relative",
    },
    cardImg: {
      position: "absolute",
      left: 0,
      top: 0,
      width: "100%",
      height: "100%",
    },
    checkbox: {
      position: "absolute",
      padding: 0,
      borderRadius: 5,
      top: 10,
      left: 12,
      backgroundColor: "white",
      zIndex: 10,
    },
    cardActions: {
      flexWrap: "wrap",
      justifyContent: "space-between",
      height: "40px",
    },
    iconButtonExpandMore: {
      width: "24px",
      marginLeft: "auto",
      padding: 2,
      transition: theme.transitions.create("transform"),
    },
    body2: {
      color: "#666",
    },
    ChipLabel: {
      paddingLeft: 16,
      paddingRight: 16,
    },
    previewChip: {
      color: "#0E78D5",
      borderColor: "#0E78D5",
      marginRight: "auto",
      marginBottom: 10,
    },
    remove: {
      color: "#D32F2F",
    },
    unarchive: {
      color: "#0E78D5",
    },
    share: {
      color: "black",
    },
    getApp: {
      color: "black",
    },
    approveChip: {
      color: "#4CAF50",
      borderColor: "#4CAF50",
    },
    rejectChip: {
      color: "#D32F2F",
      borderColor: "#D32F2F",
    },
    iconButtonBottom: {
      padding: 2,
      marginLeft: 10,
      marginBottom: 10,
    },
    chipBottom: {
      marginLeft: 10,
      marginBottom: 10,
    },
    pagination: {
      marginBottom: 40,
    },
    paginationUl: {
      justifyContent: "center",
    },
    cardBackground: {
      width: "100%",
      paddingTop: "47.6%",
      position: "relative",
    },
    cardType: {
      color: "#fff",
      position: "absolute",
      top: "50%",
      left: "50%",
      transform: "translate(-50%, -50%)",
      fontSize: "58px",
    },
    iconColor: {
      color: "#D32F2F",
      padding: "5px",
    },
    rePublishColor: {
      color: "#0E78D5",
      padding: "5px",
    },
    folderColor: {
      color: "#0e78d5",
      padding: "5px",
    },
    shareColor: {
      color: "#000",
      padding: "5px",
    },
    MuiIconButtonRoot: {
      "&:hover": {
        backgroundColor: "rgba(0, 0, 0, 0.00) !important",
      },
    },
    bottomCon: {
      display: "flex",
      justifyContent: "center",
    },
    prevImg: {
      position: "absolute",
      left: "50%",
      top: "50%",
      transform: "translate(-50%, -50%)",
      width: "50%",
    },
    editBtn: {
      width: "24px",
      height: 32,
      fontSize: "12px",
    },
    fileCount: {
      borderRadius: 16,
      background: "#F7A107",
      color: "#ffe69f",
      fontSize: 18,
      width: "14%",
      height: "15%",
      position: "absolute",
      left: "55%",
      top: "63%",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
    },
    approveIconColor: {
      color: "#4CAF50",
      padding: "0 0 0 10px",
    },
    //
    folderName: {
      display: "flex",
      alignItems: "center",
      [theme.breakpoints.down("md")]: {
        marginLeft: 10,
      },
    },
    despWord: {
      fontSize: 18,
      color: "#666666",
      textAlign: "right",
      flex: 1,
      lineHeight: "22px",
      [theme.breakpoints.down("sm")]: {
        fontSize: 14,
      },
    },
    infoWord: {
      fontSize: 22,
      flex: 3,
      marginLeft: 5,
      lineHeight: "22px",
      color: "#000000",
      [theme.breakpoints.down("sm")]: {
        fontSize: 18,
      },
    },
    folderInfoCon: {
      width: "50%",
      display: "flex",
      marginTop: 10,
      [theme.breakpoints.down("md")]: {
        width: "100%",
        fontSize: 16,
      },
    },
    titleCon: {
      display: "flex",
    },
    mbBtnCon: {
      margin: "10px 0",
      textAlign: "right",
    },
  })
);

const useExpand = () => {
  const [open, setOpen] = useState(false);
  const toggle = () => setOpen(!open);
  return { collapse: { in: open }, expandMore: { open, onClick: toggle } };
};

interface ExpandBtnProps {
  open: boolean;
}
const ExpandBtn = styled(IconButton)((props: ExpandBtnProps) => ({
  transform: props.open ? "rotate(180deg)" : "none",
}));
interface ContentProps extends ContentActionProps {
  content: EntityFolderContentData;
  queryCondition: QueryCondition;
  selectedContentGroupContext: CheckboxGroupContext;
  orgProperty: EntityOrganizationProperty;
  onClickContent: ContentCardListProps["onClickContent"];
}
enum DeleteText {
  delete = "delete",
  remove = "remove",
}
enum OrgType {
  normal = "normal",
  headquarters = "headquarters",
}
enum OrgOrigin {
  global = "global",
  vn = "vn",
}
function ContentCard(props: ContentProps) {
  const css = useStyles();
  const expand = useExpand();
  const {
    content,
    queryCondition,
    selectedContentGroupContext,
    orgProperty,
    onDelete,
    onPublish,
    onClickContent,
    onClickMoveBtn,
    onRenameFolder,
    onDeleteFolder,
    onApprove,
    onReject,
    onClickShareBtn,
  } = props;
  let file_type: number = 0;
  const perm = usePermission([
    PermissionType.publish_featured_content_for_all_hub_79000,
    PermissionType.publish_featured_content_for_all_orgs_79002,
    PermissionType.publish_featured_content_for_specific_orgs_79001,
  ]);
  const isShowShareButton =
    orgProperty.region === OrgOrigin.global
      ? perm?.publish_featured_content_for_all_hub_79000 && perm?.publish_featured_content_for_all_orgs_79002
      : perm?.publish_featured_content_for_specific_orgs_79001;
  if (content?.content_type === ContentType.assets) {
    file_type = JSON.parse(content.data || "").file_type;
  }
  const { registerChange, hashValue } = selectedContentGroupContext;
  const DeleteIcon =
    content?.publish_status === PublishStatus.published && content?.content_type_name !== ASSETS_NAME
      ? RemoveCircleOutlineIcon
      : DeleteOutlineIcon;
  const type =
    content?.publish_status === PublishStatus.published && content?.content_type_name !== ASSETS_NAME
      ? DeleteText.remove
      : DeleteText.delete;
  return (
    <Card className={css.card}>
      <Checkbox
        icon={<CheckBoxOutlineBlank viewBox="3 3 18 18"></CheckBoxOutlineBlank>}
        checkedIcon={<CheckBox viewBox="3 3 18 18"></CheckBox>}
        size="small"
        className={css.checkbox}
        color="secondary"
        value={content.id}
        checked={hashValue[content.id as string] || false}
        onChange={registerChange}
      ></Checkbox>
      <CardActionArea onClick={(e) => onClickContent(content.id, content.content_type, content.dir_path)}>
        <CardMedia className={css.cardMedia}>
          {content.content_type === ContentType.assets && (
            <Thumbnail className={css.cardImg} type={content.content_type * 10 + file_type} id={content.thumbnail}></Thumbnail>
          )}
          {(content.content_type === ContentType.material || content.content_type === ContentType.plan) && (
            <Thumbnail className={css.cardImg} type={content.content_type} id={content.thumbnail}></Thumbnail>
          )}
          {content.content_type === ContentType.folder && (
            <Thumbnail className={css.cardImg} type={content.content_type} id={content.thumbnail}></Thumbnail>
          )}
          {content.content_type === ContentType.folder && <div className={css.fileCount}>{content.items_count}</div>}
        </CardMedia>
      </CardActionArea>
      <CardContent className={css.cardContent}>
        <Grid container alignContent="space-between">
          <Typography variant="h6" style={{ flex: 1 }} noWrap={true}>
            {content?.name}
          </Typography>
          {content.content_type === ContentType.folder && (
            <Permission value={PermissionType.create_folder_289}>
              <IconButton className={clsx(css.editBtn, css.MuiIconButtonRoot)} onClick={(e) => onRenameFolder(content)}>
                <EditOutlinedIcon />
              </IconButton>
            </Permission>
          )}
          <ExpandBtn className={clsx(css.iconButtonExpandMore, css.MuiIconButtonRoot)} {...expand.expandMore}>
            <ExpandMore fontSize="small"></ExpandMore>
          </ExpandBtn>
        </Grid>
        <Collapse {...expand.collapse} unmountOnExit>
          <Typography className={css.body2} variant="body2">
            {content?.name}
          </Typography>
        </Collapse>
      </CardContent>
      <Typography className={css.body2} style={{ marginLeft: "10px" }} variant="body2">
        {content?.content_type === ContentType.material && d("Material").t("library_label_material")}
        {content?.content_type === ContentType.plan && d("Plan").t("library_label_plan")}
        {content?.content_type === ContentType.folder && "Folder"}
        {content?.content_type === ContentType.assets && file_type === ContentType.image % 10 && d("Image").t("library_label_image")}
        {content?.content_type === ContentType.assets && file_type === ContentType.video % 10 && d("Video").t("library_label_video")}
        {content?.content_type === ContentType.assets && file_type === ContentType.audio % 10 && d("Audio").t("library_label_audio")}
        {content?.content_type === ContentType.assets && file_type === ContentType.doc % 10 && d("Document").t("library_label_document")}
      </Typography>
      <CardActions className={css.cardActions}>
        <Typography className={css.body2} variant="body2">
          {content?.author_name}
        </Typography>
        <div>
          {!queryCondition.program_group &&
            content?.publish_status === PublishStatus.published &&
            content?.content_type === ContentType.folder &&
            orgProperty.type === OrgType.headquarters &&
            (!queryCondition.path || (queryCondition.path && queryCondition.path === "/")) &&
            isShowShareButton && (
              <LButton
                as={IconButton}
                replace
                className={clsx(css.shareColor, css.MuiIconButtonRoot)}
                onClick={() => onClickShareBtn(content)}
              >
                <ShareIcon />
              </LButton>
            )}
          {!queryCondition.program_group &&
            (content?.publish_status === PublishStatus.published || content?.content_type_name === ASSETS_NAME) && (
              <Permission value={PermissionType.create_folder_289}>
                <LButton
                  as={IconButton}
                  replace
                  className={clsx(css.folderColor, css.MuiIconButtonRoot)}
                  onClick={() => onClickMoveBtn(content)}
                >
                  <FolderOpenIcon />
                </LButton>
              </Permission>
            )}
          {/* content published remove */}
          {!queryCondition.program_group &&
            queryCondition.publish_status === PublishStatus.published &&
            content?.content_type !== ContentType.folder &&
            content?.content_type_name !== ASSETS_NAME &&
            content.permission?.allow_delete && (
              <LButton
                as={IconButton}
                replace
                className={clsx(css.iconColor, css.MuiIconButtonRoot)}
                onClick={() => onDelete(content.id as string, type)}
              >
                <RemoveCircleOutlineIcon />
              </LButton>
              // <Permission value={PermissionType.archive_published_content_273}>
              //   <LButton
              //     as={IconButton}
              //     replace
              //     className={clsx(css.iconColor, css.MuiIconButtonRoot)}
              //     onClick={() => onDelete(content.id as string, type)}
              //   >
              //     <RemoveCircleOutlineIcon />
              //   </LButton>
              // </Permission>
            )}
          {!queryCondition.program_group && content?.content_type === ContentType.folder && content.permission?.allow_delete && (
            <LButton
              as={IconButton}
              replace
              className={clsx(css.iconColor, css.MuiIconButtonRoot)}
              onClick={() => onDeleteFolder(content.id as string)}
            >
              <DeleteOutlineIcon />
            </LButton>
            // <Permission value={PermissionType.create_folder_289}>
            //   <LButton
            //     as={IconButton}
            //     replace
            //     className={clsx(css.iconColor, css.MuiIconButtonRoot)}
            //     onClick={() => onDeleteFolder(content.id as string)}
            //   >
            //     <DeleteOutlineIcon />
            //   </LButton>
            // </Permission>
          )}
          {/* content archieved republish delete */}
          {!queryCondition.program_group &&
            content?.publish_status === PublishStatus.archive &&
            content?.content_type_name !== ASSETS_NAME &&
            content.permission?.allow_republish && (
              <LButton
                as={IconButton}
                replace
                className={clsx(css.rePublishColor, css.MuiIconButtonRoot)}
                onClick={() => onPublish(content.id as string)}
              >
                <PublishOutlinedIcon />
              </LButton>
              // <Permission value={PermissionType.republish_archived_content_274}>
              //   <LButton
              //     as={IconButton}
              //     replace
              //     className={clsx(css.rePublishColor, css.MuiIconButtonRoot)}
              //     onClick={() => onPublish(content.id as string)}
              //   >
              //     <PublishOutlinedIcon />
              //   </LButton>
              // </Permission>
            )}
          {!queryCondition.program_group &&
            content?.publish_status === PublishStatus.archive &&
            content?.content_type_name !== ASSETS_NAME &&
            content.permission?.allow_delete && (
              <LButton
                as={IconButton}
                replace
                className={clsx(css.iconColor, css.MuiIconButtonRoot)}
                onClick={() => onDelete(content.id as string, type)}
              >
                <DeleteOutlineIcon />
              </LButton>
              // <Permission value={PermissionType.delete_archived_content_275}>
              //   <LButton
              //     as={IconButton}
              //     replace
              //     className={clsx(css.iconColor, css.MuiIconButtonRoot)}
              //     onClick={() => onDelete(content.id as string, type)}
              //   >
              //     <DeleteOutlineIcon />
              //   </LButton>
              // </Permission>
            )}
          {/* content unpublished delete */}
          {!queryCondition.program_group && isUnpublish(queryCondition) && content?.content_type_name !== ASSETS_NAME && (
            <LButton
              as={IconButton}
              replace
              className={clsx(css.iconColor, css.MuiIconButtonRoot)}
              onClick={() => onDelete(content.id as string, type)}
            >
              <DeleteOutlineIcon />
            </LButton>
          )}
          {/* assets delete */}
          {!queryCondition.program_group && content?.content_type_name === ASSETS_NAME && content.permission?.allow_delete && (
            <LButton
              as={IconButton}
              replace
              className={clsx(css.iconColor, css.MuiIconButtonRoot)}
              onClick={() => onDelete(content.id as string, type)}
            >
              <DeleteIcon />
            </LButton>
            // <Permission value={PermissionType.delete_asset_340}>
            //   <LButton
            //     as={IconButton}
            //     replace
            //     className={clsx(css.iconColor, css.MuiIconButtonRoot)}
            //     onClick={() => onDelete(content.id as string, type)}
            //   >
            //     <DeleteIcon />
            //   </LButton>
            // </Permission>
          )}
          {!queryCondition.program_group &&
            content?.publish_status === PublishStatus.pending &&
            queryCondition?.author !== Author.self &&
            content.permission?.allow_reject && (
              <LButton
                as={IconButton}
                replace
                className={clsx(css.iconColor, css.MuiIconButtonRoot)}
                onClick={() => onReject(content.id as string)}
              >
                <ClearIcon />
              </LButton>
              // <Permission value={PermissionType.reject_pending_content_272}>
              //   <LButton
              //     as={IconButton}
              //     replace
              //     className={clsx(css.iconColor, css.MuiIconButtonRoot)}
              //     onClick={() => onReject(content.id as string)}
              //   >
              //     <ClearIcon />
              //   </LButton>
              // </Permission>
            )}
          {!queryCondition.program_group &&
            content?.publish_status === PublishStatus.pending &&
            queryCondition?.author !== Author.self &&
            content.permission?.allow_approve && (
              <LButton
                as={IconButton}
                replace
                className={clsx(css.approveIconColor, css.MuiIconButtonRoot)}
                onClick={() => onApprove(content.id as string)}
              >
                <DoneIcon />
              </LButton>
              // <Permission value={PermissionType.approve_pending_content_271}>
              //   <LButton
              //     as={IconButton}
              //     replace
              //     className={clsx(css.approveIconColor, css.MuiIconButtonRoot)}
              //     onClick={() => onApprove(content.id as string)}
              //   >
              //     <DoneIcon />
              //   </LButton>
              // </Permission>
            )}
        </div>
      </CardActions>
    </Card>
  );
}

interface ContentActionProps {
  onPublish: (id: NonNullable<EntityFolderContentData["id"]>) => ReturnType<LButtonProps["onClick"]>;
  onDelete: (id: NonNullable<EntityFolderContentData["id"]>, type: string) => ReturnType<LButtonProps["onClick"]>;
  onClickMoveBtn: (content: NonNullable<EntityFolderContentData>) => ReturnType<LButtonProps["onClick"]>;
  onRenameFolder: (content: NonNullable<EntityFolderContentData>) => any;
  onDeleteFolder: (id: NonNullable<EntityFolderContentData["id"]>) => ReturnType<LButtonProps["onClick"]>;
  onApprove: (id: NonNullable<EntityFolderContentData["id"]>) => ReturnType<LButtonProps["onClick"]>;
  onReject: (id: NonNullable<EntityFolderContentData["id"]>) => ReturnType<LButtonProps["onClick"]>;
  onClickShareBtn: (content: NonNullable<EntityFolderContentData>) => ReturnType<LButtonProps["onClick"]>;
}

export interface ContentCardListProps extends ContentActionProps {
  formMethods: UseFormMethods<ContentListForm>;
  total: number;
  amountPerPage: number;
  list: EntityFolderContentData[];
  queryCondition: QueryCondition;
  onChangePage: (page: number) => void;
  onClickContent: (
    id: EntityFolderContentData["id"],
    content_type: EntityFolderContentData["content_type"],
    dir_path: EntityFolderContentData["dir_path"]
  ) => any;
  onChangePageSize: (page_size: number) => void;
  onGoBack: () => any;
  parentFolderInfo: EntityFolderItemInfo;
  orgProperty: EntityOrganizationProperty;
}
export function ContentCardList(props: ContentCardListProps) {
  const css = useStyles();
  const {
    formMethods,
    list,
    total,
    amountPerPage,
    queryCondition,
    onPublish,
    onDelete,
    onChangePage,
    onClickContent,
    onChangePageSize,
    onClickMoveBtn,
    onRenameFolder,
    onDeleteFolder,
    onGoBack,
    parentFolderInfo,
    onApprove,
    onReject,
    onClickShareBtn,
    orgProperty,
  } = props;
  const { control } = formMethods;
  const handleChangePage = (event: object, page: number) => onChangePage(page);
  const handleChangePageSize = (event: React.ChangeEvent<{ value: unknown }>) => {
    onChangePageSize(event.target.value as number);
  };
  const pageSizes = [20, 100, 500];
  return (
    <LayoutBox holderMin={40} holderBase={202} mainBase={1517}>
      <Controller
        name={ContentListFormKey.CHECKED_CONTENT_IDS}
        control={control}
        defaultValue={[]}
        render={({ ref, ...props }) => (
          <Grid className={css.gridContainer} container ref={ref}>
            <CheckboxGroup
              {...props}
              render={(selectedContentGroupContext) => (
                <Fragment>
                  {queryCondition.path &&
                    queryCondition.path !== "/" &&
                    queryCondition.page === 1 &&
                    JSON.stringify(parentFolderInfo) !== "{}" && (
                      <BackToPrevPage parentFolderInfo={parentFolderInfo} {...{ onGoBack, onRenameFolder }} />
                    )}
                  {list.map((item, idx) => (
                    <Grid key={item.id} item xs={12} sm={6} md={4} lg={3} xl={3}>
                      <ContentCard
                        content={item}
                        {...{
                          onPublish,
                          onDelete,
                          queryCondition,
                          orgProperty,
                          selectedContentGroupContext,
                          onClickContent,
                          onClickMoveBtn,
                          onRenameFolder,
                          onDeleteFolder,
                          onApprove,
                          onReject,
                          onClickShareBtn,
                        }}
                      />
                    </Grid>
                  ))}
                </Fragment>
              )}
            />
          </Grid>
        )}
      />
      <div className={css.bottomCon}>
        <Pagination
          page={queryCondition.page}
          className={css.pagination}
          classes={{ ul: css.paginationUl }}
          onChange={handleChangePage}
          count={Math.ceil(total / amountPerPage)}
          color="primary"
        />
        <FormControl>
          <Select value={amountPerPage} onChange={handleChangePageSize}>
            {pageSizes.map((item) => (
              <MenuItem value={item} key={item}>
                {item}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </div>
    </LayoutBox>
  );
}
