export type Maybe<T> = T | null;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
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

export type Query = {
  __typename?: "Query";
  me?: Maybe<User>;
  user?: Maybe<User>;
  users?: Maybe<Array<Maybe<User>>>;
  organization?: Maybe<Organization>;
  organizations?: Maybe<Array<Maybe<Organization>>>;
  role?: Maybe<Role>;
  roles?: Maybe<Array<Maybe<Role>>>;
  classes?: Maybe<Array<Maybe<Class>>>;
  class?: Maybe<Class>;
  school?: Maybe<School>;
};

export type QueryUserArgs = {
  user_id: Scalars["ID"];
};

export type QueryOrganizationArgs = {
  organization_id: Scalars["ID"];
};

export type QueryOrganizationsArgs = {
  organization_ids?: Maybe<Array<Scalars["ID"]>>;
};

export type QueryRoleArgs = {
  role_id: Scalars["ID"];
};

export type QueryClassArgs = {
  class_id: Scalars["ID"];
};

export type QuerySchoolArgs = {
  school_id: Scalars["ID"];
};

export type Mutation = {
  __typename?: "Mutation";
  me?: Maybe<User>;
  user?: Maybe<User>;
  newUser?: Maybe<User>;
  organization?: Maybe<Organization>;
  role?: Maybe<Role>;
  roles?: Maybe<Array<Maybe<Role>>>;
  classes?: Maybe<Array<Maybe<Class>>>;
  class?: Maybe<Class>;
  school?: Maybe<School>;
};

export type MutationUserArgs = {
  user_id: Scalars["ID"];
  given_name?: Maybe<Scalars["String"]>;
  family_name?: Maybe<Scalars["String"]>;
  email?: Maybe<Scalars["String"]>;
  avatar?: Maybe<Scalars["String"]>;
};

export type MutationNewUserArgs = {
  given_name?: Maybe<Scalars["String"]>;
  family_name?: Maybe<Scalars["String"]>;
  email?: Maybe<Scalars["String"]>;
  avatar?: Maybe<Scalars["String"]>;
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

export type User = {
  __typename?: "User";
  user_id: Scalars["ID"];
  user_name?: Maybe<Scalars["String"]>;
  given_name?: Maybe<Scalars["String"]>;
  family_name?: Maybe<Scalars["String"]>;
  email?: Maybe<Scalars["String"]>;
  avatar?: Maybe<Scalars["String"]>;
  /** 'my_organization' is the Organization that this user has created */
  my_organization?: Maybe<Organization>;
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
  /** 'owner' is the User that created this Organization */
  owner?: Maybe<User>;
  primary_contact?: Maybe<User>;
  roles?: Maybe<Array<Maybe<Role>>>;
  memberships?: Maybe<Array<Maybe<OrganizationMembership>>>;
  teachers?: Maybe<Array<Maybe<OrganizationMembership>>>;
  students?: Maybe<Array<Maybe<OrganizationMembership>>>;
  schools?: Maybe<Array<Maybe<School>>>;
  classes?: Maybe<Array<Maybe<Class>>>;
  membersWithPermission?: Maybe<Array<Maybe<OrganizationMembership>>>;
  findMembers?: Maybe<Array<Maybe<OrganizationMembership>>>;
  set?: Maybe<Organization>;
  setPrimaryContact?: Maybe<User>;
  addUser?: Maybe<OrganizationMembership>;
  inviteUser?: Maybe<MembershipUpdate>;
  editMembership?: Maybe<MembershipUpdate>;
  createRole?: Maybe<Role>;
  createDefaultRoles?: Maybe<Array<Maybe<Role>>>;
  resetDefaultRolesPermissions?: Maybe<Array<Maybe<Role>>>;
  createSchool?: Maybe<School>;
  createClass?: Maybe<Class>;
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
  email: Scalars["String"];
  given_name?: Maybe<Scalars["String"]>;
  family_name?: Maybe<Scalars["String"]>;
  organization_role_ids?: Maybe<Array<Scalars["ID"]>>;
  school_ids?: Maybe<Array<Scalars["ID"]>>;
  school_role_ids?: Maybe<Array<Scalars["ID"]>>;
};

export type OrganizationEditMembershipArgs = {
  email: Scalars["String"];
  given_name?: Maybe<Scalars["String"]>;
  family_name?: Maybe<Scalars["String"]>;
  organization_role_ids?: Maybe<Array<Scalars["ID"]>>;
  school_ids?: Maybe<Array<Scalars["ID"]>>;
  school_role_ids?: Maybe<Array<Scalars["ID"]>>;
};

export type OrganizationCreateRoleArgs = {
  role_name?: Maybe<Scalars["String"]>;
};

export type OrganizationCreateDefaultRolesArgs = {
  _?: Maybe<Scalars["Int"]>;
};

export type OrganizationResetDefaultRolesPermissionsArgs = {
  _?: Maybe<Scalars["Int"]>;
};

export type OrganizationCreateSchoolArgs = {
  school_name?: Maybe<Scalars["String"]>;
};

export type OrganizationCreateClassArgs = {
  class_name?: Maybe<Scalars["String"]>;
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
  organization?: Maybe<Organization>;
  user?: Maybe<User>;
  roles?: Maybe<Array<Maybe<Role>>>;
  schoolMemberships?: Maybe<Array<Maybe<SchoolMembership>>>;
  checkAllowed?: Maybe<Scalars["Boolean"]>;
  addRole?: Maybe<Role>;
  addRoles?: Maybe<Array<Maybe<Role>>>;
  removeRole?: Maybe<OrganizationMembership>;
  leave?: Maybe<Scalars["Boolean"]>;
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

export type Role = {
  __typename?: "Role";
  role_id: Scalars["ID"];
  role_name?: Maybe<Scalars["String"]>;
  organization?: Maybe<Organization>;
  memberships?: Maybe<Array<Maybe<OrganizationMembership>>>;
  permissions?: Maybe<Array<Maybe<Permission>>>;
  permission?: Maybe<Permission>;
  set?: Maybe<Role>;
  grant?: Maybe<Permission>;
  revoke?: Maybe<Scalars["Boolean"]>;
  deny?: Maybe<Permission>;
  delete_role?: Maybe<Scalars["Boolean"]>;
};

export type RolePermissionArgs = {
  permission_name: Scalars["String"];
};

export type RoleSetArgs = {
  role_name?: Maybe<Scalars["String"]>;
};

export type RoleGrantArgs = {
  permission_name: Scalars["String"];
};

export type RoleRevokeArgs = {
  permission_name: Scalars["String"];
};

export type RoleDenyArgs = {
  permission_name: Scalars["String"];
};

export type RoleDelete_RoleArgs = {
  _?: Maybe<Scalars["Int"]>;
};

export type Permission = {
  __typename?: "Permission";
  role_id: Scalars["ID"];
  permission_name: Scalars["ID"];
  allow?: Maybe<Scalars["Boolean"]>;
  role?: Maybe<Role>;
};

export type School = {
  __typename?: "School";
  school_id: Scalars["ID"];
  school_name?: Maybe<Scalars["String"]>;
  organization?: Maybe<Organization>;
  memberships?: Maybe<Array<Maybe<SchoolMembership>>>;
  membership?: Maybe<SchoolMembership>;
  classes?: Maybe<Array<Maybe<Class>>>;
  set?: Maybe<School>;
  addUser?: Maybe<SchoolMembership>;
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

export type SchoolMembership = {
  __typename?: "SchoolMembership";
  user_id: Scalars["ID"];
  school_id: Scalars["ID"];
  join_timestamp?: Maybe<Scalars["Date"]>;
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
  organization?: Maybe<Organization>;
  schools?: Maybe<Array<Maybe<School>>>;
  teachers?: Maybe<Array<Maybe<User>>>;
  students?: Maybe<Array<Maybe<User>>>;
  eligibleTeachers?: Maybe<Array<Maybe<User>>>;
  eligibleStudents?: Maybe<Array<Maybe<User>>>;
  set?: Maybe<Class>;
  addTeacher?: Maybe<User>;
  removeTeacher?: Maybe<Scalars["Boolean"]>;
  addStudent?: Maybe<User>;
  removeStudent?: Maybe<Scalars["Boolean"]>;
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

export type ClassRemoveTeacherArgs = {
  user_id: Scalars["ID"];
};

export type ClassAddStudentArgs = {
  user_id: Scalars["ID"];
};

export type ClassRemoveStudentArgs = {
  user_id: Scalars["ID"];
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

export type ScheduleEntry = {
  __typename?: "ScheduleEntry";
  id: Scalars["ID"];
  timestamp?: Maybe<Scalars["Date"]>;
};

export enum CacheControlScope {
  Public = "PUBLIC",
  Private = "PRIVATE",
}
