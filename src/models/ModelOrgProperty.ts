import { cloneDeep } from "@apollo/client/utilities";
import { OrgInfoProps } from "@pages/MyContentList/OrganizationList";
import { EntityOrganizationInfo } from "../api/api.auto";

export function orgs2id(orgs: EntityOrganizationInfo[]): string[] {
  return orgs.map((item) => item.id || "");
}
export function excludeMyOrg(orgs: OrgInfoProps[], id: string): OrgInfoProps[] {
  if (!orgs.length || !id) return orgs;
  const index = id ? orgs.findIndex((item) => item.organization_id === id) : -1;
  const newOrgs = cloneDeep(orgs);
  if (index >= 0) {
    newOrgs.splice(index, 1);
  }
  return newOrgs;
}
