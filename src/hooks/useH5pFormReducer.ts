import produce from 'immer';
import setByPath from 'lodash/set';
import { Reducer, useMemo, useReducer } from "react";
import { createDefaultLibraryContent, H5PItemInfo, h5pItemMapper, H5PItemSemantic, H5PItemType, H5PLeafContent, H5PLeafSemantic, H5PLibraryContent, H5PLibrarySemantic, H5PSchema, H5P_ROOT_NAME, mapH5PContent } from "../models/ModelH5pSchema";

interface H5pFormChangeLibraryPayload {
  path: string;
  value: string;
  semantics: H5PLibrarySemantic;
  schema: H5PSchema;
}

interface H5pFormChangeLeafPayload {
  path: string;
  value: H5PLeafContent;
  semantics: H5PLeafSemantic;
  schema: H5PSchema;
}

export type H5pFormValueBySemantics<S extends H5PItemSemantic> = 
  S extends H5PLibrarySemantic ? H5pFormChangeLibraryPayload['value'] :
  S extends H5PLeafSemantic ? H5pFormChangeLeafPayload['value'] : 
  never;


export type H5pFormChangePartialPayload = Omit<H5pFormChangeLeafPayload, 'schema'> | Omit<H5pFormChangeLibraryPayload, 'schema'>;

interface H5pFormChangeAction {
  type: 'change';
  payload: H5pFormChangeLeafPayload | H5pFormChangeLibraryPayload;
}

const formReducer = (state: H5PLibraryContent, action: H5pFormChangeAction): H5PLibraryContent => {
  if (!state) return state;
  switch(action.type) {
    case 'change':
      const { path, value, semantics, schema } = action.payload;
      if (semantics.type === H5PItemType.library) {
        const library = value as H5pFormValueBySemantics<typeof semantics>;
        const defaultLibraryContent = createDefaultLibraryContent(library, schema);
        setByPath(state, path, defaultLibraryContent);
        return state;
      }
      setByPath(state, path, value);
    default:
      return state;
  }
}

export function useH5pFormReducer(defaultValue: H5PLibraryContent, schema: H5PSchema) {
  const rootContentInfo: H5PItemInfo = { path: '', semantics: { name: H5P_ROOT_NAME, type: H5PItemType.library }};
  const content = defaultValue ? 
    h5pItemMapper({...rootContentInfo, content: defaultValue }, schema, mapH5PContent) as H5PLibraryContent :
    undefined;
  console.log('in useH5pFormReducer content = ', content);
  const [form, dispatch] = useReducer(produce(formReducer) as Reducer<H5PLibraryContent, H5pFormChangeAction>, content );
  const dispatchChange = useMemo(() => {
    if (!schema) return () => {};
    return (payload: H5pFormChangePartialPayload) => dispatch({ type: 'change', payload: { ...payload, schema } });
  }, [dispatch, schema]);
  return [form, { dispatchChange }] as const;
}

