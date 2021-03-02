export type Maybe<T> = T | null;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  Date: any;
  /** The `Upload` scalar type represents a file upload. */
  Upload: any;
};

export type UserConnection = {
  __typename?: "UserConnection";
  total?: Maybe<Scalars["Int"]>;
  edges: Array<User>;
  pageInfo: PageInfo;
};

export type OrganizationConnection = {
  __typename?: "OrganizationConnection";
  total?: Maybe<Scalars["Int"]>;
  edges: Array<Maybe<Organization>>;
  pageInfo: PageInfo;
};

export type RoleConnection = {
  __typename?: "RoleConnection";
  total?: Maybe<Scalars["Int"]>;
  edges: Array<Maybe<Role>>;
  pageInfo: PageInfo;
};

export type ClassConnection = {
  __typename?: "ClassConnection";
  total?: Maybe<Scalars["Int"]>;
  edges: Array<Maybe<Class>>;
  pageInfo: PageInfo;
};

export type PermissionConnection = {
  __typename?: "PermissionConnection";
  total?: Maybe<Scalars["Int"]>;
  edges: Array<Maybe<Permission>>;
  pageInfo: PageInfo;
};

export type PageInfo = {
  __typename?: "PageInfo";
  hasNextPage: Scalars["Boolean"];
  endCursor: Scalars["String"];
  startCursor: Scalars["String"];
  hasPreviousPage: Scalars["Boolean"];
};

export type Query = {
  __typename?: "Query";
  me?: Maybe<User>;
  user?: Maybe<User>;
  users?: Maybe<Array<Maybe<User>>>;
  users_v1: UserConnection;
  my_users?: Maybe<Array<User>>;
  before?: Maybe<Scalars["String"]>;
  organization?: Maybe<Organization>;
  organizations?: Maybe<Array<Maybe<Organization>>>;
  organizations_v1: OrganizationConnection;
  role?: Maybe<Role>;
  roles?: Maybe<Array<Maybe<Role>>>;
  roles_v1: RoleConnection;
  permissions: PermissionConnection;
  classes?: Maybe<Array<Maybe<Class>>>;
  classes_v1: ClassConnection;
  class?: Maybe<Class>;
  school?: Maybe<School>;
  age_range?: Maybe<AgeRange>;
};

export type QueryUserArgs = {
  user_id: Scalars["ID"];
};

export type QueryUsers_V1Args = {
  after?: Maybe<Scalars["String"]>;
  before?: Maybe<Scalars["String"]>;
  first?: Maybe<Scalars["Int"]>;
  last?: Maybe<Scalars["Int"]>;
};

export type QueryOrganizationArgs = {
  organization_id: Scalars["ID"];
};

export type QueryOrganizationsArgs = {
  organization_ids?: Maybe<Array<Scalars["ID"]>>;
};

export type QueryOrganizations_V1Args = {
  organization_ids?: Maybe<Array<Scalars["ID"]>>;
  after?: Maybe<Scalars["String"]>;
  before?: Maybe<Scalars["String"]>;
  first?: Maybe<Scalars["Int"]>;
  last?: Maybe<Scalars["Int"]>;
};

export type QueryRoleArgs = {
  role_id: Scalars["ID"];
};

export type QueryRoles_V1Args = {
  after?: Maybe<Scalars["String"]>;
  before?: Maybe<Scalars["String"]>;
  first?: Maybe<Scalars["Int"]>;
  last?: Maybe<Scalars["Int"]>;
};

export type QueryPermissionsArgs = {
  after?: Maybe<Scalars["String"]>;
  before?: Maybe<Scalars["String"]>;
  first?: Maybe<Scalars["Int"]>;
  last?: Maybe<Scalars["Int"]>;
};

export type QueryClasses_V1Args = {
  after?: Maybe<Scalars["String"]>;
  before?: Maybe<Scalars["String"]>;
  first?: Maybe<Scalars["Int"]>;
  last?: Maybe<Scalars["Int"]>;
};

export type QueryClassArgs = {
  class_id: Scalars["ID"];
};

export type QuerySchoolArgs = {
  school_id: Scalars["ID"];
};

export type QueryAge_RangeArgs = {
  id: Scalars["ID"];
};

export type Mutation = {
  __typename?: "Mutation";
  me?: Maybe<User>;
  user?: Maybe<User>;
  /** @deprecated Use the inviteUser() method */
  newUser?: Maybe<User>;
  switch_user?: Maybe<User>;
  organization?: Maybe<Organization>;
  role?: Maybe<Role>;
  roles?: Maybe<Array<Maybe<Role>>>;
  classes?: Maybe<Array<Maybe<Class>>>;
  class?: Maybe<Class>;
  school?: Maybe<School>;
  age_range?: Maybe<AgeRange>;
  createOrUpateSystemEntities?: Maybe<Scalars["Boolean"]>;
};

export type MutationUserArgs = {
  user_id: Scalars["ID"];
  given_name?: Maybe<Scalars["String"]>;
  family_name?: Maybe<Scalars["String"]>;
  email?: Maybe<Scalars["String"]>;
  phone?: Maybe<Scalars["String"]>;
  avatar?: Maybe<Scalars["String"]>;
  date_of_birth?: Maybe<Scalars["String"]>;
  username?: Maybe<Scalars["String"]>;
};

export type MutationNewUserArgs = {
  given_name?: Maybe<Scalars["String"]>;
  family_name?: Maybe<Scalars["String"]>;
  email?: Maybe<Scalars["String"]>;
  phone?: Maybe<Scalars["String"]>;
  avatar?: Maybe<Scalars["String"]>;
  date_of_birth?: Maybe<Scalars["String"]>;
  username?: Maybe<Scalars["String"]>;
};

export type MutationSwitch_UserArgs = {
  user_id: Scalars["ID"];
};

export type MutationOrganizationArgs = {
  organization_id: Scalars["ID"];
  organization_name?: Maybe<Scalars["String"]>;
  address1?: Maybe<Scalars["String"]>;
  address2?: Maybe<Scalars["String"]>;
  phone?: Maybe<Scalars["String"]>;
  shortCode?: Maybe<Scalars["String"]>;
};

export type MutationRoleArgs = {
  role_id: Scalars["ID"];
};

export type MutationClassArgs = {
  class_id: Scalars["ID"];
};

export type MutationSchoolArgs = {
  school_id: Scalars["ID"];
};

export type MutationAge_RangeArgs = {
  id: Scalars["ID"];
};

export type MutationCreateOrUpateSystemEntitiesArgs = {
  _?: Maybe<Scalars["Int"]>;
};

export type User = {
  __typename?: "User";
  user_id: Scalars["ID"];
  /** @deprecated Use `full_name`. */
  user_name?: Maybe<Scalars["String"]>;
  full_name?: Maybe<Scalars["String"]>;
  given_name?: Maybe<Scalars["String"]>;
  family_name?: Maybe<Scalars["String"]>;
  email?: Maybe<Scalars["String"]>;
  phone?: Maybe<Scalars["String"]>;
  date_of_birth?: Maybe<Scalars["String"]>;
  avatar?: Maybe<Scalars["String"]>;
  username?: Maybe<Scalars["String"]>;
  /**
   * 'my_organization' is the Organization that this user has created
   * @deprecated Use `organization_ownerships`.
   */
  my_organization?: Maybe<Organization>;
  organization_ownerships?: Maybe<Array<Maybe<OrganizationOwnership>>>;
  memberships?: Maybe<Array<Maybe<OrganizationMembership>>>;
  membership?: Maybe<OrganizationMembership>;
  school_memberships?: Maybe<Array<Maybe<SchoolMembership>>>;
  school_membership?: Maybe<SchoolMembership>;
  classesTeaching?: Maybe<Array<Maybe<Class>>>;
  classesStudying?: Maybe<Array<Maybe<Class>>>;
  organizationsWithPermission?: Maybe<Array<Maybe<OrganizationMembership>>>;
  schoolsWithPermission?: Maybe<Array<Maybe<SchoolMembership>>>;
  set?: Maybe<User>;
  createOrganization?: Maybe<Organization>;
  merge?: Maybe<User>;
  addOrganization?: Maybe<OrganizationMembership>;
  addSchool?: Maybe<OrganizationMembership>;
};

export type UserMembershipArgs = {
  organization_id: Scalars["ID"];
};

export type UserSchool_MembershipArgs = {
  school_id: Scalars["ID"];
};

export type UserOrganizationsWithPermissionArgs = {
  permission_name: Scalars["String"];
};

export type UserSchoolsWithPermissionArgs = {
  permission_name: Scalars["String"];
};

export type UserSetArgs = {
  given_name?: Maybe<Scalars["String"]>;
  family_name?: Maybe<Scalars["String"]>;
  email?: Maybe<Scalars["String"]>;
  phone?: Maybe<Scalars["String"]>;
  avatar?: Maybe<Scalars["String"]>;
};

export type UserCreateOrganizationArgs = {
  organization_name?: Maybe<Scalars["String"]>;
  email?: Maybe<Scalars["String"]>;
  address1?: Maybe<Scalars["String"]>;
  address2?: Maybe<Scalars["String"]>;
  phone?: Maybe<Scalars["String"]>;
  shortCode?: Maybe<Scalars["String"]>;
};

export type UserMergeArgs = {
  other_id?: Maybe<Scalars["String"]>;
};

export type UserAddOrganizationArgs = {
  organization_id: Scalars["ID"];
};

export type UserAddSchoolArgs = {
  school_id: Scalars["ID"];
};

export type Organization = {
  __typename?: "Organization";
  organization_id: Scalars["ID"];
  organization_name?: Maybe<Scalars["String"]>;
  address1?: Maybe<Scalars["String"]>;
  address2?: Maybe<Scalars["String"]>;
  phone?: Maybe<Scalars["String"]>;
  shortCode?: Maybe<Scalars["String"]>;
  status?: Maybe<Status>;
  /**
   * 'owner' is the User that created this Organization
   * @deprecated Use `organization_ownerships`.
   */
  owner?: Maybe<User>;
  primary_contact?: Maybe<User>;
  roles?: Maybe<Array<Maybe<Role>>>;
  memberships?: Maybe<Array<Maybe<OrganizationMembership>>>;
  teachers?: Maybe<Array<Maybe<OrganizationMembership>>>;
  students?: Maybe<Array<Maybe<OrganizationMembership>>>;
  schools?: Maybe<Array<Maybe<School>>>;
  classes?: Maybe<Array<Maybe<Class>>>;
  ageRanges?: Maybe<Array<AgeRange>>;
  membersWithPermission?: Maybe<Array<Maybe<OrganizationMembership>>>;
  findMembers?: Maybe<Array<Maybe<OrganizationMembership>>>;
  set?: Maybe<Organization>;
  setPrimaryContact?: Maybe<User>;
  addUser?: Maybe<OrganizationMembership>;
  inviteUser?: Maybe<MembershipUpdate>;
  editMembership?: Maybe<MembershipUpdate>;
  createRole?: Maybe<Role>;
  createSchool?: Maybe<School>;
  createClass?: Maybe<Class>;
  createOrUpdateAgeRanges?: Maybe<Array<Maybe<AgeRange>>>;
  delete?: Maybe<Scalars["Boolean"]>;
};

export type OrganizationMembersWithPermissionArgs = {
  permission_name: Scalars["String"];
  search_query?: Maybe<Scalars["String"]>;
};

export type OrganizationFindMembersArgs = {
  search_query: Scalars["String"];
};

export type OrganizationSetArgs = {
  organization_name?: Maybe<Scalars["String"]>;
  address1?: Maybe<Scalars["String"]>;
  address2?: Maybe<Scalars["String"]>;
  phone?: Maybe<Scalars["String"]>;
  shortCode?: Maybe<Scalars["String"]>;
};

export type OrganizationSetPrimaryContactArgs = {
  user_id: Scalars["ID"];
};

export type OrganizationAddUserArgs = {
  user_id: Scalars["ID"];
};

export type OrganizationInviteUserArgs = {
  email?: Maybe<Scalars["String"]>;
  phone?: Maybe<Scalars["String"]>;
  given_name?: Maybe<Scalars["String"]>;
  family_name?: Maybe<Scalars["String"]>;
  date_of_birth?: Maybe<Scalars["String"]>;
  username?: Maybe<Scalars["String"]>;
  organization_role_ids?: Maybe<Array<Scalars["ID"]>>;
  school_ids?: Maybe<Array<Scalars["ID"]>>;
  school_role_ids?: Maybe<Array<Scalars["ID"]>>;
};

export type OrganizationEditMembershipArgs = {
  email?: Maybe<Scalars["String"]>;
  phone?: Maybe<Scalars["String"]>;
  given_name?: Maybe<Scalars["String"]>;
  family_name?: Maybe<Scalars["String"]>;
  date_of_birth?: Maybe<Scalars["String"]>;
  username?: Maybe<Scalars["String"]>;
  organization_role_ids?: Maybe<Array<Scalars["ID"]>>;
  school_ids?: Maybe<Array<Scalars["ID"]>>;
  school_role_ids?: Maybe<Array<Scalars["ID"]>>;
};

export type OrganizationCreateRoleArgs = {
  role_name: Scalars["String"];
  role_description: Scalars["String"];
};

export type OrganizationCreateSchoolArgs = {
  school_name?: Maybe<Scalars["String"]>;
};

export type OrganizationCreateClassArgs = {
  class_name?: Maybe<Scalars["String"]>;
};

export type OrganizationCreateOrUpdateAgeRangesArgs = {
  age_ranges: Array<Maybe<AgeRangeDetail>>;
};

export type OrganizationDeleteArgs = {
  _?: Maybe<Scalars["Int"]>;
};

export type MembershipUpdate = {
  __typename?: "MembershipUpdate";
  user?: Maybe<User>;
  membership?: Maybe<OrganizationMembership>;
  schoolMemberships?: Maybe<Array<Maybe<SchoolMembership>>>;
};

export type OrganizationMembership = {
  __typename?: "OrganizationMembership";
  user_id: Scalars["ID"];
  organization_id: Scalars["ID"];
  join_timestamp?: Maybe<Scalars["Date"]>;
  status?: Maybe<Status>;
  organization?: Maybe<Organization>;
  user?: Maybe<User>;
  roles?: Maybe<Array<Maybe<Role>>>;
  classes?: Maybe<Array<Maybe<Class>>>;
  schoolMemberships?: Maybe<Array<Maybe<SchoolMembership>>>;
  checkAllowed?: Maybe<Scalars["Boolean"]>;
  classesTeaching?: Maybe<Array<Maybe<Class>>>;
  addRole?: Maybe<Role>;
  addRoles?: Maybe<Array<Maybe<Role>>>;
  removeRole?: Maybe<OrganizationMembership>;
  leave?: Maybe<Scalars["Boolean"]>;
};

export type OrganizationMembershipSchoolMembershipsArgs = {
  permission_name?: Maybe<Scalars["String"]>;
};

export type OrganizationMembershipCheckAllowedArgs = {
  permission_name: Scalars["ID"];
};

export type OrganizationMembershipAddRoleArgs = {
  role_id: Scalars["ID"];
};

export type OrganizationMembershipAddRolesArgs = {
  role_ids: Array<Scalars["ID"]>;
};

export type OrganizationMembershipRemoveRoleArgs = {
  role_id: Scalars["ID"];
};

export type OrganizationMembershipLeaveArgs = {
  _?: Maybe<Scalars["Int"]>;
};

export type OrganizationOwnership = {
  __typename?: "OrganizationOwnership";
  user_id: Scalars["ID"];
  organization_id: Scalars["ID"];
  status?: Maybe<Status>;
  organization?: Maybe<Organization>;
  user?: Maybe<User>;
};

export type Role = {
  __typename?: "Role";
  role_id: Scalars["ID"];
  role_name?: Maybe<Scalars["String"]>;
  role_description: Scalars["String"];
  status: Status;
  system_role: Scalars["Boolean"];
  organization?: Maybe<Organization>;
  memberships?: Maybe<Array<Maybe<OrganizationMembership>>>;
  permissions?: Maybe<Array<Maybe<Permission>>>;
  permission?: Maybe<Permission>;
  set?: Maybe<Role>;
  grant?: Maybe<Permission>;
  revoke?: Maybe<Scalars["Boolean"]>;
  edit_permissions?: Maybe<Array<Maybe<Permission>>>;
  deny?: Maybe<Permission>;
  delete_role?: Maybe<Scalars["Boolean"]>;
};

export type RolePermissionArgs = {
  permission_name: Scalars["String"];
};

export type RoleSetArgs = {
  role_name?: Maybe<Scalars["String"]>;
  role_description?: Maybe<Scalars["String"]>;
  system_role?: Maybe<Scalars["Boolean"]>;
};

export type RoleGrantArgs = {
  permission_name: Scalars["String"];
};

export type RoleRevokeArgs = {
  permission_name: Scalars["String"];
};

export type RoleEdit_PermissionsArgs = {
  permission_names?: Maybe<Array<Scalars["String"]>>;
};

export type RoleDenyArgs = {
  permission_name: Scalars["String"];
};

export type RoleDelete_RoleArgs = {
  _?: Maybe<Scalars["Int"]>;
};

export type Permission = {
  __typename?: "Permission";
  permission_id?: Maybe<Scalars["ID"]>;
  permission_name: Scalars["ID"];
  permission_category?: Maybe<Scalars["String"]>;
  permission_group?: Maybe<Scalars["String"]>;
  permission_level?: Maybe<Scalars["String"]>;
  permission_description?: Maybe<Scalars["String"]>;
  allow?: Maybe<Scalars["Boolean"]>;
};

export type School = {
  __typename?: "School";
  school_id: Scalars["ID"];
  school_name?: Maybe<Scalars["String"]>;
  status?: Maybe<Status>;
  organization?: Maybe<Organization>;
  memberships?: Maybe<Array<Maybe<SchoolMembership>>>;
  membership?: Maybe<SchoolMembership>;
  classes?: Maybe<Array<Maybe<Class>>>;
  set?: Maybe<School>;
  addUser?: Maybe<SchoolMembership>;
  delete?: Maybe<Scalars["Boolean"]>;
};

export type SchoolMembershipArgs = {
  user_id: Scalars["ID"];
};

export type SchoolSetArgs = {
  school_name?: Maybe<Scalars["String"]>;
};

export type SchoolAddUserArgs = {
  user_id: Scalars["ID"];
};

export type SchoolDeleteArgs = {
  _?: Maybe<Scalars["Int"]>;
};

export type SchoolMembership = {
  __typename?: "SchoolMembership";
  user_id: Scalars["ID"];
  school_id: Scalars["ID"];
  join_timestamp?: Maybe<Scalars["Date"]>;
  status?: Maybe<Status>;
  user?: Maybe<User>;
  school?: Maybe<School>;
  roles?: Maybe<Array<Maybe<Role>>>;
  checkAllowed?: Maybe<Scalars["Boolean"]>;
  addRole?: Maybe<Role>;
  addRoles?: Maybe<Array<Maybe<Role>>>;
  removeRole?: Maybe<SchoolMembership>;
  leave?: Maybe<Scalars["Boolean"]>;
};

export type SchoolMembershipCheckAllowedArgs = {
  permission_name: Scalars["ID"];
};

export type SchoolMembershipAddRoleArgs = {
  role_id: Scalars["ID"];
};

export type SchoolMembershipAddRolesArgs = {
  role_ids: Array<Scalars["ID"]>;
};

export type SchoolMembershipRemoveRoleArgs = {
  role_id: Scalars["ID"];
};

export type SchoolMembershipLeaveArgs = {
  _?: Maybe<Scalars["Int"]>;
};

export type Class = {
  __typename?: "Class";
  class_id: Scalars["ID"];
  class_name?: Maybe<Scalars["String"]>;
  status?: Maybe<Status>;
  organization?: Maybe<Organization>;
  schools?: Maybe<Array<Maybe<School>>>;
  teachers?: Maybe<Array<Maybe<User>>>;
  students?: Maybe<Array<Maybe<User>>>;
  eligibleTeachers?: Maybe<Array<Maybe<User>>>;
  eligibleStudents?: Maybe<Array<Maybe<User>>>;
  set?: Maybe<Class>;
  addTeacher?: Maybe<User>;
  editTeachers?: Maybe<Array<Maybe<User>>>;
  removeTeacher?: Maybe<Scalars["Boolean"]>;
  addStudent?: Maybe<User>;
  editStudents?: Maybe<Array<Maybe<User>>>;
  removeStudent?: Maybe<Scalars["Boolean"]>;
  editSchools?: Maybe<Array<Maybe<School>>>;
  addSchool?: Maybe<School>;
  removeSchool?: Maybe<Scalars["Boolean"]>;
  delete?: Maybe<Scalars["Boolean"]>;
};

export type ClassSetArgs = {
  class_name?: Maybe<Scalars["String"]>;
};

export type ClassAddTeacherArgs = {
  user_id: Scalars["ID"];
};

export type ClassEditTeachersArgs = {
  teacher_ids?: Maybe<Array<Scalars["ID"]>>;
};

export type ClassRemoveTeacherArgs = {
  user_id: Scalars["ID"];
};

export type ClassAddStudentArgs = {
  user_id: Scalars["ID"];
};

export type ClassEditStudentsArgs = {
  student_ids?: Maybe<Array<Scalars["ID"]>>;
};

export type ClassRemoveStudentArgs = {
  user_id: Scalars["ID"];
};

export type ClassEditSchoolsArgs = {
  school_ids?: Maybe<Array<Scalars["ID"]>>;
};

export type ClassAddSchoolArgs = {
  school_id: Scalars["ID"];
};

export type ClassRemoveSchoolArgs = {
  school_id: Scalars["ID"];
};

export type ClassDeleteArgs = {
  _?: Maybe<Scalars["Int"]>;
};

export enum AgeRangeUnit {
  Year = "year",
  Month = "month",
}

export enum Status {
  Active = "active",
  Inactive = "inactive",
}

export type AgeRangeDetail = {
  id?: Maybe<Scalars["ID"]>;
  name?: Maybe<Scalars["String"]>;
  low_value?: Maybe<Scalars["Int"]>;
  high_value?: Maybe<Scalars["Int"]>;
  low_value_unit?: Maybe<AgeRangeUnit>;
  high_value_unit?: Maybe<AgeRangeUnit>;
  system?: Maybe<Scalars["Boolean"]>;
};

export type AgeRange = {
  __typename?: "AgeRange";
  id: Scalars["ID"];
  name: Scalars["String"];
  low_value: Scalars["Int"];
  high_value: Scalars["Int"];
  low_value_unit: AgeRangeUnit;
  high_value_unit: AgeRangeUnit;
  system: Scalars["Boolean"];
  status?: Maybe<Status>;
  delete?: Maybe<Scalars["Boolean"]>;
};

export type AgeRangeDeleteArgs = {
  _?: Maybe<Scalars["Int"]>;
};

export type ScheduleEntry = {
  __typename?: "ScheduleEntry";
  id: Scalars["ID"];
  timestamp?: Maybe<Scalars["Date"]>;
};

export enum CacheControlScope {
  Public = "PUBLIC",
  Private = "PRIVATE",
}
