import { LearningOutcomes } from "../api/api";

export const modelOutcomeDetail = (outcomeDetail: LearningOutcomes) => {
  const afterData = JSON.parse(JSON.stringify(outcomeDetail));
  const { program, subject, developmental, skills, age, grade } = outcomeDetail;
  if (program && program.length) {
    afterData.program = program.map((item: any) => item.program_id);
  }
  if (subject && subject.length) {
    afterData.subject = subject.map((item: any) => item.subject_id);
  }
  if (developmental && developmental.length) {
    afterData.developmental = developmental.map((item: any) => item.developmental_id);
  }
  if (skills && skills.length) {
    afterData.skills = skills.map((item: any) => item.skill_id);
  }
  if (age && age.length) {
    afterData.age = age.map((item: any) => item.age_id);
  }
  if (grade && grade.length) {
    afterData.grade = grade.map((item: any) => item.grade_id);
  }
  return afterData;
};
