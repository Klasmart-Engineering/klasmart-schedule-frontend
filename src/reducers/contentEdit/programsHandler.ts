import { AgeRange, ConnectionPageInfo, Grade, Program, Subject } from "@api/api-ko-schema.auto";
import { GetProgramsAndSubjectsDocument, GetProgramsAndSubjectsQuery, GetProgramsAndSubjectsQueryVariables } from "@api/api-ko.auto";
import { ExternalCategory, ExternalSubCategory } from "@api/api.auto";
import { apiWaitForOrganizationOfPage } from "@api/extra";
import api, { gqlapi } from "@api/index";
import { LoadingMetaPayload } from "@reducers/middleware/loadingMiddleware";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { grepActiveQueryResult, orderByASC } from "@utilities/dataUtilities";
import get from "lodash/get";

type ProgramItem = Pick<Program, "id" | "name" | "subjects" | "grades" | "age_ranges"> & { ageRanges: Program["age_ranges"] };
type SubjectItem = Pick<Subject, "id" | "name">;
type GradeItem = Pick<Grade, "id" | "name">;
type AgeRangeItem = Pick<AgeRange, "id" | "name">;

export interface LinkedMockOptionsItem {
  id?: string;
  name?: string;
  group?: string;
}
export interface LinkedMockOptions {
  program?: LinkedMockOptionsItem[];
  subject?: LinkedMockOptionsItem[];
  developmental?: LinkedMockOptionsItem[];
  age?: LinkedMockOptionsItem[];
  grade?: LinkedMockOptionsItem[];
  skills?: LinkedMockOptionsItem[];
  program_id?: string;
  developmental_id?: string;
}

interface LinkedMockOptionsPayload extends LoadingMetaPayload {
  default_program_id?: string;
  default_subject_ids?: string;
  default_developmental_id?: string;
}

async function _getPrograms(
  cursor: string
): Promise<[Pick<ConnectionPageInfo, "hasNextPage" | "endCursor"> | undefined | null, ProgramItem[]]> {
  const organization_id = (await apiWaitForOrganizationOfPage()) as string;
  const resp = await gqlapi.query<GetProgramsAndSubjectsQuery, GetProgramsAndSubjectsQueryVariables>({
    query: GetProgramsAndSubjectsDocument,
    variables: {
      organization_id,
      count: 50,
      cursor,
    },
  });
  const data = grepActiveQueryResult<GetProgramsAndSubjectsQuery>(resp);
  let programs: ProgramItem[] = [];
  data.programsConnection?.edges?.forEach((item) => {
    const node = item?.node;
    if (node) {
      programs.push(node as unknown as ProgramItem);
    }
  });
  let pageInfo = data.programsConnection?.pageInfo;
  return [pageInfo, programs];
}

async function getAllPrograms() {
  let result: ProgramItem[] = [];
  let end = false;
  let cursor = "";
  while (!end) {
    const [pageInfo, programs] = await _getPrograms(cursor);
    result = result.concat(programs);
    if (!pageInfo || !pageInfo.hasNextPage) {
      end = true;
    } else {
      cursor = pageInfo.endCursor as string;
    }
  }
  return orderByASC(result, "name");
}

const programsHandler = (function () {
  let instance: Promise<ProgramItem[]>;
  function getPrograms() {
    if (!instance) {
      instance = getAllPrograms();
    }
    return instance;
  }
  return {
    async getProgramsOptions(
      includeSubject = false
    ): Promise<Pick<ProgramItem, "id" | "name" | "subjects">[] | Pick<ProgramItem, "id" | "name">[]> {
      const programs = await getPrograms();
      if (includeSubject) {
        return programs
          .filter((item) => (item?.subjects || []).length > 0)
          .map(
            (item) =>
              ({
                id: item.id,
                name: item.name,
                subjects: item.subjects,
              } as Pick<ProgramItem, "id" | "name" | "subjects">)
          );
      } else {
        return programs
          .filter((item) => (item?.subjects || []).length > 0)
          .map(
            (item) =>
              ({
                id: item.id,
                name: item.name,
              } as Pick<ProgramItem, "id" | "name">)
          );
      }
    },
    async getProgramById(id: string): Promise<ProgramItem | undefined> {
      const programs = await getPrograms();
      return programs.find((item) => item.id === id);
    },

    async getSubjectAgeGradeByProgramId(id: string): Promise<[SubjectItem[], AgeRangeItem[], GradeItem[]]> {
      const programItem = await this.getProgramById(id);
      const subjects = get(programItem, "subjects", []) as SubjectItem[];
      const ageRanges = get(programItem, "ageRanges", []) as AgeRangeItem[];
      const grades = get(programItem, "grades", []) as GradeItem[];
      return [subjects, ageRanges, grades];
    },

    async getAllSubjects(includeProgramName = false): Promise<SubjectItem[]> {
      const programs = await getPrograms();

      const subjects = programs.reduce((acc, item) => {
        return acc.concat(
          (item?.subjects || []).map((subject) => ({
            id: subject.id,
            name: `${includeProgramName ? item.name + " - " : ""}${subject.name}`,
          }))
        );
      }, [] as SubjectItem[]);
      return orderByASC(subjects, "name");
    },
  };
})();

const _getLinkedMockOptions = (key: string) =>
  createAsyncThunk<LinkedMockOptions, LinkedMockOptionsPayload>(
    key,
    async function ({ default_program_id, default_subject_ids, default_developmental_id }: LinkedMockOptionsPayload) {
      const program = await programsHandler.getProgramsOptions();

      const program_id = default_program_id ? default_program_id : program[0].id;

      if (program_id) {
        const [subject, age, grade] = await programsHandler.getSubjectAgeGradeByProgramId(program_id);
        const subject_ids = default_subject_ids ? default_subject_ids : subject.length > 0 ? subject[0].id : undefined;
        if (!subject_ids) {
          return { program, subject: [], developmental: [], age: [], grade: [], skills: [], program_id: "", developmental_id: "" };
        }
        const [developmental, skills, developmental_id] = await getDevelopmentalAndSkills(
          program_id,
          subject_ids,
          default_developmental_id
        );
        return { program, subject, developmental, age, grade, skills, program_id, developmental_id };
      } else {
        return { program, subject: [], developmental: [], age: [], grade: [], skills: [], program_id: "", developmental_id: "" };
      }
    }
  );

const getDevelopmentalAndSkills = async (
  programId: string,
  subjectIds: string,
  defaultDevelopmentalId?: string
): Promise<[ExternalCategory[], ExternalSubCategory[], string | undefined]> => {
  const developmental = await api.developmentals.getDevelopmental({ program_id: programId, subject_ids: subjectIds });
  const developmentalId = defaultDevelopmentalId || developmental[0].id;
  const skills = developmentalId ? await api.skills.getSkill({ program_id: programId, developmental_id: developmentalId }) : [];
  return [developmental, skills, developmentalId];
};

export default programsHandler;
export { _getLinkedMockOptions, getDevelopmentalAndSkills };
