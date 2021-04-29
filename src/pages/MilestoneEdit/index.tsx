import { PayloadAction } from "@reduxjs/toolkit";
import { cloneDeep } from "lodash";
import React, { useEffect, useMemo, useState } from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { Controller, useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { useHistory, useLocation, useParams } from "react-router-dom";
import { GetOutcomeDetail, MilestoneDetailResult, MilestoneStatus } from "../../api/type";
import { ModelMilestoneOptions } from "../../models/ModelMilestone";
import { RootState } from "../../reducers";
import {
  AsyncTrunkReturned,
  getLinkedMockOptions,
  occupyMilestone,
  onLoadMilestoneEdit,
  onLoadOutcomeList,
  publishMilestone,
  saveMilestone,
  updateMilestone,
} from "../../reducers/milestone";
import { actSuccess } from "../../reducers/notify";
import LayoutPair from "../ContentEdit/Layout";
import MilestoneList from "../MilestoneList";
import { OutcomeListExectSearch } from "../OutcomeList/types";
import ContainedOutcomeList, { ContainedOutcomeListProps } from "./ContainedOutcomeList";
import ContentTab from "./ContentTab";
import MilestoneForm from "./MilestoneForm";
import { MilestoneHeader, MilestoneHeaderProps } from "./MilestoneHeader";
import { Outcomes, OutcomesProps } from "./Outcomes";
import { OutcomeSearchProps } from "./OutcomeSearch";
import { Regulation } from "./type";
interface RouteParams {
  tab: "details" | "leaningoutcomes";
}
const toQueryString = (hash: Record<string, any>): string => {
  const search = new URLSearchParams(hash);
  return `?${search.toString()}`;
};
export const clearNull = (obj: Record<string, any>) => {
  Object.keys(obj).forEach((key) => {
    if (obj[key] == null) delete obj[key];
  });
  return obj;
};
const setQuery = (search: string, hash: Record<string, string | number | boolean>): string => {
  const query = new URLSearchParams(search);
  Object.keys(hash).forEach((key) => query.set(key, String(hash[key])));
  return query.toString();
};

export interface MilestoneCondition {
  id: string;
  exect_search: string;
  search_key: string;
  assumed: boolean;
  page: number;
  search: string;
}
export const useQueryCms = (): MilestoneCondition => {
  const { search } = useLocation();
  const query = new URLSearchParams(search);
  const id = query.get("id") || "";
  const exect_search = query.get("exect_search") || OutcomeListExectSearch.all;
  const search_key = query.get("search_key") || "";
  const aa = query.get("assumed");
  const assumed = aa ? (aa === "true" ? true : false) : false;
  const page = Number(query.get("page")) || 1;
  return { id, exect_search, search_key, assumed, page, search };
};
function MilestoneEditForm() {
  // const { breakpoints } = useTheme();
  // const sm = useMediaQuery(breakpoints.down("sm"));
  const dispatch = useDispatch();
  const history = useHistory();
  const condition = useQueryCms();
  const { id, exect_search, search_key, assumed, page, search } = condition;
  const formMethods = useForm<MilestoneDetailResult>();
  const { watch, getValues, handleSubmit, setValue, control, errors } = formMethods;
  const { tab } = useParams<RouteParams>();
  const { routeBasePath } = MilestoneEdit;
  const { milestoneDetail, linkedMockOptions, shortCode, outcomeList, outcomeTotal } = useSelector<RootState, RootState["milestone"]>(
    (state) => state.milestone
  );
  const [canEdit, setCanEdit] = useState(false);
  const [regulation, setRegulation] = useState<Regulation>(id ? Regulation.ByMilestoneDetail : Regulation.ByMilestoneDetailAndOptionCount);
  const initDefaultValue = useMemo(
    () => ModelMilestoneOptions.createDefaultValueAndKey({ regulation, milestoneDetail, linkedMockOptions }),
    [linkedMockOptions, milestoneDetail, regulation]
  );
  const value = watch("outcome_ancestor_ids");
  const handleCancel = () => {};
  const handleSave = useMemo(
    () =>
      handleSubmit(async (value) => {
        console.log(value);
        if (id) {
          const { payload } = ((await dispatch(updateMilestone({ milestone_id: id, milestone: value }))) as unknown) as PayloadAction<
            AsyncTrunkReturned<typeof updateMilestone>
          >;
          if (payload === "ok") {
            dispatch(actSuccess("Update Success"));
            setCanEdit(false);
          }
        } else {
          const { payload } = ((await dispatch(saveMilestone(value))) as unknown) as PayloadAction<
            AsyncTrunkReturned<typeof saveMilestone>
          >;
          if (payload.milestone_id) {
            dispatch(actSuccess("Save Success"));
            setCanEdit(false);
            history.replace({
              search: setQuery(history.location.search, { id: payload.milestone_id }),
            });
          }
        }
      }),
    [dispatch, handleSubmit, history, id]
  );
  const handlePublish: MilestoneHeaderProps["onPublish"] = async () => {
    const { payload } = ((await dispatch(publishMilestone({ ids: [milestoneDetail?.milestone_id || ""] }))) as unknown) as PayloadAction<
      AsyncTrunkReturned<typeof publishMilestone>
    >;
    if (payload === "ok") {
      history.push(MilestoneList.routeBasePath);
    }
  };
  const handleEdit = async () => {
    setCanEdit(!canEdit);
    if (milestoneDetail.status === MilestoneStatus.published) {
      const { payload } = ((await dispatch(
        occupyMilestone({ id: milestoneDetail.milestone_id as string, metaLoading: true })
      )) as unknown) as PayloadAction<AsyncTrunkReturned<typeof occupyMilestone>>;
      if (payload === "ok") {
        history.push(`/milestone/milestone-edit/tab/details?id=${milestoneDetail}&status=edit`);
      }
    }
  };
  const handleDelete = () => {};
  const handleChangeTab = useMemo(
    () => (value: string) => {
      history.replace(`${routeBasePath}/tab/${value}${search}`);
    },
    [history, routeBasePath, search]
  );

  const handleChangeProgram = useMemo(
    () => ([programId]: string[]) => {
      setRegulation(Regulation.ByOptionCount);
      dispatch(getLinkedMockOptions({ default_program_id: programId }));
    },
    [dispatch]
  );
  const handleChangeSubject = useMemo(
    () => (default_subject_ids: string[]) => {
      setRegulation(Regulation.ByOptionCount);
      const program = getValues("program_ids") as string[];
      dispatch(getLinkedMockOptions({ default_program_id: program[0], default_subject_ids: default_subject_ids.join(",") }));
    },
    [dispatch, getValues]
  );
  const handleChangeCategory = useMemo(
    () => ([catetory_id]: string[]) => {
      setRegulation(Regulation.ByOptionCount);
      const program = getValues("program_ids") as string[];
      const subject = getValues("subject_ids") as string[];
      dispatch(
        getLinkedMockOptions({
          default_program_id: program[0],
          default_subject_ids: subject.join(","),
          default_developmental_id: catetory_id,
        })
      );
    },
    [dispatch, getValues]
  );
  const handleClickSearch: OutcomeSearchProps["onSearch"] = (exect_search: string, search_key: string, assumed: boolean) => {
    condition.exect_search = exect_search;
    condition.search_key = search_key;
    condition.assumed = assumed;
    condition.page = 1;
    history.push({ search: toQueryString(clearNull(condition)) });
  };
  const handleChangePage: OutcomesProps["onChangePage"] = (page: number) => {
    condition.page = page;
    history.push({ search: toQueryString(clearNull(condition)) });
  };
  const handleAddOrRemoveOutcome: ContainedOutcomeListProps["addOrRemoveOutcome"] = (outcome: GetOutcomeDetail, type: "add" | "remove") => {
    const { outcome_id: id } = outcome;
    if (type === "add") {
      if (id && value) {
        value.concat([outcome.ancestor_id as string]);
      }
    } else {
      if (id && value) {
        let newValue = cloneDeep(value);
        newValue = newValue.filter((v) => v !== id);
        // onChange && onChange(newValue);
        setValue("outcome_ancestor_ids", newValue);
      }
    }
  };
  useEffect(() => {
    dispatch(onLoadOutcomeList({ exect_search, search_key, assumed: assumed ? 1 : -1, page, metaLoading: true }));
  }, [assumed, dispatch, exect_search, search_key, page]);
  useEffect(() => {
    dispatch(onLoadMilestoneEdit({ id, metaLoading: true }));
    id ? setCanEdit(true) : setCanEdit(false);
  }, [dispatch, id]);
  const leftside = (
    <ContentTab tab={tab} onChangeTab={handleChangeTab} error={errors.milestone_name}>
      <MilestoneForm
        formMethods={formMethods}
        initDefaultValue={initDefaultValue}
        milestoneDetail={milestoneDetail}
        linkedMockOptions={linkedMockOptions}
        onChangeProgram={handleChangeProgram}
        onChangeSubject={handleChangeSubject}
        onChangeCategory={handleChangeCategory}
        milestone_id={id}
        shortCode={shortCode}
        canEdit={canEdit}
      />
      <Controller
        as={Outcomes}
        name="outcome_ancestor_ids"
        defaultValue={milestoneDetail?.outcomes?.map((v) => v.ancestor_id) || []}
        key={initDefaultValue.outcome_ancestor_ids?.key}
        control={control}
        outcomeList={outcomeList}
        outcomeTotal={outcomeTotal}
        condition={condition}
        onSearch={handleClickSearch}
        outcomePage={page}
        onChangePage={handleChangePage}
        canEdit={canEdit}
      />
    </ContentTab>
  );
  const rightside = (
    <>
      <ContainedOutcomeList outcomeList={outcomeList} value={value} canEdit={canEdit} addOrRemoveOutcome={handleAddOrRemoveOutcome} />
    </>
  );
  return (
    <DndProvider backend={HTML5Backend}>
      <MilestoneHeader
        milestoneDetail={milestoneDetail}
        milestone_id={"22"}
        onCancel={handleCancel}
        onSave={handleSave}
        onPublish={handlePublish}
        onEdit={handleEdit}
        onDelete={handleDelete}
        canEdit={canEdit}
        formMethods={formMethods}
      />
      <LayoutPair breakpoint="md" leftWidth={703} rightWidth={1105} spacing={32} basePadding={0} padding={40}>
        {leftside}
        {rightside}
      </LayoutPair>
    </DndProvider>
  );
}

export default function MilestoneEdit() {
  return <MilestoneEditForm />;
}

MilestoneEdit.routeBasePath = "/milestone/milestone-edit";
MilestoneEdit.routeMatchPath = "/milestone/milestone-edit/tab/:tab";
MilestoneEdit.routeRedirectDefault = `/milestone/milestone-edit/tab/details`;
