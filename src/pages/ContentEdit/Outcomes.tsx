import {
  Box,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  makeStyles,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@material-ui/core";
import { Palette, PaletteColor } from "@material-ui/core/styles/createPalette";
import { AddCircle, RemoveCircle } from "@material-ui/icons";
import CloseIcon from "@material-ui/icons/Close";
import { Pagination } from "@material-ui/lab";
import React from "react";
import { useParams } from "react-router-dom";
import { LearningOutcomes } from "../../api/api";
import { SearchcmsList, SearchcmsListProps } from "../../components/SearchcmsList";
import { Comingsoon, NoFiles } from "./MediaAssets";

const createColor = (paletteColor: PaletteColor, palette: Palette) => ({
  color: paletteColor.main,
  cursor: "pointer",
  "&:hover": {
    color: paletteColor.dark,
  },
});
const useStyles = makeStyles(({ breakpoints, palette }) => ({
  mediaAssets: {
    minHeight: 722,
    [breakpoints.down("sm")]: {
      minHeight: 698,
    },
    position: "relative",
  },
  tableContainer: {
    marginTop: 5,
    maxHeight: 700,
    marginBottom: 20,
  },
  table: {
    minWidth: 700 - 162,
  },
  tableHead: {
    backgroundColor: "#F2F5F7",
  },
  addGreen: createColor(palette.success, palette),
  removeRead: createColor(palette.error, palette),
  pagination: {
    marginBottom: 90,
  },
  paginationUl: {
    justifyContent: "center",
  },
  outcomsInput: {
    position: "absolute",
    bottom: 20,
    width: "95%",
  },
  addOutcomesButton: {
    width: "100%",
    height: 54,
    backgroundColor: palette.primary.main,
    borderRadius: 6,
    padding: "5px 30px",
    display: "flex",
    alignItems: "center",
    boxSizing: "border-box",
    cursor: "pointer",
    "&:hover": {
      backgroundColor: palette.action.disabledOpacity,
    },
  },
  addText: {
    color: palette.common.white,
  },
  indexUI: {
    width: 35,
    height: 35,
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: palette.common.white,
    color: palette.primary.main,
    position: "absolute",
    right: 32,
  },
  closeButton: {
    position: "absolute",
    right: 14,
    top: 9,
    color: palette.grey[500],
  },
}));

interface OutcomesTableProps {
  list: LearningOutcomes[];
}
export const OutcomesTable = (props: OutcomesTableProps) => {
  const { list } = props;
  const css = useStyles();
  const rows = list.map((item, idx) => (
    <TableRow key={item.outcome_id}>
      <TableCell>{item.outcome_name}</TableCell>
      <TableCell>{item.shortcode}</TableCell>
      <TableCell>{item.assumed ? "Yes" : ""}</TableCell>
      <TableCell>{item.author_name}</TableCell>
      <TableCell>
        {item.outcome_id === "4" ? <AddCircle className={css.addGreen} /> : <RemoveCircle className={css.removeRead} />}
      </TableCell>
    </TableRow>
  ));
  return (
    <>
      <TableContainer className={css.tableContainer}>
        <Table className={css.table} stickyHeader>
          <TableHead className={css.tableHead}>
            <TableRow>
              <TableCell>Learning Outcomes</TableCell>
              <TableCell>Short Code</TableCell>
              <TableCell>Assumed</TableCell>
              <TableCell>Author</TableCell>
              <TableCell></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>{rows}</TableBody>
        </Table>
      </TableContainer>
    </>
  );
};

interface OutcomesInputProps {
  value: LearningOutcomes[];
}
export const OutComesInput = (props: OutcomesInputProps) => {
  const css = useStyles();
  const { value } = props;
  const [open, setOpen] = React.useState(false);
  const handleClickOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

  return (
    <Box className={css.outcomsInput}>
      <Box color="primary" className={css.addOutcomesButton} boxShadow={3} onClick={handleClickOpen}>
        <Typography component="h6" className={css.addText}>
          Added Learning Outcomes
        </Typography>
        <Box mr={2} className={css.indexUI}>
          <Typography variant="h6">{value.length}</Typography>
        </Box>
      </Box>
      <Dialog onClose={handleClose} aria-labelledby="customized-dialog-title" open={open}>
        <DialogTitle id="customized-dialog-title">
          Added Learning Outcomes
          <IconButton aria-label="close" className={css.closeButton} onClick={handleClose}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers>
          <OutcomesTable list={value} />
        </DialogContent>
      </Dialog>
    </Box>
  );
};
export interface Outcomes {
  id: string;
  name?: string;
  shortcode: string;
  assumed: boolean;
  author: string;
}
export interface OutcomesProps {
  comingsoon?: boolean;
  list: LearningOutcomes[];
  total: number;
  amountPerPage?: number;
  value: string;
  assumed: string;
  onSearch: (searchName: SearchcmsListProps["value"]) => any;
  onCheck?: (assumed: SearchcmsListProps["assumed"]) => any;
  onChangePage: (page: number) => any;
}

export default function Outcomes(props: OutcomesProps) {
  const css = useStyles();
  const { comingsoon, list, onSearch, onCheck, value, assumed } = props;
  const { lesson } = useParams();
  // const handChangePage = useCallback(
  //   (event: object, page: number) => {
  //     onChangePage(page);
  //   },
  //   [onChangePage]
  // );

  const pagination = (
    <Pagination
      className={css.pagination}
      classes={{ ul: css.paginationUl }}
      // onChange={handChangePage}
      // count={Math.ceil(total / amountPerPage)}
      color="primary"
    />
  );
  return (
    <Box className={css.mediaAssets} display="flex" flexDirection="column" alignItems="center">
      {comingsoon && lesson !== "plan" ? (
        <Comingsoon />
      ) : (
        <>
          <SearchcmsList searchName="searchOutcomes" onSearch={onSearch} value={value} onCheck={onCheck} assumed={assumed} />
          {list.length > 0 ? (
            <>
              <OutcomesTable list={list} />
              {pagination}
              <OutComesInput value={list} />
            </>
          ) : (
            <NoFiles />
          )}
        </>
      )}
    </Box>
  );
}
