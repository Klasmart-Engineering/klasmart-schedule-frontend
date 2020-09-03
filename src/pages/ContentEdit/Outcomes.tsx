import { Box, makeStyles, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@material-ui/core";
import { Palette, PaletteColor } from "@material-ui/core/styles/createPalette";
import { AddCircle, RemoveCircle } from "@material-ui/icons";
import { Pagination } from "@material-ui/lab";
import React from "react";
import { useParams } from "react-router-dom";
import { OutComesInput } from "../../components/OutcomesInput";
import { SearchcmsList } from "../../components/SearchcmsList";
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
    marginBottom: 80,
  },
  paginationUl: {
    justifyContent: "center",
  },
}));
interface OutcomesTableProps {
  list: Outcomes[];
}

export const OutcomesTable = (props: OutcomesTableProps) => {
  const { list } = props;
  const css = useStyles();
  const rows = list.map((item, idx) => (
    <TableRow key={item.id}>
      <TableCell>{item.name}</TableCell>
      <TableCell>{item.shortcode}</TableCell>
      <TableCell>{item.assumed ? "Yes" : ""}</TableCell>
      <TableCell>{item.author}</TableCell>
      <TableCell>{item.id === "4" ? <AddCircle className={css.addGreen} /> : <RemoveCircle className={css.removeRead} />}</TableCell>
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
export interface Outcomes {
  id: string;
  name?: string;
  shortcode: string;
  assumed: boolean;
  author: string;
}
export interface OutcomesProps {
  comingsoon?: boolean;
  list: Outcomes[];
  total: number;
  amountPerPage?: number;
  value: string;
  onSearch: (searchName?: string) => any;
  onChangePage: (page: number) => any;
}

export default function Outcomes(props: OutcomesProps) {
  const css = useStyles();
  const { comingsoon, list, onSearch, value } = props;
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
          <SearchcmsList searchName="searchOutcomes" onSearch={onSearch} value={value} />
          {list.length > 0 ? (
            <>
              <OutcomesTable list={list} />
              {pagination}
              <OutComesInput selectedOutcomesList={list} />
            </>
          ) : (
            <NoFiles />
          )}
        </>
      )}
    </Box>
  );
}
