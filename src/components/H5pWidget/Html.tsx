import { createStyles, InputLabel, makeStyles } from "@material-ui/core";
import React, { Fragment } from "react";
import { H5pElement, H5pElementProps, isH5pElementText } from "../H5pElement";
import { RichTextInput } from "../RichTextInput";

const useStyles = makeStyles(({ palette }) =>
  createStyles({
    label: {
      marginTop: 32,
    },
  })
);

export function WidgetElement(props: H5pElementProps) {
  const css = useStyles();
  if (isH5pElementText(props)) {
    const { itemHelper, onChange, className } = props;
    const { content, semantics } = itemHelper;
    return (
      <Fragment>
        <InputLabel className={css.label} required={!semantics.optional}>
          {semantics.label || semantics.name}
        </InputLabel>
        <RichTextInput
          className={className}
          defaultValue={content}
          onBlur={(html) => onChange && onChange({ ...itemHelper, content: html })}
        />
      </Fragment>
    );
  }
  return <H5pElement {...props} />;
}

export const version = "1.0.0";
export const name = "H5PEditor.Html";
export const title = "html";
