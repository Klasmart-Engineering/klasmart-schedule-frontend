import { Content, CreateContentRequest } from "../api/api";
import { ContentType } from "../api/api.d";
import { ModelLessonPlan, Segment } from "./ModelLessonPlan";

export interface ContentDetailPlanType extends Omit<CreateContentRequest, "data"> {
  data: Segment;
  created_at?: string;
}
let time: number | undefined = 0;
export interface ContentDetailMaterialType extends Omit<CreateContentRequest, "data"> {
  data: { source: string };
  created_at?: string;
}

export type ContentDetailForm = ContentDetailPlanType | ContentDetailMaterialType;

function isPlan(contentDetail: ContentDetailForm): contentDetail is ContentDetailPlanType {
  return contentDetail.content_type === ContentType.plan;
}

export class ModelContentDetailForm {
  static encode(value: ContentDetailForm): Content {
    const data = isPlan(value) ? ModelLessonPlan.toString(value.data) : JSON.stringify(value.data);
    const created_at = time;
    return { ...value, data, created_at };
  }

  static decode(contentDetail: Content): ContentDetailForm {
    const data = contentDetail.data ? JSON.parse(contentDetail.data) : {};
    time = contentDetail.created_at;
    const created_at = formattedTime(contentDetail.created_at);
    return { ...contentDetail, data, created_at };
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
    return `${ds}/${MMs}/${y}  ${hs}:${ms}${dayType}`;
  }
  return "";
}
