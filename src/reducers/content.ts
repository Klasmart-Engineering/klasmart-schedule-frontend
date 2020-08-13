export const CONTENT_ASSETS_CREATE = "create";
export const CONTENT_ASSETS_EDIT = "edit";
export const CONTENT_ASSETS_PREVIEW = "preview";

export const updateTypeCreateAction = { type: CONTENT_ASSETS_CREATE };

export interface ReduxState {
  type: string;
  topicList: any;
}

const defaultState = {
  type: "save",
  topicList: {
    fileType: "images",
    assetsName: "",
    program: "",
    subject: "",
    developmental: "",
    skills: "",
    age: 1,
    description: "",
    keywords: "",
  },
};

const content = (state: ReduxState = defaultState, action: ReduxState) => {
  switch (action.type) {
    case "save":
      return action;
    default:
      return state;
  }
};

export { content };
