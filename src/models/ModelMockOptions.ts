import { UseFormMethods } from "react-hook-form";
import { apiFetchClassByTeacher, MockOptions, MockOptionsItem, MockOptionsOptionsItem } from "../api/extra";

interface ToFlattenPropsInput {
  programId: string;
  developmentalId: string;
}

export interface FlattenedMockOptions extends Omit<MockOptions, "options">, Omit<MockOptionsOptionsItem, "developmental" | "program"> {
  program: MockOptionsItem[];
  developmental: MockOptionsItem[];
  skills: MockOptionsItem[];
}
export interface FlattenedMockOptionsOnlyOption extends Omit<MockOptionsOptionsItem, "developmental" | "program"> {
  program: MockOptionsItem[];
  developmental: MockOptionsItem[];
  skills: MockOptionsItem[];
}

export type GetOnlyOneOptionValueResult = {
  [Key in keyof FlattenedMockOptionsOnlyOption]?: MockOptionsItem["id"][];
};

interface GetReportFirstValueResult {
  first_teacher_id: string;
  first_class_id: string;
}

export class ModelMockOptions {
  static toFlatten(input: ToFlattenPropsInput, mockOptions: MockOptions): FlattenedMockOptions {
    const { options: originOptions, ...restMockOptions } = mockOptions;
    const program = originOptions.map((item) => item.program);
    const option = originOptions.find((item) => item.program.id === input.programId);
    const emptyOption = ModelMockOptions.getEmptyOptions();
    if (!option) return { ...restMockOptions, ...emptyOption, program };
    const foundDevelopmental = option.developmental.find((item) => item.id === input.developmentalId);
    if (!foundDevelopmental) return { ...restMockOptions, ...option, program, developmental: [], skills: [] };
    const { skills } = foundDevelopmental;
    const developmental = option.developmental.map(({ id, name }) => ({ id, name }));
    return { ...restMockOptions, ...option, skills, developmental, program };
  }

  static getDefaultProgramId(mockOptions: MockOptions): MockOptionsItem["id"] | undefined {
    return mockOptions.options[0]?.program.id;
  }

  static getDefaultDevelopmental(mockOptions: MockOptions, programId?: MockOptionsItem["id"]): MockOptionsItem["id"] | undefined {
    const option = mockOptions.options.find((item) => item.program.id === programId);
    if (!option) return;
    return option.developmental[0]?.id;
  }

  static updateValuesWhenProgramChange(
    setValue: UseFormMethods["setValue"],
    mockOptions: MockOptions,
    programId: MockOptionsItem["id"]
  ): boolean {
    const defaultDevelopmentalId = ModelMockOptions.getDefaultDevelopmental(mockOptions, programId);
    if (!defaultDevelopmentalId || !programId) return false;
    setValue("developmental", [defaultDevelopmentalId]);
    ["subject", "skills", "age", "grade"].forEach((name) => setValue(name, []));
    const { program, subject, developmental, skills, grade, age } = ModelMockOptions.toFlatten(
      { programId, developmentalId: defaultDevelopmentalId },
      mockOptions
    );
    const onlyOneOptionValue = ModelMockOptions.getOnlyOneOptionValue({ program, subject, developmental, skills, grade, age });
    Object.keys(onlyOneOptionValue).forEach((item) => {
      const value = onlyOneOptionValue[item as keyof FlattenedMockOptionsOnlyOption];
      if (value) setValue(item, value);
    });

    return true;
  }

  static getEmptyOptions(): Pick<FlattenedMockOptions, "subject" | "developmental" | "skills" | "age" | "grade"> {
    return {
      subject: [],
      developmental: [],
      skills: [],
      age: [],
      grade: [],
    };
  }

  static getOnlyOneOptionValue(flattenedMockOptions: FlattenedMockOptionsOnlyOption): GetOnlyOneOptionValueResult {
    return Object.keys(flattenedMockOptions).reduce((result, key) => {
      const name = key as keyof GetOnlyOneOptionValueResult;
      if (flattenedMockOptions[name].length !== 1) return result;
      result[name] = flattenedMockOptions[name].map((item) => item.id);
      return result;
    }, {} as GetOnlyOneOptionValueResult);
  }

  static getReportFirstValue(mockOptions: MockOptions): GetReportFirstValueResult {
    if (mockOptions.teacher_class_relationship.length) {
      const first_teacher_id = mockOptions.teacher_class_relationship[0].teacher_id;
      const classlist = apiFetchClassByTeacher(mockOptions, first_teacher_id);
      const first_class_id = (classlist && classlist[0] && classlist[0].id) || "";
      return { first_teacher_id, first_class_id };
    }
    return { first_teacher_id: "", first_class_id: "" };
  }
}
