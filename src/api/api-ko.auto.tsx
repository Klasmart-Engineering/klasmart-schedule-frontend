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
      classes?: Types.Maybe<
        Array<
          Types.Maybe<
            { __typename?: "Class" } & Pick<Types.Class, "class_id" | "class_name" | "status"> & {
                schools?: Types.Maybe<Array<Types.Maybe<{ __typename?: "School" } & Pick<Types.School, "school_id" | "school_name">>>>;
                teachers?: Types.Maybe<Array<Types.Maybe<{ __typename?: "User" } & Pick<Types.User, "user_id" | "username">>>>;
                students?: Types.Maybe<Array<Types.Maybe<{ __typename?: "User" } & Pick<Types.User, "user_id" | "username">>>>;
              }
          >
        >
      >;
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

export type GetSchoolTeacherQueryVariables = Types.Exact<{
  user_id: Types.Scalars["ID"];
}>;

export type GetSchoolTeacherQuery = { __typename?: "Query" } & {
  user?: Types.Maybe<
    { __typename?: "User" } & {
      school_memberships?: Types.Maybe<
        Array<
          Types.Maybe<
            { __typename?: "SchoolMembership" } & {
              school?: Types.Maybe<
                { __typename?: "School" } & Pick<Types.School, "school_id" | "school_name"> & {
                    organization?: Types.Maybe<{ __typename?: "Organization" } & Pick<Types.Organization, "organization_id">>;
                    classes?: Types.Maybe<
                      Array<
                        Types.Maybe<
                          { __typename?: "Class" } & {
                            teachers?: Types.Maybe<Array<Types.Maybe<{ __typename?: "User" } & Pick<Types.User, "user_id" | "user_name">>>>;
                          }
                        >
                      >
                    >;
                  }
              >;
            }
          >
        >
      >;
    }
  >;
};

export type TeacherByOrgIdQueryVariables = Types.Exact<{
  organization_id: Types.Scalars["ID"];
}>;

export type TeacherByOrgIdQuery = { __typename?: "Query" } & {
  organization?: Types.Maybe<
    { __typename?: "Organization" } & {
      classes?: Types.Maybe<
        Array<
          Types.Maybe<
            { __typename?: "Class" } & Pick<Types.Class, "class_id" | "class_name"> & {
                teachers?: Types.Maybe<Array<Types.Maybe<{ __typename?: "User" } & Pick<Types.User, "user_id" | "user_name">>>>;
              }
          >
        >
      >;
    }
  >;
};

export type MySchoolIDsQueryVariables = Types.Exact<{
  organization_id: Types.Scalars["ID"];
}>;

export type MySchoolIDsQuery = { __typename?: "Query" } & {
  me?: Types.Maybe<
    { __typename?: "User" } & {
      membership?: Types.Maybe<
        { __typename?: "OrganizationMembership" } & {
          schoolMemberships?: Types.Maybe<
            Array<Types.Maybe<{ __typename?: "SchoolMembership" } & Pick<Types.SchoolMembership, "school_id">>>
          >;
        }
      >;
    }
  >;
};

export type ClassesBySchoolQueryVariables = Types.Exact<{
  school_id: Types.Scalars["ID"];
}>;

export type ClassesBySchoolQuery = { __typename?: "Query" } & {
  school?: Types.Maybe<
    { __typename?: "School" } & {
      classes?: Types.Maybe<
        Array<
          Types.Maybe<
            { __typename?: "Class" } & Pick<Types.Class, "class_id" | "class_name" | "status"> & {
                schools?: Types.Maybe<Array<Types.Maybe<{ __typename?: "School" } & Pick<Types.School, "school_id" | "school_name">>>>;
                teachers?: Types.Maybe<Array<Types.Maybe<{ __typename?: "User" } & Pick<Types.User, "user_id" | "username">>>>;
                students?: Types.Maybe<Array<Types.Maybe<{ __typename?: "User" } & Pick<Types.User, "user_id" | "username">>>>;
              }
          >
        >
      >;
    }
  >;
};

export type UserSchoolIDsQueryVariables = Types.Exact<{
  user_id: Types.Scalars["ID"];
}>;

export type UserSchoolIDsQuery = { __typename?: "Query" } & {
  user?: Types.Maybe<
    { __typename?: "User" } & {
      school_memberships?: Types.Maybe<Array<Types.Maybe<{ __typename?: "SchoolMembership" } & Pick<Types.SchoolMembership, "school_id">>>>;
    }
  >;
};

export type ParticipantsBySchoolQueryVariables = Types.Exact<{
  school_id: Types.Scalars["ID"];
}>;

export type ParticipantsBySchoolQuery = { __typename?: "Query" } & {
  school?: Types.Maybe<
    { __typename?: "School" } & {
      classes?: Types.Maybe<
        Array<
          Types.Maybe<
            { __typename?: "Class" } & {
              teachers?: Types.Maybe<
                Array<
                  Types.Maybe<
                    { __typename?: "User" } & Pick<Types.User, "user_id" | "user_name"> & {
                        school_memberships?: Types.Maybe<
                          Array<Types.Maybe<{ __typename?: "SchoolMembership" } & Pick<Types.SchoolMembership, "school_id">>>
                        >;
                      }
                  >
                >
              >;
              students?: Types.Maybe<
                Array<
                  Types.Maybe<
                    { __typename?: "User" } & Pick<Types.User, "user_id" | "user_name"> & {
                        school_memberships?: Types.Maybe<
                          Array<Types.Maybe<{ __typename?: "SchoolMembership" } & Pick<Types.SchoolMembership, "school_id">>>
                        >;
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

export type ParticipantsByOrganizationQueryVariables = Types.Exact<{
  organization_id: Types.Scalars["ID"];
}>;

export type ParticipantsByOrganizationQuery = { __typename?: "Query" } & {
  organization?: Types.Maybe<
    { __typename?: "Organization" } & {
      classes?: Types.Maybe<
        Array<
          Types.Maybe<
            { __typename?: "Class" } & {
              teachers?: Types.Maybe<
                Array<
                  Types.Maybe<
                    { __typename?: "User" } & Pick<Types.User, "user_id" | "user_name"> & {
                        school_memberships?: Types.Maybe<
                          Array<Types.Maybe<{ __typename?: "SchoolMembership" } & Pick<Types.SchoolMembership, "school_id">>>
                        >;
                      }
                  >
                >
              >;
              students?: Types.Maybe<
                Array<
                  Types.Maybe<
                    { __typename?: "User" } & Pick<Types.User, "user_id" | "user_name"> & {
                        school_memberships?: Types.Maybe<
                          Array<Types.Maybe<{ __typename?: "SchoolMembership" } & Pick<Types.SchoolMembership, "school_id">>>
                        >;
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

export type ClassesTeachingQueryQueryVariables = Types.Exact<{
  user_id: Types.Scalars["ID"];
  organization_id: Types.Scalars["ID"];
}>;

export type ClassesTeachingQueryQuery = { __typename?: "Query" } & {
  user?: Types.Maybe<
    { __typename?: "User" } & {
      membership?: Types.Maybe<
        { __typename?: "OrganizationMembership" } & {
          classesTeaching?: Types.Maybe<
            Array<
              Types.Maybe<
                { __typename?: "Class" } & Pick<Types.Class, "class_id" | "class_name" | "status"> & {
                    schools?: Types.Maybe<Array<Types.Maybe<{ __typename?: "School" } & Pick<Types.School, "school_id" | "school_name">>>>;
                    teachers?: Types.Maybe<Array<Types.Maybe<{ __typename?: "User" } & Pick<Types.User, "user_id" | "username">>>>;
                    students?: Types.Maybe<Array<Types.Maybe<{ __typename?: "User" } & Pick<Types.User, "user_id" | "username">>>>;
                  }
              >
            >
          >;
        }
      >;
    }
  >;
};

export type ClassesStudentQueryQueryVariables = Types.Exact<{
  user_id: Types.Scalars["ID"];
  organization_id: Types.Scalars["ID"];
}>;

export type ClassesStudentQueryQuery = { __typename?: "Query" } & {
  user?: Types.Maybe<
    { __typename?: "User" } & {
      membership?: Types.Maybe<
        { __typename?: "OrganizationMembership" } & {
          classes?: Types.Maybe<
            Array<
              Types.Maybe<
                { __typename?: "Class" } & Pick<Types.Class, "class_id" | "class_name" | "status"> & {
                    schools?: Types.Maybe<Array<Types.Maybe<{ __typename?: "School" } & Pick<Types.School, "school_id" | "school_name">>>>;
                    teachers?: Types.Maybe<Array<Types.Maybe<{ __typename?: "User" } & Pick<Types.User, "user_id" | "username">>>>;
                    students?: Types.Maybe<Array<Types.Maybe<{ __typename?: "User" } & Pick<Types.User, "user_id" | "username">>>>;
                  }
              >
            >
          >;
        }
      >;
    }
  >;
};

export type SchoolByUserQueryQueryVariables = Types.Exact<{
  user_id: Types.Scalars["ID"];
  organization_id: Types.Scalars["ID"];
}>;

export type SchoolByUserQueryQuery = { __typename?: "Query" } & {
  user?: Types.Maybe<
    { __typename?: "User" } & {
      membership?: Types.Maybe<
        { __typename?: "OrganizationMembership" } & {
          schoolMemberships?: Types.Maybe<
            Array<
              Types.Maybe<
                { __typename?: "SchoolMembership" } & {
                  school?: Types.Maybe<
                    { __typename?: "School" } & Pick<Types.School, "school_id" | "school_name"> & {
                        classes?: Types.Maybe<
                          Array<
                            Types.Maybe<
                              { __typename?: "Class" } & Pick<Types.Class, "status" | "class_id" | "class_name"> & {
                                  teachers?: Types.Maybe<
                                    Array<Types.Maybe<{ __typename?: "User" } & Pick<Types.User, "user_id" | "username">>>
                                  >;
                                  students?: Types.Maybe<
                                    Array<Types.Maybe<{ __typename?: "User" } & Pick<Types.User, "user_id" | "username">>>
                                  >;
                                }
                            >
                          >
                        >;
                      }
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

export type SchoolByOrgQueryQueryVariables = Types.Exact<{
  organization_id: Types.Scalars["ID"];
}>;

export type SchoolByOrgQueryQuery = { __typename?: "Query" } & {
  organization?: Types.Maybe<
    { __typename?: "Organization" } & {
      schools?: Types.Maybe<
        Array<
          Types.Maybe<
            { __typename?: "School" } & Pick<Types.School, "school_id" | "school_name"> & {
                classes?: Types.Maybe<
                  Array<
                    Types.Maybe<
                      { __typename?: "Class" } & Pick<Types.Class, "status" | "class_id" | "class_name"> & {
                          teachers?: Types.Maybe<Array<Types.Maybe<{ __typename?: "User" } & Pick<Types.User, "user_id" | "username">>>>;
                          students?: Types.Maybe<Array<Types.Maybe<{ __typename?: "User" } & Pick<Types.User, "user_id" | "username">>>>;
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
  baseOptions?: Apollo.QueryHookOptions<RoleBasedUsersByOrgnizationQuery, RoleBasedUsersByOrgnizationQueryVariables>
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
  query classesByOrganization($organization_id: ID!) {
    organization(organization_id: $organization_id) {
      classes {
        class_id
        class_name
        status
        schools {
          school_id
          school_name
        }
        teachers {
          user_id
          username
        }
        students {
          user_id
          username
        }
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
export function useQeuryMeQuery(baseOptions?: Apollo.QueryHookOptions<QeuryMeQuery, QeuryMeQueryVariables>) {
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
export const GetSchoolTeacherDocument = gql`
  query getSchoolTeacher($user_id: ID!) {
    user(user_id: $user_id) {
      school_memberships {
        school {
          school_id
          school_name
          organization {
            organization_id
          }
          classes {
            teachers {
              user_id
              user_name
            }
          }
        }
      }
    }
  }
`;

/**
 * __useGetSchoolTeacherQuery__
 *
 * To run a query within a React component, call `useGetSchoolTeacherQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetSchoolTeacherQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetSchoolTeacherQuery({
 *   variables: {
 *      user_id: // value for 'user_id'
 *   },
 * });
 */
export function useGetSchoolTeacherQuery(baseOptions?: Apollo.QueryHookOptions<GetSchoolTeacherQuery, GetSchoolTeacherQueryVariables>) {
  return Apollo.useQuery<GetSchoolTeacherQuery, GetSchoolTeacherQueryVariables>(GetSchoolTeacherDocument, baseOptions);
}
export function useGetSchoolTeacherLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<GetSchoolTeacherQuery, GetSchoolTeacherQueryVariables>
) {
  return Apollo.useLazyQuery<GetSchoolTeacherQuery, GetSchoolTeacherQueryVariables>(GetSchoolTeacherDocument, baseOptions);
}
export type GetSchoolTeacherQueryHookResult = ReturnType<typeof useGetSchoolTeacherQuery>;
export type GetSchoolTeacherLazyQueryHookResult = ReturnType<typeof useGetSchoolTeacherLazyQuery>;
export type GetSchoolTeacherQueryResult = Apollo.QueryResult<GetSchoolTeacherQuery, GetSchoolTeacherQueryVariables>;
export const TeacherByOrgIdDocument = gql`
  query teacherByOrgId($organization_id: ID!) {
    organization(organization_id: $organization_id) {
      classes {
        class_id
        class_name
        teachers {
          user_id
          user_name
        }
      }
    }
  }
`;

/**
 * __useTeacherByOrgIdQuery__
 *
 * To run a query within a React component, call `useTeacherByOrgIdQuery` and pass it any options that fit your needs.
 * When your component renders, `useTeacherByOrgIdQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useTeacherByOrgIdQuery({
 *   variables: {
 *      organization_id: // value for 'organization_id'
 *   },
 * });
 */
export function useTeacherByOrgIdQuery(baseOptions?: Apollo.QueryHookOptions<TeacherByOrgIdQuery, TeacherByOrgIdQueryVariables>) {
  return Apollo.useQuery<TeacherByOrgIdQuery, TeacherByOrgIdQueryVariables>(TeacherByOrgIdDocument, baseOptions);
}
export function useTeacherByOrgIdLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<TeacherByOrgIdQuery, TeacherByOrgIdQueryVariables>) {
  return Apollo.useLazyQuery<TeacherByOrgIdQuery, TeacherByOrgIdQueryVariables>(TeacherByOrgIdDocument, baseOptions);
}
export type TeacherByOrgIdQueryHookResult = ReturnType<typeof useTeacherByOrgIdQuery>;
export type TeacherByOrgIdLazyQueryHookResult = ReturnType<typeof useTeacherByOrgIdLazyQuery>;
export type TeacherByOrgIdQueryResult = Apollo.QueryResult<TeacherByOrgIdQuery, TeacherByOrgIdQueryVariables>;
export const MySchoolIDsDocument = gql`
  query mySchoolIDs($organization_id: ID!) {
    me {
      membership(organization_id: $organization_id) {
        schoolMemberships {
          school_id
        }
      }
    }
  }
`;

/**
 * __useMySchoolIDsQuery__
 *
 * To run a query within a React component, call `useMySchoolIDsQuery` and pass it any options that fit your needs.
 * When your component renders, `useMySchoolIDsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useMySchoolIDsQuery({
 *   variables: {
 *      organization_id: // value for 'organization_id'
 *   },
 * });
 */
export function useMySchoolIDsQuery(baseOptions?: Apollo.QueryHookOptions<MySchoolIDsQuery, MySchoolIDsQueryVariables>) {
  return Apollo.useQuery<MySchoolIDsQuery, MySchoolIDsQueryVariables>(MySchoolIDsDocument, baseOptions);
}
export function useMySchoolIDsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<MySchoolIDsQuery, MySchoolIDsQueryVariables>) {
  return Apollo.useLazyQuery<MySchoolIDsQuery, MySchoolIDsQueryVariables>(MySchoolIDsDocument, baseOptions);
}
export type MySchoolIDsQueryHookResult = ReturnType<typeof useMySchoolIDsQuery>;
export type MySchoolIDsLazyQueryHookResult = ReturnType<typeof useMySchoolIDsLazyQuery>;
export type MySchoolIDsQueryResult = Apollo.QueryResult<MySchoolIDsQuery, MySchoolIDsQueryVariables>;
export const ClassesBySchoolDocument = gql`
  query classesBySchool($school_id: ID!) {
    school(school_id: $school_id) {
      classes {
        class_id
        class_name
        status
        schools {
          school_id
          school_name
        }
        teachers {
          user_id
          username
        }
        students {
          user_id
          username
        }
      }
    }
  }
`;

/**
 * __useClassesBySchoolQuery__
 *
 * To run a query within a React component, call `useClassesBySchoolQuery` and pass it any options that fit your needs.
 * When your component renders, `useClassesBySchoolQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useClassesBySchoolQuery({
 *   variables: {
 *      school_id: // value for 'school_id'
 *   },
 * });
 */
export function useClassesBySchoolQuery(baseOptions?: Apollo.QueryHookOptions<ClassesBySchoolQuery, ClassesBySchoolQueryVariables>) {
  return Apollo.useQuery<ClassesBySchoolQuery, ClassesBySchoolQueryVariables>(ClassesBySchoolDocument, baseOptions);
}
export function useClassesBySchoolLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<ClassesBySchoolQuery, ClassesBySchoolQueryVariables>
) {
  return Apollo.useLazyQuery<ClassesBySchoolQuery, ClassesBySchoolQueryVariables>(ClassesBySchoolDocument, baseOptions);
}
export type ClassesBySchoolQueryHookResult = ReturnType<typeof useClassesBySchoolQuery>;
export type ClassesBySchoolLazyQueryHookResult = ReturnType<typeof useClassesBySchoolLazyQuery>;
export type ClassesBySchoolQueryResult = Apollo.QueryResult<ClassesBySchoolQuery, ClassesBySchoolQueryVariables>;
export const UserSchoolIDsDocument = gql`
  query userSchoolIDs($user_id: ID!) {
    user(user_id: $user_id) {
      school_memberships {
        school_id
      }
    }
  }
`;

/**
 * __useUserSchoolIDsQuery__
 *
 * To run a query within a React component, call `useUserSchoolIDsQuery` and pass it any options that fit your needs.
 * When your component renders, `useUserSchoolIDsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useUserSchoolIDsQuery({
 *   variables: {
 *      user_id: // value for 'user_id'
 *   },
 * });
 */
export function useUserSchoolIDsQuery(baseOptions?: Apollo.QueryHookOptions<UserSchoolIDsQuery, UserSchoolIDsQueryVariables>) {
  return Apollo.useQuery<UserSchoolIDsQuery, UserSchoolIDsQueryVariables>(UserSchoolIDsDocument, baseOptions);
}
export function useUserSchoolIDsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<UserSchoolIDsQuery, UserSchoolIDsQueryVariables>) {
  return Apollo.useLazyQuery<UserSchoolIDsQuery, UserSchoolIDsQueryVariables>(UserSchoolIDsDocument, baseOptions);
}
export type UserSchoolIDsQueryHookResult = ReturnType<typeof useUserSchoolIDsQuery>;
export type UserSchoolIDsLazyQueryHookResult = ReturnType<typeof useUserSchoolIDsLazyQuery>;
export type UserSchoolIDsQueryResult = Apollo.QueryResult<UserSchoolIDsQuery, UserSchoolIDsQueryVariables>;
export const ParticipantsBySchoolDocument = gql`
  query participantsBySchool($school_id: ID!) {
    school(school_id: $school_id) {
      classes {
        teachers {
          user_id
          user_name
          school_memberships {
            school_id
          }
        }
        students {
          user_id
          user_name
          school_memberships {
            school_id
          }
        }
      }
    }
  }
`;

/**
 * __useParticipantsBySchoolQuery__
 *
 * To run a query within a React component, call `useParticipantsBySchoolQuery` and pass it any options that fit your needs.
 * When your component renders, `useParticipantsBySchoolQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useParticipantsBySchoolQuery({
 *   variables: {
 *      school_id: // value for 'school_id'
 *   },
 * });
 */
export function useParticipantsBySchoolQuery(
  baseOptions?: Apollo.QueryHookOptions<ParticipantsBySchoolQuery, ParticipantsBySchoolQueryVariables>
) {
  return Apollo.useQuery<ParticipantsBySchoolQuery, ParticipantsBySchoolQueryVariables>(ParticipantsBySchoolDocument, baseOptions);
}
export function useParticipantsBySchoolLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<ParticipantsBySchoolQuery, ParticipantsBySchoolQueryVariables>
) {
  return Apollo.useLazyQuery<ParticipantsBySchoolQuery, ParticipantsBySchoolQueryVariables>(ParticipantsBySchoolDocument, baseOptions);
}
export type ParticipantsBySchoolQueryHookResult = ReturnType<typeof useParticipantsBySchoolQuery>;
export type ParticipantsBySchoolLazyQueryHookResult = ReturnType<typeof useParticipantsBySchoolLazyQuery>;
export type ParticipantsBySchoolQueryResult = Apollo.QueryResult<ParticipantsBySchoolQuery, ParticipantsBySchoolQueryVariables>;
export const ParticipantsByOrganizationDocument = gql`
  query participantsByOrganization($organization_id: ID!) {
    organization(organization_id: $organization_id) {
      classes {
        teachers {
          user_id
          user_name
          school_memberships {
            school_id
          }
        }
        students {
          user_id
          user_name
          school_memberships {
            school_id
          }
        }
      }
    }
  }
`;

/**
 * __useParticipantsByOrganizationQuery__
 *
 * To run a query within a React component, call `useParticipantsByOrganizationQuery` and pass it any options that fit your needs.
 * When your component renders, `useParticipantsByOrganizationQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useParticipantsByOrganizationQuery({
 *   variables: {
 *      organization_id: // value for 'organization_id'
 *   },
 * });
 */
export function useParticipantsByOrganizationQuery(
  baseOptions?: Apollo.QueryHookOptions<ParticipantsByOrganizationQuery, ParticipantsByOrganizationQueryVariables>
) {
  return Apollo.useQuery<ParticipantsByOrganizationQuery, ParticipantsByOrganizationQueryVariables>(
    ParticipantsByOrganizationDocument,
    baseOptions
  );
}
export function useParticipantsByOrganizationLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<ParticipantsByOrganizationQuery, ParticipantsByOrganizationQueryVariables>
) {
  return Apollo.useLazyQuery<ParticipantsByOrganizationQuery, ParticipantsByOrganizationQueryVariables>(
    ParticipantsByOrganizationDocument,
    baseOptions
  );
}
export type ParticipantsByOrganizationQueryHookResult = ReturnType<typeof useParticipantsByOrganizationQuery>;
export type ParticipantsByOrganizationLazyQueryHookResult = ReturnType<typeof useParticipantsByOrganizationLazyQuery>;
export type ParticipantsByOrganizationQueryResult = Apollo.QueryResult<
  ParticipantsByOrganizationQuery,
  ParticipantsByOrganizationQueryVariables
>;
export const ClassesTeachingQueryDocument = gql`
  query classesTeachingQuery($user_id: ID!, $organization_id: ID!) {
    user(user_id: $user_id) {
      membership(organization_id: $organization_id) {
        classesTeaching {
          class_id
          class_name
          status
          schools {
            school_id
            school_name
          }
          teachers {
            user_id
            username
          }
          students {
            user_id
            username
          }
        }
      }
    }
  }
`;

/**
 * __useClassesTeachingQueryQuery__
 *
 * To run a query within a React component, call `useClassesTeachingQueryQuery` and pass it any options that fit your needs.
 * When your component renders, `useClassesTeachingQueryQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useClassesTeachingQueryQuery({
 *   variables: {
 *      user_id: // value for 'user_id'
 *      organization_id: // value for 'organization_id'
 *   },
 * });
 */
export function useClassesTeachingQueryQuery(
  baseOptions?: Apollo.QueryHookOptions<ClassesTeachingQueryQuery, ClassesTeachingQueryQueryVariables>
) {
  return Apollo.useQuery<ClassesTeachingQueryQuery, ClassesTeachingQueryQueryVariables>(ClassesTeachingQueryDocument, baseOptions);
}
export function useClassesTeachingQueryLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<ClassesTeachingQueryQuery, ClassesTeachingQueryQueryVariables>
) {
  return Apollo.useLazyQuery<ClassesTeachingQueryQuery, ClassesTeachingQueryQueryVariables>(ClassesTeachingQueryDocument, baseOptions);
}
export type ClassesTeachingQueryQueryHookResult = ReturnType<typeof useClassesTeachingQueryQuery>;
export type ClassesTeachingQueryLazyQueryHookResult = ReturnType<typeof useClassesTeachingQueryLazyQuery>;
export type ClassesTeachingQueryQueryResult = Apollo.QueryResult<ClassesTeachingQueryQuery, ClassesTeachingQueryQueryVariables>;
export const ClassesStudentQueryDocument = gql`
  query classesStudentQuery($user_id: ID!, $organization_id: ID!) {
    user(user_id: $user_id) {
      membership(organization_id: $organization_id) {
        classes {
          class_id
          class_name
          status
          schools {
            school_id
            school_name
          }
          teachers {
            user_id
            username
          }
          students {
            user_id
            username
          }
        }
      }
    }
  }
`;

/**
 * __useClassesStudentQueryQuery__
 *
 * To run a query within a React component, call `useClassesStudentQueryQuery` and pass it any options that fit your needs.
 * When your component renders, `useClassesStudentQueryQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useClassesStudentQueryQuery({
 *   variables: {
 *      user_id: // value for 'user_id'
 *      organization_id: // value for 'organization_id'
 *   },
 * });
 */
export function useClassesStudentQueryQuery(
  baseOptions?: Apollo.QueryHookOptions<ClassesStudentQueryQuery, ClassesStudentQueryQueryVariables>
) {
  return Apollo.useQuery<ClassesStudentQueryQuery, ClassesStudentQueryQueryVariables>(ClassesStudentQueryDocument, baseOptions);
}
export function useClassesStudentQueryLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<ClassesStudentQueryQuery, ClassesStudentQueryQueryVariables>
) {
  return Apollo.useLazyQuery<ClassesStudentQueryQuery, ClassesStudentQueryQueryVariables>(ClassesStudentQueryDocument, baseOptions);
}
export type ClassesStudentQueryQueryHookResult = ReturnType<typeof useClassesStudentQueryQuery>;
export type ClassesStudentQueryLazyQueryHookResult = ReturnType<typeof useClassesStudentQueryLazyQuery>;
export type ClassesStudentQueryQueryResult = Apollo.QueryResult<ClassesStudentQueryQuery, ClassesStudentQueryQueryVariables>;
export const SchoolByUserQueryDocument = gql`
  query schoolByUserQuery($user_id: ID!, $organization_id: ID!) {
    user(user_id: $user_id) {
      membership(organization_id: $organization_id) {
        schoolMemberships {
          school {
            school_id
            school_name
            classes {
              status
              class_id
              class_name
              teachers {
                user_id
                username
              }
              students {
                user_id
                username
              }
            }
          }
        }
      }
    }
  }
`;

/**
 * __useSchoolByUserQueryQuery__
 *
 * To run a query within a React component, call `useSchoolByUserQueryQuery` and pass it any options that fit your needs.
 * When your component renders, `useSchoolByUserQueryQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useSchoolByUserQueryQuery({
 *   variables: {
 *      user_id: // value for 'user_id'
 *      organization_id: // value for 'organization_id'
 *   },
 * });
 */
export function useSchoolByUserQueryQuery(baseOptions?: Apollo.QueryHookOptions<SchoolByUserQueryQuery, SchoolByUserQueryQueryVariables>) {
  return Apollo.useQuery<SchoolByUserQueryQuery, SchoolByUserQueryQueryVariables>(SchoolByUserQueryDocument, baseOptions);
}
export function useSchoolByUserQueryLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<SchoolByUserQueryQuery, SchoolByUserQueryQueryVariables>
) {
  return Apollo.useLazyQuery<SchoolByUserQueryQuery, SchoolByUserQueryQueryVariables>(SchoolByUserQueryDocument, baseOptions);
}
export type SchoolByUserQueryQueryHookResult = ReturnType<typeof useSchoolByUserQueryQuery>;
export type SchoolByUserQueryLazyQueryHookResult = ReturnType<typeof useSchoolByUserQueryLazyQuery>;
export type SchoolByUserQueryQueryResult = Apollo.QueryResult<SchoolByUserQueryQuery, SchoolByUserQueryQueryVariables>;
export const SchoolByOrgQueryDocument = gql`
  query schoolByOrgQuery($organization_id: ID!) {
    organization(organization_id: $organization_id) {
      schools {
        school_id
        school_name
        classes {
          status
          class_id
          class_name
          teachers {
            user_id
            username
          }
          students {
            user_id
            username
          }
        }
      }
    }
  }
`;

/**
 * __useSchoolByOrgQueryQuery__
 *
 * To run a query within a React component, call `useSchoolByOrgQueryQuery` and pass it any options that fit your needs.
 * When your component renders, `useSchoolByOrgQueryQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useSchoolByOrgQueryQuery({
 *   variables: {
 *      organization_id: // value for 'organization_id'
 *   },
 * });
 */
export function useSchoolByOrgQueryQuery(baseOptions?: Apollo.QueryHookOptions<SchoolByOrgQueryQuery, SchoolByOrgQueryQueryVariables>) {
  return Apollo.useQuery<SchoolByOrgQueryQuery, SchoolByOrgQueryQueryVariables>(SchoolByOrgQueryDocument, baseOptions);
}
export function useSchoolByOrgQueryLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<SchoolByOrgQueryQuery, SchoolByOrgQueryQueryVariables>
) {
  return Apollo.useLazyQuery<SchoolByOrgQueryQuery, SchoolByOrgQueryQueryVariables>(SchoolByOrgQueryDocument, baseOptions);
}
export type SchoolByOrgQueryQueryHookResult = ReturnType<typeof useSchoolByOrgQueryQuery>;
export type SchoolByOrgQueryLazyQueryHookResult = ReturnType<typeof useSchoolByOrgQueryLazyQuery>;
export type SchoolByOrgQueryQueryResult = Apollo.QueryResult<SchoolByOrgQueryQuery, SchoolByOrgQueryQueryVariables>;
