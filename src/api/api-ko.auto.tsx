import * as Types from "./api-ko-schema.auto";

import { gql } from "@apollo/client";
import * as Apollo from "@apollo/client";
const defaultOptions = {};
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
                teachers?: Types.Maybe<Array<Types.Maybe<{ __typename?: "User" } & Pick<Types.User, "user_id" | "user_name">>>>;
                students?: Types.Maybe<Array<Types.Maybe<{ __typename?: "User" } & Pick<Types.User, "user_id" | "user_name">>>>;
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
      teachers?: Types.Maybe<Array<Types.Maybe<{ __typename?: "User" } & UserIdNameFragment>>>;
      students?: Types.Maybe<Array<Types.Maybe<{ __typename?: "User" } & UserIdNameFragment>>>;
    }
  >;
};

export type QueryMyUserQueryVariables = Types.Exact<{ [key: string]: never }>;

export type QueryMyUserQuery = { __typename?: "Query" } & {
  myUser?: Types.Maybe<
    { __typename?: "MyUser" } & {
      node?: Types.Maybe<{ __typename?: "UserConnectionNode" } & Pick<Types.UserConnectionNode, "id" | "givenName" | "familyName">>;
    }
  >;
};

export type GetSchoolMembershipsQueryVariables = Types.Exact<{
  userId?: Types.Maybe<Types.UuidFilter>;
  organizationId?: Types.Maybe<Types.UuidFilter>;
  cursor?: Types.Maybe<Types.Scalars["String"]>;
}>;

export type GetSchoolMembershipsQuery = { __typename?: "Query" } & {
  schoolsConnection?: Types.Maybe<
    { __typename?: "SchoolsConnectionResponse" } & Pick<Types.SchoolsConnectionResponse, "totalCount"> & {
        pageInfo?: Types.Maybe<{ __typename?: "ConnectionPageInfo" } & Pick<Types.ConnectionPageInfo, "hasNextPage" | "endCursor">>;
        edges?: Types.Maybe<
          Array<
            Types.Maybe<
              { __typename?: "SchoolsConnectionEdge" } & {
                node?: Types.Maybe<{ __typename?: "SchoolConnectionNode" } & Pick<Types.SchoolConnectionNode, "id" | "status">>;
              }
            >
          >
        >;
      }
  >;
};

export type GetClassesTeachingQueryVariables = Types.Exact<{
  organizationId?: Types.Maybe<Types.UuidFilter>;
  cursor?: Types.Maybe<Types.Scalars["String"]>;
}>;

export type GetClassesTeachingQuery = { __typename?: "Query" } & {
  myUser?: Types.Maybe<
    { __typename?: "MyUser" } & {
      node?: Types.Maybe<
        { __typename?: "UserConnectionNode" } & {
          classesTeachingConnection?: Types.Maybe<
            { __typename?: "ClassesConnectionResponse" } & Pick<Types.ClassesConnectionResponse, "totalCount"> & {
                pageInfo?: Types.Maybe<{ __typename?: "ConnectionPageInfo" } & Pick<Types.ConnectionPageInfo, "hasNextPage" | "endCursor">>;
                edges?: Types.Maybe<
                  Array<
                    Types.Maybe<
                      { __typename?: "ClassesConnectionEdge" } & {
                        node?: Types.Maybe<{ __typename?: "ClassConnectionNode" } & Pick<Types.ClassConnectionNode, "id" | "status">>;
                      }
                    >
                  >
                >;
              }
          >;
        }
      >;
    }
  >;
};

export type GetStudentNameByIdQueryVariables = Types.Exact<{
  filter?: Types.Maybe<Types.UserFilter>;
  directionArgs?: Types.Maybe<Types.ConnectionsDirectionArgs>;
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
      pageInfo?: Types.Maybe<{ __typename?: "ConnectionPageInfo" } & Pick<Types.ConnectionPageInfo, "hasNextPage" | "endCursor">>;
    }
  >;
};

export type GetOrganizationsQueryVariables = Types.Exact<{
  direction: Types.ConnectionDirection;
  cursor?: Types.Maybe<Types.Scalars["String"]>;
  count?: Types.Maybe<Types.Scalars["PageSize"]>;
  sort: Types.OrganizationSortInput;
  filter: Types.OrganizationFilter;
}>;

export type GetOrganizationsQuery = { __typename?: "Query" } & {
  organizationsConnection?: Types.Maybe<
    { __typename?: "OrganizationsConnectionResponse" } & Pick<Types.OrganizationsConnectionResponse, "totalCount"> & {
        edges?: Types.Maybe<
          Array<
            Types.Maybe<
              { __typename?: "OrganizationsConnectionEdge" } & {
                node?: Types.Maybe<
                  { __typename?: "OrganizationConnectionNode" } & Pick<Types.OrganizationConnectionNode, "id" | "name"> & {
                      owners?: Types.Maybe<Array<Types.Maybe<{ __typename?: "UserSummaryNode" } & Pick<Types.UserSummaryNode, "email">>>>;
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

export type ClassesBySchoolQueryVariables = Types.Exact<{
  school_id: Types.Scalars["ID"];
}>;

export type ClassesBySchoolQuery = { __typename?: "Query" } & {
  school?: Types.Maybe<
    { __typename?: "School" } & {
      classes?: Types.Maybe<
        Array<
          Types.Maybe<
            { __typename?: "Class" } & {
              schools?: Types.Maybe<Array<Types.Maybe<{ __typename?: "School" } & Pick<Types.School, "school_id" | "school_name">>>>;
              teachers?: Types.Maybe<Array<Types.Maybe<{ __typename?: "User" } & UserIdNameFragment>>>;
              students?: Types.Maybe<Array<Types.Maybe<{ __typename?: "User" } & UserIdNameFragment>>>;
            } & ClassIdNameStatusFragment
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
                    teachers?: Types.Maybe<Array<Types.Maybe<{ __typename?: "User" } & Pick<Types.User, "user_id" | "user_name">>>>;
                    students?: Types.Maybe<Array<Types.Maybe<{ __typename?: "User" } & Pick<Types.User, "user_id" | "user_name">>>>;
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
                    teachers?: Types.Maybe<Array<Types.Maybe<{ __typename?: "User" } & Pick<Types.User, "user_id" | "user_name">>>>;
                    students?: Types.Maybe<Array<Types.Maybe<{ __typename?: "User" } & Pick<Types.User, "user_id" | "user_name">>>>;
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
                                    Array<Types.Maybe<{ __typename?: "User" } & Pick<Types.User, "user_id" | "user_name">>>
                                  >;
                                  students?: Types.Maybe<
                                    Array<Types.Maybe<{ __typename?: "User" } & Pick<Types.User, "user_id" | "user_name">>>
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
                          teachers?: Types.Maybe<Array<Types.Maybe<{ __typename?: "User" } & Pick<Types.User, "user_id" | "user_name">>>>;
                          students?: Types.Maybe<Array<Types.Maybe<{ __typename?: "User" } & Pick<Types.User, "user_id" | "user_name">>>>;
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

export type GetProgramsQueryVariables = Types.Exact<{
  program_id: Types.Scalars["ID"];
}>;

export type GetProgramsQuery = { __typename?: "Query" } & {
  program?: Types.Maybe<
    { __typename?: "Program" } & Pick<Types.Program, "id" | "name" | "status"> & {
        subjects?: Types.Maybe<
          Array<
            { __typename?: "Subject" } & Pick<Types.Subject, "id" | "name" | "status"> & {
                categories?: Types.Maybe<
                  Array<
                    { __typename?: "Category" } & Pick<Types.Category, "id" | "name" | "status"> & {
                        subcategories?: Types.Maybe<
                          Array<{ __typename?: "Subcategory" } & Pick<Types.Subcategory, "id" | "name" | "status">>
                        >;
                      }
                  >
                >;
              }
          >
        >;
        age_ranges?: Types.Maybe<Array<{ __typename?: "AgeRange" } & Pick<Types.AgeRange, "id" | "name" | "status">>>;
        grades?: Types.Maybe<Array<{ __typename?: "Grade" } & Pick<Types.Grade, "id" | "name" | "status">>>;
      }
  >;
};

export type StudentsByOrganizationQueryVariables = Types.Exact<{
  organization_id: Types.Scalars["ID"];
}>;

export type StudentsByOrganizationQuery = { __typename?: "Query" } & {
  organization?: Types.Maybe<
    { __typename?: "Organization" } & {
      classes?: Types.Maybe<
        Array<
          Types.Maybe<
            { __typename?: "Class" } & Pick<Types.Class, "class_id" | "class_name" | "status"> & {
                schools?: Types.Maybe<Array<Types.Maybe<{ __typename?: "School" } & Pick<Types.School, "school_id">>>>;
                students?: Types.Maybe<Array<Types.Maybe<{ __typename?: "User" } & Pick<Types.User, "user_id" | "user_name">>>>;
              }
          >
        >
      >;
      schools?: Types.Maybe<
        Array<
          Types.Maybe<
            { __typename?: "School" } & Pick<Types.School, "school_id" | "school_name"> & {
                classes?: Types.Maybe<
                  Array<
                    Types.Maybe<
                      { __typename?: "Class" } & Pick<Types.Class, "class_id" | "class_name" | "status"> & {
                          students?: Types.Maybe<Array<Types.Maybe<{ __typename?: "User" } & Pick<Types.User, "user_id" | "user_name">>>>;
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

export type GetProgramsAndSubjectsQueryVariables = Types.Exact<{
  count: Types.Scalars["PageSize"];
  cursor: Types.Scalars["String"];
  filter: Types.ProgramFilter;
}>;

export type GetProgramsAndSubjectsQuery = { __typename?: "Query" } & {
  programsConnection?: Types.Maybe<
    { __typename?: "ProgramsConnectionResponse" } & Pick<Types.ProgramsConnectionResponse, "totalCount"> & {
        pageInfo?: Types.Maybe<{ __typename?: "ConnectionPageInfo" } & Pick<Types.ConnectionPageInfo, "hasNextPage" | "endCursor">>;
        edges?: Types.Maybe<
          Array<
            Types.Maybe<
              { __typename?: "ProgramsConnectionEdge" } & {
                node?: Types.Maybe<
                  { __typename?: "ProgramConnectionNode" } & Pick<Types.ProgramConnectionNode, "id" | "name" | "status" | "system"> & {
                      ageRanges?: Types.Maybe<
                        Array<
                          { __typename?: "AgeRangeConnectionNode" } & Pick<
                            Types.AgeRangeConnectionNode,
                            "id" | "name" | "status" | "system"
                          >
                        >
                      >;
                      grades?: Types.Maybe<
                        Array<{ __typename?: "GradeSummaryNode" } & Pick<Types.GradeSummaryNode, "id" | "name" | "status" | "system">>
                      >;
                      subjects?: Types.Maybe<
                        Array<
                          { __typename?: "CoreSubjectConnectionNode" } & Pick<
                            Types.CoreSubjectConnectionNode,
                            "id" | "name" | "status" | "system"
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

export type GetSchoolsFilterListQueryVariables = Types.Exact<{
  filter?: Types.Maybe<Types.SchoolFilter>;
  direction: Types.ConnectionDirection;
  directionArgs?: Types.Maybe<Types.ConnectionsDirectionArgs>;
}>;

export type GetSchoolsFilterListQuery = { __typename?: "Query" } & {
  schoolsConnection?: Types.Maybe<
    { __typename?: "SchoolsConnectionResponse" } & Pick<Types.SchoolsConnectionResponse, "totalCount"> & {
        edges?: Types.Maybe<
          Array<
            Types.Maybe<
              { __typename?: "SchoolsConnectionEdge" } & Pick<Types.SchoolsConnectionEdge, "cursor"> & {
                  node?: Types.Maybe<{ __typename?: "SchoolConnectionNode" } & Pick<Types.SchoolConnectionNode, "id" | "name">>;
                }
            >
          >
        >;
        pageInfo?: Types.Maybe<{ __typename?: "ConnectionPageInfo" } & Pick<Types.ConnectionPageInfo, "hasNextPage">>;
      }
  >;
};

export type GetClassFilterListQueryVariables = Types.Exact<{
  filter?: Types.Maybe<Types.ClassFilter>;
  direction: Types.ConnectionDirection;
  directionArgs?: Types.Maybe<Types.ConnectionsDirectionArgs>;
  sort: Types.ClassSortInput;
}>;

export type GetClassFilterListQuery = { __typename?: "Query" } & {
  classesConnection?: Types.Maybe<
    { __typename?: "ClassesConnectionResponse" } & Pick<Types.ClassesConnectionResponse, "totalCount"> & {
        edges?: Types.Maybe<
          Array<
            Types.Maybe<
              { __typename?: "ClassesConnectionEdge" } & Pick<Types.ClassesConnectionEdge, "cursor"> & {
                  node?: Types.Maybe<{ __typename?: "ClassConnectionNode" } & Pick<Types.ClassConnectionNode, "id" | "name">>;
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

export type GetUserQueryVariables = Types.Exact<{
  filter?: Types.Maybe<Types.UserFilter>;
  direction: Types.ConnectionDirection;
  directionArgs?: Types.Maybe<Types.ConnectionsDirectionArgs>;
}>;

export type GetUserQuery = { __typename?: "Query" } & {
  usersConnection?: Types.Maybe<
    { __typename?: "UsersConnectionResponse" } & Pick<Types.UsersConnectionResponse, "totalCount"> & {
        edges?: Types.Maybe<
          Array<
            Types.Maybe<
              { __typename?: "UsersConnectionEdge" } & {
                node?: Types.Maybe<
                  { __typename?: "UserConnectionNode" } & Pick<Types.UserConnectionNode, "id" | "givenName" | "familyName" | "status"> & {
                      roles?: Types.Maybe<Array<{ __typename?: "RoleSummaryNode" } & Pick<Types.RoleSummaryNode, "id" | "name">>>;
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

export type UserIdNameFragment = { __typename?: "User" } & Pick<Types.User, "user_id" | "user_name">;

export type ClassIdNameStatusFragment = { __typename?: "Class" } & Pick<Types.Class, "class_id" | "class_name" | "status">;

export type GetClassByInfoQueryVariables = Types.Exact<{
  filter?: Types.Maybe<Types.ClassFilter>;
  direction: Types.ConnectionDirection;
  studentFilter?: Types.Maybe<Types.UserFilter>;
  teacherFilter?: Types.Maybe<Types.UserFilter>;
  studentCursor?: Types.Maybe<Types.Scalars["String"]>;
  studentDirection?: Types.Maybe<Types.ConnectionDirection>;
  teacherCursor?: Types.Maybe<Types.Scalars["String"]>;
  teacherDirection?: Types.Maybe<Types.ConnectionDirection>;
}>;

export type GetClassByInfoQuery = { __typename?: "Query" } & {
  classesConnection?: Types.Maybe<
    { __typename?: "ClassesConnectionResponse" } & {
      edges?: Types.Maybe<
        Array<
          Types.Maybe<
            { __typename?: "ClassesConnectionEdge" } & Pick<Types.ClassesConnectionEdge, "cursor"> & {
                node?: Types.Maybe<
                  { __typename?: "ClassConnectionNode" } & Pick<Types.ClassConnectionNode, "id" | "name"> & {
                      studentsConnection?: Types.Maybe<
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
    }
  >;
};

export type GetRolesIdQueryVariables = Types.Exact<{
  filter?: Types.Maybe<Types.RoleFilter>;
  direction: Types.ConnectionDirection;
  directionArgs?: Types.Maybe<Types.ConnectionsDirectionArgs>;
}>;

export type GetRolesIdQuery = { __typename?: "Query" } & {
  rolesConnection?: Types.Maybe<
    { __typename?: "RolesConnectionResponse" } & Pick<Types.RolesConnectionResponse, "totalCount"> & {
        pageInfo?: Types.Maybe<
          { __typename?: "ConnectionPageInfo" } & Pick<
            Types.ConnectionPageInfo,
            "hasNextPage" | "hasPreviousPage" | "startCursor" | "endCursor"
          >
        >;
        edges?: Types.Maybe<
          Array<
            Types.Maybe<
              { __typename?: "RolesConnectionEdge" } & {
                node?: Types.Maybe<
                  { __typename?: "RoleConnectionNode" } & Pick<Types.RoleConnectionNode, "id" | "name" | "status" | "system">
                >;
              }
            >
          >
        >;
      }
  >;
};

export type UserNameByUserIdQueryQueryVariables = Types.Exact<{
  filter?: Types.Maybe<Types.UserFilter>;
}>;

export type UserNameByUserIdQueryQuery = { __typename?: "Query" } & {
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

export type ClassesStudentsConnectionQueryVariables = Types.Exact<{
  cursor?: Types.Maybe<Types.Scalars["String"]>;
  filter?: Types.Maybe<Types.ClassFilter>;
}>;

export type ClassesStudentsConnectionQuery = { __typename?: "Query" } & {
  classesConnection?: Types.Maybe<
    { __typename?: "ClassesConnectionResponse" } & Pick<Types.ClassesConnectionResponse, "totalCount"> & {
        edges?: Types.Maybe<
          Array<
            Types.Maybe<
              { __typename?: "ClassesConnectionEdge" } & {
                node?: Types.Maybe<
                  { __typename?: "ClassConnectionNode" } & Pick<Types.ClassConnectionNode, "id" | "name"> & {
                      studentsConnection?: Types.Maybe<
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

export type ClassNodeStudentsQueryVariables = Types.Exact<{
  classId: Types.Scalars["ID"];
  studentsCursor?: Types.Maybe<Types.Scalars["String"]>;
}>;

export type ClassNodeStudentsQuery = { __typename?: "Query" } & {
  classNode?: Types.Maybe<
    { __typename?: "ClassConnectionNode" } & Pick<Types.ClassConnectionNode, "name"> & {
        studentsConnection?: Types.Maybe<
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

export const UserIdNameFragmentDoc = gql`
  fragment userIdName on User {
    user_id
    user_name
  }
`;
export const ClassIdNameStatusFragmentDoc = gql`
  fragment classIdNameStatus on Class {
    class_id
    class_name
    status
  }
`;
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
          user_name
        }
        students {
          user_id
          user_name
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
  baseOptions: Apollo.QueryHookOptions<ClassesByOrganizationQuery, ClassesByOrganizationQueryVariables>
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<ClassesByOrganizationQuery, ClassesByOrganizationQueryVariables>(ClassesByOrganizationDocument, options);
}
export function useClassesByOrganizationLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<ClassesByOrganizationQuery, ClassesByOrganizationQueryVariables>
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<ClassesByOrganizationQuery, ClassesByOrganizationQueryVariables>(ClassesByOrganizationDocument, options);
}
export type ClassesByOrganizationQueryHookResult = ReturnType<typeof useClassesByOrganizationQuery>;
export type ClassesByOrganizationLazyQueryHookResult = ReturnType<typeof useClassesByOrganizationLazyQuery>;
export type ClassesByOrganizationQueryResult = Apollo.QueryResult<ClassesByOrganizationQuery, ClassesByOrganizationQueryVariables>;
export const ParticipantsByClassDocument = gql`
  query participantsByClass($class_id: ID!) {
    class(class_id: $class_id) {
      teachers {
        ...userIdName
      }
      students {
        ...userIdName
      }
    }
  }
  ${UserIdNameFragmentDoc}
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
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<ParticipantsByClassQuery, ParticipantsByClassQueryVariables>(ParticipantsByClassDocument, options);
}
export function useParticipantsByClassLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<ParticipantsByClassQuery, ParticipantsByClassQueryVariables>
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<ParticipantsByClassQuery, ParticipantsByClassQueryVariables>(ParticipantsByClassDocument, options);
}
export type ParticipantsByClassQueryHookResult = ReturnType<typeof useParticipantsByClassQuery>;
export type ParticipantsByClassLazyQueryHookResult = ReturnType<typeof useParticipantsByClassLazyQuery>;
export type ParticipantsByClassQueryResult = Apollo.QueryResult<ParticipantsByClassQuery, ParticipantsByClassQueryVariables>;
export const QueryMyUserDocument = gql`
  query queryMyUser {
    myUser {
      node {
        id
        givenName
        familyName
      }
    }
  }
`;

/**
 * __useQueryMyUserQuery__
 *
 * To run a query within a React component, call `useQueryMyUserQuery` and pass it any options that fit your needs.
 * When your component renders, `useQueryMyUserQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useQueryMyUserQuery({
 *   variables: {
 *   },
 * });
 */
export function useQueryMyUserQuery(baseOptions?: Apollo.QueryHookOptions<QueryMyUserQuery, QueryMyUserQueryVariables>) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<QueryMyUserQuery, QueryMyUserQueryVariables>(QueryMyUserDocument, options);
}
export function useQueryMyUserLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<QueryMyUserQuery, QueryMyUserQueryVariables>) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<QueryMyUserQuery, QueryMyUserQueryVariables>(QueryMyUserDocument, options);
}
export type QueryMyUserQueryHookResult = ReturnType<typeof useQueryMyUserQuery>;
export type QueryMyUserLazyQueryHookResult = ReturnType<typeof useQueryMyUserLazyQuery>;
export type QueryMyUserQueryResult = Apollo.QueryResult<QueryMyUserQuery, QueryMyUserQueryVariables>;
export const GetSchoolMembershipsDocument = gql`
  query getSchoolMemberships($userId: UUIDFilter, $organizationId: UUIDFilter, $cursor: String) {
    schoolsConnection(
      filter: { userId: $userId, organizationId: $organizationId }
      direction: FORWARD
      directionArgs: { cursor: $cursor }
    ) {
      totalCount
      pageInfo {
        hasNextPage
        endCursor
      }
      edges {
        node {
          id
          status
        }
      }
    }
  }
`;

/**
 * __useGetSchoolMembershipsQuery__
 *
 * To run a query within a React component, call `useGetSchoolMembershipsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetSchoolMembershipsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetSchoolMembershipsQuery({
 *   variables: {
 *      userId: // value for 'userId'
 *      organizationId: // value for 'organizationId'
 *      cursor: // value for 'cursor'
 *   },
 * });
 */
export function useGetSchoolMembershipsQuery(
  baseOptions?: Apollo.QueryHookOptions<GetSchoolMembershipsQuery, GetSchoolMembershipsQueryVariables>
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<GetSchoolMembershipsQuery, GetSchoolMembershipsQueryVariables>(GetSchoolMembershipsDocument, options);
}
export function useGetSchoolMembershipsLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<GetSchoolMembershipsQuery, GetSchoolMembershipsQueryVariables>
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<GetSchoolMembershipsQuery, GetSchoolMembershipsQueryVariables>(GetSchoolMembershipsDocument, options);
}
export type GetSchoolMembershipsQueryHookResult = ReturnType<typeof useGetSchoolMembershipsQuery>;
export type GetSchoolMembershipsLazyQueryHookResult = ReturnType<typeof useGetSchoolMembershipsLazyQuery>;
export type GetSchoolMembershipsQueryResult = Apollo.QueryResult<GetSchoolMembershipsQuery, GetSchoolMembershipsQueryVariables>;
export const GetClassesTeachingDocument = gql`
  query getClassesTeaching($organizationId: UUIDFilter, $cursor: String) {
    myUser {
      node {
        classesTeachingConnection(filter: { organizationId: $organizationId }, cursor: $cursor) {
          totalCount
          pageInfo {
            hasNextPage
            endCursor
          }
          edges {
            node {
              id
              status
            }
          }
        }
      }
    }
  }
`;

/**
 * __useGetClassesTeachingQuery__
 *
 * To run a query within a React component, call `useGetClassesTeachingQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetClassesTeachingQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetClassesTeachingQuery({
 *   variables: {
 *      organizationId: // value for 'organizationId'
 *      cursor: // value for 'cursor'
 *   },
 * });
 */
export function useGetClassesTeachingQuery(
  baseOptions?: Apollo.QueryHookOptions<GetClassesTeachingQuery, GetClassesTeachingQueryVariables>
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<GetClassesTeachingQuery, GetClassesTeachingQueryVariables>(GetClassesTeachingDocument, options);
}
export function useGetClassesTeachingLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<GetClassesTeachingQuery, GetClassesTeachingQueryVariables>
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<GetClassesTeachingQuery, GetClassesTeachingQueryVariables>(GetClassesTeachingDocument, options);
}
export type GetClassesTeachingQueryHookResult = ReturnType<typeof useGetClassesTeachingQuery>;
export type GetClassesTeachingLazyQueryHookResult = ReturnType<typeof useGetClassesTeachingLazyQuery>;
export type GetClassesTeachingQueryResult = Apollo.QueryResult<GetClassesTeachingQuery, GetClassesTeachingQueryVariables>;
export const GetStudentNameByIdDocument = gql`
  query getStudentNameById($filter: UserFilter, $directionArgs: ConnectionsDirectionArgs) {
    usersConnection(filter: $filter, direction: FORWARD, directionArgs: $directionArgs) {
      edges {
        node {
          id
          givenName
          familyName
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
 *      directionArgs: // value for 'directionArgs'
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
export const GetOrganizationsDocument = gql`
  query getOrganizations(
    $direction: ConnectionDirection!
    $cursor: String
    $count: PageSize
    $sort: OrganizationSortInput!
    $filter: OrganizationFilter!
  ) {
    organizationsConnection(direction: $direction, filter: $filter, directionArgs: { count: $count, cursor: $cursor }, sort: $sort) {
      totalCount
      edges {
        node {
          id
          name
          owners {
            email
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
 * __useGetOrganizationsQuery__
 *
 * To run a query within a React component, call `useGetOrganizationsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetOrganizationsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetOrganizationsQuery({
 *   variables: {
 *      direction: // value for 'direction'
 *      cursor: // value for 'cursor'
 *      count: // value for 'count'
 *      sort: // value for 'sort'
 *      filter: // value for 'filter'
 *   },
 * });
 */
export function useGetOrganizationsQuery(baseOptions: Apollo.QueryHookOptions<GetOrganizationsQuery, GetOrganizationsQueryVariables>) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<GetOrganizationsQuery, GetOrganizationsQueryVariables>(GetOrganizationsDocument, options);
}
export function useGetOrganizationsLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<GetOrganizationsQuery, GetOrganizationsQueryVariables>
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<GetOrganizationsQuery, GetOrganizationsQueryVariables>(GetOrganizationsDocument, options);
}
export type GetOrganizationsQueryHookResult = ReturnType<typeof useGetOrganizationsQuery>;
export type GetOrganizationsLazyQueryHookResult = ReturnType<typeof useGetOrganizationsLazyQuery>;
export type GetOrganizationsQueryResult = Apollo.QueryResult<GetOrganizationsQuery, GetOrganizationsQueryVariables>;
export const ClassesBySchoolDocument = gql`
  query classesBySchool($school_id: ID!) {
    school(school_id: $school_id) {
      classes {
        ...classIdNameStatus
        schools {
          school_id
          school_name
        }
        teachers {
          ...userIdName
        }
        students {
          ...userIdName
        }
      }
    }
  }
  ${ClassIdNameStatusFragmentDoc}
  ${UserIdNameFragmentDoc}
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
export function useClassesBySchoolQuery(baseOptions: Apollo.QueryHookOptions<ClassesBySchoolQuery, ClassesBySchoolQueryVariables>) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<ClassesBySchoolQuery, ClassesBySchoolQueryVariables>(ClassesBySchoolDocument, options);
}
export function useClassesBySchoolLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<ClassesBySchoolQuery, ClassesBySchoolQueryVariables>
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<ClassesBySchoolQuery, ClassesBySchoolQueryVariables>(ClassesBySchoolDocument, options);
}
export type ClassesBySchoolQueryHookResult = ReturnType<typeof useClassesBySchoolQuery>;
export type ClassesBySchoolLazyQueryHookResult = ReturnType<typeof useClassesBySchoolLazyQuery>;
export type ClassesBySchoolQueryResult = Apollo.QueryResult<ClassesBySchoolQuery, ClassesBySchoolQueryVariables>;
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
            user_name
          }
          students {
            user_id
            user_name
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
  baseOptions: Apollo.QueryHookOptions<ClassesTeachingQueryQuery, ClassesTeachingQueryQueryVariables>
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<ClassesTeachingQueryQuery, ClassesTeachingQueryQueryVariables>(ClassesTeachingQueryDocument, options);
}
export function useClassesTeachingQueryLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<ClassesTeachingQueryQuery, ClassesTeachingQueryQueryVariables>
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<ClassesTeachingQueryQuery, ClassesTeachingQueryQueryVariables>(ClassesTeachingQueryDocument, options);
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
            user_name
          }
          students {
            user_id
            user_name
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
  baseOptions: Apollo.QueryHookOptions<ClassesStudentQueryQuery, ClassesStudentQueryQueryVariables>
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<ClassesStudentQueryQuery, ClassesStudentQueryQueryVariables>(ClassesStudentQueryDocument, options);
}
export function useClassesStudentQueryLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<ClassesStudentQueryQuery, ClassesStudentQueryQueryVariables>
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<ClassesStudentQueryQuery, ClassesStudentQueryQueryVariables>(ClassesStudentQueryDocument, options);
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
                user_name
              }
              students {
                user_id
                user_name
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
export function useSchoolByUserQueryQuery(baseOptions: Apollo.QueryHookOptions<SchoolByUserQueryQuery, SchoolByUserQueryQueryVariables>) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<SchoolByUserQueryQuery, SchoolByUserQueryQueryVariables>(SchoolByUserQueryDocument, options);
}
export function useSchoolByUserQueryLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<SchoolByUserQueryQuery, SchoolByUserQueryQueryVariables>
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<SchoolByUserQueryQuery, SchoolByUserQueryQueryVariables>(SchoolByUserQueryDocument, options);
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
            user_name
          }
          students {
            user_id
            user_name
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
export function useSchoolByOrgQueryQuery(baseOptions: Apollo.QueryHookOptions<SchoolByOrgQueryQuery, SchoolByOrgQueryQueryVariables>) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<SchoolByOrgQueryQuery, SchoolByOrgQueryQueryVariables>(SchoolByOrgQueryDocument, options);
}
export function useSchoolByOrgQueryLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<SchoolByOrgQueryQuery, SchoolByOrgQueryQueryVariables>
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<SchoolByOrgQueryQuery, SchoolByOrgQueryQueryVariables>(SchoolByOrgQueryDocument, options);
}
export type SchoolByOrgQueryQueryHookResult = ReturnType<typeof useSchoolByOrgQueryQuery>;
export type SchoolByOrgQueryLazyQueryHookResult = ReturnType<typeof useSchoolByOrgQueryLazyQuery>;
export type SchoolByOrgQueryQueryResult = Apollo.QueryResult<SchoolByOrgQueryQuery, SchoolByOrgQueryQueryVariables>;
export const GetProgramsDocument = gql`
  query getPrograms($program_id: ID!) {
    program(id: $program_id) {
      id
      name
      status
      subjects {
        id
        name
        status
        categories {
          id
          name
          status
          subcategories {
            id
            name
            status
          }
        }
      }
      age_ranges {
        id
        name
        status
      }
      grades {
        id
        name
        status
      }
    }
  }
`;

/**
 * __useGetProgramsQuery__
 *
 * To run a query within a React component, call `useGetProgramsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetProgramsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetProgramsQuery({
 *   variables: {
 *      program_id: // value for 'program_id'
 *   },
 * });
 */
export function useGetProgramsQuery(baseOptions: Apollo.QueryHookOptions<GetProgramsQuery, GetProgramsQueryVariables>) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<GetProgramsQuery, GetProgramsQueryVariables>(GetProgramsDocument, options);
}
export function useGetProgramsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetProgramsQuery, GetProgramsQueryVariables>) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<GetProgramsQuery, GetProgramsQueryVariables>(GetProgramsDocument, options);
}
export type GetProgramsQueryHookResult = ReturnType<typeof useGetProgramsQuery>;
export type GetProgramsLazyQueryHookResult = ReturnType<typeof useGetProgramsLazyQuery>;
export type GetProgramsQueryResult = Apollo.QueryResult<GetProgramsQuery, GetProgramsQueryVariables>;
export const StudentsByOrganizationDocument = gql`
  query studentsByOrganization($organization_id: ID!) {
    organization(organization_id: $organization_id) {
      classes {
        class_id
        class_name
        status
        schools {
          school_id
        }
        students {
          user_id
          user_name
        }
      }
      schools {
        school_id
        school_name
        classes {
          class_id
          class_name
          status
          students {
            user_id
            user_name
          }
        }
      }
    }
  }
`;

/**
 * __useStudentsByOrganizationQuery__
 *
 * To run a query within a React component, call `useStudentsByOrganizationQuery` and pass it any options that fit your needs.
 * When your component renders, `useStudentsByOrganizationQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useStudentsByOrganizationQuery({
 *   variables: {
 *      organization_id: // value for 'organization_id'
 *   },
 * });
 */
export function useStudentsByOrganizationQuery(
  baseOptions: Apollo.QueryHookOptions<StudentsByOrganizationQuery, StudentsByOrganizationQueryVariables>
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<StudentsByOrganizationQuery, StudentsByOrganizationQueryVariables>(StudentsByOrganizationDocument, options);
}
export function useStudentsByOrganizationLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<StudentsByOrganizationQuery, StudentsByOrganizationQueryVariables>
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<StudentsByOrganizationQuery, StudentsByOrganizationQueryVariables>(StudentsByOrganizationDocument, options);
}
export type StudentsByOrganizationQueryHookResult = ReturnType<typeof useStudentsByOrganizationQuery>;
export type StudentsByOrganizationLazyQueryHookResult = ReturnType<typeof useStudentsByOrganizationLazyQuery>;
export type StudentsByOrganizationQueryResult = Apollo.QueryResult<StudentsByOrganizationQuery, StudentsByOrganizationQueryVariables>;
export const GetProgramsAndSubjectsDocument = gql`
  query getProgramsAndSubjects($count: PageSize!, $cursor: String!, $filter: ProgramFilter!) {
    programsConnection(filter: $filter, directionArgs: { count: $count, cursor: $cursor }, direction: FORWARD) {
      totalCount
      pageInfo {
        hasNextPage
        endCursor
      }
      edges {
        node {
          id
          name
          status
          system
          ageRanges {
            id
            name
            status
            system
          }
          grades {
            id
            name
            status
            system
          }
          subjects {
            id
            name
            status
            system
          }
        }
      }
    }
  }
`;

/**
 * __useGetProgramsAndSubjectsQuery__
 *
 * To run a query within a React component, call `useGetProgramsAndSubjectsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetProgramsAndSubjectsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetProgramsAndSubjectsQuery({
 *   variables: {
 *      count: // value for 'count'
 *      cursor: // value for 'cursor'
 *      filter: // value for 'filter'
 *   },
 * });
 */
export function useGetProgramsAndSubjectsQuery(
  baseOptions: Apollo.QueryHookOptions<GetProgramsAndSubjectsQuery, GetProgramsAndSubjectsQueryVariables>
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<GetProgramsAndSubjectsQuery, GetProgramsAndSubjectsQueryVariables>(GetProgramsAndSubjectsDocument, options);
}
export function useGetProgramsAndSubjectsLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<GetProgramsAndSubjectsQuery, GetProgramsAndSubjectsQueryVariables>
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<GetProgramsAndSubjectsQuery, GetProgramsAndSubjectsQueryVariables>(GetProgramsAndSubjectsDocument, options);
}
export type GetProgramsAndSubjectsQueryHookResult = ReturnType<typeof useGetProgramsAndSubjectsQuery>;
export type GetProgramsAndSubjectsLazyQueryHookResult = ReturnType<typeof useGetProgramsAndSubjectsLazyQuery>;
export type GetProgramsAndSubjectsQueryResult = Apollo.QueryResult<GetProgramsAndSubjectsQuery, GetProgramsAndSubjectsQueryVariables>;
export const GetSchoolsFilterListDocument = gql`
  query getSchoolsFilterList($filter: SchoolFilter, $direction: ConnectionDirection!, $directionArgs: ConnectionsDirectionArgs) {
    schoolsConnection(filter: $filter, direction: $direction, directionArgs: $directionArgs) {
      totalCount
      edges {
        cursor
        node {
          id
          name
        }
      }
      pageInfo {
        hasNextPage
      }
    }
  }
`;

/**
 * __useGetSchoolsFilterListQuery__
 *
 * To run a query within a React component, call `useGetSchoolsFilterListQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetSchoolsFilterListQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetSchoolsFilterListQuery({
 *   variables: {
 *      filter: // value for 'filter'
 *      direction: // value for 'direction'
 *      directionArgs: // value for 'directionArgs'
 *   },
 * });
 */
export function useGetSchoolsFilterListQuery(
  baseOptions: Apollo.QueryHookOptions<GetSchoolsFilterListQuery, GetSchoolsFilterListQueryVariables>
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<GetSchoolsFilterListQuery, GetSchoolsFilterListQueryVariables>(GetSchoolsFilterListDocument, options);
}
export function useGetSchoolsFilterListLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<GetSchoolsFilterListQuery, GetSchoolsFilterListQueryVariables>
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<GetSchoolsFilterListQuery, GetSchoolsFilterListQueryVariables>(GetSchoolsFilterListDocument, options);
}
export type GetSchoolsFilterListQueryHookResult = ReturnType<typeof useGetSchoolsFilterListQuery>;
export type GetSchoolsFilterListLazyQueryHookResult = ReturnType<typeof useGetSchoolsFilterListLazyQuery>;
export type GetSchoolsFilterListQueryResult = Apollo.QueryResult<GetSchoolsFilterListQuery, GetSchoolsFilterListQueryVariables>;
export const GetClassFilterListDocument = gql`
  query getClassFilterList(
    $filter: ClassFilter
    $direction: ConnectionDirection!
    $directionArgs: ConnectionsDirectionArgs
    $sort: ClassSortInput!
  ) {
    classesConnection(filter: $filter, direction: $direction, directionArgs: $directionArgs, sort: $sort) {
      totalCount
      edges {
        cursor
        node {
          id
          name
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
 * __useGetClassFilterListQuery__
 *
 * To run a query within a React component, call `useGetClassFilterListQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetClassFilterListQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetClassFilterListQuery({
 *   variables: {
 *      filter: // value for 'filter'
 *      direction: // value for 'direction'
 *      directionArgs: // value for 'directionArgs'
 *      sort: // value for 'sort'
 *   },
 * });
 */
export function useGetClassFilterListQuery(
  baseOptions: Apollo.QueryHookOptions<GetClassFilterListQuery, GetClassFilterListQueryVariables>
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<GetClassFilterListQuery, GetClassFilterListQueryVariables>(GetClassFilterListDocument, options);
}
export function useGetClassFilterListLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<GetClassFilterListQuery, GetClassFilterListQueryVariables>
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<GetClassFilterListQuery, GetClassFilterListQueryVariables>(GetClassFilterListDocument, options);
}
export type GetClassFilterListQueryHookResult = ReturnType<typeof useGetClassFilterListQuery>;
export type GetClassFilterListLazyQueryHookResult = ReturnType<typeof useGetClassFilterListLazyQuery>;
export type GetClassFilterListQueryResult = Apollo.QueryResult<GetClassFilterListQuery, GetClassFilterListQueryVariables>;
export const GetUserDocument = gql`
  query getUser($filter: UserFilter, $direction: ConnectionDirection!, $directionArgs: ConnectionsDirectionArgs) {
    usersConnection(direction: $direction, filter: $filter, directionArgs: $directionArgs) {
      totalCount
      edges {
        node {
          id
          givenName
          familyName
          status
          roles {
            id
            name
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
 * __useGetUserQuery__
 *
 * To run a query within a React component, call `useGetUserQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetUserQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetUserQuery({
 *   variables: {
 *      filter: // value for 'filter'
 *      direction: // value for 'direction'
 *      directionArgs: // value for 'directionArgs'
 *   },
 * });
 */
export function useGetUserQuery(baseOptions: Apollo.QueryHookOptions<GetUserQuery, GetUserQueryVariables>) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<GetUserQuery, GetUserQueryVariables>(GetUserDocument, options);
}
export function useGetUserLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetUserQuery, GetUserQueryVariables>) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<GetUserQuery, GetUserQueryVariables>(GetUserDocument, options);
}
export type GetUserQueryHookResult = ReturnType<typeof useGetUserQuery>;
export type GetUserLazyQueryHookResult = ReturnType<typeof useGetUserLazyQuery>;
export type GetUserQueryResult = Apollo.QueryResult<GetUserQuery, GetUserQueryVariables>;
export const GetClassByInfoDocument = gql`
  query getClassByInfo(
    $filter: ClassFilter
    $direction: ConnectionDirection!
    $studentFilter: UserFilter
    $teacherFilter: UserFilter
    $studentCursor: String
    $studentDirection: ConnectionDirection
    $teacherCursor: String
    $teacherDirection: ConnectionDirection
  ) {
    classesConnection(filter: $filter, direction: $direction) {
      edges {
        cursor
        node {
          id
          name
          studentsConnection(filter: $studentFilter, cursor: $studentCursor, direction: $studentDirection) {
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
          teachersConnection(filter: $teacherFilter, cursor: $teacherCursor, direction: $teacherDirection) {
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
    }
  }
`;

/**
 * __useGetClassByInfoQuery__
 *
 * To run a query within a React component, call `useGetClassByInfoQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetClassByInfoQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetClassByInfoQuery({
 *   variables: {
 *      filter: // value for 'filter'
 *      direction: // value for 'direction'
 *      studentFilter: // value for 'studentFilter'
 *      teacherFilter: // value for 'teacherFilter'
 *      studentCursor: // value for 'studentCursor'
 *      studentDirection: // value for 'studentDirection'
 *      teacherCursor: // value for 'teacherCursor'
 *      teacherDirection: // value for 'teacherDirection'
 *   },
 * });
 */
export function useGetClassByInfoQuery(baseOptions: Apollo.QueryHookOptions<GetClassByInfoQuery, GetClassByInfoQueryVariables>) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<GetClassByInfoQuery, GetClassByInfoQueryVariables>(GetClassByInfoDocument, options);
}
export function useGetClassByInfoLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetClassByInfoQuery, GetClassByInfoQueryVariables>) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<GetClassByInfoQuery, GetClassByInfoQueryVariables>(GetClassByInfoDocument, options);
}
export type GetClassByInfoQueryHookResult = ReturnType<typeof useGetClassByInfoQuery>;
export type GetClassByInfoLazyQueryHookResult = ReturnType<typeof useGetClassByInfoLazyQuery>;
export type GetClassByInfoQueryResult = Apollo.QueryResult<GetClassByInfoQuery, GetClassByInfoQueryVariables>;
export const GetRolesIdDocument = gql`
  query getRolesId($filter: RoleFilter, $direction: ConnectionDirection!, $directionArgs: ConnectionsDirectionArgs) {
    rolesConnection(filter: $filter, direction: $direction, directionArgs: $directionArgs) {
      totalCount
      pageInfo {
        hasNextPage
        hasPreviousPage
        startCursor
        endCursor
      }
      edges {
        node {
          id
          name
          status
          system
        }
      }
    }
  }
`;

/**
 * __useGetRolesIdQuery__
 *
 * To run a query within a React component, call `useGetRolesIdQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetRolesIdQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetRolesIdQuery({
 *   variables: {
 *      filter: // value for 'filter'
 *      direction: // value for 'direction'
 *      directionArgs: // value for 'directionArgs'
 *   },
 * });
 */
export function useGetRolesIdQuery(baseOptions: Apollo.QueryHookOptions<GetRolesIdQuery, GetRolesIdQueryVariables>) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<GetRolesIdQuery, GetRolesIdQueryVariables>(GetRolesIdDocument, options);
}
export function useGetRolesIdLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetRolesIdQuery, GetRolesIdQueryVariables>) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<GetRolesIdQuery, GetRolesIdQueryVariables>(GetRolesIdDocument, options);
}
export type GetRolesIdQueryHookResult = ReturnType<typeof useGetRolesIdQuery>;
export type GetRolesIdLazyQueryHookResult = ReturnType<typeof useGetRolesIdLazyQuery>;
export type GetRolesIdQueryResult = Apollo.QueryResult<GetRolesIdQuery, GetRolesIdQueryVariables>;
export const UserNameByUserIdQueryDocument = gql`
  query userNameByUserIdQuery($filter: UserFilter) {
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
 * __useUserNameByUserIdQueryQuery__
 *
 * To run a query within a React component, call `useUserNameByUserIdQueryQuery` and pass it any options that fit your needs.
 * When your component renders, `useUserNameByUserIdQueryQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useUserNameByUserIdQueryQuery({
 *   variables: {
 *      filter: // value for 'filter'
 *   },
 * });
 */
export function useUserNameByUserIdQueryQuery(
  baseOptions?: Apollo.QueryHookOptions<UserNameByUserIdQueryQuery, UserNameByUserIdQueryQueryVariables>
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<UserNameByUserIdQueryQuery, UserNameByUserIdQueryQueryVariables>(UserNameByUserIdQueryDocument, options);
}
export function useUserNameByUserIdQueryLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<UserNameByUserIdQueryQuery, UserNameByUserIdQueryQueryVariables>
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<UserNameByUserIdQueryQuery, UserNameByUserIdQueryQueryVariables>(UserNameByUserIdQueryDocument, options);
}
export type UserNameByUserIdQueryQueryHookResult = ReturnType<typeof useUserNameByUserIdQueryQuery>;
export type UserNameByUserIdQueryLazyQueryHookResult = ReturnType<typeof useUserNameByUserIdQueryLazyQuery>;
export type UserNameByUserIdQueryQueryResult = Apollo.QueryResult<UserNameByUserIdQueryQuery, UserNameByUserIdQueryQueryVariables>;
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
export const ClassesStudentsConnectionDocument = gql`
  query classesStudentsConnection($cursor: String, $filter: ClassFilter) {
    classesConnection(filter: $filter, directionArgs: { cursor: $cursor }, direction: FORWARD, sort: { order: ASC, field: name }) {
      totalCount
      edges {
        node {
          id
          name
          studentsConnection(direction: FORWARD) {
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
 * __useClassesStudentsConnectionQuery__
 *
 * To run a query within a React component, call `useClassesStudentsConnectionQuery` and pass it any options that fit your needs.
 * When your component renders, `useClassesStudentsConnectionQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useClassesStudentsConnectionQuery({
 *   variables: {
 *      cursor: // value for 'cursor'
 *      filter: // value for 'filter'
 *   },
 * });
 */
export function useClassesStudentsConnectionQuery(
  baseOptions?: Apollo.QueryHookOptions<ClassesStudentsConnectionQuery, ClassesStudentsConnectionQueryVariables>
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<ClassesStudentsConnectionQuery, ClassesStudentsConnectionQueryVariables>(
    ClassesStudentsConnectionDocument,
    options
  );
}
export function useClassesStudentsConnectionLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<ClassesStudentsConnectionQuery, ClassesStudentsConnectionQueryVariables>
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<ClassesStudentsConnectionQuery, ClassesStudentsConnectionQueryVariables>(
    ClassesStudentsConnectionDocument,
    options
  );
}
export type ClassesStudentsConnectionQueryHookResult = ReturnType<typeof useClassesStudentsConnectionQuery>;
export type ClassesStudentsConnectionLazyQueryHookResult = ReturnType<typeof useClassesStudentsConnectionLazyQuery>;
export type ClassesStudentsConnectionQueryResult = Apollo.QueryResult<
  ClassesStudentsConnectionQuery,
  ClassesStudentsConnectionQueryVariables
>;
export const ClassNodeStudentsDocument = gql`
  query classNodeStudents($classId: ID!, $studentsCursor: String) {
    classNode(id: $classId) {
      name
      studentsConnection(cursor: $studentsCursor) {
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
 * __useClassNodeStudentsQuery__
 *
 * To run a query within a React component, call `useClassNodeStudentsQuery` and pass it any options that fit your needs.
 * When your component renders, `useClassNodeStudentsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useClassNodeStudentsQuery({
 *   variables: {
 *      classId: // value for 'classId'
 *      studentsCursor: // value for 'studentsCursor'
 *   },
 * });
 */
export function useClassNodeStudentsQuery(baseOptions: Apollo.QueryHookOptions<ClassNodeStudentsQuery, ClassNodeStudentsQueryVariables>) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<ClassNodeStudentsQuery, ClassNodeStudentsQueryVariables>(ClassNodeStudentsDocument, options);
}
export function useClassNodeStudentsLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<ClassNodeStudentsQuery, ClassNodeStudentsQueryVariables>
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<ClassNodeStudentsQuery, ClassNodeStudentsQueryVariables>(ClassNodeStudentsDocument, options);
}
export type ClassNodeStudentsQueryHookResult = ReturnType<typeof useClassNodeStudentsQuery>;
export type ClassNodeStudentsLazyQueryHookResult = ReturnType<typeof useClassNodeStudentsLazyQuery>;
export type ClassNodeStudentsQueryResult = Apollo.QueryResult<ClassNodeStudentsQuery, ClassNodeStudentsQueryVariables>;
