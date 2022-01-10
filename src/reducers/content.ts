import {
  ConnectionDirection,
  ConnectionPageInfo,
  OrganizationFilter,
  OrganizationSortBy,
  OrganizationSortInput,
  SortOrder,
  StringOperator,
  UuidOperator,
} from "@api/api-ko-schema.auto";
import { OrgInfoProps } from "@pages/MyContentList/OrganizationList";
import { createAsyncThunk, createSlice, PayloadAction, unwrapResult } from "@reduxjs/toolkit";
import cloneDeep from "lodash/cloneDeep";
import uniqBy from "lodash/uniqBy";
import { UseFormMethods } from "react-hook-form";
import { useHistory } from "react-router-dom";
import api, { gqlapi } from "../api";
import {
  GetMyIdDocument,
  GetMyIdQuery,
  GetMyIdQueryVariables,
  GetOrganizationsDocument,
  GetOrganizationsQuery,
  GetOrganizationsQueryVariables,
} from "../api/api-ko.auto";
import {
  ApiContentBulkOperateRequest,
  EntityContentInfoWithDetails,
  EntityCreateContentRequest,
  EntityFolderContentData,
  EntityFolderItemInfo,
  EntityOrganizationInfo,
  EntityOrganizationProperty,
  EntityOutcomeCondition,
  EntityQueryContentItem,
  EntityRegionOrganizationInfo,
  ModelPublishedOutcomeView,
  ModelSearchPublishedOutcomeResponse,
} from "../api/api.auto";
import {
  apiDevelopmentalListIds,
  apiSkillsListByIds,
  apiWaitForOrganizationOfPage,
  RecursiveFolderItem,
  recursiveListFolderItems,
} from "../api/extra";
import { Author, ContentType, FolderPartition, OutcomePublishStatus, PublishStatus, SearchContentsRequestContentType } from "../api/type";
import { LangRecordId } from "../locale/lang/type";
import { d, t } from "../locale/LocaleManager";
import { content2FileType } from "../models/ModelEntityFolderContent";
import { ProgramGroup } from "../pages/MyContentList/ProgramSearchHeader";
import { ExectSearch } from "../pages/MyContentList/SecondSearchHeader";
import { ContentListForm, ContentListFormKey, QueryCondition, SubmenuType } from "../pages/MyContentList/types";
import { actAsyncConfirm, ConfirmDialogType, unwrapConfirm } from "./confirm";
import programsHandler, {
  getDevelopmentalAndSkills,
  LinkedMockOptions,
  LinkedMockOptionsItem,
  _getLinkedMockOptions,
} from "./contentEdit/programsHandler";
import { LoadingMetaPayload } from "./middleware/loadingMiddleware";
import { actWarning } from "./notify";
import { AsyncReturnType, AsyncTrunkReturned } from "./type";

interface IContentState {
  history?: ReturnType<typeof useHistory>;
  contentDetail: Required<EntityContentInfoWithDetails>;
  mediaList: EntityQueryContentItem[];
  outcomeList: ModelPublishedOutcomeView[];
  total: number | undefined;
  contentsList: EntityFolderContentData[];
  contentPreview: EntityContentInfoWithDetails;
  mediaListTotal: number;
  OutcomesListTotal: number;
  linkedMockOptions: LinkedMockOptions;
  searchLOListOptions: LinkedMockOptions;
  outcomesFullOptions: LinkedMockOptions;
  lesson_types: LinkedMockOptionsItem[];
  visibility_settings: LinkedMockOptionsItem[];
  token: string;
  page_size: number;
  folderTree: RecursiveFolderItem[];
  parentFolderInfo: EntityFolderItemInfo;
  orgProperty: EntityOrganizationProperty;
  orgList: OrgInfoProps[];
  orgListPageInfo: ConnectionPageInfo;
  orgListTotal: number;
  vnOrgList: EntityRegionOrganizationInfo[];
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
    publish_scope: [],
    publish_status: "published",
    content_type_name: "",
    program_name: "",
    subject_name: [],
    developmental_name: [],
    skills_name: [],
    age_name: [],
    org_name: "",
    outcomes: [],
    permission: {},
    outcome_entities: [],
    created_at: 0,
    draw_activity: false,
    grade_name: [],
    latest_id: "",
    lesson_type: "",
    lesson_type_name: "",
    publish_scope_name: [],
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
  },
  searchLOListOptions: {
    program: [],
    subject: [],
    developmental: [],
    age: [],
    grade: [],
    skills: [],
  },
  outcomesFullOptions: {
    program: [],
    subject: [],
    developmental: [],
    age: [],
    grade: [],
    skills: [],
  },
  lesson_types: [],
  visibility_settings: [],
  total: undefined,
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
    publish_scope: [],
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
    publish_scope_name: [],
    source_type: "",
    lesson_type_name: "",
    creator: "",
    creator_name: "",
    is_mine: false,
    teacher_manual_batch: [],
  },
  token: "",
  page_size: 0,
  folderTree: [],
  parentFolderInfo: {},
  orgProperty: {},
  orgList: [],
  orgListPageInfo: {},
  orgListTotal: 0,
  vnOrgList: [],
  selectedOrg: [],
  myOrgId: "",
  user_id: "",
};
const UNKNOW_ERROR_LABEL: LangRecordId = "general_error_unknown";

export enum Action {
  remove = "remove",
  delete = "delete",
}

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

export enum ILinkedMockOptionsType {
  contents = "contents",
  LearningOutcomes = "learningOutcomes",
  all = "all",
}
export interface LinkedMockOptionsPayload extends LoadingMetaPayload {
  default_program_id?: string;
  default_subject_ids?: string;
  default_developmental_id?: string;
}

export const getLinkedMockOptions = _getLinkedMockOptions("content/getLinkedMockOptions");

export const getLinkedMockOptionsSkills = createAsyncThunk<LinkedMockOptions["skills"], LinkedMockOptionsPayload>(
  "content/getLinkedMockOptionsSkills",
  async ({ metaLoading, default_program_id: program_id, default_developmental_id: developmental_id }) => {
    return await api.skills.getSkill({ program_id, developmental_id });
  }
);
export interface IQueryOutcomesOptions extends LoadingMetaPayload {
  program_id?: string;
  subject_ids?: string;
  developmental_id?: string;
}
export const getOutcomesOptions = createAsyncThunk<LinkedMockOptions, IQueryOutcomesOptions>(
  "content/getOutcomesOptions",
  async ({ metaLoading, program_id, subject_ids, developmental_id }) => {
    console.log(program_id, subject_ids, developmental_id);
    const [subject = [], age, grade] = program_id ? await programsHandler.getSubjectAgeGradeByProgramId(program_id) : [[], [], []];
    const subjectIds = subject.length === 1 ? subject[0].id : subject_ids;
    const [developmental, skills = []] = program_id && subjectIds ? await getDevelopmentalAndSkills(program_id, subjectIds) : [[], []];

    return {
      subject,
      developmental,
      age,
      grade,
      skills,
    };
  }
);
export const getOutcomesFullOptions = createAsyncThunk<LinkedMockOptions, LoadingMetaPayload>(
  "content/getOutcomesFullOptions",
  async () => {
    const [developmental, skills] = await Promise.all([api.developmentals.getDevelopmental(), api.skills.getSkill()]);
    return { developmental, skills };
  }
);
export const getOutcomesOptionSkills = createAsyncThunk<LinkedMockOptions["skills"], IQueryOutcomesOptions>(
  "content/getOutcomesOptionsSkills",
  async ({ metaLoading, program_id, developmental_id }) => {
    let skills: LinkedMockOptionsItem[] = [];
    if (developmental_id) {
      skills = await api.skills.getSkill({ program_id, developmental_id });
    }
    return skills;
  }
);
export const getOutcomesOptionCategorys = createAsyncThunk<LinkedMockOptions["developmental"], IQueryOutcomesOptions>(
  "content/getOutcomesOptionCategorys",
  async ({ metaLoading, program_id, subject_ids }, { dispatch }) => {
    const developmental = await api.developmentals.getDevelopmental({ program_id, subject_ids });
    if (developmental.length === 1) {
      dispatch(getOutcomesOptionSkills({ program_id, developmental_id: developmental[0].id }));
    }
    return developmental;
  }
);

interface onLoadContentEditPayload extends LoadingMetaPayload {
  id: EntityContentInfoWithDetails["id"] | null;
  type: "assets" | "material" | "plan";
  searchMedia?: string;
  searchOutcome?: string;
  assumed?: boolean;
  isShare?: boolean;
  exactSerch?: string;
}

interface onLoadContentEditResult {
  contentDetail?: AsyncReturnType<typeof api.contents.getContentById>;
  mediaList?: AsyncReturnType<typeof api.contents.searchContents>;
  lesson_types?: LinkedMockOptionsItem[];
  visibility_settings?: LinkedMockOptionsItem[];
}
export const onLoadContentEdit = createAsyncThunk<onLoadContentEditResult, onLoadContentEditPayload>(
  "content/onLoadContentEdit",
  async ({ id, type, searchMedia, isShare }, { dispatch }) => {
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

      dispatch(
        getLinkedMockOptions({
          default_program_id: contentDetail.program,
          default_developmental_id: contentDetail.developmental && contentDetail.developmental[0],
          default_subject_ids: contentDetail.subject?.join(","),
        })
      ),
      // dispatch(getOutcomesFullOptions({})),
    ]);
    dispatch(
      getOutcomesResourceOptions({
        developmentals: contentDetail.outcome_entities?.filter((item) => item.developmental).map((item) => item.developmental || "") ?? [],
        skillIds: contentDetail.outcome_entities?.filter((item) => item.skills).map((item) => item.skills || "") ?? [],
      })
    );

    return { contentDetail, lesson_types, visibility_settings };
  }
);

interface getOutcomesResourceOptionsPayload {
  developmentals: string[]; // category,
  skillIds: string[]; // subCategory,
}
export const getOutcomesResourceOptions = createAsyncThunk<LinkedMockOptions, getOutcomesResourceOptionsPayload>(
  "content/getOutcomesResourceOptions",
  async ({ developmentals, skillIds }, { getState }) => {
    const {
      content: { outcomesFullOptions },
    } = getState() as RootState;
    const filteredDevelopmentals = developmentals.filter((item) => !outcomesFullOptions.developmental?.find((v) => v.id === item));
    const filteredSkills = skillIds.filter((item) => !outcomesFullOptions.skills?.find((v) => v.id === item));

    const developmentalsResult = await apiDevelopmentalListIds(filteredDevelopmentals);

    const skillsResult = await apiSkillsListByIds(filteredSkills);
    return {
      developmental: Object.values(developmentalsResult.data),
      skills: Object.values(skillsResult.data),
    };
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
  async (query, { dispatch }) => {
    const { name, publish_status, author, content_type, page, program_group, order_by, path, exect_search, page_size } = query;
    const nameValue = exect_search === ExectSearch.all ? name : "";
    const contentNameValue = exect_search === ExectSearch.name ? name : "";
    const isExectSearch = exect_search === ExectSearch.name;
    const parent_id = path?.split("/").pop();
    if (parent_id && page === 1) await dispatch(getFolderItemById(parent_id));
    const organization_id = (await apiWaitForOrganizationOfPage()) as string;
    const submenu = content_type?.split(",").includes(ContentType.assets.toString())
      ? SubmenuType.assets
      : publish_status === PublishStatus.pending && author === Author.self
      ? SubmenuType.wfa
      : publish_status === PublishStatus.archive
      ? SubmenuType.archived
      : publish_status;
    const params = {
      name: nameValue,
      content_name: contentNameValue,
      publish_status,
      submenu,
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
      params.submenu = program_group === ProgramGroup.moreFeaturedContent ? SubmenuType.moreFeatured : SubmenuType.badanamu;
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
export const searchPublishedLearningOutcomes = createAsyncThunk<
  ModelSearchPublishedOutcomeResponse,
  { exactSerch?: string } & EntityOutcomeCondition & LoadingMetaPayload
>(
  "content/searchPublishedLearningOutcomes",
  async ({ metaLoading, exactSerch = "search_key", search_key, order_by, assumed, page, ...query }, { dispatch }) => {
    const params = {
      publish_status: OutcomePublishStatus.published,
      page_size: 10,
      assumed,
      page,
      order_by: order_by || "name",
      [exactSerch!]: search_key,
      ...query,
    };
    const { list, total } = await api.publishedLearningOutcomes.searchPublishedLearningOutcomes(params);
    await dispatch(
      getOutcomesResourceOptions({
        developmentals: list?.reduce((arr, item) => arr.concat(item.category_ids || []) || "", [] as string[]) ?? [],
        skillIds: list?.reduce((arr, item) => arr.concat(item.sub_category_ids || []) || "", [] as string[]) ?? [],
      })
    );
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
// contentEdit搜索Authcontentlist
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
    const {
      data: { myUser },
    } = await gqlapi.query<GetMyIdQuery, GetMyIdQueryVariables>({
      query: GetMyIdDocument,
    });
    const user_id = myUser?.node?.id || "";
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
  return api.contents.publishContent(id, { scope: [] });
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
  contents?: EntityFolderContentData[];
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

export enum Region {
  vn = "vn",
  global = "global",
}

type IQueryGetOrgListResult = AsyncReturnType<typeof api.organizationsRegion.getOrganizationByHeadquarterForDetails>["orgs"];
export function getOrgsFilter(searchValue: string, orgs: EntityRegionOrganizationInfo[] = []) {
  let filter: OrganizationFilter = {
    AND: [
      { status: { operator: StringOperator.Eq, value: "active" } },
      {
        OR: [
          { ownerUserEmail: { operator: StringOperator.Contains, value: searchValue, caseInsensitive: true } },
          { name: { operator: StringOperator.Contains, value: searchValue, caseInsensitive: true } },
        ],
      },
    ],
  };
  if (orgs.length) {
    const idFilter: OrganizationFilter = { OR: orgs.map((item) => ({ id: { operator: UuidOperator.Eq, value: item.organization_id } })) };
    filter = { AND: filter.AND?.concat([idFilter]) };
  }
  return filter;
}
interface IGetOrgListResponse {
  orgs: IQueryGetOrgListResult;
  orgListPageInfo: ConnectionPageInfo;
  orgListTotal: number;
}
type IGetOrgListParams = Omit<GetOrganizationsQueryVariables, "filter"> &
  IQueryGetFoldersSharedRecordsParams &
  LoadingMetaPayload & {
    searchValue: string;
    orgs?: EntityRegionOrganizationInfo[];
  };

export const getOrgList = createAsyncThunk<IGetOrgListResponse, IGetOrgListParams>(
  "content/getOrgList",
  async ({ metaLoading, searchValue, orgs, ...restorganizationQueryVariables }) => {
    const filter = getOrgsFilter(searchValue, orgs);
    const { data } = await gqlapi.query<GetOrganizationsQuery, GetOrganizationsQueryVariables>({
      query: GetOrganizationsDocument,
      variables: { ...restorganizationQueryVariables, filter },
    });
    const orgList = data.organizationsConnection?.edges?.map((item) => ({
      organization_id: item?.node?.id,
      organization_name: item?.node?.name,
      email: item?.node?.owners && item?.node?.owners.length > 0 ? item?.node?.owners[0]?.email : "",
    })) as IQueryGetOrgListResult;
    const orgListPageInfo = data.organizationsConnection?.pageInfo as ConnectionPageInfo;
    const orgListTotal = data.organizationsConnection?.totalCount || (0 as number);
    return { orgs: orgList, orgListPageInfo, orgListTotal };
  }
);

export const getVnOrgList = createAsyncThunk<IQueryGetOrgListResult, LoadingMetaPayload>("content/getVnOrgList", async () => {
  const { orgs } = await api.organizationsRegion.getOrganizationByHeadquarterForDetails();
  return orgs;
});
export const onloadShareOrgList = createAsyncThunk<void, IQueryGetFoldersSharedRecordsParams & LoadingMetaPayload, { state: RootState }>(
  "content/onloadShareOrgList",
  async ({ folder_ids }, { getState, dispatch }) => {
    const {
      content: { orgProperty },
    } = getState();
    const sort: OrganizationSortInput = {
      field: [OrganizationSortBy.Name],
      order: SortOrder.Asc,
    };
    if (orgProperty.region && orgProperty.region === Region.vn) {
      const { payload } = (await dispatch(getVnOrgList({}))) as PayloadAction<AsyncTrunkReturned<typeof getVnOrgList>>;
      await dispatch(getOrgList({ sort, searchValue: "", direction: ConnectionDirection.Forward, count: 10, cursor: "", orgs: payload }));
    } else {
      await dispatch(getOrgList({ sort, searchValue: "", direction: ConnectionDirection.Forward, count: 10, cursor: "" }));
    }
    await dispatch(getFoldersSharedRecords({ folder_ids }));
  }
);

type IQueryShareFoldersParams = {
  shareFolder: EntityFolderContentData | undefined;
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
    [getLinkedMockOptions.fulfilled.type]: (state, { payload }: PayloadAction<AsyncTrunkReturned<typeof getLinkedMockOptions>>) => {
      state.linkedMockOptions = payload;
      state.outcomesFullOptions.program = payload.program;
      state.searchLOListOptions.program = payload.program;
    },
    [getOutcomesOptions.fulfilled.type]: (state, { payload }: PayloadAction<AsyncTrunkReturned<typeof getOutcomesOptions>>) => {
      state.searchLOListOptions = payload;
      state.searchLOListOptions.program = state.linkedMockOptions.program;
    },
    [getLinkedMockOptions.rejected.type]: (state, { error }: any) => {
      // alert(JSON.stringify(error));
    },
    [getLinkedMockOptionsSkills.fulfilled.type]: (
      state,
      { payload }: PayloadAction<AsyncTrunkReturned<typeof getLinkedMockOptionsSkills>>
    ) => {
      // alert("success");
      state.linkedMockOptions.skills = payload;
    },
    [getOutcomesFullOptions.fulfilled.type]: (state, { payload }: PayloadAction<AsyncTrunkReturned<typeof getOutcomesFullOptions>>) => {
      state.outcomesFullOptions = cloneDeep(payload);
      state.searchLOListOptions = cloneDeep(payload);
      state.outcomesFullOptions.program = cloneDeep(state.linkedMockOptions.program);
      state.searchLOListOptions.program = cloneDeep(state.linkedMockOptions.program);
    },
    [getOutcomesResourceOptions.fulfilled.type]: (state, { payload }: PayloadAction<AsyncTrunkReturned<typeof getOutcomesFullOptions>>) => {
      const developmental = uniqBy([...(state.outcomesFullOptions.developmental || []), ...(payload.developmental || [])], "id");
      const skills = uniqBy([...(state.outcomesFullOptions.skills || []), ...(payload.skills || [])], "id");
      state.outcomesFullOptions = {
        ...state.outcomesFullOptions,
        developmental,
        skills,
      };
    },
    [getOutcomesOptionSkills.fulfilled.type]: (state, { payload }: PayloadAction<AsyncTrunkReturned<typeof getOutcomesOptionSkills>>) => {
      state.searchLOListOptions.skills = payload;
    },
    [getOutcomesOptionCategorys.fulfilled.type]: (
      state,
      { payload }: PayloadAction<AsyncTrunkReturned<typeof getOutcomesOptionCategorys>>
    ) => {
      state.searchLOListOptions.developmental = payload;
    },
    [getLinkedMockOptionsSkills.rejected.type]: (state, { error }: any) => {
      // alert(JSON.stringify(error));
    },
    [searchPublishedLearningOutcomes.fulfilled.type]: (
      state,
      { payload }: PayloadAction<AsyncTrunkReturned<typeof searchPublishedLearningOutcomes>>
    ) => {
      state.outcomeList = payload.list || [];
      state.OutcomesListTotal = payload.total || 0;
    },
    [searchContentLists.fulfilled.type]: (state, { payload }: PayloadAction<AsyncTrunkReturned<typeof searchContentLists>>) => {
      state.mediaList = payload.list || [];
      state.mediaListTotal = payload.total || 0;
    },
    [searchAuthContentLists.fulfilled.type]: (state, { payload }: PayloadAction<AsyncTrunkReturned<typeof searchAuthContentLists>>) => {
      state.mediaList = payload.list || [];
      state.mediaListTotal = payload.total || 0;
    },
    // contentList页面
    [contentLists.pending.type]: (state, { payload }: PayloadAction<AsyncTrunkReturned<typeof contentLists>>) => {
      state.contentsList = initialState.contentsList;
      state.total = initialState.total;
    },
    [contentLists.fulfilled.type]: (state, { payload }: PayloadAction<AsyncTrunkReturned<typeof contentLists>>) => {
      state.contentsList = payload.list || [];
      state.mediaList = payload.list || [];
      state.total = payload.total;
    },
    [contentLists.rejected.type]: (state, { error }: any) => {},

    [onLoadContentPreview.pending.type]: (state, { payload }: PayloadAction<AsyncTrunkReturned<typeof onLoadContentPreview>>) => {
      // alert("success");
      state.contentPreview = initialState.contentPreview;
      state.user_id = initialState.user_id;
      state.token = initialState.token;
    },
    [onLoadContentPreview.fulfilled.type]: (state, { payload }: PayloadAction<AsyncTrunkReturned<typeof onLoadContentPreview>>) => {
      // alert("success");
      state.contentPreview = payload.contentDetail;
      state.user_id = payload.user_id || "";
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
    [getUserSetting.fulfilled.type]: (state, { payload }: PayloadAction<AsyncTrunkReturned<typeof getUserSetting>>) => {
      state.page_size = payload?.cms_page_size || initialState.page_size;
    },
    [setUserSetting.fulfilled.type]: (state, { payload }: PayloadAction<AsyncTrunkReturned<typeof getUserSetting>>) => {
      state.page_size = payload?.cms_page_size;
    },
    [searchOrgFolderItems.fulfilled.type]: (state, { payload }: PayloadAction<AsyncTrunkReturned<typeof searchOrgFolderItems>>) => {
      state.folderTree = payload;
    },
    [getFolderItemById.pending.type]: (state, { payload }: PayloadAction<AsyncTrunkReturned<typeof getOutcomesFullOptions>>) => {
      state.parentFolderInfo = initialState.parentFolderInfo;
    },
    [getFolderItemById.fulfilled.type]: (state, { payload }: PayloadAction<AsyncTrunkReturned<typeof getFolderItemById>>) => {
      state.parentFolderInfo = payload;
    },
    [onLoadContentList.pending.type]: (state, { payload }: PayloadAction<AsyncTrunkReturned<typeof getOutcomesFullOptions>>) => {
      state.contentsList = initialState.contentsList;
      state.total = initialState.total;
      state.parentFolderInfo = initialState.parentFolderInfo;
    },
    [onLoadContentList.fulfilled.type]: (state, { payload }: PayloadAction<AsyncTrunkReturned<typeof onLoadContentList>>) => {
      state.myOrgId = payload.organization_id;
      if (payload.folderRes) {
        state.total = payload.folderRes.total;
        state.contentsList = payload.folderRes.list || [];
      }
      if (payload.pendingRes) {
        state.total = payload.pendingRes.total;
        state.contentsList = payload.pendingRes.list || [];
      }
      if (payload.privateRes) {
        state.total = payload.privateRes.total;
        state.contentsList = payload.privateRes.list || [];
      }
      if (payload.contentRes) {
        state.total = payload.contentRes.total;
        state.contentsList = payload.contentRes.list || [];
      }
      if (payload.badaContent) {
        state.total = payload.badaContent.total;
        state.contentsList = payload.badaContent.list || [];
      }
    },
    [getOrgProperty.fulfilled.type]: (state, { payload }: PayloadAction<AsyncTrunkReturned<typeof getOrgProperty>>) => {
      state.orgProperty = payload;
    },
    [getOrgList.fulfilled.type]: (state, { payload }: PayloadAction<AsyncTrunkReturned<typeof getOrgList>>) => {
      state.orgList = (payload.orgs as OrgInfoProps[]) || [];
      state.orgListPageInfo = payload.orgListPageInfo;
      state.orgListTotal = payload.orgListTotal;
    },

    [getVnOrgList.fulfilled.type]: (state, { payload }: PayloadAction<AsyncTrunkReturned<typeof getVnOrgList>>) => {
      state.vnOrgList = (payload as OrgInfoProps[]) || [];
    },
    [getFoldersSharedRecords.fulfilled.type]: (state, { payload }: PayloadAction<AsyncTrunkReturned<typeof getFoldersSharedRecords>>) => {
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
