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

// const extraApi = new Api({ baseUrl: '' });

// /**
//  * @tags extra
//  * @name uploadResource
//  * @request PUT:{resourcePutUrl}
//  * @description upload resource to aws s3
//  */
// export const apiUploadResource = (resourcePutUrl: string, params?: RequestParams) => {
//   return extraApi.request<any, any>(resourcePutUrl, "PUT", params);
// }
