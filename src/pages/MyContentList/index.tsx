import { unwrapResult } from "@reduxjs/toolkit";
import produce from "immer";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { RouteProps, useHistory, useLocation } from "react-router-dom";
import { EntityFolderContent } from "../../api/api.auto";
import { ContentType, OrderBy, PublishStatus, SearchContentsRequestContentType } from "../../api/type";
import LayoutBox from "../../components/LayoutBox";
import { PermissionOr, PermissionType } from "../../components/Permission/Permission";
import { emptyTip, permissionTip } from "../../components/TipImages";
import { d } from "../../locale/LocaleManager";
import { ids2Content, ids2removeOrDelete } from "../../models/ModelEntityFolderContent";
import { excludeFolderOfTree } from "../../models/ModelFolderTree";
import { excludeMyOrg, orgs2id } from "../../models/ModelOrgProperty";
import { AppDispatch, RootState } from "../../reducers";
import {
  addFolder,
  approveContent,
  bulkApprove,
  bulkDeleteContent,
  bulkDeleteFolder,
  bulkMoveFolder,
  bulkPublishContent,
  bulkReject,
  deleteContent,
  deleteFolder,
  getOrgList,
  onLoadContentList,
  publishContent,
  rejectContent,
  renameFolder,
  searchOrgFolderItems,
  setUserSetting,
  shareFolders,
} from "../../reducers/content";
import { actWarning } from "../../reducers/notify";
import ContentEdit from "../ContentEdit";
import ContentPreview from "../ContentPreview";
import { BackToPrevPage, ContentCardList, ContentCardListProps } from "./ContentCardList";
import FirstSearchHeader, { FirstSearchHeaderMb, FirstSearchHeaderProps } from "./FirstSearchHeader";
import { FolderTree, FolderTreeProps, useFolderTree } from "./FolderTree";
import { OrganizationList, OrganizationListProps, OrgInfoProps, useOrganizationList } from "./OrganizationList";
import ProgramSearchHeader, { ProgramSearchHeaderMb } from "./ProgramSearchHeader";
import { ExectSearch, EXECT_SEARCH, SEARCH_TEXT_KEY, SecondSearchHeader, SecondSearchHeaderMb } from "./SecondSearchHeader";
import { ThirdSearchHeader, ThirdSearchHeaderMb, ThirdSearchHeaderProps } from "./ThirdSearchHeader";
import { ContentListForm, ContentListFormKey, QueryCondition } from "./types";

const ROOT_PATH = "/";
export const clearNull = (obj: Record<string, any>) => {
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
    const program_group = query.get("program_group");
    const path = query.get("path") || "";
    const exect_search = query.get("exect_search") || ExectSearch.all;
    return clearNull({ name, publish_status, author, page, order_by, content_type, program_group, path, exect_search });
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
  const conditionFormMethods = useForm<ContentListForm>();
  const { watch, reset, getValues } = conditionFormMethods;
  const ids = watch(ContentListFormKey.CHECKED_CONTENT_IDS);
  const { contentsList, total, page_size, folderTree, parentFolderInfo, orgList, selectedOrg, orgProperty, myOrgId } = useSelector<
    RootState,
    RootState["content"]
  >((state) => state.content);
  const filteredFolderTree = useMemo(() => excludeFolderOfTree(folderTree, ids), [ids, folderTree]);
  const [actionObj, setActionObj] = useState<ThirdSearchHeaderProps["actionObj"]>();
  const dispatch = useDispatch<AppDispatch>();
  const { folderTreeActive, closeFolderTree, openFolderTree, referContent, setReferContent, folderTreeShowIndex } = useFolderTree<
    EntityFolderContent[]
  >();
  const selctedOrgIds = useMemo(() => orgs2id(selectedOrg), [selectedOrg]);
  const filterOrgList = useMemo(() => excludeMyOrg(orgList, myOrgId), [myOrgId, orgList]);
  const {
    organizationListActive,
    closeOrganizationList,
    openOrganizationList,
    organizationListShowIndex,
    shareFolder,
    setShareFolder,
  } = useOrganizationList<OrgInfoProps[]>();
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
  const handleChangePage: ContentCardListProps["onChangePage"] = (page) => {
    if (condition.path && condition.path !== ROOT_PATH) {
      history.replace({ search: toQueryString({ ...condition, page }) });
    } else {
      history.push({ search: toQueryString({ ...condition, page }) });
    }
  };
  const handleChangePageSize: ContentCardListProps["onChangePageSize"] = (page_size) => {
    refreshWithDispatch(dispatch(setUserSetting({ cms_page_size: page_size, metaLoading: true })));
  };
  const handleClickConent: ContentCardListProps["onClickContent"] = (id, content_type, dir_path) => {
    if (content_type === ContentType.material || content_type === ContentType.plan) {
      history.push({
        pathname: ContentPreview.routeRedirectDefault,
        search: toQueryString(clearNull({ id: id, content_type: content_type, author: condition.author })),
      });
    } else if (content_type === ContentType.folder) {
      const path = dir_path === ROOT_PATH ? "" : ROOT_PATH;
      const contentType =
        condition.content_type !== SearchContentsRequestContentType.assetsandfolder
          ? SearchContentsRequestContentType.materialandplan
          : condition.content_type;
      history.push({
        search: toQueryString({
          ...condition,
          page: 1,
          path: `${dir_path}${path}${id}`,
          order_by: OrderBy._updated_at,
          content_type: contentType,
          author: "",
          name: "",
        }),
      });
    } else {
      history.push(`/library/content-edit/lesson/assets/tab/assetDetails/rightside/assetsEdit?id=${id}`);
    }
  };
  const handleChangeTab: FirstSearchHeaderProps["onChange"] = (value) => {
    reset();
    if (condition.path && condition.path !== ROOT_PATH) {
      history.replace({ search: toQueryString(clearNull(value)) });
    } else {
      history.push({ search: toQueryString(clearNull(value)) });
    }
  };
  const handleChange: FirstSearchHeaderProps["onChange"] = (value) => {
    const newValue = produce(value, (draft) => {
      const searchText = getValues()[SEARCH_TEXT_KEY];
      searchText ? (draft.name = searchText) : delete draft.name;
      const exect_search = getValues()[EXECT_SEARCH];
      draft.exect_search = exect_search;
    });
    if (condition.path && condition.path !== ROOT_PATH) {
      history.replace({ search: toQueryString(clearNull(newValue)) });
    } else {
      history.push({ search: toQueryString(clearNull(newValue)) });
    }
  };
  const handleChangeAssets: FirstSearchHeaderProps["onChangeAssets"] = (content_type, scope) =>
    history.push({ search: toQueryString({ content_type, page: 1, order_by: OrderBy._updated_at, scope }) });
  const handleCreateContent = () => {
    if (condition.content_type === SearchContentsRequestContentType.assetsandfolder) {
      if (condition.path && condition.path !== ROOT_PATH) {
        history.replace(`/library/content-edit/lesson/assets/tab/assetDetails/rightside/assetsEdit`);
      } else {
        history.push(`/library/content-edit/lesson/assets/tab/assetDetails/rightside/assetsEdit`);
      }
    } else {
      if (condition.path && condition.path !== ROOT_PATH) {
        history.replace({ pathname: ContentEdit.routeRedirectDefault, search: toQueryString({ back: toFullUrl(history.location) }) });
      } else {
        history.push({ pathname: ContentEdit.routeRedirectDefault, search: toQueryString({ back: toFullUrl(history.location) }) });
      }
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
    // history.push({ search: toQueryString({ ...condition, path: `${parentFolderInfo.dir_path}` }) });
    history.goBack();
  };

  const handleApprove: ContentCardListProps["onApprove"] = (id) => {
    return refreshWithDispatch(dispatch(approveContent(id)));
  };
  const handleReject: ContentCardListProps["onReject"] = (id) => {
    return refreshWithDispatch(dispatch(rejectContent({ id: id })));
  };
  const handleBulkApprove: ThirdSearchHeaderProps["onBulkApprove"] = () => {
    return refreshWithDispatch(dispatch(bulkApprove(ids)).then(unwrapResult));
  };
  const handleBulkReject: ThirdSearchHeaderProps["onBulkReject"] = () => {
    return refreshWithDispatch(dispatch(bulkReject({ ids: ids })).then(unwrapResult));
  };
  const handleExportCSV: ThirdSearchHeaderProps["onExportCSV"] = () => {
    if (ids?.length > 0) return true;
    dispatch(actWarning(d("At least one content should be selected.").t("library_msg_remove_select_one")));
    return false;
  };
  const handleClickShareBtn: ContentCardListProps["onClickShareBtn"] = async (content) => {
    setShareFolder(content);
    await dispatch(getOrgList({ folder_ids: content.id, metaLoading: true }));
    openOrganizationList();
  };
  const handleShareFolder: OrganizationListProps["onShareFolder"] = async (org_ids) => {
    await dispatch(shareFolders({ shareFolder: shareFolder, org_ids: org_ids, metaLoading: true }));
    closeOrganizationList();
  };
  useEffect(() => {
    if (contentsList?.length === 0 && total > 0) {
      const page = 1;
      history.push({ search: toQueryString({ ...condition, page }) });
    }
  }, [condition, contentsList, history, total]);

  useEffect(() => {
    setActionObj(ids2removeOrDelete(contentsList, ids));
  }, [contentsList, ids]);

  useEffect(() => {
    (async () => {
      await dispatch(onLoadContentList({ ...condition, metaLoading: true }));
      setTimeout(reset, 500);
    })();
  }, [condition, reset, dispatch, refreshKey]);

  return (
    <div>
      {condition.program_group && <ProgramSearchHeader value={condition} onChange={handleChangeTab} />}
      {condition.program_group && <ProgramSearchHeaderMb value={condition} onChange={handleChangeTab} />}
      {!condition.program_group && (
        <FirstSearchHeader
          value={condition}
          onChange={handleChangeTab}
          onChangeAssets={handleChangeAssets}
          onCreateContent={handleCreateContent}
        />
      )}
      {!condition.program_group && (
        <FirstSearchHeaderMb
          value={condition}
          onChange={handleChangeTab}
          onChangeAssets={handleChangeAssets}
          onCreateContent={handleCreateContent}
        />
      )}
      <SecondSearchHeader
        value={condition}
        onChange={handleChange}
        onCreateContent={handleCreateContent}
        conditionFormMethods={conditionFormMethods}
      />
      <SecondSearchHeaderMb
        value={condition}
        onChange={handleChange}
        onCreateContent={handleCreateContent}
        conditionFormMethods={conditionFormMethods}
      />
      <ThirdSearchHeader
        value={condition}
        onChange={handleChange}
        onBulkPublish={handleBulkPublish}
        onBulkDelete={handleBulkDelete}
        onAddFolder={() => handlePageAddFolder()}
        onBulkMove={handleClickBulkMove}
        actionObj={actionObj}
        onBulkDeleteFolder={handleBulkDeleteFolder}
        onBulkApprove={handleBulkApprove}
        onBulkReject={handleBulkReject}
        onExportCSV={handleExportCSV}
        ids={ids}
        contentList={contentsList}
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
        onBulkApprove={handleBulkApprove}
        onBulkReject={handleBulkReject}
        onExportCSV={handleExportCSV}
        ids={ids}
        contentList={contentsList}
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
                formMethods={conditionFormMethods}
                list={contentsList}
                total={total}
                amountPerPage={page_size}
                queryCondition={condition}
                orgProperty={orgProperty}
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
                onApprove={handleApprove}
                onReject={handleReject}
                onClickShareBtn={handleClickShareBtn}
              />
            ) : JSON.stringify(parentFolderInfo) !== "{}" &&
              (condition.publish_status === PublishStatus.published ||
                condition.content_type === SearchContentsRequestContentType.assetsandfolder) ? (
              <LayoutBox holderMin={40} holderBase={202} mainBase={1517}>
                <BackToPrevPage onGoBack={handleGoback} parentFolderInfo={parentFolderInfo} />
              </LayoutBox>
            ) : (
              emptyTip
            )
          ) : (
            permissionTip
          )
        }
      />
      <FolderTree
        folders={filteredFolderTree}
        rootFolderName={condition.content_type === SearchContentsRequestContentType.assetsandfolder ? "Assets" : "Organization Content"}
        onClose={closeFolderTree}
        open={folderTreeActive}
        onMove={handleMove}
        onAddFolder={handleAddFolder}
        key={folderTreeShowIndex}
      />
      <OrganizationList
        orgList={filterOrgList}
        selectedOrg={selctedOrgIds}
        onClose={closeOrganizationList}
        open={organizationListActive}
        onShareFolder={handleShareFolder}
        key={organizationListShowIndex}
      />
    </div>
  );
}

MyContentList.routeBasePath = "/library/my-content-list";
MyContentList.routeRedirectDefault = `/library/my-content-list?publish_status=published&page=1&order_by=${OrderBy._updated_at}&content_type=${SearchContentsRequestContentType.materialandplan}`;
