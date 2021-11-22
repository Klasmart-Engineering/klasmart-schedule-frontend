import { LinkedMockOptions, LinkedMockOptionsItem } from "@reducers/contentEdit/programsHandler";
import {
  ModelAge,
  ModelAuthorView,
  ModelCategory,
  ModelGrade,
  ModelOrganizationView,
  ModelOutcomeView,
  ModelProgram,
  ModelSubCategory,
  ModelSubject,
} from "../api/api.auto";
import { MilestoneDetailResult } from "../api/type";
import { Regulation } from "../pages/MilestoneEdit/type";

interface CreateDefaultValueProps {
  regulation: Regulation;
  milestoneDetail: MilestoneDetailResult;
  linkedMockOptions: LinkedMockOptions;
}

type PartialDefaultValueAndKeyResult = {
  [key in keyof MilestoneDetailResult]: {
    key: string;
    value: string[] | string | undefined;
  };
};
export interface CreateDefaultValueAndKeyResult extends PartialDefaultValueAndKeyResult {}
export class ModelMilestoneOptions {
  static createSelectKey(
    options: LinkedMockOptionsItem[] | undefined = [],
    ...args: (
      | string[]
      | string
      | number
      | boolean
      | undefined
      | ModelProgram[]
      | ModelSubject[]
      | ModelCategory[]
      | ModelSubCategory[]
      | ModelAge[]
      | ModelGrade[]
      | ModelAuthorView
      | ModelOrganizationView
      | ModelOutcomeView[]
    )[]
  ): string {
    return args
      .map((x) => (Array.isArray(x) ? x.join(",") : x))
      .concat(options.map((x) => x.id) as string[])
      .filter((x) => x)
      .join(",");
  }
  // static createDefaultValue(props: CreateDefaultValueProps,
  //   name: "program" | "subject" | "category" | "sub_category" | "age" | "grade"): string[]{
  //   const {regulation, milestoneDetail, linkedMockOptions} = props;
  //   const  value = milestoneDetail[name] && milestoneDetail[name]?.length ? milestoneDetail[name]?.map(v => v[`${name}_id`]).filter((item) => item) : []
  //   return [];
  // }

  static createDefaultValueAndKey(props: CreateDefaultValueProps): CreateDefaultValueAndKeyResult {
    const { regulation, milestoneDetail, linkedMockOptions } = props;
    const result: CreateDefaultValueAndKeyResult = {};
    Object.keys(milestoneDetail).forEach((x) => {
      const name = x as keyof MilestoneDetailResult;
      switch (name) {
        case "program":
          const programValue =
            milestoneDetail.program && milestoneDetail.program[0]
              ? milestoneDetail.program?.map((v) => v.program_id as string).filter((item) => item)
              : [];
          // const programDefaultValue =
          //   linkedMockOptions.program && linkedMockOptions.program[0] ? [linkedMockOptions.program[0].id || ""] : [];
          result[name] = {
            key: ModelMilestoneOptions.createSelectKey(linkedMockOptions.program, programValue, name),
            value: regulation === Regulation.ByMilestoneDetail ? programValue : [],
          };
          break;
        case "subject":
          const subjectValue =
            milestoneDetail.subject && milestoneDetail.subject[0]
              ? milestoneDetail.subject?.map((v) => v.subject_id as string).filter((item) => item)
              : [];
          // const subjectdefaultValue =
          //   linkedMockOptions.subject && linkedMockOptions.subject[0] ? [linkedMockOptions.subject[0].id || ""] : [];
          result[name] = {
            key: ModelMilestoneOptions.createSelectKey(linkedMockOptions.subject, subjectValue, name),
            value: regulation === Regulation.ByMilestoneDetail ? subjectValue : [],
          };
          break;
        case "category":
          const categoryValue =
            milestoneDetail.category && milestoneDetail.category[0]
              ? milestoneDetail.category?.map((v) => v.category_id as string).filter((item) => item)
              : [];
          // const categorydefaultValue =
          //   linkedMockOptions.developmental && linkedMockOptions.developmental[0] ? [linkedMockOptions.developmental[0].id || ""] : [];
          result[name] = {
            key: ModelMilestoneOptions.createSelectKey(linkedMockOptions.developmental, categoryValue, name),
            value: regulation === Regulation.ByMilestoneDetail ? categoryValue : [],
          };
          break;
        case "sub_category":
          const sub_categoryValue =
            milestoneDetail.sub_category && milestoneDetail.sub_category[0]
              ? milestoneDetail.sub_category?.map((v) => v.sub_category_id as string).filter((item) => item)
              : [];
          // const sub_categorydefaultValue =
          //   linkedMockOptions.skills && linkedMockOptions.skills[0] ? [linkedMockOptions.skills[0].id || ""] : [];
          result[name] = {
            key: ModelMilestoneOptions.createSelectKey(linkedMockOptions.skills, sub_categoryValue, name),
            value: regulation === Regulation.ByMilestoneDetail ? sub_categoryValue : [],
          };
          break;
        case "age":
          const ageValue =
            milestoneDetail.age && milestoneDetail.age[0] ? milestoneDetail.age?.map((v) => v.age_id as string).filter((item) => item) : [];
          // const agedefaultValue = linkedMockOptions.age && linkedMockOptions.age[0] ? [linkedMockOptions.age[0].id || ""] : [];
          result[name] = {
            key: ModelMilestoneOptions.createSelectKey(linkedMockOptions.age, ageValue, name),
            value: regulation === Regulation.ByMilestoneDetail ? ageValue : [],
          };
          break;
        case "grade":
          const gradeValue =
            milestoneDetail.grade && milestoneDetail.grade[0]
              ? milestoneDetail.grade?.map((v) => v.grade_id as string).filter((item) => item)
              : [];
          // const gradedefaultValue = linkedMockOptions.grade && linkedMockOptions.grade[0] ? [linkedMockOptions.grade[0].id || ""] : [];
          result[name] = {
            key: ModelMilestoneOptions.createSelectKey(linkedMockOptions.grade, gradeValue, name),
            value: regulation === Regulation.ByMilestoneDetail ? gradeValue : [],
          };
          break;
        case "outcomes":
          break;
        default:
          result[name] = {
            key: ModelMilestoneOptions.createSelectKey([], milestoneDetail[name], name),
            value: milestoneDetail[name] as any,
          };
      }
    });
    return result;
  }
}
