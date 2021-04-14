import { createStyles, makeStyles } from "@material-ui/core";
import iframeResizer from "iframe-resizer/js/iframeResizer";
import React, { useCallback, useMemo, useRef } from "react";
import { apiCreateContentTypeLibrary, apiResourcePathById } from "../../api/extra";
import { h5pName2libId, parseLibraryContent } from "../../models/ModelH5pSchema";
import { InlineIframeManager, InlineIframeManagerInjectHandler } from "../../pages/Live/InlineIframeManager";
import l10n from "../../pages/Live/l10n.json";

const SPECIAL_SYMBOL = "***";

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

interface H5pPlayerProps {
  valueSource: string;
  onReady?: () => any;
}
export function H5pPlayer(props: H5pPlayerProps) {
  const { valueSource, onReady } = props;
  const iframeRef = useRef<HTMLIFrameElement | null>(null);
  const onReadyRef = useRef(onReady);
  const { library: libraryName, params: libraryParams, subContentId: libraryContentId } = parseLibraryContent(valueSource);
  const css = useStyle();
  const { library, core } = apiCreateContentTypeLibrary(h5pName2libId(libraryName));
  const injectBeforeLoad = useMemo<InlineIframeManagerInjectHandler>(
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
  const injectAfterLoad: InlineIframeManagerInjectHandler = useMemo(() => {
    return async (root) => (async () => onReadyRef.current && onReadyRef.current())();
  }, []);
  library.scripts.push(`../${require("!!file-loader!iframe-resizer/js/iframeResizer.contentWindow")}`);
  const handleOnload = useCallback(() => {
    const iframe = iframeRef.current;
    const contentWindow = iframe?.contentWindow;
    if (!iframe || !contentWindow) return;
    new InlineIframeManager({ contentWindow, ...library, injectBeforeLoad, injectAfterLoad });
    iframeResizer({ log: false, heightCalculationMethod: "taggedElement" }, iframe);
  }, [library, injectBeforeLoad, injectAfterLoad]);
  return (
    <iframe
      className={css.iframe}
      ref={iframeRef}
      src="h5p"
      title="h5p"
      onLoad={handleOnload}
      key={valueSource}
      allow="camera;microphone"
    />
  );
}
