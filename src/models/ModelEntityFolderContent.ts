import { EntityFolderContent, EntityFolderIdWithFileType } from "../api/api.auto";
import { ContentType, FolderFileTyoe } from "../api/type";
import { Segment } from "./ModelLessonPlan";

function toHash(contents: EntityFolderContent[], ids: string[]): Record<string, EntityFolderContent> {
  return contents.reduce((result, content) => {
    result[content.id as string] = content;
    return result;
  }, {} as Record<string, EntityFolderContent>);
}

export function ids2removeOrDelete(contents: EntityFolderContent[], ids: string[]) {
  const obj = {
    folder: false,
    notFolder: false,
    bothHave: false,
  };
  if (!ids || ids.length === 0) return obj;
  const arr = ids2Content(contents, ids);
  if (arr.findIndex((item) => !item) !== -1) return obj;
  if (arr && arr.every((item) => item.content_type === ContentType.folder)) {
    obj.folder = true;
    obj.notFolder = false;
    obj.bothHave = false;
  } else if (arr.every((item) => item.content_type !== ContentType.folder)) {
    obj.notFolder = true;
    obj.folder = false;
    obj.bothHave = false;
  } else {
    obj.folder = false;
    obj.notFolder = false;
    obj.bothHave = true;
  }
  return obj;
}

export function ids2Content(contents: EntityFolderContent[], ids: string[]): EntityFolderContent[] {
  const hash = toHash(contents, ids);
  return ids.map((id) => hash[id]);
}

export function content2FileType(contents: EntityFolderContent[] | undefined): EntityFolderIdWithFileType[] {
  if (!contents) return [];
  return contents.map((item) => {
    return {
      folder_file_type: item.content_type === ContentType.folder ? FolderFileTyoe.folder : FolderFileTyoe.content,
      id: item.id,
    };
  });
}

export function segment2Ids(segment: Segment, content_ids: string[]) {
  if (segment.materialId) content_ids.push(segment.materialId);
  if (segment.next && segment.next.length) {
    segment2Ids(segment.next[0], content_ids);
  }
}

export function content2ids(contents: EntityFolderContent[], ids: string[]) {
  if (!ids) return [];
  const contentsArr = ids2Content(contents, ids);
  const content_ids: string[] = [];
  contentsArr.forEach((item) => {
    content_ids.push(item.id as string);
    if (item.data) {
      const segment: Segment = JSON.parse(item.data);
      segment2Ids(segment, content_ids);
    }
  });
  return content_ids;
}
