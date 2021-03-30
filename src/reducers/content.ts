import { AsyncThunk, createAsyncThunk, createSlice, PayloadAction, unwrapResult } from "@reduxjs/toolkit";
import { UseFormMethods } from "react-hook-form";
import { useHistory } from "react-router-dom";
import api, { gqlapi } from "../api";
import {
  OrganizationsDocument,
  OrganizationsQuery,
  OrganizationsQueryVariables,
  QeuryMeDocument,
  QeuryMeQuery,
  QeuryMeQueryVariables,
} from "../api/api-ko.auto";
// import { Content, ContentIDListRequest, CreateContentRequest, LearningOutcomes } from "../api/api";
import {
  ApiContentBulkOperateRequest,
  ApiOutcomeView,
  EntityContentInfoWithDetails,
  EntityCreateContentRequest,
  EntityFolderContent,
  EntityFolderItemInfo,
  EntityOrganizationInfo,
  EntityOrganizationProperty,
} from "../api/api.auto";
import { apiWaitForOrganizationOfPage, RecursiveFolderItem, recursiveListFolderItems } from "../api/extra";
import { Author, ContentType, FolderPartition, OutcomePublishStatus, PublishStatus, SearchContentsRequestContentType } from "../api/type";
import { LangRecordId } from "../locale/lang/type";
import { d, t } from "../locale/LocaleManager";
import { content2FileType } from "../models/ModelEntityFolderContent";
import { OrgInfoProps } from "../pages/MyContentList/OrganizationList";
import { ExectSearch } from "../pages/MyContentList/SecondSearchHeader";
import { ContentListForm, ContentListFormKey, QueryCondition } from "../pages/MyContentList/types";
import { actAsyncConfirm, ConfirmDialogType, unwrapConfirm } from "./confirm";
import { LoadingMetaPayload } from "./middleware/loadingMiddleware";
import { actWarning } from "./notify";

interface IContentState {
  history?: ReturnType<typeof useHistory>;
  contentDetail: Required<EntityContentInfoWithDetails>;
  mediaList: EntityContentInfoWithDetails[];
  outcomeList: ApiOutcomeView[];
  total: number;
  contentsList: EntityFolderContent[];
  contentPreview: EntityContentInfoWithDetails;
  mediaListTotal: number;
  OutcomesListTotal: number;
  linkedMockOptions: LinkedMockOptions;
  lesson_types: LinkedMockOptionsItem[];
  visibility_settings: LinkedMockOptionsItem[];
  token: string;
  page_size: number;
  folderTree: RecursiveFolderItem[];
  parentFolderInfo: EntityFolderItemInfo;
  orgProperty: EntityOrganizationProperty;
  orgList: OrgInfoProps[];
  selectedOrg: EntityOrganizationInfo[];
  myOrgId: string;
  user_id: string;
}

interface RootState {
  content: IContentState;
}

const initialState: IContentState = {
  history: undefined,
  contentDetail: {
    id: "",
    content_type: ContentType.material,
    suggest_time: 0,
    grade: [],
    name: "",
    program: "",
    subject: [],
    developmental: [],
    skills: [],
    age: [],
    keywords: [],
    description: "",
    thumbnail: "",
    version: 0,
    source_id: "",
    source_type: "",
    locked_by: "",
    data: "",
    extra: "",
    author: "",
    author_name: "",
    org: "",
    publish_scope: "",
    publish_status: "published",
    content_type_name: "",
    program_name: "",
    subject_name: [],
    developmental_name: [],
    skills_name: [],
    age_name: [],
    org_name: "",
    outcomes: [],
    outcome_entities: [],
    created_at: 0,
    draw_activity: false,
    grade_name: [],
    latest_id: "",
    lesson_type: "",
    lesson_type_name: "",
    publish_scope_name: "",
    reject_reason: [],
    remark: "",
    self_study: false,
    updated_at: 0,
    creator: "",
    creator_name: "",
    is_mine: false,
    teacher_manual_batch: [],
  },
  mediaList: [],
  mediaListTotal: 0,
  OutcomesListTotal: 0,
  outcomeList: [],
  linkedMockOptions: {
    program: [],
    subject: [],
    developmental: [],
    age: [],
    grade: [],
    skills: [],
    program_id: "",
    developmental_id: "",
  },
  lesson_types: [],
  visibility_settings: [],
  total: 0,
  contentsList: [],
  contentPreview: {
    created_at: 0,
    id: "",
    content_type: undefined,
    suggest_time: 0,
    grade: [],
    grade_name: [],
    name: "",
    program: "",
    subject: [],
    developmental: [],
    skills: [],
    age: [],
    keywords: [],
    description: "",
    thumbnail: "",
    version: 0,
    source_id: "",
    locked_by: "",
    data: "",
    extra: "",
    author: "",
    author_name: "",
    org: "",
    publish_scope: "",
    publish_status: "published",
    content_type_name: "",
    program_name: "",
    subject_name: [],
    developmental_name: [],
    skills_name: [],
    age_name: [],
    org_name: "",
    outcomes: [],
    outcome_entities: [],
    self_study: false,
    draw_activity: false,
    lesson_type: "",
    publish_scope_name: "",
    source_type: "",
    lesson_type_name: "",
    creator: "",
    creator_name: "",
    is_mine: false,
    teacher_manual_batch: [],
  },
  token: "",
  page_size: 20,
  folderTree: [],
  parentFolderInfo: {},
  orgProperty: {},
  orgList: [],
  selectedOrg: [],
  myOrgId: "",
  user_id: "",
};

// const ADD_FOLDER_MODEL_INFO = {
//   title: d("New Folder").t("library_label_new_folder"),
//   content: d("Folder Name").t("library_label_folder_name"),
//   type: ConfirmDialogType.onlyInput,
// };
const UNKNOW_ERROR_LABEL: LangRecordId = "general_error_unknown";
// const RENAME_FOLDER_NAME_MODEL_INFO = {
//   title: d("Rename").t("library_label_rename"),
//   content: d("Folder Name").t("library_label_folder_name"),
//   type: ConfirmDialogType.onlyInput,
// };

export enum Action {
  remove = "remove",
  delete = "delete",
}
export type AsyncTrunkReturned<Type> = Type extends AsyncThunk<infer X, any, any> ? X : never;
type AsyncReturnType<T extends (...args: any) => any> = T extends (...args: any) => Promise<infer U>
  ? U
  : T extends (...args: any) => infer U
  ? U
  : any;

export const save = createAsyncThunk<EntityContentInfoWithDetails["id"], EntityCreateContentRequest, { state: RootState }>(
  "content/save",
  async (payload, { getState }) => {
    const {
      content: {
        contentDetail: { id },
      },
    } = getState();
    if (!id) {
      return (await api.contents.createContent(payload)).id;
    } else {
      await api.contents.updateContent(id, payload);
      return id;
    }
  }
);

export const publish = createAsyncThunk<
  AsyncReturnType<typeof api.contents.publishContent>,
  Required<EntityContentInfoWithDetails>["id"],
  { state: RootState }
>("content/publish", (id, { getState }) => {
  const {
    content: {
      contentDetail: { publish_scope },
    },
  } = getState();

  return api.contents.publishContent(id, { scope: publish_scope });
});

export const publishWidthAssets = createAsyncThunk<
  AsyncReturnType<typeof api.contents.publishContentWithAssets>,
  Required<EntityContentInfoWithDetails>["id"],
  { state: RootState }
>("content/publish", (id, { getState }) => {
  const {
    content: {
      contentDetail: { publish_scope },
    },
  } = getState();
  return api.contents.publishContentWithAssets(id, { scope: publish_scope });
});

export interface LinkedMockOptionsItem {
  id?: string;
  name?: string;
}

export interface LinkedMockOptions {
  program?: LinkedMockOptionsItem[];
  subject?: LinkedMockOptionsItem[];
  developmental?: LinkedMockOptionsItem[];
  age?: LinkedMockOptionsItem[];
  grade?: LinkedMockOptionsItem[];
  skills?: LinkedMockOptionsItem[];
  program_id?: string;
  developmental_id?: string;
}
export interface LinkedMockOptionsPayload extends LoadingMetaPayload {
  default_program_id?: string;
  default_developmental_id?: string;
}

export const getLinkedMockOptions = createAsyncThunk<LinkedMockOptions, LinkedMockOptionsPayload>(
  "content/",
  async ({ metaLoading, default_program_id, default_developmental_id }) => {
    const program = await api.programs.getProgram();
    const program_id = default_program_id ? default_program_id : program[0].id;
    if (program_id) {
      const [subject, developmental, age, grade] = await Promise.all([
        api.subjects.getSubject({ program_id }),
        api.developmentals.getDevelopmental({ program_id }),
        api.ages.getAge({ program_id }),
        api.grades.getGrade({ program_id }),
      ]);
      const developmental_id = default_developmental_id ? default_developmental_id : developmental[0].id;
      if (developmental_id) {
        const skills = await api.skills.getSkill({ program_id, developmental_id });
        return { program, subject, developmental, age, grade, skills, program_id, developmental_id };
      } else {
        return { program, subject, developmental, age, grade, skills: [], program_id, developmental_id: "" };
      }
    } else {
      return { program, subject: [], developmental: [], age: [], grade: [], skills: [], program_id: "", developmental_id: "" };
    }
  }
);
export const getLinkedMockOptionsSkills = createAsyncThunk<LinkedMockOptions["skills"], LinkedMockOptionsPayload>(
  "getLinkedMockOptionsSkills",
  async ({ metaLoading, default_program_id: program_id, default_developmental_id: developmental_id }) => {
    return await api.skills.getSkill({ program_id, developmental_id });
  }
);

interface onLoadContentEditPayload extends LoadingMetaPayload {
  id: EntityContentInfoWithDetails["id"] | null;
  type: "assets" | "material" | "plan";
  searchMedia?: string;
  searchOutcome?: string;
  assumed?: boolean;
  isShare?: boolean;
}

interface onLoadContentEditResult {
  outcomeList?: AsyncReturnType<typeof api.learningOutcomes.searchLearningOutcomes>;
  contentDetail?: AsyncReturnType<typeof api.contents.getContentById>;
  mediaList?: AsyncReturnType<typeof api.contents.searchContents>;
  lesson_types?: LinkedMockOptionsItem[];
  visibility_settings?: LinkedMockOptionsItem[];
}
export const onLoadContentEdit = createAsyncThunk<onLoadContentEditResult, onLoadContentEditPayload>(
  "content/onLoadContentEdit",
  async ({ id, type, searchMedia, searchOutcome, assumed, isShare }, { dispatch }) => {
    const contentDetail = id ? await api.contents.getContentById(id) : initialState.contentDetail;
    const [lesson_types, visibility_settings] = await Promise.all([
      type === "material" ? api.lessonTypes.getLessonType() : undefined,
      type === "material" || type === "plan"
        ? api.visibilitySettings.getVisibilitySetting({
            content_type: type === "material" ? SearchContentsRequestContentType.material : SearchContentsRequestContentType.plan,
          })
        : undefined,
      type === "material" || type === "plan"
        ? isShare && type === "plan"
          ? dispatch(searchAuthContentLists({ content_type: SearchContentsRequestContentType.material, name: searchMedia }))
          : dispatch(
              searchContentLists({
                content_type: type === "material" ? SearchContentsRequestContentType.assets : SearchContentsRequestContentType.material,
                name: searchMedia,
              })
            )
        : undefined,
      type === "material" || type === "plan"
        ? dispatch(searchOutcomeList({ search_key: searchOutcome, page: 1, assumed: assumed ? 1 : -1 }))
        : undefined,
      dispatch(
        getLinkedMockOptions({
          default_program_id: contentDetail.program,
          default_developmental_id: contentDetail.developmental && contentDetail.developmental[0],
        })
      ),
    ]);

    return { contentDetail, lesson_types, visibility_settings };
  }
);

type IGetContentsResourseParams = Parameters<typeof api.contentsResources.getContentResourceUploadPath>[0];
type IGetContentsResourseResult = AsyncReturnType<typeof api.contentsResources.getContentResourceUploadPath>;
export const getContentResourceUploadPath = createAsyncThunk<IGetContentsResourseResult, IGetContentsResourseParams>(
  "content/getContentResourceUploadPath",
  (query) => {
    return api.contentsResources.getContentResourceUploadPath(query);
  }
);
type IQueryContentsParams = Parameters<typeof api.contents.searchContents>[0] & LoadingMetaPayload;
type IQueryContentsResult = AsyncReturnType<typeof api.contents.searchContents>;
export const contentLists = createAsyncThunk<IQueryContentsResult, IQueryContentsParams>(
  "content/contentLists",
  async ({ metaLoading, ...query }) => {
    const { list, total } = await api.contents.searchContents({ ...query });
    return { list, total };
  }
);

type IQueryFolderContentParams = Parameters<typeof api.contentsFolders.queryFolderContent>[0] & LoadingMetaPayload;
type IQueryFolderContentsResult = AsyncReturnType<typeof api.contentsFolders.queryFolderContent>;
export const folderContentLists = createAsyncThunk<IQueryFolderContentsResult, IQueryFolderContentParams, { state: RootState }>(
  "content/folderContentLists",
  async ({ metaLoading, ...query }, { getState }) => {
    const {
      content: { page_size },
    } = getState();
    const { list, total } = await api.contentsFolders.queryFolderContent({ ...query, page_size });
    return { list, total };
  }
);
type IQueryOnLoadContentList = {
  exectSearch?: string;
} & QueryCondition &
  LoadingMetaPayload;
interface IQyertOnLoadContentListResult {
  folderRes?: AsyncReturnType<typeof api.contentsFolders.queryFolderContent>;
  pendingRes?: AsyncReturnType<typeof api.contentsPending.searchPendingContents>;
  privateRes?: AsyncReturnType<typeof api.contentsPrivate.searchPrivateContents>;
  contentRes?: AsyncReturnType<typeof api.contents.searchContents>;
  badaContent?: AsyncReturnType<typeof api.contentsAuthed.queryAuthContent>;
  organization_id: string;
}
export const onLoadContentList = createAsyncThunk<IQyertOnLoadContentListResult, IQueryOnLoadContentList, { state: RootState }>(
  "content/onLoadContentList",
  async (query, { getState, dispatch }) => {
    await dispatch(getUserSetting());
    const {
      content: { page_size },
    } = getState();
    const { name, publish_status, author, content_type, page, program_group, order_by, path, exect_search } = query;
    const nameValue = exect_search === ExectSearch.all ? name : "";
    const contentNameValue = exect_search === ExectSearch.name ? name : "";
    const isExectSearch = exect_search === ExectSearch.name;
    const parent_id = path?.split("/").pop();
    if (parent_id && page === 1) await dispatch(getFolderItemById(parent_id));
    const organization_id = (await apiWaitForOrganizationOfPage()) as string;
    await dispatch(getOrgProperty());
    const params = {
      name: nameValue,
      content_name: contentNameValue,
      publish_status,
      author,
      content_type,
      program_group,
      order_by,
      page,
      page_size,
      path,
    };
    if (isExectSearch) delete params.name;
    if (!isExectSearch) delete params.content_name;
    if (publish_status === PublishStatus.published || content_type === String(SearchContentsRequestContentType.assetsandfolder)) {
      delete params.program_group;
      const folderRes = await api.contentsFolders.queryFolderContent(params);
      return { folderRes, organization_id };
    } else if (publish_status === PublishStatus.pending && author !== Author.self) {
      delete params.path;
      delete params.program_group;
      const pendingRes = await api.contentsPending.searchPendingContents(params);
      return { pendingRes, organization_id };
    } else if (
      publish_status === PublishStatus.draft ||
      publish_status === PublishStatus.rejected ||
      (publish_status === PublishStatus.pending && author === Author.self)
    ) {
      delete params.path;
      delete params.program_group;
      const privateRes = await api.contentsPrivate.searchPrivateContents(params);
      return { privateRes, organization_id };
    } else if (program_group) {
      delete params.publish_status;
      delete params.author;
      delete params.content_type;
      delete params.path;
      const badaContent = await api.contentsAuthed.queryAuthContent(params);
      return { badaContent, organization_id };
    } else {
      delete params.path;
      delete params.program_group;

      const contentRes = await api.contents.searchContents(params);
      return { contentRes, organization_id };
    }
  }
);
// contentEdit搜索outcomeListist
type IQueryOutcomeListParams = Parameters<typeof api.learningOutcomes.searchLearningOutcomes>[0] & LoadingMetaPayload;
type IQueryOutcomeListResult = AsyncReturnType<typeof api.learningOutcomes.searchLearningOutcomes>;
export const searchOutcomeList = createAsyncThunk<IQueryOutcomeListResult, IQueryOutcomeListParams>(
  "content/searchOutcomeList",
  async ({ metaLoading, ...query }) => {
    const { list, total } = await api.learningOutcomes.searchLearningOutcomes({
      publish_status: OutcomePublishStatus.published,
      page_size: 10,
      ...query,
    });
    return { list, total };
  }
);
// contentEdit搜索contentlist
export const searchContentLists = createAsyncThunk<IQueryContentsResult, IQueryContentsParams>(
  "searchContentLists",
  async ({ metaLoading, ...query }) => {
    const { list, total } = await api.contents.searchContents({ publish_status: PublishStatus.published, page_size: 10, ...query });
    return { list, total };
  }
);
// contentEdit搜索contentlist
export const searchAuthContentLists = createAsyncThunk<IQueryContentsResult, IQueryContentsParams>(
  "searchAuthContentLists",
  async ({ metaLoading, ...query }) => {
    const { list, total } = await api.contentsAuthed.queryAuthContent({ page_size: 10, ...query });
    return { list, total };
  }
);

interface IQueryOnLoadContentPreviewParams extends LoadingMetaPayload {
  content_id: Parameters<typeof api.contents.getContentById>[0];
  schedule_id: string;
  tokenToCall?: boolean;
}
interface IQyeryOnLoadCotnentPreviewResult {
  contentDetail: AsyncReturnType<typeof api.contents.getContentById>;
  user_id?: string;
  token: string;
}
export const onLoadContentPreview = createAsyncThunk<IQyeryOnLoadCotnentPreviewResult, IQueryOnLoadContentPreviewParams>(
  "content/onLoadContentPreview",
  async ({ content_id, schedule_id, tokenToCall = true }) => {
    let token: string = "";
    if (tokenToCall) {
      if (schedule_id) {
        const data = await api.schedules
          .getScheduleLiveToken(schedule_id, { live_token_type: "preview" })
          .catch((err) => Promise.reject(err.label));
        await api.schedules.getScheduleById(schedule_id);
        token = data.token as string;
      } else {
        const data = await api.contents.getContentLiveToken(content_id);
        token = data.token as string;
      }
    }
    const contentDetail = await api.contents.getContentById(content_id);
    const organization_id = (await apiWaitForOrganizationOfPage()) as string;
    const { data } = await gqlapi.query<QeuryMeQuery, QeuryMeQueryVariables>({
      query: QeuryMeDocument,
      variables: {
        organization_id,
      },
      fetchPolicy: "cache-first",
    });
    const user_id = data?.me?.user_id;
    return { contentDetail, user_id, token };
  }
);

type IQueryDeleteContentParams = {
  id: Parameters<typeof api.contents.updateContent>[0];
  type: string;
};
type IQueryDeleteContentResult = AsyncReturnType<typeof api.contents.deleteContent>;
export const deleteContent = createAsyncThunk<IQueryDeleteContentResult, IQueryDeleteContentParams>(
  "content/deleteContent",
  async ({ id, type }, { dispatch }) => {
    const content =
      type === Action.remove
        ? d("Are you sure you want to remove this content?").t("library_msg_remove_content")
        : d("Are you sure you want to delete this content?").t("library_msg_delete_content");
    const { isConfirmed } = unwrapResult(await dispatch(actAsyncConfirm({ content })));
    if (!isConfirmed) return Promise.reject();
    return api.contents.deleteContent(id);
  }
);
export const publishContent = createAsyncThunk<
  AsyncReturnType<typeof api.contents.publishContent>,
  Required<EntityContentInfoWithDetails>["id"]
>("content/publishContent", async (id, { dispatch }) => {
  const content = d("Are you sure you want to republish this content?").t("library_msg_republish_content");
  const { isConfirmed } = unwrapResult(await dispatch(actAsyncConfirm({ content })));
  if (!isConfirmed) return Promise.reject();
  return api.contents.publishContent(id, { scope: "" });
});

// type BulkActionIds = Parameters<typeof>
type IQueryBulkDeleteParams = {
  ids: Parameters<typeof api.contentsBulk.deleteContentBulk>[0]["id"];
  type: Action;
};
type IQueryBulkDeleteResult = AsyncReturnType<typeof api.contentsBulk.deleteContentBulk>;
export const bulkDeleteContent = createAsyncThunk<IQueryBulkDeleteResult, IQueryBulkDeleteParams>(
  "content/bulkDeleteContent",
  async ({ ids, type }, { dispatch }) => {
    if (!ids?.length)
      return Promise.reject(dispatch(actWarning(d("At least one content should be selected.").t("library_msg_remove_select_one"))));
    const content =
      type === Action.remove
        ? d("Are you sure you want to remove these contents?").t("library_msg_bulk_remove_content")
        : d("Are you sure you want to delete these contents?").t("library_msg_bulk_delete_content");
    const { isConfirmed } = unwrapResult(await dispatch(actAsyncConfirm({ content })));
    if (!isConfirmed) return Promise.reject();
    return api.contentsBulk.deleteContentBulk({ id: ids });
  }
);
export const bulkPublishContent = createAsyncThunk<
  AsyncReturnType<typeof api.contentsBulk.publishContentBulk>,
  Required<ApiContentBulkOperateRequest>["id"]
>("content/bulkPublishContent", async (ids, { dispatch }) => {
  if (!ids?.length)
    return Promise.reject(dispatch(actWarning(d("At least one content should be selected.").t("library_msg_remove_select_one"))));
  const content = d("Are you sure you want to republish these contents?").t("library_msg_bulk_republish_content");
  const { isConfirmed } = unwrapResult(await dispatch(actAsyncConfirm({ content })));
  if (!isConfirmed) return Promise.reject();
  return api.contentsBulk.publishContentBulk({ id: ids });
});
type aa = Required<EntityContentInfoWithDetails>["id"];
export const approveContent = createAsyncThunk<
  AsyncReturnType<typeof api.contents.approveContentReview>,
  Required<EntityContentInfoWithDetails>["id"]
>("content/approveContentReview", async (content_id, { dispatch }) => {
  return api.contents.approveContentReview(content_id);
});
type RejectContentParams = {
  id: Parameters<typeof api.contents.rejectContentReview>[0];
  reason?: Parameters<typeof api.contents.rejectContentReview>[1]["reject_reason"];
};
type RejectContentResult = AsyncReturnType<typeof api.contents.rejectContentReview>;
export const rejectContent = createAsyncThunk<RejectContentResult, RejectContentParams>(
  "content/rejectContent",
  async ({ id }, { dispatch }) => {
    const title = d("Reason").t("library_label_reason");
    const content = d("Please specify the reason for rejection.").t("library_msg_reject_reason");
    const type = ConfirmDialogType.textField;
    const { isConfirmed, reasonValue, otherValue } = unwrapResult(await dispatch(actAsyncConfirm({ title, content, type })));
    if (!isConfirmed) return Promise.reject();
    return api.contents.rejectContentReview(id, { reject_reason: reasonValue, remark: otherValue });
  }
);
export const lockContent = createAsyncThunk<
  AsyncReturnType<typeof api.contents.lockContent>,
  Parameters<typeof api.contents.lockContent>[0]
>("content/lockContent", async (content_id) => {
  return await api.contents.lockContent(content_id);
});

type IQuerySetUserSettingParams = Parameters<typeof api.userSettings.setUserSetting>[0] & LoadingMetaPayload;
type IQuerySetUserSettingResult = AsyncReturnType<typeof api.userSettings.setUserSetting>;
export const setUserSetting = createAsyncThunk<IQuerySetUserSettingResult, IQuerySetUserSettingParams>(
  "content/setUserSetting",
  async ({ cms_page_size }) => await api.userSettings.setUserSetting({ cms_page_size })
);

type IQueryGetUserSettingParams = Parameters<typeof api.userSettings.getUserSettingByOperator>[0];
type IQueryGetUserSettingResult = AsyncReturnType<typeof api.userSettings.getUserSettingByOperator>;
export const getUserSetting = createAsyncThunk<IQueryGetUserSettingResult, IQueryGetUserSettingParams>("content/getUserSetting", () => {
  return api.userSettings.getUserSettingByOperator();
});

interface LiveContentPayload extends LoadingMetaPayload {
  content_id: Parameters<typeof api.contents.getContentLiveToken>[0];
}
type LiveContentResult = ReturnType<typeof api.contents.getContentLiveToken>;
export const getContentLiveToken = createAsyncThunk<LiveContentResult, LiveContentPayload>("contents/live", async ({ content_id }) => {
  return api.contents.getContentLiveToken(content_id);
});

type IQueryAddFolderParams = { content_type?: string; parent_id: string };
type IQueryAddFolderResult = AsyncReturnType<typeof api.folders.createFolder>;
export const addFolder = createAsyncThunk<IQueryAddFolderResult, IQueryAddFolderParams>(
  "content/addFolder",
  async ({ content_type, parent_id }, { dispatch }) => {
    let id;
    const partition =
      content_type === SearchContentsRequestContentType.assetsandfolder ? FolderPartition.assets : FolderPartition.plansAndMaterials;
    const validate = (name: string) => {
      return api.folders
        .createFolder({ name, owner_type: 1, parent_id, partition })
        .then(() => true)
        .catch((err) => t(err.label || UNKNOW_ERROR_LABEL));
    };
    const title = d("New Folder").t("library_label_new_folder");
    const content = d("Folder Name").t("library_label_folder_name");
    const type = ConfirmDialogType.onlyInput;
    await dispatch(actAsyncConfirm({ title, content, type, rules: { validate }, defaultValue: "" }))
      .then(unwrapResult)
      .then(unwrapConfirm);
    return { id };
  }
);

type IQueryRenameFolderParams = {
  item_id: Parameters<typeof api.folders.updateFolderItem>[0];
  defaultName: string;
};
type IQueryRenameFolderResult = AsyncReturnType<typeof api.folders.updateFolderItem>;
export const renameFolder = createAsyncThunk<IQueryRenameFolderResult, IQueryRenameFolderParams>(
  "content/renameFolder",
  async ({ item_id, defaultName }, { dispatch }) => {
    const validate = (name: string) => {
      return api.folders
        .updateFolderItem(item_id, { name: name })
        .then(() => true)
        .catch((err) => t(err.label || UNKNOW_ERROR_LABEL));
    };
    const title = d("Rename").t("library_label_rename");
    const content = d("Folder Name").t("library_label_folder_name");
    const type = ConfirmDialogType.onlyInput;
    await dispatch(actAsyncConfirm({ title, content, type, rules: { validate }, defaultValue: defaultName }))
      .then(unwrapResult)
      .then(unwrapConfirm);
    return "";
  }
);

type IQueryAddFolderParams1 = {
  content_type?: string;
  parent_id: string;
  name: string;
  description: string;
  keywords: string[];
  conditionFormMethods: UseFormMethods<ContentListForm>;
};
type IQueryAddFolderResult1 = AsyncReturnType<typeof api.folders.createFolder>;
export const addFolder1 = createAsyncThunk<IQueryAddFolderResult1, IQueryAddFolderParams1>(
  "content/addFolder",
  async ({ content_type, parent_id, name, description, keywords, conditionFormMethods }, { dispatch }) => {
    const partition =
      content_type === SearchContentsRequestContentType.assetsandfolder ? FolderPartition.assets : FolderPartition.plansAndMaterials;
    return api.folders.createFolder({ name, description, keywords, owner_type: 1, parent_id, partition }).catch((err) => {
      conditionFormMethods.setError(ContentListFormKey.FOLDER_NAME, { message: t(err.label || UNKNOW_ERROR_LABEL) });
      throw err;
    });
  }
);

type IQueryRenameFolderParams1 = {
  item_id: Parameters<typeof api.folders.updateFolderItem>[0];
  // defaultName: string;
  name: string;
  description: string;
  keywords: string[];
  conditionFormMethods: UseFormMethods<ContentListForm>;
};
type IQueryRenameFolderResult1 = AsyncReturnType<typeof api.folders.updateFolderItem>;
export const renameFolder1 = createAsyncThunk<IQueryRenameFolderResult1, IQueryRenameFolderParams1>(
  "content/renameFolder",
  async ({ item_id, name, description, keywords, conditionFormMethods }, { dispatch }) => {
    return api.folders.updateFolderItem(item_id, { name, description, keywords }).catch((err) => {
      conditionFormMethods.setError(ContentListFormKey.FOLDER_NAME, { message: t(err.label || UNKNOW_ERROR_LABEL) });
      throw err;
    });
    // .then(() => true)
    // .catch((err) => t(err.label || UNKNOW_ERROR_LABEL));
  }
);

type IQueryMOveFolderParams = {
  item_id: Parameters<typeof api.folders.moveFolderItem>[0];
  dist: Parameters<typeof api.folders.moveFolderItem>[1];
};
type IQueryMoveFolderResult = AsyncReturnType<typeof api.folders.moveFolderItem>;
export const moveFolder = createAsyncThunk<IQueryMoveFolderResult, IQueryMOveFolderParams>("content/moveFolder", ({ item_id, dist }) =>
  api.folders.moveFolderItem(item_id, dist)
);

type IQueryBulkMoveFolderParams = {
  dist: string;
  contents?: EntityFolderContent[];
  content_type?: string;
};
type IQueryBulkMoveFolderResult = AsyncReturnType<typeof api.folders.moveFolderItemBulk>;
export const bulkMoveFolder = createAsyncThunk<IQueryBulkMoveFolderResult, IQueryBulkMoveFolderParams>(
  "content/bulkMoveFolder",
  async ({ dist, contents, content_type }) => {
    const partition =
      content_type === SearchContentsRequestContentType.assetsandfolder ? FolderPartition.assets : FolderPartition.plansAndMaterials;
    const folder_info = content2FileType(contents);
    return api.folders.moveFolderItemBulk({ dist, folder_info, owner_type: 1, partition });
  }
);

type IQueryRemoveFolderParams = {
  item_id: Parameters<typeof api.folders.removeFolderItem>[0];
  params: Parameters<typeof api.folders.removeFolderItem>[1];
};
type IQueryRemoveFolderResult = AsyncReturnType<typeof api.folders.removeFolderItem>;
export const deleteFolder = createAsyncThunk<IQueryRemoveFolderResult, IQueryRemoveFolderParams>(
  "content/deleteFolder",
  async ({ item_id, params }, { dispatch }) => {
    const content = d("Are you sure you want to delete this content?").t("library_msg_delete_content");
    const { isConfirmed } = unwrapResult(await dispatch(actAsyncConfirm({ content })));
    if (!isConfirmed) return Promise.reject();
    return api.folders.removeFolderItem(item_id, params);
  }
);
type IQueryBulkDeleteFolderParams = Parameters<typeof api.folders.removeFolderItemBulk>[0];
type IQueryBulkDeleteFolderResult = AsyncReturnType<typeof api.folders.removeFolderItemBulk>;
export const bulkDeleteFolder = createAsyncThunk<IQueryBulkDeleteFolderResult, IQueryBulkDeleteFolderParams>(
  "content/bulkDeleteContent",
  async ({ folder_ids }, { dispatch }) => {
    if (!folder_ids?.length)
      return Promise.reject(dispatch(actWarning(d("At least one content should be selected.").t("library_msg_remove_select_one"))));
    const content = d("Are you sure you want to delete these contents?").t("library_msg_bulk_delete_content");
    const { isConfirmed } = unwrapResult(await dispatch(actAsyncConfirm({ content })));
    if (!isConfirmed) return Promise.reject();
    return api.folders.removeFolderItemBulk({ folder_ids });
  }
);
type IQueryGetFolderItemByIdParams = Parameters<typeof api.folders.getFolderItemById>[0];
type IQueryGetFolderItemByIdResult = AsyncReturnType<typeof api.folders.getFolderItemById>;
export const getFolderItemById = createAsyncThunk<IQueryGetFolderItemByIdResult, IQueryGetFolderItemByIdParams>(
  "content/getFolderItemById",
  (folder_id) => {
    return api.folders.getFolderItemById(folder_id);
  }
);

type IQuerySearchOrgFolderItemsParams = { content_type: string } & LoadingMetaPayload;
type IQuerySearchOrgFolderItemsResult = AsyncReturnType<typeof recursiveListFolderItems>;
export const searchOrgFolderItems = createAsyncThunk<IQuerySearchOrgFolderItemsResult, IQuerySearchOrgFolderItemsParams>(
  "content/searchOrgFolderItems",
  ({ content_type }) => {
    const partition =
      content_type === SearchContentsRequestContentType.assetsandfolder ? FolderPartition.assets : FolderPartition.plansAndMaterials;
    return recursiveListFolderItems({ partition, item_type: 1, path: "/" });
  }
);

type IQueryBulkApproveParams = Parameters<typeof api.contentsReview.approveContentReviewBulk>[0]["ids"];
type IQueryBulkApproveResult = AsyncReturnType<typeof api.contentsReview.approveContentReviewBulk>;
export const bulkApprove = createAsyncThunk<IQueryBulkApproveResult, IQueryBulkApproveParams>(
  "content/bulkApprove",
  async (ids, { dispatch }) => {
    if (!ids?.length)
      return Promise.reject(dispatch(actWarning(d("At least one content should be selected.").t("library_msg_remove_select_one"))));
    const content = d("Are you sure you want to approve these contents?").t("library_msg_approve_content");
    const { isConfirmed } = unwrapResult(await dispatch(actAsyncConfirm({ content })));
    if (!isConfirmed) return Promise.reject();
    return api.contentsReview.approveContentReviewBulk({ ids: ids });
  }
);

type IQueryBulkRejectParams = {
  ids: Parameters<typeof api.contentsReview.rejectContentReviewBulk>[0]["ids"];
};
type IQueryBulkRejectResult = AsyncReturnType<typeof api.contentsReview.rejectContentReviewBulk>;
export const bulkReject = createAsyncThunk<IQueryBulkRejectResult, IQueryBulkRejectParams>(
  "content/bulkReject",
  async ({ ids }, { dispatch }) => {
    if (!ids?.length)
      return Promise.reject(dispatch(actWarning(d("At least one content should be selected.").t("library_msg_remove_select_one"))));
    const title = d("Reason").t("library_label_reason");
    const content = d("Please specify the reason for rejection.").t("library_msg_reject_reason");
    const type = ConfirmDialogType.textField;
    const { isConfirmed, reasonValue, otherValue } = unwrapResult(await dispatch(actAsyncConfirm({ title, content, type })));
    if (!isConfirmed) return Promise.reject();
    return api.contentsReview.rejectContentReviewBulk({ ids: ids, reject_reason: reasonValue, remark: otherValue });
  }
);

type IQueryOrganizationPropertysResult = AsyncReturnType<typeof api.organizationsPropertys.getOrganizationPropertyById>;
export const getOrgProperty = createAsyncThunk<IQueryOrganizationPropertysResult>("content/getOrgProperty", async () => {
  const organization_id = (await apiWaitForOrganizationOfPage()) as string;
  const orgProperty = api.organizationsPropertys.getOrganizationPropertyById(organization_id);
  return orgProperty;
});

// export const getOrgList = createAsyncThunk<OrganizationsQuery["organizations"], IQueryGetFoldersSharedRecordsParams & LoadingMetaPayload>(
//   "content/getOrgList",
//   async (folder_ids, { dispatch }) => {
//     const { data } = await gqlapi.query<OrganizationsQuery, OrganizationsQueryVariables>({
//       query: OrganizationsDocument,
//     });
//     await dispatch(getFoldersSharedRecords(folder_ids));
//     return data.organizations;
//   }
// );

export enum Region {
  vn = "vn",
  global = "global",
}
type IQueryGetOrgListResult = AsyncReturnType<typeof api.organizationsRegion.getOrganizationByHeadquarterForDetails>["orgs"];
export const getOrgList = createAsyncThunk<
  IQueryGetOrgListResult,
  IQueryGetFoldersSharedRecordsParams & LoadingMetaPayload,
  { state: RootState }
>("content/getOrgList", async (folder_ids, { getState, dispatch }) => {
  const {
    content: { orgProperty },
  } = getState();
  let orgs: IQueryGetOrgListResult = [];
  if (orgProperty.region && orgProperty.region === Region.vn) {
    const data = await api.organizationsRegion.getOrganizationByHeadquarterForDetails();
    orgs = data.orgs;
  } else {
    const { data } = await gqlapi.query<OrganizationsQuery, OrganizationsQueryVariables>({
      query: OrganizationsDocument,
    });
    orgs = data.organizations as IQueryGetOrgListResult;
  }
  await dispatch(getFoldersSharedRecords(folder_ids));
  return orgs;
});

type IQueryShareFoldersParams = {
  shareFolder: EntityFolderContent | undefined;
  org_ids: Parameters<typeof api.folders.shareFolders>[0]["org_ids"];
} & LoadingMetaPayload;
type IQueryShareFolderResult = AsyncReturnType<typeof api.folders.shareFolders>;
export const shareFolders = createAsyncThunk<IQueryShareFolderResult, IQueryShareFoldersParams>(
  "content/shareFolders",
  async ({ shareFolder, org_ids }) => {
    const res = await api.folders.shareFolders({ folder_ids: [shareFolder?.id as string], org_ids });
    return res;
  }
);
type IQueryGetFoldersSharedRecordsParams = Parameters<typeof api.folders.getFoldersSharedRecords>[0];
type IQueryGetFoldersSharedRecordsResult = AsyncReturnType<typeof api.folders.getFoldersSharedRecords>;
export const getFoldersSharedRecords = createAsyncThunk<IQueryGetFoldersSharedRecordsResult, IQueryGetFoldersSharedRecordsParams>(
  "content/getFoldersSharedRecords",
  async (folder_ids) => {
    const res = await api.folders.getFoldersSharedRecords(folder_ids);
    return res;
  }
);
type IQueryH5pEventParams = Parameters<typeof api.h5P.createH5PEvent>[0];
type IQueryH5pEventResult = AsyncReturnType<typeof api.h5P.createH5PEvent>;
export const h5pEvent = createAsyncThunk<IQueryH5pEventResult, IQueryH5pEventParams>("content/h5pEvent", async (h5pSegment) => {
  return await api.h5P.createH5PEvent(h5pSegment);
});
type IGetDownloadPathParams = Parameters<typeof api.contentsResources.getDownloadPath>[0];
type IGetDownloadPathResult = AsyncReturnType<typeof api.contentsResources.getDownloadPath>;
export const getDownloadPath = createAsyncThunk<IGetDownloadPathResult, IGetDownloadPathParams>("content/getDownloadPath", (query) => {
  return api.contentsResources.getDownloadPath(query);
});

interface ActCreateDownoadParams extends LoadingMetaPayload {
  resourceId: string;
}
export const actCreateDownload = createAsyncThunk<IGetDownloadPathResult, ActCreateDownoadParams>(
  "content/actCreateDownload",
  ({ resourceId }) => api.contentsResources.getDownloadPath(resourceId)
);

const { actions, reducer } = createSlice({
  name: "content",
  initialState,
  reducers: {
    syncHistory: (state, { payload }: PayloadAction<IContentState["history"]>) => {
      state.history = payload;
    },
  },
  extraReducers: {
    // contentEdit
    // todo: PayloadAction<Content>  应该从 save 中获取类型
    [save.fulfilled.type]: (state, { payload }: PayloadAction<AsyncTrunkReturned<typeof save>>) => {
      // alert("success");
    },
    [save.rejected.type]: (state, { error }: any) => {
      throw error;
      // alert(JSON.stringify(error));
    },
    [publish.fulfilled.type]: (state, { payload }: PayloadAction<AsyncTrunkReturned<typeof publish>>) => {
      // alert("success");
    },
    [publish.rejected.type]: (state, { error }: any) => {
      throw error;
      // alert(JSON.stringify(error));
    },
    [onLoadContentEdit.pending.type]: (state, { payload }: PayloadAction<AsyncTrunkReturned<typeof onLoadContentEdit>>) => {
      const {
        contentDetail,
        mediaListTotal,
        mediaList,
        outcomeList,
        OutcomesListTotal,
        linkedMockOptions,
        lesson_types,
        visibility_settings,
      } = initialState;
      Object.assign(state, {
        contentDetail,
        mediaListTotal,
        mediaList,
        outcomeList,
        OutcomesListTotal,
        linkedMockOptions,
        lesson_types,
        visibility_settings,
      });
    },
    [onLoadContentEdit.fulfilled.type]: (state, { payload }: PayloadAction<AsyncTrunkReturned<typeof onLoadContentEdit>>) => {
      if (payload.contentDetail) {
        // debug
        // state.contentDetail = require('../mocks/contentDetial.json');
        state.contentDetail = payload.contentDetail as Required<EntityContentInfoWithDetails>;
      }
      if (payload.mediaList?.total) {
        state.mediaListTotal = payload.mediaList.total;
      }
      if (payload.mediaList?.list) {
        state.mediaList = payload.mediaList.list;
      }
      if (payload.outcomeList?.total) {
        state.OutcomesListTotal = payload.outcomeList.total;
      }
      if (payload.outcomeList?.list) {
        state.outcomeList = payload.outcomeList.list;
      }
      if (payload.lesson_types) {
        state.lesson_types = payload.lesson_types;
      }
      if (payload.visibility_settings) {
        state.visibility_settings = payload.visibility_settings;
      }
    },
    [onLoadContentEdit.rejected.type]: (state, { error }: any) => {
      // alert(JSON.stringify(error));
    },
    [getLinkedMockOptions.fulfilled.type]: (state, { payload }: PayloadAction<any>) => {
      // alert("success");
      state.linkedMockOptions = payload;
    },
    [getLinkedMockOptions.rejected.type]: (state, { error }: any) => {
      // alert(JSON.stringify(error));
    },
    [getLinkedMockOptionsSkills.fulfilled.type]: (state, { payload }: PayloadAction<any>) => {
      // alert("success");
      state.linkedMockOptions.skills = payload;
    },
    [getLinkedMockOptionsSkills.rejected.type]: (state, { error }: any) => {
      // alert(JSON.stringify(error));
    },
    [searchOutcomeList.fulfilled.type]: (state, { payload }: PayloadAction<any>) => {
      state.outcomeList = payload.list;
      state.OutcomesListTotal = payload.total;
    },
    // [searchOutcomeList.pending.type]: (state, { payload }: PayloadAction<any>) => {
    //   state.outcomeList = initialState.outcomeList;
    //   state.OutcomesListTotal = initialState.OutcomesListTotal;
    // },
    [searchContentLists.fulfilled.type]: (state, { payload }: PayloadAction<any>) => {
      state.mediaList = payload.list;
      state.mediaListTotal = payload.total;
    },
    // [searchContentLists.pending.type]: (state, { payload }: PayloadAction<any>) => {
    //   state.mediaList = initialState.mediaList;
    //   state.mediaListTotal = initialState.mediaListTotal;
    // },
    [searchAuthContentLists.fulfilled.type]: (state, { payload }: PayloadAction<any>) => {
      state.mediaList = payload.list;
      state.mediaListTotal = payload.total;
    },
    // [searchContentLists.pending.type]: (state, { payload }: PayloadAction<any>) => {
    //   state.mediaList = initialState.mediaList;
    //   state.mediaListTotal = initialState.mediaListTotal;
    // },

    // contentList页面
    [contentLists.pending.type]: (state, { payload }: PayloadAction<any>) => {
      state.contentsList = initialState.contentsList;
      state.total = initialState.total;
    },
    [contentLists.fulfilled.type]: (state, { payload }: PayloadAction<any>) => {
      state.contentsList = payload.list;
      state.mediaList = payload.list;
      state.total = payload.total;
    },
    [folderContentLists.pending.type]: (state, { payload }: PayloadAction<any>) => {
      state.contentsList = initialState.contentsList;
      state.total = initialState.total;
    },
    [folderContentLists.fulfilled.type]: (state, { payload }: PayloadAction<any>) => {
      state.contentsList = payload.list;
      state.total = payload.total;
    },
    [contentLists.rejected.type]: (state, { error }: any) => {},

    [searchOutcomeList.rejected.type]: (state, { error }: any) => {
      // alert(JSON.stringify(error));
    },
    [onLoadContentPreview.pending.type]: (state, { payload }: PayloadAction<any>) => {
      // alert("success");
      state.contentPreview = initialState.contentPreview;
      state.user_id = initialState.user_id;
      state.token = initialState.token;
    },
    [onLoadContentPreview.fulfilled.type]: (state, { payload }: PayloadAction<any>) => {
      // alert("success");
      state.contentPreview = payload.contentDetail;
      state.user_id = payload.user_id;
      state.token = payload.token;
    },
    [onLoadContentPreview.rejected.type]: (state, { error }: any) => {
      // alert(JSON.stringify(error));
    },
    [deleteContent.fulfilled.type]: (state, { payload }: PayloadAction<any>) => {
      // alert("delete success");
    },
    [deleteContent.rejected.type]: (state, { error }: any) => {
      // alert("delete failed");
      throw error;
    },
    [publishContent.fulfilled.type]: (state, { payload }: PayloadAction<any>) => {
      // alert("publish success");
    },
    [publishContent.rejected.type]: (state, { error }: any) => {
      // alert("publish failed");
      throw error;
    },
    [bulkDeleteContent.fulfilled.type]: (state, { payload }: PayloadAction<any>) => {
      // alert("bulk delete success");
    },
    [bulkDeleteContent.rejected.type]: (state, { error }: any) => {
      // alert("bulk delete failed");
      throw error;
    },
    [bulkPublishContent.fulfilled.type]: (state, { payload }: any) => {
      // alert("bulk publish success");
    },
    [bulkPublishContent.rejected.type]: (state, { error }: any) => {
      // alert("bulk publish failed");
      throw error;
    },
    [approveContent.fulfilled.type]: (state, { payload }: PayloadAction<any>) => {
      // alert("approve success");
    },
    [approveContent.rejected.type]: (state, { error }: any) => {
      // alert("approve failed");
      throw error;
    },
    [rejectContent.fulfilled.type]: (state, { payload }: PayloadAction<any>) => {
      // alert("reject success");
    },
    [rejectContent.rejected.type]: (state, { error }: any) => {
      // alert("reject failed");
      throw error;
    },

    [lockContent.fulfilled.type]: (state, { payload }: PayloadAction<any>) => {
      // alert("lock success");
    },
    [lockContent.rejected.type]: (state, { error }: any) => {
      // alert("lock failed");
      throw error;
    },
    [getContentLiveToken.rejected.type]: (state, { error }: any) => {
      // console.log(error)
    },
    [getContentLiveToken.fulfilled.type]: (state, { payload }: PayloadAction<any>) => {
      state.token = payload.token;
    },
    [getUserSetting.fulfilled.type]: (state, { payload }: PayloadAction<any>) => {
      state.page_size = payload.cms_page_size;
    },
    [setUserSetting.fulfilled.type]: (state, { payload }: PayloadAction<any>) => {
      state.page_size = payload.cms_page_size;
    },
    [searchOrgFolderItems.fulfilled.type]: (state, { payload }: PayloadAction<any>) => {
      state.folderTree = payload;
    },
    [getFolderItemById.pending.type]: (state, { payload }: PayloadAction<any>) => {
      state.parentFolderInfo = initialState.parentFolderInfo;
    },
    [getFolderItemById.fulfilled.type]: (state, { payload }: PayloadAction<any>) => {
      state.parentFolderInfo = payload;
    },
    [onLoadContentList.pending.type]: (state, { payload }: PayloadAction<any>) => {
      state.contentsList = initialState.contentsList;
      state.total = initialState.total;
      state.parentFolderInfo = initialState.parentFolderInfo;
    },
    [onLoadContentList.fulfilled.type]: (state, { payload }: PayloadAction<any>) => {
      state.myOrgId = payload.organization_id;
      if (payload.folderRes) {
        state.total = payload.folderRes.total;
        state.contentsList = payload.folderRes.list;
      }
      if (payload.pendingRes) {
        state.total = payload.pendingRes.total;
        state.contentsList = payload.pendingRes.list;
      }
      if (payload.privateRes) {
        state.total = payload.privateRes.total;
        state.contentsList = payload.privateRes.list;
      }
      if (payload.contentRes) {
        state.total = payload.contentRes.total;
        state.contentsList = payload.contentRes.list;
      }
      if (payload.badaContent) {
        state.total = payload.badaContent.total;
        state.contentsList = payload.badaContent.list;
      }
    },
    [getOrgProperty.fulfilled.type]: (state, { payload }: any) => {
      state.orgProperty = payload;
    },
    [getOrgList.fulfilled.type]: (state, { payload }: any) => {
      state.orgList = payload;
    },
    [getFoldersSharedRecords.fulfilled.type]: (state, { payload }: any) => {
      if (payload.data) {
        state.selectedOrg = payload.data[0].orgs || [];
      } else {
        state.selectedOrg = [];
      }
    },
  },
});

export const { syncHistory } = actions;
export default reducer;
