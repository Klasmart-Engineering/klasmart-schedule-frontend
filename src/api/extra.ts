export const apiGetMockOptions = () =>
  fetch("https://launch.kidsloop.cn/static/mock-korea-data/select-options.json").then((res) => {
    return res.json();
  });
export interface MockOptionsItem {
  id: string;
  name: string;
}
export interface MockOptions {
  program: MockOptionsItem[];
  subject: MockOptionsItem[];
  skills: MockOptionsItem[];
  age: MockOptionsItem[];
  grade: MockOptionsItem[];
  developmental: MockOptionsItem[];
  visibility_settings: MockOptionsItem[];
}

export const apiResourcePathById = (resource_id?: string) => {
  if (!resource_id) return;
  return `${process.env.REACT_APP_BASE_API}/contents_resources/${resource_id}`;
};

export const apiGetH5pResourceById = (id: string) => {
  return `${process.env.REACT_APP_BASE_API}/h5p-www/play/${id}`;
};

export const apiCreateH5pResource = () => {
  return `${process.env.REACT_APP_BASE_API}/h5p-www/new`;
};

export type LocaleName = "en" | "kr" | "cn";
export const apiGetTranslation = (name: LocaleName) => {
  return import(`../locale/${name}.json`);
};
