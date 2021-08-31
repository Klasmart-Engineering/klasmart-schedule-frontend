import { Box, Button, makeStyles } from "@material-ui/core";
import { Pagination } from "@material-ui/lab";
import React, { forwardRef, useMemo } from "react";
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { useParams } from "react-router-dom";
import { ContentEditRouteParams } from ".";
import { EntityOutcome, ModelPublishedOutcomeView } from "../../api/api.auto";
import { GetOutcomeDetail } from "../../api/type";
import { comingsoonTip, TipImages, TipImagesType } from "../../components/TipImages";
import {
  getOutcomesOptionCategorys,
  getOutcomesOptions,
  getOutcomesOptionSkills,
  ISearchPublishedLearningOutcomesParams,
  LinkedMockOptions
} from "../../reducers/content";
import { OutComesDialog, OutcomesTable } from "./OutcomesRelated";
const AMOUNTPERPAGE = 10;
const useStyles = makeStyles(({ breakpoints, palette, typography }) => ({
  mediaAssets: {
    minHeight: 860,
    position: "relative",
  },
  addOutcomesButton: {
    width: "100%",
    height: 48,
    backgroundColor: "rgba(75,136,245,0.20)",
    borderRadius: 6,
    border: "1px solid #4b88f5",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    boxSizing: "border-box",
    cursor: "pointer",
    color: "#4b88f5",
  },
  addButton: {
    width: "95%",
    margin: "20px 0 14px",
  },
  pagination: {
    position: "absolute",
    bottom:20,
  }
}));

export type ISearchOutcomeQuery = Exclude<ISearchPublishedLearningOutcomesParams, "assumed"> & {
  value?: string;
  exactSerch?: string;
  assumed?: boolean;
};
export type ISearchOutcomeForm = ISearchOutcomeQuery & { program?: string; category?: string };
export interface OutcomesProps {
  comingsoon?: boolean;
  list: ModelPublishedOutcomeView[];
  total: number;
  amountPerPage?: number;
  searchName: string;
  exactSerch: string;
  assumed: boolean;
  onSearch: (query: ISearchOutcomeQuery) => any;
  value?: EntityOutcome[];
  onChange?: (value: EntityOutcome[]) => any;
  onGoOutcomesDetail: (id: GetOutcomeDetail["outcome_id"]) => any;
  outcomePage: number;
  searchLOListOptions: LinkedMockOptions;
  outcomesFullOptions: LinkedMockOptions;
  outcomeSearchDefault: ISearchOutcomeForm;
}

export const Outcomes = forwardRef<HTMLDivElement, OutcomesProps>((props, ref) => {
  const css = useStyles();
  const { comingsoon, value, onChange, onGoOutcomesDetail, onSearch, outcomesFullOptions,outcomeSearchDefault } = props;
  const dispatch = useDispatch();
  const { lesson } = useParams<ContentEditRouteParams>();
  const [open, toggle] = React.useReducer((open) => !open, false);
  const [currentPage, setCurrentPage] = React.useState(1);
  const [selectedValue, setSelectedValue] = React.useState<EntityOutcome[]|undefined>(value);
  const { getValues, control, watch ,reset} = useForm<ISearchOutcomeForm>();
  const programId = watch("program")?.split("/")[0] || outcomeSearchDefault?.program?.split("/")[0];
  const program_id = programId === "all" ? "" : programId;
  const handleChangeProgram = useMemo(
    () => async (program_id: string) => {
      dispatch(getOutcomesOptions({ metaLoading: true, program_id: program_id === "all" ? "" : program_id }));
      reset({ ...getValues(),program: `${program_id}/all`, category: "all/all", age_ids:"", grade_ids: "" });
    },
    [dispatch, reset, getValues]
  );
  const handleChangeSubject = useMemo(
    () => async (subject_ids: string[]) => {
      const subjectId = subject_ids.includes("all") ? [] : subject_ids;
      dispatch(getOutcomesOptionCategorys({ metaLoading: true, program_id, subject_ids: subjectId.join(",") }));
      reset({ ...getValues(),program: `${programId||"all"}/${subject_ids.join(",")}`, category: "all/all",  });
    },
    [dispatch, program_id, programId, getValues,reset]
  );
  const handleChangeDevelopmental = useMemo(
    () => (developmental_id: string) => {
      const developmentalId = developmental_id === "all" ? "" : developmental_id;
      dispatch(
        getOutcomesOptionSkills({
          metaLoading: true,
          program_id,
          developmental_id: developmentalId,
        })
      );
    },
    [dispatch, program_id]
  );
  const handleChangePage = useMemo(() => (page:number) => {
    setCurrentPage(page);
  },[]);
  const localSort=useMemo(() => (props: ISearchOutcomeQuery) => {
    const sortValue = value?.slice()?.sort((a , b) =>{
      if(!a ||!b||!a.outcome_name||!b.outcome_name) return 1;
     return props.order_by ==="-name"?
      a.outcome_name.charCodeAt(0) - b.outcome_name.charCodeAt(0) 
      : b.outcome_name.charCodeAt(0) - a.outcome_name.charCodeAt(0)
    })
    setSelectedValue(sortValue);
    setCurrentPage(1);
  }, [value])
  const handleChangeValue = useMemo(() =>(value:EntityOutcome[]) =>{
    if(value.length <= (currentPage-1) * AMOUNTPERPAGE){
      currentPage>1 && setCurrentPage(currentPage-1)
    }
    onChange?.(value);
  },[currentPage, onChange]);
  const addOutcomeButton = (
    <Button className={css.addOutcomesButton} onClick={toggle}>
      {"Add Learning Outcomes"}
    </Button>
  );
  React.useEffect(()=>{
    setSelectedValue(value)
  }, [value])
  return (
    <Box className={css.mediaAssets} display="flex" flexDirection="column" alignItems="center" {...{ ref }}>
      {comingsoon && lesson !== "plan" ? (
        comingsoonTip
      ) : (
        <>
          {value && value.length > 0 ? (
            <>
              <div className={css.addButton}>{addOutcomeButton}</div>
              <OutcomesTable
                list={selectedValue?.filter((item, index) => (index>= (currentPage-1) * AMOUNTPERPAGE && index < (currentPage-1) * AMOUNTPERPAGE + 10) )}
                outcomeValue={value}
                onChangeOutcomeValue={handleChangeValue}
                onGoOutcomesDetail={onGoOutcomesDetail}
                outcomesFullOptions={outcomesFullOptions}
                onChangePageAndSort={localSort}

              />
            </>
          ) : (
            <TipImages type={TipImagesType.empty}>{addOutcomeButton}</TipImages>
          )}
        </>
      )}
      {value && value.length > 0 && <Pagination
        className={css.pagination}
        onChange={(e, page) => handleChangePage( page )}
        count={Math.ceil(value.length / AMOUNTPERPAGE)}
        color="primary"
        page={currentPage}
      />}
      {open && (
        <OutComesDialog
          {...props}
          open={open}
          toggle={toggle}
          control={control}
          onChangeOutcomeProgram={handleChangeProgram}
          onChangeDevelopmental={handleChangeDevelopmental}
          onChangeOutcomeSubject={handleChangeSubject}
          handleClickSearch={({ page, order_by }) => {
            console.log("page, order_by=",page, order_by);
            const { program, category, ...resValues } = getValues();
            const category_ids = watch("category")?.split("/")[0];
            const sub_category_ids = watch("category")?.split("/")[1];
            const program_ids = watch("program")?.split("/")[0];
            const subject_ids = watch("program")?.split("/")[1];
            onSearch({
              ...resValues,
              program_ids: program_ids === "all" ? "" : program_ids,
              subject_ids: subject_ids === "all" ? "" : subject_ids,
              category_ids: category_ids === "all" ? "" : category_ids,
              sub_category_ids: sub_category_ids === "all" ? "" : sub_category_ids,
            });
          }}
        />
      )}
    </Box>
  );
});
