import { gql } from "@apollo/client";
import { LinkedMockOptionsItem } from "@reducers/contentEdit/programsHandler";
import { FileLike } from "@rpldy/shared";
import Cookies from "js-cookie";
import api, { gqlapi } from ".";
// import requireContentType from "../../scripts/contentType.macro";
import { LangRecordId } from "../locale/lang/type";
import { ICacheData } from "../services/permissionCahceService";
import { UsersConnectionResponse, UuidFilter } from "./api-ko-schema.auto";
import {
  ClassesBySchoolIdDocument,
  ClassesBySchoolIdQuery,
  ClassesBySchoolIdQueryVariables,
  ClassesListDocument,
  ClassesListQuery,
  ClassesListQueryVariables,
  ClassesTeachersConnectionDocument,
  ClassesTeachersConnectionQuery,
  ClassesTeachersConnectionQueryVariables,
  ClassNodeDocument,
  ClassNodeQuery,
  ClassNodeQueryVariables,
  GetClassesTeachingDocument,
  GetClassesTeachingQuery,
  GetClassesTeachingQueryVariables,
  GetSchoolMembershipsDocument,
  GetSchoolMembershipsQuery,
  GetSchoolMembershipsQueryVariables,
  SchoolsClassesDocument,
  SchoolsClassesQuery,
  SchoolsClassesQueryVariables,
} from "./api-ko.auto";
import { EntityFolderItemInfo } from "./api.auto";
import { apiEmitter, ApiErrorEventData, ApiEvent } from "./emitter";

// 每个接口都有塞给后端的参数 以及前端 url 上的参数名
export const ORG_ID_KEY = "org_id";
export const LOCALE_KEY = "locale";
export const PERMISSION_KEY = "perm";

export const apiGetMockOptions = () =>
  fetch("https://launch.kidsloop.cn/static/mock-korea-data/select-options.json").then((res) => {
    return res.json();
  });
export interface MockOptionsItem {
  id?: string;
  name?: string;
}

export interface MockOptionsItemTeacherAndClass {
  teacher_id: string;
  class_ids: string[];
}

export interface MockOptionsOptionsDevelopmentalItem extends MockOptionsItem {
  skills: MockOptionsItem[];
}

export interface MockOptionsOptionsItem {
  program: MockOptionsItem;
  subject: MockOptionsItem[];
  developmental: MockOptionsOptionsDevelopmentalItem[];
  age: MockOptionsItem[];
  grade: MockOptionsItem[];
}

export interface MockOptions {
  options: MockOptionsOptionsItem[];
  visibility_settings: MockOptionsItem[];
  lesson_types: MockOptionsItem[];
  classes: MockOptionsItem[];
  class_types: MockOptionsItem[];
  organizations: MockOptionsItem[];
  teachers: MockOptionsItem[];
  students: MockOptionsItem[];
  users: MockOptionsItem[];
  teacher_class_relationship: MockOptionsItemTeacherAndClass[];
}
export interface ValidationStatus {
  key: string;
  validationComplete: boolean;
  valid?: boolean; // undefined when still validating
  totalPages?: number; // undefined when the PDF document is completely invalid or corrupted and no page data is available
  pagesValidated?: number; // undefined when totalPages is undefined
}

function getWebsocketApi() {
  if (!process.env.REACT_APP_KO_BASE_API) return "";
  const url = decodeURIComponent(process.env.REACT_APP_KO_BASE_API);
  if (!url.includes("https")) return "";
  return url.replace("https", "wss");
}
const DOMAIN = getWebsocketApi();

export const apiResourcePathById = (resource_id?: string) => {
  if (!resource_id) return;
  return `${process.env.REACT_APP_BASE_API}/contents_resources/${resource_id}`;
};

export const apiWebSocketValidatePDFById = (source: string, onChangePercentage?: (percentage: number) => any) => {
  return new Promise((resolve: (data: ValidationStatus) => any, reject: () => any) => {
    if (!DOMAIN) {
      reject();
    }
    const [prefix, id] = source.split("-");
    const ws = new WebSocket(`${DOMAIN}/pdf/v2/${prefix}/${id}/validate`);
    ws.addEventListener("open", async () => {
      ws.send(id);
    });
    ws.addEventListener("message", (messageEvent) => {
      const data = JSON.parse(messageEvent.data);
      const percentage = Math.floor((data.pagesValidated / data.totalPages) * 100);
      onChangePercentage?.(percentage);
      if (data.validationComplete) {
        resolve(data);
        ws.close();
      }
    });
    ws.addEventListener("error", reject);
  });
};
export const apiWebSocketValidatePDF = (file: FileLike, onChangePercentage?: (percentage: number) => any) => {
  return new Promise((resolve: (data: ValidationStatus) => any, reject: () => any) => {
    if (!DOMAIN) {
      reject();
    }
    const ws = new WebSocket(`${DOMAIN}/pdf/v2/validate`);
    ws.binaryType = "arraybuffer";
    ws.addEventListener("open", async () => {
      const files = file as unknown as Blob;
      const data = files.arrayBuffer();
      ws.send(await data);
    });
    ws.addEventListener("message", (messageEvent) => {
      const data = JSON.parse(messageEvent.data);
      const percentage = Math.floor((data.pagesValidated / data.totalPages) * 100);
      onChangePercentage?.(percentage);
      if (data.validationComplete) {
        resolve(data);
        ws.close();
      }
    });
    ws.addEventListener("error", reject);
  });
};

export const apiGenH5pResourceByToken = (token: string) => {
  return `${process.env.REACT_APP_H5P_API}/h5p/token/${token}`;
};

export const apiLivePath = (token: string) => {
  return `${process.env.REACT_APP_LIVE_LINK}?token=${token}`;
};

export const apiFetchClassByTeacher = (mockOptions: MockOptions, teacher_id: string) => {
  if (mockOptions.teacher_class_relationship.length) {
    const class_ids = mockOptions.teacher_class_relationship.filter(
      (item: MockOptionsItemTeacherAndClass) => item.teacher_id === teacher_id
    )[0].class_ids;
    return mockOptions.classes.filter((item: MockOptionsItem) => class_ids.filter((item1: string) => item.id === item1).length > 0);
  }
};

export const apiDownloadPageUrl = (href?: string, fileName?: string) => {
  if (!href) return;
  const { origin } = new URL(href);
  const downloadUrl = `${origin}/download.html?download=${encodeURIComponent(fileName ?? "")}&href=${encodeURIComponent(href)}`;
  return downloadUrl;
};

export const apiOrganizationOfPage = () => {
  const searchParams = new URLSearchParams(window.location.search);
  return searchParams.get(ORG_ID_KEY);
};

export const getDocumentUrl = (router: string) => {
  const { origin, search } = document.location;
  return `${origin}/${search}#/${router}`;
};

export const apiWaitForOrganizationOfPage = (): Promise<string> => {
  const errorLabel: LangRecordId = "general_error_no_organization";
  // const infoLabel: LangRecordId = "general_info_waiting_orgnization_info";
  const TIME_OUT = 3600 * 1000;
  // const INFO_INTERVAL = 10 * 1000;
  return new Promise((resolve, reject) => {
    const startTime = Date.now();
    const orgId = apiOrganizationOfPage();
    if (orgId) return resolve(orgId);
    // const infoTimer = setInterval(() => {
    //   apiEmitter.emit<ApiErrorEventData>(ApiEvent.Info, { label: infoLabel });
    // }, INFO_INTERVAL)
    const timer = setInterval(() => {
      if (Date.now() - startTime > TIME_OUT) {
        clearInterval(timer);
        // clearInterval(infoTimer);
        apiEmitter.emit<ApiErrorEventData>(ApiEvent.ResponseError, { label: errorLabel });
        return reject({ label: errorLabel });
      }
      const orgId = apiOrganizationOfPage();
      if (!orgId) return;
      clearInterval(timer);
      return resolve(orgId);
    }, 100);
  });
};

type recursiveListFolderItemsProps = NonNullable<Parameters<typeof api.folders.searchOrgFolderItems>[0]>;
export interface RecursiveFolderItem extends EntityFolderItemInfo {
  next: RecursiveFolderItem[];
}
export const recursiveListFolderItems = async ({
  path,
  partition,
  item_type,
}: recursiveListFolderItemsProps): Promise<RecursiveFolderItem[]> => {
  const { items: rootFolders } = await api.folders.searchOrgFolderItems({ path, item_type, partition });
  if (!rootFolders) return [];
  function resolvePath(base: string, path: string): string {
    if (base.slice(-1)[0] === "/") return `${base}${path}`;
    return `${base}/${path}`;
  }
  async function forEachFolder(folders: EntityFolderItemInfo[]): Promise<RecursiveFolderItem[]> {
    return Promise.all(
      folders.map(async (folder) => {
        const { item_type, dir_path, id } = folder;
        const path = resolvePath(dir_path as string, id as string);
        const { items } = await api.folders.searchOrgFolderItems({ path, item_type, partition });
        if (!items) return { ...folder, next: [] };
        const next = await forEachFolder(items);
        return { ...folder, next };
      })
    );
  }
  return forEachFolder(rootFolders);
};

export const apiAddOrganizationToPageUrl = (id: string) => {
  const url = new URL(window.location.href);
  url.searchParams.append(ORG_ID_KEY, id);
  // sessionStorage.clear();
  window.history.replaceState(null, document.title, url.toString());
};

export const apiLocaleInCookie = () => {
  return Cookies.get(LOCALE_KEY)?.slice(0, 2);
};

export const subscribeLocaleInCookie = (handler: { (locale: string): any }) => {
  let cache = apiLocaleInCookie();
  setInterval(() => {
    const current = apiLocaleInCookie();
    if (cache === current) return;
    cache = current;
    if (current) handler(current);
  }, 1000);
};

export function domainSwitch() {
  return window.location.host.includes("kidsloop.live");
}

export function apiIsEnableReport() {
  return process.env.REACT_APP_ENABLE_REPORT === "1";
}
export function getIsEnableNewGql() {
  return process.env.REACT_APP_USE_LEGACY_GQL === "0";
}
export const enableNewGql = getIsEnableNewGql();

export async function apiSkillsListByIds(skillIds: string[]) {
  const skillsQuery = skillIds
    .map(
      (id, index) => `
    skill${index}: subcategoryNode(id: "${id}") {
      id
      name
      status
    }
    `
    )
    .join("");
  const skillsResult = skillIds.length
    ? await gqlapi.query<{ [key: string]: LinkedMockOptionsItem }, {}>({
        query: gql`
    query skillsListByIds {
      ${skillsQuery}
    } 
    `,
      })
    : { data: {} };
  return skillsResult;
}

export async function apiDevelopmentalListIds(developmental: string[]) {
  const developmentalQuery = developmental
    .map(
      (id, index) => `
    developmental${index}: categoryNode(id: "${id}") {
      id
      name
      status
    }
    `
    )
    .join("");
  const developmentalResult = developmental.length
    ? await gqlapi.query<{ [key: string]: LinkedMockOptionsItem }, {}>({
        query: gql`
    query developmentalListByIds {
      ${developmentalQuery}
    } 
    `,
      })
    : { data: {} };
  return developmentalResult;
}
export interface IApiGetPartPermissionResp {
  error: boolean;
  data: ICacheData;
}

export async function apiGetPartPermission(permissions: string[]): Promise<IApiGetPartPermissionResp> {
  const organization_id = ((await apiWaitForOrganizationOfPage()) as string) || "";

  if (enableNewGql) {
    const permissionIds = permissions
      .map((item) => {
        return `"${item}"`;
      })
      .join(",");
    return await gqlapi
      .query({
        query: gql`
        query{
          myUser{
            hasPermissionsInOrganization(
              organizationId: "${organization_id}",
              permissionIds: [
                ${permissionIds}
              ]
            ){
              permissionId
              allowed
            }
          }
        }
      `,
      })
      .then((resp) => {
        return {
          error: (resp.errors || []).length > 0 || resp.data?.myUser?.hasPermissionsInOrganization === null,
          data: (resp.data?.myUser?.hasPermissionsInOrganization || []).reduce((prev, cur) => {
            prev[cur.permissionId] = cur.allowed;
            return prev;
          }, {}),
        };
      });
  } else {
    const fragmentStr = permissions
      .map((permission) => {
        return `${permission}: checkAllowed(permission_name: "${permission}")`;
      })
      .join(",");
    return await gqlapi
      .query({
        query: gql`
      query{
        meMembership: me{
          membership(organization_id: "${organization_id}"){
            ${fragmentStr}
          }
        }
      }
    `,
      })
      .then((resp) => {
        return {
          error: (resp.errors || []).length > 0 || resp.data?.meMembership?.membership === null,
          data: resp.data?.meMembership?.membership || {},
        };
      });
  }
}

const idToNameMap = new Map<string, string>();

export async function apiGetUserNameByUserId(userIds: string[]): Promise<Map<string, string>> {
  const fragmentStr = userIds
    .filter((id) => !idToNameMap.has(id))
    .map((userId, index) => {
      return enableNewGql
        ? `
          user_${index}: userNode(id: "${userId}"){
            id,
            givenName 
            familyName
          }
        `
        : `
          user_${index}: user(user_id: "${userId}"){
            user_id,
            given_name
            family_name
          }
        `;
    })
    .join(",");
  if (!fragmentStr) return idToNameMap;
  try {
    const userQuery = await gqlapi.query({
      query: gql`
        query userNameByUserIdQuery{
          ${fragmentStr}
        },
        
      `,
    });
    for (const item in userQuery.data || {}) {
      const user = userQuery.data[item];
      if (user) {
        enableNewGql
          ? idToNameMap.set(user.id, `${user.givenName} ${user.familyName}`)
          : idToNameMap.set(user.user_id, `${user.given_name} ${user.family_name}`);
      }
    }
  } catch (e) {
    console.log(e);
  }
  return idToNameMap;
}

export async function getUserIdAndOrgId() {
  const organizationId = ((await apiWaitForOrganizationOfPage()) as string) || "";

  return organizationId;
}

export const refreshToken = async () => {
  const resp = await fetch(`${process.env.REACT_APP_AUTH_API}/refresh`, { credentials: "include" })
    .then((resp) => resp.json())
    .then((data) => data);
  return resp;
};

export interface GetSchoolMembershipProps {
  userId?: UuidFilter;
  organizationId?: UuidFilter;
  cursor?: string;
}
export interface SchoolIdProps {
  school_id?: string;
  status?: string;
}
export const recursiveGetSchoolMemberships = async (param: GetSchoolMembershipProps, arr: SchoolIdProps[]): Promise<SchoolIdProps[]> => {
  let schoolIds: SchoolIdProps[] = [...arr];
  const {
    data: { schoolsConnection },
  } = await gqlapi.query<GetSchoolMembershipsQuery, GetSchoolMembershipsQueryVariables>({
    query: GetSchoolMembershipsDocument,
    variables: {
      ...param,
    },
  });
  const res: SchoolIdProps[] =
    schoolsConnection?.edges?.map((item) => {
      return {
        school_id: item?.node?.id,
        status: item?.node?.status,
      };
    }) || [];
  schoolIds = [...schoolIds, ...res];
  if (schoolsConnection?.pageInfo?.hasNextPage) {
    const cursor = schoolsConnection.pageInfo.endCursor as string;
    recursiveGetSchoolMemberships({ ...param, cursor }, [...schoolIds]);
  }
  return new Promise((resolve) => {
    resolve(schoolIds);
  });
};

export interface ClassesTeachingProps {
  class_id?: string;
  status?: string;
}
export interface ClassTeachingFilter {
  organizationId: UuidFilter;
  cursor: string;
}
export const recursiveGetClassTeaching = async (
  param: ClassTeachingFilter,
  arr: ClassesTeachingProps[]
): Promise<ClassesTeachingProps[]> => {
  let classes: ClassesTeachingProps[] = [...arr];

  const {
    data: { myUser },
  } = await gqlapi.query<GetClassesTeachingQuery, GetClassesTeachingQueryVariables>({
    query: GetClassesTeachingDocument,
    variables: {
      ...param,
    },
  });
  const res =
    myUser?.node?.classesTeachingConnection?.edges?.map((item) => {
      return {
        class_id: item?.node?.id,
        status: item?.node?.status,
      };
    }) || [];
  classes = [...classes, ...res];
  if (myUser?.node?.classesTeachingConnection?.pageInfo?.hasNextPage) {
    const cursor = myUser?.node?.classesTeachingConnection?.pageInfo?.endCursor as string;
    recursiveGetClassTeaching({ ...param, cursor }, [...classes]);
  }
  return new Promise((resolve) => {
    resolve(classes);
  });
};

export interface IClassTeachers {
  class_id: string;
  class_name: string;
  teachers?: ITeacher[];
  schools?: ISchool[];
}
interface ISchool {
  school_id: string;
  school_name: string;
}
interface ITeacher {
  user_id: string;
  user_name?: string;
}

export const recursiveGetClassTeachers = async (
  variables: ClassesTeachersConnectionQueryVariables,
  arr: IClassTeachers[]
): Promise<IClassTeachers[]> => {
  let classes: IClassTeachers[] = [...arr];

  const {
    data: { classesConnection },
  } = await gqlapi.query<ClassesTeachersConnectionQuery, ClassesTeachersConnectionQueryVariables>({
    query: ClassesTeachersConnectionDocument,
    variables: { ...variables },
  });

  let classTeachers: IClassTeachers[] = [];
  for (const index in classesConnection?.edges) {
    const i = Number(index);
    let teachers: ITeacher[] = [];
    const haveNextPage = classesConnection?.edges[i]?.node?.teachersConnection?.pageInfo?.hasNextPage;
    const teacherCursor = classesConnection?.edges[i]?.node?.teachersConnection?.pageInfo?.endCursor || "";
    let teacherNodeEdgs = classesConnection?.edges[i]?.node?.teachersConnection?.edges || [];
    const id = classesConnection?.edges[i]?.node?.id;
    const name = classesConnection?.edges[i]?.node?.name;
    if (haveNextPage && id) {
      teacherNodeEdgs = await recursiveGetClassNodeTeachers(id, teacherCursor, [...teacherNodeEdgs]);
    }
    teacherNodeEdgs?.forEach((teacherNode: any) => {
      const teacher: ITeacher = {
        user_id: teacherNode?.node?.id + "",
        user_name: teacherNode?.node?.givenName + " " + teacherNode?.node?.familyName,
      };
      teachers = teachers.concat([teacher]);
    });
    classTeachers = classTeachers.concat([{ class_id: id ?? "", class_name: name ?? "", teachers }]);
  }
  classes = [...classes, ...classTeachers];

  if (classesConnection?.pageInfo?.hasNextPage) {
    const cursor = classesConnection?.pageInfo?.endCursor as string;
    return recursiveGetClassTeachers({ ...variables, cursor }, [...classes]);
  } else {
    return new Promise((resolve) => {
      resolve(classes);
    });
  }
};

export const recursiveGetClassNodeTeachers = async (
  id: string,
  teacherCursor: string,
  arr: NonNullable<UsersConnectionResponse["edges"]>
): Promise<NonNullable<UsersConnectionResponse["edges"]>> => {
  let teacherNodeEdgs: NonNullable<UsersConnectionResponse["edges"]> = [...arr];
  const {
    data: { classNode },
  } = await gqlapi.query<ClassNodeQuery, ClassNodeQueryVariables>({
    query: ClassNodeDocument,
    variables: { classId: id, teacherCursor },
  });
  teacherNodeEdgs = teacherNodeEdgs.concat(classNode?.teachersConnection?.edges || []);

  if (classNode?.teachersConnection?.pageInfo?.hasNextPage) {
    teacherCursor = classNode?.teachersConnection?.pageInfo?.endCursor as string;
    return recursiveGetClassNodeTeachers(id, teacherCursor, [...teacherNodeEdgs]);
  } else {
    return new Promise((resolve) => {
      resolve(teacherNodeEdgs);
    });
  }
};

export interface SchoolClassesNode {
  school_id: string;
  school_name?: string;
  classes: UserClass[];
}
export const recursiveGetSchoolsClasses = async (
  variables: SchoolsClassesQueryVariables,
  arr: SchoolClassesNode[]
): Promise<SchoolClassesNode[]> => {
  let schools: SchoolClassesNode[] = [...arr];

  const {
    data: { schoolsConnection },
  } = await gqlapi.query<SchoolsClassesQuery, SchoolsClassesQueryVariables>({
    query: SchoolsClassesDocument,
    variables: { ...variables },
  });

  let schoolClasses: SchoolClassesNode[] = [];
  for (const index in schoolsConnection?.edges) {
    const i = Number(index);
    const haveNextPage = schoolsConnection?.edges[i]?.node?.classesConnection?.pageInfo?.hasNextPage;
    const cursor = schoolsConnection?.edges[i]?.node?.classesConnection?.pageInfo?.endCursor || "";
    let classes =
      schoolsConnection?.edges[i]?.node?.classesConnection?.edges?.map(
        (node) => ({ class_id: node?.node?.id, class_name: node?.node?.name } as UserClass)
      ) || [];
    const schoolId = schoolsConnection?.edges[i]?.node?.id;
    const school_name = schoolsConnection?.edges[i]?.node?.name;
    if (haveNextPage && schoolId) {
      const classvar: ClassesBySchoolIdQueryVariables = {
        filter: {
          // organizationId: variables.filter?.organizationId,
          // schoolId: { value: schoolNode.node.id, operator: UuidExclusiveOperator.Eq },
        },
        schoolId: schoolId,
        cursor,
      };
      classes = await recursiveGetClasses({ ...classvar }, [...classes]);
    }
    schoolClasses = schoolClasses.concat([{ school_id: schoolId || "", school_name, classes }]);
  }

  schools = [...schools, ...schoolClasses];

  if (schoolsConnection?.pageInfo?.hasNextPage) {
    const cursor = schoolsConnection?.pageInfo?.endCursor as string;
    return recursiveGetSchoolsClasses({ ...variables, cursor }, [...schools]);
  } else {
    return new Promise((resolve) => {
      resolve(schools);
    });
  }
};

export interface UserClass {
  class_id: string;
  class_name?: string;
}
export const recursiveGetClassList = async (variables: ClassesListQueryVariables, arr: UserClass[]): Promise<UserClass[]> => {
  let classes: UserClass[] = [...arr];
  const {
    data: { classesConnection },
  } = await gqlapi.query<ClassesListQuery, ClassesListQueryVariables>({
    query: ClassesListDocument,
    variables,
  });
  classes = classes.concat(
    classesConnection?.edges?.map((node) => ({ class_id: node?.node?.id, class_name: node?.node?.name } as UserClass)) || []
  );

  if (classesConnection?.pageInfo?.hasNextPage) {
    const cursor = classesConnection?.pageInfo?.endCursor as string;
    return recursiveGetClassList({ ...variables, cursor }, [...classes]);
  } else {
    return new Promise((resolve) => {
      resolve(classes);
    });
  }
};
export const recursiveGetClasses = async (variables: ClassesBySchoolIdQueryVariables, arr: UserClass[]): Promise<UserClass[]> => {
  let classes: UserClass[] = [...arr];
  const {
    data: { schoolNode },
  } = await gqlapi.query<ClassesBySchoolIdQuery, ClassesBySchoolIdQueryVariables>({
    query: ClassesBySchoolIdDocument,
    variables,
  });

  classes = classes.concat(
    schoolNode?.classesConnection?.edges?.map((node) => ({ class_id: node?.node?.id, class_name: node?.node?.name } as UserClass)) || []
  );

  if (schoolNode?.classesConnection?.pageInfo?.hasNextPage) {
    const cursor = schoolNode?.classesConnection?.pageInfo?.endCursor as string;
    return recursiveGetClasses({ ...variables, cursor }, [...classes]);
  } else {
    return new Promise((resolve) => {
      resolve(classes);
    });
  }
};
