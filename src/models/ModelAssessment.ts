import { cloneDeep } from "lodash";
import {
  DetailStudyAssessment,
  GetAssessmentResult,
  UpdataStudyAssessmentRequestData,
  UpdateAssessmentRequestData,
  UpdateAssessmentRequestDataLessonMaterials,
} from "../api/type";
import { EntityAssessmentDetailContent, EntityAssessmentStudent } from "../api/api.auto";

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
    const outcomes = draft.outcomes || [];
    const lesson_materials = draft.lesson_materials?.map((item) => {
      return {
        checked: item.checked,
        comment: item.comment,
        id: item.id,
      };
    });
    return { attendance_ids, outcomes, lesson_materials };
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
  toInitMaterial(detail: GetAssessmentResult): GetAssessmentResult["lesson_materials"] {
    const draft = cloneDeep(detail);
    const { lesson_materials } = draft;
    return lesson_materials?.filter((item) => item.checked);
  },
  toMaterialRequest(
    detail: GetAssessmentResult,
    dMaterials: GetAssessmentResult["lesson_materials"]
  ): GetAssessmentResult["lesson_materials"] {
    const draft = cloneDeep(detail);
    const materials =
      dMaterials && dMaterials[0] && draft.lesson_materials && draft.lesson_materials[0]
        ? draft.lesson_materials.map((item, index) => {
            return {
              checked: dMaterials[index].checked,
              comment: dMaterials[index].comment,
              id: item.id,
              name: item.name,
              outcome_ids: item.outcome_ids,
            };
          })
        : draft.lesson_materials;
    return materials;
  },
  toStudyAssessment(
    detail: DetailStudyAssessment,
    dMaterials: DetailStudyAssessment["lesson_materials"]
  ): DetailStudyAssessment["lesson_materials"] {
    const draft = cloneDeep(detail);
    const materials =
      dMaterials && dMaterials[0] && draft.lesson_materials && draft.lesson_materials[0]
        ? draft.lesson_materials.map((item, index) => {
            return {
              checked: dMaterials[index].checked,
              comment: dMaterials[index].comment,
              id: item.id,
              name: item.name,
            };
          })
        : draft.lesson_materials;
    return materials;
  },
  toMaterial(
    defaultDetail: GetAssessmentResult["lesson_materials"],
    value: UpdateAssessmentRequestDataLessonMaterials
  ): GetAssessmentResult["lesson_materials"] {
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
  filterOutcomeList(assessment: GetAssessmentResult, materials: GetAssessmentResult["lesson_materials"]): GetAssessmentResult["outcomes"] {
    const check_outcome_ids: string[] = [];
    if (materials && materials.length) {
      materials.forEach((item) => {
        if (item.checked) {
          check_outcome_ids.push.apply(check_outcome_ids, item.outcome_ids as string[]);
        }
      });
    }
    if (assessment.lesson_plan?.outcome_ids && assessment.lesson_plan.outcome_ids[0]) {
      check_outcome_ids.push.apply(check_outcome_ids, assessment.lesson_plan.outcome_ids);
    }
    const new_check_outcome_ids = Array.from(check_outcome_ids);
    if (assessment?.lesson_plan && assessment?.lesson_plan.id) {
      if (assessment.outcomes && assessment.outcomes.length && new_check_outcome_ids && new_check_outcome_ids.length) {
        return assessment.outcomes.filter((item) => new_check_outcome_ids.indexOf(item.outcome_id as string) >= 0);
      } else {
        return [];
      }
    } else {
      return assessment.outcomes;
    }
  },
  toGetStudentIds(detail: DetailStudyAssessment) {
    const draft = cloneDeep(detail);
    const attendance_ids = draft.students?.filter((student) => student.checked).map((item) => item.id as string);
    return { attendance_ids };
  },
  toGetStudentViewItems(
    detail: DetailStudyAssessment,
    student_ids: UpdataStudyAssessmentRequestData["attendance_ids"],
    lesson_materials: UpdataStudyAssessmentRequestData["lesson_materials"]
  ): DetailStudyAssessment["student_view_items"] {
    const { student_view_items } = detail;
    if (student_view_items && student_view_items.length) {
      if (student_ids && student_ids.length) {
        const newValues = student_view_items.filter((item) => student_ids.indexOf(item.student_id as string) >= 0);
        if (lesson_materials && lesson_materials.length) {
          const checkedLessonMaterialsIds = lesson_materials.filter((item) => item.checked).map((v) => v.id);
          return newValues.map((item) => {
            return {
              comment: item.comment,
              student_id: item.student_id,
              student_name: item.student_name,
              lesson_materials:
                item.lesson_materials && item.lesson_materials.length
                  ? item.lesson_materials.filter((item) => checkedLessonMaterialsIds.indexOf(item.lesson_material_id) >= 0)
                  : [],
            };
          });
        } else {
          return newValues;
        }
      } else {
        if (lesson_materials && lesson_materials.length) {
          const checkedLessonMaterialsIds = lesson_materials.filter((item) => item.checked).map((v) => v.id);
          return student_view_items.map((item) => {
            return {
              comment: item.comment,
              student_id: item.student_id,
              student_name: item.student_name,
              lesson_materials:
                item.lesson_materials && item.lesson_materials.length
                  ? item.lesson_materials.filter((item) => checkedLessonMaterialsIds.indexOf(item.lesson_material_id) >= 0)
                  : [],
            };
          });
        } else {
          return student_view_items;
        }
      }
    } else {
      return [];
    }
  },
  toGetStudentViewFormItems(
    student_view_items: UpdataStudyAssessmentRequestData["student_view_items"],
    student_view_items_form: UpdataStudyAssessmentRequestData["student_view_items"]
  ) {
    return student_view_items?.map((item) => {
      const Similar = student_view_items_form?.filter((item_from) => item_from.student_id === item.student_id) ?? [];
      if (Similar.length) {
        const lesson_materials = item?.lesson_materials?.map((material) => {
          const similarMaterial =
            Similar[0]?.lesson_materials?.filter((material_from) => material.lesson_material_id === material_from.lesson_material_id) ?? [];
          return similarMaterial.length ? similarMaterial[0] : material;
        });
        return { ...Similar[0], lesson_materials: lesson_materials };
      } else {
        return item;
      }
    }) as UpdataStudyAssessmentRequestData["student_view_items"];
  },
  toUpdateH5pStudentView(
    initValue: DetailStudyAssessment["student_view_items"],
    student_view_items: DetailStudyAssessment["student_view_items"]
  ): UpdataStudyAssessmentRequestData["student_view_items"] {
    if (initValue && initValue.length && student_view_items && student_view_items.length) {
      return student_view_items?.map((item, index) => {
        const currentInit = initValue[index];
        const currentLessonMaterials = currentInit.lesson_materials ? currentInit.lesson_materials : [];
        const changed_lesson_materials = item.lesson_materials?.filter(
          (v, idx) => v.achieved_score !== currentLessonMaterials[idx].achieved_score
        );
        return {
          comment: item.comment,
          student_id: item.student_id,
          lesson_materials: changed_lesson_materials?.length
            ? changed_lesson_materials?.map((v) => {
                return {
                  achieved_score: v.achieved_score,
                  lesson_material_id: v.lesson_material_id,
                };
              })
            : [],
        };
      });
    } else {
      return [];
    }
  },
  toGetInitStudentIds(defaultDetail: DetailStudyAssessment, value: UpdateStudyAssessmentDataOmitAction): DetailStudyAssessment {
    const draft = cloneDeep(defaultDetail);
    const attendanceHash = toHash(defaultDetail.students || []);
    draft.students = value.attendance_ids?.map((id) => attendanceHash[id]) || [];
    // const list = cloneDeep(draft.students);
    // const bb = list.filter((item) => item === undefined);
    // if (bb.length > 0) {
    //   draft.students = [];
    // }
    return draft;
  },
  toStudyRequest(detail: DetailStudyAssessment): UpdateStudyAssessmentDataOmitAction {
    const draft = cloneDeep(detail);
    const attendance_ids = draft.students?.filter((student) => student.checked).map((item) => item.id as string);
    const lesson_materials = draft.lesson_materials;
    return { attendance_ids, lesson_materials };
  },
  toGetCompleteRate(student_view_items: DetailStudyAssessment["student_view_items"]) {
    let all: number = 0;
    let attempt: number = 0;
    if (student_view_items && student_view_items[0]) {
      student_view_items.forEach((item) => {
        if (item.lesson_materials && item.lesson_materials[0]) {
          item.lesson_materials.forEach((v) => {
            if (v.is_h5p) {
              all += 1;
              if (v.attempted) {
                attempt += 1;
              }
            }
          });
        }
      });
    }
    return { all, attempt };
  },
  toStudyMaterial(
    defaultDetail: DetailStudyAssessment["lesson_materials"],
    value: UpdateStudyAssessmentDataOmitAction["lesson_materials"]
  ): DetailStudyAssessment["lesson_materials"] {
    const draft = cloneDeep(defaultDetail);
    if (draft && draft.length && value && value.length) {
      return draft.map((item, index) => {
        return {
          checked: value[index] ? value[index].checked : item.checked,
          comment: value[index] ? value[index].comment : item.comment,
          id: item.id,
          name: item.name,
        };
      });
    } else {
      return draft;
    }
  },
  MultipleSelectSet(
    students: EntityAssessmentStudent[] | undefined,
    materials: EntityAssessmentDetailContent[] | undefined
  ): {
    label: string;
    data: { id: string | number; title: string }[];
  }[] {
    const studentsSet = students?.map((student) => {
      return { id: student.id, title: student.name };
    }) as { id: string | number; title: string }[];
    const materialsSet = materials
      ?.filter((material) => material.checked)
      ?.map((material) => {
        return { id: material.id, title: material.name };
      }) as { id: string | number; title: string }[];
    return [
      { label: "View by Student", data: studentsSet },
      { label: "View by Lesson Material", data: materialsSet },
    ];
  },
};

export type UpdateStudyAssessmentDataOmitAction = Omit<UpdataStudyAssessmentRequestData, "action">;
