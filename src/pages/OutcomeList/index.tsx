import { Typography } from "@material-ui/core";
import { PayloadAction } from "@reduxjs/toolkit";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { useHistory, useLocation } from "react-router-dom";
import { OrderBy, OutcomeOrderBy, OutcomePublishStatus } from "../../api/type";
import emptyIconUrl from "../../assets/icons/empty.svg";
import { TipImages, TipImagesType } from "../../components/TipImages";
import { AppDispatch, RootState } from "../../reducers";
import {
  actOutcomeList,
  actPendingOutcomeList,
  actPrivateOutcomeList,
  bulkDeleteOutcome,
  bulkPublishOutcome,
  deleteOutcome,
  publishOutcome,
} from "../../reducers/outcome";
import { AssessmentList } from "../AssesmentList";
import CreateOutcomings from "../OutcomeEdit";
import { FirstSearchHeader, FirstSearchHeaderMb, FirstSearchHeaderProps, isUnpublish } from "./FirstSearchHeader";
import { OutcomeTable, OutcomeTableProps } from "./OutcomeTable";
import { SecondSearchHeader, SecondSearchHeaderMb } from "./SecondSearchHeader";
import { ThirdSearchHeader, ThirdSearchHeaderMb, ThirdSearchHeaderProps } from "./ThirdSearchHeader";
import { BulkListForm, BulkListFormKey, OutcomeQueryCondition } from "./types";

const PAGE_SIZE = 20;

const clearNull = (obj: Record<string, any>) => {
  Object.keys(obj).forEach((key) => {
    if (obj[key] == null) delete obj[key];
  });
  return obj;
};

const useQuery = (): OutcomeQueryCondition => {
  const { search } = useLocation();
  return useMemo(() => {
    const query = new URLSearchParams(search);
    const search_key = query.get("search_key");
    const publish_status = query.get("publish_status");
    const author_name = query.get("author_name");
    const page = Number(query.get("page")) || 1;
    const order_by = (query.get("order_by") as OrderBy | null) || undefined;
    const is_unpub = query.get("is_unpub");
    return clearNull({ search_key, publish_status, author_name, page, order_by, is_unpub });
  }, [search]);
};

const toQueryString = (hash: Record<string, any>): string => {
  const search = new URLSearchParams(hash);
  return `?${search.toString()}`;
};

interface RefreshWithDispatch {
  <T>(result: Promise<PayloadAction<T>>): Promise<PayloadAction<T>>;
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

export function OutcomeList() {
  const condition = useQuery();
  const history = useHistory();
  const { refreshKey, refreshWithDispatch } = useRefreshWithDispatch();
  const formMethods = useForm<BulkListForm>();
  const { watch, reset } = formMethods;
  const unpublish = isUnpublish(condition);
  const ids = watch(BulkListFormKey.CHECKED_BULK_IDS);
  const {
    outcomeList,
    total,
    user_id,
    permission: { assess_msg_no_permission },
  } = useSelector<RootState, RootState["outcome"]>((state) => state.outcome);
  const dispatch = useDispatch<AppDispatch>();
  const handlePublish: OutcomeTableProps["onPublish"] = (id) => {
    return refreshWithDispatch(dispatch(publishOutcome(id)));
  };
  const handleBulkPublish: ThirdSearchHeaderProps["onBulkPublish"] = () => {
    // const ids = getValues()[BulkListFormKey.CHECKED_BULK_IDS];
    return refreshWithDispatch(dispatch(bulkPublishOutcome(ids)));
  };
  const handleDelete: OutcomeTableProps["onDelete"] = (id) => {
    return refreshWithDispatch(dispatch(deleteOutcome(id)));
  };
  const handleBulkDelete: ThirdSearchHeaderProps["onBulkDelete"] = () => {
    // const ids = getValues()[BulkListFormKey.CHECKED_BULK_IDS];
    return refreshWithDispatch(dispatch(bulkDeleteOutcome(ids)));
  };
  const handleChangePage: OutcomeTableProps["onChangePage"] = (page) => history.push({ search: toQueryString({ ...condition, page }) });
  const handleClickOutcome: OutcomeTableProps["onClickOutcome"] = (outcome_id) =>
    history.push({
      pathname: CreateOutcomings.routeBasePath,
      search: toQueryString(clearNull({ outcome_id, is_unpub: condition.is_unpub })),
    });
  const handleChange: FirstSearchHeaderProps["onChange"] = (value) => history.push({ search: toQueryString(clearNull(value)) });
  const handleChangeCategory: FirstSearchHeaderProps["onChangeCategory"] = (value) => history.push(AssessmentList.routeRedirectDefault);

  useEffect(() => {
    let page = condition.page;
    if (outcomeList.length === 0 && total > 1) {
      page = 1;
      history.push({ search: toQueryString({ ...condition, page }) });
    }
  }, [condition, condition.page, history, outcomeList.length, total]);

  useEffect(() => {
    (async () => {
      if (condition.publish_status === OutcomePublishStatus.pending && !condition.is_unpub) {
        await dispatch(actPendingOutcomeList({ ...condition, page_size: PAGE_SIZE, assumed: -1, metaLoading: true }));
      } else if (
        condition.publish_status === OutcomePublishStatus.draft ||
        condition.publish_status === OutcomePublishStatus.rejected ||
        (condition.publish_status === OutcomePublishStatus.pending && condition.is_unpub)
      ) {
        let newCondition: OutcomeQueryCondition = JSON.parse(JSON.stringify(condition));
        if (newCondition.is_unpub) delete newCondition.is_unpub;
        await dispatch(actPrivateOutcomeList({ ...newCondition, page_size: PAGE_SIZE, assumed: -1, metaLoading: true }));
      } else {
        await dispatch(actOutcomeList({ ...condition, page_size: PAGE_SIZE, assumed: -1, metaLoading: true }));
      }
      setTimeout(reset, 500);
    })();
  }, [condition, reset, dispatch, refreshKey, unpublish]);

  return (
    <div>
      <FirstSearchHeader value={condition} onChange={handleChange} onChangeCategory={handleChangeCategory} />
      <FirstSearchHeaderMb value={condition} onChange={handleChange} onChangeCategory={handleChangeCategory} />
      <SecondSearchHeader value={condition} onChange={handleChange} />
      <SecondSearchHeaderMb value={condition} onChange={handleChange} />
      <ThirdSearchHeader value={condition} onChange={handleChange} onBulkPublish={handleBulkPublish} onBulkDelete={handleBulkDelete} />
      <ThirdSearchHeaderMb value={condition} onChange={handleChange} onBulkPublish={handleBulkPublish} onBulkDelete={handleBulkDelete} />
      {assess_msg_no_permission === false ? (
        <TipImages type={TipImagesType.noPermission} text="library_error_no_permissions" />
      ) : outcomeList && outcomeList.length > 0 ? (
        <OutcomeTable
          formMethods={formMethods}
          list={outcomeList}
          total={total}
          userId={user_id}
          queryCondition={condition}
          onChangePage={handleChangePage}
          onClickOutcome={handleClickOutcome}
          onPublish={handlePublish}
          onDelete={handleDelete}
        />
      ) : (
        <div style={{ margin: "0 auto", textAlign: "center" }}>
          <img src={emptyIconUrl} alt="" />
          <Typography variant="body1" color="textSecondary">
            Empty...
          </Typography>
        </div>
      )}
    </div>
  );
}

OutcomeList.routeBasePath = "/assessments/outcome-list";
OutcomeList.routeRedirectDefault = `/assessments/outcome-list?publish_status=published&page=1&order_by=${OutcomeOrderBy._updated_at}`;
