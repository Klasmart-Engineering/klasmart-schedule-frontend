import { Content, CreateContentRequest } from "../api/api";
import { ContentType } from "../api/api.d";
import { ModelLessonPlan, Segment } from "./ModelLessonPlan";

export interface ContentDetailPlanType extends Omit<CreateContentRequest, "data"> {
  data: Segment;
}

export interface ContentDetailMaterialType extends Omit<CreateContentRequest, "data"> {
  data: { source: string };
}

export type ContentDetailForm = ContentDetailPlanType | ContentDetailMaterialType;

function isPlan(contentDetail: ContentDetailForm): contentDetail is ContentDetailPlanType {
  return contentDetail.content_type === ContentType.plan;
}

export class ModelContentDetailForm {
  static encode(value: ContentDetailForm): Content {
    const data = isPlan(value) ? ModelLessonPlan.toString(value.data) : JSON.stringify(value.data);
    return { ...value, data };
  }

  static decode(contentDtail: Content): ContentDetailForm {
    const data = contentDtail.data ? JSON.parse(contentDtail.data) : {};
    return { ...contentDtail, data };
  }
}
