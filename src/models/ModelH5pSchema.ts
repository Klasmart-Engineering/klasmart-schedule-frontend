/* eslint-disable no-labels */

import jsSHA from "jssha";
import cloneDeep from "lodash/cloneDeep";

export const H5P_ROOT_NAME = "ROOT";

export enum H5PItemType {
  library = "library",
  group = "group",
  list = "list",
  text = "text",
  number = "number",
  boolean = "boolean",
  select = "select",
  image = "image",
  video = "video",
  audio = "audio",
  file = "file",
}

interface IH5PCopyright {
  license: string;
}

export type H5PLeafContent = H5PTextContent | H5PNumberContent | H5PBooleanContent | H5PSelectContent | H5PMediaContent;

export type H5PTextContent = string | undefined;
export type H5PNumberContent = number | undefined;
export type H5PBooleanContent = boolean | undefined;
export type H5PSelectContent = string | undefined;
export type H5PMediaContent =
  | {
      path: string;
      mime: string;
      copyright?: IH5PCopyright;
      width?: number;
      height?: number;
    }
  | undefined;

export type H5PVideoContent = H5PMediaContent;
export type H5PAudioContent = H5PMediaContent;
export type H5PImageContent = H5PMediaContent;
export type H5PFileContent = H5PMediaContent;

export type H5PGroupContent =
  | {
      [key in string]: H5PItemContent;
    }
  | undefined;

interface H5PLibraryMetadata {
  defaultLanguage?: string;
  language?: string;
  authors?: string[];
  changes?: string[];
  contentType?: string;
  extraTitle?: string;
  license?: string;
  title?: string;
}
export type H5PLibraryContent =
  | {
      params?: Record<string, H5PItemContent>;
      library: string;
      subContentId?: string;
      metadata?: H5PLibraryMetadata;
    }
  | undefined;

export type H5PListContent = H5PItemContent[] | undefined;

export type H5PItemContent = H5PLeafContent | H5PGroupContent | H5PLibraryContent | H5PListContent;

export type H5PContentBySemantics<S extends H5PItemSemantic> = S extends H5PTextSemantic
  ? H5PTextContent
  : S extends H5PNumberSemantic
  ? H5PNumberContent
  : S extends H5PBooleanSemantic
  ? H5PBooleanContent
  : S extends H5PSelectSemantic
  ? H5PSelectContent
  : S extends H5PMediaSemantic
  ? H5PMediaContent
  : S extends H5PListSemantic
  ? H5PListContent
  : S extends H5PGroupSemantic
  ? H5PGroupContent
  : S extends H5PLibrarySemantic
  ? H5PLibraryContent
  : never;

export interface IH5PRegexp {
  pattern: string;
  modifiers?: "i" | "g";
}

export interface IH5PImportant {
  description: string;
  example: string;
}

export enum H5PImportance {
  "low" = "low",
  "medium" = "medium",
  "high" = "high",
}

export interface H5PBaseSemantic {
  name: string;
  label?: string;
  description?: string;
  optional?: boolean;
  importance?: H5PImportance;
  common?: boolean;
  widget?: H5PWidgetTitle;
  extra?: Record<string, any>;
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
  options: { value: string; label: string }[];
}

export interface H5PMediaSemantic extends H5PBaseSemantic {
  type: H5PItemType.image | H5PItemType.video | H5PItemType.audio | H5PItemType.file;
  default?: undefined;
}
export type H5PImageSemantic = H5PMediaSemantic;
export type H5PVideoSemantic = H5PMediaSemantic;
export type H5PAudioSemantic = H5PMediaSemantic;
export type H5PFileSemantic = H5PMediaSemantic;

export type H5PLeafSemantic = H5PTextSemantic | H5PNumberSemantic | H5PBooleanSemantic | H5PSelectSemantic | H5PMediaSemantic;

export interface H5PLibrarySemantic extends H5PBaseSemantic {
  type: H5PItemType.library;
  options?: string[];
}

export interface H5PListSemantic extends Omit<H5PBaseSemantic, "widget"> {
  type: H5PItemType.list;
  field: H5PItemSemantic;
  entity?: string;
  widgets?: { name: H5PWidgetTitle; label: string }[];
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

export enum H5PWidgetTitle {
  showWhen = "showWhen",
  html = "html",
}

export type H5PItemSemantic =
  | H5PTextSemantic
  | H5PNumberSemantic
  | H5PBooleanSemantic
  | H5PSelectSemantic
  | H5PImageSemantic
  | H5PVideoSemantic
  | H5PAudioSemantic
  | H5PFileSemantic
  | H5PListSemantic
  | H5PGroupSemantic
  | H5PLibrarySemantic;

export interface MapHandlerContext {
  schema?: H5PSchema;
}

export interface MapHandlerProps<C, H extends H5PItemHelper = H5PItemHelper> {
  itemHelper: H;
  children: C[];
  context: MapHandlerContext;
}
export interface MapHandler<T, C = T, H extends H5PItemHelper = H5PItemHelper> {
  (props: MapHandlerProps<C, H>): T;
}

export type H5PItemHelper<S extends H5PItemSemantic = H5PItemSemantic> = S extends any
  ? H5PItemInfo<S> & {
      parentItem: H5PItemHelper | undefined;
      childItems: H5PItemHelper[];
    }
  : never;

interface H5PItemMapperResult<T> {
  itemHelper: H5PItemHelper;
  result: T;
}

export type H5PItemInfo<S extends H5PItemSemantic = H5PItemSemantic> = S extends any
  ? {
      path: string;
      content?: H5PContentBySemantics<S>;
      semantics: S;
    }
  : never;

export const rootParent = function () {};

export interface H5PLibraryInfo {
  path: string;
  content: H5PLibraryContent;
  semantics: H5PLibrarySemantic;
}

export type H5PSchema = Record<string, H5PItemSemantic[]>;

export const h5pName2libId = (option: string) => option.replace(" ", "-");

export function h5pItemMapper<T>(itemInfo: H5PItemInfo, schema: H5PSchema | undefined, mapHandler: MapHandler<T>): H5PItemMapperResult<T> {
  const context = { schema };
  const children: T[] = [];
  const childItems: H5PItemHelper[] = [];
  const itemHelper: H5PItemHelper = { ...itemInfo, parentItem: undefined, childItems };
  let subItemInfoList: H5PItemInfo[] = [];
  if (!schema) return { itemHelper, result: mapHandler({ itemHelper, children, context }) };
  if (isH5pLibraryItemInfo(itemInfo))
    libraryBlock: {
      const { content, path } = itemInfo;
      if (!content || !content.library) break libraryBlock;
      const librarySemantics = schema[h5pName2libId(content.library)];
      subItemInfoList = librarySemantics.map(
        (itemSemantics) =>
          ({
            path: path ? `${path}.params.${itemSemantics.name}` : `params.${itemSemantics.name}`,
            content: content.params?.[itemSemantics.name],
            semantics: itemSemantics,
          } as H5PItemInfo)
      );
    }
  else if (isH5pListItemInfo(itemInfo))
    listBlock: {
      const { content = [], semantics, path } = itemInfo;
      if (content.length === 0) break listBlock;
      subItemInfoList = content.map(
        (subContent, idx) =>
          ({
            path: `${path}[${idx}]`,
            content: subContent,
            semantics: semantics.field,
          } as H5PItemInfo)
      );
    }
  else if (isH5pGroupItemInfo(itemInfo)) {
    const { content, semantics, path } = itemInfo;
    subItemInfoList = semantics.fields.map(
      (itemSemantics) =>
        ({
          path: path ? `${path}.${itemSemantics.name}` : itemSemantics.name,
          content: content ? content[itemSemantics.name] : undefined,
          semantics: itemSemantics,
        } as H5PItemInfo)
    );
  }
  subItemInfoList.forEach((subItemInfo) => {
    const { itemHelper: subItemHelper, result } = h5pItemMapper(subItemInfo, schema, mapHandler);
    subItemHelper.parentItem = itemHelper;
    childItems.push(subItemHelper);
    children.push(result);
  });
  return { itemHelper, result: mapHandler({ itemHelper, children, context }) };
}

const sha1 = (str: string) => {
  const sha = new jsSHA("SHA-1", "TEXT", { encoding: "UTF8" });
  sha.update(str);
  return sha.getHash("HEX");
};

export const mapH5PContentOrigin: MapHandler<H5PItemContent> = (props) => {
  const {
    itemHelper,
    children,
    context: { schema },
  } = props;
  let value: H5PItemContent;
  if (!schema) return itemHelper.content;
  if (isH5pListItemInfo(itemHelper)) {
    const { semantics } = itemHelper;
    value = children.length > 0 ? children : createDefaultListContent(semantics, schema);
  } else if (isH5pGroupItemInfo(itemHelper)) {
    value = children.reduce((r, child) => Object.assign(r, child), {});
  } else if (isH5pLibraryItemInfo(itemHelper))
    libraryBlock: {
      const { content } = itemHelper;
      if (!content) break libraryBlock;
      const params = children.reduce((r, child) => Object.assign(r, child), {}) as Record<string, H5PItemContent>;
      const subContentId = sha1(JSON.stringify(params));
      const contentType = `yyyy ${content.library}`;
      const metadata: H5PLibraryMetadata = { contentType, license: "U", title: "", authors: [], changes: [], extraTitle: "" };
      value = { params, library: content.library, subContentId, metadata };
    }
  else {
    const { content, semantics } = itemHelper;
    value = content || semantics.default;
  }
  return itemHelper.semantics.name === H5P_ROOT_NAME || itemHelper.parentItem?.semantics.type === H5PItemType.list
    ? value
    : { [itemHelper.semantics.name]: value };
};

export const mapH5PContent: MapHandler<H5PItemContent> = (props) => {
  const {
    itemHelper,
    children,
    context: { schema },
  } = props;
  let value: H5PItemContent;
  if (!schema) return itemHelper.content;
  if (isH5pListItemInfo(itemHelper)) {
    const { semantics } = itemHelper;
    value = children.length > 0 ? children : createDefaultListContent(semantics, schema);
  } else if (isH5pGroupItemInfo(itemHelper)) {
    value = children.length === 1 ? Object.values(children[0] ?? {})[0] : children.reduce((r, child) => Object.assign(r, child), {});
  } else if (isH5pLibraryItemInfo(itemHelper))
    libraryBlock: {
      const { content } = itemHelper;
      if (!content) break libraryBlock;
      const params = children.reduce((r, child) => Object.assign(r, child), {}) as Record<string, H5PItemContent>;
      const subContentId = sha1(JSON.stringify(params));
      const contentType = `yyyy ${content.library}`;
      const metadata: H5PLibraryMetadata = { contentType, license: "U", title: "", authors: [], changes: [], extraTitle: "" };
      value = { params, library: content.library, subContentId, metadata };
    }
  else if (isH5pTextItemInfo(itemHelper) && itemHelper.semantics.widget === H5PWidgetTitle.html) {
    const { content, semantics } = itemHelper;
    value = content || semantics.default || "";
  } else if (isH5pBooleanItemInfo(itemHelper)) {
    const { content, semantics } = itemHelper;
    value = content || semantics.default || false;
  } else {
    const { content, semantics } = itemHelper;
    value = content || semantics.default;
  }
  return itemHelper.semantics.name === H5P_ROOT_NAME || itemHelper.parentItem?.semantics.type === H5PItemType.list
    ? value
    : { [itemHelper.semantics.name]: value };
};

export function createDefaultLibraryContent(library: string, schema: H5PSchema): H5PLibraryContent {
  const semantics: H5PLibrarySemantic = { type: H5PItemType.library, name: H5P_ROOT_NAME };
  const { result } = h5pItemMapper({ path: "", content: { library }, semantics }, schema, mapH5PContent);
  return result as H5PLibraryContent;
}

export function createDefaultListContent(semantics: H5PListSemantic, schema: H5PSchema, one: boolean = false): H5PListContent {
  const { field, defaultNum, min } = semantics;
  const amount = one ? 1 : defaultNum ?? min ?? 1;
  const { result } = h5pItemMapper({ path: "", semantics: field } as H5PItemInfo, schema, mapH5PContent);
  const defaultContent = result?.[field.name as keyof typeof result];
  return Array(amount)
    .fill(1)
    .map(() => cloneDeep(defaultContent));
}

export function resolveItemByPath(itemHelper: H5PItemHelper, path: string): H5PItemHelper | undefined {
  const resolveOnePath = (itemHelper: H5PItemHelper, onePath: string): H5PItemHelper | undefined => {
    if (onePath === "..") return itemHelper.parentItem;
    if (onePath === "." || onePath === "") return itemHelper;
    return itemHelper.parentItem?.childItems.find((item) => item.semantics.name === onePath);
  };
  let resultItemHelper = itemHelper;
  for (const onePath of path.split("/")) {
    const result = resolveOnePath(resultItemHelper, onePath);
    if (!result) return;
    resultItemHelper = result;
  }
  return resultItemHelper;
}

export function isH5pTextItemInfo(itemInfo: H5PItemInfo): itemInfo is H5PItemInfo<H5PTextSemantic> {
  return itemInfo.semantics.type === H5PItemType.text;
}

export function isH5pNumberItemInfo(itemInfo: H5PItemInfo): itemInfo is H5PItemInfo<H5PNumberSemantic> {
  return itemInfo.semantics.type === H5PItemType.number;
}

export function isH5pBooleanItemInfo(itemInfo: H5PItemInfo): itemInfo is H5PItemInfo<H5PBooleanSemantic> {
  return itemInfo.semantics.type === H5PItemType.boolean;
}

export function isH5pSelectItemInfo(itemInfo: H5PItemInfo): itemInfo is H5PItemInfo<H5PSelectSemantic> {
  return itemInfo.semantics.type === H5PItemType.select;
}

export function isH5pImageItemInfo(itemInfo: H5PItemInfo): itemInfo is H5PItemInfo<H5PImageSemantic> {
  return itemInfo.semantics.type === H5PItemType.image;
}

export function isH5pVideoItemInfo(itemInfo: H5PItemInfo): itemInfo is H5PItemInfo<H5PVideoSemantic> {
  return itemInfo.semantics.type === H5PItemType.video;
}

export function isH5pAudioItemInfo(itemInfo: H5PItemInfo): itemInfo is H5PItemInfo<H5PAudioSemantic> {
  return itemInfo.semantics.type === H5PItemType.audio;
}

export function isH5pFileItemInfo(itemInfo: H5PItemInfo): itemInfo is H5PItemInfo<H5PFileSemantic> {
  return itemInfo.semantics.type === H5PItemType.file;
}

export function isH5pLibraryItemInfo(itemInfo: H5PItemInfo): itemInfo is H5PItemInfo<H5PLibrarySemantic> {
  return itemInfo.semantics.type === H5PItemType.library;
}

export function isH5pGroupItemInfo(itemInfo: H5PItemInfo): itemInfo is H5PItemInfo<H5PGroupSemantic> {
  return itemInfo.semantics.type === H5PItemType.group;
}

export function isH5pListItemInfo(itemInfo: H5PItemInfo): itemInfo is H5PItemInfo<H5PListSemantic> {
  return itemInfo.semantics.type === H5PItemType.list;
}
