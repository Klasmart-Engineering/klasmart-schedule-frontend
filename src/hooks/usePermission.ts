import React from "react";
import PermissionType from "../api/PermissionType";
import permissionCache, { ICacheData } from "../services/permissionCahceService";

function usePermission(perms: PermissionType[]) {
  const [state, setState] = React.useState<ICacheData>({});

  React.useEffect(() => {
    (async () => {
      const permsData = await permissionCache.usePermission(perms);
      setState(permsData);
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return state;
}

function useChoosePermission(perms: ICacheData, permsToChoose: PermissionType[]): ICacheData {
  return permsToChoose.reduce((prev, cur) => {
    prev[cur] = perms[cur];
    return prev;
  }, {} as ICacheData);
}

export { usePermission, useChoosePermission };
