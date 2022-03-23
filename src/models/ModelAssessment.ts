import { AssessmentTypeValues } from "@components/AssessmentType";
import { Dimension } from "@pages/DetailAssessment/MultiSelect";
import { cloneDeep, uniq } from "lodash";
import {
  EntityAssessmentDetailContent,
  EntityAssessmentStudent,
  EntityAssessmentStudentViewH5PItem,
  EntityUpdateAssessmentContentOutcomeArgs,
  V2AssessmentContentReply
} from "../api/api.auto";
import {
  DetailStudyAssessment,
  GetAssessmentResult,
  UpdataStudyAssessmentRequestData,
  UpdateAssessmentRequestData,
  UpdateAssessmentRequestDataLessonMaterials
} from "../api/type";
import { d } from "../locale/LocaleManager";
import {
  MaterialViewItemResultProps,
  OutcomeStatus,
  OverAllOutcomesItem,
  StudentParticipate,
  StudentViewItemsProps,
  SubDimensionOptions
} from "../pages/DetailAssessment/type";
import { DetailAssessmentResult, DetailAssessmentResultContent, DetailAssessmentResultOutcome } from "../pages/ListAssessment/types";

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
  // 获取lesson material的最新选择状态
  toMaterial(
    defaultDetail: GetAssessmentResult["lesson_materials"],
    value: UpdateAssessmentRequestDataLessonMaterials
  ): GetAssessmentResult["lesson_materials"] {
    const draft = cloneDeep(defaultDetail);
    if (draft && draft.length && value && value.length) {
      return draft.map((item) => {
        // 找到对应的material
        const cur = value.find((m) => m.id === item.id);
        const curValue = cur ? cur : item;
        return {
          checked: curValue.checked,
          comment: curValue.comment,
          id: curValue.id,
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
    const new_check_outcome_ids = uniq(Array.from(check_outcome_ids));
    // 有lesson plan 筛选 lesson plan 和 selected lesson materials 绑定的outcome
    if (assessment?.lesson_plan && assessment?.lesson_plan.id) {
      if (assessment.outcomes && assessment.outcomes.length && new_check_outcome_ids && new_check_outcome_ids.length) {
        return assessment.outcomes.filter((item) => new_check_outcome_ids.indexOf(item.outcome_id as string) >= 0);
      } else {
        return [];
      }
    } else {
      // 没有lesson plan 不需要筛选 直接返回拉取到的outcome
      return assessment.outcomes;
    }
  },
  toGetOutcomeRequest(outcomes: GetAssessmentResult["outcomes"]): UpdateAssessmentRequestData["outcomes"] {
    return outcomes?.map((item) => {
      return {
        skip: item.skip,
        attendance_ids: item.attendance_ids,
        none_achieved: item.none_achieved,
        outcome_id: item.outcome_id,
      };
    });
  },
  toGetStudentIds(detail: DetailStudyAssessment) {
    const draft = cloneDeep(detail);
    const attendance_ids = draft.students?.filter((student) => student.checked).map((item) => item.id as string);
    return { attendance_ids };
  },
  // 通过选中的student和lesson material 筛选student_view_items对应的数据
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
  setInitFormValue(contents: DetailAssessmentResult["contents"], students: DetailAssessmentResult["students"]) {
    const _contents = contents
      ?.filter((item) => item.content_type === "LessonMaterial" && !item.parent_id)
      .map((item) => {
        const { content_id, parent_id, reviewer_comment, status } = item;
        return {
          content_id,
          parent_id,
          reviewer_comment,
          status,
        };
      });
    return { contents: _contents };
  },
  getStudentViewItems(
    students: DetailAssessmentResult["students"],
    contents: DetailAssessmentResult["contents"],
    outcomes: DetailAssessmentResult["outcomes"]
  ): StudentViewItemsProps[] | undefined {
    // const participateStudent = students?.filter((item) => item.status === StudentParticipate.Participate);
    const contentObj: Record<string, DetailAssessmentResultContent> = {};
    const outcomeObj: Record<string, DetailAssessmentResultOutcome> = {};
    contents
      ?.filter((item) => item.status === "Covered")
      .forEach((item) => {
        if (!contentObj[item.content_id!]) {
          contentObj[item.content_id!] = { ...item };
        }
      });
    outcomes?.forEach((item) => {
      if (!outcomeObj[item.outcome_id!]) {
        outcomeObj[item.outcome_id!] = { ...item };
      }
    });
    const studentViewItems: StudentViewItemsProps[] | undefined = students?.map((item) => {
      const { student_id, student_name, reviewer_comment, status, results } = item;
      return {
        student_id,
        student_name,
        reviewer_comment,
        status,
        result: results
          ?.filter((r) => !!contentObj[r.content_id!])
          .map((result) => {
            const { answer, attempted, content_id, score, outcomes } = result;
            const { content_name, content_type, content_subtype, file_type, max_score, number, parent_id, h5p_id, h5p_sub_id, status } =
              contentObj[content_id!];
            return {
              answer,
              attempted,
              content_id,
              score,
              content_name,
              content_type,
              content_subtype,
              file_type,
              max_score,
              number,
              parent_id,
              h5p_id,
              h5p_sub_id,
              status,
              outcomes: outcomes?.map((item) => {
                if(outcomeObj[item.outcome_id!]) {
                  const { assumed, outcome_name, assigned_to } = outcomeObj[item.outcome_id!];
                  return {
                    ...item,
                    assumed,
                    outcome_name,
                    assigned_to,
                  };
                } else {
                  return {
                    ...item
                  }
                }
              }),
            };
          }),
      };
    });
    return studentViewItems;
  },
  getReviewStudentsItems(students: DetailAssessmentResult["diff_content_students"]): StudentViewItemsProps[] | undefined {
    const reviewStudentsItems:StudentViewItemsProps[] | undefined = students?.map(item => {
      const  { status, student_id, student_name, reviewer_comment, results } = item;
      return {
        status, student_id, student_name, reviewer_comment, 
        results: results?.map(rItem => {
          const { answer, attempted, score, content } = rItem;
          return {
            answer,
            attempted,
            score,
            ...content,
          }
        })
      }
    })
    return reviewStudentsItems;
  },
  getOverallOutcomes(studentViewItems: StudentViewItemsProps[] | undefined): OverAllOutcomesItem[] {
    let outcomeView: Record<string, OverAllOutcomesItem> = {};
    let overAllOutcomes: OverAllOutcomesItem[] = [];
    studentViewItems?.forEach((sItem) => {
      const { student_id } = sItem;
      sItem.results?.forEach((rItem) => {
        if (rItem.content_type === "LessonMaterial") {
          rItem.outcomes?.forEach((oItem) => {
            const { outcome_id, status, outcome_name, assumed, assigned_to } = oItem;
            if (!outcomeView[outcome_id!]) {
              outcomeView[outcome_id!] = {
                outcome_id,
                outcome_name,
                assumed,
                assigned_to,
                attendance_ids: status === OutcomeStatus.Achieved ? [student_id!] : [],
                not_attendance_ids: status !== OutcomeStatus.Achieved ? [student_id!] : [],
                partial_attendance_ids: [],
                none_achieved: status === OutcomeStatus.NotAchieved,
                skip: status === OutcomeStatus.NotCovered,
              };
            } else {
              const { none_achieved, skip, attendance_ids, not_attendance_ids } = outcomeView[outcome_id!];
              outcomeView[outcome_id!].none_achieved = status === "NotAchieved" && none_achieved;
              outcomeView[outcome_id!].skip = status === "NotCovered" && skip;
              const a_index = attendance_ids?.indexOf(student_id!) ?? -1;
              const n_index = not_attendance_ids?.indexOf(student_id!) ?? -1;
              if (status === "Achieved") {
                if (a_index < 0 && n_index < 0) {
                  outcomeView[outcome_id!].attendance_ids?.push(student_id!);
                }
                if (n_index >= 0) {
                  outcomeView[outcome_id!].partial_attendance_ids?.push(student_id!);
                  if (a_index >= 0) {
                    outcomeView[outcome_id!].attendance_ids?.splice(a_index, 1);
                  }
                }
              } else {
                if (a_index >= 0) {
                  outcomeView[outcome_id!].partial_attendance_ids?.push(student_id!);
                  outcomeView[outcome_id!].attendance_ids?.splice(a_index, 1);
                }
                if (n_index < 0) {
                  outcomeView[outcome_id!].not_attendance_ids?.push(student_id!);
                }
              }
            }
          });
        } else {
          rItem.outcomes?.forEach((oItem) => {
            const { outcome_id, status, outcome_name, assumed, assigned_to } = oItem;
            if (oItem.assigned_to?.length === 1) {
              if (!outcomeView[outcome_id!]) {
                outcomeView[outcome_id!] = {
                  outcome_id,
                  outcome_name,
                  assumed,
                  assigned_to,
                  attendance_ids: status === OutcomeStatus.Achieved ? [student_id!] : [],
                  not_attendance_ids: [],
                  partial_attendance_ids: [],
                  none_achieved: status === OutcomeStatus.NotAchieved,
                  skip: status === OutcomeStatus.NotCovered,
                };
              } else {
                const { none_achieved, skip, attendance_ids = [] } = outcomeView[outcome_id!];
                outcomeView[outcome_id!].none_achieved = status === OutcomeStatus.NotAchieved && none_achieved;
                outcomeView[outcome_id!].skip = status === OutcomeStatus.NotCovered && skip;
                const a_index = attendance_ids?.indexOf(student_id!) ?? -1;
                if (status === OutcomeStatus.Achieved) {
                  if (a_index < 0) {
                    outcomeView[outcome_id!].attendance_ids?.push(student_id!);
                  }
                } else {
                  if (a_index >= 0) {
                    outcomeView[outcome_id!].attendance_ids?.splice(a_index, 1);
                  }
                }
              }
            }
          });
        }
      });
    });
    overAllOutcomes = Object.values(outcomeView);
    return overAllOutcomes;
  },
  getMaterialViewItems(
    contents: DetailAssessmentResult["contents"],
    students: DetailAssessmentResult["students"],
    studentViewItems?: StudentViewItemsProps[]
  ): MaterialViewItemResultProps[] {
    const materialViewObj: Record<string, MaterialViewItemResultProps> = {};
    let materialViewItems: MaterialViewItemResultProps[] = [];
    studentViewItems?.forEach((sItem) => {
      const { student_id, student_name } = sItem;
      sItem.results
        ?.filter((r) => r.content_type === "LessonMaterial" || r.content_type === "Unknown")
        .forEach((rItem) => {
          const {
            content_id,
            content_name,
            number,
            content_subtype,
            answer,
            score,
            max_score,
            file_type,
            parent_id,
            outcomes,
            status,
            attempted,
            h5p_id,
            h5p_sub_id,
          } = rItem;
          if (!materialViewObj[content_id!]) {
            materialViewObj[content_id!] = {
              content_id,
              content_name,
              content_subtype,
              number,
              max_score,
              file_type,
              parent_id,
              status,
              attempted,
              h5p_id,
              h5p_sub_id,
              students: [
                {
                  student_id,
                  student_name,
                  answer,
                  score,
                  attempted,
                  status: sItem.status,
                },
              ],
              outcomes: outcomes?.map((oItem) => {
                const { outcome_id, outcome_name, assumed, status } = oItem;
                return {
                  outcome_id,
                  outcome_name,
                  assumed,
                  status,
                  attendance_ids: status === OutcomeStatus.Achieved ? [student_id!] : [],
                };
              }),
            };
          } else {
            materialViewObj[content_id!].students?.push({ student_id, student_name, answer, score, attempted, status: sItem.status });
            materialViewObj[content_id!].outcomes = materialViewObj[content_id!].outcomes?.map((oItem) => {
              const currOutcome = outcomes?.find((item) => item.outcome_id === oItem.outcome_id);
              const _attendance_ids = oItem.attendance_ids ?? [];
              let n_attendance_ids: string[] = [];
              if (currOutcome?.status === OutcomeStatus.Achieved) {
                n_attendance_ids = [..._attendance_ids, student_id!];
              }
              return {
                ...oItem,
                attendance_ids: currOutcome?.status === OutcomeStatus.Achieved ? n_attendance_ids : _attendance_ids,
              };
            });
          }
        });
    });
    materialViewItems = Object.values(materialViewObj);
    return materialViewItems;
  },
  getInitSubDimension(dimension: Dimension, studentViewItems: any[] | undefined): SubDimensionOptions[] | undefined {
    if (dimension === Dimension.student) {
      return studentViewItems?.filter(student => student.status === StudentParticipate.Participate).map((item) => {
        return { id: item.student_id!, name: item.student_name! };
      });
    } else {
      if (studentViewItems && studentViewItems[0] && studentViewItems[0].result) {
        return studentViewItems[0].result
          .filter((item: { content_type: string; status: string; parent_id: string; }) => item.content_type === "LessonMaterial" && item.status === "Covered" && item.parent_id === "")
          .map((item: { content_id: any; content_name: any; }) => {
            return { id: item.content_id!, name: item.content_name! };
          });
      } else {
        return [];
      }

    }
  },
  getUpdateAssessmentData(assessment_type: AssessmentTypeValues ,contents?: V2AssessmentContentReply[], students?: StudentViewItemsProps[]) {
    const isReivew = assessment_type === AssessmentTypeValues.review;
    const _contents =
      contents?.map((item) => {
        const { content_id, content_subtype, content_type, parent_id, status, reviewer_comment } = item;
        return {
          content_id,
          content_subtype,
          content_type,
          parent_id,
          status,
          reviewer_comment,
        };
      }) ?? [];
    const _students =
      students?.map((item) => {
        const { student_id, status, reviewer_comment, results } = item;
        return {
          student_id,
          reviewer_comment,
          status,
          results: results?.map((rItem) => {
            const { content_id, parent_id, score, outcomes } = rItem;
            return {
              content_id,
              parent_id,
              score,
              outcomes: isReivew ? undefined : outcomes?.map((oItem) => {
                const { outcome_id, status } = oItem;
                return {
                  outcome_id,
                  status,
                };
              }),
            };
          }),
        };
      }) ?? [];
    return { _contents, _students };
  },
  getCompleteStatus(studentViewItems?: StudentViewItemsProps[]) {
    let hasNotAttemptArr: boolean[] = [];
    if (studentViewItems && studentViewItems[0]) {
      hasNotAttemptArr = studentViewItems.map((item) => {
        let all: number = 0;
        let attempt: number = 0;
        if (item.results && item.results[0]) {
          item.results.forEach((v) => {
            if (v.content_type === "LessonMaterial") {
              if (v.h5p_id) {
                all += 1;
                if (v.attempted) {
                  attempt += 1;
                }
              }
            }
          });
        }
        const hasNotAttempt = all && attempt && all > attempt ? true : false;
        return hasNotAttempt;
      });
    }
    return !!hasNotAttemptArr.find((item) => item);
  },
  getCompleteRateV2(studentViewItems?: StudentViewItemsProps[]) {
    let all: number = 0;
    let attempt: number = 0;
    if (studentViewItems && studentViewItems[0]) {
      studentViewItems.forEach((item) => {
        if (item.results && item.results[0]) {
          item.results.forEach((v) => {
            if (v.h5p_id) {
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
};

export type UpdateStudyAssessmentDataOmitAction = Omit<UpdataStudyAssessmentRequestData, "action">;
