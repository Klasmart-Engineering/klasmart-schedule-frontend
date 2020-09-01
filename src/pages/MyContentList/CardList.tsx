import {
  Card,
  CardActionArea,
  CardActions,
  CardContent,
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
import PublishOutlinedIcon from "@material-ui/icons/PublishOutlined";
import RemoveCircleOutlineIcon from "@material-ui/icons/RemoveCircleOutline";
import { Pagination } from "@material-ui/lab";
import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { Content } from "../../api/api";
import LayoutBox from "../../components/LayoutBox";
import { Thumbnail } from "../../components/Thumbnail";
const calcGridWidth = (n: number, p: number) => (n === 1 ? "100%" : `calc(100% * ${n / (n - 1 + p)})`);

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
      // paddingTop: "47.6%",
      position: "relative",
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
      cursor: "pointer",
    },
    rePublishColor: {
      color: "#0E78D5",
      cursor: "pointer",
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

interface ActionProps {
  id?: string;
  onHandelAction: (type: string, id?: string) => void;
}
function PublishedAction(props: ActionProps) {
  const css = useStyles();
  const { id, onHandelAction } = props;
  const handleRemovePublished = (e: any) => {
    onHandelAction("delete", id);
  };
  return (
    <React.Fragment>
      <RemoveCircleOutlineIcon className={css.iconColor} onClick={handleRemovePublished} />
    </React.Fragment>
  );
}

function UnpublishedAction(props: ActionProps) {
  const css = useStyles();
  const { id, onHandelAction } = props;
  const handleDeleteUnpublished = (e: any) => {
    onHandelAction("delete", id);
  };
  return (
    <React.Fragment>
      <DeleteOutlineIcon className={css.iconColor} onClick={handleDeleteUnpublished} />
    </React.Fragment>
  );
}

function ArchivedAction(props: ActionProps) {
  const css = useStyles();
  const { id, onHandelAction } = props;
  const handlePublish = (e: any) => {
    onHandelAction("publish", id);
  };
  const handleDeleteArchived = (e: any) => {
    onHandelAction("delete", id);
  };
  return (
    <div>
      <PublishOutlinedIcon className={css.rePublishColor} onClick={handlePublish} />
      <DeleteOutlineIcon className={css.iconColor} onClick={handleDeleteArchived} />
    </div>
  );
}
interface ContentProps {
  content: Content;
  onCheckedChange: (isChecked: boolean, id: string) => any;
  onHandelAction: (type: string, id?: string) => void;
  status: string;
}
function ContentCard(props: ContentProps) {
  const css = useStyles();
  const expand = useExpand();
  const { content, onCheckedChange, onHandelAction, status } = props;
  const history = useHistory();

  const handleChecked = (event: any, id?: string) => {
    onCheckedChange(event.target.checked, id || "");
  };
  const handleGoPreview = (event: any, id?: string) => {
    history.push(`/library/content-preview?id=${id}`);
  };
  // const setThumbnail = () => {
  //   if (!content?.thumbnail && content?.content_type_name === "document") return DocIconUrl;
  //   if (!content?.thumbnail && content?.content_type_name === "audio") return MusicIconUrl;
  //   if (!content?.thumbnail && content?.content_type_name === "img") return PicIconUrl;
  //   if (!content?.thumbnail && content?.content_type_name === "video") return VideoIconUrl;
  //   if (!content?.thumbnail && content?.content_type_name === "Plan") return PlanIconUrl;
  //   if (!content?.thumbnail && content?.content_type_name === "Material") return MaterialIconUrl;
  //   if (content?.thumbnail) return apiResourcePathById(content?.thumbnail);
  // };
  return (
    <Card className={css.card}>
      <Checkbox
        icon={<CheckBoxOutlineBlank viewBox="3 3 18 18"></CheckBoxOutlineBlank>}
        checkedIcon={<CheckBox viewBox="3 3 18 18"></CheckBox>}
        size="small"
        className={css.checkbox}
        color="secondary"
        onChange={(e) => {
          handleChecked(e, content?.id);
        }}
      ></Checkbox>
      <CardActionArea onClick={(e) => handleGoPreview(e, content?.id)}>
        {/* <CardMedia className={css.cardMedia} image={setThumbnail()}></CardMedia> */}
        <Thumbnail className={css.cardMedia} type={content.content_type} id={content.thumbnail} />
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
        {content?.content_type_name}
      </Typography>
      <CardActions className={css.cardActions}>
        <Typography className={css.body2} variant="body2">
          {content?.author_name}
        </Typography>
        {content?.publish_status === "published" && <PublishedAction id={content?.id} onHandelAction={onHandelAction} />}
        {(content?.publish_status === "draft" || content?.publish_status === "rejected") && (
          <UnpublishedAction id={content.id} onHandelAction={onHandelAction} />
        )}
        {content?.publish_status === "pending" && status === "unpublished" && (
          <UnpublishedAction id={content.id} onHandelAction={onHandelAction} />
        )}
        {content?.publish_status === "archive" && <ArchivedAction id={content?.id} onHandelAction={onHandelAction} />}
      </CardActions>
    </Card>
  );
}

interface ContentCardListProps {
  total: number;
  amountPerPage?: number;
  list: Content[];
  onChangeCheckedContents: (arr: string[]) => any;
  onChangePage: (page: number) => void;
  onHandelAction: (type: string, id?: string) => void;
  status: string;
}
export default function ContentCardList(props: ContentCardListProps) {
  const css = useStyles();
  const { list, total, amountPerPage = 16, status } = props;
  const [checkedArr, setCheckedArr] = React.useState<string[]>([]);
  const { onChangeCheckedContents, onChangePage, onHandelAction } = props;
  const onCheckedArrChange = (isChecked: boolean, id: string) => {
    isChecked ? checkedArr.push(id) : checkedArr.splice(checkedArr.indexOf(id), 1);
    setCheckedArr(checkedArr);
    onChangeCheckedContents(checkedArr);
  };
  const changePage = (event: object, page: number) => {
    onChangePage(page);
  };
  const cardlist = list.map((item, idx) => (
    <Grid key={item.id} item xs={12} sm={6} md={4} lg={3} xl={3}>
      <ContentCard content={item} onCheckedChange={onCheckedArrChange} onHandelAction={onHandelAction} status={status}></ContentCard>
    </Grid>
  ));
  useEffect(() => {
    setCheckedArr([]);
  }, [list]);
  return (
    <LayoutBox holderMin={40} holderBase={202} mainBase={1517}>
      <Grid className={css.gridContainer} container>
        {cardlist}
      </Grid>
      <Pagination
        className={css.pagination}
        classes={{ ul: css.paginationUl }}
        onChange={changePage}
        count={Math.ceil(total / amountPerPage)}
        color="primary"
      />
    </LayoutBox>
  );
}
