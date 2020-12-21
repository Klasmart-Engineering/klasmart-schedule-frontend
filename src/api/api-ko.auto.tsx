import * as Types from "./api-ko-schema.auto";

import { gql } from "@apollo/client";
import * as Apollo from "@apollo/client";
export type RoleBasedUsersByOrgnizationQueryVariables = Types.Exact<{
  organization_id: Types.Scalars["ID"];
}>;

export type RoleBasedUsersByOrgnizationQuery = { __typename?: "Query" } & {
  organization?: Types.Maybe<
    { __typename?: "Organization" } & {
      roles?: Types.Maybe<
        Array<
          Types.Maybe<
            { __typename?: "Role" } & Pick<Types.Role, "role_name"> & {
                memberships?: Types.Maybe<
                  Array<
                    Types.Maybe<
                      { __typename?: "OrganizationMembership" } & {
                        user?: Types.Maybe<{ __typename?: "User" } & Pick<Types.User, "user_id" | "user_name">>;
                      }
                    >
                  >
                >;
              }
          >
        >
      >;
    }
  >;
};

export type TeachersByOrgnizationQueryVariables = Types.Exact<{
  organization_id: Types.Scalars["ID"];
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
  user_id: Types.Scalars["ID"];
}>;

export type ClassesByTeacherQuery = { __typename?: "Query" } & {
  user?: Types.Maybe<
    { __typename?: "User" } & {
      classesTeaching?: Types.Maybe<Array<Types.Maybe<{ __typename?: "Class" } & Pick<Types.Class, "class_id" | "class_name">>>>;
    }
  >;
};

export type ClassesByOrganizationQueryVariables = Types.Exact<{
  organization_id: Types.Scalars["ID"];
}>;

export type ClassesByOrganizationQuery = { __typename?: "Query" } & {
  organization?: Types.Maybe<
    { __typename?: "Organization" } & {
      classes?: Types.Maybe<Array<Types.Maybe<{ __typename?: "Class" } & Pick<Types.Class, "class_id" | "class_name">>>>;
    }
  >;
};

export type ParticipantsByClassQueryVariables = Types.Exact<{
  class_id: Types.Scalars["ID"];
}>;

export type ParticipantsByClassQuery = { __typename?: "Query" } & {
  class?: Types.Maybe<
    { __typename?: "Class" } & {
      teachers?: Types.Maybe<Array<Types.Maybe<{ __typename?: "User" } & Pick<Types.User, "user_id" | "user_name">>>>;
      students?: Types.Maybe<Array<Types.Maybe<{ __typename?: "User" } & Pick<Types.User, "user_id" | "user_name">>>>;
    }
  >;
};

export type QeuryMeQueryVariables = Types.Exact<{
  organization_id: Types.Scalars["ID"];
}>;

export type QeuryMeQuery = { __typename?: "Query" } & {
  me?: Types.Maybe<
    { __typename?: "User" } & Pick<Types.User, "user_id"> & {
        membership?: Types.Maybe<
          { __typename?: "OrganizationMembership" } & {
            roles?: Types.Maybe<
              Array<
                Types.Maybe<
                  { __typename?: "Role" } & {
                    permissions?: Types.Maybe<
                      Array<Types.Maybe<{ __typename?: "Permission" } & Pick<Types.Permission, "permission_name">>>
                    >;
                  }
                >
              >
            >;
          }
        >;
      }
  >;
};

export type OrganizationsQueryVariables = Types.Exact<{ [key: string]: never }>;

export type OrganizationsQuery = { __typename?: "Query" } & {
  organizations?: Types.Maybe<
    Array<Types.Maybe<{ __typename?: "Organization" } & Pick<Types.Organization, "organization_id" | "organization_name">>>
  >;
};

export const RoleBasedUsersByOrgnizationDocument = gql`
  query roleBasedUsersByOrgnization($organization_id: ID!) {
    organization(organization_id: $organization_id) {
      roles {
        role_name
        memberships {
          user {
            user_id
            user_name
          }
        }
      }
    }
  }
`;

/**
 * __useRoleBasedUsersByOrgnizationQuery__
 *
 * To run a query within a React component, call `useRoleBasedUsersByOrgnizationQuery` and pass it any options that fit your needs.
 * When your component renders, `useRoleBasedUsersByOrgnizationQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useRoleBasedUsersByOrgnizationQuery({
 *   variables: {
 *      organization_id: // value for 'organization_id'
 *   },
 * });
 */
export function useRoleBasedUsersByOrgnizationQuery(
  baseOptions: Apollo.QueryHookOptions<RoleBasedUsersByOrgnizationQuery, RoleBasedUsersByOrgnizationQueryVariables>
) {
  return Apollo.useQuery<RoleBasedUsersByOrgnizationQuery, RoleBasedUsersByOrgnizationQueryVariables>(
    RoleBasedUsersByOrgnizationDocument,
    baseOptions
  );
}
export function useRoleBasedUsersByOrgnizationLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<RoleBasedUsersByOrgnizationQuery, RoleBasedUsersByOrgnizationQueryVariables>
) {
  return Apollo.useLazyQuery<RoleBasedUsersByOrgnizationQuery, RoleBasedUsersByOrgnizationQueryVariables>(
    RoleBasedUsersByOrgnizationDocument,
    baseOptions
  );
}
export type RoleBasedUsersByOrgnizationQueryHookResult = ReturnType<typeof useRoleBasedUsersByOrgnizationQuery>;
export type RoleBasedUsersByOrgnizationLazyQueryHookResult = ReturnType<typeof useRoleBasedUsersByOrgnizationLazyQuery>;
export type RoleBasedUsersByOrgnizationQueryResult = Apollo.QueryResult<
  RoleBasedUsersByOrgnizationQuery,
  RoleBasedUsersByOrgnizationQueryVariables
>;
export const TeachersByOrgnizationDocument = gql`
  query teachersByOrgnization($organization_id: ID!) {
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
  baseOptions: Apollo.QueryHookOptions<TeachersByOrgnizationQuery, TeachersByOrgnizationQueryVariables>
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
  query classesByTeacher($user_id: ID!) {
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
export function useClassesByTeacherQuery(baseOptions: Apollo.QueryHookOptions<ClassesByTeacherQuery, ClassesByTeacherQueryVariables>) {
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
  query classesByOrganization($organization_id: ID!) {
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
  baseOptions: Apollo.QueryHookOptions<ClassesByOrganizationQuery, ClassesByOrganizationQueryVariables>
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
  query participantsByClass($class_id: ID!) {
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
  baseOptions: Apollo.QueryHookOptions<ParticipantsByClassQuery, ParticipantsByClassQueryVariables>
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
export const QeuryMeDocument = gql`
  query qeuryMe($organization_id: ID!) {
    me {
      user_id
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
 * __useQeuryMeQuery__
 *
 * To run a query within a React component, call `useQeuryMeQuery` and pass it any options that fit your needs.
 * When your component renders, `useQeuryMeQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useQeuryMeQuery({
 *   variables: {
 *      organization_id: // value for 'organization_id'
 *   },
 * });
 */
export function useQeuryMeQuery(baseOptions: Apollo.QueryHookOptions<QeuryMeQuery, QeuryMeQueryVariables>) {
  return Apollo.useQuery<QeuryMeQuery, QeuryMeQueryVariables>(QeuryMeDocument, baseOptions);
}
export function useQeuryMeLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<QeuryMeQuery, QeuryMeQueryVariables>) {
  return Apollo.useLazyQuery<QeuryMeQuery, QeuryMeQueryVariables>(QeuryMeDocument, baseOptions);
}
export type QeuryMeQueryHookResult = ReturnType<typeof useQeuryMeQuery>;
export type QeuryMeLazyQueryHookResult = ReturnType<typeof useQeuryMeLazyQuery>;
export type QeuryMeQueryResult = Apollo.QueryResult<QeuryMeQuery, QeuryMeQueryVariables>;
export const OrganizationsDocument = gql`
  query organizations {
    organizations {
      organization_id
      organization_name
    }
  }
`;

/**
 * __useOrganizationsQuery__
 *
 * To run a query within a React component, call `useOrganizationsQuery` and pass it any options that fit your needs.
 * When your component renders, `useOrganizationsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useOrganizationsQuery({
 *   variables: {
 *   },
 * });
 */
export function useOrganizationsQuery(baseOptions?: Apollo.QueryHookOptions<OrganizationsQuery, OrganizationsQueryVariables>) {
  return Apollo.useQuery<OrganizationsQuery, OrganizationsQueryVariables>(OrganizationsDocument, baseOptions);
}
export function useOrganizationsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<OrganizationsQuery, OrganizationsQueryVariables>) {
  return Apollo.useLazyQuery<OrganizationsQuery, OrganizationsQueryVariables>(OrganizationsDocument, baseOptions);
}
export type OrganizationsQueryHookResult = ReturnType<typeof useOrganizationsQuery>;
export type OrganizationsLazyQueryHookResult = ReturnType<typeof useOrganizationsLazyQuery>;
export type OrganizationsQueryResult = Apollo.QueryResult<OrganizationsQuery, OrganizationsQueryVariables>;
