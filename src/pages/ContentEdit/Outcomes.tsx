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
import { cloneDeep } from "lodash";
import React, { useCallback } from "react";
import { useParams } from "react-router-dom";
import { ApiOutcomeView } from "../../api/api.auto";
import { SearchcmsList, SearchcmsListProps } from "../../components/SearchcmsList";
import { d } from "../../locale/LocaleManager";
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
  outcomeCursor: {
    cursor: "pointer",
  },
}));

interface OutcomesTableProps {
  list?: ApiOutcomeView[];
  value?: ApiOutcomeView[];
  onChange?: (value: ApiOutcomeView[]) => any;
  onGoOutcomesDetail: (id: ApiOutcomeView["outcome_id"]) => any;
  open?: boolean;
}
export const OutcomesTable = (props: OutcomesTableProps) => {
  const { list, value, onChange, onGoOutcomesDetail, open } = props;
  const css = useStyles();
  const handleAction = (item: ApiOutcomeView, type: "add" | "remove") => {
    const { outcome_id: id } = item;
    if (type === "add") {
      if (id && value) {
        onChange && onChange(value.concat([item]));
      }
    } else {
      if (id && value) {
        let newValue = cloneDeep(value);
        newValue = newValue.filter((v) => v.outcome_id !== id);
        onChange && onChange(newValue);
      }
    }
  };

  const rows =
    list &&
    list.map((item, idx) => (
      <TableRow key={item.outcome_id}>
        {open ? (
          <TableCell>{item.outcome_name}</TableCell>
        ) : (
          <TableCell className={css.outcomeCursor} onClick={() => onGoOutcomesDetail(item.outcome_id) as any}>
            {item.outcome_name}
          </TableCell>
        )}
        <TableCell>{item.shortcode}</TableCell>
        <TableCell>{item.assumed ? d("Yes").t("assess_label_yes") : ""}</TableCell>
        <TableCell>{item.author_name}</TableCell>
        <TableCell>
          {value?.map((v) => v.outcome_id) && value?.map((v) => v.outcome_id).indexOf(item.outcome_id) < 0 ? (
            <AddCircle className={css.addGreen} onClick={() => handleAction(item, "add")} />
          ) : (
            <RemoveCircle className={css.removeRead} onClick={() => handleAction(item, "remove")} />
          )}
        </TableCell>
      </TableRow>
    ));
  return (
    <>
      <TableContainer className={css.tableContainer}>
        <Table className={css.table} stickyHeader>
          <TableHead className={css.tableHead}>
            <TableRow>
              <TableCell>{d("Learning Outcomes").t("library_label_learning_outcomes")}</TableCell>
              <TableCell>{d("Short Code").t("assess_label_short_code")}</TableCell>
              <TableCell>{d("Assumed").t("assess_label_assumed")}</TableCell>
              <TableCell>{d("Author").t("library_label_author")}</TableCell>
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
  value?: ApiOutcomeView[];
  onChange?: (value: ApiOutcomeView[]) => any;
  onGoOutcomesDetail: (id: ApiOutcomeView["outcome_id"]) => any;
}
export const OutComesInput = (props: OutcomesInputProps) => {
  const css = useStyles();
  const { value, onChange, onGoOutcomesDetail } = props;
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
          <Typography variant="h6">{value && value.length}</Typography>
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
          <OutcomesTable list={value} value={value} onChange={onChange} onGoOutcomesDetail={onGoOutcomesDetail} open={open} />
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export interface OutcomesProps {
  comingsoon?: boolean;
  list: ApiOutcomeView[];
  total: number;
  amountPerPage?: number;
  searchName: string;
  assumed: string;
  onSearch: (searchName: SearchcmsListProps["value"]) => any;
  onCheck?: (assumed: SearchcmsListProps["assumed"]) => any;
  onChangePage: (page: number) => any;
  value?: ApiOutcomeView[];
  onChange?: (value: ApiOutcomeView[]) => any;
  onGoOutcomesDetail: (id: ApiOutcomeView["outcome_id"]) => any;
}

export default function Outcomes(props: OutcomesProps) {
  const css = useStyles();
  const {
    comingsoon,
    list,
    onSearch,
    onCheck,
    searchName,
    assumed,
    value,
    onChange,
    amountPerPage = 10,
    onChangePage,
    total,
    onGoOutcomesDetail,
  } = props;
  const { lesson } = useParams();
  const handChangePage = useCallback(
    (event: object, page: number) => {
      onChangePage(page);
    },
    [onChangePage]
  );

  const pagination = (
    <Pagination
      className={css.pagination}
      classes={{ ul: css.paginationUl }}
      onChange={handChangePage}
      count={Math.ceil(total / amountPerPage)}
      color="primary"
    />
  );
  return (
    <Box className={css.mediaAssets} display="flex" flexDirection="column" alignItems="center">
      {comingsoon && lesson !== "plan" ? (
        <Comingsoon />
      ) : (
        <>
          <SearchcmsList searchName="searchOutcome" onSearch={onSearch} value={searchName} onCheck={onCheck} assumed={assumed} />
          {list.length > 0 ? (
            <>
              <OutcomesTable list={list} value={value} onChange={onChange} onGoOutcomesDetail={onGoOutcomesDetail} />
              {pagination}
            </>
          ) : (
            <NoFiles />
          )}
          <OutComesInput value={value} onChange={onChange} onGoOutcomesDetail={onGoOutcomesDetail} />
        </>
      )}
    </Box>
  );
}
