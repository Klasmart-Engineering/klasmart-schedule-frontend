declare module "draftjs-to-html" {
  import { RawDraftContentState } from "draft-js";

  declare function draftToHtml(
    rawContentState: RawDraftContentState,
    hashtagConfig?: { trigger: string; separator: string },
    directional?: boolean,
    customEntityTransform?: Function
  ): string;

  export default draftToHtml;
}
declare module "iframe-resizer/js/iframeResizer.contentWindow" {
  export default any;
}

declare module "iframe-resizer/js/iframeResizer" {
  import { iframeResizer } from "@types/iframe-resizer";
  export default iframeResizer;
}

declare module "react-sketch-master";

declare module "react-intl-formatted-duration";
