import { Status } from "@api/api-ko-schema.auto";
import { ApolloQueryResult } from "@apollo/client";
import get from "lodash/get";
import orderBy from "lodash/orderBy";
type JSONValue = string | number | boolean | null | JSONObject | JSONArray;
interface JSONObject {
  [x: string]: JSONValue;
}
interface JSONArray extends Array<JSONValue> {}

export function orderByASC<T extends { [key: string]: any }>(data: T[], key: string): T[] {
  return orderBy(data, [(item: T) => item[key].toLowerCase()], ["asc"]);
}
/*
 * @param data
 * @param key
 */
export function orderByDESC<T extends { [key: string]: any }>(data: T[], key: string): T[] {
  return orderBy(data, [(item: T) => item[key].toLowerCase()], ["desc"]);
}

/**
 *
 * @param data [] or {}
 * @returns remove the inactive items in data
 *
 */

export function grepActive<T extends JSONValue>(data: T): T {
  const dataIsArray = Array.isArray(data);
  const dataIsObject = null !== data && !dataIsArray && "object" === typeof data;

  if (dataIsArray) {
    return (data as JSONArray)
      .filter((item: JSONValue) => get(item, "status") !== Status.Inactive)
      .map((item: JSONValue) => grepActive(item)) as T;
  } else if (dataIsObject) {
    let res: JSONObject = {};
    Object.keys(data).forEach((item) => {
      res[item] = grepActive(data[item]);
    });
    return res as T;
  } else {
    return data;
  }
}

export function grepActiveQueryResult<T>(result: ApolloQueryResult<T>): T {
  return grepActive(result.data as unknown as JSONValue) as unknown as T;
}
