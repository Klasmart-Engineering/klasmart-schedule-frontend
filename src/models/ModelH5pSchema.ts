import jsSHA from "jssha";

export const H5P_ROOT_NAME = 'ROOT';

export enum H5PItemType {
  library = 'library',
  group = 'group',
  list = 'list',
}

type H5PLeafContent = string | number | boolean;
type H5PGroupContent = {
  [key in string]: H5PItemContent;
}

export interface H5PLibraryContent {
  params: Record<string, H5PItemContent>;
  library: string;
  subContentId: string;
}

export type H5PListContent = H5PItemContent[];

export type H5PItemContent = H5PLeafContent | H5PGroupContent | H5PLibraryContent | H5PListContent;

export interface H5PLeafSemantic {
  name: string;
  type: string;
  default?: H5PLeafContent;
}

export type H5PLibrarySemantic = H5PLeafSemantic;

export interface H5PListSemantic extends H5PLeafSemantic {
  field: H5PItemSemantic;
}

export interface H5PGroupSemantic extends H5PLeafSemantic {
  fields: H5PItemSemantic[];
}

export type H5PItemSemantic = H5PLeafSemantic | H5PListSemantic | H5PGroupSemantic | H5PLibrarySemantic;

export interface MapHandler<T> {
  (itemInfo: H5PItemInfo, children: T[]): T;
}

export interface H5PItemInfo {
  path: string;
  content?: H5PItemContent;
  semantics: H5PItemSemantic;
}

interface H5PLibraryInfo {
  path: string;
  content: H5PLibraryContent;
  semantics: H5PItemSemantic;
}

export type H5PSchema = Record<string, H5PItemSemantic[]>


export const h5pItemMapper = <T>(h5pItemInfo: H5PItemInfo, schema: H5PSchema,  mapHandler: MapHandler<T>): T => {
  const { path, content, semantics } = h5pItemInfo;
  switch (semantics.type) {
    case H5PItemType.library:  
      const libraryContent = content as H5PLibraryContent;
      if (!libraryContent || !libraryContent.library) return mapHandler({ path, content, semantics }, []);
      const librarySemantics = schema[libraryContent.library.replace(' ', '-')];
      const libChildren = librarySemantics.map((itemSemantics) => {
        const { name } = itemSemantics;
        const subItemInfo: H5PItemInfo = {
          path: path ? `${path}.${name}` : name,
          content: libraryContent.params[name],
          semantics: itemSemantics,
        };
        return h5pItemMapper(subItemInfo, schema, mapHandler);
      });
      return mapHandler({ path, content, semantics }, libChildren);
    case H5PItemType.list:
      if (!content) return mapHandler({ path, content, semantics }, []);
      const listContent = content as H5PListContent;
      const listSemantics = semantics as H5PListSemantic;
      if (!listContent) {
        debugger;
      }
      const listChildren = listContent.map((subContent, idx) => {
        const subItemInfo: H5PItemInfo = {
          path: `${path}[${idx}]`,
          content: subContent,
          semantics: listSemantics.field
        };
        return h5pItemMapper(subItemInfo, schema, mapHandler);
      })
      return mapHandler({ path, content, semantics }, listChildren);
    case H5PItemType.group:
      const groupContent = content as H5PGroupContent | undefined;
      const groupSemantics = semantics as H5PGroupSemantic;
      const groupChildren = groupSemantics.fields.map((itemSemantics) => {
        const subItemInfo: H5PItemInfo = {
          path: path ? `${path}.${itemSemantics.name}` : itemSemantics.name,
          content: groupContent ? groupContent[itemSemantics.name] : undefined,
          semantics: itemSemantics,
        };
        return h5pItemMapper(subItemInfo, schema, mapHandler);
      });
      return mapHandler({ path, content, semantics }, groupChildren);
    default:
      return mapHandler({ path, content, semantics }, []);
  }
}

const sha1 = (str: string) => {
  const sha = new jsSHA("SHA-1", "TEXT", { encoding: "UTF8" });
  sha.update(str);
  return sha.getHash('HEX');
}

export const mapH5PContent: MapHandler<any> = (itemInfo, childList) => {
  let value: any;
  const { path, content, semantics } = itemInfo;
  switch(semantics.type) {
    case H5PItemType.list:
      value = childList;
      break;
    case H5PItemType.group:
      value = childList.reduce((r, child) => Object.assign(r, child), {});
      break;
    case H5PItemType.library:  
      if (!content) break;
      const libraryContent = content as H5PLibraryContent;
      const params = childList.reduce((r, child) => Object.assign(r, child), {});
      const subContentId = sha1(JSON.stringify(params));
      const contentType = `yyyy ${libraryContent.library}`;
      const metadata = { contentType, license: "U", title: "", authors: [], changes: [], extraTitle: "" };
      value = { params, library: libraryContent.library, subContentId, metadata };
      break;
    default: 
      const leafSemantic = semantics as H5PLeafSemantic;
      value = content || leafSemantic.default;
  }
  return semantics.name === H5P_ROOT_NAME ? value : {[semantics.name]: value};
}

