import { createStyles, makeStyles } from "@material-ui/core";
import { ContentState, convertFromHTML, convertToRaw, EditorState } from "draft-js";
import draftToHtml from "draftjs-to-html";
import React, { useMemo } from "react";
import { Editor, EditorProps } from "react-draft-wysiwyg";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";

const useStyle = makeStyles(() =>
  createStyles({
    richTextEditor: {
      padding: 8,
      borderRadius: 2,
      border: "1px solid #F1F1F1",
    },
  })
);

interface Entity {
  type: string;
  mutalibity: any;
  data: any;
}
const customEntityTransform = (entity: Entity, text: any) => {
  console.log("entity, text = ", entity, text);
  return;
};

export interface RichTextInputProps {
  className?: string;
  defaultValue?: string;
  onChange?: (value: string) => any;
  onBlur?: (value: string) => any;
}

export function RichTextInput(props: RichTextInputProps) {
  const { className, onChange, onBlur } = props;
  const defaultValue = props.defaultValue ?? "";
  const css = useStyle();
  const defaultEditState = useMemo(() => {
    const { contentBlocks, entityMap } = convertFromHTML(defaultValue);
    return EditorState.createWithContent(ContentState.createFromBlockArray(contentBlocks, entityMap));
  }, [defaultValue]);
  const handleChangeContentState: EditorProps["onContentStateChange"] = (contentState) => {
    if (!onChange) return;
    const html = draftToHtml(contentState) ?? "";
    console.log("html = ", html);
    onChange(html);
  };
  const handleBlur = (e: any, editorState: EditorState) => {
    if (!onBlur) return;
    const result = convertToRaw(editorState.getCurrentContent());
    debugger;
    const html = draftToHtml(result, undefined, undefined, customEntityTransform) ?? "";
    console.log("html = ", html);
    onBlur(html);
  };
  return (
    <Editor
      defaultEditorState={defaultEditState}
      onContentStateChange={handleChangeContentState}
      onBlur={handleBlur as EditorProps["onBlur"]}
      wrapperClassName={className}
      editorClassName={css.richTextEditor}
      toolbar={{
        options: ["inline", "blockType", "textAlign", "remove"],
      }}
    />
  );
}
