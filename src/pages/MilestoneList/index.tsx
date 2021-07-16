import { unwrapResult } from "@reduxjs/toolkit";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { useHistory, useLocation } from "react-router-dom";
import { MilestoneOrderBy, MilestoneStatus } from "../../api/type";
import { FirstSearchHeader, FirstSearchHeaderMb } from "../../components/AssessmentFirsetHearder/FirstSearchHeader";
import { PermissionType, usePermission } from "../../components/Permission";
import { emptyTip, permissionTip } from "../../components/TipImages";
import { AppDispatch, RootState } from "../../reducers";
import { approveMilestone, bulkApprove, bulkReject, deleteMilestone, onLoadMilestoneList } from "../../reducers/milestone";
import MilestoneEdit from "../MilestoneEdit";
import { MilestoneTable, MilestoneTableProps } from "./MilestoneTable";
import SecondSearchHeader, { SecondSearchHeaderProps } from "./SecondSearchHeader";
import { ThirdSearchHeader, ThirdSearchHeaderMb, ThirdSearchHeaderProps } from "./ThirdSearchHearder";
import { BulkListForm, BulkListFormKey, MilestoneQueryCondition } from "./types";

interface RefreshWithDispatch {
  // <T>(result: Promise<PayloadAction<T>>): Promise<PayloadAction<T>>;
  <T>(result: Promise<T>): Promise<T>;
}

function useRefreshWithDispatch() {
  const [refreshKey, setRefreshKey] = useState(0);
  const validRef = useRef(false);
  const refreshWithDispatch = useMemo<RefreshWithDispatch>(
    () => (result) => {
      return result.then((res) => {
        setRefreshKey(refreshKey + 1);
        return res;
      });
    },
    [refreshKey]
  );

  useEffect(() => {
    validRef.current = true;
    return () => {
      validRef.current = false;
    };
  });
  return { refreshKey, refreshWithDispatch };
}

export const clearNull = (obj: Record<string, any>) => {
  Object.keys(obj).forEach((key) => {
    if (obj[key] == null) delete obj[key];
  });
  return obj;
};
const toQueryString = (hash: Record<string, any>): string => {
  const search = new URLSearchParams(hash);
  return `?${search.toString()}`;
};
const useQuery = (): MilestoneQueryCondition => {
  const { search } = useLocation();
  return useMemo(() => {
    const query = new URLSearchParams(search);
    const status = query.get("status") || MilestoneStatus.published;
    const search_key = query.get("search_key");
    const description = query.get("description");
    const name = query.get("name");
    const shortcode = query.get("shortcode");
    const page = Number(query.get("page")) || 1;
    const author_id = query.get("author_id") || "";
    const order_by = (query.get("order_by") as MilestoneOrderBy | null) || undefined;
    const is_unpub = query.get("is_unpub");
    return clearNull({ name, status, page, order_by, search_key, description, shortcode, author_id, is_unpub });
  }, [search]);
};

export default function MilestonesList() {
  const dispatch = useDispatch<AppDispatch>();
  const history = useHistory();
  const condition = useQuery();
  const formMethods = useForm<BulkListForm>();
  const { watch, reset } = formMethods;
  const { refreshKey, refreshWithDispatch } = useRefreshWithDispatch();
  const { milestoneList, total, user_id } = useSelector<RootState, RootState["milestone"]>((state) => state.milestone);
  const ids = watch(BulkListFormKey.CHECKED_BULK_IDS);
  const perm = usePermission([PermissionType.view_unpublished_milestone_417, PermissionType.view_published_milestone_418]);
  const hasPerm = perm.view_published_milestone_418 || perm.view_unpublished_milestone_417;
  const isPending = useMemo(() => perm.view_published_milestone_418 === undefined, [perm.view_published_milestone_418]);
  const handleChange: SecondSearchHeaderProps["onChange"] = (value) => {
    history.push({ search: toQueryString(clearNull(value)) });
  };
  const handleBulkDelete: ThirdSearchHeaderProps["onBulkDelete"] = () => {
    return refreshWithDispatch(dispatch(deleteMilestone(ids)));
  };
  const handleDelete: MilestoneTableProps["onDelete"] = (id) => {
    return refreshWithDispatch(dispatch(deleteMilestone([id])));
  };
  const handleChangePage: MilestoneTableProps["onChangePage"] = (page) => history.push({ search: toQueryString({ ...condition, page }) });
  const handleClickMilestone: MilestoneTableProps["onClickMilestone"] = (milestone_id) => {
    history.push({
      pathname: MilestoneEdit.routeRedirectDefault,
      search: toQueryString(clearNull({ id: milestone_id, is_unpub: condition.is_unpub })),
    });
    // history.push(`/milestone/milestone-edit/tab/details?id=${milestone_id}`);
  };
  const handleReject: MilestoneTableProps["onReject"] = (id) => {
    return refreshWithDispatch(dispatch(bulkReject([id])).then(unwrapResult));
  };
  const handleApprove: MilestoneTableProps["onApprove"] = (id) => {
    return refreshWithDispatch(dispatch(approveMilestone([id])).then(unwrapResult));
  };
  const handleBulkReject = () => {
    return refreshWithDispatch(dispatch(bulkReject(ids)).then(unwrapResult));
  };
  const handleBulkApprove = () => {
    return refreshWithDispatch(dispatch(bulkApprove(ids)).then(unwrapResult));
  };
  useEffect(() => {
    if (milestoneList?.length === 0 && total && total > 0) {
      const page = 1;
      history.push({ search: toQueryString({ ...condition, page }) });
    }
  }, [condition, history, milestoneList, total]);
  useEffect(() => {
    reset();
    (async () => {
      await dispatch(onLoadMilestoneList({ ...condition, metaLoading: true }));
    })();
  }, [condition, dispatch, refreshKey, reset]);
  return (
    <>
      <FirstSearchHeader />
      <FirstSearchHeaderMb />
      {hasPerm && (
        <>
          <SecondSearchHeader value={condition} onChange={handleChange} />
          <ThirdSearchHeader
            value={condition}
            onChange={handleChange}
            onBulkDelete={handleBulkDelete}
            onBulkApprove={handleBulkApprove}
            onBulkReject={handleBulkReject}
          />
          <ThirdSearchHeaderMb
            value={condition}
            onChange={handleChange}
            onBulkDelete={handleBulkDelete}
            onBulkApprove={handleBulkApprove}
            onBulkReject={handleBulkReject}
          />
        </>
      )}
      {isPending ? (
        ""
      ) : hasPerm ? (
        total === undefined ? (
          ""
        ) : milestoneList && milestoneList.length > 0 ? (
          <MilestoneTable
            queryCondition={condition}
            formMethods={formMethods}
            total={total}
            list={milestoneList}
            onChangePage={handleChangePage}
            onClickMilestone={handleClickMilestone}
            onDelete={handleDelete}
            onApprove={handleApprove}
            onReject={handleReject}
            user_id={user_id}
          />
        ) : (
          emptyTip
        )
      ) : (
        permissionTip
      )}
    </>
  );
}
MilestonesList.routeBasePath = "/milestone/milestone-list";
MilestonesList.routeRedirectDefault = `/milestone/milestone-list?status=${MilestoneStatus.published}&page=1&order_by=${MilestoneOrderBy._created_at}`;
