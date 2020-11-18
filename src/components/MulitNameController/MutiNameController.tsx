import React, { Fragment } from "react";
import { FieldValues, UseFormMethods } from "react-hook-form/dist/types";

interface renderProps<TName extends string> {
  value: Record<TName, any>;
  onChange: (value: renderProps<TName>["value"]) => any;
}

interface MultiNameControllerProps<TName extends string, TFieldValues extends FieldValues> {
  names: Array<TName>;
  formMethods: UseFormMethods<TFieldValues>;
  render: (props: renderProps<TName>) => any;
  defaultValue?: Record<TName, any>;
}
export function MultiNameController<TName extends string, TFieldValues extends FieldValues>(
  props: MultiNameControllerProps<TName, TFieldValues>
) {
  const { names, formMethods, render, defaultValue } = props;
  const formValues = formMethods.watch(names);
  const inputList = Object.values(names).map((name) => (
    <input name={name} hidden defaultValue={defaultValue && defaultValue[name]} ref={formMethods.register} />
  ));
  const onChange: renderProps<TName>["onChange"] = (value) => {
    // names.forEach((name) => {
    //   // formMethods.setValue(name, value[name], { shouldDirty: true });
    // });
  };
  return (
    <Fragment>
      {inputList}
      {render({ value: formValues, onChange })}
    </Fragment>
  );
}
