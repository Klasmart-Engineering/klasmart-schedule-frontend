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
