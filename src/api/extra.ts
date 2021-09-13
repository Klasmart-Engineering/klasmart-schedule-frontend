import Cookies from "js-cookie";
import cloneDeep from "lodash/cloneDeep";
import merge from "lodash/merge";
import api from ".";
import requireContentType from "../../scripts/contentType.macro";
import { LangRecordId, shouldBeLangName } from "../locale/lang/type";
import { QeuryMeQuery } from "./api-ko.auto";
import { EntityFolderItemInfo } from "./api.auto";
import { apiEmitter, ApiErrorEventData, ApiEvent } from "./emitter";
import premissionAll from "./permission_all.json";

// 每个接口都有塞给后端的参数 以及前端 url 上的参数名
export const ORG_ID_KEY = "org_id";
export const LOCALE_KEY = "locale";

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
export const apiValidatePDF = (resource_id: string) => {
  const rid = resource_id.split("-")[1];
  return fetch(`${process.env.REACT_APP_KO_VALIDATE_PDF_API}/pdf/${rid}/validate`, {
    method: "GET",
    headers: {
      "Content-Type": "application/pdf",
      Accept: "application/pdf",
    },
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

export const apiCreateContentTypeLibrary = (id: string) => {
  return requireContentType("asset", id);
};

export async function apiCreateContentTypeSchema<T extends Record<string, unknown>>(id: string, locale: string) {
  const schema = {} as T;
  const schemaLanguages = {} as T;
  for (const [name, value] of Object.entries(requireContentType<T>("schema", id))) {
    schema[name as keyof T] = cloneDeep((await value()).default);
  }
  for (const [name, value] of Object.entries(requireContentType<T>("language", id, shouldBeLangName(locale)))) {
    schemaLanguages[name as keyof T] = cloneDeep((await value()).default?.semantics);
  }
  return merge(schema, schemaLanguages);
}

export async function apiCreateContentTypeSchemaLanguage<T extends Record<string, unknown>>(id: string, locale: string) {
  const schemaLanguages = {} as T;
  for (const [name, value] of Object.entries(requireContentType<T>("language", id, shouldBeLangName(locale)))) {
    schemaLanguages[name as keyof T] = cloneDeep((await value()).default?.semantics);
  }
  return schemaLanguages;
}

export function apiGetContentTypeList() {
  return import("h5p/libraries/content-types.auto.json").then((x) => {
    return x.default.contentTypes;
  });
}

export function domainSwitch() {
  return window.location.host.includes("kidsloop.live");
}

export function apiIsEnableNewH5p() {
  return process.env.REACT_APP_ENABLE_NEW_H5P === "1";
}

export function apiIsEnableReport() {
  return process.env.REACT_APP_ENABLE_REPORT === "1";
}
export async function apiGetPermission(): Promise<QeuryMeQuery> {
  const premissions = Object.keys(premissionAll);
  const permission = await api.organizationPermissions.hasOrganizationPermissions({
    permission_name: premissions,
  });
  let returnData: NonNullable<QeuryMeQuery> = {
    me: {
      user_id: "",
      membership: {
        roles: [
          {
            permissions: [],
          },
        ],
      },
    },
  };
  Object.keys(permission).forEach((permissionName) => {
    if (returnData?.me?.membership?.roles?.length && permission[permissionName]) {
      returnData?.me?.membership?.roles[0]?.permissions?.push({ permission_name: permissionName });
    }
  });
  return returnData;
}
