import { EntityFolderContent } from "../api/api.auto";
import { ContentType } from "../api/type";

export function removeOrDelete(contents: EntityFolderContent[], ids: string[]) {
  // eslint-disable-next-line array-callback-return
  const types = contents.map((item) => {
    if (ids.includes(item.id as string)) return item.content_type;
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
