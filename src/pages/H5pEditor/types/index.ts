import { ContentFileType } from "../../../api/type";

export interface ScreenshotsItem {
  url: string;
  alt: string;
}
export interface MockData {
  icon: string;
  title: string;
  owner: string;
  example: string;
  license: any;
  description: string;
  screenshots: ScreenshotsItem[];
  id: ContentFileType;
  summary: string;
}
