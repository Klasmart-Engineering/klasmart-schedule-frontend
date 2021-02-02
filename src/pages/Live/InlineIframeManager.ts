import { HTMLAttributes } from "react";

export interface InlineIframeManagerInjectHandler {
  (contentWindow: NonNullable<HTMLIFrameElement["contentWindow"]>): Promise<any>;
}
export interface InlineIframeManagerProps {
  contentWindow: Window;
  injectBeforeLoad?: InlineIframeManagerInjectHandler;
  injectAfterLoad: InlineIframeManagerInjectHandler;
  scripts?: string[];
  styles?: string[];
}

export class InlineIframeManager {
  constructor(props: InlineIframeManagerProps) {
    const { contentWindow, injectBeforeLoad, injectAfterLoad, scripts = [], styles = [] } = props;
    const documentElement = contentWindow.document.documentElement;
    if (!documentElement) throw new Error("My Error: iframe.contentDocument?.documentElement not exist");
    this.addStyles(contentWindow, styles);
    this.injectScript(contentWindow, injectBeforeLoad)?.then(() => {
      this.addScripts(contentWindow, scripts).then(() => this.ready(contentWindow, injectAfterLoad));
    });
  }

  ready(contentWindow: Window, injectAfterLoad: InlineIframeManagerInjectHandler) {
    contentWindow.dispatchEvent(new Event("ready"));
    setTimeout(() => injectAfterLoad(contentWindow));
  }

  setHtmlElementClass(contentWindow: Window, classNames: string[]) {
    const contentDocument = contentWindow.document;
    if (!contentDocument) return;
    contentDocument.documentElement.classList.add(...classNames);
  }

  async addScripts(contentWindow: Window, scripts: string[]) {
    const contentDocument = contentWindow.document;
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
    contentWindow: Window,
    type: "body" | "head",
    tag: T,
    attrs: A
  ) {
    const contentDocument = contentWindow.document;
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
    return element;
  }

  addInlineScript(contentWindow: Window, code: string) {
    const contentDocument = contentWindow.document;
    if (!contentDocument) return;
    const scriptElement = contentDocument.createElement("script");
    scriptElement.innerText = code;
    contentDocument.head.append(scriptElement);
  }

  addStyles(contentWindow: Window, styles: string[]) {
    const contentDocument = contentWindow.document;
    if (!contentDocument) return;
    styles.forEach((src) => {
      const linkElement = contentDocument.createElement("link");
      linkElement.rel = "stylesheet";
      linkElement.href = src;
      contentDocument.head.append(linkElement);
    });
  }

  injectScript(contentWindow: Window, handler?: InlineIframeManagerInjectHandler) {
    if (!contentWindow || !handler) return;
    return handler(contentWindow);
  }
}
