import {
  Card,
  CardActionArea,
  CardActions,
  CardContent,
  CardMedia,
  Checkbox,
  Chip,
  Collapse,
  createStyles,
  Grid,
  IconButton,
  styled,
  Tooltip,
  Typography,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import {
  CheckBox,
  CheckBoxOutlineBlank,
  DeleteOutlineOutlined,
  ExpandMore,
  GetApp,
  RemoveCircleOutline,
  Share,
  UnarchiveOutlined,
} from "@material-ui/icons";
import BookOutlinedIcon from "@material-ui/icons/BookOutlined";
import DeleteOutlineIcon from "@material-ui/icons/DeleteOutline";
import DescriptionOutlinedIcon from "@material-ui/icons/DescriptionOutlined";
import ImageOutlinedIcon from "@material-ui/icons/ImageOutlined";
import MusicVideoOutlinedIcon from "@material-ui/icons/MusicVideoOutlined";
import OndemandVideoOutlinedIcon from "@material-ui/icons/OndemandVideoOutlined";
import PublishOutlinedIcon from "@material-ui/icons/PublishOutlined";
import RemoveCircleOutlineIcon from "@material-ui/icons/RemoveCircleOutline";
import { Pagination } from "@material-ui/lab";
import clsx from "clsx";
import React, { Fragment, useState } from "react";
import { Content } from "../../api/api";
import LayoutBox from "../../components/LayoutBox";
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
    },
    cardContent: {
      padding: "10px 8px 4px 10px",
    },
    cardMedia: {
      width: "100%",
      paddingTop: "47.6%",
      position: "relative",
    },
    checkbox: {
      position: "absolute",
      padding: 0,
      borderRadius: 5,
      top: 10,
      left: 12,
      backgroundColor: "white",
    },
    cardActions: {
      flexWrap: "wrap",
      justifyContent: "space-between",
      height: "40px",
    },
    iconButtonExpandMore: {
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

function MyOperations() {
  const css = useStyles();
  return (
    <React.Fragment>
      <Tooltip title="Delete">
        <IconButton className={css.iconButtonBottom}>
          <RemoveCircleOutline className={css.remove} fontSize="small"></RemoveCircleOutline>
        </IconButton>
      </Tooltip>
      <Tooltip title="Share">
        <IconButton className={css.iconButtonBottom}>
          <Share className={css.share} fontSize="small"></Share>
        </IconButton>
      </Tooltip>
      <Tooltip title="Download">
        <IconButton className={css.iconButtonBottom}>
          <GetApp className={css.getApp} fontSize="small"></GetApp>
        </IconButton>
      </Tooltip>
    </React.Fragment>
  );
}

function PendingOperations() {
  const css = useStyles();
  return (
    <React.Fragment>
      <Chip
        className={clsx(css.chipBottom, css.approveChip)}
        clickable
        label="Approve"
        variant="outlined"
        classes={{ label: css.ChipLabel }}
      ></Chip>
      <Chip
        className={clsx(css.chipBottom, css.rejectChip)}
        clickable
        label="Reject"
        variant="outlined"
        classes={{ label: css.ChipLabel }}
      ></Chip>
    </React.Fragment>
  );
}

function ArchivedOperations() {
  const css = useStyles();
  return (
    <React.Fragment>
      <Tooltip title="Publish">
        <IconButton className={css.iconButtonBottom}>
          <UnarchiveOutlined className={css.unarchive} fontSize="small"></UnarchiveOutlined>
        </IconButton>
      </Tooltip>
      <Tooltip title="Delete">
        <IconButton className={css.iconButtonBottom}>
          <DeleteOutlineOutlined className={css.remove} fontSize="small"></DeleteOutlineOutlined>
        </IconButton>
      </Tooltip>
    </React.Fragment>
  );
}

function PublishedAction() {
  const css = useStyles();
  return (
    <React.Fragment>
      <RemoveCircleOutlineIcon className={css.iconColor} />
    </React.Fragment>
  );
}

function UnpublishedAction() {
  const css = useStyles();
  return (
    <React.Fragment>
      <DeleteOutlineIcon className={css.iconColor} />
    </React.Fragment>
  );
}

function ArchivedAction() {
  const css = useStyles();
  return (
    <div>
      <PublishOutlinedIcon className={css.rePublishColor} />
      <DeleteOutlineIcon className={css.iconColor} />
    </div>
  );
}
interface ContentTypeProps {
  content_type_name?: string;
  id?: string;
  thumbnail?: string;
}
function Background(props: ContentTypeProps) {
  const css = useStyles();
  const [checkedArr, setCheckedArr] = React.useState<string[]>([""]);

  const handleChecked = (event: React.ChangeEvent<HTMLInputElement>, id?: string) => {
    console.log(event.target.checked, id);
    console.log(checkedArr);
    checkedArr.push(id || "");
    setCheckedArr(checkedArr);
  };
  const color = () => {
    if (props.content_type_name === "img") {
      return {
        color: "#ffc107",
        icon: <ImageOutlinedIcon className={css.cardType} />,
      };
    }
    if (props.content_type_name === "video") {
      return {
        color: "#9c27b0",
        icon: <OndemandVideoOutlinedIcon className={css.cardType} />,
      };
    }
    if (props.content_type_name === "audio") {
      return {
        color: "#009688",
        icon: <MusicVideoOutlinedIcon className={css.cardType} />,
      };
    }
    if (props.content_type_name === "document") {
      return {
        color: "#4054b2",
        icon: <DescriptionOutlinedIcon className={css.cardType} />,
      };
    }
    if (props.content_type_name === "lesson") {
      return {
        color: "#0e78d5",
        icon: <BookOutlinedIcon className={css.cardType} />,
      };
    }
    return {
      color: "#ffc107",
      icon: <ImageOutlinedIcon className={css.cardType} />,
    };
  };
  return (
    <Fragment>
      {props.thumbnail ? (
        <CardMedia className={css.cardMedia} image={props.thumbnail}>
          <Checkbox
            icon={<CheckBoxOutlineBlank viewBox="3 3 18 18"></CheckBoxOutlineBlank>}
            checkedIcon={<CheckBox viewBox="3 3 18 18"></CheckBox>}
            size="small"
            className={css.checkbox}
            color="secondary"
            onChange={(e) => {
              handleChecked(e, props.id);
            }}
          ></Checkbox>
        </CardMedia>
      ) : (
        <CardMedia className={css.cardBackground} style={{ backgroundColor: color().color }}>
          {color().icon}
          <Checkbox
            icon={<CheckBoxOutlineBlank viewBox="3 3 18 18"></CheckBoxOutlineBlank>}
            checkedIcon={<CheckBox viewBox="3 3 18 18"></CheckBox>}
            size="small"
            className={css.checkbox}
            color="secondary"
            onChange={(e) => {
              handleChecked(e, props.id);
            }}
          ></Checkbox>
        </CardMedia>
      )}
    </Fragment>
  );
}

function ContentCard(props: Content) {
  const css = useStyles();
  const expand = useExpand();
  const status = props.publish_status;
  return (
    <Card className={css.card}>
      <CardActionArea>
        <Background content_type_name={props.content_type_name} thumbnail={props.thumbnail} id={props.id} />
      </CardActionArea>
      <CardContent className={css.cardContent}>
        <Grid container>
          <Typography variant="subtitle1">{props.name}</Typography>
          <ExpandBtn className={css.iconButtonExpandMore} {...expand.expandMore}>
            <ExpandMore fontSize="small"></ExpandMore>
          </ExpandBtn>
        </Grid>
        <Collapse {...expand.collapse} unmountOnExit>
          <Typography className={css.body2} variant="body2">
            {props.age}
          </Typography>
        </Collapse>
        {/* <Typography className={css.body2} variant="body2">
          {props.developmental}
        </Typography> */}
      </CardContent>
      <CardActions className={css.cardActions}>
        <Typography className={css.body2} variant="body2">
          {props.author_name}
        </Typography>
        {/* <Chip className={css.previewChip} clickable label="Preview" variant="outlined" classes={{ label: css.ChipLabel }}></Chip> */}
        {/* {(status === "content" || status === "published" || status === "assets") && <MyOperations />} */}
        {status === "published" && <PublishedAction />}
        {status === "unpublished" && <UnpublishedAction />}
        {status === "archived" && <ArchivedAction />}
      </CardActions>
    </Card>
  );
}

interface ContentCardListProps {
  total: number;
  amountPerPage?: number;
  publish_status: string;
  list: Content[];
}
export default function ContentCardList(props: ContentCardListProps) {
  const css = useStyles();
  const status = props.publish_status;
  const { list, total, amountPerPage = 16 } = props;
  const cardlist = list.map((item, idx) => (
    <Grid key={idx} item xs={12} sm={6} md={4} lg={3} xl={3}>
      <ContentCard {...item} publish_status={status}></ContentCard>
    </Grid>
  ));
  return (
    <LayoutBox holderMin={40} holderBase={202} mainBase={1517}>
      <Grid className={css.gridContainer} container>
        {cardlist}
      </Grid>
      <Pagination className={css.pagination} classes={{ ul: css.paginationUl }} count={Math.ceil(total / amountPerPage)} color="primary" />
    </LayoutBox>
  );
}
