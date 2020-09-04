import produce from "immer";
import { ChangeEvent, ReactElement, useMemo } from "react";

type HashValue = Record<string, boolean>;

export interface CheckboxGroupContext {
  registerChange: (event: ChangeEvent<HTMLInputElement>) => any;
  hashValue: HashValue;
}

interface CheckboxGroupProps {
  render: (props: CheckboxGroupContext) => ReactElement;
  value?: string[];
  onChange: (value: string[] | undefined) => any;
}

function toHash(list: string[]): HashValue {
  return list.reduce<HashValue>((result, key) => {
    result[key] = true;
    return result;
  }, {});
}

export function CheckboxGroup(props: CheckboxGroupProps) {
  const { render, value = [], onChange } = props;
  // const [hashValue, setHashValue] = useState<HashValue>(useMemo(() => toHash(value), [value]))
  const hashValue = useMemo(() => toHash(value), [value]);
  const registerChange = useMemo<CheckboxGroupContext['registerChange']>(() => (event) => {
    const { checked, value } = event.target;
    // setHashValue(produce(hashValue, draft => {
    //   checked ? (draft[value] = true) : delete draft[value];
    // }))
    const newhashValue = produce(hashValue, draft => {
      checked ? (draft[value] = true) : delete draft[value];
    });
    const list = Object.keys(newhashValue);
    onChange(list.length ? list : undefined);
  }, [hashValue, onChange]);
  return render({ hashValue, registerChange });
}