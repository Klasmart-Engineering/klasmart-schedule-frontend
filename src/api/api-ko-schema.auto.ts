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
  HexColor: any;
  /** The number of results to return per page */
  PageSize: any;
  /** The `UUID` scalar type represents UUID values as specified by [RFC 4122](https://tools.ietf.org/html/rfc4122). */
  UUID: any;
  Upload: any;
  Url: any;
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

export type AgeRangeConnectionNode = {
  __typename?: "AgeRangeConnectionNode";
  id: Scalars["ID"];
  name?: Maybe<Scalars["String"]>;
  status: Status;
  system: Scalars["Boolean"];
  lowValue: Scalars["Int"];
  lowValueUnit: AgeRangeUnit;
  highValue: Scalars["Int"];
  highValueUnit: AgeRangeUnit;
};

export type AgeRangeDetail = {
  id?: Maybe<Scalars["ID"]>;
  name?: Maybe<Scalars["String"]>;
  low_value?: Maybe<Scalars["Int"]>;
  high_value?: Maybe<Scalars["Int"]>;
  low_value_unit?: Maybe<AgeRangeUnit>;
  high_value_unit?: Maybe<AgeRangeUnit>;
  system?: Maybe<Scalars["Boolean"]>;
};

export type AgeRangeFilter = {
  ageRangeValueFrom?: Maybe<AgeRangeValueFilter>;
  ageRangeUnitFrom?: Maybe<AgeRangeUnitFilter>;
  ageRangeValueTo?: Maybe<AgeRangeValueFilter>;
  ageRangeUnitTo?: Maybe<AgeRangeUnitFilter>;
  status?: Maybe<StringFilter>;
  system?: Maybe<BooleanFilter>;
  organizationId?: Maybe<UuidFilter>;
  AND?: Maybe<Array<AgeRangeFilter>>;
  OR?: Maybe<Array<AgeRangeFilter>>;
};

export enum AgeRangeSortBy {
  Id = "id",
  LowValue = "lowValue",
  LowValueUnit = "lowValueUnit",
}

export type AgeRangeSortInput = {
  field: Array<AgeRangeSortBy>;
  order: SortOrder;
};

export type AgeRangeTypeFilter = {
  operator: NumberOrDateOperator;
  value: AgeRangeValue;
};

export enum AgeRangeUnit {
  Year = "year",
  Month = "month",
}

export type AgeRangeUnitFilter = {
  operator: UuidOperator;
  value: AgeRangeUnit;
};

export type AgeRangeValue = {
  value: Scalars["Int"];
  unit: AgeRangeUnit;
};

export type AgeRangeValueFilter = {
  operator: NumberOrDateOperator;
  value: Scalars["Int"];
};

export type AgeRangesConnectionEdge = IConnectionEdge & {
  __typename?: "AgeRangesConnectionEdge";
  cursor?: Maybe<Scalars["String"]>;
  node?: Maybe<AgeRangeConnectionNode>;
};

export type AgeRangesConnectionResponse = IConnectionResponse & {
  __typename?: "AgeRangesConnectionResponse";
  totalCount?: Maybe<Scalars["Int"]>;
  pageInfo?: Maybe<ConnectionPageInfo>;
  edges?: Maybe<Array<Maybe<AgeRangesConnectionEdge>>>;
};

export type BooleanFilter = {
  operator: BooleanOperator;
  value: Scalars["Boolean"];
};

export enum BooleanOperator {
  Eq = "eq",
}

export type Branding = {
  __typename?: "Branding";
  iconImageURL?: Maybe<Scalars["Url"]>;
  primaryColor?: Maybe<Scalars["HexColor"]>;
};

export enum BrandingImageTag {
  Icon = "ICON",
}

export type Category = {
  __typename?: "Category";
  id: Scalars["ID"];
  name: Scalars["String"];
  subcategories?: Maybe<Array<Subcategory>>;
  system: Scalars["Boolean"];
  status?: Maybe<Status>;
  editSubcategories?: Maybe<Array<Maybe<Subcategory>>>;
  delete?: Maybe<Scalars["Boolean"]>;
};

export type CategoryEditSubcategoriesArgs = {
  subcategory_ids?: Maybe<Array<Scalars["ID"]>>;
};

export type CategoryDeleteArgs = {
  _?: Maybe<Scalars["Int"]>;
};

export type CategoryDetail = {
  id?: Maybe<Scalars["ID"]>;
  name?: Maybe<Scalars["String"]>;
  subcategories?: Maybe<Array<Scalars["ID"]>>;
  system?: Maybe<Scalars["Boolean"]>;
};

export type CategorySummaryNode = {
  __typename?: "CategorySummaryNode";
  id: Scalars["ID"];
  name?: Maybe<Scalars["String"]>;
  status: Status;
  system: Scalars["Boolean"];
};

export type Class = {
  __typename?: "Class";
  class_id: Scalars["ID"];
  class_name?: Maybe<Scalars["String"]>;
  status?: Maybe<Status>;
  shortcode?: Maybe<Scalars["String"]>;
  organization?: Maybe<Organization>;
  schools?: Maybe<Array<Maybe<School>>>;
  teachers?: Maybe<Array<Maybe<User>>>;
  students?: Maybe<Array<Maybe<User>>>;
  programs?: Maybe<Array<Program>>;
  age_ranges?: Maybe<Array<AgeRange>>;
  grades?: Maybe<Array<Grade>>;
  subjects?: Maybe<Array<Subject>>;
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
  editPrograms?: Maybe<Array<Maybe<Program>>>;
  editAgeRanges?: Maybe<Array<Maybe<AgeRange>>>;
  editGrades?: Maybe<Array<Maybe<Grade>>>;
  editSubjects?: Maybe<Array<Maybe<Subject>>>;
  removeSchool?: Maybe<Scalars["Boolean"]>;
  delete?: Maybe<Scalars["Boolean"]>;
};

export type ClassSetArgs = {
  class_name?: Maybe<Scalars["String"]>;
  shortcode?: Maybe<Scalars["String"]>;
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

export type ClassEditProgramsArgs = {
  program_ids?: Maybe<Array<Scalars["ID"]>>;
};

export type ClassEditAgeRangesArgs = {
  age_range_ids?: Maybe<Array<Scalars["ID"]>>;
};

export type ClassEditGradesArgs = {
  grade_ids?: Maybe<Array<Scalars["ID"]>>;
};

export type ClassEditSubjectsArgs = {
  subject_ids?: Maybe<Array<Scalars["ID"]>>;
};

export type ClassRemoveSchoolArgs = {
  school_id: Scalars["ID"];
};

export type ClassDeleteArgs = {
  _?: Maybe<Scalars["Int"]>;
};

export type ClassConnection = {
  __typename?: "ClassConnection";
  total?: Maybe<Scalars["Int"]>;
  edges: Array<Maybe<Class>>;
  pageInfo: PageInfo;
};

export type ClassConnectionNode = {
  __typename?: "ClassConnectionNode";
  id: Scalars["ID"];
  name?: Maybe<Scalars["String"]>;
  status: Status;
  schools?: Maybe<Array<SchoolSimplifiedSummaryNode>>;
  ageRanges?: Maybe<Array<AgeRangeConnectionNode>>;
  grades?: Maybe<Array<GradeSummaryNode>>;
  subjects?: Maybe<Array<SubjectSummaryNode>>;
  programs?: Maybe<Array<ProgramSummaryNode>>;
};

export type ClassFilter = {
  id?: Maybe<UuidFilter>;
  name?: Maybe<StringFilter>;
  status?: Maybe<StringFilter>;
  organizationId?: Maybe<UuidFilter>;
  ageRangeValueFrom?: Maybe<AgeRangeValueFilter>;
  ageRangeUnitFrom?: Maybe<AgeRangeUnitFilter>;
  ageRangeValueTo?: Maybe<AgeRangeValueFilter>;
  ageRangeUnitTo?: Maybe<AgeRangeUnitFilter>;
  schoolId?: Maybe<UuidFilter>;
  gradeId?: Maybe<UuidFilter>;
  subjectId?: Maybe<UuidFilter>;
  programId?: Maybe<UuidFilter>;
  AND?: Maybe<Array<ClassFilter>>;
  OR?: Maybe<Array<ClassFilter>>;
};

export enum ClassSortBy {
  Id = "id",
  Name = "name",
}

export type ClassSortInput = {
  field: ClassSortBy;
  order: SortOrder;
};

export type ClassesConnectionEdge = IConnectionEdge & {
  __typename?: "ClassesConnectionEdge";
  cursor?: Maybe<Scalars["String"]>;
  node?: Maybe<ClassConnectionNode>;
};

export type ClassesConnectionResponse = IConnectionResponse & {
  __typename?: "ClassesConnectionResponse";
  totalCount?: Maybe<Scalars["Int"]>;
  pageInfo?: Maybe<ConnectionPageInfo>;
  edges?: Maybe<Array<Maybe<ClassesConnectionEdge>>>;
};

export enum ConnectionDirection {
  Forward = "FORWARD",
  Backward = "BACKWARD",
}

export type ConnectionPageInfo = {
  __typename?: "ConnectionPageInfo";
  hasNextPage?: Maybe<Scalars["Boolean"]>;
  hasPreviousPage?: Maybe<Scalars["Boolean"]>;
  startCursor?: Maybe<Scalars["String"]>;
  endCursor?: Maybe<Scalars["String"]>;
};

export type ConnectionsDirectionArgs = {
  count?: Maybe<Scalars["PageSize"]>;
  cursor?: Maybe<Scalars["String"]>;
};

export type ContactInfo = {
  __typename?: "ContactInfo";
  email?: Maybe<Scalars["String"]>;
  phone?: Maybe<Scalars["String"]>;
};

export type DateFilter = {
  operator: NumberOrDateOperator;
  value: Scalars["String"];
};

export type File = {
  __typename?: "File";
  filename: Scalars["String"];
  mimetype: Scalars["String"];
  encoding: Scalars["String"];
};

export type Grade = {
  __typename?: "Grade";
  id: Scalars["ID"];
  name: Scalars["String"];
  progress_from_grade?: Maybe<Grade>;
  progress_to_grade?: Maybe<Grade>;
  system: Scalars["Boolean"];
  status?: Maybe<Status>;
  delete?: Maybe<Scalars["Boolean"]>;
};

export type GradeDeleteArgs = {
  _?: Maybe<Scalars["Int"]>;
};

export type GradeConnectionNode = {
  __typename?: "GradeConnectionNode";
  id: Scalars["ID"];
  name?: Maybe<Scalars["String"]>;
  status: Status;
  system: Scalars["Boolean"];
  fromGrade: GradeSummaryNode;
  toGrade: GradeSummaryNode;
};

export type GradeDetail = {
  id?: Maybe<Scalars["ID"]>;
  name?: Maybe<Scalars["String"]>;
  progress_from_grade_id?: Maybe<Scalars["ID"]>;
  progress_to_grade_id?: Maybe<Scalars["ID"]>;
  system?: Maybe<Scalars["Boolean"]>;
};

export type GradeFilter = {
  id?: Maybe<UuidFilter>;
  name?: Maybe<StringFilter>;
  status?: Maybe<StringFilter>;
  system?: Maybe<BooleanFilter>;
  organizationId?: Maybe<UuidFilter>;
  fromGradeId?: Maybe<UuidFilter>;
  toGradeId?: Maybe<UuidFilter>;
  AND?: Maybe<Array<GradeFilter>>;
  OR?: Maybe<Array<GradeFilter>>;
};

export enum GradeSortBy {
  Id = "id",
  Name = "name",
}

export type GradeSortInput = {
  field: Array<GradeSortBy>;
  order: SortOrder;
};

export type GradeSummaryNode = {
  __typename?: "GradeSummaryNode";
  id: Scalars["ID"];
  name?: Maybe<Scalars["String"]>;
  status: Status;
  system: Scalars["Boolean"];
};

export type GradesConnectionEdge = IConnectionEdge & {
  __typename?: "GradesConnectionEdge";
  cursor?: Maybe<Scalars["String"]>;
  node?: Maybe<GradeConnectionNode>;
};

export type GradesConnectionResponse = IConnectionResponse & {
  __typename?: "GradesConnectionResponse";
  totalCount?: Maybe<Scalars["Int"]>;
  pageInfo?: Maybe<ConnectionPageInfo>;
  edges?: Maybe<Array<Maybe<GradesConnectionEdge>>>;
};

export type MembershipUpdate = {
  __typename?: "MembershipUpdate";
  user?: Maybe<User>;
  membership?: Maybe<OrganizationMembership>;
  schoolMemberships?: Maybe<Array<Maybe<SchoolMembership>>>;
};

export type Mutation = {
  __typename?: "Mutation";
  _empty?: Maybe<Scalars["String"]>;
  age_range?: Maybe<AgeRange>;
  uploadAgeRangesFromCSV?: Maybe<File>;
  category?: Maybe<Category>;
  uploadCategoriesFromCSV?: Maybe<File>;
  classes?: Maybe<Array<Maybe<Class>>>;
  class?: Maybe<Class>;
  uploadClassesFromCSV?: Maybe<File>;
  grade?: Maybe<Grade>;
  uploadGradesFromCSV?: Maybe<File>;
  renameDuplicateGrades?: Maybe<Scalars["Boolean"]>;
  organization?: Maybe<Organization>;
  uploadOrganizationsFromCSV?: Maybe<File>;
  renameDuplicateOrganizations?: Maybe<Scalars["Boolean"]>;
  setBranding?: Maybe<Branding>;
  deleteBrandingImage?: Maybe<Scalars["Boolean"]>;
  deleteBrandingColor?: Maybe<Scalars["Boolean"]>;
  program?: Maybe<Program>;
  uploadProgramsFromCSV?: Maybe<File>;
  role?: Maybe<Role>;
  roles?: Maybe<Array<Maybe<Role>>>;
  uploadRolesFromCSV?: Maybe<File>;
  school?: Maybe<School>;
  uploadSchoolsFromCSV?: Maybe<File>;
  subcategory?: Maybe<Subcategory>;
  uploadSubCategoriesFromCSV?: Maybe<File>;
  subject?: Maybe<Subject>;
  uploadSubjectsFromCSV?: Maybe<File>;
  renameDuplicateSubjects?: Maybe<Scalars["Boolean"]>;
  me?: Maybe<User>;
  user?: Maybe<User>;
  /** @deprecated Use the inviteUser() method */
  newUser?: Maybe<User>;
  /** @deprecated Moved to auth service */
  switch_user?: Maybe<User>;
  uploadUsersFromCSV?: Maybe<File>;
};

export type MutationAge_RangeArgs = {
  id: Scalars["ID"];
};

export type MutationUploadAgeRangesFromCsvArgs = {
  file: Scalars["Upload"];
};

export type MutationCategoryArgs = {
  id: Scalars["ID"];
};

export type MutationUploadCategoriesFromCsvArgs = {
  file: Scalars["Upload"];
};

export type MutationClassArgs = {
  class_id: Scalars["ID"];
};

export type MutationUploadClassesFromCsvArgs = {
  file: Scalars["Upload"];
};

export type MutationGradeArgs = {
  id: Scalars["ID"];
};

export type MutationUploadGradesFromCsvArgs = {
  file: Scalars["Upload"];
};

export type MutationOrganizationArgs = {
  organization_id: Scalars["ID"];
  organization_name?: Maybe<Scalars["String"]>;
  address1?: Maybe<Scalars["String"]>;
  address2?: Maybe<Scalars["String"]>;
  phone?: Maybe<Scalars["String"]>;
  shortCode?: Maybe<Scalars["String"]>;
};

export type MutationUploadOrganizationsFromCsvArgs = {
  file: Scalars["Upload"];
};

export type MutationSetBrandingArgs = {
  organizationId: Scalars["ID"];
  iconImage?: Maybe<Scalars["Upload"]>;
  primaryColor?: Maybe<Scalars["HexColor"]>;
};

export type MutationDeleteBrandingImageArgs = {
  organizationId: Scalars["ID"];
  type: BrandingImageTag;
};

export type MutationDeleteBrandingColorArgs = {
  organizationId: Scalars["ID"];
};

export type MutationProgramArgs = {
  id: Scalars["ID"];
};

export type MutationUploadProgramsFromCsvArgs = {
  file: Scalars["Upload"];
};

export type MutationRoleArgs = {
  role_id: Scalars["ID"];
};

export type MutationUploadRolesFromCsvArgs = {
  file: Scalars["Upload"];
};

export type MutationSchoolArgs = {
  school_id: Scalars["ID"];
};

export type MutationUploadSchoolsFromCsvArgs = {
  file: Scalars["Upload"];
};

export type MutationSubcategoryArgs = {
  id: Scalars["ID"];
};

export type MutationUploadSubCategoriesFromCsvArgs = {
  file: Scalars["Upload"];
};

export type MutationSubjectArgs = {
  id: Scalars["ID"];
};

export type MutationUploadSubjectsFromCsvArgs = {
  file: Scalars["Upload"];
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
  alternate_email?: Maybe<Scalars["String"]>;
  alternate_phone?: Maybe<Scalars["String"]>;
  gender?: Maybe<Scalars["String"]>;
};

export type MutationNewUserArgs = {
  given_name?: Maybe<Scalars["String"]>;
  family_name?: Maybe<Scalars["String"]>;
  email?: Maybe<Scalars["String"]>;
  phone?: Maybe<Scalars["String"]>;
  avatar?: Maybe<Scalars["String"]>;
  date_of_birth?: Maybe<Scalars["String"]>;
  username?: Maybe<Scalars["String"]>;
  gender?: Maybe<Scalars["String"]>;
};

export type MutationSwitch_UserArgs = {
  user_id: Scalars["ID"];
};

export type MutationUploadUsersFromCsvArgs = {
  file: Scalars["Upload"];
  isDryRun?: Maybe<Scalars["Boolean"]>;
};

export type MyType = {
  __typename?: "MyType";
  myField?: Maybe<Scalars["UUID"]>;
};

export type NumberFilter = {
  operator: NumberOrDateOperator;
  value: Scalars["Float"];
};

export enum NumberOrDateOperator {
  Eq = "eq",
  Neq = "neq",
  Gt = "gt",
  Gte = "gte",
  Lt = "lt",
  Lte = "lte",
}

export type Organization = {
  __typename?: "Organization";
  organization_id: Scalars["ID"];
  organization_name?: Maybe<Scalars["String"]>;
  address1?: Maybe<Scalars["String"]>;
  address2?: Maybe<Scalars["String"]>;
  phone?: Maybe<Scalars["String"]>;
  shortCode?: Maybe<Scalars["String"]>;
  status?: Maybe<Status>;
  branding?: Maybe<Branding>;
  /**
   * 'owner' is the User that created this Organization
   * @deprecated Use 'organization_ownerships'.
   */
  owner?: Maybe<User>;
  primary_contact?: Maybe<User>;
  roles?: Maybe<Array<Maybe<Role>>>;
  memberships?: Maybe<Array<Maybe<OrganizationMembership>>>;
  teachers?: Maybe<Array<Maybe<OrganizationMembership>>>;
  students?: Maybe<Array<Maybe<OrganizationMembership>>>;
  schools?: Maybe<Array<Maybe<School>>>;
  /** @deprecated Use 'getClasses'. */
  classes?: Maybe<Array<Maybe<Class>>>;
  getClasses?: Maybe<Array<Maybe<Class>>>;
  ageRanges?: Maybe<Array<AgeRange>>;
  grades?: Maybe<Array<Grade>>;
  categories?: Maybe<Array<Category>>;
  subcategories?: Maybe<Array<Subcategory>>;
  subjects?: Maybe<Array<Subject>>;
  programs?: Maybe<Array<Program>>;
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
  createOrUpdateGrades?: Maybe<Array<Maybe<Grade>>>;
  createOrUpdateCategories?: Maybe<Array<Maybe<Category>>>;
  createOrUpdateSubcategories?: Maybe<Array<Maybe<Subcategory>>>;
  createOrUpdateSubjects?: Maybe<Array<Maybe<Subject>>>;
  createOrUpdatePrograms?: Maybe<Array<Maybe<Program>>>;
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
  shortcode?: Maybe<Scalars["String"]>;
};

export type OrganizationInviteUserArgs = {
  email?: Maybe<Scalars["String"]>;
  phone?: Maybe<Scalars["String"]>;
  given_name: Scalars["String"];
  family_name: Scalars["String"];
  date_of_birth?: Maybe<Scalars["String"]>;
  username?: Maybe<Scalars["String"]>;
  gender: Scalars["String"];
  shortcode?: Maybe<Scalars["String"]>;
  organization_role_ids: Array<Scalars["ID"]>;
  school_ids?: Maybe<Array<Scalars["ID"]>>;
  school_role_ids?: Maybe<Array<Scalars["ID"]>>;
  alternate_email?: Maybe<Scalars["String"]>;
  alternate_phone?: Maybe<Scalars["String"]>;
};

export type OrganizationEditMembershipArgs = {
  user_id: Scalars["ID"];
  given_name: Scalars["String"];
  family_name: Scalars["String"];
  email?: Maybe<Scalars["String"]>;
  phone?: Maybe<Scalars["String"]>;
  date_of_birth?: Maybe<Scalars["String"]>;
  username?: Maybe<Scalars["String"]>;
  gender: Scalars["String"];
  shortcode: Scalars["String"];
  organization_role_ids: Array<Scalars["ID"]>;
  school_ids?: Maybe<Array<Scalars["ID"]>>;
  school_role_ids?: Maybe<Array<Scalars["ID"]>>;
  alternate_email?: Maybe<Scalars["String"]>;
  alternate_phone?: Maybe<Scalars["String"]>;
};

export type OrganizationCreateRoleArgs = {
  role_name: Scalars["String"];
  role_description: Scalars["String"];
};

export type OrganizationCreateSchoolArgs = {
  school_name?: Maybe<Scalars["String"]>;
  shortcode?: Maybe<Scalars["String"]>;
};

export type OrganizationCreateClassArgs = {
  class_name?: Maybe<Scalars["String"]>;
  shortcode?: Maybe<Scalars["String"]>;
};

export type OrganizationCreateOrUpdateAgeRangesArgs = {
  age_ranges: Array<Maybe<AgeRangeDetail>>;
};

export type OrganizationCreateOrUpdateGradesArgs = {
  grades: Array<Maybe<GradeDetail>>;
};

export type OrganizationCreateOrUpdateCategoriesArgs = {
  categories: Array<Maybe<CategoryDetail>>;
};

export type OrganizationCreateOrUpdateSubcategoriesArgs = {
  subcategories: Array<Maybe<SubcategoryDetail>>;
};

export type OrganizationCreateOrUpdateSubjectsArgs = {
  subjects: Array<Maybe<SubjectDetail>>;
};

export type OrganizationCreateOrUpdateProgramsArgs = {
  programs: Array<Maybe<ProgramDetail>>;
};

export type OrganizationDeleteArgs = {
  _?: Maybe<Scalars["Int"]>;
};

export type OrganizationConnection = {
  __typename?: "OrganizationConnection";
  total?: Maybe<Scalars["Int"]>;
  edges: Array<Maybe<Organization>>;
  pageInfo: PageInfo;
};

export type OrganizationMembership = {
  __typename?: "OrganizationMembership";
  user_id: Scalars["ID"];
  organization_id: Scalars["ID"];
  shortcode?: Maybe<Scalars["String"]>;
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

export type OrganizationSummaryNode = {
  __typename?: "OrganizationSummaryNode";
  id: Scalars["ID"];
  name?: Maybe<Scalars["String"]>;
  joinDate?: Maybe<Scalars["Date"]>;
  userStatus?: Maybe<Status>;
  status?: Maybe<Status>;
};

export type PageInfo = {
  __typename?: "PageInfo";
  hasNextPage: Scalars["Boolean"];
  endCursor: Scalars["String"];
  startCursor: Scalars["String"];
  hasPreviousPage: Scalars["Boolean"];
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

export type PermissionFilter = {
  permission_id?: Maybe<StringFilter>;
  permission_name?: Maybe<StringFilter>;
  permission_category?: Maybe<StringFilter>;
  permission_group?: Maybe<StringFilter>;
  permission_level?: Maybe<StringFilter>;
  permission_description?: Maybe<StringFilter>;
  allow?: Maybe<BooleanFilter>;
  AND?: Maybe<Array<PermissionFilter>>;
  OR?: Maybe<Array<PermissionFilter>>;
};

export type PermissionsConnectionEdge = IConnectionEdge & {
  __typename?: "PermissionsConnectionEdge";
  cursor?: Maybe<Scalars["String"]>;
  node?: Maybe<PermissionsConnectionNode>;
};

export type PermissionsConnectionNode = {
  __typename?: "PermissionsConnectionNode";
  permission_id?: Maybe<Scalars["ID"]>;
  permission_name: Scalars["ID"];
  permission_category?: Maybe<Scalars["String"]>;
  permission_group?: Maybe<Scalars["String"]>;
  permission_level?: Maybe<Scalars["String"]>;
  permission_description?: Maybe<Scalars["String"]>;
  allow?: Maybe<Scalars["Boolean"]>;
};

export type PermissionsConnectionResponse = IConnectionResponse & {
  __typename?: "PermissionsConnectionResponse";
  totalCount?: Maybe<Scalars["Int"]>;
  pageInfo?: Maybe<ConnectionPageInfo>;
  edges?: Maybe<Array<Maybe<PermissionsConnectionEdge>>>;
};

export type Program = {
  __typename?: "Program";
  id: Scalars["ID"];
  name: Scalars["String"];
  system: Scalars["Boolean"];
  status?: Maybe<Status>;
  age_ranges?: Maybe<Array<AgeRange>>;
  grades?: Maybe<Array<Grade>>;
  subjects?: Maybe<Array<Subject>>;
  editAgeRanges?: Maybe<Array<Maybe<AgeRange>>>;
  editGrades?: Maybe<Array<Maybe<Grade>>>;
  editSubjects?: Maybe<Array<Maybe<Subject>>>;
  delete?: Maybe<Scalars["Boolean"]>;
};

export type ProgramEditAgeRangesArgs = {
  age_range_ids?: Maybe<Array<Scalars["ID"]>>;
};

export type ProgramEditGradesArgs = {
  grade_ids?: Maybe<Array<Scalars["ID"]>>;
};

export type ProgramEditSubjectsArgs = {
  subject_ids?: Maybe<Array<Scalars["ID"]>>;
};

export type ProgramDeleteArgs = {
  _?: Maybe<Scalars["Int"]>;
};

export type ProgramConnectionNode = {
  __typename?: "ProgramConnectionNode";
  id: Scalars["ID"];
  name?: Maybe<Scalars["String"]>;
  status: Status;
  system: Scalars["Boolean"];
  ageRanges?: Maybe<Array<AgeRangeConnectionNode>>;
  grades?: Maybe<Array<GradeSummaryNode>>;
  subjects?: Maybe<Array<SubjectSummaryNode>>;
};

export type ProgramDetail = {
  id?: Maybe<Scalars["ID"]>;
  name?: Maybe<Scalars["String"]>;
  system?: Maybe<Scalars["Boolean"]>;
  age_ranges?: Maybe<Array<Scalars["ID"]>>;
  grades?: Maybe<Array<Scalars["ID"]>>;
  subjects?: Maybe<Array<Scalars["ID"]>>;
  status?: Maybe<Status>;
};

export type ProgramFilter = {
  id?: Maybe<UuidFilter>;
  name?: Maybe<StringFilter>;
  status?: Maybe<StringFilter>;
  system?: Maybe<BooleanFilter>;
  organizationId?: Maybe<UuidFilter>;
  gradeId?: Maybe<UuidFilter>;
  ageRangeFrom?: Maybe<AgeRangeTypeFilter>;
  ageRangeTo?: Maybe<AgeRangeTypeFilter>;
  subjectId?: Maybe<UuidFilter>;
  schoolId?: Maybe<UuidFilter>;
  classId?: Maybe<UuidFilter>;
  AND?: Maybe<Array<ProgramFilter>>;
  OR?: Maybe<Array<ProgramFilter>>;
};

export enum ProgramSortBy {
  Id = "id",
  Name = "name",
}

export type ProgramSortInput = {
  field: Array<ProgramSortBy>;
  order: SortOrder;
};

export type ProgramSummaryNode = {
  __typename?: "ProgramSummaryNode";
  id: Scalars["ID"];
  name?: Maybe<Scalars["String"]>;
  status: Status;
  system: Scalars["Boolean"];
};

export type ProgramsConnectionEdge = IConnectionEdge & {
  __typename?: "ProgramsConnectionEdge";
  cursor?: Maybe<Scalars["String"]>;
  node?: Maybe<ProgramConnectionNode>;
};

export type ProgramsConnectionResponse = IConnectionResponse & {
  __typename?: "ProgramsConnectionResponse";
  totalCount?: Maybe<Scalars["Int"]>;
  pageInfo?: Maybe<ConnectionPageInfo>;
  edges?: Maybe<Array<Maybe<ProgramsConnectionEdge>>>;
};

export type Query = {
  __typename?: "Query";
  _empty?: Maybe<Scalars["String"]>;
  age_range?: Maybe<AgeRange>;
  ageRangesConnection?: Maybe<AgeRangesConnectionResponse>;
  category?: Maybe<Category>;
  /** @deprecated Use 'classesConnection'. */
  classes?: Maybe<Array<Maybe<Class>>>;
  /** @deprecated Use 'classesConnection' with 'id' filter. */
  class?: Maybe<Class>;
  classesConnection?: Maybe<ClassesConnectionResponse>;
  grade?: Maybe<Grade>;
  gradesConnection?: Maybe<GradesConnectionResponse>;
  organization?: Maybe<Organization>;
  organizations?: Maybe<Array<Maybe<Organization>>>;
  permissionsConnection?: Maybe<PermissionsConnectionResponse>;
  /** @deprecated Use 'programsConnection' with 'id' filter. */
  program?: Maybe<Program>;
  programsConnection?: Maybe<ProgramsConnectionResponse>;
  role?: Maybe<Role>;
  roles?: Maybe<Array<Maybe<Role>>>;
  /** @deprecated Use 'schoolsConnection' with 'schoolId' filter. */
  school?: Maybe<School>;
  schoolsConnection?: Maybe<SchoolsConnectionResponse>;
  subcategory?: Maybe<Subcategory>;
  subject?: Maybe<Subject>;
  subjectsConnection?: Maybe<SubjectsConnectionResponse>;
  me?: Maybe<User>;
  /** @deprecated Use 'usersConnection' with 'userId' filter. */
  user?: Maybe<User>;
  usersConnection?: Maybe<UsersConnectionResponse>;
  /** @deprecated Unused */
  users?: Maybe<Array<Maybe<User>>>;
  my_users?: Maybe<Array<User>>;
};

export type QueryAge_RangeArgs = {
  id: Scalars["ID"];
};

export type QueryAgeRangesConnectionArgs = {
  direction: ConnectionDirection;
  directionArgs?: Maybe<ConnectionsDirectionArgs>;
  filter?: Maybe<AgeRangeFilter>;
  sort?: Maybe<AgeRangeSortInput>;
};

export type QueryCategoryArgs = {
  id: Scalars["ID"];
};

export type QueryClassArgs = {
  class_id: Scalars["ID"];
};

export type QueryClassesConnectionArgs = {
  direction: ConnectionDirection;
  directionArgs?: Maybe<ConnectionsDirectionArgs>;
  filter?: Maybe<ClassFilter>;
  sort?: Maybe<ClassSortInput>;
};

export type QueryGradeArgs = {
  id: Scalars["ID"];
};

export type QueryGradesConnectionArgs = {
  direction: ConnectionDirection;
  directionArgs?: Maybe<ConnectionsDirectionArgs>;
  filter?: Maybe<GradeFilter>;
  sort?: Maybe<GradeSortInput>;
};

export type QueryOrganizationArgs = {
  organization_id: Scalars["ID"];
};

export type QueryOrganizationsArgs = {
  organization_ids?: Maybe<Array<Scalars["ID"]>>;
};

export type QueryPermissionsConnectionArgs = {
  direction: ConnectionDirection;
  directionArgs?: Maybe<ConnectionsDirectionArgs>;
  filter?: Maybe<PermissionFilter>;
};

export type QueryProgramArgs = {
  id: Scalars["ID"];
};

export type QueryProgramsConnectionArgs = {
  direction: ConnectionDirection;
  directionArgs?: Maybe<ConnectionsDirectionArgs>;
  filter?: Maybe<ProgramFilter>;
  sort?: Maybe<ProgramSortInput>;
};

export type QueryRoleArgs = {
  role_id: Scalars["ID"];
};

export type QuerySchoolArgs = {
  school_id: Scalars["ID"];
};

export type QuerySchoolsConnectionArgs = {
  direction: ConnectionDirection;
  directionArgs?: Maybe<ConnectionsDirectionArgs>;
  filter?: Maybe<SchoolFilter>;
  sort?: Maybe<SchoolSortInput>;
};

export type QuerySubcategoryArgs = {
  id: Scalars["ID"];
};

export type QuerySubjectArgs = {
  id: Scalars["ID"];
};

export type QuerySubjectsConnectionArgs = {
  direction: ConnectionDirection;
  directionArgs?: Maybe<ConnectionsDirectionArgs>;
  filter?: Maybe<SubjectFilter>;
  sort?: Maybe<SubjectSortInput>;
};

export type QueryUserArgs = {
  user_id: Scalars["ID"];
};

export type QueryUsersConnectionArgs = {
  direction: ConnectionDirection;
  directionArgs?: Maybe<ConnectionsDirectionArgs>;
  filter?: Maybe<UserFilter>;
  sort?: Maybe<UserSortInput>;
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

export type RoleConnection = {
  __typename?: "RoleConnection";
  total?: Maybe<Scalars["Int"]>;
  edges: Array<Maybe<Role>>;
  pageInfo: PageInfo;
};

export type RoleSummaryNode = {
  __typename?: "RoleSummaryNode";
  id: Scalars["ID"];
  name?: Maybe<Scalars["String"]>;
  organizationId?: Maybe<Scalars["String"]>;
  schoolId?: Maybe<Scalars["String"]>;
  status?: Maybe<Status>;
};

export type ScheduleEntry = {
  __typename?: "ScheduleEntry";
  id: Scalars["ID"];
  timestamp?: Maybe<Scalars["Date"]>;
};

export type School = {
  __typename?: "School";
  school_id: Scalars["ID"];
  school_name?: Maybe<Scalars["String"]>;
  shortcode?: Maybe<Scalars["String"]>;
  status?: Maybe<Status>;
  organization?: Maybe<Organization>;
  memberships?: Maybe<Array<Maybe<SchoolMembership>>>;
  membership?: Maybe<SchoolMembership>;
  classes?: Maybe<Array<Maybe<Class>>>;
  programs?: Maybe<Array<Program>>;
  set?: Maybe<School>;
  addUser?: Maybe<SchoolMembership>;
  editPrograms?: Maybe<Array<Maybe<Program>>>;
  delete?: Maybe<Scalars["Boolean"]>;
};

export type SchoolMembershipArgs = {
  user_id: Scalars["ID"];
};

export type SchoolSetArgs = {
  school_name?: Maybe<Scalars["String"]>;
  shortcode?: Maybe<Scalars["String"]>;
};

export type SchoolAddUserArgs = {
  user_id: Scalars["ID"];
};

export type SchoolEditProgramsArgs = {
  program_ids?: Maybe<Array<Scalars["ID"]>>;
};

export type SchoolDeleteArgs = {
  _?: Maybe<Scalars["Int"]>;
};

export type SchoolConnectionNode = {
  __typename?: "SchoolConnectionNode";
  id: Scalars["ID"];
  name: Scalars["String"];
  status: Status;
  shortCode?: Maybe<Scalars["String"]>;
  organizationId: Scalars["ID"];
};

export type SchoolFilter = {
  schoolId?: Maybe<UuidFilter>;
  name?: Maybe<StringFilter>;
  shortCode?: Maybe<StringFilter>;
  status?: Maybe<StringFilter>;
  organizationId?: Maybe<UuidFilter>;
  AND?: Maybe<Array<SchoolFilter>>;
  OR?: Maybe<Array<SchoolFilter>>;
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

export type SchoolSimplifiedSummaryNode = {
  __typename?: "SchoolSimplifiedSummaryNode";
  id: Scalars["ID"];
  name?: Maybe<Scalars["String"]>;
  status: Status;
};

export enum SchoolSortBy {
  Id = "id",
  Name = "name",
  ShortCode = "shortCode",
}

export type SchoolSortInput = {
  field: Array<SchoolSortBy>;
  order: SortOrder;
};

export type SchoolSummaryNode = {
  __typename?: "SchoolSummaryNode";
  id: Scalars["ID"];
  name?: Maybe<Scalars["String"]>;
  organizationId?: Maybe<Scalars["String"]>;
  status?: Maybe<Status>;
  userStatus?: Maybe<Status>;
};

export type SchoolsConnectionEdge = IConnectionEdge & {
  __typename?: "SchoolsConnectionEdge";
  cursor?: Maybe<Scalars["String"]>;
  node?: Maybe<SchoolConnectionNode>;
};

export type SchoolsConnectionResponse = IConnectionResponse & {
  __typename?: "SchoolsConnectionResponse";
  totalCount?: Maybe<Scalars["Int"]>;
  pageInfo?: Maybe<ConnectionPageInfo>;
  edges?: Maybe<Array<Maybe<SchoolsConnectionEdge>>>;
};

export enum SortOrder {
  Asc = "ASC",
  Desc = "DESC",
}

export enum Status {
  Active = "active",
  Inactive = "inactive",
}

export type StringFilter = {
  operator: StringOperator;
  value: Scalars["String"];
  caseInsensitive?: Maybe<Scalars["Boolean"]>;
};

export enum StringOperator {
  Contains = "contains",
  Eq = "eq",
  Neq = "neq",
}

export type Subcategory = {
  __typename?: "Subcategory";
  id: Scalars["ID"];
  name: Scalars["String"];
  system: Scalars["Boolean"];
  status?: Maybe<Status>;
  delete?: Maybe<Scalars["Boolean"]>;
};

export type SubcategoryDeleteArgs = {
  _?: Maybe<Scalars["Int"]>;
};

export type SubcategoryDetail = {
  id?: Maybe<Scalars["ID"]>;
  name?: Maybe<Scalars["String"]>;
  system?: Maybe<Scalars["Boolean"]>;
};

export type Subject = {
  __typename?: "Subject";
  id: Scalars["ID"];
  name: Scalars["String"];
  categories?: Maybe<Array<Category>>;
  subcategories?: Maybe<Array<Subcategory>>;
  system: Scalars["Boolean"];
  status?: Maybe<Status>;
  delete?: Maybe<Scalars["Boolean"]>;
};

export type SubjectDeleteArgs = {
  _?: Maybe<Scalars["Int"]>;
};

export type SubjectConnectionNode = {
  __typename?: "SubjectConnectionNode";
  id: Scalars["ID"];
  name?: Maybe<Scalars["String"]>;
  status: Status;
  system: Scalars["Boolean"];
  categories?: Maybe<Array<CategorySummaryNode>>;
  programs?: Maybe<Array<ProgramSummaryNode>>;
};

export type SubjectDetail = {
  id?: Maybe<Scalars["ID"]>;
  name?: Maybe<Scalars["String"]>;
  categories?: Maybe<Array<Scalars["ID"]>>;
  system?: Maybe<Scalars["Boolean"]>;
};

export type SubjectFilter = {
  id?: Maybe<UuidFilter>;
  name?: Maybe<StringFilter>;
  status?: Maybe<StringFilter>;
  system?: Maybe<BooleanFilter>;
  organizationId?: Maybe<UuidFilter>;
  categoryId?: Maybe<UuidFilter>;
  AND?: Maybe<Array<Maybe<SubjectFilter>>>;
  OR?: Maybe<Array<Maybe<SubjectFilter>>>;
};

export enum SubjectSortBy {
  Id = "id",
  Name = "name",
  System = "system",
}

export type SubjectSortInput = {
  field: SubjectSortBy;
  order: SortOrder;
};

export type SubjectSummaryNode = {
  __typename?: "SubjectSummaryNode";
  id: Scalars["ID"];
  name?: Maybe<Scalars["String"]>;
  status: Status;
  system: Scalars["Boolean"];
};

export type SubjectsConnectionEdge = IConnectionEdge & {
  __typename?: "SubjectsConnectionEdge";
  cursor?: Maybe<Scalars["String"]>;
  node?: Maybe<SubjectConnectionNode>;
};

export type SubjectsConnectionResponse = IConnectionResponse & {
  __typename?: "SubjectsConnectionResponse";
  totalCount?: Maybe<Scalars["Int"]>;
  pageInfo?: Maybe<ConnectionPageInfo>;
  edges?: Maybe<Array<Maybe<SubjectsConnectionEdge>>>;
};

export type UuidFilter = {
  operator: UuidOperator;
  value: Scalars["UUID"];
};

export enum UuidOperator {
  Eq = "eq",
  Neq = "neq",
}

export type User = {
  __typename?: "User";
  user_id: Scalars["ID"];
  /** @deprecated Use 'full_name'. */
  user_name?: Maybe<Scalars["String"]>;
  full_name?: Maybe<Scalars["String"]>;
  given_name?: Maybe<Scalars["String"]>;
  family_name?: Maybe<Scalars["String"]>;
  email?: Maybe<Scalars["String"]>;
  phone?: Maybe<Scalars["String"]>;
  date_of_birth?: Maybe<Scalars["String"]>;
  avatar?: Maybe<Scalars["String"]>;
  username?: Maybe<Scalars["String"]>;
  primary?: Maybe<Scalars["Boolean"]>;
  alternate_email?: Maybe<Scalars["String"]>;
  alternate_phone?: Maybe<Scalars["String"]>;
  gender?: Maybe<Scalars["String"]>;
  /**
   * 'my_organization' is the Organization that this user has created
   * @deprecated Use 'organization_ownerships'.
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
  subjectsTeaching?: Maybe<Array<Maybe<Subject>>>;
  set?: Maybe<User>;
  createOrganization?: Maybe<Organization>;
  merge?: Maybe<User>;
  addOrganization?: Maybe<OrganizationMembership>;
  addSchool?: Maybe<SchoolMembership>;
  setPrimary?: Maybe<Scalars["Boolean"]>;
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
  username?: Maybe<Scalars["String"]>;
  date_of_birth?: Maybe<Scalars["String"]>;
  gender?: Maybe<Scalars["String"]>;
  avatar?: Maybe<Scalars["String"]>;
  alternate_email?: Maybe<Scalars["String"]>;
  alternate_phone?: Maybe<Scalars["String"]>;
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

export type UserSetPrimaryArgs = {
  _?: Maybe<Scalars["Int"]>;
};

export type UserConnectionNode = {
  __typename?: "UserConnectionNode";
  id: Scalars["ID"];
  givenName?: Maybe<Scalars["String"]>;
  familyName?: Maybe<Scalars["String"]>;
  avatar?: Maybe<Scalars["String"]>;
  contactInfo: ContactInfo;
  alternateContactInfo?: Maybe<ContactInfo>;
  organizations: Array<OrganizationSummaryNode>;
  roles: Array<RoleSummaryNode>;
  schools: Array<SchoolSummaryNode>;
  status: Status;
};

export type UserFilter = {
  userId?: Maybe<UuidFilter>;
  givenName?: Maybe<StringFilter>;
  familyName?: Maybe<StringFilter>;
  avatar?: Maybe<StringFilter>;
  email?: Maybe<StringFilter>;
  phone?: Maybe<StringFilter>;
  organizationId?: Maybe<UuidFilter>;
  roleId?: Maybe<UuidFilter>;
  schoolId?: Maybe<UuidFilter>;
  organizationUserStatus?: Maybe<StringFilter>;
  classId?: Maybe<UuidFilter>;
  AND?: Maybe<Array<UserFilter>>;
  OR?: Maybe<Array<UserFilter>>;
};

export enum UserSortBy {
  GivenName = "givenName",
  FamilyName = "familyName",
}

export type UserSortInput = {
  field: Array<UserSortBy>;
  order: SortOrder;
};

export type UsersConnectionEdge = IConnectionEdge & {
  __typename?: "UsersConnectionEdge";
  cursor?: Maybe<Scalars["String"]>;
  node?: Maybe<UserConnectionNode>;
};

export type UsersConnectionResponse = IConnectionResponse & {
  __typename?: "UsersConnectionResponse";
  totalCount?: Maybe<Scalars["Int"]>;
  pageInfo?: Maybe<ConnectionPageInfo>;
  edges?: Maybe<Array<Maybe<UsersConnectionEdge>>>;
};

export type IConnectionEdge = {
  cursor?: Maybe<Scalars["String"]>;
};

export type IConnectionResponse = {
  totalCount?: Maybe<Scalars["Int"]>;
  pageInfo?: Maybe<ConnectionPageInfo>;
};
