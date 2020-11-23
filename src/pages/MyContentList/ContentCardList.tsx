import {
  Card,
  CardActionArea,
  CardActions,
  CardContent,
  CardMedia,
  Checkbox,
  Collapse,
  createStyles,
  Grid,
  IconButton,
  styled,
  Typography,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { CheckBox, CheckBoxOutlineBlank, ExpandMore } from "@material-ui/icons";
import DeleteOutlineIcon from "@material-ui/icons/DeleteOutline";
import FolderOpenIcon from "@material-ui/icons/FolderOpen";
import PublishOutlinedIcon from "@material-ui/icons/PublishOutlined";
import RemoveCircleOutlineIcon from "@material-ui/icons/RemoveCircleOutline";
import { Pagination } from "@material-ui/lab";
import React, { Fragment, useState } from "react";
import { Controller, UseFormMethods } from "react-hook-form";
import { EntityContentInfoWithDetails } from "../../api/api.auto";
import { ContentType, PublishStatus } from "../../api/type";
import { CheckboxGroup, CheckboxGroupContext } from "../../components/CheckboxGroup";
import LayoutBox from "../../components/LayoutBox";
import { LButton } from "../../components/LButton";
import { Permission, PermissionType } from "../../components/Permission";
import { Thumbnail } from "../../components/Thumbnail";
import { d } from "../../locale/LocaleManager";
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
      padding: "0 0 0 10px",
    },
    rePublishColor: {
      color: "#0E78D5",
      padding: "0 0 0 10px",
    },
    folderColor: {
      color: "#0e78d5",
      padding: "0 0 0 10px",
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
  content: EntityContentInfoWithDetails;
  queryCondition: QueryCondition;
  selectedContentGroupContext: CheckboxGroupContext;
  onClickContent: ContentCardListProps["onClickContent"];
}
enum DeleteText {
  delete = "delete",
  remove = "remove",
}
function ContentCard(props: ContentProps) {
  const css = useStyles();
  const expand = useExpand();
  const { content, queryCondition, selectedContentGroupContext, onDelete, onPublish, onClickContent } = props;
  const file_type: number = JSON.parse(content.data || "").file_type;
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
      <CardActionArea onClick={(e) => onClickContent(content.id, content.content_type)}>
        <CardMedia className={css.cardMedia}>
          {content.content_type === ContentType.assets && (
            <Thumbnail className={css.cardImg} type={content.content_type * 10 + file_type} id={content.thumbnail}></Thumbnail>
          )}
          {content.content_type !== ContentType.assets && (
            <Thumbnail className={css.cardImg} type={content.content_type} id={content.thumbnail}></Thumbnail>
          )}
        </CardMedia>
      </CardActionArea>
      <CardContent className={css.cardContent}>
        <Grid container alignContent="space-between">
          <Typography variant="h6" style={{ flex: 1 }} noWrap={true}>
            {content?.name}
          </Typography>
          <ExpandBtn className={css.iconButtonExpandMore} {...expand.expandMore}>
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
          {false &&
            !queryCondition.program &&
            (content?.publish_status === PublishStatus.published || content?.content_type_name === ASSETS_NAME) && (
              <LButton as={IconButton} replace className={css.folderColor} onClick={() => onDelete(content.id as string, type)}>
                <FolderOpenIcon />
              </LButton>
            )}
          {/* content published remove */}
          {!queryCondition.program &&
            queryCondition.publish_status === PublishStatus.published &&
            content?.content_type_name !== ASSETS_NAME && (
              <Permission value={PermissionType.archive_published_content_273}>
                <LButton as={IconButton} replace className={css.iconColor} onClick={() => onDelete(content.id as string, type)}>
                  <RemoveCircleOutlineIcon />
                </LButton>
              </Permission>
            )}
          {/* content archieved republish delete */}
          {!queryCondition.program && content?.publish_status === PublishStatus.archive && content?.content_type_name !== ASSETS_NAME && (
            <Permission value={PermissionType.republish_archived_content_274}>
              <LButton as={IconButton} replace className={css.rePublishColor} onClick={() => onPublish(content.id as string)}>
                <PublishOutlinedIcon />
              </LButton>
            </Permission>
          )}
          {!queryCondition.program && content?.publish_status === PublishStatus.archive && content?.content_type_name !== ASSETS_NAME && (
            <Permission value={PermissionType.delete_archived_content_275}>
              <LButton as={IconButton} replace className={css.iconColor} onClick={() => onDelete(content.id as string, type)}>
                <DeleteOutlineIcon />
              </LButton>
            </Permission>
          )}
          {/* content unpublished delete */}
          {!queryCondition.program && isUnpublish(queryCondition) && content?.content_type_name !== ASSETS_NAME && (
            <LButton as={IconButton} replace className={css.iconColor} onClick={() => onDelete(content.id as string, type)}>
              <DeleteOutlineIcon />
            </LButton>
          )}
          {/* assets delete */}
          {!queryCondition.program && content?.content_type_name === ASSETS_NAME && (
            <Permission value={PermissionType.delete_asset_340}>
              <LButton as={IconButton} replace className={css.iconColor} onClick={() => onDelete(content.id as string, type)}>
                <DeleteIcon />
              </LButton>
            </Permission>
          )}
        </div>
      </CardActions>
    </Card>
  );
}

interface ContentActionProps {
  onPublish: (id: NonNullable<EntityContentInfoWithDetails["id"]>) => any;
  onDelete: (id: NonNullable<EntityContentInfoWithDetails["id"]>, type: string) => any;
}

export interface ContentCardListProps extends ContentActionProps {
  formMethods: UseFormMethods<ContentListForm>;
  total: number;
  amountPerPage?: number;
  list: EntityContentInfoWithDetails[];
  queryCondition: QueryCondition;
  onChangePage: (page: number) => void;
  onClickContent: (id: EntityContentInfoWithDetails["id"], content_type: EntityContentInfoWithDetails["content_type"]) => any;
}
export function ContentCardList(props: ContentCardListProps) {
  const css = useStyles();
  const { formMethods, list, total, amountPerPage = 20, queryCondition, onPublish, onDelete, onChangePage, onClickContent } = props;
  const { control } = formMethods;
  const handleChangePage = (event: object, page: number) => onChangePage(page);
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
                  {list.map((item, idx) => (
                    <Grid key={item.id} item xs={12} sm={6} md={4} lg={3} xl={3}>
                      <ContentCard
                        content={item}
                        {...{ onPublish, onDelete, queryCondition, selectedContentGroupContext, onClickContent }}
                      />
                    </Grid>
                  ))}
                </Fragment>
              )}
            />
          </Grid>
        )}
      />
      <Pagination
        page={queryCondition.page}
        className={css.pagination}
        classes={{ ul: css.paginationUl }}
        onChange={handleChangePage}
        count={Math.ceil(total / amountPerPage)}
        color="primary"
      />
    </LayoutBox>
  );
}
