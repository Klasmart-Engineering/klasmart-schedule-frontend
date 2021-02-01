import { Checkbox, FormControlLabel, InputLabel, makeStyles } from "@material-ui/core";
import clsx from "clsx";
import React from "react";
import { d } from "../../locale/LocaleManager";
import { H5pElement, H5pElementProps, isH5pElementSelect } from "../H5pElement";

const useStyles = makeStyles(({ palette, shadows }) => ({
  title: {
    fontSize: 16,
    fontWeight: "bold",
    lineHeight: 2,
  },
  formControlLabel: {
    display: "block",
  },
}));

export interface DynamicCheckboxesOption {
  label: string;
  value: number;
}

type DynamicCheckboxesProps = H5pElementProps & {
  options?: DynamicCheckboxesOption[];
};

export function WidgetElement(props: DynamicCheckboxesProps) {
  const css = useStyles();
  if (!isH5pElementSelect(props)) return <H5pElement {...props} />;
  const { itemHelper, classes, className, onChange, options } = props;
  const { semantics, path, content } = itemHelper;
  const widgetContent = content as number[];
  const allValues = options?.map(({ value }) => value);
  const handleChangeSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    const result = e.target.checked ? allValues : [];
    onChange && onChange({ semantics, path, content: result });
  };
  const handleChange = (value: number) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const result = new Set(widgetContent);
    e.target.checked ? result.add(value) : result.delete(value);
    onChange && onChange({ semantics, path, content: Array.from(result) });
  };
  const optionsList = options?.map(({ label, value }) => (
    <FormControlLabel
      className={css.formControlLabel}
      key={`${path}:options:${value}`}
      label={label}
      control={<Checkbox name={path} checked={widgetContent.includes(value)} onChange={handleChange(value)} key={`${path}: ${content}`} />}
    />
  ));
  return (
    <div className={clsx(className, classes?.root)}>
      <div className={classes?.paragraph}>
        <InputLabel className={css.title} required={!semantics.optional}>
          {semantics.label || semantics.name}
        </InputLabel>
        <div className={classes?.description}>{semantics.description}</div>
      </div>
      {!!allValues?.length && (
        <FormControlLabel
          className={css.formControlLabel}
          key={`${path}:options:all`}
          label={d("All").t("report_label_all")}
          control={<Checkbox name={path} checked={widgetContent.length === allValues?.length} onChange={handleChangeSelectAll} />}
        />
      )}
      {optionsList}
    </div>
  );
}

export const version = "1.0.0";
export const name = "H5PEditor.DynamicCheckboxes";
export const title = "dynamicCheckboxes";
