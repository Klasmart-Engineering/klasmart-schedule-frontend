import { createStyles, makeStyles } from "@material-ui/core";
import { iframeResizer } from "iframe-resizer";
import React, { HTMLAttributes, useCallback, useMemo, useRef } from "react";
import { useDispatch } from "react-redux";
import { apiCreateContentTypeLibrary, apiResourcePathById } from "../../api/extra";
import { extractH5pStatement, h5pName2libId, H5PStatement, parseLibraryContent, sha1 } from "../../models/ModelH5pSchema";
import { h5pEvent } from "../../reducers/content";
interface FixedIFrameResizerObject extends iframeResizer.IFrameObject {
  removeListeners: () => void;
}

const SPECIAL_SYMBOL = "***";
const INITIAL_EVENT_VERB_ID = "http://verb.kidsloop.cn/verbs/initgame";

/* eslint-disable import/no-webpack-loader-syntax */
const useStyle = makeStyles(() =>
  createStyles({
    iframe: {
      width: 1,
      minWidth: "100%",
      // border: "1px dashed red",
    },
  })
);

const displayOptions = {
  copy: false,
  copyright: false,
  embed: false,
  export: false,
  frame: false,
  icon: false,
};

const metadata = {
  license: "U",
  title: "title",
  defaultLanguage: "en",
};

const l10n = {
  H5P: {
    fullscreen: "Fullscreen",
    disableFullscreen: "Disable fullscreen",
    download: "Download",
    copyrights: "Rights of use",
    embed: "Embed",
    size: "Size",
    showAdvanced: "Show advanced",
    hideAdvanced: "Hide advanced",
    advancedHelp: "Include this script on your website if you want dynamic sizing of the embedded content:",
    copyrightInformation: "Rights of use",
    close: "Close",
    title: "Title",
    author: "Author",
    year: "Year",
    source: "Source",
    license: "License",
    thumbnail: "Thumbnail",
    noCopyrights: "No copyright information available for this content.",
    reuse: "Reuse",
    reuseContent: "Reuse Content",
    reuseDescription: "Reuse this content.",
    downloadDescription: "Download this content as a H5P file.",
    copyrightsDescription: "View copyright information for this content.",
    embedDescription: "View the embed code for this content.",
    h5pDescription: "Visit H5P.org to check out more cool content.",
    contentChanged: "This content has changed since you last used it.",
    startingOver: "You'll be starting over.",
    by: "by",
    showMore: "Show more",
    showLess: "Show less",
    subLevel: "Sublevel",
    confirmDialogHeader: "Confirm action",
    confirmDialogBody: "Please confirm that you wish to proceed. This action is not reversible.",
    cancelLabel: "Cancel",
    confirmLabel: "Confirm",
    licenseU: "Undisclosed",
    licenseCCBY: "Attribution",
    licenseCCBYSA: "Attribution-ShareAlike",
    licenseCCBYND: "Attribution-NoDerivs",
    licenseCCBYNC: "Attribution-NonCommercial",
    licenseCCBYNCSA: "Attribution-NonCommercial-ShareAlike",
    licenseCCBYNCND: "Attribution-NonCommercial-NoDerivs",
    licenseCC40: "4.0 International",
    licenseCC30: "3.0 Unported",
    licenseCC25: "2.5 Generic",
    licenseCC20: "2.0 Generic",
    licenseCC10: "1.0 Generic",
    licenseGPL: "General Public License",
    licenseV3: "Version 3",
    licenseV2: "Version 2",
    licenseV1: "Version 1",
    licensePD: "Public Domain",
    licenseCC010: "CC0 1.0 Universal (CC0 1.0) Public Domain Dedication",
    licensePDM: "Public Domain Mark",
    licenseC: "Copyright",
    contentType: "Content Type",
    licenseExtras: "License Extras",
    changes: "Changelog",
    contentCopied: "Content is copied to the clipboard",
    connectionLost: "Connection lost. Results will be stored and sent when you regain connection.",
    connectionReestablished: "Connection reestablished.",
    resubmitScores: "Attempting to submit stored results.",
    offlineDialogHeader: "Your connection to the server was lost",
    offlineDialogBody: "We were unable to send information about your completion of this task. Please check your internet connection.",
    offlineDialogRetryMessage: "Retrying in :num....",
    offlineDialogRetryButtonLabel: "Retry now",
    offlineSuccessfulSubmit: "Successfully submitted results.",
  },
};

interface H5pPlayerProps {
  id?: string;
  userId: string;
  scheduleId?: string;
  valueSource: string;
  onReady?: () => any;
}
export function H5pPlayer(props: H5pPlayerProps) {
  const dispatch = useDispatch();
  const { valueSource, id, scheduleId, userId, onReady } = props;
  const xApiRef = useRef<{ (s?: H5PStatement, _?: boolean): void }>();
  const onReadyRef = useRef(onReady);
  const playId = useMemo(() => sha1(valueSource + Date.now().toString()), [valueSource]);
  // const userId = useUserId();
  const { library: libraryName, params: libraryParams, subContentId: libraryContentId } = parseLibraryContent(valueSource);
  const css = useStyle();
  const { library, core } = apiCreateContentTypeLibrary(h5pName2libId(libraryName));
  const injectBeforeLoad = useMemo<InjectHandler>(
    () => async (root) => {
      (root as any).H5PIntegration = {
        core,
        l10n,
        postUserStatistics: false,
        saveFreq: false,
        url: "h5p",
        hubIsEnabled: true,
        fullscreenDisabled: 0,
        contents: {
          [`cid-${libraryContentId}`]: {
            ...library,
            displayOptions,
            metadata,
            fullScreen: "0",
            jsonContent: JSON.stringify(libraryParams),
            library: libraryName,
            contentUrl: apiResourcePathById(SPECIAL_SYMBOL)?.replace(SPECIAL_SYMBOL, ""),
          },
        },
      };
      if (libraryContentId) {
        root.document.getElementById("h5-content")?.setAttribute("data-content-id", libraryContentId);
      }
    },
    [core, libraryContentId, library, libraryParams, libraryName]
  );
  onReadyRef.current = onReady;
  xApiRef.current = (statement?: H5PStatement, isInitial?: boolean) => {
    if (!scheduleId) return;
    const baseInfo = {
      schedule_id: scheduleId,
      material_id: id,
      play_id: playId,
      user_id: userId,
      time: Date.now(),
    };
    const [local_library_name, local_library_version] = libraryName.split(" ");
    if (isInitial) {
      const resultInfo = {
        ...baseInfo,
        verb_id: INITIAL_EVENT_VERB_ID,
        local_library_name,
        local_library_version,
        local_content_id: libraryContentId,
      };
      // console.log("initial resultInfo = ", resultInfo);
      dispatch(h5pEvent(resultInfo));
    } else {
      if (!statement) return;
      const info = { ...baseInfo, ...extractH5pStatement(statement) };
      const resultInfo = info.extends.additionanProp1.sub_content_id ? { ...info, local_library_name, local_library_version } : info;
      // console.log("resultInfo = ", resultInfo);
      dispatch(h5pEvent(resultInfo));
    }
  };
  const injectAfterLoad: InjectHandler = useMemo(() => {
    return async (root) => {
      (async () => onReadyRef.current && onReadyRef.current())();
      xApiRef.current && xApiRef.current(undefined, true);
      (root as any).H5P.externalDispatcher.on("xAPI", function (event: any) {
        xApiRef.current && xApiRef.current(event.data.statement);
      });
    };
    /* eslint-disable-next-line react-hooks/exhaustive-deps */
  }, [xApiRef, valueSource]);
  library.scripts.push(`../${require("!!file-loader!iframe-resizer/js/iframeResizer.contentWindow")}`);
  const { register, onLoad } = useInlineIframe({ ...library, injectBeforeLoad, injectAfterLoad });

  return <iframe className={css.iframe} ref={register} src="h5p" frameBorder="0" title="h5p" onLoad={onLoad} key={valueSource} />;
}
interface UseInlineIframeProps {
  styles: string[];
  scripts: string[];
  injectBeforeLoad: InjectHandler;
  injectAfterLoad: InjectHandler;
}
function useInlineIframe(props: UseInlineIframeProps) {
  const { styles, scripts, injectBeforeLoad, injectAfterLoad } = props;
  const iframeRef = useRef<HTMLIFrameElement | null>(null);
  const resizerRef = useRef<FixedIFrameResizerObject | null>(null);
  const register = useCallback((iframe) => {
    if (!iframe || iframeRef.current === iframe) return;
    if (iframe.current) {
      resizerRef.current?.removeListeners();
    }
    const [{ iFrameResizer }] = iframeResizer({ log: false }, iframe);
    iframeRef.current = iframe;
    resizerRef.current = iFrameResizer as FixedIFrameResizerObject;
  }, []);
  const onLoad = useCallback(() => {
    if (!iframeRef.current) return;
    new InlineIframeManager({ iframe: iframeRef.current, styles, scripts, injectBeforeLoad, injectAfterLoad });
  }, [styles, scripts, injectBeforeLoad, injectAfterLoad]);
  return { register, onLoad };
}

interface InjectHandler {
  (contentWindow: NonNullable<HTMLIFrameElement["contentWindow"]>): Promise<any>;
}
interface InlineIframeManagerProps {
  iframe: HTMLIFrameElement;
  injectBeforeLoad?: InjectHandler;
  injectAfterLoad: InjectHandler;
  scripts?: string[];
  styles?: string[];
}
class InlineIframeManager {
  iframe: HTMLIFrameElement;
  injectAfterLoad: InjectHandler;

  constructor(props: InlineIframeManagerProps) {
    const { iframe, injectBeforeLoad, injectAfterLoad, scripts = [], styles = [] } = props;
    this.injectAfterLoad = injectAfterLoad;
    this.iframe = iframe;
    const documentElement = iframe.contentDocument?.documentElement;
    if (!documentElement) throw new Error("My Error: iframe.contentDocument?.documentElement not exist");
    this.addStyles(styles);
    this.injectScript(injectBeforeLoad)?.then(() => {
      this.addScripts(scripts).then(this.ready.bind(this));
    });
  }

  ready() {
    this.iframe.contentWindow?.dispatchEvent(new Event("ready"));
    setTimeout(() => this.injectAfterLoad(this.iframe.contentWindow as Window));
  }

  setHtmlElementClass(classNames: string[]) {
    const contentDocument = this.iframe.contentDocument;
    if (!contentDocument) return;
    contentDocument.documentElement.classList.add(...classNames);
  }

  async addScripts(scripts: string[]) {
    const contentDocument = this.iframe.contentDocument;
    if (!contentDocument) return;
    const loadScript = (src: string) => {
      return new Promise((resolve, reject) => {
        const scriptElement = contentDocument.createElement("script");
        scriptElement.onload = resolve;
        scriptElement.onerror = reject;
        scriptElement.src = src;
        contentDocument.head.append(scriptElement);
      });
    };
    for (const src of scripts) {
      await loadScript(src);
    }
  }

  addNode<T extends keyof HTMLElementTagNameMap, A extends HTMLAttributes<HTMLElementTagNameMap[T]>>(
    type: "body" | "head",
    tag: T,
    attrs: A
  ) {
    const contentDocument = this.iframe.contentDocument;
    if (!contentDocument) return;
    const element = contentDocument.createElement(tag);
    Object.keys(attrs).forEach((name) => {
      switch (name) {
        case "className":
          element.classList.add(attrs[name] ?? "");
          break;
        default:
          element.setAttribute(name, attrs[name as keyof HTMLAttributes<HTMLElementTagNameMap[T]>]);
      }
    });
    contentDocument[type].append(element);
  }

  addInlineScript(code: string) {
    const contentDocument = this.iframe.contentDocument;
    if (!contentDocument) return;
    const scriptElement = contentDocument.createElement("script");
    scriptElement.innerText = code;
    contentDocument.head.append(scriptElement);
  }

  addStyles(styles: string[]) {
    const contentDocument = this.iframe.contentDocument;
    if (!contentDocument) return;
    styles.forEach((src) => {
      const linkElement = contentDocument.createElement("link");
      linkElement.rel = "stylesheet";
      linkElement.href = src;
      contentDocument.head.append(linkElement);
    });
  }

  injectScript(handler?: InjectHandler) {
    if (!this.iframe.contentWindow || !handler) return;
    return handler(this.iframe.contentWindow);
  }
}
