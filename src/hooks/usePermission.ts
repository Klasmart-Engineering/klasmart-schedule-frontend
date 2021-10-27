import React from "react";
import { apiGetPartPermission } from "../api/extra";
import { PermissionType } from "../components/Permission";

type ICacheData = {
  [key in PermissionType]?: boolean;
};

class PermisionCahce {
  private data: ICacheData = {};
  private _add(data: ICacheData) {
    this.data = {
      ...this.data,
      ...data,
    };
  }
  private _get(perms: PermissionType[]) {
    return perms.reduce((prev, cur) => {
      if (this.data.hasOwnProperty(cur)) {
        prev[cur] = !!this.data[cur];
      }
      return prev;
    }, {} as ICacheData);
  }
  private flush() {
    this.data = {};
  }

  usePermission(perms: PermissionType[]): Promise<ICacheData> {
    const existPerms = this._get(perms);
    const noneExistPerms = perms.filter((perm) => !existPerms.hasOwnProperty(perm));
    return new Promise((resolve, reject) => {
      if (noneExistPerms.length === 0) {
        resolve(existPerms);
      } else {
        apiGetPartPermission(noneExistPerms).then((data: ICacheData) => {
          const permData = noneExistPerms.reduce((prev, cur) => {
            if (data && data.hasOwnProperty(cur) && "boolean" === typeof data[cur]) {
              prev[cur] = data[cur];
            }
            return prev;
          }, {} as ICacheData);
          this._add(permData);
          resolve({
            ...existPerms,
            ...permData,
          });
        });
      }
    });
  }
}

const permissionCache = new PermisionCahce();

function usePermission(perms: PermissionType[]) {
  //permissionCache.usePermission();
  const [state, setState] = React.useState<ICacheData>({});
  React.useEffect(() => {
    (async () => {
      const permsData = await permissionCache.usePermission(perms);
      setState(permsData);
    })();
  }, [perms]);

  return state;
}

export { permissionCache, usePermission };
