import { EntityFolderContent } from "../api/api.auto";
import { ContentType } from "../api/type";

function toHash(contents: EntityFolderContent[], ids: string[]): Record<string, EntityFolderContent> {
  return contents.reduce((result, content) => {
    result[content.id as string] = content;
    return result;
  }, {} as Record<string, EntityFolderContent>);
}

export function ids2removeOrDelete(contents: EntityFolderContent[], ids: string[]) {
  const types = contents.map((item) => {
    if (ids.includes(item.id as string)) return item.content_type;
    return null;
  });
  if (
    types.every((item) => {
      return item === ContentType.folder;
    })
  )
    return "folder";
  if (
    types.every((item) => {
      return item === ContentType.material || item === ContentType.plan;
    })
  )
    return "plama";
  return "foplma";
}

export function ids2Content(contents: EntityFolderContent[], ids: string[]): EntityFolderContent[] {
  const hash = toHash(contents, ids);
  return ids.map((id) => hash[id]);
}
