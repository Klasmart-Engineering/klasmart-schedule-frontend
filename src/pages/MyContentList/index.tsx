import { PayloadAction, unwrapResult } from "@reduxjs/toolkit";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { RouteProps, useHistory, useLocation } from "react-router-dom";
import { Author, ContentType, FolderName, OrderBy, PublishStatus, SearchContentsRequestContentType } from "../../api/type";
import { PermissionOr, PermissionType } from "../../components/Permission/Permission";
import { TipImages, TipImagesType } from "../../components/TipImages";
import { AppDispatch, RootState } from "../../reducers";
import { actAsyncConfirm, ConfirmDialogType } from "../../reducers/confirm";
import {
  addFolder,
  bulkDeleteContent,
  bulkPublishContent,
  contentLists,
  deleteContent,
  deleteFolder,
  folderContentLists,
  moveFolderBulk,
  pendingContentLists,
  privateContentLists,
  publishContent,
} from "../../reducers/content";
import ContentEdit from "../ContentEdit";
import ContentPreview from "../ContentPreview";
import { ContentCardList, ContentCardListProps } from "./ContentCardList";
import FirstSearchHeader, { FirstSearchHeaderMb, FirstSearchHeaderProps } from "./FirstSearchHeader";
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
  const { watch, reset } = formMethods;
  const ids = watch(ContentListFormKey.CHECKED_CONTENT_IDS);
  const { contentsList, total } = useSelector<RootState, RootState["content"]>((state) => state.content);
  const [pageSize, setPageSize] = useState(20);
  const [, setRemoveId] = useState("");
  const dispatch = useDispatch<AppDispatch>();
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
    setPageSize(page_size);
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
  const handleRememberMoveFolder: ContentCardListProps["onRemeberMoveFolder"] = (id) => {
    setRemoveId(id);
    // dispatch(moveFolder({item_id: id, dist:{dist: "5fbf4cf9b9678f45f4e7954b"}}))
  };
  // const handleRemoveFolder = (id: string) => {
  //   dispatch(moveFolder(removeId, id))
  // }
  const handleRenameFolder: ContentCardListProps["onRenameFolder"] = (id) => {
    // refreshWithDispatch(dispatch(renameFolder({item_id: id, name: {name: "folder2"}})))
  };
  let parent_id: string;
  parent_id = (condition?.path || "").split("/").pop() || "";
  const handleAddFolder = async () => {
    let partition: string = FolderName.pandm;
    if (condition.publish_status === PublishStatus.published) {
      partition = FolderName.pandm;
    }
    if (condition.content_type === String(ContentType.assets)) {
      partition = FolderName.assets;
    }
    const title = "Add a Folder";
    const content = "Folder Name";
    const placeholder = "name";
    const type = ConfirmDialogType.onlyInput;
    const { isConfirmed, text } = unwrapResult(await dispatch(actAsyncConfirm({ title, content, placeholder, type })));
    if (isConfirmed) {
      console.log(text, isConfirmed);
    }
    console.log(condition.path);
    if (isConfirmed) refreshWithDispatch(dispatch(addFolder({ name: text, partition: partition, owner_type: 1, parent_id: parent_id })));
    // refreshWithDispatch(addFolder({name: "folder1", partition: partition, owner_type: 1}))
  };
  const handleDeleteFolder: ContentCardListProps["onDeleteFolder"] = (id) => {
    refreshWithDispatch(dispatch(deleteFolder({ item_id: id, params: {} })));
  };
  const handleBulkMove: ThirdSearchHeaderProps["onBulkMove"] = () => {
    refreshWithDispatch(dispatch(moveFolderBulk({ dist: parent_id, ids })));
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
    (async () => {
      if (condition.publish_status === PublishStatus.pending && condition.author !== Author.self) {
        await dispatch(pendingContentLists({ ...condition, page_size: pageSize, metaLoading: true }));
      } else if (
        condition.publish_status === PublishStatus.draft ||
        condition.publish_status === PublishStatus.rejected ||
        (condition.publish_status === PublishStatus.pending && condition.author === Author.self)
      ) {
        await dispatch(privateContentLists({ ...condition, page_size: pageSize, metaLoading: true }));
      } else if (condition.publish_status === PublishStatus.published) {
        await dispatch(folderContentLists({ ...condition, page_size: pageSize, metaLoading: true }));
      } else {
        await dispatch(contentLists({ ...condition, page_size: pageSize, metaLoading: true }));
      }
      setTimeout(reset, 500);
    })();
  }, [condition, reset, dispatch, refreshKey, pageSize]);

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
        onAddFolder={handleAddFolder}
        onBulkMove={handleBulkMove}
      />
      <ThirdSearchHeaderMb
        value={condition}
        onChange={handleChange}
        onBulkPublish={handleBulkPublish}
        onBulkDelete={handleBulkDelete}
        onAddFolder={handleAddFolder}
        onBulkMove={handleBulkMove}
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
                amountPerPage={pageSize}
                queryCondition={condition}
                onChangePage={handleChangePage}
                onChangePageSize={handleChangePageSize}
                onClickContent={handleClickConent}
                onPublish={handlePublish}
                onDelete={handleDelete}
                onRemeberMoveFolder={handleRememberMoveFolder}
                onRenameFolder={handleRenameFolder}
                onDeleteFolder={handleDeleteFolder}
                onGoBack={handleGoback}
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
MyContentList.routeRedirectDefault = `/library/my-content-list?publish_status=published&page=1&order_by=${OrderBy._updated_at}&content_type=${SearchContentsRequestContentType.materialandplan}`;
