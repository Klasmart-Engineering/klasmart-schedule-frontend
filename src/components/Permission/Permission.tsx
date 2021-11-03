import React, { ReactNode } from "react";
import PermissionType from "../../api/PermissionType";
import { useChoosePermission, usePermission } from "../../hooks/usePermission";

export type PermissionResult<V> = V extends PermissionType[] ? Record<string | number | symbol, boolean | undefined> : boolean | undefined;

export interface PermissionProps<V> {
  value: V;
  render?: (value: PermissionResult<V>) => ReactNode;
  children?: ReactNode;
}
export function Permission<V extends PermissionType | PermissionType[]>(props: PermissionProps<V>) {
  const { value, render, children } = props;
  const arr = typeof value === "object" ? (value as PermissionType[]) : ([value] as PermissionType[]);
  const perms = usePermission(arr);
  const specificPerms = useChoosePermission(perms, arr);

  //const perm = usePermission(value);
  if (render) return <>{render(perms as any)}</>;
  const hasPerm = Object.values(specificPerms).every((v) => v);
  return hasPerm ? <>{children}</> : null;
}

export interface PermissionOrProps {
  value: PermissionType[];
  render?: (value: boolean) => ReactNode;
  children?: ReactNode;
}
export function PermissionOr(props: PermissionOrProps) {
  const { value, render, children } = props;
  const perms = usePermission(value);
  const specificPerms = useChoosePermission(perms, value);
  const perm = Object.values(specificPerms).some((v) => v);
  if (render) return <>{render(perm)}</>;
  return perm ? <>{children}</> : null;
}
