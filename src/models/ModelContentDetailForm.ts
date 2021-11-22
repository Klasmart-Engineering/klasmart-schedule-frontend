import { EntityContentInfoWithDetails, EntityCreateContentRequest, EntityOutcome, ModelPublishedOutcomeView } from "@api/api.auto";
import { ContentFileType, ContentInputSourceType, ContentType } from "@api/type";
import { d } from "@locale/LocaleManager";
import { LinkedMockOptions, LinkedMockOptionsItem } from "@reducers/contentEdit/programsHandler";
import { ModelLessonPlan, Segment } from "./ModelLessonPlan";

interface MyExtendedDetailForm {
  outcome_entities?: EntityContentInfoWithDetails["outcome_entities"];
}
export interface ContentDetailPlanType extends Omit<EntityCreateContentRequest, "data">, MyExtendedDetailForm {
  data?: Segment;
  created_at?: string;
}
let time: number | undefined = 0;
export interface ContentDetailMaterialType extends Omit<EntityCreateContentRequest, "data">, MyExtendedDetailForm {
  data?: { source?: string; input_source: ContentInputSourceType; file_type: ContentFileType; content?: string };
  created_at?: string;
}

export type ContentDetailForm = ContentDetailPlanType | ContentDetailMaterialType;

function isPlan(contentDetail: ContentDetailForm): contentDetail is ContentDetailPlanType {
  return contentDetail.content_type === ContentType.plan;
}

export class ModelContentDetailForm {
  static encode(value: ContentDetailForm): EntityContentInfoWithDetails {
    const data = isPlan(value) && value.data ? ModelLessonPlan.toString(value.data) : JSON.stringify(value.data);
    const created_at = time;
    return { ...value, data, created_at };
  }

  static decode(contentDetail: EntityContentInfoWithDetails): ContentDetailForm {
    const data = contentDetail.data ? JSON.parse(contentDetail.data) : { input_source: ContentInputSourceType.h5p };
    time = contentDetail.created_at;
    const created_at = formattedTime(contentDetail.created_at);
    // const lesson_type = contentDetail.lesson_type === 0 ? "" : String(contentDetail.lesson_type);

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

export const toMapVisibilitySettings = (list?: LinkedMockOptionsItem[]): LinkedMockOptionsItem[] => {
  const schList: LinkedMockOptionsItem[] = [];
  const orgList: LinkedMockOptionsItem[] = [];
  if (list && list.length) {
    list.forEach((item) => {
      if (item.group === "school") {
        schList.push(item);
      }
      if (item.group === "org") {
        orgList.push(item);
      }
    });
    return orgList.concat(schList);
  }
  return [];
};
export const toMapGroup = (group?: string) => {
  if (group === "school") return d("Schools").t("library_label_visibility_schools");
  if (group === "org") return d("Organization").t("library_label_visibility_organization");
};
type options = Omit<LinkedMockOptions, "program_id" | "developmental_id">;
export const addAllInSearchLOListOption = (linkedMockOptions: LinkedMockOptions): LinkedMockOptions => {
  const all: LinkedMockOptionsItem | undefined = { id: "all", name: "all" };
  const resault: LinkedMockOptions = {};
  Object.keys(linkedMockOptions).forEach((item) => {
    const key = item as keyof options;
    if (key === "age" || key === "grade") {
      resault[key] = linkedMockOptions[key];
    } else {
      resault[key] = [all].concat(linkedMockOptions[key] || []);
    }
  });
  return resault;
};
// 搜索outcomes，如果用户选择的是all,调用api传""(传空)
// transferSearchParams 是将用户选择的数据转换为可以调用api的参数
export const transferSearchParams = (props: { program?: string; category?: string }) => {
  const { program, category } = props;
  const category_ids = category?.split("/")[0];
  const sub_category_ids = category?.split("/")[1];
  const program_ids = program?.split("/")[0];
  const subject_ids = program?.split("/")[1];
  if (!category_ids || !sub_category_ids || !program_ids || !subject_ids) return {};
  return {
    program_ids: program_ids === "all" ? [] : [program_ids],
    subject_ids: subject_ids === "all" ? [] : subject_ids?.split(","),
    category_ids: category_ids === "all" ? [] : [category_ids],
    sub_category_ids: sub_category_ids === "all" ? [] : sub_category_ids?.split(","),
  };
};
export const sortOutcomesList = (value?: EntityOutcome[], order_by?: string) => {
  return value?.slice()?.sort((a, b) => {
    if (!a || !b || !a.outcome_name || !b.outcome_name) return 1;
    return order_by === "name"
      ? a.outcome_name.toUpperCase().charCodeAt(0) - b.outcome_name.toUpperCase().charCodeAt(0)
      : b.outcome_name.toUpperCase().charCodeAt(0) - a.outcome_name.toUpperCase().charCodeAt(0);
  });
};
// 由于列表返回的outcomeItem的数据类型的命名与getContent中返回的outcomeItem的数据类型的字段命名不同，但是需要在同一个表中展示出来
// 所以做的数据转换
export const getOutcomeList = (list: ModelPublishedOutcomeView[]): EntityOutcome[] => {
  return list.map(
    ({ program_ids, subject_ids, sub_category_ids, category_ids, age_ids, grade_ids, ...item }) =>
      ({
        ...item,
        ages: age_ids,
        developmental: category_ids?.join(","),
        grades: grade_ids,
        programs: program_ids,
        skills: sub_category_ids?.join(","),
        subjects: subject_ids,
      } as EntityOutcome)
  );
};
