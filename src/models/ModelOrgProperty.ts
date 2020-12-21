import { EntityOrganizationInfo } from "../api/api.auto";

export function orgs2id(orgs: EntityOrganizationInfo[]): string[] {
  return orgs.map((item) => item.id || "");
}
