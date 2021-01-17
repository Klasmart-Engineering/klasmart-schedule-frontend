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

export enum H5PLicense {
  U = "U",
  CC_BY = "CC BY",
  CC_BYSA = "CC BY-SA",
  CC_BYND = "CC BY-ND",
  CC_BYNC = "CC BY-NC",
  CC_BYNCSA = "CC BY-NC-SA",
  CC_BYNCND = "CC BY-NC-ND",
  GNU_GPL = "GNU GPL",
  PD = "PD",
  C = "C",
}

export interface IH5PCopyright {
  license: string;
  title?: string;
  author?: string;
  year?: string;
  source?: string;
  version?: string;
}

export type H5PLeafContent = H5PTextContent | H5PNumberContent | H5PBooleanContent | H5PSelectContent | H5PImageContent | H5PMediaContent;

export type H5PTextContent = string | undefined;
export type H5PNumberContent = number | undefined;
export type H5PBooleanContent = boolean | undefined;
export type H5PSelectContent = string | string[] | number[] | undefined;
export type H5PSingleMediaContent =
  | {
      path: string;
      mime: string;
      copyright?: IH5PCopyright;
      width?: number;
      height?: number;
    }
  | undefined;

export type H5PImageContent = H5PSingleMediaContent;
export type H5PMediaContent = H5PSingleMediaContent[];
export type H5PVideoContent = H5PMediaContent;
export type H5PAudioContent = H5PMediaContent;
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
  : S extends H5PImageSemantic
  ? H5PImageContent
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
  placeholder?: string;
}

export interface H5PNumberSemantic extends H5PBaseSemantic {
  type: H5PItemType.number;
  default?: number;
  min?: number;
  max?: number;
  step?: number;
  decimals?: number;
  unit?: string;
  placeholder?: string;
}

export interface H5PBooleanSemantic extends H5PBaseSemantic {
  type: H5PItemType.boolean;
  default?: boolean;
}

export interface H5PSelectSemantic extends H5PBaseSemantic {
  type: H5PItemType.select;
  default?: string;
  options: { value: string; label: string }[];
  placeholder?: string;
  multiple?: boolean;
}

export interface H5PMediaSemantic extends H5PBaseSemantic {
  type: H5PItemType.video | H5PItemType.audio | H5PItemType.file;
  default?: undefined;
  width?: number;
  height?: number;
  disableCopyright?: boolean;
}
export interface H5PImageSemantic extends Omit<H5PMediaSemantic, "type"> {
  type: H5PItemType.image;
}
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
  none = "none",
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
      node?: JSX.Element;
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

export type H5PSchema = Record<string, H5PItemSemantic[] | undefined>;

export const h5pName2libId = (name: string) => name.replace(" ", "-");
export const h5plibId2Name = (id: string) => id.replace("-", " ");

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
      const libraryId = h5pName2libId(content.library);
      const librarySemantics = schema[libraryId];
      if (!librarySemantics) throw new Error(`My Error: ${libraryId} does not exit!`);
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
    const fieldsAmount = semantics.fields.length;
    subItemInfoList = semantics.fields.map((itemSemantics) => {
      // h5p 特殊规则2
      if (fieldsAmount <= 1) {
        return { path, content, semantics: itemSemantics } as H5PItemInfo;
      }
      return {
        path: path ? `${path}.${itemSemantics.name}` : itemSemantics.name,
        content: content ? content[itemSemantics.name] : undefined,
        semantics: itemSemantics,
      } as H5PItemInfo;
    });
  }
  subItemInfoList &&
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
    if (children.length === 1) {
      value = Object.values(children[0] ?? {})[0];
    } else {
      value = children.reduce((r, child, idx) => {
        // h5p 特殊规则2，group 只有一个 key, 则只保留 value 的部分
        if (child === undefined) return r;
        return Object.assign(r, child);
      }, {});
      // 规则不允许当个key 的group 添加 isSubContent 属性
      if (itemHelper.semantics.isSubContent) {
        value = Object.assign({ subContentId: sha1(JSON.stringify(value)) }, value);
      }
    }
  } else if (isH5pLibraryItemInfo(itemHelper))
    libraryBlock: {
      const { content, semantics } = itemHelper;
      if (!content) {
        if (semantics.options && semantics.options.length === 1) {
          const [library] = semantics.options;
          value = createDefaultLibraryContent(library, schema);
        }
        break libraryBlock;
      }
      const params = children.reduce((r, child, idx) => {
        // h5p 特殊规则2
        if (child === undefined) return r;
        return Object.assign(r, child);
      }, {}) as Record<string, H5PItemContent>;
      value = createLibraryContentByParams(content.library, params);
    }
  else if (isH5pTextItemInfo(itemHelper) && itemHelper.semantics.widget === H5PWidgetTitle.html) {
    const { content, semantics } = itemHelper;
    value = content || semantics.default || "";
  } else if (isH5pBooleanItemInfo(itemHelper)) {
    const { content, semantics } = itemHelper;
    value = content || semantics.default || false;
  } else if (isH5pSelectItemInfo(itemHelper)) {
    const { content, semantics } = itemHelper;
    value = content || semantics.default || (semantics.multiple ? [] : undefined);
  } else {
    const { content, semantics } = itemHelper;
    value = content || semantics.default;
  }
  return value === undefined
    ? undefined
    : itemHelper.semantics.name === H5P_ROOT_NAME || itemHelper.parentItem?.semantics.type === H5PItemType.list
    ? value
    : { [itemHelper.semantics.name]: value };
};

const rules = {
  required(value: any) {
    return value == null || value === "" ? "The field is required and must have a value." : true;
  },
  regexp({ pattern, modifiers }: IH5PRegexp, value: string = "") {
    return new RegExp(pattern, modifiers).test(value) || "Field value contains an invalid format or characters that are forbidden.";
  },
  min(min: number, value?: number) {
    return value != null && value > min ? true : `The ${value} is below the minimum of ${min}`;
  },
  max(max: number, value?: number) {
    return value != null && value <= max ? true : `The field value exceeds the maximum of ${max}`;
  },
  decimals(decimals: number, value?: number) {
    return value != null && (value.toString().split(".")[1]?.length ?? 0) <= decimals
      ? true
      : `Only can contain numbers with max ${decimals} decimals.`;
  },
  step(step: number, value?: number) {
    return value != null && value % step === 0 ? true : `The field value can only be changed in steps of ${step}`;
  },
};

export type H5pFormErrors = Record<string, boolean | string>;
export const mapValidate: MapHandler<H5pFormErrors> = (props) => {
  const { itemHelper, children } = props;
  let result: boolean | string = true;
  if (
    isH5pTextItemInfo(itemHelper) ||
    isH5pNumberItemInfo(itemHelper) ||
    isH5pBooleanItemInfo(itemHelper) ||
    isH5pSelectItemInfo(itemHelper) ||
    isH5pImageItemInfo(itemHelper) ||
    isH5pAudioItemInfo(itemHelper) ||
    isH5pVideoItemInfo(itemHelper) ||
    isH5pFileItemInfo(itemHelper)
  ) {
    if (result === true && !itemHelper.semantics.optional) {
      debugger;
      result = rules.required(itemHelper.content);
    }
  }
  if (isH5pNumberItemInfo(itemHelper)) {
    const { semantics, content } = itemHelper;
    if (result === true && semantics.min) result = rules.min(semantics.min, content);
    if (result === true && semantics.max) result = rules.max(semantics.max, content);
    if (result === true && semantics.step) result = rules.step(semantics.step, content);
  }
  const currentErrors = result === true ? {} : { [itemHelper.path]: result };
  return children.reduce((errors, childErrors) => Object.assign(errors, childErrors), currentErrors);
};

export function validateContent(itemInfo: H5PItemInfo, schema: H5PSchema) {
  return h5pItemMapper(itemInfo, schema, mapValidate);
}

export function parseH5pErrors(message?: string): H5pFormErrors {
  if (!message || message === "") return {};
  try {
    return JSON.parse(message);
  } catch {
    return {};
  }
}

function createLibraryContentByParams(library: string, params: NonNullable<H5PLibraryContent>["params"]) {
  const subContentId = sha1(JSON.stringify(params));
  const contentType = library;
  const metadata: H5PLibraryMetadata = { contentType, license: "U", title: "", authors: [], changes: [], extraTitle: "" };
  return { params, library, subContentId, metadata };
}

export function createDefaultLibraryContent(library: string, schema: H5PSchema): H5PLibraryContent {
  const semantics: H5PLibrarySemantic = { type: H5PItemType.library, name: H5P_ROOT_NAME };
  const { result } = h5pItemMapper({ path: "", content: { library }, semantics }, schema, mapH5PContent);
  return result as H5PLibraryContent;
}

export function createDefaultListContent(semantics: H5PListSemantic, schema: H5PSchema, one: boolean = false): H5PListContent {
  const { field, defaultNum, min } = semantics;
  const amount = one ? 1 : defaultNum ?? min ?? 0;
  const { result } = h5pItemMapper({ path: "", semantics: field } as H5PItemInfo, schema, mapH5PContent);
  const defaultContent = result?.[field.name as keyof typeof result];
  return amount === 0
    ? undefined
    : Array(amount)
        .fill(1)
        .map(() => cloneDeep(defaultContent));
}

// 这里的路径只能是 semantics 的相对路径，而不是 content 的相对路径
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

export const H5P_LICENSE_OPTIONS = [
  // todo: translation
  { label: "Undisclosed", value: H5PLicense.U },
  { label: "Attribution", value: H5PLicense.CC_BY },
  { label: "Attribution-ShareAlike", value: H5PLicense.CC_BYSA },
  { label: "Attribution-NoDerivs", value: H5PLicense.CC_BYND },
  { label: "Attribution-NonCommercial", value: H5PLicense.CC_BYNC },
  { label: "Attribution-NonCommercial-ShareAlike", value: H5PLicense.CC_BYNCSA },
  { label: "Attribution-NonCommercial-NoDerivs", value: H5PLicense.CC_BYNCND },
  { label: "General Public License", value: H5PLicense.GNU_GPL },
  { label: "Public Domain", value: H5PLicense.PD },
  { label: "Copyright", value: H5PLicense.C },
];

export const createH5pLicenseVersionOptions = (license?: string) => {
  let options: { label: string; value: string }[] = [];
  switch (license) {
    case H5PLicense.CC_BY:
    case H5PLicense.CC_BYSA:
    case H5PLicense.CC_BYND:
    case H5PLicense.CC_BYNC:
    case H5PLicense.CC_BYNCSA:
    case H5PLicense.CC_BYNCND:
      // todo: translation
      options = [
        { label: "4.0 International", value: "4.0" },
        { label: "3.0 Unported", value: "3.0" },
        { label: "2.5 Generic", value: "2.5" },
        { label: "2.0 Generic", value: "2.0" },
        { label: "1.0 Generic", value: "1.0 " },
      ];
      break;
    case H5PLicense.GNU_GPL:
      options = [
        { label: "Version 3", value: "v3" },
        { label: "Version 2", value: "v2" },
        { label: "Version 1", value: "v1" },
      ];
      break;
    case H5PLicense.PD:
      options = [
        { label: "-", value: "-" },
        { label: "CC0-1.0-universal", value: "CC0 1.0" },
        { label: "Public Domain Mark", value: "CC PDM" },
      ];
      break;
  }
  return options;
};

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
