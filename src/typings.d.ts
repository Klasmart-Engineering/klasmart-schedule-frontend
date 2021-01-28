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
