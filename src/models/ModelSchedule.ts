import { EntityScheduleClassesInfo, EntityScheduleSchoolInfo, EntityScheduleShortInfo } from "../types/scheduleTypes";
import { EntityContentInfoWithDetails } from "../api/api.auto";

interface AssociationStructureProps {
  program: EntityScheduleShortInfo[];
  subject: EntityScheduleShortInfo[];
}

export class modelSchedule {
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
}
