import React, { Fragment } from "react";
import {
  H5PItemSemantic,
  H5PLeafContent,
  isH5pBooleanItemInfo,
  isH5pLibraryItemInfo,
  isH5pNumberItemInfo,
  isH5pSelectItemInfo,
  isH5pTextItemInfo,
  resolveItemByPath,
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

export function WidgetElement(props: H5pElementProps) {
  const { itemHelper } = props;
  const { semantics } = itemHelper;
  if (isShowWhenAttributeSemantic(semantics)) {
    const condition = semantics.showWhen.rules.some(({ field, equals }) => {
      const targetItemHelper = resolveItemByPath(itemHelper, field);
      if (!targetItemHelper) return false;
      if (isH5pLibraryItemInfo(targetItemHelper)) {
        const value = targetItemHelper.content?.library || "";
        const libIds = Array.isArray(equals) ? equals : [equals];
        return libIds.includes(value);
      }
      if (
        isH5pTextItemInfo(targetItemHelper) ||
        isH5pNumberItemInfo(targetItemHelper) ||
        isH5pBooleanItemInfo(targetItemHelper) ||
        isH5pSelectItemInfo(targetItemHelper)
      ) {
        const value = targetItemHelper.content;
        return Array.isArray(equals) ? (equals as typeof value[]).includes(value) : equals === value;
      }
      return false;
    });
    if (!condition) return <Fragment />;
  }
  return <H5pElement {...props} />;
}

export const version = "1.0.0";
export const name = "H5PEditor.ShowWhen";
export const title = "showWhen";
