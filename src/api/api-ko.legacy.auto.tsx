import * as Types from "./api-ko-schema.auto";

import { ClassIdNameStatusFragment, UserIdNameFragment } from "./api-ko.auto";
import { gql } from "@apollo/client";
import { ClassIdNameStatusFragmentDoc, UserIdNameFragmentDoc } from "./api-ko.auto";
import * as Apollo from "@apollo/client";
const defaultOptions = {};
export type TeacherByOrgIdQueryVariables = Types.Exact<{
  organization_id: Types.Scalars["ID"];
}>;

export type TeacherByOrgIdQuery = { __typename?: "Query" } & {
  organization?: Types.Maybe<
    { __typename?: "Organization" } & {
      classes?: Types.Maybe<
        Array<
          Types.Maybe<
            { __typename?: "Class" } & {
              teachers?: Types.Maybe<
                Array<
                  Types.Maybe<
                    { __typename?: "User" } & {
                      school_memberships?: Types.Maybe<
                        Array<Types.Maybe<{ __typename?: "SchoolMembership" } & Pick<Types.SchoolMembership, "school_id">>>
                      >;
                    } & UserIdNameFragment
                  >
                >
              >;
              schools?: Types.Maybe<Array<Types.Maybe<{ __typename?: "School" } & Pick<Types.School, "school_id">>>>;
            } & ClassIdNameStatusFragment
          >
        >
      >;
    }
  >;
};

export type ClassesSchoolsByOrganizationQueryVariables = Types.Exact<{
  organization_id: Types.Scalars["ID"];
}>;

export type ClassesSchoolsByOrganizationQuery = { __typename?: "Query" } & {
  organization?: Types.Maybe<
    { __typename?: "Organization" } & {
      classes?: Types.Maybe<
        Array<
          Types.Maybe<
            { __typename?: "Class" } & {
              schools?: Types.Maybe<Array<Types.Maybe<{ __typename?: "School" } & Pick<Types.School, "school_id" | "status">>>>;
            } & ClassIdNameStatusFragment
          >
        >
      >;
    }
  >;
};

export type ClassesTeachersByOrganizationQueryVariables = Types.Exact<{
  organization_id: Types.Scalars["ID"];
}>;

export type ClassesTeachersByOrganizationQuery = { __typename?: "Query" } & {
  organization?: Types.Maybe<
    { __typename?: "Organization" } & {
      classes?: Types.Maybe<
        Array<
          Types.Maybe<
            { __typename?: "Class" } & Pick<Types.Class, "class_id" | "status"> & {
                teachers?: Types.Maybe<Array<Types.Maybe<{ __typename?: "User" } & UserIdNameFragment>>>;
              }
          >
        >
      >;
    }
  >;
};

export type SchoolsIdNameByOrganizationQueryVariables = Types.Exact<{
  organization_id: Types.Scalars["ID"];
}>;

export type SchoolsIdNameByOrganizationQuery = { __typename?: "Query" } & {
  organization?: Types.Maybe<
    { __typename?: "Organization" } & {
      schools?: Types.Maybe<Array<Types.Maybe<{ __typename?: "School" } & Pick<Types.School, "school_id" | "school_name" | "status">>>>;
    }
  >;
};

export const TeacherByOrgIdDocument = gql`
  query teacherByOrgId($organization_id: ID!) {
    organization(organization_id: $organization_id) {
      classes {
        ...classIdNameStatus
        teachers {
          ...userIdName
          school_memberships {
            school_id
          }
        }
        schools {
          school_id
        }
      }
    }
  }
  ${ClassIdNameStatusFragmentDoc}
  ${UserIdNameFragmentDoc}
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
export function useTeacherByOrgIdQuery(baseOptions: Apollo.QueryHookOptions<TeacherByOrgIdQuery, TeacherByOrgIdQueryVariables>) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<TeacherByOrgIdQuery, TeacherByOrgIdQueryVariables>(TeacherByOrgIdDocument, options);
}
export function useTeacherByOrgIdLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<TeacherByOrgIdQuery, TeacherByOrgIdQueryVariables>) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<TeacherByOrgIdQuery, TeacherByOrgIdQueryVariables>(TeacherByOrgIdDocument, options);
}
export type TeacherByOrgIdQueryHookResult = ReturnType<typeof useTeacherByOrgIdQuery>;
export type TeacherByOrgIdLazyQueryHookResult = ReturnType<typeof useTeacherByOrgIdLazyQuery>;
export type TeacherByOrgIdQueryResult = Apollo.QueryResult<TeacherByOrgIdQuery, TeacherByOrgIdQueryVariables>;
export const ClassesSchoolsByOrganizationDocument = gql`
  query classesSchoolsByOrganization($organization_id: ID!) {
    organization(organization_id: $organization_id) {
      classes {
        ...classIdNameStatus
        schools {
          school_id
          status
        }
      }
    }
  }
  ${ClassIdNameStatusFragmentDoc}
`;

/**
 * __useClassesSchoolsByOrganizationQuery__
 *
 * To run a query within a React component, call `useClassesSchoolsByOrganizationQuery` and pass it any options that fit your needs.
 * When your component renders, `useClassesSchoolsByOrganizationQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useClassesSchoolsByOrganizationQuery({
 *   variables: {
 *      organization_id: // value for 'organization_id'
 *   },
 * });
 */
export function useClassesSchoolsByOrganizationQuery(
  baseOptions: Apollo.QueryHookOptions<ClassesSchoolsByOrganizationQuery, ClassesSchoolsByOrganizationQueryVariables>
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<ClassesSchoolsByOrganizationQuery, ClassesSchoolsByOrganizationQueryVariables>(
    ClassesSchoolsByOrganizationDocument,
    options
  );
}
export function useClassesSchoolsByOrganizationLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<ClassesSchoolsByOrganizationQuery, ClassesSchoolsByOrganizationQueryVariables>
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<ClassesSchoolsByOrganizationQuery, ClassesSchoolsByOrganizationQueryVariables>(
    ClassesSchoolsByOrganizationDocument,
    options
  );
}
export type ClassesSchoolsByOrganizationQueryHookResult = ReturnType<typeof useClassesSchoolsByOrganizationQuery>;
export type ClassesSchoolsByOrganizationLazyQueryHookResult = ReturnType<typeof useClassesSchoolsByOrganizationLazyQuery>;
export type ClassesSchoolsByOrganizationQueryResult = Apollo.QueryResult<
  ClassesSchoolsByOrganizationQuery,
  ClassesSchoolsByOrganizationQueryVariables
>;
export const ClassesTeachersByOrganizationDocument = gql`
  query classesTeachersByOrganization($organization_id: ID!) {
    organization(organization_id: $organization_id) {
      classes {
        class_id
        status
        teachers {
          ...userIdName
        }
      }
    }
  }
  ${UserIdNameFragmentDoc}
`;

/**
 * __useClassesTeachersByOrganizationQuery__
 *
 * To run a query within a React component, call `useClassesTeachersByOrganizationQuery` and pass it any options that fit your needs.
 * When your component renders, `useClassesTeachersByOrganizationQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useClassesTeachersByOrganizationQuery({
 *   variables: {
 *      organization_id: // value for 'organization_id'
 *   },
 * });
 */
export function useClassesTeachersByOrganizationQuery(
  baseOptions: Apollo.QueryHookOptions<ClassesTeachersByOrganizationQuery, ClassesTeachersByOrganizationQueryVariables>
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<ClassesTeachersByOrganizationQuery, ClassesTeachersByOrganizationQueryVariables>(
    ClassesTeachersByOrganizationDocument,
    options
  );
}
export function useClassesTeachersByOrganizationLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<ClassesTeachersByOrganizationQuery, ClassesTeachersByOrganizationQueryVariables>
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<ClassesTeachersByOrganizationQuery, ClassesTeachersByOrganizationQueryVariables>(
    ClassesTeachersByOrganizationDocument,
    options
  );
}
export type ClassesTeachersByOrganizationQueryHookResult = ReturnType<typeof useClassesTeachersByOrganizationQuery>;
export type ClassesTeachersByOrganizationLazyQueryHookResult = ReturnType<typeof useClassesTeachersByOrganizationLazyQuery>;
export type ClassesTeachersByOrganizationQueryResult = Apollo.QueryResult<
  ClassesTeachersByOrganizationQuery,
  ClassesTeachersByOrganizationQueryVariables
>;
export const SchoolsIdNameByOrganizationDocument = gql`
  query schoolsIdNameByOrganization($organization_id: ID!) {
    organization(organization_id: $organization_id) {
      schools {
        school_id
        school_name
        status
      }
    }
  }
`;

/**
 * __useSchoolsIdNameByOrganizationQuery__
 *
 * To run a query within a React component, call `useSchoolsIdNameByOrganizationQuery` and pass it any options that fit your needs.
 * When your component renders, `useSchoolsIdNameByOrganizationQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useSchoolsIdNameByOrganizationQuery({
 *   variables: {
 *      organization_id: // value for 'organization_id'
 *   },
 * });
 */
export function useSchoolsIdNameByOrganizationQuery(
  baseOptions: Apollo.QueryHookOptions<SchoolsIdNameByOrganizationQuery, SchoolsIdNameByOrganizationQueryVariables>
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<SchoolsIdNameByOrganizationQuery, SchoolsIdNameByOrganizationQueryVariables>(
    SchoolsIdNameByOrganizationDocument,
    options
  );
}
export function useSchoolsIdNameByOrganizationLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<SchoolsIdNameByOrganizationQuery, SchoolsIdNameByOrganizationQueryVariables>
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<SchoolsIdNameByOrganizationQuery, SchoolsIdNameByOrganizationQueryVariables>(
    SchoolsIdNameByOrganizationDocument,
    options
  );
}
export type SchoolsIdNameByOrganizationQueryHookResult = ReturnType<typeof useSchoolsIdNameByOrganizationQuery>;
export type SchoolsIdNameByOrganizationLazyQueryHookResult = ReturnType<typeof useSchoolsIdNameByOrganizationLazyQuery>;
export type SchoolsIdNameByOrganizationQueryResult = Apollo.QueryResult<
  SchoolsIdNameByOrganizationQuery,
  SchoolsIdNameByOrganizationQueryVariables
>;
