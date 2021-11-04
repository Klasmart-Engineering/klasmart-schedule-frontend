import React, { ReactNode } from "react";
import PermissionType from "../../api/PermissionType";
import { useChoosePermission, useLoadPermission, usePermission } from "../../hooks/usePermission";

export type PermissionResult<V> = V extends PermissionType[] ? Record<string | number, boolean> : boolean;

export interface PermissionProps<V> {
  debug?: boolean;
  value: V;
  render?: (value: boolean) => ReactNode;
  children?: ReactNode;
}
const Permission = function Permission<V extends PermissionType | PermissionType[]>(props: PermissionProps<V>) {
  const { debug, value, render, children } = props;
  const arr = typeof value === "object" ? (value as PermissionType[]) : ([value] as PermissionType[]);
  const perms = usePermission(arr);
  const specificPerms = useChoosePermission(perms, arr);
  const hasPerm = Object.values(specificPerms).every((v) => v);
  if (debug) {
    console.log(perms, specificPerms, hasPerm);
  }
  //const perm = usePermission(value);
  if (render) return <>{render(hasPerm)}</>;

  return hasPerm ? <>{children}</> : null;
};

export interface PermissionOrProps {
  value: PermissionType[];
  render?: (value: boolean) => ReactNode;
  children?: ReactNode;
}

const PermissionOr = function PermissionOr(props: PermissionOrProps) {
  const { value, render, children } = props;
  const perms = usePermission(value);
  const specificPerms = useChoosePermission(perms, value);
  const hasPerm = Object.values(specificPerms).some((v) => v);
  if (render) return <>{render(hasPerm)}</>;
  return hasPerm ? <>{children}</> : null;
};

export interface PermissionsWrapperProps {
  value?: PermissionType[];
  children: React.ReactNode;
}
/*
 This component is used as a pre load for permissions , to send all children‘s permissions request only once 
*/

const PermissionsWrapper = ({ value: propsValue, children }: PermissionsWrapperProps) => {
  //const values: PermissionType[] = propsValue ? propsValue : React.Children.map(children, x => (x as any).props.value) as PermissionType[];
  let values: PermissionType[] = [];

  if (propsValue) {
    values = propsValue;
  } else {
    React.Children.forEach(children, (x) => {
      const v = (x as any).props.value as PermissionType | PermissionType[];
      if (typeof v === "object") {
        values.concat(v);
      } else {
        values.push(v);
      }
    });
  }

  const loaded = useLoadPermission(values);
  return loaded ? <>{children}</> : null;
};

export { Permission, PermissionOr, PermissionsWrapper };
