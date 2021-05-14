import {
  ClassOptionsItem,
  EntityScheduleClassesInfo,
  EntityScheduleSchoolInfo,
  EntityScheduleShortInfo,
  FilterQueryTypeProps,
  ParticipantsData,
  ParticipantsShortInfo,
  RolesData,
} from "../types/scheduleTypes";
import { EntityContentInfoWithDetails, EntityScheduleFilterClass } from "../api/api.auto";
import { getScheduleParticipantsMockOptionsResponse } from "../reducers/schedule";
import { ParticipantsByClassQuery } from "../api/api-ko.auto";

type filterParameterMatchType = "classType" | "subjectSub" | "program" | "class" | "other";
type filterValueMatchType = "class_types" | "subject_ids" | "program_ids" | "class_ids";

interface AssociationStructureProps {
  program: EntityScheduleShortInfo[];
  subject: EntityScheduleShortInfo[];
}

enum ClassRosterSelectType {
  selectAll = 1,
  unselectAll = 2,
  notFullySelect = 3,
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
          return id.includes(`${classItem.class_id}+${schoolItem.school_id}`);
        });
        if (!includes.length) isElectionAll = false;
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
      if (!includes.length) fullElectionStatus = false;
    });
    return fullElectionStatus;
  }

  /**
   * Get Class Roster Full Selection Status in edit
   * @param classRosterCheck
   * @param classRosterAll
   * @constructor
   */
  static ClassRosterDigital(
    classRosterCheck: ParticipantsShortInfo | undefined,
    classRosterAll: getScheduleParticipantsMockOptionsResponse
  ) {
    const classRosterDataNum = (
      classRosterAll?.participantList?.class?.students?.concat(classRosterAll?.participantList?.class?.teachers!) ?? []
    ).length;
    const filterDataNum = (
      classRosterCheck?.student.concat(classRosterCheck.teacher).map((item: ClassOptionsItem) => {
        return item.id;
      }) ?? []
    ).length;
    if (classRosterDataNum === filterDataNum) return ClassRosterSelectType.selectAll;
    if (!filterDataNum) return ClassRosterSelectType.unselectAll;
    return ClassRosterSelectType.notFullySelect;
  }

  /**
   *  Assembly filtration parameters
   * @param stateOnlyMine
   * @constructor
   */
  static AssemblyFilterParameter(stateOnlyMine: string[]) {
    const filterQuery: FilterQueryTypeProps = { class_types: "", class_ids: "", subject_ids: "", program_ids: "" };
    stateOnlyMine.forEach((value: string) => {
      const [label, id] = value.split("+");
      const matchValue = this.FILTER_PARAMETER_MATCH[label as filterParameterMatchType];
      if (id !== "All" && matchValue) filterQuery[matchValue as filterValueMatchType] += `${id},`;
    });
    return filterQuery;
  }

  static FilterParticipants(
    ParticipantsDatas: ParticipantsData | undefined,
    ClassRoster: ParticipantsByClassQuery,
    is_org: boolean,
    mySchoolId: string[]
  ) {
    const rosterIdSet = { students: [], teachers: [] };
    const isVested = (item: any): boolean => {
      if (is_org) return true;
      return item.some((list: any) => mySchoolId.includes(list.school_id));
    };
    const deDuplication = (arr: any) => {
      const obj: any = [];
      return arr.reduce((item: any, next: any) => {
        if (!obj[next.user_id]) {
          item.push(next);
          obj[next.user_id] = true;
        }
        return item;
      }, []);
    };
    ClassRoster?.class?.students?.forEach((item) => {
      rosterIdSet.students.push(item?.user_id as never);
    });
    ClassRoster?.class?.teachers?.forEach((item) => {
      rosterIdSet.teachers.push(item?.user_id as never);
    });
    return {
      classes: {
        students: deDuplication(
          ParticipantsDatas?.classes.students.filter(
            (item: RolesData) => !rosterIdSet.students.includes(item.user_id as never) && isVested(item.school_memberships)
          )
        ),
        teachers: deDuplication(
          ParticipantsDatas?.classes.teachers.filter(
            (item: RolesData) => !rosterIdSet.teachers.includes(item.user_id as never) && isVested(item.school_memberships)
          )
        ),
      },
    } as ParticipantsData;
  }
}
