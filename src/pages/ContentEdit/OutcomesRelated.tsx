import {
  Box,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  makeStyles,
  SvgIcon,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@material-ui/core";
import { Palette, PaletteColor } from "@material-ui/core/styles/createPalette";
import { AddCircle, RemoveCircle } from "@material-ui/icons";
import CloseIcon from "@material-ui/icons/Close";
import { Pagination } from "@material-ui/lab";
import clsx from "clsx";
import { cloneDeep } from "lodash";
import React, { useCallback, useMemo } from "react";
import { Control } from "react-hook-form";
import { EntityOutcome, EntityOutcomeCondition } from "../../api/api.auto";
import PermissionType from "../../api/PermissionType";
import { ReactComponent as SortSvg } from "../../assets/icons/Slice 1.svg";
import { resultsTip } from "../../components/TipImages";
import { usePermission } from "../../hooks/usePermission";
import { d, t } from "../../locale/LocaleManager";
import { getOutcomeList } from "../../models/ModelContentDetailForm";
import { LinkedMockOptions, LinkedMockOptionsItem } from "../../reducers/content";
import { ISearchOutcomeForm, OutcomesProps } from "./Outcomes";
import { OutcomesSearch } from "./OutcomesSearch";

const createColor = (paletteColor: PaletteColor, palette: Palette) => ({
  color: paletteColor.main,
  cursor: "pointer",
  "&:hover": {
    color: paletteColor.dark,
  },
});
const useStyles = makeStyles(({ breakpoints, palette, typography }) => ({
  table: {
    minWidth: 700,
  },
  tableHead: {
    backgroundColor: "#F2F5F7",
  },
  addGreen: createColor(palette.success, palette),
  removeRead: createColor(palette.error, palette),
  paginationUl: {
    justifyContent: "center",
  },

  closeButton: {
    position: "absolute",
    right: 14,
    top: 9,
    color: palette.grey[500],
  },
  outcomeCursor: {
    cursor: "pointer",
    wordBreak: "break-all",
  },
  tabelCell: {
    maxWidth: 150,
  },
  outcomeSet: {
    overflow: "hidden",
    display: "-webkit-box",
    textOverflow: "ellipsis",
    WebkitBoxOrient: "vertical",
    WebkitLineClamp: 3,
    maxHeight: 93,
    maxWidth: 210,
    wordWrap: "break-word",
    wordBreak: "normal",
    cursor: "poniter",
  },
  addButton: {
    width: "95%",
    margin: "20px 0 14px",
  },
  dialogRoot: {
    "& .MuiDialog-paper": {
      height: "calc(100% - 64px)",
    },
    "& .MuiDialog-root .makeStyles-dialogRoot-290": {
      zIndex: "2 !important",
      color: "red",
    },
  },
  toolTip: {
    color: "rgba(1,1,1,.87)",
  },
}));

export const getNameByIds = (list?: LinkedMockOptionsItem[], ids?: string[]) => {
  return ids?.reduce((names: string[], id) => {
    const name = list?.find((item) => item.id === id)?.name;
    return name ? names.concat([name]) : names;
  }, []);
};

// outcomes table
interface OutcomesTableProps {
  list?: EntityOutcome[];
  outcomeValue?: EntityOutcome[];
  onChangeOutcomeValue?: (value?: EntityOutcome[]) => any;
  onGoOutcomesDetail: (id?: string) => any;
  onChangePageAndSort?: (props: ISearchOutcomeForm) => any;
  isDialog?: boolean;
  outcomesFullOptions?: LinkedMockOptions;
  total?: number;
  outcomePage?: number;
  amountPerPage?: number;
  handleClickSearch?: OutcomesDialogProps["handleClickSearch"];
}
export const OutcomesTable = (props: OutcomesTableProps) => {
  const {
    list,
    outcomeValue,
    onChangeOutcomeValue,
    onGoOutcomesDetail,
    isDialog,
    onChangePageAndSort,
    outcomesFullOptions,
    handleClickSearch,
    total,
    amountPerPage = 10,
    outcomePage,
  } = props;
  const css = useStyles();
  const [sortUp, toggle] = React.useReducer((sortUp) => !sortUp, false);

  const perm = usePermission([
    PermissionType.associate_learning_outcomes_284,
    PermissionType.create_content_page_201,
    PermissionType.edit_org_published_content_235,
  ]);

  const associateLOC = perm.associate_learning_outcomes_284;
  const createContent = perm.create_content_page_201;
  const editAll = perm.edit_org_published_content_235;
  const isPermission = associateLOC || createContent || editAll;
  const handleAction = (item: EntityOutcome, type: "add" | "remove") => {
    const { outcome_id: id } = item;
    if (type === "add") {
      if (id && outcomeValue) {
        onChangeOutcomeValue?.(outcomeValue.concat([item]));
      }
    } else {
      if (id && outcomeValue) {
        let newValue = cloneDeep(outcomeValue);
        newValue = newValue.filter((v) => v.outcome_id !== id);
        onChangeOutcomeValue?.(newValue);
      }
    }
  };
  const handleClickSort = useCallback(() => {
    onChangePageAndSort?.({ order_by: sortUp ? "name" : "-name" });
    toggle();
  }, [onChangePageAndSort, sortUp]);
  const handleChangePage = useMemo(
    () => (page: number) => {
      page !== outcomePage && handleClickSearch && handleClickSearch({ page, order_by: sortUp ? "-name" : "name" });
    },
    [sortUp, handleClickSearch, outcomePage]
  );
  const rows = list?.map((item, idx) => (
    <TableRow key={item.outcome_id}>
      {isPermission && (
        <TableCell align="center">
          {outcomeValue?.map((v) => v.outcome_id) && outcomeValue?.map((v) => v.outcome_id).indexOf(item.outcome_id) < 0 ? (
            <AddCircle className={css.addGreen} onClick={() => handleAction(item, "add")} />
          ) : (
            <RemoveCircle className={css.removeRead} onClick={() => handleAction(item, "remove")} />
          )}
        </TableCell>
      )}
      <TableCell
        className={clsx(css.outcomeCursor, css.tabelCell)}
        onClick={() => isDialog && (onGoOutcomesDetail(item.outcome_id) as any)}
      >
        {item.outcome_name}
      </TableCell>
      <TableCell align="center">{item.shortcode}</TableCell>
      <TableCell align="center">{getNameByIds(outcomesFullOptions?.developmental, item?.developmental?.split(","))}</TableCell>
      <TableCell align="center" className={css.tabelCell}>
        {getNameByIds(outcomesFullOptions?.skills, item?.skills?.split(","))}
      </TableCell>
    </TableRow>
  ));
  return (
    <>
      <TableContainer style={{ marginBottom: 20, maxHeight: isDialog ? "" : 700 }}>
        <Table className={css.table} stickyHeader>
          <TableHead className={css.tableHead}>
            <TableRow>
              <TableCell align="center"></TableCell>
              <TableCell>
                <Box display="flex">
                  {d("Learning Outcomes").t("library_label_learning_outcomes")}
                  <SvgIcon component={SortSvg} onClick={handleClickSort} cursor="pointer" />
                </Box>
              </TableCell>
              <TableCell align="center">{d("Short Code").t("assess_label_short_code")}</TableCell>
              <TableCell align="center">{d("Category").t("library_label_category")}</TableCell>
              <TableCell align="center">{d("Subcategory").t("library_label_subcategory")}</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>{rows}</TableBody>
        </Table>
      </TableContainer>
      {isDialog && total && (
        <Pagination
          style={{ marginBottom: 20 }}
          classes={{ ul: css.paginationUl }}
          onChange={(e, page) => handleChangePage(page)}
          count={Math.ceil(total / amountPerPage)}
          color="primary"
          page={outcomePage}
        />
      )}
    </>
  );
};
// outcomes dialog
interface OutcomesDialogProps extends OutcomesProps {
  open: boolean;
  toggle: React.DispatchWithoutAction;
  control: Control<ISearchOutcomeForm>;
  onChangeOutcomeProgram: (program_id: string) => any;
  onChangeDevelopmental: (developmental_id: string) => any;
  onChangeOutcomeSubject: (subject_ids: string[]) => any;
  handleClickSearch: (props: { page?: EntityOutcomeCondition["page"]; order_by?: EntityOutcomeCondition["order_by"] }) => any;
}
export const OutComesDialog = (props: OutcomesDialogProps) => {
  const css = useStyles();
  const {
    open,
    toggle,
    value,
    onChange,
    onGoOutcomesDetail,
    outcomesFullOptions,
    list,
    total,
    amountPerPage = 10,
    outcomePage,
    searchName,
    exactSerch,
    assumed,
    searchLOListOptions,
    control,
    outcomeSearchDefault,
    onChangeOutcomeProgram,
    onChangeDevelopmental,
    onChangeOutcomeSubject,
    handleClickSearch,
  } = props;

  return (
    <Box>
      <Dialog onClose={toggle} aria-labelledby="customized-dialog-title" open={open} maxWidth="md" fullWidth className={css.dialogRoot}>
        <DialogTitle id="customized-dialog-title">
          {t("library_label_add_learning_outcomes")}
          <IconButton aria-label="close" className={css.closeButton} onClick={toggle}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers>
          <div>
            <OutcomesSearch
              handleClickSearch={handleClickSearch}
              exactSerch={exactSerch}
              value={searchName}
              assumed={assumed}
              control={control}
              searchLOListOptions={searchLOListOptions}
              onChangeOutcomeProgram={onChangeOutcomeProgram}
              onChangeDevelopmental={onChangeDevelopmental}
              onChangeOutcomeSubject={onChangeOutcomeSubject}
              outcomeSearchDefault={outcomeSearchDefault}
            >
              {list.length ? (
                <OutcomesTable
                  // @ts-ignore
                  onChangePageAndSort={({ order_by }) => handleClickSearch({ order_by })}
                  list={getOutcomeList(list)}
                  outcomeValue={value}
                  onChangeOutcomeValue={onChange}
                  onGoOutcomesDetail={onGoOutcomesDetail}
                  outcomesFullOptions={outcomesFullOptions}
                  isDialog={open}
                  total={total}
                  outcomePage={outcomePage}
                  amountPerPage={amountPerPage}
                  handleClickSearch={handleClickSearch}
                />
              ) : (
                resultsTip
              )}
            </OutcomesSearch>
          </div>
        </DialogContent>
      </Dialog>
    </Box>
  );
};
