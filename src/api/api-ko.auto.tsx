import * as Types from "./api-ko-schema.auto";

import { gql } from "@apollo/client";
import * as Apollo from "@apollo/client";
const defaultOptions = {};
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
                teachers?: Types.Maybe<Array<Types.Maybe<{ __typename?: "User" } & Pick<Types.User, "user_id" | "user_name">>>>;
                students?: Types.Maybe<Array<Types.Maybe<{ __typename?: "User" } & Pick<Types.User, "user_id" | "user_name">>>>;
              }
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
                teachers?: Types.Maybe<
                  Array<
                    Types.Maybe<
                      { __typename?: "User" } & {
                        school_memberships?: Types.Maybe<
                          Array<Types.Maybe<{ __typename?: "SchoolMembership" } & Pick<Types.SchoolMembership, "school_id" | "status">>>
                        >;
                      } & UserIdNameFragment
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

export type ClassStudentsByOrganizationQueryVariables = Types.Exact<{
  organization_id: Types.Scalars["ID"];
}>;

export type ClassStudentsByOrganizationQuery = { __typename?: "Query" } & {
  organization?: Types.Maybe<
    { __typename?: "Organization" } & {
      classes?: Types.Maybe<
        Array<
          Types.Maybe<
            { __typename?: "Class" } & Pick<Types.Class, "class_id" | "status"> & {
                students?: Types.Maybe<Array<Types.Maybe<{ __typename?: "User" } & Pick<Types.User, "user_id" | "full_name">>>>;
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

export type SchoolsByOrganizationQueryVariables = Types.Exact<{
  organization_id: Types.Scalars["ID"];
}>;

export type SchoolsByOrganizationQuery = { __typename?: "Query" } & {
  organization?: Types.Maybe<
    { __typename?: "Organization" } & {
      classes?: Types.Maybe<
        Array<
          Types.Maybe<
            { __typename?: "Class" } & Pick<Types.Class, "class_id" | "class_name" | "status"> & {
                schools?: Types.Maybe<Array<Types.Maybe<{ __typename?: "School" } & Pick<Types.School, "school_id" | "status">>>>;
              }
          >
        >
      >;
      schools?: Types.Maybe<
        Array<
          Types.Maybe<
            { __typename?: "School" } & Pick<Types.School, "school_id" | "school_name" | "status"> & {
                classes?: Types.Maybe<Array<Types.Maybe<{ __typename?: "Class" } & ClassIdNameStatusFragment>>>;
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

export type QeuryMeQueryVariables = Types.Exact<{
  organization_id: Types.Scalars["ID"];
}>;

export type QeuryMeQuery = { __typename?: "Query" } & {
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
    } & UserIdNameFragment
  >;
};

export type MyPermissionsAndClassesTeachingQueryQueryVariables = Types.Exact<{
  organization_id: Types.Scalars["ID"];
}>;

export type MyPermissionsAndClassesTeachingQueryQuery = { __typename?: "Query" } & {
  me?: Types.Maybe<
    { __typename?: "User" } & Pick<Types.User, "user_id"> & {
        membership?: Types.Maybe<
          { __typename?: "OrganizationMembership" } & Pick<Types.OrganizationMembership, "organization_id"> & {
              schoolMemberships?: Types.Maybe<
                Array<Types.Maybe<{ __typename?: "SchoolMembership" } & Pick<Types.SchoolMembership, "school_id" | "status">>>
              >;
              classesTeaching?: Types.Maybe<Array<Types.Maybe<{ __typename?: "Class" } & Pick<Types.Class, "class_id" | "status">>>>;
            }
        >;
      }
  >;
};

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
                { __typename?: "School" } & Pick<Types.School, "status" | "school_id" | "school_name"> & {
                    organization?: Types.Maybe<{ __typename?: "Organization" } & Pick<Types.Organization, "organization_id">>;
                    classes?: Types.Maybe<
                      Array<
                        Types.Maybe<
                          { __typename?: "Class" } & Pick<Types.Class, "status"> & {
                              teachers?: Types.Maybe<Array<Types.Maybe<{ __typename?: "User" } & UserIdNameFragment>>>;
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
            } & ClassIdNameStatusFragment
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
            { __typename?: "Class" } & Pick<Types.Class, "status"> & {
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
    { __typename?: "Organization" } & Pick<Types.Organization, "status"> & {
        classes?: Types.Maybe<
          Array<
            Types.Maybe<
              { __typename?: "Class" } & {
                teachers?: Types.Maybe<
                  Array<
                    Types.Maybe<
                      { __typename?: "User" } & Pick<Types.User, "user_id" | "user_name"> & {
                          school_memberships?: Types.Maybe<
                            Array<
                              Types.Maybe<
                                { __typename?: "SchoolMembership" } & Pick<Types.SchoolMembership, "school_id"> & {
                                    school?: Types.Maybe<
                                      { __typename?: "School" } & {
                                        organization?: Types.Maybe<
                                          { __typename?: "Organization" } & Pick<Types.Organization, "organization_id">
                                        >;
                                      }
                                    >;
                                  }
                              >
                            >
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

export type TeacherListBySchoolIdQueryVariables = Types.Exact<{
  school_id: Types.Scalars["ID"];
}>;

export type TeacherListBySchoolIdQuery = { __typename?: "Query" } & {
  school?: Types.Maybe<
    { __typename?: "School" } & {
      classes?: Types.Maybe<
        Array<
          Types.Maybe<
            { __typename?: "Class" } & Pick<Types.Class, "status" | "class_id"> & {
                teachers?: Types.Maybe<Array<Types.Maybe<{ __typename?: "User" } & Pick<Types.User, "user_id" | "user_name">>>>;
              }
          >
        >
      >;
    }
  >;
};

export type NotParticipantsByOrganizationQueryVariables = Types.Exact<{
  organization_id: Types.Scalars["ID"];
}>;

export type NotParticipantsByOrganizationQuery = { __typename?: "Query" } & {
  organization?: Types.Maybe<
    { __typename?: "Organization" } & {
      classes?: Types.Maybe<
        Array<
          Types.Maybe<
            { __typename?: "Class" } & Pick<Types.Class, "status"> & {
                schools?: Types.Maybe<Array<Types.Maybe<{ __typename?: "School" } & Pick<Types.School, "school_id" | "school_name">>>>;
                teachers?: Types.Maybe<
                  Array<
                    Types.Maybe<
                      { __typename?: "User" } & Pick<Types.User, "user_id" | "user_name"> & {
                          school_memberships?: Types.Maybe<
                            Array<
                              Types.Maybe<
                                { __typename?: "SchoolMembership" } & Pick<Types.SchoolMembership, "school_id"> & {
                                    school?: Types.Maybe<
                                      { __typename?: "School" } & Pick<Types.School, "school_name"> & {
                                          organization?: Types.Maybe<
                                            { __typename?: "Organization" } & Pick<Types.Organization, "organization_id">
                                          >;
                                        }
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
          >
        >
      >;
    }
  >;
};

export type SchoolAndTeacherByOrgQueryVariables = Types.Exact<{
  organization_id: Types.Scalars["ID"];
}>;

export type SchoolAndTeacherByOrgQuery = { __typename?: "Query" } & {
  organization?: Types.Maybe<
    { __typename?: "Organization" } & {
      schools?: Types.Maybe<
        Array<
          Types.Maybe<
            { __typename?: "School" } & Pick<Types.School, "school_id" | "school_name" | "status"> & {
                classes?: Types.Maybe<
                  Array<
                    Types.Maybe<
                      { __typename?: "Class" } & Pick<Types.Class, "status" | "class_id" | "class_name"> & {
                          teachers?: Types.Maybe<Array<Types.Maybe<{ __typename?: "User" } & Pick<Types.User, "user_id" | "user_name">>>>;
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
  organization_id: Types.Scalars["UUID"];
  count: Types.Scalars["PageSize"];
  cursor: Types.Scalars["String"];
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
                        Array<{ __typename?: "SubjectSummaryNode" } & Pick<Types.SubjectSummaryNode, "id" | "name" | "status" | "system">>
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
}>;

export type GetUserQuery = { __typename?: "Query" } & {
  usersConnection?: Types.Maybe<
    { __typename?: "UsersConnectionResponse" } & {
      edges?: Types.Maybe<
        Array<
          Types.Maybe<
            { __typename?: "UsersConnectionEdge" } & {
              node?: Types.Maybe<
                { __typename?: "UserConnectionNode" } & Pick<Types.UserConnectionNode, "id" | "givenName" | "familyName" | "status"> & {
                    roles: Array<{ __typename?: "RoleSummaryNode" } & Pick<Types.RoleSummaryNode, "id" | "name">>;
                  }
              >;
            }
          >
        >
      >;
    }
  >;
};

export type UserIdNameFragment = { __typename?: "User" } & Pick<Types.User, "user_id" | "user_name">;

export type ClassIdNameStatusFragment = { __typename?: "Class" } & Pick<Types.Class, "class_id" | "class_name" | "status">;

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
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<RoleBasedUsersByOrgnizationQuery, RoleBasedUsersByOrgnizationQueryVariables>(
    RoleBasedUsersByOrgnizationDocument,
    options
  );
}
export function useRoleBasedUsersByOrgnizationLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<RoleBasedUsersByOrgnizationQuery, RoleBasedUsersByOrgnizationQueryVariables>
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<RoleBasedUsersByOrgnizationQuery, RoleBasedUsersByOrgnizationQueryVariables>(
    RoleBasedUsersByOrgnizationDocument,
    options
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
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<TeachersByOrgnizationQuery, TeachersByOrgnizationQueryVariables>(TeachersByOrgnizationDocument, options);
}
export function useTeachersByOrgnizationLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<TeachersByOrgnizationQuery, TeachersByOrgnizationQueryVariables>
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<TeachersByOrgnizationQuery, TeachersByOrgnizationQueryVariables>(TeachersByOrgnizationDocument, options);
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
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<ClassesByTeacherQuery, ClassesByTeacherQueryVariables>(ClassesByTeacherDocument, options);
}
export function useClassesByTeacherLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<ClassesByTeacherQuery, ClassesByTeacherQueryVariables>
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<ClassesByTeacherQuery, ClassesByTeacherQueryVariables>(ClassesByTeacherDocument, options);
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
          school_memberships {
            school_id
            status
          }
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
export const ClassStudentsByOrganizationDocument = gql`
  query classStudentsByOrganization($organization_id: ID!) {
    organization(organization_id: $organization_id) {
      classes {
        class_id
        status
        students {
          user_id
          full_name
        }
      }
    }
  }
`;

/**
 * __useClassStudentsByOrganizationQuery__
 *
 * To run a query within a React component, call `useClassStudentsByOrganizationQuery` and pass it any options that fit your needs.
 * When your component renders, `useClassStudentsByOrganizationQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useClassStudentsByOrganizationQuery({
 *   variables: {
 *      organization_id: // value for 'organization_id'
 *   },
 * });
 */
export function useClassStudentsByOrganizationQuery(
  baseOptions: Apollo.QueryHookOptions<ClassStudentsByOrganizationQuery, ClassStudentsByOrganizationQueryVariables>
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<ClassStudentsByOrganizationQuery, ClassStudentsByOrganizationQueryVariables>(
    ClassStudentsByOrganizationDocument,
    options
  );
}
export function useClassStudentsByOrganizationLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<ClassStudentsByOrganizationQuery, ClassStudentsByOrganizationQueryVariables>
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<ClassStudentsByOrganizationQuery, ClassStudentsByOrganizationQueryVariables>(
    ClassStudentsByOrganizationDocument,
    options
  );
}
export type ClassStudentsByOrganizationQueryHookResult = ReturnType<typeof useClassStudentsByOrganizationQuery>;
export type ClassStudentsByOrganizationLazyQueryHookResult = ReturnType<typeof useClassStudentsByOrganizationLazyQuery>;
export type ClassStudentsByOrganizationQueryResult = Apollo.QueryResult<
  ClassStudentsByOrganizationQuery,
  ClassStudentsByOrganizationQueryVariables
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
export const SchoolsByOrganizationDocument = gql`
  query schoolsByOrganization($organization_id: ID!) {
    organization(organization_id: $organization_id) {
      classes {
        class_id
        class_name
        status
        schools {
          school_id
          status
        }
      }
      schools {
        school_id
        school_name
        status
        classes {
          ...classIdNameStatus
        }
      }
    }
  }
  ${ClassIdNameStatusFragmentDoc}
`;

/**
 * __useSchoolsByOrganizationQuery__
 *
 * To run a query within a React component, call `useSchoolsByOrganizationQuery` and pass it any options that fit your needs.
 * When your component renders, `useSchoolsByOrganizationQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useSchoolsByOrganizationQuery({
 *   variables: {
 *      organization_id: // value for 'organization_id'
 *   },
 * });
 */
export function useSchoolsByOrganizationQuery(
  baseOptions: Apollo.QueryHookOptions<SchoolsByOrganizationQuery, SchoolsByOrganizationQueryVariables>
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<SchoolsByOrganizationQuery, SchoolsByOrganizationQueryVariables>(SchoolsByOrganizationDocument, options);
}
export function useSchoolsByOrganizationLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<SchoolsByOrganizationQuery, SchoolsByOrganizationQueryVariables>
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<SchoolsByOrganizationQuery, SchoolsByOrganizationQueryVariables>(SchoolsByOrganizationDocument, options);
}
export type SchoolsByOrganizationQueryHookResult = ReturnType<typeof useSchoolsByOrganizationQuery>;
export type SchoolsByOrganizationLazyQueryHookResult = ReturnType<typeof useSchoolsByOrganizationLazyQuery>;
export type SchoolsByOrganizationQueryResult = Apollo.QueryResult<SchoolsByOrganizationQuery, SchoolsByOrganizationQueryVariables>;
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
export const QeuryMeDocument = gql`
  query qeuryMe($organization_id: ID!) {
    me {
      ...userIdName
      membership(organization_id: $organization_id) {
        roles {
          permissions {
            permission_name
          }
        }
      }
    }
  }
  ${UserIdNameFragmentDoc}
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
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<QeuryMeQuery, QeuryMeQueryVariables>(QeuryMeDocument, options);
}
export function useQeuryMeLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<QeuryMeQuery, QeuryMeQueryVariables>) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<QeuryMeQuery, QeuryMeQueryVariables>(QeuryMeDocument, options);
}
export type QeuryMeQueryHookResult = ReturnType<typeof useQeuryMeQuery>;
export type QeuryMeLazyQueryHookResult = ReturnType<typeof useQeuryMeLazyQuery>;
export type QeuryMeQueryResult = Apollo.QueryResult<QeuryMeQuery, QeuryMeQueryVariables>;
export const MyPermissionsAndClassesTeachingQueryDocument = gql`
  query myPermissionsAndClassesTeachingQuery($organization_id: ID!) {
    me {
      user_id
      membership(organization_id: $organization_id) {
        organization_id
        schoolMemberships {
          school_id
          status
        }
        classesTeaching {
          class_id
          status
        }
      }
    }
  }
`;

/**
 * __useMyPermissionsAndClassesTeachingQueryQuery__
 *
 * To run a query within a React component, call `useMyPermissionsAndClassesTeachingQueryQuery` and pass it any options that fit your needs.
 * When your component renders, `useMyPermissionsAndClassesTeachingQueryQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useMyPermissionsAndClassesTeachingQueryQuery({
 *   variables: {
 *      organization_id: // value for 'organization_id'
 *   },
 * });
 */
export function useMyPermissionsAndClassesTeachingQueryQuery(
  baseOptions: Apollo.QueryHookOptions<MyPermissionsAndClassesTeachingQueryQuery, MyPermissionsAndClassesTeachingQueryQueryVariables>
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<MyPermissionsAndClassesTeachingQueryQuery, MyPermissionsAndClassesTeachingQueryQueryVariables>(
    MyPermissionsAndClassesTeachingQueryDocument,
    options
  );
}
export function useMyPermissionsAndClassesTeachingQueryLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<MyPermissionsAndClassesTeachingQueryQuery, MyPermissionsAndClassesTeachingQueryQueryVariables>
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<MyPermissionsAndClassesTeachingQueryQuery, MyPermissionsAndClassesTeachingQueryQueryVariables>(
    MyPermissionsAndClassesTeachingQueryDocument,
    options
  );
}
export type MyPermissionsAndClassesTeachingQueryQueryHookResult = ReturnType<typeof useMyPermissionsAndClassesTeachingQueryQuery>;
export type MyPermissionsAndClassesTeachingQueryLazyQueryHookResult = ReturnType<typeof useMyPermissionsAndClassesTeachingQueryLazyQuery>;
export type MyPermissionsAndClassesTeachingQueryQueryResult = Apollo.QueryResult<
  MyPermissionsAndClassesTeachingQueryQuery,
  MyPermissionsAndClassesTeachingQueryQueryVariables
>;
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
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<OrganizationsQuery, OrganizationsQueryVariables>(OrganizationsDocument, options);
}
export function useOrganizationsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<OrganizationsQuery, OrganizationsQueryVariables>) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<OrganizationsQuery, OrganizationsQueryVariables>(OrganizationsDocument, options);
}
export type OrganizationsQueryHookResult = ReturnType<typeof useOrganizationsQuery>;
export type OrganizationsLazyQueryHookResult = ReturnType<typeof useOrganizationsLazyQuery>;
export type OrganizationsQueryResult = Apollo.QueryResult<OrganizationsQuery, OrganizationsQueryVariables>;
export const GetSchoolTeacherDocument = gql`
  query getSchoolTeacher($user_id: ID!) {
    user(user_id: $user_id) {
      school_memberships {
        school {
          status
          school_id
          school_name
          organization {
            organization_id
          }
          classes {
            status
            teachers {
              ...userIdName
            }
          }
        }
      }
    }
  }
  ${UserIdNameFragmentDoc}
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
export function useGetSchoolTeacherQuery(baseOptions: Apollo.QueryHookOptions<GetSchoolTeacherQuery, GetSchoolTeacherQueryVariables>) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<GetSchoolTeacherQuery, GetSchoolTeacherQueryVariables>(GetSchoolTeacherDocument, options);
}
export function useGetSchoolTeacherLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<GetSchoolTeacherQuery, GetSchoolTeacherQueryVariables>
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<GetSchoolTeacherQuery, GetSchoolTeacherQueryVariables>(GetSchoolTeacherDocument, options);
}
export type GetSchoolTeacherQueryHookResult = ReturnType<typeof useGetSchoolTeacherQuery>;
export type GetSchoolTeacherLazyQueryHookResult = ReturnType<typeof useGetSchoolTeacherLazyQuery>;
export type GetSchoolTeacherQueryResult = Apollo.QueryResult<GetSchoolTeacherQuery, GetSchoolTeacherQueryVariables>;
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
export function useMySchoolIDsQuery(baseOptions: Apollo.QueryHookOptions<MySchoolIDsQuery, MySchoolIDsQueryVariables>) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<MySchoolIDsQuery, MySchoolIDsQueryVariables>(MySchoolIDsDocument, options);
}
export function useMySchoolIDsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<MySchoolIDsQuery, MySchoolIDsQueryVariables>) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<MySchoolIDsQuery, MySchoolIDsQueryVariables>(MySchoolIDsDocument, options);
}
export type MySchoolIDsQueryHookResult = ReturnType<typeof useMySchoolIDsQuery>;
export type MySchoolIDsLazyQueryHookResult = ReturnType<typeof useMySchoolIDsLazyQuery>;
export type MySchoolIDsQueryResult = Apollo.QueryResult<MySchoolIDsQuery, MySchoolIDsQueryVariables>;
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
export function useUserSchoolIDsQuery(baseOptions: Apollo.QueryHookOptions<UserSchoolIDsQuery, UserSchoolIDsQueryVariables>) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<UserSchoolIDsQuery, UserSchoolIDsQueryVariables>(UserSchoolIDsDocument, options);
}
export function useUserSchoolIDsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<UserSchoolIDsQuery, UserSchoolIDsQueryVariables>) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<UserSchoolIDsQuery, UserSchoolIDsQueryVariables>(UserSchoolIDsDocument, options);
}
export type UserSchoolIDsQueryHookResult = ReturnType<typeof useUserSchoolIDsQuery>;
export type UserSchoolIDsLazyQueryHookResult = ReturnType<typeof useUserSchoolIDsLazyQuery>;
export type UserSchoolIDsQueryResult = Apollo.QueryResult<UserSchoolIDsQuery, UserSchoolIDsQueryVariables>;
export const ParticipantsBySchoolDocument = gql`
  query participantsBySchool($school_id: ID!) {
    school(school_id: $school_id) {
      classes {
        status
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
  baseOptions: Apollo.QueryHookOptions<ParticipantsBySchoolQuery, ParticipantsBySchoolQueryVariables>
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<ParticipantsBySchoolQuery, ParticipantsBySchoolQueryVariables>(ParticipantsBySchoolDocument, options);
}
export function useParticipantsBySchoolLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<ParticipantsBySchoolQuery, ParticipantsBySchoolQueryVariables>
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<ParticipantsBySchoolQuery, ParticipantsBySchoolQueryVariables>(ParticipantsBySchoolDocument, options);
}
export type ParticipantsBySchoolQueryHookResult = ReturnType<typeof useParticipantsBySchoolQuery>;
export type ParticipantsBySchoolLazyQueryHookResult = ReturnType<typeof useParticipantsBySchoolLazyQuery>;
export type ParticipantsBySchoolQueryResult = Apollo.QueryResult<ParticipantsBySchoolQuery, ParticipantsBySchoolQueryVariables>;
export const ParticipantsByOrganizationDocument = gql`
  query participantsByOrganization($organization_id: ID!) {
    organization(organization_id: $organization_id) {
      status
      classes {
        teachers {
          user_id
          user_name
          school_memberships {
            school_id
            school {
              organization {
                organization_id
              }
            }
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
  baseOptions: Apollo.QueryHookOptions<ParticipantsByOrganizationQuery, ParticipantsByOrganizationQueryVariables>
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<ParticipantsByOrganizationQuery, ParticipantsByOrganizationQueryVariables>(
    ParticipantsByOrganizationDocument,
    options
  );
}
export function useParticipantsByOrganizationLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<ParticipantsByOrganizationQuery, ParticipantsByOrganizationQueryVariables>
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<ParticipantsByOrganizationQuery, ParticipantsByOrganizationQueryVariables>(
    ParticipantsByOrganizationDocument,
    options
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
export const TeacherListBySchoolIdDocument = gql`
  query teacherListBySchoolId($school_id: ID!) {
    school(school_id: $school_id) {
      classes {
        status
        class_id
        teachers {
          user_id
          user_name
        }
      }
    }
  }
`;

/**
 * __useTeacherListBySchoolIdQuery__
 *
 * To run a query within a React component, call `useTeacherListBySchoolIdQuery` and pass it any options that fit your needs.
 * When your component renders, `useTeacherListBySchoolIdQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useTeacherListBySchoolIdQuery({
 *   variables: {
 *      school_id: // value for 'school_id'
 *   },
 * });
 */
export function useTeacherListBySchoolIdQuery(
  baseOptions: Apollo.QueryHookOptions<TeacherListBySchoolIdQuery, TeacherListBySchoolIdQueryVariables>
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<TeacherListBySchoolIdQuery, TeacherListBySchoolIdQueryVariables>(TeacherListBySchoolIdDocument, options);
}
export function useTeacherListBySchoolIdLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<TeacherListBySchoolIdQuery, TeacherListBySchoolIdQueryVariables>
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<TeacherListBySchoolIdQuery, TeacherListBySchoolIdQueryVariables>(TeacherListBySchoolIdDocument, options);
}
export type TeacherListBySchoolIdQueryHookResult = ReturnType<typeof useTeacherListBySchoolIdQuery>;
export type TeacherListBySchoolIdLazyQueryHookResult = ReturnType<typeof useTeacherListBySchoolIdLazyQuery>;
export type TeacherListBySchoolIdQueryResult = Apollo.QueryResult<TeacherListBySchoolIdQuery, TeacherListBySchoolIdQueryVariables>;
export const NotParticipantsByOrganizationDocument = gql`
  query notParticipantsByOrganization($organization_id: ID!) {
    organization(organization_id: $organization_id) {
      classes {
        status
        schools {
          school_id
          school_name
        }
        teachers {
          user_id
          user_name
          school_memberships {
            school_id
            school {
              school_name
              organization {
                organization_id
              }
            }
          }
        }
      }
    }
  }
`;

/**
 * __useNotParticipantsByOrganizationQuery__
 *
 * To run a query within a React component, call `useNotParticipantsByOrganizationQuery` and pass it any options that fit your needs.
 * When your component renders, `useNotParticipantsByOrganizationQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useNotParticipantsByOrganizationQuery({
 *   variables: {
 *      organization_id: // value for 'organization_id'
 *   },
 * });
 */
export function useNotParticipantsByOrganizationQuery(
  baseOptions: Apollo.QueryHookOptions<NotParticipantsByOrganizationQuery, NotParticipantsByOrganizationQueryVariables>
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<NotParticipantsByOrganizationQuery, NotParticipantsByOrganizationQueryVariables>(
    NotParticipantsByOrganizationDocument,
    options
  );
}
export function useNotParticipantsByOrganizationLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<NotParticipantsByOrganizationQuery, NotParticipantsByOrganizationQueryVariables>
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<NotParticipantsByOrganizationQuery, NotParticipantsByOrganizationQueryVariables>(
    NotParticipantsByOrganizationDocument,
    options
  );
}
export type NotParticipantsByOrganizationQueryHookResult = ReturnType<typeof useNotParticipantsByOrganizationQuery>;
export type NotParticipantsByOrganizationLazyQueryHookResult = ReturnType<typeof useNotParticipantsByOrganizationLazyQuery>;
export type NotParticipantsByOrganizationQueryResult = Apollo.QueryResult<
  NotParticipantsByOrganizationQuery,
  NotParticipantsByOrganizationQueryVariables
>;
export const SchoolAndTeacherByOrgDocument = gql`
  query schoolAndTeacherByOrg($organization_id: ID!) {
    organization(organization_id: $organization_id) {
      schools {
        school_id
        school_name
        status
        classes {
          status
          class_id
          class_name
          teachers {
            user_id
            user_name
          }
        }
      }
    }
  }
`;

/**
 * __useSchoolAndTeacherByOrgQuery__
 *
 * To run a query within a React component, call `useSchoolAndTeacherByOrgQuery` and pass it any options that fit your needs.
 * When your component renders, `useSchoolAndTeacherByOrgQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useSchoolAndTeacherByOrgQuery({
 *   variables: {
 *      organization_id: // value for 'organization_id'
 *   },
 * });
 */
export function useSchoolAndTeacherByOrgQuery(
  baseOptions: Apollo.QueryHookOptions<SchoolAndTeacherByOrgQuery, SchoolAndTeacherByOrgQueryVariables>
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<SchoolAndTeacherByOrgQuery, SchoolAndTeacherByOrgQueryVariables>(SchoolAndTeacherByOrgDocument, options);
}
export function useSchoolAndTeacherByOrgLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<SchoolAndTeacherByOrgQuery, SchoolAndTeacherByOrgQueryVariables>
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<SchoolAndTeacherByOrgQuery, SchoolAndTeacherByOrgQueryVariables>(SchoolAndTeacherByOrgDocument, options);
}
export type SchoolAndTeacherByOrgQueryHookResult = ReturnType<typeof useSchoolAndTeacherByOrgQuery>;
export type SchoolAndTeacherByOrgLazyQueryHookResult = ReturnType<typeof useSchoolAndTeacherByOrgLazyQuery>;
export type SchoolAndTeacherByOrgQueryResult = Apollo.QueryResult<SchoolAndTeacherByOrgQuery, SchoolAndTeacherByOrgQueryVariables>;
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
  query getProgramsAndSubjects($organization_id: UUID!, $count: PageSize!, $cursor: String!) {
    programsConnection(
      filter: {
        AND: [
          { OR: [{ organizationId: { operator: eq, value: $organization_id } }, { system: { operator: eq, value: true } }] }
          { status: { operator: eq, value: "active" } }
        ]
      }
      directionArgs: { count: $count, cursor: $cursor }
      direction: FORWARD
    ) {
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
 *      organization_id: // value for 'organization_id'
 *      count: // value for 'count'
 *      cursor: // value for 'cursor'
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
  query getClassFilterList($filter: ClassFilter, $direction: ConnectionDirection!, $directionArgs: ConnectionsDirectionArgs) {
    classesConnection(filter: $filter, direction: $direction, directionArgs: $directionArgs) {
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
  query getUser($filter: UserFilter, $direction: ConnectionDirection!) {
    usersConnection(direction: $direction, filter: $filter) {
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
