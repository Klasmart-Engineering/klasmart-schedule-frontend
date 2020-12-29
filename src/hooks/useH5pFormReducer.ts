import produce from "immer";
import setByPath from "lodash/set";
import { Reducer, useMemo, useReducer } from "react";
import {
  createDefaultLibraryContent,
  H5PItemInfo,
  h5pItemMapper,
  H5PItemType,
  H5PLibraryContent,
  H5PSchema,
  H5P_ROOT_NAME,
  isH5pLibraryItemInfo,
  mapH5PContent,
} from "../models/ModelH5pSchema";

interface H5pFormChangePayload extends H5PItemInfo {
  schema: H5PSchema;
}

interface H5pFormChangeAction {
  type: "change";
  payload: H5pFormChangePayload;
}

const formReducer = (state: H5PLibraryContent, action: H5pFormChangeAction): H5PLibraryContent => {
  if (!state) return state;
  switch (action.type) {
    case "change":
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
      break;
    default:
      return state;
  }
};

export function useH5pFormReducer(defaultValue: H5PLibraryContent, schema: H5PSchema) {
  const rootContentInfo: H5PItemInfo = { path: "", semantics: { name: H5P_ROOT_NAME, type: H5PItemType.library } };
  const content = defaultValue
    ? (h5pItemMapper({ ...rootContentInfo, content: defaultValue }, schema, mapH5PContent) as H5PLibraryContent)
    : undefined;
  const [form, dispatch] = useReducer(produce(formReducer) as Reducer<H5PLibraryContent, H5pFormChangeAction>, content);
  const dispatchChange = useMemo(() => {
    if (!schema) return () => {};
    return (payload: H5PItemInfo) => dispatch({ type: "change", payload: { ...payload, schema } });
  }, [dispatch, schema]);
  return [form, { dispatchChange }] as const;
}
