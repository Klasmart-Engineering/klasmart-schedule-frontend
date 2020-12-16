import { createStyles, makeStyles } from "@material-ui/core";
import { ContentState, convertFromHTML, EditorState } from 'draft-js';
import draftToHtml from 'draftjs-to-html';
import React, { useMemo } from "react";
import { Editor, EditorProps } from "react-draft-wysiwyg";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";

const useStyle = makeStyles(() => createStyles({
  richTextEditor: {
    padding: 8,
    borderRadius: 2,
    border: '1px solid #F1F1F1',
  }
}))

interface RichTextInputProps {
  className?: EditorProps['wrapperClassName'];
  defaultValue?: string;
  onChange: (value: string) => any;
}

export function RichTextInput(props: RichTextInputProps) {
  const { className, onChange } = props;
  const defaultValue = props.defaultValue ?? '';
  const css = useStyle();
  const defaultEditState = useMemo(() => {
    const { contentBlocks, entityMap } = convertFromHTML(defaultValue);
    return EditorState.createWithContent(ContentState.createFromBlockArray(contentBlocks, entityMap));
  }, [defaultValue]);
  const handleChangeContentState: EditorProps['onContentStateChange'] = (contentState) => {
    const html = draftToHtml(contentState) ?? '';
    console.log('html = ', html);
    onChange(html);
  };
  return (
    <Editor
      defaultEditorState={defaultEditState}
      onContentStateChange={handleChangeContentState}
      wrapperClassName={className}
      editorClassName={css.richTextEditor}
      toolbar={{
        options: ['inline', 'blockType', 'textAlign', 'remove'],
      }}
    />
  )
}