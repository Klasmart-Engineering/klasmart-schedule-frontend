import * as Types from "./api-ko-schema.auto";

import { gql } from "@apollo/client";
import * as Apollo from "@apollo/client";
export type TeachersByOrgnizationQueryVariables = Types.Exact<{
  organization_id?: Types.Maybe<Types.Scalars["ID"]>;
}>;

export type TeachersByOrgnizationQuery = { __typename?: "Query" } & {
  organization?: Types.Maybe<
    { __typename?: "Organization" } & {
      teachers?: Types.Maybe<
        Array<
          Types.Maybe<
            { __typename?: "OrganizationMembership" } & {
              user?: Types.Maybe<{ __typename?: "User" } & Pick<Types.User, "user_id" | "user_name">>;
            }
          >
        >
      >;
    }
  >;
};

export type ClassesByTeacherQueryVariables = Types.Exact<{
  user_id?: Types.Maybe<Types.Scalars["ID"]>;
}>;

export type ClassesByTeacherQuery = { __typename?: "Query" } & {
  user?: Types.Maybe<
    { __typename?: "User" } & {
      classesTeaching?: Types.Maybe<Array<Types.Maybe<{ __typename?: "Class" } & Pick<Types.Class, "class_id" | "class_name">>>>;
    }
  >;
};

export type ClassesByOrganizationQueryVariables = Types.Exact<{
  organization_id?: Types.Maybe<Types.Scalars["ID"]>;
}>;

export type ClassesByOrganizationQuery = { __typename?: "Query" } & {
  organization?: Types.Maybe<
    { __typename?: "Organization" } & {
      classes?: Types.Maybe<Array<Types.Maybe<{ __typename?: "Class" } & Pick<Types.Class, "class_id" | "class_name">>>>;
    }
  >;
};

export type ParticipantsByClassQueryVariables = Types.Exact<{
  class_id?: Types.Maybe<Types.Scalars["ID"]>;
}>;

export type ParticipantsByClassQuery = { __typename?: "Query" } & {
  class?: Types.Maybe<
    { __typename?: "Class" } & {
      teachers?: Types.Maybe<Array<Types.Maybe<{ __typename?: "User" } & Pick<Types.User, "user_id" | "user_name">>>>;
      students?: Types.Maybe<Array<Types.Maybe<{ __typename?: "User" } & Pick<Types.User, "user_id" | "user_name">>>>;
    }
  >;
};

export type QeuryPermissionOfMeQueryVariables = Types.Exact<{
  organization_id?: Types.Scalars["ID"];
}>;

export type QeuryPermissionOfMeQuery = { __typename?: "Query" } & {
  me?: Types.Maybe<
    { __typename?: "User" } & {
      membership?: Types.Maybe<
        { __typename?: "OrganizationMembership" } & {
          roles?: Types.Maybe<
            Array<
              Types.Maybe<
                { __typename?: "Role" } & {
                  permissions?: Types.Maybe<Array<Types.Maybe<{ __typename?: "Permission" } & Pick<Types.Permission, "permission_name">>>>;
                }
              >
            >
          >;
        }
      >;
    }
  >;
};

export const TeachersByOrgnizationDocument = gql`
  query teachersByOrgnization($organization_id: ID = "3f135b91-a616-4c80-914a-e4463104dbac") {
    organization(organization_id: $organization_id) {
      teachers {
        user {
          user_id
          user_name
        }
      }
    }
  }
`;

/**
 * __useTeachersByOrgnizationQuery__
 *
 * To run a query within a React component, call `useTeachersByOrgnizationQuery` and pass it any options that fit your needs.
 * When your component renders, `useTeachersByOrgnizationQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useTeachersByOrgnizationQuery({
 *   variables: {
 *      organization_id: // value for 'organization_id'
 *   },
 * });
 */
export function useTeachersByOrgnizationQuery(
  baseOptions?: Apollo.QueryHookOptions<TeachersByOrgnizationQuery, TeachersByOrgnizationQueryVariables>
) {
  return Apollo.useQuery<TeachersByOrgnizationQuery, TeachersByOrgnizationQueryVariables>(TeachersByOrgnizationDocument, baseOptions);
}
export function useTeachersByOrgnizationLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<TeachersByOrgnizationQuery, TeachersByOrgnizationQueryVariables>
) {
  return Apollo.useLazyQuery<TeachersByOrgnizationQuery, TeachersByOrgnizationQueryVariables>(TeachersByOrgnizationDocument, baseOptions);
}
export type TeachersByOrgnizationQueryHookResult = ReturnType<typeof useTeachersByOrgnizationQuery>;
export type TeachersByOrgnizationLazyQueryHookResult = ReturnType<typeof useTeachersByOrgnizationLazyQuery>;
export type TeachersByOrgnizationQueryResult = Apollo.QueryResult<TeachersByOrgnizationQuery, TeachersByOrgnizationQueryVariables>;
export const ClassesByTeacherDocument = gql`
  query classesByTeacher($user_id: ID = "7d0ad09a-11ab-4147-9734-974276f397d1") {
    user(user_id: $user_id) {
      classesTeaching {
        class_id
        class_name
      }
    }
  }
`;

/**
 * __useClassesByTeacherQuery__
 *
 * To run a query within a React component, call `useClassesByTeacherQuery` and pass it any options that fit your needs.
 * When your component renders, `useClassesByTeacherQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useClassesByTeacherQuery({
 *   variables: {
 *      user_id: // value for 'user_id'
 *   },
 * });
 */
export function useClassesByTeacherQuery(baseOptions?: Apollo.QueryHookOptions<ClassesByTeacherQuery, ClassesByTeacherQueryVariables>) {
  return Apollo.useQuery<ClassesByTeacherQuery, ClassesByTeacherQueryVariables>(ClassesByTeacherDocument, baseOptions);
}
export function useClassesByTeacherLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<ClassesByTeacherQuery, ClassesByTeacherQueryVariables>
) {
  return Apollo.useLazyQuery<ClassesByTeacherQuery, ClassesByTeacherQueryVariables>(ClassesByTeacherDocument, baseOptions);
}
export type ClassesByTeacherQueryHookResult = ReturnType<typeof useClassesByTeacherQuery>;
export type ClassesByTeacherLazyQueryHookResult = ReturnType<typeof useClassesByTeacherLazyQuery>;
export type ClassesByTeacherQueryResult = Apollo.QueryResult<ClassesByTeacherQuery, ClassesByTeacherQueryVariables>;
export const ClassesByOrganizationDocument = gql`
  query classesByOrganization($organization_id: ID = "3f135b91-a616-4c80-914a-e4463104dbac") {
    organization(organization_id: $organization_id) {
      classes {
        class_id
        class_name
      }
    }
  }
`;

/**
 * __useClassesByOrganizationQuery__
 *
 * To run a query within a React component, call `useClassesByOrganizationQuery` and pass it any options that fit your needs.
 * When your component renders, `useClassesByOrganizationQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useClassesByOrganizationQuery({
 *   variables: {
 *      organization_id: // value for 'organization_id'
 *   },
 * });
 */
export function useClassesByOrganizationQuery(
  baseOptions?: Apollo.QueryHookOptions<ClassesByOrganizationQuery, ClassesByOrganizationQueryVariables>
) {
  return Apollo.useQuery<ClassesByOrganizationQuery, ClassesByOrganizationQueryVariables>(ClassesByOrganizationDocument, baseOptions);
}
export function useClassesByOrganizationLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<ClassesByOrganizationQuery, ClassesByOrganizationQueryVariables>
) {
  return Apollo.useLazyQuery<ClassesByOrganizationQuery, ClassesByOrganizationQueryVariables>(ClassesByOrganizationDocument, baseOptions);
}
export type ClassesByOrganizationQueryHookResult = ReturnType<typeof useClassesByOrganizationQuery>;
export type ClassesByOrganizationLazyQueryHookResult = ReturnType<typeof useClassesByOrganizationLazyQuery>;
export type ClassesByOrganizationQueryResult = Apollo.QueryResult<ClassesByOrganizationQuery, ClassesByOrganizationQueryVariables>;
export const ParticipantsByClassDocument = gql`
  query participantsByClass($class_id: ID = "c479bd4b-faf8-4a4b-80b6-632c3234d804") {
    class(class_id: $class_id) {
      teachers {
        user_id
        user_name
      }
      students {
        user_id
        user_name
      }
    }
  }
`;

/**
 * __useParticipantsByClassQuery__
 *
 * To run a query within a React component, call `useParticipantsByClassQuery` and pass it any options that fit your needs.
 * When your component renders, `useParticipantsByClassQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useParticipantsByClassQuery({
 *   variables: {
 *      class_id: // value for 'class_id'
 *   },
 * });
 */
export function useParticipantsByClassQuery(
  baseOptions?: Apollo.QueryHookOptions<ParticipantsByClassQuery, ParticipantsByClassQueryVariables>
) {
  return Apollo.useQuery<ParticipantsByClassQuery, ParticipantsByClassQueryVariables>(ParticipantsByClassDocument, baseOptions);
}
export function useParticipantsByClassLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<ParticipantsByClassQuery, ParticipantsByClassQueryVariables>
) {
  return Apollo.useLazyQuery<ParticipantsByClassQuery, ParticipantsByClassQueryVariables>(ParticipantsByClassDocument, baseOptions);
}
export type ParticipantsByClassQueryHookResult = ReturnType<typeof useParticipantsByClassQuery>;
export type ParticipantsByClassLazyQueryHookResult = ReturnType<typeof useParticipantsByClassLazyQuery>;
export type ParticipantsByClassQueryResult = Apollo.QueryResult<ParticipantsByClassQuery, ParticipantsByClassQueryVariables>;
export const QeuryPermissionOfMeDocument = gql`
  query qeuryPermissionOfMe($organization_id: ID! = "3f135b91-a616-4c80-914a-e4463104dbac") {
    me {
      membership(organization_id: $organization_id) {
        roles {
          permissions {
            permission_name
          }
        }
      }
    }
  }
`;

/**
 * __useQeuryPermissionOfMeQuery__
 *
 * To run a query within a React component, call `useQeuryPermissionOfMeQuery` and pass it any options that fit your needs.
 * When your component renders, `useQeuryPermissionOfMeQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useQeuryPermissionOfMeQuery({
 *   variables: {
 *      organization_id: // value for 'organization_id'
 *   },
 * });
 */
export function useQeuryPermissionOfMeQuery(
  baseOptions?: Apollo.QueryHookOptions<QeuryPermissionOfMeQuery, QeuryPermissionOfMeQueryVariables>
) {
  return Apollo.useQuery<QeuryPermissionOfMeQuery, QeuryPermissionOfMeQueryVariables>(QeuryPermissionOfMeDocument, baseOptions);
}
export function useQeuryPermissionOfMeLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<QeuryPermissionOfMeQuery, QeuryPermissionOfMeQueryVariables>
) {
  return Apollo.useLazyQuery<QeuryPermissionOfMeQuery, QeuryPermissionOfMeQueryVariables>(QeuryPermissionOfMeDocument, baseOptions);
}
export type QeuryPermissionOfMeQueryHookResult = ReturnType<typeof useQeuryPermissionOfMeQuery>;
export type QeuryPermissionOfMeLazyQueryHookResult = ReturnType<typeof useQeuryPermissionOfMeLazyQuery>;
export type QeuryPermissionOfMeQueryResult = Apollo.QueryResult<QeuryPermissionOfMeQuery, QeuryPermissionOfMeQueryVariables>;
