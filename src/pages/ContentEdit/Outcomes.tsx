import {
  Box, Button, makeStyles
} from "@material-ui/core";
import React, { forwardRef, useMemo } from "react";
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { useParams } from "react-router-dom";
import { ContentEditRouteParams } from ".";
import { EntityOutcome, ModelPublishedOutcomeView } from "../../api/api.auto";
import { GetOutcomeDetail } from "../../api/type";
import { comingsoonTip, TipImages, TipImagesType } from "../../components/TipImages";
import { getOutcomesOptions, getOutcomesOptionSkills, ISearchPublishedLearningOutcomesParams, LinkedMockOptions } from "../../reducers/content";
import { OutComesDialog, OutcomesTable } from "./OutcomesRelated";

const useStyles = makeStyles(({ breakpoints, palette,typography }) => ({
  mediaAssets: {
    minHeight: 900,
    [breakpoints.down("sm")]: {
      minHeight: 698,
    },
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
    margin: "20px 0 14px"
  },
}));


export type ISearchOutcomeQuery = Exclude<ISearchPublishedLearningOutcomesParams, "assumed"> & {
  value?: string;
  exactSerch?: string;
  assumed?: boolean;

}
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
}

export const Outcomes = forwardRef<HTMLDivElement, OutcomesProps>((props, ref) => {
  const css = useStyles();
  const {
    comingsoon,
    value,
    onChange,
    onGoOutcomesDetail,
    onSearch,
    outcomesFullOptions,
  } = props;
  const dispatch = useDispatch();
  const { lesson } = useParams<ContentEditRouteParams>();
  const [open, toggle] = React.useReducer((open)=> !open, false);
  const { getValues, control, watch } = useForm<ISearchOutcomeQuery>();
  const program_id = watch("program_ids");
 const handleChangeProgram = useMemo(
   () => async (program_id: string) => {
     dispatch(getOutcomesOptions({ metaLoading: true, program_id }));
   },
   [dispatch]
 );
 const handleChangeSubject = useMemo(
   () => async (subject_ids: string[]) => {
     dispatch(getOutcomesOptions({ metaLoading: true, program_id, subject_ids: subject_ids.join(",") }));
   },
   [dispatch, program_id]
 );
 const handleChangeDevelopmental = useMemo(
   () => (developmental_id: string[]) => {
     dispatch(
       getOutcomesOptionSkills({
         metaLoading: true,
         program_id,
         developmental_id: developmental_id[0],
       })
     );
   },
   [dispatch]
 );
  const addOutcomeButton = <Button className={css.addOutcomesButton} onClick={toggle}>
      {"Add Learning Outcomes"}
    </Button>
  return (
    <Box className={css.mediaAssets} display="flex" flexDirection="column" alignItems="center" {...{ ref }}>
      {comingsoon && lesson !== "plan" ? (
        comingsoonTip
      ) : (
        <>
          {value && value.length > 0 ? (
            <>
              <div className={css.addButton} >{addOutcomeButton}</div> 
              <OutcomesTable list={value} value={value} onChange={onChange} onGoOutcomesDetail={onGoOutcomesDetail} outcomesFullOptions={outcomesFullOptions} />
            </>
             
          ) : (
            <TipImages type={TipImagesType.empty}>
              {addOutcomeButton}
            </TipImages>
          )}

        </>
      )}
     {open && <OutComesDialog {...props} open={open} toggle={toggle} control={control}
      onChangeOutcomeProgram={handleChangeProgram}
      onChangeDevelopmental={handleChangeDevelopmental}
      onChangeOutcomeSubject={handleChangeSubject}
      handleClickSearch={({page,order_by}) => onSearch({...getValues(),page,order_by})}
     />}
    </Box>
  );
});
