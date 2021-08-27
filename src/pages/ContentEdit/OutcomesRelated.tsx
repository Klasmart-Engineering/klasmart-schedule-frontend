import {
  Box, Dialog,
  DialogContent,
  DialogTitle,
  IconButton, makeStyles, SvgIcon, Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow
} from "@material-ui/core";
import { Palette, PaletteColor } from "@material-ui/core/styles/createPalette";
import { AddCircle, RemoveCircle } from '@material-ui/icons';
import CloseIcon from "@material-ui/icons/Close";
import { Pagination } from "@material-ui/lab";
import { cloneDeep } from "lodash";
import React, { useCallback } from "react";
import { Control } from "react-hook-form";
import { ModelPublishedOutcomeView } from "../../api/api.auto";
import { GetOutcomeDetail, GetOutcomeList } from "../../api/type";
import { ReactComponent as SortSvg } from "../../assets/icons/Slice 1.svg";
import { PermissionType, usePermission } from "../../components/Permission";
import { resultsTip } from "../../components/TipImages";
import { d } from "../../locale/LocaleManager";
import { LinkedMockOptions, LinkedMockOptionsItem } from "../../reducers/content";
import { ISearchOutcomeQuery, OutcomesProps } from "./Outcomes";
import { OutcomesSearch } from "./OutcomesSearch";
const createColor = (paletteColor: PaletteColor, palette: Palette) => ({
  color: paletteColor.main,
  cursor: "pointer",
  "&:hover": {
    color: paletteColor.dark,
  },
});
const useStyles = makeStyles(({ breakpoints, palette,typography }) => ({
  table: {
    minWidth: 700 - 162,
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
    cursor: "poniter"
  },
  addButton: {
    width: "95%",
    margin: "20px 0 14px"
  },
  dialogRoot: {
  "& .MuiDialog-paper": {
    height: "calc(100% - 64px)"
  },
  "& .MuiDialog-root .makeStyles-dialogRoot-290": {
    zIndex: "2 !important",
    color: "red"
  }},
  toolTip: {
    color: "rgba(1,1,1,.87)",
  }
}));

interface OutcomesTableProps {
  list?: ModelPublishedOutcomeView[];
  value?: GetOutcomeList;
  onChange?: (value: GetOutcomeList) => any;
  onGoOutcomesDetail: (id: GetOutcomeDetail["outcome_id"]) => any;
  onChangePageAndSort?: (props:ISearchOutcomeQuery) => any;
  isDialog?: boolean;
  searchLOListOptions?: LinkedMockOptions;
}
const getNameByIds = (list?:LinkedMockOptionsItem[],ids?: string[]) => {
  return ids?.reduce((names:string[], id) => {
    const name = list?.find(item => item.id ===id)?.name;
    return name ? names.concat([name]): names
   }, [])
 }
export const OutcomesTable = (props: OutcomesTableProps) => {
  const { list, value, onChange, onGoOutcomesDetail, isDialog, searchLOListOptions, onChangePageAndSort } = props;
  const css = useStyles();
  const [sortUp, toggle] = React.useReducer((sortUp)=> !sortUp, true);
  const associateLOC = usePermission(PermissionType.associate_learning_outcomes_284);
  const createContent = usePermission(PermissionType.create_content_page_201);
  const editAll = usePermission(PermissionType.edit_org_published_content_235);
  const isPermission = associateLOC || createContent || editAll;
  const handleAction = (item: GetOutcomeDetail, type: "add" | "remove") => {
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
  const handleClickSort = useCallback(() => {
    onChangePageAndSort?.({order_by: sortUp? "name": "-name"});
    toggle()
  },[onChangePageAndSort]);
  const rows =
    list &&
    list.map((item, idx) => (
      <TableRow key={item.outcome_id}>
         {isPermission && (
          <TableCell>
            {value?.map((v) => v.outcome_id) && value?.map((v) => v.outcome_id).indexOf(item.outcome_id) < 0 ? (
              <AddCircle className={css.addGreen} onClick={() => handleAction(item, "add")} />
            ) : (
              <RemoveCircle className={css.removeRead} onClick={() => handleAction(item, "remove")} />
            )}
          </TableCell>
        )}
          <TableCell className={css.outcomeCursor} onClick={() => isDialog && onGoOutcomesDetail(item.outcome_id) as any}>
            <div style={{maxWidth:100, maxHeight:100,overflow:"auto"}}>
             {item.outcome_name}
            </div>
          </TableCell>
        <TableCell>{item.shortcode}</TableCell>
        {/* <TableCell>{item.assumed ? d("Yes").t("assess_label_yes") : ""}</TableCell> */}

        <TableCell>{getNameByIds(searchLOListOptions?.developmental, item.category_ids)}</TableCell>
        <TableCell>{getNameByIds(searchLOListOptions?.skills, item.sub_category_ids)}</TableCell>
        {/* <TableCell>
          {item.sets && <HtmlTooltip placement="top" title={
          <div className={css.toolTip}>{item.sets?.map(item=> (`·${item.set_name}`)).join("")}</div>
          }>
          <div className={css.outcomeSet}>
            {item.sets?.map((item, index) => (index<3 ? <Typography noWrap key={item.set_id}>·{item.set_name}</Typography> : ""))}
            {item.sets && item.sets.length > 3 && <div>...</div>}
            </div>
          </HtmlTooltip>}
        </TableCell> */}
       
      </TableRow>
    ));
  return (
    <>
      <TableContainer style={{ marginBottom: 20, maxHeight: isDialog ? "" : 700,}}>
        <Table className={css.table} stickyHeader>
          <TableHead className={css.tableHead}>
            <TableRow>
              <TableCell></TableCell>
              <TableCell sortDirection="desc">
                <Box display="flex">
                {d("Learning Outcomes").t("library_label_learning_outcomes")}
                <div>
                <SvgIcon component={SortSvg} onClick={handleClickSort} />
                </div>
                </Box>
                </TableCell>
              <TableCell>{d("Short Code").t("assess_label_short_code")}</TableCell>
                <TableCell>{d("Category").t("library_label_category")}</TableCell>
               <TableCell>{d("Subcategory").t("library_label_subcategory")}</TableCell>
              {/* <TableCell>{d("Assumed").t("assess_label_assumed")}</TableCell> */}
               {/* <TableCell>{d("Program").t("library_label_program")}</TableCell> */}
               {/* <TableCell>{d("Subject").t("library_label_subject")}</TableCell> */}
              {/* <TableCell>{d("Learning Outcome Set").t("assess_set_learning_outcome_set")}</TableCell> */}
            </TableRow>
          </TableHead>
          <TableBody>{rows}</TableBody>
        </Table>
      </TableContainer>
    </>
  );
};


// outcomes dialog
interface OutcomesDialogProps extends OutcomesProps {
  open: boolean;
  toggle:  React.DispatchWithoutAction;
  control: Control<ISearchOutcomeQuery>;
  onChangeOutcomeProgram:(program_id: string) => any;
  onChangeDevelopmental:(developmental_id: string[]) => any;
  onChangeOutcomeSubject:(subject_ids: string[]) => any;
  handleClickSearch: (props:{page?:number, order_by?:"name" | "-name" | "created_at" | "-created_at" | "updated_at" | "-updated_at"}) => any;

}
export const OutComesDialog = (props: OutcomesDialogProps) => {
  const css = useStyles();
  const { open, toggle, value, onChange, onGoOutcomesDetail,list,total, amountPerPage = 10, outcomePage, searchName,     
    exactSerch,
    assumed, 
    searchLOListOptions,
    control,
    onChangeOutcomeProgram,
    onChangeDevelopmental,
    onChangeOutcomeSubject,
    handleClickSearch,
   } = props;
  const pagination = (
    <Pagination
      style={{marginBottom: 20}}
      classes={{ ul: css.paginationUl }}
      onChange={(e,page) => handleClickSearch({page})}
      count={Math.ceil(total / amountPerPage)}
      color="primary"
      page={outcomePage}
    />
  );
  return (
    <Box>
      <Dialog onClose={toggle} aria-labelledby="customized-dialog-title" open={open} maxWidth="md" fullWidth className={css.dialogRoot} >
        <DialogTitle id="customized-dialog-title">
          {"Add Learning Outcomes"}
          <IconButton aria-label="close" className={css.closeButton} onClick={toggle}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers >
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
            onChangeOutcomeSubject={onChangeOutcomeSubject}>
            {list.length ?(<>
            <OutcomesTable onChangePageAndSort={({order_by}) => handleClickSearch({order_by})} searchLOListOptions={searchLOListOptions}  list={list} value={value} onChange={onChange} onGoOutcomesDetail={onGoOutcomesDetail} isDialog={open} />
            {pagination}
            </>) : resultsTip }
            </OutcomesSearch>
          </div> 
        </DialogContent>
      </Dialog>
    </Box>
  );
};