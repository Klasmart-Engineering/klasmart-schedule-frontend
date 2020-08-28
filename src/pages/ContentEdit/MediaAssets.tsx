import {
  Box,
  Button,
  makeStyles,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@material-ui/core";
import { Search } from "@material-ui/icons";
import clsx from "clsx";
import React, { Fragment, useCallback } from "react";
import { useDrag } from "react-dnd";
import { Controller, useForm } from "react-hook-form";
import { useParams } from "react-router-dom";
import { Content } from "../../api/api";
import comingsoonIconUrl from "../../assets/icons/coming soon.svg";
import emptyIconUrl from "../../assets/icons/empty.svg";
import noFilesIconUrl from "../../assets/icons/nofiles.svg";
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
  noFilesImage: {
    marginTop: 200,
    marginBottom: 40,
    width: 135,
    height: 125,
  },
  emptyDesc: {
    marginBottom: "auto",
  },
  searchField: {
    flexGrow: 2,
    flexShrink: 0.5,
    marginLeft: 40,
  },
  fieldset: {
    minWidth: 110,
    "&:not(:first-child)": {
      marginLeft: 16,
      marginRight: 221,
    },
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
        Comingsoon...
      </Typography>
    </Fragment>
  );
}
export function NoFiles() {
  const css = useStyles();
  return (
    <Fragment>
      <img className={css.noFilesImage} alt="noFiles" src={noFilesIconUrl} />
      <Typography className={css.emptyDesc} variant="body1" color="textSecondary">
        No file was found
      </Typography>
    </Fragment>
  );
}

interface DraggableItemProps {
  type: string;
  item: Content;
}
function DraggableImage(props: DraggableItemProps) {
  const { type, item } = props;
  const css = useStyles();
  const [, dragRef] = useDrag({ item: { type, data: item } });
  return <img ref={dragRef} className={css.assetImage} alt="pic" src={item.thumbnail} />;
}

export interface MediaAssetsProps {
  list: Content[];
  comingsoon?: boolean;
  searchText?: string;
  onSearch: (searchText: MediaAssetsProps["searchText"]) => any;
}
export default function MediaAssets(props: MediaAssetsProps) {
  const { lesson } = useParams();
  const { getValues, control } = useForm<Pick<MediaAssetsProps, "searchText">>();
  const css = useStyles();
  const { list, comingsoon, searchText, onSearch } = props;
  const handleClickSearch = useCallback(() => {
    const { searchText } = getValues();
    onSearch(searchText);
  }, [getValues, onSearch]);
  const rows = list.map((item, idx) => (
    <TableRow key={idx}>
      <TableCell>
        <DraggableImage type="LIBRARY_ITEM" item={item} />
      </TableCell>
      <TableCell>{item.name}</TableCell>
      <TableCell>{item.author}</TableCell>
      <TableCell>{item.developmental}</TableCell>
      <TableCell>{item.skills}</TableCell>
      <TableCell>{item.age}</TableCell>
      <TableCell>{item.grade}</TableCell>
      <TableCell>{item.publish_scope}</TableCell>
      {/* <TableCell>{multipleLine(item.created.split(" "))}</TableCell> */}
    </TableRow>
  ));
  const table = (
    <TableContainer className={css.tableContainer}>
      <Table className={css.table}>
        <TableHead className={css.tableHead}>
          <TableRow>
            <TableCell>Content Thumbnail</TableCell>
            <TableCell>Content Name</TableCell>
            <TableCell>Author</TableCell>
            <TableCell>Developmental</TableCell>
            <TableCell>Skills</TableCell>
            <TableCell>Age</TableCell>
            <TableCell>Grade</TableCell>
            <TableCell>visibility settings</TableCell>
            {/* <TableCell>Created On</TableCell> */}
          </TableRow>
        </TableHead>
        <TableBody>{rows}</TableBody>
      </Table>
    </TableContainer>
  );
  const search = (
    <Box display="flex" pt={2.5}>
      <Controller
        as={TextField}
        control={control}
        name="searchText"
        defaultValue={searchText}
        size="small"
        className={clsx(css.fieldset, css.searchField)}
        placeholder="Search"
      />
      <Button color="primary" variant="contained" size="small" className={css.fieldset} startIcon={<Search />} onClick={handleClickSearch}>
        Search
      </Button>
    </Box>
  );

  return (
    <Box className={css.mediaAssets} width="100%" display="flex" flexDirection="column" alignItems="center">
      {comingsoon && lesson !== "plan" ? (
        <Comingsoon />
      ) : (
        <>
          {search}
          {list.length > 0 ? table : <NoFiles />}
        </>
      )}
    </Box>
  );
}
