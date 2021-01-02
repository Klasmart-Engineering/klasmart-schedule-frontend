import React from "react";
import {
  H5PItemInfo,
  H5PItemSemantic,
  H5PLeafContent,
  isH5pBooleanItemInfo,
  isH5pGroupItemInfo,
  isH5pLibraryItemInfo,
  isH5pNumberItemInfo,
  isH5pSelectItemInfo,
  isH5pTextItemInfo,
} from "../../models/ModelH5pSchema";
import { H5pElement, H5pElementProps } from "../H5pElement";

enum ShowWhenType {
  or = "or",
}

interface ShowWhenAttributeSemantic {
  showWhen: {
    type?: ShowWhenType;
    rules: {
      field: string;
      equals: H5PLeafContent | H5PLeafContent[];
    }[];
  };
}

function isShowWhenAttributeSemantic(semantic: H5PItemSemantic): semantic is H5PItemSemantic & ShowWhenAttributeSemantic {
  const { showWhen } = semantic as H5PItemSemantic & ShowWhenAttributeSemantic;
  if (!showWhen || !showWhen.rules || !Array.isArray(showWhen.rules)) return false;
  const [rule] = showWhen.rules;
  if (rule) {
    if (!rule.field) return false;
  }
  return true;
}

function getValue(itemInfo: H5PItemInfo) {
  if (isH5pTextItemInfo(itemInfo) || isH5pNumberItemInfo(itemInfo) || isH5pBooleanItemInfo(itemInfo) || isH5pSelectItemInfo(itemInfo)) {
    return itemInfo.content;
  }
  if (isH5pLibraryItemInfo(itemInfo)) {
    return itemInfo.content?.library;
  }
  return undefined;
}

export function WidgetElement(props: H5pElementProps) {
  const {
    itemHelper: { semantics, path, parentItem, childItems },
  } = props;
  if (isShowWhenAttributeSemantic(semantics)) {
    const { field, equals } = semantics.showWhen.rules[0];
    if (!parentItem) return <H5pElement {...props} />;
    if (isH5pGroupItemInfo(parentItem)) {
      // todo
      // const value = getValue(parentItemInfo.)
      // if (value !== equals) return null;
    }
    console.log(path, field, equals, getValue, childItems);
  }
  return <H5pElement {...props} />;
}

export const version = "1.0.0";
export const name = "H5PEditor.ShowWhen";
export const title = "showWhen";
