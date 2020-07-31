import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import clsx from "clsx";
import {
  Grid,
  Card,
  CardMedia,
  CardActions,
  CardContent,
  Typography,
  IconButton,
  Collapse,
  createStyles,
  styled,
  Chip,
  Checkbox,
  CardActionArea,
  Tooltip,
} from "@material-ui/core";
import {
  ExpandMore,
  RemoveCircleOutline,
  Share,
  GetApp,
  CheckBox,
  CheckBoxOutlineBlank,
  UnarchiveOutlined,
  DeleteOutlineOutlined,
} from "@material-ui/icons";
import LayoutBox from "../../components/LayoutBox";

const calcGridWidth = (n: number, p: number) =>
  n === 1 ? "100%" : `calc(100% * ${n / (n - 1 + p)})`;

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
      paddingBottom: 10,
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
    },
    chipBottom: {
      marginLeft: 10,
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
          <RemoveCircleOutline
            className={css.remove}
            fontSize="small"
          ></RemoveCircleOutline>
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
          <UnarchiveOutlined
            className={css.unarchive}
            fontSize="small"
          ></UnarchiveOutlined>
        </IconButton>
      </Tooltip>
      <Tooltip title="Delete">
        <IconButton className={css.iconButtonBottom}>
          <DeleteOutlineOutlined
            className={css.remove}
            fontSize="small"
          ></DeleteOutlineOutlined>
        </IconButton>
      </Tooltip>
    </React.Fragment>
  );
}

interface ContentCardProps {
  status: string;
  type: string;
  name: string;
  img: string;
  developmental: string;
  skills: string;
  age: string;
  settings: string;
  created: string;
  action: string;
}
function ContentCard(props: ContentCardProps) {
  const css = useStyles();
  const expand = useExpand();
  const { status } = props;
  return (
    <Card className={css.card}>
      <CardActionArea>
        <CardMedia className={css.cardMedia} image={props.img}>
          <Checkbox
            icon={
              <CheckBoxOutlineBlank viewBox="3 3 18 18"></CheckBoxOutlineBlank>
            }
            checkedIcon={<CheckBox viewBox="3 3 18 18"></CheckBox>}
            size="small"
            className={css.checkbox}
            color="secondary"
          ></Checkbox>
        </CardMedia>
      </CardActionArea>
      <CardContent className={css.cardContent}>
        <Grid container>
          <Typography variant="subtitle1">{props.name}</Typography>
          <ExpandBtn
            className={css.iconButtonExpandMore}
            {...expand.expandMore}
          >
            <ExpandMore fontSize="small"></ExpandMore>
          </ExpandBtn>
        </Grid>
        <Collapse {...expand.collapse} unmountOnExit>
          <Typography className={css.body2} variant="body2">
            {props.age}
          </Typography>
        </Collapse>
        <Typography className={css.body2} variant="body2">
          {props.developmental}
        </Typography>
      </CardContent>
      <CardActions className={css.cardActions}>
        <Chip
          className={css.previewChip}
          clickable
          label="Preview"
          variant="outlined"
          classes={{ label: css.ChipLabel }}
        ></Chip>
        {(status === "content" ||
          status === "published" ||
          status === "assets") && <MyOperations />}
        {status === "pending" && <PendingOperations />}
        {status === "archived" && <ArchivedOperations />}
      </CardActions>
    </Card>
  );
}

interface ContentCardListProps {
  status: string;
  list: ContentCardProps[];
}
export default function ContentCardList(props: ContentCardListProps) {
  const css = useStyles();
  const { status, list } = props;
  const cardlist = list.map((item, idx) => (
    <Grid key={idx} item xs={12} sm={6} md={4} lg={3} xl={3}>
      <ContentCard {...item} status={status}></ContentCard>
    </Grid>
  ));
  return (
    <LayoutBox holderMin={40} holderBase={202} mainBase={1517}>
      <Grid className={css.gridContainer} container>
        {cardlist}
      </Grid>
    </LayoutBox>
  );
}
