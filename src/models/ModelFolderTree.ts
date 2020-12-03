import { RecursiveFolderItem } from "../api/extra";

export function excludeFolderOfTree(folders: RecursiveFolderItem[], folderIds: string[]): RecursiveFolderItem[] {
  if (!folderIds) return folders;
  return folders
    .filter((folder) => !folderIds.includes(folder.id as string))
    .map((folder) => {
      const next = excludeFolderOfTree(folder.next, folderIds);
      return { ...folder, next };
    });
}
