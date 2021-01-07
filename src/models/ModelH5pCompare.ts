import isEqualWith from "lodash/isEqualWith";

export function formatCompareContent(content: any): any {
  if (content == null) return content;
  if (content.library) {
    const { library, subContentId, metadata, params, ...restContent } = content;
    const { authors, changes, contentType, extraTitle, license, title, language, ...restMetadata } = metadata;
    return {
      library,
      subContentId: "",
      metadata: {
        authors: [],
        changes: [],
        contentType: "",
        extraTitle: "",
        license: "",
        title: "",
        language: "",
        ...restMetadata,
      },
      params: formatCompareContent(content.params),
      ...restContent,
    };
  }
  if (Array.isArray(content)) {
    return content.map((subContent) => formatCompareContent(subContent));
  }
  if (typeof content === "object") {
    return Object.keys(content)
      .sort()
      .reduce((result, key) => {
        result[key] = formatCompareContent(content[key]);
        return result;
      }, {} as any);
  }
  return content;
}

export function formatTargetContent(content: any): any {
  const { authors, changes, contentType, extraTitle, license, title, language } = content.params.metadata;
  return formatCompareContent({
    library: content.library,
    subContentId: "",
    metadata: { authors, changes, contentType, extraTitle, license, title, language },
    params: content.params.params,
  });
}

const omitUndefined = (current: any, target: any) => {
  if (current == null || target == null) return undefined;
  Object.keys(current).forEach((k) => {
    if (current[k] === undefined) delete current[k];
  });
  Object.keys(target).forEach((k) => {
    if (target[k] === undefined) delete target[k];
  });
  return undefined;
};

export type H5pValidateResult =
  | true
  | {
      content: string;
      target: string;
      currentJSON: string;
      targetJSON: string;
    };
export function validate(content: any, target: any): H5pValidateResult {
  const currentJSON = formatCompareContent(content);
  const targetJSON = formatTargetContent(target);
  const equal = isEqualWith(currentJSON, targetJSON, omitUndefined);
  (window as any).currentJSON = currentJSON;
  (window as any).targetJSON = targetJSON;
  if (equal) return true;
  return {
    content: JSON.stringify(content, null, 2),
    target: JSON.stringify(target, null, 2),
    currentJSON: JSON.stringify(currentJSON, null, 2),
    targetJSON: JSON.stringify(targetJSON, null, 2),
  };
}

(window as any).isEqualWith = isEqualWith;
(window as any).omitUndefined = omitUndefined;
