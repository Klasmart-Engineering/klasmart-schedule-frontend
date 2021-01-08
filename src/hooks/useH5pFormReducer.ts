import produce from "immer";
import setByPath from "lodash/set";
import { Reducer, useMemo, useReducer, useRef } from "react";
import {
  createDefaultLibraryContent,
  createDefaultListContent,
  H5PItemInfo,
  h5pItemMapper,
  H5PItemType,
  H5PLibraryContent,
  H5PListSemantic,
  H5PSchema,
  H5P_ROOT_NAME,
  isH5pLibraryItemInfo,
  mapH5PContent,
} from "../models/ModelH5pSchema";

export type H5pFormChangePayload = H5PItemInfo & {
  schema: H5PSchema;
};

export type H5pFormAddListItemPayload = H5PItemInfo<H5PListSemantic> & {
  schema: H5PSchema;
};

export type H5pFormRemoveListItemPayload = H5PItemInfo<H5PListSemantic> & {
  schema: H5PSchema;
  index: number;
};

interface H5pFormAddListItemAction {
  type: "addListItem";
  payload: H5pFormAddListItemPayload;
}

interface H5pFormRemoveListItemAction {
  type: "removeListItem";
  payload: H5pFormRemoveListItemPayload;
}

interface H5pFormChangeAction {
  type: "change";
  payload: H5pFormChangePayload;
}

type H5pFormAction = H5pFormAddListItemAction | H5pFormChangeAction | H5pFormRemoveListItemAction;

const formReducer = (state: H5PLibraryContent, action: H5pFormAction): H5PLibraryContent => {
  if (!state) return state;
  switch (action.type) {
    case "change": {
      const { schema, ...itemInfo } = action.payload;
      if (isH5pLibraryItemInfo(itemInfo)) {
        const { content, path } = itemInfo;
        if (!content) return state;
        const { library, metadata } = content;
        // 修改公共区域的语言栏的情况
        if (metadata?.defaultLanguage) {
          setByPath(state, `${path}.metadata.defaultLanguage`, metadata?.defaultLanguage);
          return state;
        }
        if (!library) return state;
        const defaultLibraryContent = createDefaultLibraryContent(library, schema);
        setByPath(state, path, defaultLibraryContent);
        return state;
      }
      const { content, path } = itemInfo;
      setByPath(state, path, content);
      return state;
    }
    case "addListItem": {
      const { content, semantics, path, schema } = action.payload;
      const listContent = content?.concat(createDefaultListContent(semantics, schema, true));
      setByPath(state, path, listContent);
      return state;
    }
    case "removeListItem": {
      const { content, path, index } = action.payload;
      const listContent = content?.filter((_, idx) => idx !== index);
      setByPath(state, path, listContent?.length ? listContent : undefined);
      return state;
    }
    default:
      return state;
  }
};

export function useH5pFormReducer(defaultValue: H5PLibraryContent, schema: H5PSchema) {
  const rootContentInfo: H5PItemInfo = { path: "", semantics: { name: H5P_ROOT_NAME, type: H5PItemType.library } };
  const content = defaultValue
    ? (h5pItemMapper({ ...rootContentInfo, content: defaultValue }, schema, mapH5PContent).result as H5PLibraryContent)
    : undefined;
  const formRef = useRef<H5PLibraryContent>(content);
  const [form, dispatch] = useReducer((state: H5PLibraryContent, action: H5pFormAction) => {
    formRef.current = (produce(formReducer) as Reducer<H5PLibraryContent, H5pFormAction>)(state, action);
    return formRef.current;
  }, content);
  const dispatchRemoveListItem = useMemo(() => {
    if (!schema) return () => form;
    return (payload: Omit<H5pFormRemoveListItemPayload, "schema">) => {
      dispatch({ type: "removeListItem", payload: { ...payload, schema } });
      return formRef.current;
    };
  }, [form, schema]);
  const dispatchAddListItem = useMemo(() => {
    if (!schema) return () => form;
    return (payload: Omit<H5pFormAddListItemPayload, "schema">) => {
      dispatch({ type: "addListItem", payload: { ...payload, schema } });
      return formRef.current;
    };
  }, [form, schema]);
  const dispatchChange = useMemo(() => {
    if (!schema) return () => form;
    return (payload: H5PItemInfo) => {
      dispatch({ type: "change", payload: { ...payload, schema } });
      return formRef.current;
    };
  }, [form, schema]);
  return [form, { dispatchChange, dispatchAddListItem, dispatchRemoveListItem }] as const;
}
