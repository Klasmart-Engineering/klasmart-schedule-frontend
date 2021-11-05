import React from "react";
import PermissionType from "../api/PermissionType";
import permissionCache, { ICacheData } from "../services/permissionCahceService";

function usePermission(perms: PermissionType[]) {
  const [state, setState] = React.useState<ICacheData>({});

  React.useEffect(() => {
    (async () => {
      const permsData = await permissionCache.usePermission(perms);
      console.log("---", permsData);
      setState(permsData);
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return state;
}

/**
 *
 * use this hook to preload some permissions
 *
 */

function useLoadPermission(perms: PermissionType[]) {
  const [loaded, setLoaded] = React.useState<boolean>(false);
  React.useEffect(() => {
    (async () => {
      await permissionCache.usePermission(perms);
      setLoaded(true);
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return loaded;
}
/**
 *  choose some permissions from list
 *  @perms  permissions list, return value from function usePermission
 *  @permsToChoose permissions to choose
 *
 */
function useChoosePermission(perms: ICacheData, permsToChoose: PermissionType[]): ICacheData {
  return permsToChoose.reduce((prev, cur) => {
    prev[cur] = perms[cur];
    return prev;
  }, {} as ICacheData);
}

export { usePermission, useLoadPermission, useChoosePermission };
