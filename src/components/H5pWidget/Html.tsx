import { createStyles, InputLabel, makeStyles } from "@material-ui/core";
import intersection from "lodash/intersection";
import React, { Fragment } from "react";
import { H5pElement, H5pElementProps, isH5pElementText } from "../H5pElement";
import { RichTextInput, UnstyledTag } from "../RichTextInput";

const useStyles = makeStyles(({ palette }) =>
  createStyles({
    label: {
      marginTop: 32,
    },
  })
);

const paramgraphTags = ["p", "pr", "pre", "h1", "h2", "h3", "h4", "h5", "h6"];

// h5p编辑器的奇怪行为
const wrapLine = (line: string) => (line.slice(-1)[0] === "\n" ? line : `${line}\n`);

export function WidgetElement(props: H5pElementProps) {
  const css = useStyles();
  if (isH5pElementText(props)) {
    const { itemHelper, onChange, className } = props;
    const { content, semantics } = itemHelper;
    const defaultTag =
      semantics.enterMode === "p"
        ? UnstyledTag.p
        : intersection(semantics.tags, paramgraphTags).length > 0
        ? UnstyledTag.p
        : UnstyledTag.div;
    return (
      <Fragment>
        <InputLabel className={css.label} required={!semantics.optional}>
          {semantics.label || semantics.name}
        </InputLabel>
        <RichTextInput
          className={className}
          defaultValue={content}
          defaultTag={defaultTag}
          onBlur={(html) => onChange && onChange({ ...itemHelper, content: wrapLine(html) })}
        />
      </Fragment>
    );
  }
  return <H5pElement {...props} />;
}

export const version = "1.0.0";
export const name = "H5PEditor.Html";
export const title = "html";
