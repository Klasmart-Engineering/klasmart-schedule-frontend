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
  categories: string[];
  coreApiVersionNeeded: {
    major: number;
    minor: number;
  };
  createdAt: string;
  isRecommended: boolean;
  keywords: string[];
  tutorial: string;
  updatedAt: string;
  version: {
    major: number;
    minor: number;
    patch: number;
  };
  popularity: number;
}
