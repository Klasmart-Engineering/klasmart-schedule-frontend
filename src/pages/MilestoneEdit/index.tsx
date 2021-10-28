import { PayloadAction } from "@reduxjs/toolkit";
import { cloneDeep } from "lodash";
import React, { useEffect, useMemo, useState } from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { Controller, useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { useHistory, useLocation, useParams } from "react-router-dom";
import PermissionType from "../../api/PermissionType";
import { GetOutcomeDetail, MilestoneDetailResult, MilestoneOrderBy, MilestoneStatus } from "../../api/type";
import { NoOutcome } from "../../components/TipImages";
import { usePermission } from "../../hooks/usePermission";
import { d } from "../../locale/LocaleManager";
import { ModelMilestoneOptions } from "../../models/ModelMilestone";
import { RootState } from "../../reducers";
import {
  approveMilestone,
  AsyncTrunkReturned,
  bulkPublishMilestone,
  bulkReject,
  deleteMilestone,
  generateShortcode,
  getLinkedMockOptions,
  occupyMilestone,
  onLoadMilestoneEdit,
  onLoadOutcomeList,
  saveMilestone,
  updateMilestone,
} from "../../reducers/milestone";
import { actSuccess } from "../../reducers/notify";
import LayoutPair from "../ContentEdit/Layout";
import { TabValue } from "../ContentPreview/type";
import MilestoneList from "../MilestoneList";
import { UNPUB } from "../OutcomeList/ThirdSearchHeader";
import { OutcomeListExectSearch } from "../OutcomeList/types";
import ContainedOutcomeList, { AddOutcomes, ContainedOutcomeListProps } from "./ContainedOutcomeList";
import ContentTab from "./ContentTab";
import MilestoneForm from "./MilestoneForm";
import { GENERALMILESTONE, MilestoneHeader, MilestoneHeaderProps } from "./MilestoneHeader";
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
  first_save: boolean;
  is_unpub: string;
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
  const first = query.get("first_save");
  const first_save = first ? (first === "true" ? true : false) : false;
  const is_unpub = query.get("is_unpub") || "";
  return { id, exect_search, search_key, assumed, page, search, first_save, is_unpub };
};
function MilestoneEditForm() {
  // const { breakpoints } = useTheme();
  // const sm = useMediaQuery(breakpoints.down("sm"));
  const dispatch = useDispatch();
  const history = useHistory();
  const condition = useQueryCms();
  const { id, exect_search, search_key, assumed, page, search, first_save, is_unpub } = condition;
  const formMethods = useForm<MilestoneDetailResult>();
  const { watch, getValues, handleSubmit, setValue, control, errors, reset } = formMethods;
  const { tab } = useParams<RouteParams>();
  const { routeBasePath } = MilestoneEdit;
  const { milestoneDetail, linkedMockOptions, shortCode, outcomeList, outcomeTotal, user_id } = useSelector<
    RootState,
    RootState["milestone"]
  >((state) => state.milestone);
  const isMyself = useMemo(() => milestoneDetail.author?.author_id === user_id, [milestoneDetail.author, user_id]);
  const [canEdit, setCanEdit] = useState(false);
  const [regulation, setRegulation] = useState<Regulation>(id ? Regulation.ByMilestoneDetail : Regulation.ByMilestoneDetailAndOptionCount);
  const initDefaultValue = useMemo(
    () => ModelMilestoneOptions.createDefaultValueAndKey({ regulation, milestoneDetail, linkedMockOptions }),
    [linkedMockOptions, milestoneDetail, regulation]
  );
  const perm = usePermission([PermissionType.view_pending_milestone_486]);
  const outcomes = watch("outcomes");
  const isGeneralMilestone = milestoneDetail.type === GENERALMILESTONE;
  const handleCancel = () => {
    history.push(MilestoneList.routeRedirectDefault);
  };
  const handleSave = useMemo(
    () =>
      handleSubmit(async (value) => {
        setRegulation(Regulation.ByMilestoneDetail);
        if (!value.shortcode?.trim()) {
          const resultInfo = ((await dispatch(generateShortcode({ kind: "milestones" }))) as unknown) as PayloadAction<
            AsyncTrunkReturned<typeof generateShortcode>
          >;
          value.shortcode = resultInfo.payload.shortcode;
        }
        const { outcomes, ...restValues } = value;
        const outcome_ancestor_ids = outcomes?.map((v) => v.ancestor_id as string);
        const inputValue = { ...restValues, outcome_ancestor_ids };
        if (id) {
          const { payload } = ((await dispatch(
            updateMilestone({ milestone_id: id, milestone: inputValue, metaLoading: true })
          )) as unknown) as PayloadAction<AsyncTrunkReturned<typeof updateMilestone>>;
          if (payload === "ok") {
            reset(inputValue);
            dispatch(actSuccess(d("Updated Successfully").t("assess_msg_updated_successfully")));
          }
        } else {
          const { payload } = ((await dispatch(saveMilestone(inputValue))) as unknown) as PayloadAction<
            AsyncTrunkReturned<typeof saveMilestone>
          >;
          if (payload.milestone_id) {
            dispatch(actSuccess(d("Saved Successfully").t("assess_msg_saved_successfully")));
            history.replace({
              search: setQuery(history.location.search, { id: payload.milestone_id, first_save: true }),
            });
          }
        }
      }),
    [dispatch, handleSubmit, history, id, reset]
  );
  const handlePublish: MilestoneHeaderProps["onPublish"] = async () => {
    const { payload } = ((await dispatch(bulkPublishMilestone([milestoneDetail.milestone_id as string]))) as unknown) as PayloadAction<
      AsyncTrunkReturned<typeof bulkPublishMilestone>
    >;
    if (payload === "ok") {
      if (perm.view_pending_milestone_486) {
        history.push(`/milestone/milestone-list?status=${MilestoneStatus.pending}&page=1&order_by=${MilestoneOrderBy._created_at}`);
      } else {
        history.push(
          `/milestone/milestone-list?status=${MilestoneStatus.pending}&page=1&order_by=${MilestoneOrderBy._created_at}&is_unpub=UNPUB`
        );
      }
    }
  };
  const handleEdit = async () => {
    if (milestoneDetail.status === MilestoneStatus.published) {
      const result: any = await dispatch(occupyMilestone({ id: milestoneDetail.milestone_id as string, metaLoading: true }));
      if (result && result.payload && result.payload.milestone_id) {
        history.replace(`/milestone/milestone-edit/tab/details?id=${result.payload.milestone_id}&first_save=true`);
        setCanEdit(true);
      }
    } else {
      setCanEdit(true);
    }
  };
  const handleDelete = async () => {
    const { payload } = ((await dispatch(deleteMilestone([id]))) as unknown) as PayloadAction<AsyncTrunkReturned<typeof deleteMilestone>>;
    if (payload === "ok") {
      history.goBack();
    }
  };
  const handleReject: MilestoneHeaderProps["onReject"] = async () => {
    const { payload } = ((await dispatch(bulkReject([milestoneDetail.milestone_id as string]))) as unknown) as PayloadAction<
      AsyncTrunkReturned<typeof bulkReject>
    >;
    if (payload === "ok") {
      dispatch(actSuccess("Reject Success"));
      history.push(`/milestone/milestone-list?status=${MilestoneStatus.pending}&page=1&order_by=${MilestoneOrderBy._created_at}`);
    }
  };
  const handleApprove: MilestoneHeaderProps["onApprove"] = async () => {
    const { payload } = ((await dispatch(approveMilestone([milestoneDetail.milestone_id as string]))) as unknown) as PayloadAction<
      AsyncTrunkReturned<typeof bulkReject>
    >;
    if (payload === "ok") {
      history.push(`/milestone/milestone-list?status=${MilestoneStatus.pending}&page=1&order_by=${MilestoneOrderBy._created_at}`);
    }
  };
  const handleChangeTab = useMemo(
    () => (value: string) => {
      history.replace(`${routeBasePath}/tab/${value}${search}`);
    },
    [history, routeBasePath, search]
  );

  const handleChangeProgram = useMemo(
    () => ([programId]: string[]) => {
      setRegulation(Regulation.ByOptionCount);
      dispatch(getLinkedMockOptions({ default_program_id: programId, metaLoading: true }));
    },
    [dispatch]
  );
  const handleChangeSubject = useMemo(
    () => (default_subject_ids: string[]) => {
      setRegulation(Regulation.ByOptionCount);
      const program = getValues("program_ids") as string[];
      dispatch(
        getLinkedMockOptions({ default_program_id: program[0], default_subject_ids: default_subject_ids.join(","), metaLoading: true })
      );
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
          metaLoading: true,
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
    history.replace({ search: toQueryString(clearNull(condition)) });
    dispatch(onLoadOutcomeList({ exect_search, search_key, assumed: assumed ? 1 : -1, page, metaLoading: true }));
  };
  const handleChangePage: OutcomesProps["onChangePage"] = (page: number) => {
    condition.page = page;
    history.replace({ search: toQueryString(clearNull(condition)) });
    // const {  exect_search, search_key, assumed } = condition;
    dispatch(onLoadOutcomeList({ exect_search, search_key, assumed: assumed ? 1 : -1, page, metaLoading: true }));
  };
  const handleAddOrRemoveOutcome: ContainedOutcomeListProps["addOrRemoveOutcome"] = (outcome: GetOutcomeDetail, type: "add" | "remove") => {
    const { ancestor_id: id } = outcome;
    if (type === "add") {
      if (id && outcomes) {
        outcomes.concat([outcome]);
      }
    } else {
      if (id && outcomes) {
        let newValue = cloneDeep(outcomes);
        newValue = newValue.filter((v) => v.ancestor_id !== id);
        setValue("outcomes", newValue, { shouldDirty: true });
      }
    }
  };
  const handleClickAdd = () => {
    history.replace(`${routeBasePath}/tab/${TabValue.leaningoutcomes}${search}`);
  };

  const handleClickOutcome: ContainedOutcomeListProps["onClickOutcome"] = (id: GetOutcomeDetail["outcome_id"]) => {
    window.open(`#/assessments/outcome-edit?outcome_id=${id}&readonly=true`, "_blank");
  };

  useEffect(() => {
    dispatch(onLoadMilestoneEdit({ id, metaLoading: true }));
    id && !first_save ? setCanEdit(false) : setCanEdit(true);
  }, [dispatch, first_save, id]);
  const leftside = (
    <ContentTab tab={tab} onChangeTab={handleChangeTab} error={errors.milestone_name} showSecondTab={!isGeneralMilestone}>
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
        name="outcomes"
        defaultValue={milestoneDetail?.outcomes}
        key={initDefaultValue.outcome_ancestor_ids?.key}
        control={control}
        outcomeList={outcomeList}
        outcomeTotal={outcomeTotal}
        condition={condition}
        onSearch={handleClickSearch}
        outcomePage={page}
        onChangePage={handleChangePage}
        canEdit={canEdit}
        onClickOutcome={handleClickOutcome}
      />
    </ContentTab>
  );
  const rightside = (
    <>
      {outcomes && outcomes.length ? (
        <ContainedOutcomeList
          outcomeList={outcomes}
          value={outcomes}
          canEdit={canEdit}
          addOrRemoveOutcome={handleAddOrRemoveOutcome}
          onClickOutcome={handleClickOutcome}
          isGeneralMilestone={isGeneralMilestone}
        />
      ) : (
        <NoOutcome />
      )}
      {tab === TabValue.details && canEdit && <AddOutcomes onAddOutcome={handleClickAdd} />}
    </>
  );
  return (
    <DndProvider backend={HTML5Backend}>
      <MilestoneHeader
        milestoneDetail={milestoneDetail}
        milestone_id={id}
        onCancel={handleCancel}
        onSave={handleSave}
        onPublish={handlePublish}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onReject={handleReject}
        onApprove={handleApprove}
        canEdit={canEdit}
        formMethods={formMethods}
        isMyself={isMyself}
        is_unpub={is_unpub === UNPUB}
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
