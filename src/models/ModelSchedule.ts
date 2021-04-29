import { EntityScheduleClassesInfo, EntityScheduleSchoolInfo, EntityScheduleShortInfo, FilterQueryTypeProps } from "../types/scheduleTypes";
import { EntityContentInfoWithDetails, EntityScheduleFilterClass } from "../api/api.auto";

type filterParameterMatchType = "classType" | "subjectSub" | "program" | "class" | "other";
type filterValueMatchType = "class_types" | "subject_ids" | "program_ids" | "class_ids";

interface AssociationStructureProps {
  program: EntityScheduleShortInfo[];
  subject: EntityScheduleShortInfo[];
}

export class modelSchedule {
  /**
   * Filtering parameter values to match fields
   */
  static FILTER_PARAMETER_MATCH = {
    classType: "class_types",
    subjectSub: "subject_ids",
    program: "program_ids",
    class: "class_ids",
    other: "class_ids",
  };

  /**
   * Assembly of program and subject data
   * @param contentPreview
   * @constructor
   */
  static LinkageLessonPlan(contentPreview: EntityContentInfoWithDetails): AssociationStructureProps {
    const program: EntityScheduleShortInfo[] = [{ id: contentPreview.program as string, name: contentPreview.program_name as string }];
    const subject: EntityScheduleShortInfo[] = [
      { id: contentPreview.subject![0] ?? ("" as string), name: contentPreview.subject_name![0] ?? ("" as string) },
    ];
    return { program, subject };
  }

  /**
   * Filtering duplicate data
   * @param childItem
   * @constructor
   */
  static Deduplication(childItem: EntityScheduleShortInfo[]): EntityScheduleShortInfo[] {
    const reduceTemporaryStorage: { [id: string]: boolean } = {};
    return childItem.reduce<EntityScheduleShortInfo[]>((item, next) => {
      if (next !== null)
        if (!reduceTemporaryStorage[next.id as string] && next.id) {
          item.push(next);
          reduceTemporaryStorage[next.id as string] = true;
        }
      return item;
    }, []);
  }

  /**
   * Get School Full Selection Status
   * @param SchoolDigitalAll
   * @param SchoolDigital
   * @constructor
   */
  static FilterSchoolDigital(SchoolDigitalAll: EntityScheduleSchoolInfo[], SchoolDigital: string[]) {
    const fullElection: { id: string; status: boolean }[] = [];
    SchoolDigitalAll?.forEach((schoolItem: EntityScheduleSchoolInfo) => {
      let isElectionAll = true;
      schoolItem.classes.forEach((classItem: EntityScheduleClassesInfo) => {
        if (classItem.status === "inactive") return;
        const includes = SchoolDigital.filter((id: string) => {
          return id.includes(classItem.class_id);
        });
        if (includes.length < 1) isElectionAll = false;
      });
      fullElection.push({ id: schoolItem.school_id, status: isElectionAll });
    });
    return fullElection;
  }

  /**
   *  Get Other Full Selection Status in filter
   * @param OtherDigitalAll
   * @param OtherDigital
   * @constructor
   */
  static FilterOtherDigital(OtherDigitalAll: EntityScheduleFilterClass[], OtherDigital: string[]) {
    let fullElectionStatus: boolean = true;
    OtherDigitalAll.forEach((classItem: EntityScheduleFilterClass) => {
      const includes = OtherDigital.filter((id: string) => {
        return id.includes(classItem.id as string);
      });
      if (includes.length < 1) fullElectionStatus = false;
    });
    return fullElectionStatus;
  }

  /**
   *  Assembly filtration parameters
   * @param stateOnlyMine
   * @constructor
   */
  static AssemblyFilterParameter(stateOnlyMine: string[]) {
    const filterQuery: FilterQueryTypeProps = { class_types: "", class_ids: "", subject_ids: "", program_ids: "" };
    stateOnlyMine.forEach((value: string) => {
      const nodeValue = value.split("+");
      const matchValue = this.FILTER_PARAMETER_MATCH[nodeValue[0] as filterParameterMatchType];
      if (nodeValue[1] !== "All" && matchValue) filterQuery[matchValue as filterValueMatchType] += `${nodeValue[1]},`;
    });
    return filterQuery;
  }
}
