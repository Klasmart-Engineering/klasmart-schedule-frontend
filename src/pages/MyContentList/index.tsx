import { unwrapResult } from "@reduxjs/toolkit";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { RouteProps, useHistory, useLocation } from "react-router-dom";
import { EntityFolderContent } from "../../api/api.auto";
import { Author, ContentType, OrderBy, PublishStatus, SearchContentsRequestContentType } from "../../api/type";
import LayoutBox from "../../components/LayoutBox";
import { PermissionOr, PermissionType } from "../../components/Permission/Permission";
import { TipImages, TipImagesType } from "../../components/TipImages";
import { d } from "../../locale/LocaleManager";
import { ids2Content, ids2removeOrDelete } from "../../models/ModelEntityFolderContent";
import { AppDispatch, RootState } from "../../reducers";
import {
  addFolder,
  bulkDeleteContent,
  bulkDeleteFolder,
  bulkMoveFolder,
  bulkPublishContent,
  contentLists,
  deleteContent,
  deleteFolder,
  folderContentLists,
  getFolderItemById,
  getUserSetting,
  pendingContentLists,
  privateContentLists,
  publishContent,
  renameFolder,
  searchOrgFolderItems,
  setUserSetting,
} from "../../reducers/content";
import { actWarning } from "../../reducers/notify";
import ContentEdit from "../ContentEdit";
import ContentPreview from "../ContentPreview";
import { BackToPrevPage, ContentCardList, ContentCardListProps } from "./ContentCardList";
import FirstSearchHeader, { FirstSearchHeaderMb, FirstSearchHeaderProps } from "./FirstSearchHeader";
import { FolderTree, FolderTreeProps, useFolderTree } from "./FolderTree";
import ProgramSearchHeader, { ProgramSearchHeaderMb } from "./ProgramSearchHeader";
import { SecondSearchHeader, SecondSearchHeaderMb } from "./SecondSearchHeader";
import { ThirdSearchHeader, ThirdSearchHeaderMb, ThirdSearchHeaderProps } from "./ThirdSearchHeader";
import { ContentListForm, ContentListFormKey, QueryCondition } from "./types";

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
    const path = query.get("path") || "";
    // const parent_id = (path || "").split("/").pop() || "";
    return clearNull({ name, publish_status, author, page, order_by, content_type, program, path });
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

export default function MyContentList() {
  const condition = useQuery();
  const history = useHistory();
  const { refreshKey, refreshWithDispatch } = useRefreshWithDispatch();
  const formMethods = useForm<ContentListForm>();
  const { watch, reset } = formMethods;
  const ids = watch(ContentListFormKey.CHECKED_CONTENT_IDS);
  const { contentsList, total, page_size, folderTree, parentFolderInfo } = useSelector<RootState, RootState["content"]>(
    (state) => state.content
  );
  const [actionObj, setActionObj] = useState<ThirdSearchHeaderProps["actionObj"]>();
  const dispatch = useDispatch<AppDispatch>();
  const { folderTreeActive, closeFolderTree, openFolderTree, referContent, setReferContent } = useFolderTree<EntityFolderContent[]>();
  const handlePublish: ContentCardListProps["onPublish"] = (id) => {
    return refreshWithDispatch(dispatch(publishContent(id)));
  };
  const handleBulkPublish: ThirdSearchHeaderProps["onBulkPublish"] = () => {
    return refreshWithDispatch(dispatch(bulkPublishContent(ids)));
  };
  const handleDelete: ContentCardListProps["onDelete"] = (id, type) => {
    return refreshWithDispatch(dispatch(deleteContent({ id, type })));
  };
  const handleBulkDelete: ThirdSearchHeaderProps["onBulkDelete"] = (type) => {
    return refreshWithDispatch(dispatch(bulkDeleteContent({ ids, type })));
  };
  const handleChangePage: ContentCardListProps["onChangePage"] = (page) => history.push({ search: toQueryString({ ...condition, page }) });
  const handleChangePageSize: ContentCardListProps["onChangePageSize"] = (page_size) => {
    refreshWithDispatch(dispatch(setUserSetting({ cms_page_size: page_size })));
  };
  const handleClickConent: ContentCardListProps["onClickContent"] = (id, content_type, dir_path) => {
    if (content_type === ContentType.material || content_type === ContentType.plan) {
      history.push({
        pathname: ContentPreview.routeRedirectDefault,
        search: toQueryString(clearNull({ id: id, content_type: content_type, author: condition.author })),
      });
    } else if (content_type === ContentType.folder) {
      if (dir_path === "/") {
        history.push({ search: toQueryString({ ...condition, path: `${dir_path}${id}` }) });
      } else {
        history.push({ search: toQueryString({ ...condition, path: `${dir_path}/${id}` }) });
      }
    } else {
      history.push(`/library/content-edit/lesson/assets/tab/assetDetails/rightside/assetsEdit?id=${id}`);
    }
  };
  const handleChange: FirstSearchHeaderProps["onChange"] = (value) => history.push({ search: toQueryString(clearNull(value)) });
  const handleChangeAssets: FirstSearchHeaderProps["onChangeAssets"] = (content_type, scope) =>
    history.push({ search: toQueryString({ content_type, page: 1, order_by: OrderBy._updated_at, scope }) });
  const handleCreateContent = () => {
    if (condition.content_type === SearchContentsRequestContentType.assets) {
      history.push(`/library/content-edit/lesson/assets/tab/assetDetails/rightside/assetsEdit`);
    } else {
      history.push({ pathname: ContentEdit.routeRedirectDefault, search: toQueryString({ back: toFullUrl(history.location) }) });
    }
  };

  const handleRenameFolder: ContentCardListProps["onRenameFolder"] = (content) => {
    return refreshWithDispatch(
      dispatch(renameFolder({ item_id: content?.id as string, defaultName: content?.name as string })).then(unwrapResult)
    );
  };
  const handleAddFolder: FolderTreeProps["onAddFolder"] = async (parent_id) => {
    await refreshWithDispatch(dispatch(addFolder({ content_type: condition.content_type, parent_id: parent_id })).then(unwrapResult));
    await dispatch(searchOrgFolderItems({ content_type: condition.content_type as string, metaLoading: true }));
  };
  const handlePageAddFolder = async () => {
    const parent_id = (condition.path || "").split("/").pop() || "";
    await refreshWithDispatch(dispatch(addFolder({ content_type: condition.content_type, parent_id: parent_id })).then(unwrapResult));
  };
  const handleDeleteFolder: ContentCardListProps["onDeleteFolder"] = (id) => {
    return refreshWithDispatch(dispatch(deleteFolder({ item_id: id, params: {} })).then(unwrapResult));
  };
  const handleBulkDeleteFolder: ThirdSearchHeaderProps["onBulkDeleteFolder"] = () => {
    return refreshWithDispatch(dispatch(bulkDeleteFolder({ folder_ids: ids })));
  };
  const handleClickMoveBtn: ContentCardListProps["onClickMoveBtn"] = async (content) => {
    setReferContent([content]);
    await dispatch(searchOrgFolderItems({ content_type: condition.content_type as string, metaLoading: true }));
    openFolderTree();
  };
  const handleMove: FolderTreeProps["onMove"] = async (parent_id) => {
    await refreshWithDispatch(
      dispatch(bulkMoveFolder({ dist: parent_id, contents: referContent, content_type: condition.content_type })).then(unwrapResult)
    );
    closeFolderTree();
  };
  const handleClickBulkMove: ThirdSearchHeaderProps["onBulkMove"] = async () => {
    if (!ids || !ids.length) {
      return Promise.reject(dispatch(actWarning(d("At least one content should be selected.").t("library_msg_remove_select_one"))));
    }
    setReferContent(ids2Content(contentsList, ids));
    await dispatch(searchOrgFolderItems({ content_type: condition.content_type as string, metaLoading: true }));
    openFolderTree();
  };
  const handleGoback: ContentCardListProps["onGoBack"] = () => {
    history.go(-1);
  };

  useEffect(() => {
    if (contentsList?.length === 0 && total > 0) {
      const page = 1;
      history.push({ search: toQueryString({ ...condition, page }) });
    }
  }, [condition, contentsList, history, total]);

  useEffect(() => {
    if (ids && ids.length > 0) {
      setActionObj(ids2removeOrDelete(contentsList, ids));
    }
  }, [contentsList, ids]);

  useEffect(() => {
    (async () => {
      await dispatch(getUserSetting());
      if (condition.publish_status === PublishStatus.pending && condition.author !== Author.self) {
        await dispatch(pendingContentLists({ ...condition, page_size: page_size, metaLoading: true }));
      } else if (
        condition.publish_status === PublishStatus.draft ||
        condition.publish_status === PublishStatus.rejected ||
        (condition.publish_status === PublishStatus.pending && condition.author === Author.self)
      ) {
        await dispatch(privateContentLists({ ...condition, page_size: page_size, metaLoading: true }));
      } else if (condition.publish_status === PublishStatus.published) {
        await dispatch(folderContentLists({ ...condition, page_size: page_size, metaLoading: true }));
      } else if (condition.content_type && condition.content_type === String(ContentType.assets)) {
        await dispatch(folderContentLists({ ...condition, page_size: page_size, metaLoading: true }));
      } else {
        await dispatch(contentLists({ ...condition, page_size: page_size, metaLoading: true }));
      }
      setTimeout(reset, 500);
      const parent_id = (condition.path || "").split("/").pop() || "";
      if (parent_id) await dispatch(getFolderItemById(parent_id));
    })();
  }, [condition, reset, dispatch, refreshKey, page_size]);

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
      <ThirdSearchHeader
        value={condition}
        onChange={handleChange}
        onBulkPublish={handleBulkPublish}
        onBulkDelete={handleBulkDelete}
        onAddFolder={() => handlePageAddFolder()}
        onBulkMove={handleClickBulkMove}
        actionObj={actionObj}
        onBulkDeleteFolder={handleBulkDeleteFolder}
      />
      <ThirdSearchHeaderMb
        value={condition}
        onChange={handleChange}
        onBulkPublish={handleBulkPublish}
        onBulkDelete={handleBulkDelete}
        onAddFolder={() => handlePageAddFolder()}
        onBulkMove={handleClickBulkMove}
        actionObj={actionObj}
        onBulkDeleteFolder={handleBulkDeleteFolder}
      />
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
                amountPerPage={page_size}
                queryCondition={condition}
                onChangePage={handleChangePage}
                onChangePageSize={handleChangePageSize}
                onClickContent={handleClickConent}
                onPublish={handlePublish}
                onDelete={handleDelete}
                onClickMoveBtn={handleClickMoveBtn}
                onRenameFolder={handleRenameFolder}
                onDeleteFolder={handleDeleteFolder}
                onGoBack={handleGoback}
                parentFolderInfo={parentFolderInfo}
              />
            ) : JSON.stringify(parentFolderInfo) === "{}" ? (
              <TipImages type={TipImagesType.empty} text="library_label_empty" />
            ) : (
              <LayoutBox holderMin={40} holderBase={202} mainBase={1517}>
                <BackToPrevPage onGoBack={handleGoback} parentFolderInfo={parentFolderInfo} total={total} />
              </LayoutBox>
            )
          ) : (
            <TipImages type={TipImagesType.noPermission} text="library_error_no_permissions" />
          )
        }
      />
      <FolderTree
        folders={folderTree}
        rootFolderName={condition.content_type === SearchContentsRequestContentType.assets ? "Assets" : "Organization Content"}
        onClose={closeFolderTree}
        open={folderTreeActive}
        onMove={handleMove}
        onAddFolder={handleAddFolder}
      />
    </div>
  );
}

MyContentList.routeBasePath = "/library/my-content-list";
MyContentList.routeRedirectDefault = `/library/my-content-list?publish_status=published&page=1&order_by=${OrderBy._updated_at}&content_type=${SearchContentsRequestContentType.materialandplan}`;
