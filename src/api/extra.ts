import { gql } from "@apollo/client";
import { LinkedMockOptionsItem } from "@reducers/contentEdit/programsHandler";
import { FileLike } from "@rpldy/shared";
import Cookies from "js-cookie";
import api, { gqlapi } from ".";
// import requireContentType from "../../scripts/contentType.macro";
import { LangRecordId } from "../locale/lang/type";
import { ICacheData } from "../services/permissionCahceService";
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

export const apiResourcePathById = (resource_id?: string) => {
  if (!resource_id) return;
  return `${process.env.REACT_APP_BASE_API}/contents_resources/${resource_id}`;
};
export const apiValidatePDFGet = (resource_id: string) => {
  const rid = resource_id.split("-")[1];
  const url = `${process.env.REACT_APP_KO_BASE_API}/pdf/${rid}/validate`;
  return fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/pdf",
      Accept: "application/pdf",
    },
  }).then((response) => {
    return response.json();
  });
};
export const apiValidatePDFPost = (file: FileLike) => {
  const url = `${process.env.REACT_APP_KO_BASE_API}/pdf/validate`;
  const formData = new FormData();
  formData.append("file", file as unknown as Blob);
  return fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/pdf",
      Accept: "application/pdf",
    },
    body: formData,
  }).then((response) => {
    return response.json();
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

export const apiWaitForOrganizationOfPage = () => {
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

//  const apiCreateContentTypeLibrary = (id: string) => {
//   return requireContentType("asset", id);
// };

//  async function apiCreateContentTypeSchema<T extends Record<string, unknown>>(id: string, locale: string) {
//   const schema = {} as T;
//   const schemaLanguages = {} as T;
//   for (const [name, value] of Object.entries(requireContentType<T>("schema", id))) {
//     schema[name as keyof T] = cloneDeep((await value()).default);
//   }
//   for (const [name, value] of Object.entries(requireContentType<T>("language", id, shouldBeLangName(locale)))) {
//     schemaLanguages[name as keyof T] = cloneDeep((await value()).default?.semantics);
//   }
//   return merge(schema, schemaLanguages);
// }

//  async function apiCreateContentTypeSchemaLanguage<T extends Record<string, unknown>>(id: string, locale: string) {
//   const schemaLanguages = {} as T;
//   for (const [name, value] of Object.entries(requireContentType<T>("language", id, shouldBeLangName(locale)))) {
//     schemaLanguages[name as keyof T] = cloneDeep((await value()).default?.semantics);
//   }
//   return schemaLanguages;
// }

export function domainSwitch() {
  return window.location.host.includes("kidsloop.live");
}

export function apiIsEnableReport() {
  return process.env.REACT_APP_ENABLE_REPORT === "1";
}

export async function apiSkillsListByIds(skillIds: string[]) {
  const skillsQuery = skillIds
    .map(
      (id, index) => `
    skill${index}: subcategory(id: "${id}") {
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
    developmental${index}: category(id: "${id}") {
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

export async function getUserIdAndOrgId() {
  const organizationId = ((await apiWaitForOrganizationOfPage()) as string) || "";

  return organizationId;
}
