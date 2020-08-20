import React, { Fragment } from "react";
import { Table, TableHead, TableCell, TableBody, TableRow, Box, makeStyles, TableContainer, Typography } from "@material-ui/core";
import emptyIconUrl from "../../assets/icons/empty.svg";
import comingsoonIconUrl from "../../assets/icons/coming soon.svg";
import { useDrag } from "react-dnd";
import { useParams } from "react-router-dom";

const useStyles = makeStyles(({ breakpoints }) => ({
  mediaAssets: {
    minHeight: 722,
    [breakpoints.down("sm")]: {
      minHeight: 698,
    },
  },
  tableContainer: {
    marginTop: 5,
    marginBottom: "auto",
    overflowX: "scroll",
  },
  table: {
    minWidth: 1200,
  },
  tableHead: {
    backgroundColor: "#F2F5F7",
  },
  assetImage: {
    width: 104,
    height: 64,
  },
  emptyImage: {
    marginTop: 200,
    marginBottom: 40,
    width: 200,
    height: 156,
  },
  comingsoonImage: {
    marginTop: 200,
    marginBottom: 40,
    width: 130,
    height: 133,
  },
  emptyDesc: {
    marginBottom: "auto",
  },
}));

const multipleLine = (list: string[]) => {
  const spanList = list.map((item, idx) => <span key={idx}>{item}</span>);
  return (
    <Box display="flex" flexDirection="column" alignItems="center">
      {spanList}
    </Box>
  );
};

interface Asset {
  status: string;
  type: string;
  name: string;
  img: string;
  fileType: string;
  developmental: string;
  skills: string;
  age: string;
  created: string;
  author: string;
}

interface mockAsset {
  type: string;
  name: string;
  developmental: string;
  img: string;
  fileType: string;
  skills: string;
  age: string;
  settings: string;
  status: string;
  created: string;
  author: string;
  action: string;
}

export function Empty() {
  const css = useStyles();
  return (
    <Fragment>
      <img className={css.emptyImage} alt="empty" src={emptyIconUrl} />
      <Typography className={css.emptyDesc} variant="body1" color="textSecondary">
        Empty...
      </Typography>
    </Fragment>
  );
}
export function Comingsoon() {
  const css = useStyles();
  return (
    <Fragment>
      <img className={css.comingsoonImage} alt="comingsoon" src={comingsoonIconUrl} />
      <Typography className={css.emptyDesc} variant="body1" color="textSecondary">
        comingsoon...
      </Typography>
    </Fragment>
  );
}

interface DraggableItemProps {
  type: string;
  item: mockAsset;
}
function DraggableImage(props: DraggableItemProps) {
  const { type, item } = props;
  const css = useStyles();
  const [, dragRef] = useDrag({ item: { type, data: item } });
  return <img ref={dragRef} className={css.assetImage} alt="pic" src={item.img} />;
}

interface MediaAssetsProps {
  list: mockAsset[];
  comingsoon?: boolean;
}
export default function MediaAssets(props: MediaAssetsProps) {
  const { lesson } = useParams();
  const css = useStyles();
  const { list, comingsoon } = props;
  const rows = list.slice(-2).map((item, idx) => (
    <TableRow key={idx}>
      <TableCell>
        <DraggableImage type="LIBRARY_ITEM" item={item} />
      </TableCell>
      <TableCell>{item.name}</TableCell>
      <TableCell>{item.fileType}</TableCell>
      <TableCell>{item.developmental}</TableCell>
      <TableCell>{item.skills}</TableCell>
      <TableCell>{item.age}</TableCell>
      <TableCell>{multipleLine(item.created.split(" "))}</TableCell>
      <TableCell>Michael Flores</TableCell>
    </TableRow>
  ));
  const table = (
    <TableContainer className={css.tableContainer}>
      <Table className={css.table}>
        <TableHead className={css.tableHead}>
          <TableRow>
            <TableCell>Content Thumbnail</TableCell>
            <TableCell>Content Name</TableCell>
            <TableCell>Content Type</TableCell>
            <TableCell>Category - Subcategory</TableCell>
            <TableCell>Skills Category</TableCell>
            <TableCell>Age</TableCell>
            <TableCell>Created On</TableCell>
            <TableCell>Author</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>{rows}</TableBody>
      </Table>
    </TableContainer>
  );
  return (
    <Box className={css.mediaAssets} display="flex" flexDirection="column" alignItems="center">
      {comingsoon && lesson !== "plan" ? <Comingsoon /> : list.length > 0 ? table : <Empty />}
    </Box>
  );
}
