import { Button, IconButton, InputLabel, makeStyles, Tooltip } from "@material-ui/core";
import { Cancel } from "@material-ui/icons";
import getByPath from "lodash/get";
import React, { cloneElement } from "react";
import { H5PGroupContent, H5PGroupSemantic, H5PNumberContent, H5PNumberSemantic } from "../../models/ModelH5pSchema";
import { H5pElement, H5pElementNumberProps, H5pElementProps, H5pElementTextProps, isH5pElementList } from "../H5pElement";

const useStyles = makeStyles(({ shadows }) => ({
  paragraph: {
    marginTop: 32,
    padding: 8,
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
    lineHeight: 2,
  },
  description: {
    fontSize: 12,
  },
  addButton: {
    marginTop: 10,
  },
  rangeRow: {
    display: "flex",
    marginTop: 16,
    justifyContent: "space-between",
    alignItems: "center",
    padding: "16px 64px 16px 16px",
    position: "relative",
    boxShadow: shadows[1],
  },
  closeContainer: {
    position: "absolute",
    display: "flex",
    width: 48,
    right: 0,
    top: 0,
    bottom: 0,
    alignItems: "center",
  },
  closeButton: {},
  toInput: {
    width: "15%",
    marginTop: 0,
  },
  fromInput: {
    width: "15%",
    marginTop: 0,
  },
  feedbackInput: {
    width: "60%",
    marginTop: 0,
  },
}));

export function WidgetElement(props: H5pElementProps) {
  const css = useStyles();
  if (!isH5pElementList(props)) return <H5pElement {...props} />;
  const { itemHelper, onAddListItem, classes, onChange } = props;
  const { semantics, content } = itemHelper;
  const childSemantic = itemHelper.childItems[0].semantics as H5PGroupSemantic;
  const [{ name: fromInputName }, { name: toInputName }] = childSemantic.fields;
  const amount = Number(content?.length);
  const handleClickAdd = () => {
    const form = onAddListItem(itemHelper);
    const listContent: H5PGroupContent[] = getByPath(form, itemHelper.path);
    onChange &&
      onChange({
        ...itemHelper,
        content: [
          ...listContent.slice(0, amount - 1),
          { ...listContent[amount - 1], [toInputName]: undefined },
          { ...listContent[amount], [fromInputName]: undefined },
        ],
      });
  };

  const handleClickRemove = (index: number) => {
    const orginContent = content as H5PGroupContent[];
    const { default: fromDefault } = itemHelper.childItems[0]?.childItems[0].semantics as H5PNumberSemantic;
    const { default: toDefault } = itemHelper.childItems[0]?.childItems[1].semantics as H5PNumberSemantic;
    const prevToValue = orginContent[index - 1]?.[toInputName] as H5PNumberContent;
    let listContent: H5PGroupContent[];
    if (index === 0) {
      listContent = [{ ...orginContent[1], [fromInputName]: fromDefault }, ...orginContent.slice(2)];
    } else if (index === amount - 1) {
      listContent = [...orginContent.slice(0, -2), { ...orginContent[amount - 2], [toInputName]: toDefault }];
    } else {
      listContent = [
        ...orginContent.slice(0, index),
        { ...orginContent[index + 1], [fromInputName]: prevToValue ? prevToValue + 1 : undefined },
        ...orginContent.slice(index + 2),
      ];
    }
    onChange && onChange({ ...itemHelper, content: listContent });
  };

  const handleChangeRange = (index: number, value?: number) => {
    if (!value) return;
    const listContent = content?.slice(0) as H5PGroupContent[];
    listContent[index] = { ...listContent[index], [toInputName]: value };
    listContent[index + 1] = { ...listContent[index + 1], [fromInputName]: Number(value) + 1 };
    onChange && onChange({ ...itemHelper, content: listContent });
  };

  return (
    <div>
      <div className={css.paragraph}>
        <InputLabel className={css.title} required={!semantics.optional}>
          {semantics.label || semantics.name}
        </InputLabel>
        <div className={css.description}>{semantics.description}</div>
      </div>
      {itemHelper.childItems.map((childItemHelper, idx) => {
        const fromInputElement = childItemHelper.childItems[0].node as JSX.Element;
        const toInputElement = childItemHelper.childItems[1].node as JSX.Element;
        const feedbackInputElement = childItemHelper.childItems[2].node as JSX.Element;
        const fromInputElementProps: Partial<H5pElementNumberProps> = { disabled: true, className: css.fromInput };
        const toInputElemntProps: Partial<H5pElementNumberProps> = {
          disabled: amount - 1 === idx,
          className: css.toInput,
          onChange: (toInputItemHelper) => handleChangeRange(idx, toInputItemHelper.content),
        };
        const feedbackInputElementProps: Partial<H5pElementTextProps> = { className: css.feedbackInput };
        return (
          <div className={css.rangeRow} key={childItemHelper.path}>
            {cloneElement(fromInputElement, fromInputElementProps)}-{cloneElement(toInputElement, toInputElemntProps)}
            {cloneElement(feedbackInputElement, feedbackInputElementProps)}
            <div className={css.closeContainer}>
              {amount > (semantics.min ?? 0) && (
                <Tooltip title="Remove Item">
                  <IconButton aria-label="close" className={css.closeButton} onClick={() => handleClickRemove(idx)}>
                    <Cancel />
                  </IconButton>
                </Tooltip>
              )}
            </div>
          </div>
        );
      })}
      <Button color="primary" variant="contained" size="large" onClick={handleClickAdd} className={classes?.button}>
        ADD {semantics.entity?.toUpperCase() ?? "ITEM"}
      </Button>
    </div>
  );
}

export const version = "1.0.0";
export const name = "H5PEditor.RangeList";
export const title = "RangeList";
