/* eslint-disable array-callback-return */
import { d } from "@locale/LocaleManager";
import { LinkedMockOptionsItem } from "@reducers/contentEdit/programsHandler";
import { getScheduleParticipantsMockOptionsResponse } from "@reducers/schedule";
import { Status } from "../api/api-ko-schema.auto";
import { GetClassFilterListQuery, GetProgramsQuery, GetUserQuery, ParticipantsByClassQuery } from "../api/api-ko.auto";
import { EntityContentInfoWithDetails, EntityScheduleFilterClass, ModelPublishedOutcomeView } from "../api/api.auto";
import {
  ClassOptionsItem,
  EntityScheduleSchoolInfo,
  EntityScheduleShortInfo,
  FilterQueryTypeProps,
  LearningComesFilterQuery,
  ParticipantsData,
  ParticipantsShortInfo,
  RolesData,
} from "../types/scheduleTypes";

type filterParameterMatchType = "classType" | "subjectSub" | "program" | "class" | "other" | "user";
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
    user: "user_ids",
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
    const filterQuery: FilterQueryTypeProps = { class_types: [], class_ids: [], subject_ids: [], program_ids: [], user_ids: [] };
    stateOnlyMine.forEach((value: string) => {
      const [label, id] = value.split("+");
      const matchValue = this.FILTER_PARAMETER_MATCH[label as filterParameterMatchType];
      if (id !== "All" && matchValue) filterQuery[matchValue as filterValueMatchType].push(id);
    });
    return filterQuery;
  }

  /**
   * Set Initialization Assembly Filter Parameter
   * @param school
   * @param others
   * @constructor
   */
  static SetInitializationAssemblyFilterParameter(school: EntityScheduleSchoolInfo[], others: EntityScheduleFilterClass[]) {
    const set = [];
    school.forEach((classs) => {
      if (classs.classes.length > 1) set.push(`class+All+${classs.school_id}`);
      classs.classes.forEach((item) => {
        set.push(`class+${item.class_id}+${classs.school_id}`);
      });
    });
    others.forEach((item) => {
      set.push(`other+${item.id}`);
    });
    if (others.length > 1) set.push(`class+All+Others`);
    return set;
  }

  static AssemblyLearningOutcome(outcomeList: ModelPublishedOutcomeView[]) {
    return outcomeList.map((item) => {
      return {
        id: item.outcome_id,
        name: item.outcome_name,
        shortCode: item.shortcode,
        assumed: item.assumed,
        learningOutcomeSet: item.sets ?? [],
        select: false,
        category_ids: item.category_ids,
        sub_category_ids: item.sub_category_ids,
      };
    });
  }

  static FilterParticipants(ParticipantsDatas: ParticipantsData | undefined, ClassRoster: ParticipantsByClassQuery) {
    const rosterIdSet = { students: [], teachers: [] };
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
          ParticipantsDatas?.classes.students.filter((item: RolesData) => !rosterIdSet.students.includes(item.user_id as never))
        ),
        teachers: deDuplication(
          ParticipantsDatas?.classes.teachers.filter((item: RolesData) => !rosterIdSet.teachers.includes(item.user_id as never))
        ),
      },
    } as ParticipantsData;
  }

  static classDataConversion(
    userId: string,
    schoolId: string,
    schools: EntityScheduleSchoolInfo[],
    role: boolean,
    classesConnection?: GetClassFilterListQuery
  ) {
    const data: { class_id: string; class_name: string; showIcon: boolean }[] = [];
    let school_name = "";
    let school_id = "";
    let onlyMine = false;
    schools.forEach((item) => {
      if (item.school_id === schoolId) {
        school_name = item.school_name;
        school_id = item.school_id;
        item.classes.forEach((classs) => {
          const isExistStudent = classs.students.filter((studen: RolesData) => {
            return studen.user_id === userId;
          });
          const isExistTeacher = classs.teachers.filter((teacher: RolesData) => {
            return teacher.user_id === userId;
          });
          if (!onlyMine) onlyMine = !role && (isExistTeacher.length > 0 || isExistStudent.length > 0);
          if (classs.status === "active")
            data.push({ class_id: classs.class_id, class_name: classs.class_name, showIcon: isExistStudent.length > 0 });
        });
      }
    });
    return { school_name: school_name, school_id: school_id, classes: data, onlyMine: onlyMine };
  }

  static classDataConversion2(school_name: string, school_id: string, classesConnection?: GetClassFilterListQuery) {
    const data: { class_id: string; name: string; showIcon: boolean }[] = [];
    classesConnection?.classesConnection?.edges?.forEach((item) => {
      data.push({ class_id: item?.node?.id!, name: item?.node?.name!, showIcon: false });
    });
    return { school_name: school_name, school_id: school_id, classes: data, onlyMine: false };
  }

  static classDataConversion3(school_name: string, unserConnection?: GetUserQuery) {
    const data: { class_id: string; name: string; showIcon: boolean }[] = [];
    unserConnection?.usersConnection?.edges?.forEach((item) => {
      data.push({ class_id: item?.node?.id!, name: `${item?.node?.givenName!} ${item?.node?.familyName!}`, showIcon: false });
    });
    return { school_name: school_name, school_id: "", classes: data, onlyMine: false };
  }

  static learningOutcomeFilerGroup(filterQuery?: LearningComesFilterQuery, programChildInfo?: GetProgramsQuery[]) {
    const initValue = { id: "1", name: d("Select All").t("schedule_detail_select_all") };
    const assembly = { subjects: [], categorys: [], subs: [], ages: [], grades: [] };
    const query = {
      programs: [],
      subjects: [],
      categorys: [],
      subs: [],
      ages: filterQuery?.ages as string[],
      grades: filterQuery?.grades as string[],
    };
    const is_active = (status: Status | null | undefined) => status === "active";
    programChildInfo?.forEach((item) => {
      if (!filterQuery?.programs.includes(item.program?.id as string)) return;
      query.programs.push(item.program?.id as never);
      item.program?.age_ranges?.map((age) => {
        if (is_active(age.status)) assembly.ages.push(age as never);
        if (filterQuery?.ages.includes("1")) query.ages?.push(age.id as never);
      });
      item.program?.grades?.map((grade) => {
        if (is_active(grade.status)) assembly.grades.push(grade as never);
        if (filterQuery?.grades.includes("1")) query.grades?.push(grade.id as never);
      });
      item.program?.subjects?.map((subject) => {
        if (is_active(subject.status)) assembly.subjects.push({ id: subject.id, name: subject.name } as never);
        if (!filterQuery?.subjects.includes(subject.id as string) && !filterQuery?.subjects.includes("1")) return;
        query.subjects.push(subject.id as never);
        subject.categories?.map((category) => {
          if (is_active(category.status)) assembly.categorys.push({ id: category.id, name: category.name } as never);
          if (!filterQuery?.categorys.includes(category.id as string) && !filterQuery?.categorys.includes("1")) return;
          query.categorys.push(category.id as never);
          category.subcategories?.map((sub) => {
            if (is_active(sub.status)) assembly.subs.push({ id: sub.id, name: sub.name } as never);
            if (!filterQuery?.subs.includes(sub.id as string) && !filterQuery?.subs.includes("1")) return;
            query.subs.push(sub.id as never);
          });
        });
      });
    });
    Object.keys(assembly).forEach((key) => {
      if (assembly[key as "subjects" | "categorys" | "subs" | "ages" | "grades"].length > 1) {
        if (
          assembly[key as "subjects" | "categorys" | "subs" | "ages" | "grades"].length ===
          query[key as "subjects" | "categorys" | "subs" | "ages" | "grades"].length
        )
          query[key as "programs" | "subjects" | "categorys" | "subs" | "ages" | "grades"].unshift("1" as never);
        assembly[key as "subjects" | "categorys" | "subs" | "ages" | "grades"].unshift(initValue as never);
      }
    });
    query.programs = filterQuery?.programs as never;
    return { query, assembly };
  }
  static getLearingOutcomeCategory(list: LinkedMockOptionsItem[], ids: string[]) {
    return list.filter((item) => ids.includes(item.id as string));
  }
}
