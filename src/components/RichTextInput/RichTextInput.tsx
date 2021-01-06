import { createStyles, makeStyles } from "@material-ui/core";
import { CSSProperties } from "@material-ui/core/styles/withStyles";
import { convertToHTML, IConvertToHTMLConfig } from "draft-convert";
import { ContentState, convertFromHTML, EditorState, RawDraftContentBlock } from "draft-js";
import React, { useMemo, useState } from "react";
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

const TAG_MAP = {
  unstyled: "div",
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
} as const;

export interface RichTextInputProps {
  className?: string;
  defaultValue?: string;
  onChange?: (value: string) => any;
  onBlur?: (value: string) => any;
}

const styleToHTML: IConvertToHTMLConfig["styleToHTML"] = (style) => {
  console.log("style = ", style);
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

const blockToHTML = (((block: RawDraftContentBlock) => {
  console.log("block = ", block);
  const Tag = TAG_MAP[block.type as keyof typeof TAG_MAP] ?? "div";
  const textAlign = block.data && (block.data["text-align"] as CSSProperties["textAlign"]);
  const nest = block.type === "unordered-list-item" ? <ul /> : block.type === "ordered-list-item" ? <ol /> : undefined;
  const element = textAlign ? <Tag style={{ textAlign }} /> : <Tag />;
  return nest ? { nest, element } : element;
}) as unknown) as IConvertToHTMLConfig["blockToHTML"];

const entityToHTML: IConvertToHTMLConfig["entityToHTML"] = (entity, originalText) => {
  console.log("entity = ", entity);
  if (entity.type === "LINK") {
    /* eslint-disable-next-line jsx-a11y/anchor-has-content */
    return <a href={entity.data.url} target={entity.data.targetOption} />;
  }
};

const convertOption = { styleToHTML, blockToHTML, entityToHTML };

export function RichTextInput(props: RichTextInputProps) {
  const { className, onChange, onBlur } = props;
  const defaultValue = props.defaultValue ?? "";
  const [focus, setFocus] = useState(false);
  const css = useStyle();
  const defaultEditState = useMemo(() => {
    const { contentBlocks, entityMap } = convertFromHTML(defaultValue);
    return EditorState.createWithContent(ContentState.createFromBlockArray(contentBlocks, entityMap));
  }, [defaultValue]);
  const handleChangeEditorState: EditorProps["onEditorStateChange"] = (editorState) => {
    if (!onChange) return;
    debugger;
    const html = convertToHTML({})(editorState.getCurrentContent()) ?? "";
    console.log("html = ", html);
    onChange(html);
  };
  const handleBlur = (e: any, editorState: EditorState) => {
    setFocus(false);
    if (!onBlur) return;
    const html = convertToHTML(convertOption)(editorState.getCurrentContent()) ?? "";
    console.log("html = ", html);
    onBlur(html);
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
