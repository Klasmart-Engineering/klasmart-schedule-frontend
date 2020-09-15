import { IntlFormatters, MessageDescriptor } from "react-intl";

type FormatMessageValue<T> = NonNullable<Parameters<IntlFormatters<T>["formatMessage"]>[1]> extends Record<any, infer V> ? V : never;
export type LangName = "en" | "kr" | "cn";

interface LangFullRecord<T = string> {
  id1: {
    id: "id1";
    description: "hello {theName}";
    values: {
      theName: FormatMessageValue<T>;
    };
  };
  id2: {
    id: "id2";
    description: "world";
    values: undefined;
  };
}

export interface LangMessageDescriptor extends Omit<MessageDescriptor, "id"> {
  id: keyof LangFullRecord;
}

export type LangeFormatMessageValues<Id extends keyof LangFullRecord> = LangFullRecord[Id]["values"];

export type LangFullRecordItem = LangFullRecord[keyof LangFullRecord];
