import * as Types from "./api-ko-schema.auto";

import { gql } from "@apollo/client";
import * as Apollo from "@apollo/client";
const defaultOptions = {};
export type GetStudentNameByIdQueryVariables = Types.Exact<{
  filter?: Types.Maybe<Types.UserFilter>;
}>;

export type GetStudentNameByIdQuery = { __typename?: "Query" } & {
  usersConnection?: Types.Maybe<
    { __typename?: "UsersConnectionResponse" } & {
      edges?: Types.Maybe<
        Array<
          Types.Maybe<
            { __typename?: "UsersConnectionEdge" } & {
              node?: Types.Maybe<{ __typename?: "UserConnectionNode" } & Pick<Types.UserConnectionNode, "id" | "givenName" | "familyName">>;
            }
          >
        >
      >;
    }
  >;
};

export const GetStudentNameByIdDocument = gql`
  query getStudentNameById($filter: UserFilter) {
    usersConnection(filter: $filter, direction: FORWARD) {
      edges {
        node {
          id
          givenName
          familyName
        }
      }
    }
  }
`;

/**
 * __useGetStudentNameByIdQuery__
 *
 * To run a query within a React component, call `useGetStudentNameByIdQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetStudentNameByIdQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetStudentNameByIdQuery({
 *   variables: {
 *      filter: // value for 'filter'
 *   },
 * });
 */
export function useGetStudentNameByIdQuery(
  baseOptions?: Apollo.QueryHookOptions<GetStudentNameByIdQuery, GetStudentNameByIdQueryVariables>
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<GetStudentNameByIdQuery, GetStudentNameByIdQueryVariables>(GetStudentNameByIdDocument, options);
}
export function useGetStudentNameByIdLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<GetStudentNameByIdQuery, GetStudentNameByIdQueryVariables>
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<GetStudentNameByIdQuery, GetStudentNameByIdQueryVariables>(GetStudentNameByIdDocument, options);
}
export type GetStudentNameByIdQueryHookResult = ReturnType<typeof useGetStudentNameByIdQuery>;
export type GetStudentNameByIdLazyQueryHookResult = ReturnType<typeof useGetStudentNameByIdLazyQuery>;
export type GetStudentNameByIdQueryResult = Apollo.QueryResult<GetStudentNameByIdQuery, GetStudentNameByIdQueryVariables>;
