import Cookies from "js-cookie";

// 每个接口都有塞给后端的参数 以及前端 url 上的参数名
export const ORG_ID_KEY = "org_id";
export const TOKEN_KEY = "access";
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

export const apiGetH5pResourceById = (id: string) => {
  return `${process.env.REACT_APP_H5P_API}/h5p/play/${id}`;
};

export const apiCreateH5pResource = () => {
  return `${process.env.REACT_APP_H5P_API}/h5p/new`;
};

export const apiLivePath = (token: string) => {
  const { hostname } = window.location;
  const lastDomainDotName = hostname !== "localhost" ? hostname.split(".").pop() : "cn";
  // 地址修改后需要再改
  const cl = hostname.split(".").pop() === "net" ? "/class-live/" : "";
  return `https://live.kidsloop.${lastDomainDotName}${cl}?token=${token}`;
};

export const apiFetchClassByTeacher = (mockOptions: MockOptions, teacher_id: string) => {
  if (mockOptions.teacher_class_relationship.length) {
    const class_ids = mockOptions.teacher_class_relationship.filter(
      (item: MockOptionsItemTeacherAndClass) => item.teacher_id === teacher_id
    )[0].class_ids;
    return mockOptions.classes.filter((item: MockOptionsItem) => class_ids.filter((item1: string) => item.id === item1).length > 0);
  }
};

export const apiOrganizationOfPage = () => {
  const searchParams = new URLSearchParams(window.location.search);
  return searchParams.get(ORG_ID_KEY);
};

export const apiAddOrganizationToPageUrl = (id: string) => {
  const url = new URL(window.location.href);
  url.searchParams.append(ORG_ID_KEY, id);
  window.history.replaceState(null, document.title, url.toString());
};

export const apiTokenInCookie = () => {
  return Cookies.get(TOKEN_KEY);
};

export const apiLocaleInCookie = () => {
  return Cookies.get(LOCALE_KEY)?.slice(0, 2);
};
