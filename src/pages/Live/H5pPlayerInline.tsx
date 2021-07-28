import { createStyles, makeStyles } from "@material-ui/core";
import clsx from "clsx";
import { iframeResizer } from "iframe-resizer";
import React, { memo, useEffect, useMemo, useRef } from "react";
import { apiCreateContentTypeLibrary, apiResourcePathById } from "../../api/extra";
import { extractH5pStatement, h5pName2libId, H5PStatement, parseLibraryContent, sha1 } from "../../models/ModelH5pSchema";
// import { h5pEvent } from "../../reducers/content";
import { InlineIframeManager, InlineIframeManagerInjectHandler } from "./InlineIframeManager";
import l10n from "./l10n.json";
interface FixedIFrameResizerObject extends iframeResizer.IFrameObject {
  removeListeners: () => void;
}

const SPECIAL_SYMBOL = "***";
const INITIAL_EVENT_VERB_ID = "http://verb.kidsloop.cn/verbs/initgame";
const H5P_DIR = "h5p";

const resolveH5pDir = (scripts: string[]) => {
  return scripts.map((x) => `${H5P_DIR}/${x}`);
};

/* eslint-disable import/no-webpack-loader-syntax */
export const useStyle = makeStyles(() =>
  createStyles({
    "@global": {
      html: {
        width: "100%",
        height: "100%",
      },
      body: {
        width: "100%",
        height: "100%",
      },
      "#root": {
        width: "100%",
        height: "100%",
      },
      ".MuiBox-root": {
        width: "100%",
        height: "100%",
      },
    },
    h5pContent: {
      overflow: "hidden",
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
interface ISize {
  width?: number;
  height?: number;
}

interface H5pPlayerInlineProps {
  id?: string;
  userId: string;
  scheduleId?: string;
  valueSource: string;
  isPreview: boolean;
  onReady?: () => any;
}
export const H5pPlayerInline = memo((props: H5pPlayerInlineProps) => {
  // const dispatch = useDispatch();
  const { valueSource, id, scheduleId, userId, onReady, isPreview } = props;
  const xApiRef = useRef<{ (s?: H5PStatement, _?: boolean): void }>();
  const onReadyRef = useRef(onReady);
  const playId = useMemo(() => sha1(valueSource + Date.now().toString()), [valueSource]);
  const { library: libraryName, params: libraryParams, subContentId: libraryContentId } = parseLibraryContent(valueSource);
  const css = useStyle();
  const { library, core } = apiCreateContentTypeLibrary(h5pName2libId(libraryName));
  /* eslint-disable-next-line react-hooks/exhaustive-deps */
  const injectBeforeLoad = async (root: Window) => {
    root.document.documentElement.classList.add("h5p-iframe");
    (root as any).H5PIntegration = {
      core,
      l10n,
      postUserStatistics: false,
      saveFreq: false,
      url: H5P_DIR,
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
  };
  onReadyRef.current = onReady;
  xApiRef.current = (statement?: H5PStatement, isInitial?: boolean) => {
    if (!scheduleId) return;
    const baseInfo = {
      schedule_id: scheduleId,
      material_id: id,
      play_id: playId,
      user_id: userId,
      time: Math.round(Date.now() / 1000),
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
      // dispatch(h5pEvent(resultInfo));
      console.log(resultInfo);
    } else {
      if (!statement) return;
      const info = { ...baseInfo, ...extractH5pStatement(statement) };
      const resultInfo = info.extends.additionanProp1.sub_content_id ? { ...info, local_library_name, local_library_version } : info;
      // dispatch(h5pEvent(resultInfo));
      console.log(resultInfo);
    }
  };
  /* eslint-disable-next-line react-hooks/exhaustive-deps */
  const injectAfterLoad: InlineIframeManagerInjectHandler = async (root) => {
    (async () => onReadyRef.current && onReadyRef.current())();
    import("iframe-resizer/js/iframeResizer.contentWindow");
    if (isPreview) return;
    xApiRef.current && xApiRef.current(undefined, true);
    (root as any).H5P.externalDispatcher.on("xAPI", function (event: any) {
      xApiRef.current && xApiRef.current(event.data.statement);
    });
  };

  useEffect(() => {
    if (!id || !userId || !valueSource) return;
    if (!isPreview && !scheduleId) return;
    if (!library || !library.scripts || library.scripts.length === 0) return;
    new InlineIframeManager({
      contentWindow: window,
      scripts: resolveH5pDir(library.scripts),
      styles: resolveH5pDir(library.styles),
      injectBeforeLoad,
      injectAfterLoad,
    });
    /* eslint-ignore-next-line react-hooks/exhaustive-deps */
  }, [id, userId, scheduleId, valueSource, library, isPreview, injectBeforeLoad, injectAfterLoad]);
  return <div id="h5-content" className={clsx("h5p-content", css.h5pContent)} data-content-id={libraryContentId} data-iframe-height />;
}, equalH5pPlayerInlineProps);

function equalH5pPlayerInlineProps(prev: H5pPlayerInlineProps, props: H5pPlayerInlineProps) {
  return (
    prev.id === props.id &&
    prev.userId === props.userId &&
    prev.scheduleId === props.scheduleId &&
    prev.valueSource === props.valueSource &&
    prev.isPreview === props.isPreview
  );
}
