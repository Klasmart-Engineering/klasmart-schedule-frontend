export const CONTENT_ASSETS_CREATE = "create";
export const CONTENT_ASSETS_EDIT = "edit";
export const CONTENT_ASSETS_PREVIEW = "preview";

export const updateTypeCreateAction = { type: CONTENT_ASSETS_CREATE };

export interface ReduxState {
  type: string;
  topicList: any;
}

const defaultState = {
  type: "creat",
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
  console.log(action);
  switch (action.type) {
    default:
      return state;
  }
};

export { content };
