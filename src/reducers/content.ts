export const CONTENT_ASSETS_CREATE = "create";
export const CONTENT_ASSETS_EDIT = "edit";
export const CONTENT_ASSETS_PREVIEW = "preview";

export const updateTypeCreate = { file_type: CONTENT_ASSETS_CREATE };
export const updateTypeEdit = { file_type: CONTENT_ASSETS_EDIT };
export const updateTypePreview = { file_type: CONTENT_ASSETS_PREVIEW };

interface ReduxState {
  file_type: String;
}

interface Action {
  file_type: string;
}

const initData = {
  file_type: "document",
};

const content = (state: ReduxState = initData, action: Action) => {
  switch (action.file_type) {
    case CONTENT_ASSETS_CREATE:
      return { file_type: action.file_type };
    case CONTENT_ASSETS_EDIT:
      return { file_type: action.file_type };
    case CONTENT_ASSETS_PREVIEW:
      return { file_type: action.file_type };
    default:
      return state;
  }
};

export { content };
