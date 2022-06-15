import { GET_CLASS_NODE_ROSTER } from "./api.gql";
import { QueryHookOptions, useQuery } from "@apollo/client";
import { UserFilter, ClassConnectionNode } from "@api/api-ko-schema.auto";

export interface GetClassNodeRequest {
  id: string;
  count?: number;
  rosterCount?: number;
  programsCount?: number;
  subjectsCount?: number;
  orderBy?: string;
  order?: string;
  direction?: string;
  showStudents?: boolean;
  showTeachers?: boolean;
  cursor?: string;
  filter?: UserFilter;
}

export interface GetClassNodeResponse {
  classNode: ClassConnectionNode;
}

export const useGetClassNodeRoster = (options?: QueryHookOptions<GetClassNodeResponse, GetClassNodeRequest>) => {
  return useQuery<GetClassNodeResponse, GetClassNodeRequest>(GET_CLASS_NODE_ROSTER, options);
};
