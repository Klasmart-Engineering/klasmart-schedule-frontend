import { createStore, combineReducers } from "redux";
import { content } from "./content";

const rootReducers = combineReducers({ content });
export const store = createStore(rootReducers);
