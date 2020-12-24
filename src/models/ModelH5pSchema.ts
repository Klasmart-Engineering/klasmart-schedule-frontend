import jsSHA from "jssha";
import cloneDeep from 'lodash/cloneDeep';

export const H5P_ROOT_NAME = 'ROOT';

export enum H5PItemType {
  library = 'library',
  group = 'group',
  list = 'list',
  text = 'text',
  number = 'number',
  boolean = 'boolean',
  select = 'select',
  image = 'image',
  video = 'video',
  audio = 'audio',
  file = 'file',
}

interface IH5PCopyright {
  license: string;
}

export type H5PLeafContent = H5PTextContent | H5PNumberContent | H5PBooleanContent | H5PSelectContent | H5PMediaContent;

export type H5PTextContent = string | undefined;
export type H5PNumberContent = number | undefined;
export type H5PBooleanContent = boolean | undefined;
export type H5PSelectContent = string | undefined;
export type H5PMediaContent = {
  path: string;
  mime: string;
  copyright?: IH5PCopyright;
  width?: number;
  height?: number;
} | undefined;

export type H5PGroupContent = {
  [key in string]: H5PItemContent;
} | undefined

export type H5PLibraryContent = {
  params?: Record<string, H5PItemContent>;
  library: string;
  subContentId?: string;
} | undefined;

export type H5PListContent = H5PItemContent[] | undefined;

export type H5PItemContent = H5PLeafContent | H5PGroupContent | H5PLibraryContent | H5PListContent ;

export type H5PContentBySemantics<S extends H5PItemSemantic> = 
  S extends H5PLeafSemantic ? H5PLeafContent :
  S extends H5PListSemantic ? H5PListContent :
  S extends H5PGroupSemantic ? H5PGroupContent :
  S extends H5PLibrarySemantic ? H5PLibraryContent :
  never;

export interface IH5PRegexp {
  pattern: string,
  modifiers?: "i" | "g"
};

export interface IH5PImportant {
  description: string
  example: string
}

export enum H5PImportance {
  'low' = 'low',
  'medium' = 'medium',
  'high' = 'high',
}

export interface H5PBaseSemantic {
  name: string;
  label?: string;
  description?: string;
  optional?: boolean;
  importance?: H5PImportance;
  common?: boolean;
  widget?: string;
}

export interface H5PTextSemantic extends H5PBaseSemantic {
  type: H5PItemType.text;
  default?: string;
  maxLength?: number;
  regexp?: IH5PRegexp;
  enterMode?: string;
  tags?: string[];
  font?: unknown;
  important?: IH5PImportant;
}

export interface H5PNumberSemantic extends H5PBaseSemantic {
  type: H5PItemType.number;
  default?: number;
  min?: number;
  max?: number;
  steps?: number;
  decimals?: number;
}

export interface H5PBooleanSemantic extends H5PBaseSemantic {
  type: H5PItemType.boolean;
  default?: boolean;
}

export interface H5PSelectSemantic extends H5PBaseSemantic {
  type: H5PItemType.select;
  default?: string;
  options: { value: string, label: string }[];
}

export interface H5PMediaSemantic extends H5PBaseSemantic {
  type: H5PItemType.image | H5PItemType.video | H5PItemType.audio | H5PItemType.file;
  default?: undefined;
}

export type H5PLeafSemantic = H5PTextSemantic | H5PNumberSemantic | H5PBooleanSemantic | H5PSelectSemantic | H5PMediaSemantic;

export interface H5PLibrarySemantic extends H5PBaseSemantic {
  type: H5PItemType.library;
  options?: string[];
};

export interface H5PListSemantic extends Omit<H5PBaseSemantic, 'widget'> {
  type: H5PItemType.list;
  field: H5PItemSemantic;
  entity?: string;
  widgets?: any[];
  min?: number;
  max?: number;
  defaultNum?: number;
}

export interface H5PGroupSemantic extends H5PBaseSemantic {
  type: H5PItemType.group;
  fields: H5PItemSemantic[];
  isSubContent?: boolean;
  expanded?: boolean;
}

export type H5PItemSemantic = H5PLeafSemantic | H5PListSemantic | H5PGroupSemantic | H5PLibrarySemantic;

export interface MapHandler<T> {
  (itemInfo: H5PItemInfo, children: T[], context: { schema?: H5PSchema }): T;
}

export interface H5PItemInfo {
  path: string;
  content?: H5PItemContent;
  semantics: H5PItemSemantic;
}

export interface H5PLibraryInfo {
  path: string;
  content: H5PLibraryContent;
  semantics: H5PItemSemantic;
}


export type H5PSchema = Record<string, H5PItemSemantic[]>

export const h5pName2libId = (option: string) => option.replace(' ', '-');

export const h5pItemMapper = <T>(h5pItemInfo: H5PItemInfo, schema: H5PSchema | undefined,  mapHandler: MapHandler<T>): T => {
  const { path, content, semantics } = h5pItemInfo;
  if (!schema) return mapHandler({ path, content, semantics }, [], { schema });
  switch (semantics.type) {
    case H5PItemType.library:  
      const libraryContent = content as H5PLibraryContent;
      if (!libraryContent || !libraryContent.library) return mapHandler({ path, content, semantics }, [], { schema });
      const librarySemantics = schema[h5pName2libId(libraryContent.library)];
      const libChildren = librarySemantics.map((itemSemantics) => {
        const { name } = itemSemantics;
        const subItemInfo: H5PItemInfo = {
          path: path ? `${path}.params.${name}` : `params.${name}`,
          content: libraryContent.params?.[name],
          semantics: itemSemantics,
        };
        return h5pItemMapper(subItemInfo, schema, mapHandler);
      });
      return mapHandler({ path, content, semantics }, libChildren, { schema });
    case H5PItemType.list:
      if (!content) return mapHandler({ path, content, semantics }, [], { schema });
      const listContent = (content as H5PListContent) ?? [];
      const listChildren = listContent.map((subContent, idx) => {
        const subItemInfo: H5PItemInfo = {
          path: `${path}[${idx}]`,
          content: subContent,
          semantics: semantics.field
        };
        return h5pItemMapper(subItemInfo, schema, mapHandler);
      })
      return mapHandler({ path, content, semantics }, listChildren, { schema });
    case H5PItemType.group:
      const groupContent = content as H5PGroupContent;
      const groupChildren = semantics.fields.map((itemSemantics) => {
        const subItemInfo: H5PItemInfo = {
          path: path ? `${path}.${itemSemantics.name}` : itemSemantics.name,
          content: groupContent ? groupContent[itemSemantics.name] : undefined,
          semantics: itemSemantics,
        };
        return h5pItemMapper(subItemInfo, schema, mapHandler);
      });
      return mapHandler({ path, content, semantics }, groupChildren, { schema });
    default:
      return mapHandler({ path, content, semantics }, [], { schema });
  }
}

const sha1 = (str: string) => {
  const sha = new jsSHA("SHA-1", "TEXT", { encoding: "UTF8" });
  sha.update(str);
  return sha.getHash('HEX');
}

export const mapH5PContent: MapHandler<H5PItemContent> = (itemInfo, childList, { schema }) => {
  let value: H5PItemContent;
  if (!schema) return itemInfo.content;
  const { path, content, semantics } = itemInfo;
  switch(semantics.type) {
    case H5PItemType.list:
      value = childList.length > 0 ? childList : createDefaultListContent(semantics, schema);
      break;
    case H5PItemType.group:
      value = childList.reduce((r, child) => Object.assign(r, child), {});
      break;
    case H5PItemType.library:  
      const libraryContent = content as H5PLibraryContent;
      if (!libraryContent) break;
      const params = childList.reduce((r, child) => Object.assign(r, child), {});
      const subContentId = sha1(JSON.stringify(params));
      const contentType = `yyyy ${libraryContent.library}`;
      const metadata = { contentType, license: "U", title: "", authors: [], changes: [], extraTitle: "" };
      value = { params, library: libraryContent.library, subContentId, metadata };
      break;
    default: 
      value = content || semantics.default;
  }
  return semantics.name === H5P_ROOT_NAME ? value : {[semantics.name]: value};
}


export function createDefaultLibraryContent(library: string, schema: H5PSchema): H5PLibraryContent {
  const semantics: H5PLibrarySemantic = { type: H5PItemType.library, name: H5P_ROOT_NAME };
  return h5pItemMapper({ path: '', content: { library }, semantics }, schema, mapH5PContent) as H5PLibraryContent;
}

export function createDefaultListContent(semantics: H5PListSemantic, schema: H5PSchema): H5PListContent {
  const { field, defaultNum, min } = semantics;
  const amount = defaultNum ?? min ?? 1;
  const defaultContent = h5pItemMapper({ path: '', semantics: field }, schema, mapH5PContent);
  return Array(amount).fill(1).map(() => cloneDeep(defaultContent));
}