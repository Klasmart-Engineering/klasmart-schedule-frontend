import api from "../../../api";

type NonOnlyNull<T> = T extends null ? never : T;
type NonNullRecordValue<T> = {
  [K in keyof T]: NonOnlyNull<T[K]>;
};

export type StudyAssessmentQueryCondition = NonNullRecordValue<
  NonNullable<Parameters<typeof api.h5PAssessments.listH5PAssessments>[0]>
>;
export type StudyAssessmentQueryConditionChangeHandler = (value: StudyAssessmentQueryCondition) => any;
export type StudyAssessmentQueryConditionBaseProps = {
  onChange: StudyAssessmentQueryConditionChangeHandler;
  value: StudyAssessmentQueryCondition;
};
