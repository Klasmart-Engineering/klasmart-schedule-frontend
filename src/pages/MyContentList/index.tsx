import { PayloadAction } from "@reduxjs/toolkit";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { RouteProps, useHistory, useLocation } from "react-router-dom";
import { ContentType, OrderBy, SearchContentsRequestContentType } from "../../api/type";
import { PermissionOr, PermissionType } from "../../components/Permission/Permission";
import { TipImages, TipImagesType } from "../../components/TipImages";
import { AppDispatch, RootState } from "../../reducers";
import { bulkDeleteContent, bulkPublishContent, contentLists, deleteContent, publishContent } from "../../reducers/content";
import ContentEdit from "../ContentEdit";
import ContentPreview from "../ContentPreview";
import { ContentCardList, ContentCardListProps } from "./ContentCardList";
import FirstSearchHeader, { FirstSearchHeaderMb, FirstSearchHeaderProps } from "./FirstSearchHeader";
import ProgramSearchHeader, { ProgramSearchHeaderMb } from "./ProgramSearchHeader";
import { SecondSearchHeader, SecondSearchHeaderMb } from "./SecondSearchHeader";
import { ThirdSearchHeader, ThirdSearchHeaderMb, ThirdSearchHeaderProps } from "./ThirdSearchHeader";
import { ContentListForm, ContentListFormKey, PublishScope, QueryCondition } from "./types";

const PAGE_SIZE = 20;

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
    const program = query.get("program");
    const scope = query.get("scope") || PublishScope.organization;
    return clearNull({ name, publish_status, author, page, order_by, content_type, program, scope });
  }, [search]);
};

const toQueryString = (hash: Record<string, any>): string => {
  const search = new URLSearchParams(hash);
  return `?${search.toString()}`;
};

const toFullUrl = (location: RouteProps["location"]) => {
  return `${location?.pathname}${location?.search}${location?.hash}`;
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
  const handleDelete: ContentCardListProps["onDelete"] = (id, type) => {
    return refreshWithDispatch(dispatch(deleteContent({ id, type })));
  };
  const handleBulkDelete: ThirdSearchHeaderProps["onBulkDelete"] = (type) => {
    const ids = getValues()[ContentListFormKey.CHECKED_CONTENT_IDS];
    return refreshWithDispatch(dispatch(bulkDeleteContent({ ids, type })));
  };
  const handleChangePage: ContentCardListProps["onChangePage"] = (page) => history.push({ search: toQueryString({ ...condition, page }) });
  const handleClickConent: ContentCardListProps["onClickContent"] = (id, content_type) => {
    if (content_type !== ContentType.material && content_type !== ContentType.plan) {
      history.push(`/library/content-edit/lesson/assets/tab/assetDetails/rightside/assetsEdit?id=${id}`);
    } else {
      history.push({
        pathname: ContentPreview.routeRedirectDefault,
        search: toQueryString({ id: id, content_type: content_type, scope: condition.scope }),
      });
    }
  };
  const handleChange: FirstSearchHeaderProps["onChange"] = (value) => history.push({ search: toQueryString(value) });
  const handleChangeAssets: FirstSearchHeaderProps["onChangeAssets"] = (content_type, scope) =>
    history.push({ search: toQueryString({ content_type, page: 1, order_by: OrderBy._updated_at, scope }) });
  const handleCreateContent = () => {
    if (condition.content_type === SearchContentsRequestContentType.assets) {
      history.push(`/library/content-edit/lesson/assets/tab/assetDetails/rightside/assetsEdit`);
    } else {
      history.push({ pathname: ContentEdit.routeRedirectDefault, search: toQueryString({ back: toFullUrl(history.location) }) });
    }
  };

  useEffect(() => {
    if (contentsList?.length === 0 && total > 0) {
      const page = 1;
      history.push({ search: toQueryString({ ...condition, page }) });
    }
  }, [condition, contentsList, history, total]);

  useEffect(() => {
    reset();
    dispatch(contentLists({ ...condition, page_size: PAGE_SIZE, metaLoading: true }));
  }, [condition, reset, dispatch, refreshKey]);

  return (
    <div>
      {condition.program && <ProgramSearchHeader value={condition} onChange={handleChange} />}
      {condition.program && <ProgramSearchHeaderMb value={condition} onChange={handleChange} />}
      {!condition.program && (
        <FirstSearchHeader
          value={condition}
          onChange={handleChange}
          onChangeAssets={handleChangeAssets}
          onCreateContent={handleCreateContent}
        />
      )}
      {!condition.program && (
        <FirstSearchHeaderMb
          value={condition}
          onChange={handleChange}
          onChangeAssets={handleChangeAssets}
          onCreateContent={handleCreateContent}
        />
      )}
      <SecondSearchHeader value={condition} onChange={handleChange} onCreateContent={handleCreateContent} />
      <SecondSearchHeaderMb value={condition} onChange={handleChange} onCreateContent={handleCreateContent} />
      <ThirdSearchHeader value={condition} onChange={handleChange} onBulkPublish={handleBulkPublish} onBulkDelete={handleBulkDelete} />
      <ThirdSearchHeaderMb value={condition} onChange={handleChange} onBulkPublish={handleBulkPublish} onBulkDelete={handleBulkDelete} />
      <PermissionOr
        value={[
          PermissionType.published_content_page_204,
          PermissionType.pending_content_page_203,
          PermissionType.unpublished_content_page_202,
          PermissionType.archived_content_page_205,
          PermissionType.create_asset_page_301,
        ]}
        render={(value) =>
          value ? (
            contentsList && contentsList.length > 0 ? (
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
              <TipImages type={TipImagesType.empty} text="library_label_empty" />
            )
          ) : (
            <TipImages type={TipImagesType.noPermission} text="library_error_no_permissions" />
          )
        }
      />
    </div>
  );
}

MyContentList.routeBasePath = "/library/my-content-list";
MyContentList.routeRedirectDefault = `/library/my-content-list?publish_status=published&page=1&order_by=${OrderBy._updated_at}&content_type=${SearchContentsRequestContentType.materialandplan}&scope=${PublishScope.tempArgument}`;
