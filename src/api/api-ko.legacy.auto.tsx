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

export type ClassesTeachersConnectionQueryVariables = Types.Exact<{
  cursor?: Types.Maybe<Types.Scalars["String"]>;
  filter?: Types.Maybe<Types.ClassFilter>;
  teacherFilter?: Types.Maybe<Types.UserFilter>;
  teacherCursor?: Types.Maybe<Types.Scalars["String"]>;
}>;

export type ClassesTeachersConnectionQuery = { __typename?: "Query" } & {
  classesConnection?: Types.Maybe<
    { __typename?: "ClassesConnectionResponse" } & Pick<Types.ClassesConnectionResponse, "totalCount"> & {
        edges?: Types.Maybe<
          Array<
            Types.Maybe<
              { __typename?: "ClassesConnectionEdge" } & {
                node?: Types.Maybe<
                  { __typename?: "ClassConnectionNode" } & Pick<Types.ClassConnectionNode, "id" | "name"> & {
                      teachersConnection?: Types.Maybe<
                        { __typename?: "UsersConnectionResponse" } & Pick<Types.UsersConnectionResponse, "totalCount"> & {
                            edges?: Types.Maybe<
                              Array<
                                Types.Maybe<
                                  { __typename?: "UsersConnectionEdge" } & Pick<Types.UsersConnectionEdge, "cursor"> & {
                                      node?: Types.Maybe<
                                        { __typename?: "UserConnectionNode" } & Pick<
                                          Types.UserConnectionNode,
                                          "id" | "givenName" | "familyName" | "status"
                                        >
                                      >;
                                    }
                                >
                              >
                            >;
                            pageInfo?: Types.Maybe<
                              { __typename?: "ConnectionPageInfo" } & Pick<
                                Types.ConnectionPageInfo,
                                "hasNextPage" | "hasPreviousPage" | "startCursor" | "endCursor"
                              >
                            >;
                          }
                      >;
                    }
                >;
              }
            >
          >
        >;
        pageInfo?: Types.Maybe<
          { __typename?: "ConnectionPageInfo" } & Pick<
            Types.ConnectionPageInfo,
            "hasNextPage" | "hasPreviousPage" | "startCursor" | "endCursor"
          >
        >;
      }
  >;
};

export type ClassNodeQueryVariables = Types.Exact<{
  classId: Types.Scalars["ID"];
  teacherCursor?: Types.Maybe<Types.Scalars["String"]>;
}>;

export type ClassNodeQuery = { __typename?: "Query" } & {
  classNode?: Types.Maybe<
    { __typename?: "ClassConnectionNode" } & Pick<Types.ClassConnectionNode, "name"> & {
        teachersConnection?: Types.Maybe<
          { __typename?: "UsersConnectionResponse" } & Pick<Types.UsersConnectionResponse, "totalCount"> & {
              edges?: Types.Maybe<
                Array<
                  Types.Maybe<
                    { __typename?: "UsersConnectionEdge" } & {
                      node?: Types.Maybe<
                        { __typename?: "UserConnectionNode" } & Pick<Types.UserConnectionNode, "id" | "familyName" | "givenName" | "status">
                      >;
                    }
                  >
                >
              >;
              pageInfo?: Types.Maybe<
                { __typename?: "ConnectionPageInfo" } & Pick<
                  Types.ConnectionPageInfo,
                  "hasNextPage" | "hasPreviousPage" | "startCursor" | "endCursor"
                >
              >;
            }
        >;
      }
  >;
};

export type ClassesBySchoolIdQueryVariables = Types.Exact<{
  cursor?: Types.Maybe<Types.Scalars["String"]>;
  filter?: Types.Maybe<Types.ClassFilter>;
  schoolId: Types.Scalars["ID"];
}>;

export type ClassesBySchoolIdQuery = { __typename?: "Query" } & {
  schoolNode?: Types.Maybe<
    { __typename?: "SchoolConnectionNode" } & Pick<Types.SchoolConnectionNode, "organizationId"> & {
        classesConnection?: Types.Maybe<
          { __typename?: "ClassesConnectionResponse" } & Pick<Types.ClassesConnectionResponse, "totalCount"> & {
              pageInfo?: Types.Maybe<{ __typename?: "ConnectionPageInfo" } & Pick<Types.ConnectionPageInfo, "endCursor" | "hasNextPage">>;
              edges?: Types.Maybe<
                Array<
                  Types.Maybe<
                    { __typename?: "ClassesConnectionEdge" } & {
                      node?: Types.Maybe<{ __typename?: "ClassConnectionNode" } & Pick<Types.ClassConnectionNode, "id" | "name">>;
                    }
                  >
                >
              >;
            }
        >;
      }
  >;
};

export type ClassesListQueryVariables = Types.Exact<{
  cursor?: Types.Maybe<Types.Scalars["String"]>;
  filter?: Types.Maybe<Types.ClassFilter>;
}>;

export type ClassesListQuery = { __typename?: "Query" } & {
  classesConnection?: Types.Maybe<
    { __typename?: "ClassesConnectionResponse" } & Pick<Types.ClassesConnectionResponse, "totalCount"> & {
        edges?: Types.Maybe<
          Array<
            Types.Maybe<
              { __typename?: "ClassesConnectionEdge" } & {
                node?: Types.Maybe<{ __typename?: "ClassConnectionNode" } & Pick<Types.ClassConnectionNode, "id" | "name">>;
              }
            >
          >
        >;
        pageInfo?: Types.Maybe<{ __typename?: "ConnectionPageInfo" } & Pick<Types.ConnectionPageInfo, "hasNextPage" | "endCursor">>;
      }
  >;
};

export type SchoolsClassesQueryVariables = Types.Exact<{
  cursor?: Types.Maybe<Types.Scalars["String"]>;
  filter?: Types.Maybe<Types.SchoolFilter>;
}>;

export type SchoolsClassesQuery = { __typename?: "Query" } & {
  schoolsConnection?: Types.Maybe<
    { __typename?: "SchoolsConnectionResponse" } & Pick<Types.SchoolsConnectionResponse, "totalCount"> & {
        edges?: Types.Maybe<
          Array<
            Types.Maybe<
              { __typename?: "SchoolsConnectionEdge" } & {
                node?: Types.Maybe<
                  { __typename?: "SchoolConnectionNode" } & Pick<Types.SchoolConnectionNode, "id" | "name"> & {
                      classesConnection?: Types.Maybe<
                        { __typename?: "ClassesConnectionResponse" } & Pick<Types.ClassesConnectionResponse, "totalCount"> & {
                            edges?: Types.Maybe<
                              Array<
                                Types.Maybe<
                                  { __typename?: "ClassesConnectionEdge" } & {
                                    node?: Types.Maybe<
                                      { __typename?: "ClassConnectionNode" } & Pick<Types.ClassConnectionNode, "id" | "name">
                                    >;
                                  }
                                >
                              >
                            >;
                            pageInfo?: Types.Maybe<
                              { __typename?: "ConnectionPageInfo" } & Pick<Types.ConnectionPageInfo, "hasNextPage" | "endCursor">
                            >;
                          }
                      >;
                    }
                >;
              }
            >
          >
        >;
        pageInfo?: Types.Maybe<{ __typename?: "ConnectionPageInfo" } & Pick<Types.ConnectionPageInfo, "hasNextPage" | "endCursor">>;
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
export const ClassesTeachersConnectionDocument = gql`
  query classesTeachersConnection($cursor: String, $filter: ClassFilter, $teacherFilter: UserFilter, $teacherCursor: String) {
    classesConnection(filter: $filter, directionArgs: { cursor: $cursor }, direction: FORWARD, sort: { order: ASC, field: name }) {
      totalCount
      edges {
        node {
          id
          name
          teachersConnection(filter: $teacherFilter, cursor: $teacherCursor, direction: FORWARD) {
            totalCount
            edges {
              cursor
              node {
                id
                givenName
                familyName
                status
              }
            }
            pageInfo {
              hasNextPage
              hasPreviousPage
              startCursor
              endCursor
            }
          }
        }
      }
      pageInfo {
        hasNextPage
        hasPreviousPage
        startCursor
        endCursor
      }
    }
  }
`;

/**
 * __useClassesTeachersConnectionQuery__
 *
 * To run a query within a React component, call `useClassesTeachersConnectionQuery` and pass it any options that fit your needs.
 * When your component renders, `useClassesTeachersConnectionQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useClassesTeachersConnectionQuery({
 *   variables: {
 *      cursor: // value for 'cursor'
 *      filter: // value for 'filter'
 *      teacherFilter: // value for 'teacherFilter'
 *      teacherCursor: // value for 'teacherCursor'
 *   },
 * });
 */
export function useClassesTeachersConnectionQuery(
  baseOptions?: Apollo.QueryHookOptions<ClassesTeachersConnectionQuery, ClassesTeachersConnectionQueryVariables>
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<ClassesTeachersConnectionQuery, ClassesTeachersConnectionQueryVariables>(
    ClassesTeachersConnectionDocument,
    options
  );
}
export function useClassesTeachersConnectionLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<ClassesTeachersConnectionQuery, ClassesTeachersConnectionQueryVariables>
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<ClassesTeachersConnectionQuery, ClassesTeachersConnectionQueryVariables>(
    ClassesTeachersConnectionDocument,
    options
  );
}
export type ClassesTeachersConnectionQueryHookResult = ReturnType<typeof useClassesTeachersConnectionQuery>;
export type ClassesTeachersConnectionLazyQueryHookResult = ReturnType<typeof useClassesTeachersConnectionLazyQuery>;
export type ClassesTeachersConnectionQueryResult = Apollo.QueryResult<
  ClassesTeachersConnectionQuery,
  ClassesTeachersConnectionQueryVariables
>;
export const ClassNodeDocument = gql`
  query classNode($classId: ID!, $teacherCursor: String) {
    classNode(id: $classId) {
      name
      teachersConnection(cursor: $teacherCursor) {
        totalCount
        edges {
          node {
            id
            familyName
            givenName
            status
          }
        }
        pageInfo {
          hasNextPage
          hasPreviousPage
          startCursor
          endCursor
        }
      }
    }
  }
`;

/**
 * __useClassNodeQuery__
 *
 * To run a query within a React component, call `useClassNodeQuery` and pass it any options that fit your needs.
 * When your component renders, `useClassNodeQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useClassNodeQuery({
 *   variables: {
 *      classId: // value for 'classId'
 *      teacherCursor: // value for 'teacherCursor'
 *   },
 * });
 */
export function useClassNodeQuery(baseOptions: Apollo.QueryHookOptions<ClassNodeQuery, ClassNodeQueryVariables>) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<ClassNodeQuery, ClassNodeQueryVariables>(ClassNodeDocument, options);
}
export function useClassNodeLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<ClassNodeQuery, ClassNodeQueryVariables>) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<ClassNodeQuery, ClassNodeQueryVariables>(ClassNodeDocument, options);
}
export type ClassNodeQueryHookResult = ReturnType<typeof useClassNodeQuery>;
export type ClassNodeLazyQueryHookResult = ReturnType<typeof useClassNodeLazyQuery>;
export type ClassNodeQueryResult = Apollo.QueryResult<ClassNodeQuery, ClassNodeQueryVariables>;
export const ClassesBySchoolIdDocument = gql`
  query classesBySchoolId($cursor: String, $filter: ClassFilter, $schoolId: ID!) {
    schoolNode(id: $schoolId) {
      organizationId
      classesConnection(filter: $filter, cursor: $cursor, direction: FORWARD) {
        totalCount
        pageInfo {
          endCursor
          hasNextPage
        }
        edges {
          node {
            id
            name
          }
        }
      }
    }
  }
`;

/**
 * __useClassesBySchoolIdQuery__
 *
 * To run a query within a React component, call `useClassesBySchoolIdQuery` and pass it any options that fit your needs.
 * When your component renders, `useClassesBySchoolIdQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useClassesBySchoolIdQuery({
 *   variables: {
 *      cursor: // value for 'cursor'
 *      filter: // value for 'filter'
 *      schoolId: // value for 'schoolId'
 *   },
 * });
 */
export function useClassesBySchoolIdQuery(baseOptions: Apollo.QueryHookOptions<ClassesBySchoolIdQuery, ClassesBySchoolIdQueryVariables>) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<ClassesBySchoolIdQuery, ClassesBySchoolIdQueryVariables>(ClassesBySchoolIdDocument, options);
}
export function useClassesBySchoolIdLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<ClassesBySchoolIdQuery, ClassesBySchoolIdQueryVariables>
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<ClassesBySchoolIdQuery, ClassesBySchoolIdQueryVariables>(ClassesBySchoolIdDocument, options);
}
export type ClassesBySchoolIdQueryHookResult = ReturnType<typeof useClassesBySchoolIdQuery>;
export type ClassesBySchoolIdLazyQueryHookResult = ReturnType<typeof useClassesBySchoolIdLazyQuery>;
export type ClassesBySchoolIdQueryResult = Apollo.QueryResult<ClassesBySchoolIdQuery, ClassesBySchoolIdQueryVariables>;
export const ClassesListDocument = gql`
  query classesList($cursor: String, $filter: ClassFilter) {
    classesConnection(filter: $filter, directionArgs: { cursor: $cursor }, direction: FORWARD) {
      totalCount
      edges {
        node {
          id
          name
        }
      }
      pageInfo {
        hasNextPage
        endCursor
      }
    }
  }
`;

/**
 * __useClassesListQuery__
 *
 * To run a query within a React component, call `useClassesListQuery` and pass it any options that fit your needs.
 * When your component renders, `useClassesListQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useClassesListQuery({
 *   variables: {
 *      cursor: // value for 'cursor'
 *      filter: // value for 'filter'
 *   },
 * });
 */
export function useClassesListQuery(baseOptions?: Apollo.QueryHookOptions<ClassesListQuery, ClassesListQueryVariables>) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<ClassesListQuery, ClassesListQueryVariables>(ClassesListDocument, options);
}
export function useClassesListLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<ClassesListQuery, ClassesListQueryVariables>) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<ClassesListQuery, ClassesListQueryVariables>(ClassesListDocument, options);
}
export type ClassesListQueryHookResult = ReturnType<typeof useClassesListQuery>;
export type ClassesListLazyQueryHookResult = ReturnType<typeof useClassesListLazyQuery>;
export type ClassesListQueryResult = Apollo.QueryResult<ClassesListQuery, ClassesListQueryVariables>;
export const SchoolsClassesDocument = gql`
  query schoolsClasses($cursor: String, $filter: SchoolFilter) {
    schoolsConnection(filter: $filter, directionArgs: { cursor: $cursor }, direction: FORWARD, sort: { order: ASC, field: name }) {
      totalCount
      edges {
        node {
          id
          name
          classesConnection(direction: FORWARD) {
            totalCount
            edges {
              node {
                id
                name
              }
            }
            pageInfo {
              hasNextPage
              endCursor
            }
          }
        }
      }
      pageInfo {
        hasNextPage
        endCursor
      }
    }
  }
`;

/**
 * __useSchoolsClassesQuery__
 *
 * To run a query within a React component, call `useSchoolsClassesQuery` and pass it any options that fit your needs.
 * When your component renders, `useSchoolsClassesQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useSchoolsClassesQuery({
 *   variables: {
 *      cursor: // value for 'cursor'
 *      filter: // value for 'filter'
 *   },
 * });
 */
export function useSchoolsClassesQuery(baseOptions?: Apollo.QueryHookOptions<SchoolsClassesQuery, SchoolsClassesQueryVariables>) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<SchoolsClassesQuery, SchoolsClassesQueryVariables>(SchoolsClassesDocument, options);
}
export function useSchoolsClassesLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<SchoolsClassesQuery, SchoolsClassesQueryVariables>) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<SchoolsClassesQuery, SchoolsClassesQueryVariables>(SchoolsClassesDocument, options);
}
export type SchoolsClassesQueryHookResult = ReturnType<typeof useSchoolsClassesQuery>;
export type SchoolsClassesLazyQueryHookResult = ReturnType<typeof useSchoolsClassesLazyQuery>;
export type SchoolsClassesQueryResult = Apollo.QueryResult<SchoolsClassesQuery, SchoolsClassesQueryVariables>;
