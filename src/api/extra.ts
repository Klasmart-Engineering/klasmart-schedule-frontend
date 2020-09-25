export const apiGetMockOptions = () =>
  fetch("https://launch.kidsloop.cn/static/mock-korea-data/select-options.json").then((res) => {
    return res.json();
  });
export interface MockOptionsItem {
  id: string;
  name: string;
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
  classes: MockOptionsItem[];
  class_types: MockOptionsItem[];
  organizations: MockOptionsItem[];
  teachers: MockOptionsItem[];
  students: MockOptionsItem[];
  users: MockOptionsItem[];
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
  const lastDomainDotName = hostname === "localhost" ? "net" : hostname.split(".").pop();
  return `https://live.kidsloop.${lastDomainDotName}/class-live/?token=${token}`;
};
