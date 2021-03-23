import { createStyles, makeStyles } from "@material-ui/core";
import { CSSProperties } from "@material-ui/core/styles/withStyles";
import { convertToHTML, IConvertToHTMLConfig } from "draft-convert";
import { ContentState, convertFromHTML, EditorState, RawDraftContentBlock } from "draft-js";
import React, { useMemo, useRef, useState } from "react";
import { Editor, EditorProps } from "react-draft-wysiwyg";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";

const useStyle = makeStyles(() =>
  createStyles({
    "@global": {
      ".public-DraftStyleDefault-block": {
        margin: "0.65em 0",
      },
    },
    richTextEditor: {
      padding: 8,
      borderRadius: 2,
      border: "1px solid rgba(0,0,0,.23)",

      "&:hover": {
        borderColor: "rgba(0,0,0,.87)",
      },
    },
    toolbar: {},
  })
);

export enum UnstyledTag {
  div = "div",
  p = "p",
}

const createTagMap = (unstyledTag: UnstyledTag) =>
  ({
    unstyled: unstyledTag,
    paragraph: "p",
    "header-one": "h1",
    "header-two": "h2",
    "header-three": "h3",
    "header-four": "h4",
    "header-five": "h5",
    "header-six": "h6",
    "unordered-list-item": "li",
    "ordered-list-item": "li",
    blockquote: "blockquote",
    code: "pre",
  } as const);

const styleToHTML: IConvertToHTMLConfig["styleToHTML"] = (style) => {
  const [token, value] = style.split("-");
  switch (token) {
    case "fontsize":
      return <span style={{ fontSize: value }} />;
    case "color":
      return <span style={{ color: value }} />;
    case "fontfamily":
      return <span style={{ fontFamily: value }} />;
    case "SUPERSCRIPT":
      return <sup />;
    case "SUBSCRIPT":
      return <sub />;
    case "STRIKETHROUGH":
      return <s />;
  }
};

const entityToHTML: IConvertToHTMLConfig["entityToHTML"] = (entity, originalText) => {
  if (entity.type === "LINK") {
    /* eslint-disable-next-line jsx-a11y/anchor-has-content */
    return <a href={entity.data.url} target={entity.data.targetOption} />;
  }
};

const createConvertOption = (unstyledTag: UnstyledTag): IConvertToHTMLConfig => {
  const tagMap = createTagMap(unstyledTag);
  return {
    styleToHTML,
    entityToHTML,
    blockToHTML: (((block: RawDraftContentBlock) => {
      const Tag = tagMap[block.type as keyof typeof tagMap] ?? "div";
      const textAlign = block.data && (block.data["text-align"] as CSSProperties["textAlign"]);
      const nest = block.type === "unordered-list-item" ? <ul /> : block.type === "ordered-list-item" ? <ol /> : undefined;
      const element = textAlign ? <Tag style={{ textAlign }} /> : <Tag />;
      return nest ? { nest, element } : element;
    }) as unknown) as IConvertToHTMLConfig["blockToHTML"],
  };
};

interface fixedBlurHandler {
  (e: any, editorState: EditorState): any;
}

const useFixLinkBlurBug = (blurHandler: fixedBlurHandler) => {
  const lastEntityKeyRef = useRef<string>();
  const detectBlurByLink: EditorProps["onEditorStateChange"] = (editorState) => {
    const lastEntityKey = editorState.getCurrentContent().getLastCreatedEntityKey();
    if (lastEntityKeyRef.current === lastEntityKey) return;
    lastEntityKeyRef.current = lastEntityKey;
    blurHandler(undefined, editorState);
  };
  return { detectBlurByLink };
};

export interface RichTextInputProps {
  className?: string;
  defaultValue?: string;
  defaultTag?: UnstyledTag;
  onChange?: (value: string) => any;
  onBlur?: (value: string) => any;
}
export function RichTextInput(props: RichTextInputProps) {
  const { className, onChange, onBlur, defaultTag = UnstyledTag.div } = props;
  const defaultValue = props.defaultValue ?? "";
  const convertOption = createConvertOption(defaultTag);
  const [focus, setFocus] = useState(false);
  const css = useStyle();
  const defaultEditState = useMemo(() => {
    const { contentBlocks, entityMap } = convertFromHTML(defaultValue);
    return EditorState.createWithContent(ContentState.createFromBlockArray(contentBlocks, entityMap));
  }, [defaultValue]);
  const handleBlur: fixedBlurHandler = (e, editorState) => {
    setFocus(false);
    if (!onBlur) return;
    const html = convertToHTML(convertOption)(editorState.getCurrentContent()) ?? "";
    onBlur(html);
  };
  const { detectBlurByLink } = useFixLinkBlurBug(handleBlur);
  const handleChangeEditorState: EditorProps["onEditorStateChange"] = (editorState) => {
    detectBlurByLink(editorState);
    if (!onChange) return;
    const html = convertToHTML({})(editorState.getCurrentContent()) ?? "";
    onChange(html);
  };
  return (
    <Editor
      defaultEditorState={defaultEditState}
      onEditorStateChange={handleChangeEditorState}
      onBlur={handleBlur as EditorProps["onBlur"]}
      onFocus={() => setFocus(true)}
      wrapperClassName={className}
      editorClassName={css.richTextEditor}
      toolbarClassName={css.toolbar}
      toolbarHidden={!focus}
      toolbar={{
        options: [
          "inline",
          "blockType",
          "fontSize",
          "fontFamily",
          "list",
          "textAlign",
          "colorPicker",
          "link",
          "emoji",
          "remove",
          "history",
        ],
        link: { showOpenOptionOnHover: false },
      }}
    />
  );
}
