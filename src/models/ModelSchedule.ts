import { EntityScheduleShortInfo } from "../types/scheduleTypes";
import { EntityContentInfoWithDetails } from "../api/api.auto";

interface AssociationStructureProps {
  program: EntityScheduleShortInfo[];
  subject: EntityScheduleShortInfo[];
}

export class modelSchedule {
  static LinkageLessonPlan(contentPreview: EntityContentInfoWithDetails): AssociationStructureProps {
    const program: EntityScheduleShortInfo[] = [{ id: contentPreview.program as string, name: contentPreview.program_name as string }];
    const subject: EntityScheduleShortInfo[] = [
      { id: contentPreview.subject![0] ?? ("" as string), name: contentPreview.subject_name![0] ?? ("" as string) },
    ];
    return { program, subject };
  }
}
