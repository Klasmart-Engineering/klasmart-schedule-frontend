import { cloneDeep, uniq } from "lodash";
import {
  EntityAssessmentDetailContent,
  EntityAssessmentStudent,
  EntityUpdateAssessmentContentOutcomeArgs,
  EntityAssessmentStudentViewH5PItem,
} from "../api/api.auto";
import {
  DetailStudyAssessment,
  GetAssessmentResult,
  UpdataStudyAssessmentRequestData,
  UpdateAssessmentRequestData,
  UpdateAssessmentRequestDataLessonMaterials,
} from "../api/type";
import { d } from "../locale/LocaleManager";

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
    student_view_items_form: UpdataStudyAssessmentRequestData["student_view_items"],
    autocomplete_value?: { id: string | number | undefined; title: string }[],
    autocompleteLabel?: number
  ) {
    const assessmentData: UpdataStudyAssessmentRequestData["student_view_items"] = [];
    student_view_items?.forEach((item) => {
      const autocompleteValue = autocomplete_value?.map((value) => value.id) ?? [];
      const autocompleteValueIsAll = autocomplete_value?.length === 1 && autocomplete_value.every((v) => v?.id === 1);
      const is_hide = autocompleteLabel === 1 && !autocompleteValue.includes(item.student_id) && !autocompleteValueIsAll;
      const items = {
        ...item,
        is_hide: is_hide,
        lesson_materials: item?.lesson_materials?.map((result) => {
          return {
            ...result,
            is_hide: autocompleteLabel === 2 && !autocompleteValue.includes(result.lesson_material_id) && !autocompleteValueIsAll,
          };
        }),
      };
      const Similar = student_view_items_form?.filter((item_from) => item_from.student_id === items.student_id) ?? [];
      if (Similar.length) {
        const lesson_materials = items?.lesson_materials?.map((material) => {
          const similarMaterial =
            Similar[0]?.lesson_materials?.filter((material_from) => {
              return material.sub_h5p_id
                ? material.sub_h5p_id === material_from.sub_h5p_id
                : material.lesson_material_id === material_from.lesson_material_id;
            }) ?? [];
          return similarMaterial.length ? similarMaterial[0] : material;
        });
        assessmentData.push({
          ...Similar[0],
          // @ts-ignore
          is_hide: is_hide,
          lesson_materials: lesson_materials?.map((result) => {
            return {
              ...result,
              is_hide: autocompleteLabel === 2 && !autocompleteValue.includes(result.lesson_material_id) && !autocompleteValueIsAll,
            };
          }),
        });
      } else {
        assessmentData.push(items);
      }
    });
    return assessmentData;
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
                  h5p_id: v.h5p_id,
                  sub_h5p_id: v.sub_h5p_id,
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
    materials: EntityAssessmentDetailContent[] | undefined,
    materialsCheck: EntityAssessmentDetailContent[] | undefined
  ): {
    label: string;
    data: { id: string | number; title: string }[];
    enum: number;
  }[] {
    const studentsSet = students?.map((student) => {
      return { id: student.id, title: student.name };
    }) as { id: string | number; title: string }[];
    const materialsSet = materials
      ?.filter((material) => material.checked)
      ?.map((material) => {
        return { id: material.id, title: materialsCheck?.filter((item) => item.id === material.id)[0].name ?? "" };
      }) as { id: string | number; title: string }[];
    return [
      { label: d("View by Students").t("assess_detail_view_by_students"), data: studentsSet, enum: 1 },
      { label: d("View by Lesson Material").t("assess_detail_view_by_lesson_material"), data: materialsSet, enum: 2 },
    ];
  },

  /** 生产所有的 ContentOutcomes ：如果该 content&outcome 没有出席的学生，依旧保留该条数据（为空数组）  **/
  genContentOutcomes(studentViewItems: EntityAssessmentStudentViewH5PItem[] | undefined): EntityUpdateAssessmentContentOutcomeArgs[] {
    let contentOutcomes: EntityUpdateAssessmentContentOutcomeArgs[] = [];
    studentViewItems?.forEach((stu) => {
      stu.lesson_materials?.forEach((lm) => {
        lm.outcomes?.forEach((oc) => {
          if (stu?.student_id != null) {
            let existContentOutcomes = contentOutcomes.find(
              (eco) => eco.content_id === lm.lesson_material_id && eco.outcome_id === oc.outcome_id
            );
            if (existContentOutcomes) {
              if (oc.checked) existContentOutcomes.attendance_ids?.push(stu?.student_id);
            } else {
              contentOutcomes.push({
                attendance_ids: oc.checked ? [stu.student_id] : [],
                content_id: lm.lesson_material_id,
                none_achieved: oc.none_achieved,
                outcome_id: oc.outcome_id,
              });
            }
          }
        });
      });
    });
    /** 去重操作 **/
    contentOutcomes?.forEach((co) => {
      co.attendance_ids = uniq(co.attendance_ids);
    });
    return contentOutcomes;
  },
};

export type UpdateStudyAssessmentDataOmitAction = Omit<UpdataStudyAssessmentRequestData, "action">;
