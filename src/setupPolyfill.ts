export const livePolyfill = () => {
  const originAppendChild = document.head.appendChild;
  document.head.appendChild = function appendChild(element) {
    if (
      ((element as unknown) as HTMLElement)?.tagName === "SCRIPT" &&
      ((element as unknown) as HTMLScriptElement)?.src ===
        "https://cdnjs.cloudflare.com/ajax/libs/iframe-resizer/3.5.8/iframeResizer.contentWindow.min.js"
    ) {
      return element;
    }
    return originAppendChild.call(document.head, element);
  } as typeof originAppendChild;
};
