import { UseFormMethods } from "react-hook-form";
import { MockOptions, MockOptionsItem } from "../api/extra";
import { LinkedMockOptions } from "../reducers/content";

export interface FlattenedMockOptionsOnlyOption extends Omit<LinkedMockOptions, "program_id" | "developmental_id"> {}

export type GetOnlyOneOptionValueResult = {
  [Key in keyof FlattenedMockOptionsOnlyOption]?: MockOptionsItem["id"][];
};

interface GetReportFirstValueResult {
  teacher_id: string;
  class_id: string;
}

export class ModelMockOptions {
  static updateValuesWhenProgramChange(
    setValue: UseFormMethods["setValue"],
    mockOptions: LinkedMockOptions,
    programId: MockOptionsItem["id"]
  ): boolean {
    const { developmental_id: defaultDevelopmentalId, program, subject, developmental, skills, grade, age } = mockOptions;
    if (!defaultDevelopmentalId || !programId) return false;
    setValue("developmental", [defaultDevelopmentalId]);
    ["subject", "skills", "age", "grade"].forEach((name) => setValue(name, []));
    const onlyOneOptionValue = ModelMockOptions.getOnlyOneOptionValue({ program, subject, developmental, skills, grade, age });
    Object.keys(onlyOneOptionValue).forEach((item) => {
      const value = onlyOneOptionValue[item as keyof FlattenedMockOptionsOnlyOption];
      if (value) setValue(item, value);
    });

    return true;
  }

  static getOnlyOneOptionValue(MockOptionsOnly: FlattenedMockOptionsOnlyOption): GetOnlyOneOptionValueResult {
    return Object.keys(MockOptionsOnly).reduce((result, key) => {
      const name = key as keyof GetOnlyOneOptionValueResult;
      if (MockOptionsOnly[name]?.length !== 1) return result;
      result[name] = MockOptionsOnly[name]?.map((item) => item.id as string);
      return result;
    }, {} as GetOnlyOneOptionValueResult);
  }

  static getReportFirstValue(mockOptions: MockOptions): GetReportFirstValueResult {
    if (mockOptions.teacher_class_relationship.length) {
      const teacher_id = mockOptions.teacher_class_relationship[0].teacher_id;
      const class_id = mockOptions.teacher_class_relationship[0].class_ids[0];
      return { teacher_id, class_id };
    }
    return { teacher_id: "", class_id: "" };
  }
}
