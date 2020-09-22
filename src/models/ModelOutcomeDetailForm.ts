import { ApiOutcomeView } from "../api/api.auto";

export const modelOutcomeDetail = (outcomeDetail: ApiOutcomeView) => {
  const afterData = JSON.parse(JSON.stringify(outcomeDetail));
  const { program, subject, developmental, skills, age, grade } = outcomeDetail;
  if (program && program.length) {
    afterData.program = program.map((item: any) => item.program_id);
    afterData.program = afterData.program.filter((item: string) => item);
  }
  if (subject && subject.length) {
    afterData.subject = subject.map((item: any) => item.subject_id);
    afterData.subject = afterData.subject.filter((item: string) => item);
  }
  if (developmental && developmental.length) {
    afterData.developmental = developmental.map((item: any) => item.developmental_id);
    afterData.developmental = afterData.developmental.filter((item: string) => item);
  }
  if (skills && skills.length) {
    afterData.skills = skills.map((item: any) => item.skill_id);
    afterData.skills = afterData.skills.filter((item: string) => item);
  }
  if (age && age.length) {
    afterData.age = age.map((item: any) => item.age_id);
    afterData.age = afterData.age.filter((item: string) => item);
  }
  if (grade && grade.length) {
    afterData.grade = grade.map((item: any) => item.grade_id);
    afterData.grade = afterData.grade.filter((item: string) => item);
  }
  return afterData;
};
