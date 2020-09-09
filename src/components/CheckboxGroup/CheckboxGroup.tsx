import produce from "immer";
import { ChangeEvent, ReactElement, useMemo } from "react";

type HashValue = Record<string, boolean>;

export interface CheckboxGroupContext {
  registerChange: (event: ChangeEvent<HTMLInputElement>) => any;
  registerAllChange: CheckboxGroupContext["registerChange"];
  hashValue: HashValue;
  isAllvalue: boolean;
}

interface CheckboxGroupProps {
  render: (props: CheckboxGroupContext) => ReactElement;
  value?: string[];
  allValue?: CheckboxGroupProps["value"];
  onChange: (value: string[] | undefined) => any;
}

function toHash(list: string[]): HashValue {
  return list.reduce<HashValue>((result, key) => {
    result[key] = true;
    return result;
  }, {});
}

export function CheckboxGroup(props: CheckboxGroupProps) {
  const { render, value = [], onChange, allValue = [] } = props;
  const hashValue = useMemo(() => toHash(value), [value]);
  const isAllvalue = allValue.length > 0 && value.length === allValue.length;
  const registerChange = useMemo<CheckboxGroupContext["registerChange"]>(
    () => (event) => {
      const { checked, value } = event.target;
      const newhashValue = produce(hashValue, (draft) => {
        checked ? (draft[value] = true) : delete draft[value];
      });
      const list = Object.keys(newhashValue);
      onChange(list.length ? list : []);
    },
    [hashValue, onChange]
  );
  const registerAllChange = useMemo<CheckboxGroupContext["registerAllChange"]>(
    () => (event) => {
      const { checked } = event.target;
      onChange(checked ? allValue : []);
    },
    [onChange, allValue]
  );
  return render({ hashValue, registerChange, registerAllChange, isAllvalue });
}
