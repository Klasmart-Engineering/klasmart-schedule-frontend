import { cloneDeep } from "lodash";
import { GetAssessmentResult, UpdateAssessmentRequestData, UpdateAssessmentRequestDataLessonMaterials } from "../api/type";

interface ObjContainId {
  id?: string;
}
export type UpdateAssessmentRequestDataOmitAction = Omit<UpdateAssessmentRequestData, "action">;
function toHash<T extends ObjContainId>(arr: T[]): Record<string, T> {
  return arr.reduce<Record<string, T>>((result, item) => {
    if (!item.id) return result;
    result[item.id] = item;
    return result;
  }, {});
}

export const ModelAssessment = {
  toRequest(detail: GetAssessmentResult): UpdateAssessmentRequestData {
    const draft = cloneDeep(detail);
    const attendance_ids = draft.students?.filter((attendance) => attendance.checked).map((item) => item.id as string);
    const outcome_attendances = draft.outcome_attendances || [];
    return { attendance_ids, outcome_attendances };
  },

  toDetail(defaultDetail: GetAssessmentResult, value: UpdateAssessmentRequestDataOmitAction): GetAssessmentResult {
    const draft = cloneDeep(defaultDetail);
    const attendanceHash = toHash(defaultDetail.students || []);
    draft.students = value.attendance_ids?.map((id) => attendanceHash[id]) || [];
    const list = cloneDeep(draft.students);
    const bb = list.filter((item) => item === undefined);
    if (bb.length > 0) {
      draft.students = [];
    }
    return draft;
  },
  toInitMaterial(detail: GetAssessmentResult): GetAssessmentResult["materials"] {
    const draft = cloneDeep(detail);
    const { materials } = draft;
    return materials?.filter((item) => item.checked);
  },
  toMaterialRequest(detail: GetAssessmentResult, dMaterials: GetAssessmentResult["materials"]): GetAssessmentResult["materials"] {
    const draft = cloneDeep(detail);
    const materials =
      dMaterials && dMaterials[0] && draft.materials && draft.materials[0]
        ? draft.materials.map((item, index) => {
            return {
              checked: dMaterials[index].checked,
              comment: dMaterials[index].comment,
              id: item.id,
              name: item.name,
              outcome_ids: item.outcome_ids,
            };
          })
        : draft.materials;
    return materials;
  },
  toMaterial(
    defaultDetail: GetAssessmentResult["materials"],
    value: UpdateAssessmentRequestDataLessonMaterials
  ): GetAssessmentResult["materials"] {
    const draft = cloneDeep(defaultDetail);
    if (draft && draft.length && value && value.length) {
      return draft.map((item, index) => {
        return {
          checked: value[index].checked,
          comment: value[index].comment,
          id: item.id,
          name: item.name,
          outcome_ids: item.outcome_ids,
        };
      });
    } else {
      return draft;
    }
  },
  filterOutcomeList(
    assessment: GetAssessmentResult,
    materials: GetAssessmentResult["materials"]
  ): GetAssessmentResult["outcome_attendances"] {
    const check_outcome_ids: string[] = [];
    if (materials && materials.length) {
      materials.forEach((item) => {
        if (item.checked) {
          check_outcome_ids.push.apply(check_outcome_ids, item.outcome_ids as string[]);
        }
      });
    }
    if (assessment.plan?.outcome_ids && assessment.plan.outcome_ids[0]) {
      check_outcome_ids.push.apply(check_outcome_ids, assessment.plan.outcome_ids);
    }
    const new_check_outcome_ids = Array.from(check_outcome_ids);
    if (assessment?.plan && assessment?.plan.id) {
      if (
        assessment.outcome_attendances &&
        assessment.outcome_attendances.length &&
        new_check_outcome_ids &&
        new_check_outcome_ids.length
      ) {
        return assessment.outcome_attendances.filter((item) => new_check_outcome_ids.indexOf(item.outcome_id as string) >= 0);
      } else {
        return [];
      }
    } else {
      return assessment.outcome_attendances;
    }
  },
};
