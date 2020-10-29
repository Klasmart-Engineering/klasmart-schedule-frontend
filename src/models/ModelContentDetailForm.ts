import { EntityContentInfoWithDetails, EntityCreateContentRequest } from "../api/api.auto";
import { ContentType } from "../api/type";
import { ModelLessonPlan, Segment } from "./ModelLessonPlan";

interface MyExtendedDetailForm {
  outcome_entities?: EntityContentInfoWithDetails["outcome_entities"];
}
export interface ContentDetailPlanType extends Omit<EntityCreateContentRequest, "data" | "lesson_type">, MyExtendedDetailForm {
  data?: Segment;
  created_at?: string;
  lesson_type?: number;
}
let time: number | undefined = 0;
export interface ContentDetailMaterialType extends Omit<EntityCreateContentRequest, "data" | "lesson_type">, MyExtendedDetailForm {
  data?: { source: string; input_source: string; file_type: number };
  created_at?: string;
  lesson_type?: string;
}

export type ContentDetailForm = ContentDetailPlanType | ContentDetailMaterialType;

function isPlan(contentDetail: ContentDetailForm): contentDetail is ContentDetailPlanType {
  return contentDetail.content_type === ContentType.plan;
}

export class ModelContentDetailForm {
  static encode(value: ContentDetailForm): EntityContentInfoWithDetails {
    const data = isPlan(value) && value.data ? ModelLessonPlan.toString(value.data) : JSON.stringify(value.data);
    const created_at = time;
    const lesson_type = Number(value.lesson_type);
    return { ...value, data, created_at, lesson_type };
  }

  static decode(contentDetail: EntityContentInfoWithDetails): ContentDetailForm {
    const data = contentDetail.data ? JSON.parse(contentDetail.data) : { input_source: 1 };
    time = contentDetail.created_at;
    const created_at = formattedTime(contentDetail.created_at);
    const lesson_type = contentDetail.lesson_type === 0 ? "" : String(contentDetail.lesson_type);

    return { ...contentDetail, data, created_at, lesson_type };
  }
}

export function formattedTime(value: number | undefined): string {
  if (value) {
    let date = new Date(Number(value) * 1000);
    let y = date.getFullYear();
    let MM = date.getMonth() + 1;
    const MMs = MM < 10 ? `0${MM}` : MM;
    let d = date.getDate();
    const ds = d < 10 ? `0${d}` : d;
    let h = date.getHours();
    const dayType = h > 12 ? "PM" : "AM";
    h = h > 12 ? h - 12 : h;
    const hs = h < 10 ? `0${h}` : h;
    let m = date.getMinutes();
    const ms = m < 10 ? `0${m}` : m;
    return `${y}/${MMs}/${ds}  ${hs}:${ms}${dayType}`;
  }
  return "";
}
export const setQuery = (search: string, hash: Record<string, string | number | boolean>): string => {
  const query = new URLSearchParams(search);
  Object.keys(hash).forEach((key) => query.set(key, String(hash[key])));
  return query.toString();
};
export const toQueryString = (hash: Record<string, any>): string => {
  const search = new URLSearchParams(hash);
  return `?${search.toString()}`;
};
