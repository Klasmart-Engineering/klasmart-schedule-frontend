import { Typography } from "@material-ui/core";
import { PayloadAction } from "@reduxjs/toolkit";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { useHistory, useLocation } from "react-router-dom";
import { ContentType, OrderBy, SearchContentsRequestContentType } from "../../api/type";
import emptyIconUrl from "../../assets/icons/empty.svg";
import { AppDispatch, RootState } from "../../reducers";
import { bulkDeleteContent, bulkPublishContent, contentLists, deleteContent, publishContent } from "../../reducers/content";
import ContentEdit from "../ContentEdit";
import ContentPreview from "../ContentPreview";
import { ContentCardList, ContentCardListProps } from "./ContentCardList";
import FirstSearchHeader, { FirstSearchHeaderMb, FirstSearchHeaderProps } from "./FirstSearchHeader";
import { SecondSearchHeader, SecondSearchHeaderMb } from "./SecondSearchHeader";
import { ThirdSearchHeader, ThirdSearchHeaderMb, ThirdSearchHeaderProps } from "./ThirdSearchHeader";
import { ContentListForm, ContentListFormKey, QueryCondition } from "./types";

const PAGE_SIZE = 16;

const clearNull = (obj: Record<string, any>) => {
  Object.keys(obj).forEach((key) => {
    if (obj[key] == null) delete obj[key];
  });
  return obj;
};

const useQuery = (): QueryCondition => {
  const { search } = useLocation();
  return useMemo(() => {
    const query = new URLSearchParams(search);
    const name = query.get("name");
    const publish_status = query.get("publish_status");
    const author = query.get("author");
    const page = Number(query.get("page")) || 1;
    const order_by = (query.get("order_by") as OrderBy | null) || undefined;
    const content_type = query.get("content_type");

    return clearNull({ name, publish_status, author, page, order_by, content_type });
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

export default function MyContentList() {
  const condition = useQuery();
  const history = useHistory();
  const { refreshKey, refreshWithDispatch } = useRefreshWithDispatch();
  const formMethods = useForm<ContentListForm>();
  const { getValues, reset } = formMethods;
  const { contentsList, total } = useSelector<RootState, RootState["content"]>((state) => state.content);
  const dispatch = useDispatch<AppDispatch>();
  const handlePublish: ContentCardListProps["onPublish"] = (id) => {
    return refreshWithDispatch(dispatch(publishContent(id)));
  };
  const handleBulkPublish: ThirdSearchHeaderProps["onBulkPublish"] = () => {
    const ids = getValues()[ContentListFormKey.CHECKED_CONTENT_IDS];
    return refreshWithDispatch(dispatch(bulkPublishContent(ids)));
  };
  const handleDelete: ContentCardListProps["onDelete"] = (id) => {
    return refreshWithDispatch(dispatch(deleteContent(id)));
  };
  const handleBulkDelete: ThirdSearchHeaderProps["onBulkDelete"] = () => {
    const ids = getValues()[ContentListFormKey.CHECKED_CONTENT_IDS];
    return refreshWithDispatch(dispatch(bulkDeleteContent(ids)));
  };
  const handleChangePage: ContentCardListProps["onChangePage"] = (page) => history.push({ search: toQueryString({ ...condition, page }) });
  const handleClickConent: ContentCardListProps["onClickContent"] = (id, content_type) => {
    if (content_type !== ContentType.material && content_type !== ContentType.plan) {
      history.push(`/library/content-edit/lesson/assets/tab/details/rightside/assetsEdit?id=${id}`);
    } else {
      history.push({ pathname: ContentPreview.routeBasePath, search: toQueryString({ id: id, content_type: content_type }) });
    }
  };
  const handleChange: FirstSearchHeaderProps["onChange"] = (value) => history.push({ search: toQueryString(value) });
  const handleChangeAssets: FirstSearchHeaderProps["onChangeAssets"] = (content_type) =>
    history.push({ search: toQueryString({ content_type, page: 1, order_by: OrderBy._created_at }) });
  const handleCreateContent = () => {
    if (condition.content_type === SearchContentsRequestContentType.assets) {
      history.push(`/library/content-edit/lesson/assets/tab/details/rightside/assetsEdit`);
    } else {
      history.push({ pathname: ContentEdit.routeRedirectDefault });
    }
  };
  useEffect(() => {
    reset();
    dispatch(contentLists({ ...condition, page_size: PAGE_SIZE, metaLoading: true }));
  }, [condition, reset, dispatch, refreshKey]);

  return (
    <div>
      <FirstSearchHeader
        value={condition}
        onChange={handleChange}
        onChangeAssets={handleChangeAssets}
        onCreateContent={handleCreateContent}
      />
      <FirstSearchHeaderMb
        value={condition}
        onChange={handleChange}
        onChangeAssets={handleChangeAssets}
        onCreateContent={handleCreateContent}
      />
      <SecondSearchHeader value={condition} onChange={handleChange} />
      <SecondSearchHeaderMb value={condition} onChange={handleChange} />
      <ThirdSearchHeader value={condition} onChange={handleChange} onBulkPublish={handleBulkPublish} onBulkDelete={handleBulkDelete} />
      <ThirdSearchHeaderMb value={condition} onChange={handleChange} onBulkPublish={handleBulkPublish} onBulkDelete={handleBulkDelete} />
      {contentsList && contentsList.length > 0 ? (
        <ContentCardList
          formMethods={formMethods}
          list={contentsList}
          total={total}
          queryCondition={condition}
          onChangePage={handleChangePage}
          onClickContent={handleClickConent}
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

MyContentList.routeBasePath = "/library/my-content-list";
MyContentList.routeRedirectDefault = `/library/my-content-list?publish_status=published&page=1&order_by=${OrderBy._created_at}&content_type=${SearchContentsRequestContentType.materialandplan}`;
