import { ConnectionPageInfo, Program, Subject } from "@api/api-ko-schema.auto";
import { GetProgramsAndSubjectsDocument, GetProgramsAndSubjectsQuery, GetProgramsAndSubjectsQueryVariables } from "@api/api-ko.auto";
import { apiWaitForOrganizationOfPage } from "@api/extra";
import { gqlapi } from "@api/index";
import { grepActiveQueryResult, orderByASC } from "@utilities/dataUtilities";

type ProgramItem = Pick<Program, "id" | "name" | "subjects" | "grades" | "age_ranges"> & { ageRanges: Program["age_ranges"] };
type SubjectItem = Pick<Subject, "id" | "name">;

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

export default (function () {
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
