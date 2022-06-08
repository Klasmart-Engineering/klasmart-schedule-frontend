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
  /** Datetime following the ISO-8601 format */
  Date: any;
  HexColor: any;
  /** The number of results to return per page */
  PageSize: any;
  /** The `UUID` scalar type represents UUID values as specified by [RFC 4122](https://tools.ietf.org/html/rfc4122). */
  UUID: any;
  Upload: any;
  Url: any;
  _Any: any;
};

export type AcademicTermConnectionNode = {
  __typename?: "AcademicTermConnectionNode";
  endDate: Scalars["Date"];
  id: Scalars["ID"];
  name: Scalars["String"];
  school: SchoolConnectionNode;
  startDate: Scalars["Date"];
  status: Status;
};

export type AcademicTermFilter = {
  AND?: Maybe<Array<Maybe<AcademicTermFilter>>>;
  OR?: Maybe<Array<Maybe<AcademicTermFilter>>>;
  id?: Maybe<UuidFilter>;
  name?: Maybe<StringFilter>;
  status?: Maybe<StringFilter>;
};

export enum AcademicTermSortBy {
  EndDate = "endDate",
  Id = "id",
  Name = "name",
  StartDate = "startDate",
}

export type AcademicTermSortInput = {
  field: Array<AcademicTermSortBy>;
  order: SortOrder;
};

export type AcademicTermsConnectionEdge = IConnectionEdge & {
  __typename?: "AcademicTermsConnectionEdge";
  cursor?: Maybe<Scalars["String"]>;
  node?: Maybe<AcademicTermConnectionNode>;
};

export type AcademicTermsConnectionResponse = IConnectionResponse & {
  __typename?: "AcademicTermsConnectionResponse";
  edges?: Maybe<Array<Maybe<AcademicTermsConnectionEdge>>>;
  pageInfo?: Maybe<ConnectionPageInfo>;
  totalCount?: Maybe<Scalars["Int"]>;
};

export type AcademicTermsMutationResult = {
  __typename?: "AcademicTermsMutationResult";
  academicTerms: Array<AcademicTermConnectionNode>;
};

export type AddAgeRangesToClassInput = {
  ageRangeIds: Array<Scalars["ID"]>;
  classId: Scalars["ID"];
};

export type AddClassesToSchoolInput = {
  classIds: Array<Scalars["ID"]>;
  schoolId: Scalars["ID"];
};

export type AddGradesToClassInput = {
  classId: Scalars["ID"];
  gradeIds: Array<Scalars["ID"]>;
};

export type AddOrganizationRolesToUserInput = {
  organizationId: Scalars["ID"];
  roleIds: Array<Scalars["ID"]>;
  userId: Scalars["ID"];
};

export type AddProgramsToClassInput = {
  classId: Scalars["ID"];
  programIds: Array<Scalars["ID"]>;
};

export type AddProgramsToSchoolInput = {
  programIds: Array<Scalars["ID"]>;
  schoolId: Scalars["ID"];
};

export type AddSchoolRolesToUserInput = {
  roleIds: Array<Scalars["ID"]>;
  schoolId: Scalars["ID"];
  userId: Scalars["ID"];
};

export type AddStudentsToClassInput = {
  classId: Scalars["ID"];
  studentIds: Array<Scalars["ID"]>;
};

export type AddSubcategoriesToCategoryInput = {
  categoryId: Scalars["ID"];
  subcategoryIds: Array<Scalars["ID"]>;
};

export type AddSubjectsToClassInput = {
  classId: Scalars["ID"];
  subjectIds: Array<Scalars["ID"]>;
};

export type AddTeachersToClassInput = {
  classId: Scalars["ID"];
  teacherIds: Array<Scalars["ID"]>;
};

export type AddUsersToOrganizationInput = {
  organizationId: Scalars["ID"];
  organizationRoleIds: Array<Scalars["ID"]>;
  shortcode?: Maybe<Scalars["String"]>;
  userIds: Array<Scalars["ID"]>;
};

export type AddUsersToSchoolInput = {
  schoolId: Scalars["ID"];
  schoolRoleIds?: Maybe<Array<Scalars["ID"]>>;
  userIds: Array<Scalars["ID"]>;
};

export type AgeRange = {
  __typename?: "AgeRange";
  /** @deprecated Sunset Date: 30/08/2022 Details: https://calmisland.atlassian.net/l/c/W8zhP5g1 */
  delete?: Maybe<Scalars["Boolean"]>;
  high_value: Scalars["Int"];
  high_value_unit: AgeRangeUnit;
  id: Scalars["ID"];
  low_value: Scalars["Int"];
  low_value_unit: AgeRangeUnit;
  name: Scalars["String"];
  status?: Maybe<Status>;
  system: Scalars["Boolean"];
};

export type AgeRangeDeleteArgs = {
  _?: Maybe<Scalars["Int"]>;
};

export type AgeRangeConnectionNode = {
  __typename?: "AgeRangeConnectionNode";
  highValue: Scalars["Int"];
  highValueUnit: AgeRangeUnit;
  id: Scalars["ID"];
  lowValue: Scalars["Int"];
  lowValueUnit: AgeRangeUnit;
  name?: Maybe<Scalars["String"]>;
  status: Status;
  system: Scalars["Boolean"];
};

export type AgeRangeDetail = {
  high_value?: Maybe<Scalars["Int"]>;
  high_value_unit?: Maybe<AgeRangeUnit>;
  id?: Maybe<Scalars["ID"]>;
  low_value?: Maybe<Scalars["Int"]>;
  low_value_unit?: Maybe<AgeRangeUnit>;
  name?: Maybe<Scalars["String"]>;
  system?: Maybe<Scalars["Boolean"]>;
};

export type AgeRangeFilter = {
  AND?: Maybe<Array<AgeRangeFilter>>;
  OR?: Maybe<Array<AgeRangeFilter>>;
  ageRangeUnitFrom?: Maybe<AgeRangeUnitFilter>;
  ageRangeUnitTo?: Maybe<AgeRangeUnitFilter>;
  ageRangeValueFrom?: Maybe<AgeRangeValueFilter>;
  ageRangeValueTo?: Maybe<AgeRangeValueFilter>;
  organizationId?: Maybe<UuidFilter>;
  programId?: Maybe<UuidFilter>;
  status?: Maybe<StringFilter>;
  system?: Maybe<BooleanFilter>;
};

export enum AgeRangeSortBy {
  HighValue = "highValue",
  HighValueUnit = "highValueUnit",
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
  Month = "month",
  Year = "year",
}

export type AgeRangeUnitFilter = {
  operator: UuidOperator;
  value: AgeRangeUnit;
};

export type AgeRangeValue = {
  unit: AgeRangeUnit;
  value: Scalars["Int"];
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
  edges?: Maybe<Array<Maybe<AgeRangesConnectionEdge>>>;
  pageInfo?: Maybe<ConnectionPageInfo>;
  totalCount?: Maybe<Scalars["Int"]>;
};

export type AgeRangesMutationResult = {
  __typename?: "AgeRangesMutationResult";
  ageRanges: Array<AgeRangeConnectionNode>;
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

export type CategoriesConnectionEdge = IConnectionEdge & {
  __typename?: "CategoriesConnectionEdge";
  cursor?: Maybe<Scalars["String"]>;
  node?: Maybe<CategoryConnectionNode>;
};

export type CategoriesConnectionResponse = IConnectionResponse & {
  __typename?: "CategoriesConnectionResponse";
  edges?: Maybe<Array<Maybe<CategoriesConnectionEdge>>>;
  pageInfo?: Maybe<ConnectionPageInfo>;
  totalCount?: Maybe<Scalars["Int"]>;
};

export type CategoriesMutationResult = {
  __typename?: "CategoriesMutationResult";
  categories: Array<CategoryConnectionNode>;
};

export type Category = {
  __typename?: "Category";
  /** @deprecated Sunset Date: 24/02/2022 Details: https://calmisland.atlassian.net/l/c/mTni58mA */
  delete?: Maybe<Scalars["Boolean"]>;
  /** @deprecated Sunset Date: 22/02/2022 Details: https://calmisland.atlassian.net/l/c/U107XwHS */
  editSubcategories?: Maybe<Array<Maybe<Subcategory>>>;
  id: Scalars["ID"];
  name: Scalars["String"];
  status?: Maybe<Status>;
  /** @deprecated Sunset Date: 06/03/2022 Details: https://calmisland.atlassian.net/wiki/spaces/ATZ/pages/2473459840 */
  subcategories?: Maybe<Array<Subcategory>>;
  system: Scalars["Boolean"];
};

export type CategoryDeleteArgs = {
  _?: Maybe<Scalars["Int"]>;
};

export type CategoryEditSubcategoriesArgs = {
  subcategory_ids?: Maybe<Array<Scalars["ID"]>>;
};

export type CategoryConnectionNode = {
  __typename?: "CategoryConnectionNode";
  id: Scalars["ID"];
  name?: Maybe<Scalars["String"]>;
  status: Status;
  subcategoriesConnection?: Maybe<SubcategoriesConnectionResponse>;
  subjectsConnection?: Maybe<SubjectsConnectionResponse>;
  system: Scalars["Boolean"];
};

export type CategoryConnectionNodeSubcategoriesConnectionArgs = {
  count?: Maybe<Scalars["PageSize"]>;
  cursor?: Maybe<Scalars["String"]>;
  direction?: Maybe<ConnectionDirection>;
  filter?: Maybe<SubcategoryFilter>;
  sort?: Maybe<SubcategorySortInput>;
};

export type CategoryConnectionNodeSubjectsConnectionArgs = {
  count?: Maybe<Scalars["PageSize"]>;
  cursor?: Maybe<Scalars["String"]>;
  direction?: Maybe<ConnectionDirection>;
  filter?: Maybe<SubjectFilter>;
  sort?: Maybe<SubjectSortInput>;
};

export type CategoryDetail = {
  id?: Maybe<Scalars["ID"]>;
  name?: Maybe<Scalars["String"]>;
  subcategories?: Maybe<Array<Scalars["ID"]>>;
  system?: Maybe<Scalars["Boolean"]>;
};

export type CategoryFilter = {
  AND?: Maybe<Array<Maybe<CategoryFilter>>>;
  OR?: Maybe<Array<Maybe<CategoryFilter>>>;
  status?: Maybe<StringFilter>;
  system?: Maybe<BooleanFilter>;
};

export enum CategorySortBy {
  Id = "id",
  Name = "name",
}

export type CategorySortInput = {
  field: CategorySortBy;
  order: SortOrder;
};

export type Class = {
  __typename?: "Class";
  /** @deprecated Sunset Date: 06/03/2022 Details: https://calmisland.atlassian.net/l/c/av1p2bKY */
  addSchool?: Maybe<School>;
  /** @deprecated Sunset Date: 24/04/2022 Details: https://calmisland.atlassian.net/l/c/av1p2bKY */
  addStudent?: Maybe<User>;
  addTeacher?: Maybe<User>;
  age_ranges?: Maybe<Array<AgeRange>>;
  class_id: Scalars["ID"];
  class_name?: Maybe<Scalars["String"]>;
  /** @deprecated Use deleteClasses() method */
  delete?: Maybe<Scalars["Boolean"]>;
  editAgeRanges?: Maybe<Array<Maybe<AgeRange>>>;
  editGrades?: Maybe<Array<Maybe<Grade>>>;
  /** @deprecated Sunset Date: 06/03/2022 Details: https://calmisland.atlassian.net/l/c/av1p2bKY */
  editPrograms?: Maybe<Array<Maybe<Program>>>;
  editSchools?: Maybe<Array<Maybe<School>>>;
  editStudents?: Maybe<Array<Maybe<User>>>;
  editSubjects?: Maybe<Array<Maybe<Subject>>>;
  editTeachers?: Maybe<Array<Maybe<User>>>;
  /** @deprecated Sunset Date: 31/03/2022 Details: [https://calmisland.atlassian.net/wiki/spaces/ATZ/pages/2478735554] */
  eligibleStudents?: Maybe<Array<Maybe<User>>>;
  /** @deprecated Sunset Date: 31/03/2022 Details: [https://calmisland.atlassian.net/wiki/spaces/ATZ/pages/2478735554] */
  eligibleTeachers?: Maybe<Array<Maybe<User>>>;
  grades?: Maybe<Array<Grade>>;
  organization?: Maybe<Organization>;
  programs?: Maybe<Array<Program>>;
  removeSchool?: Maybe<Scalars["Boolean"]>;
  removeStudent?: Maybe<Scalars["Boolean"]>;
  removeTeacher?: Maybe<Scalars["Boolean"]>;
  schools?: Maybe<Array<Maybe<School>>>;
  set?: Maybe<Class>;
  shortcode?: Maybe<Scalars["String"]>;
  status?: Maybe<Status>;
  students?: Maybe<Array<Maybe<User>>>;
  subjects?: Maybe<Array<Subject>>;
  teachers?: Maybe<Array<Maybe<User>>>;
};

export type ClassAddSchoolArgs = {
  school_id: Scalars["ID"];
};

export type ClassAddStudentArgs = {
  user_id: Scalars["ID"];
};

export type ClassAddTeacherArgs = {
  user_id: Scalars["ID"];
};

export type ClassDeleteArgs = {
  _?: Maybe<Scalars["Int"]>;
};

export type ClassEditAgeRangesArgs = {
  age_range_ids?: Maybe<Array<Scalars["ID"]>>;
};

export type ClassEditGradesArgs = {
  grade_ids?: Maybe<Array<Scalars["ID"]>>;
};

export type ClassEditProgramsArgs = {
  program_ids?: Maybe<Array<Scalars["ID"]>>;
};

export type ClassEditSchoolsArgs = {
  school_ids?: Maybe<Array<Scalars["ID"]>>;
};

export type ClassEditStudentsArgs = {
  student_ids?: Maybe<Array<Scalars["ID"]>>;
};

export type ClassEditSubjectsArgs = {
  subject_ids?: Maybe<Array<Scalars["ID"]>>;
};

export type ClassEditTeachersArgs = {
  teacher_ids?: Maybe<Array<Scalars["ID"]>>;
};

export type ClassRemoveSchoolArgs = {
  school_id: Scalars["ID"];
};

export type ClassRemoveStudentArgs = {
  user_id: Scalars["ID"];
};

export type ClassRemoveTeacherArgs = {
  user_id: Scalars["ID"];
};

export type ClassSetArgs = {
  class_name?: Maybe<Scalars["String"]>;
  shortcode?: Maybe<Scalars["String"]>;
};

export type ClassConnectionNode = {
  __typename?: "ClassConnectionNode";
  academicTerm?: Maybe<AcademicTermConnectionNode>;
  /** @deprecated Sunset Date: 06/03/2022 Details: https://calmisland.atlassian.net/wiki/spaces/ATZ/pages/2473459840 */
  ageRanges?: Maybe<Array<AgeRangeConnectionNode>>;
  ageRangesConnection?: Maybe<AgeRangesConnectionResponse>;
  /** @deprecated Sunset Date: 06/03/2022 Details: https://calmisland.atlassian.net/wiki/spaces/ATZ/pages/2473459840 */
  grades?: Maybe<Array<GradeSummaryNode>>;
  gradesConnection?: Maybe<GradesConnectionResponse>;
  id: Scalars["ID"];
  name?: Maybe<Scalars["String"]>;
  /** @deprecated Sunset Date: 01/03/22 Details: https://calmisland.atlassian.net/l/c/aaSJnmbQ */
  programs?: Maybe<Array<CoreProgramConnectionNode>>;
  programsConnection?: Maybe<ProgramsConnectionResponse>;
  /** @deprecated Sunset Date: 06/03/2022 Details: https://calmisland.atlassian.net/wiki/spaces/ATZ/pages/2473459840 */
  schools?: Maybe<Array<SchoolSummaryNode>>;
  schoolsConnection?: Maybe<SchoolsConnectionResponse>;
  shortCode?: Maybe<Scalars["String"]>;
  status: Status;
  studentsConnection?: Maybe<UsersConnectionResponse>;
  /** @deprecated Sunset Date: 07/03/2022 Details: https://calmisland.atlassian.net/l/c/Ts9fp60C */
  subjects?: Maybe<Array<CoreSubjectConnectionNode>>;
  subjectsConnection?: Maybe<SubjectsConnectionResponse>;
  teachersConnection?: Maybe<UsersConnectionResponse>;
};

export type ClassConnectionNodeAgeRangesConnectionArgs = {
  count?: Maybe<Scalars["PageSize"]>;
  cursor?: Maybe<Scalars["String"]>;
  direction: ConnectionDirection;
  filter?: Maybe<AgeRangeFilter>;
  sort?: Maybe<AgeRangeSortInput>;
};

export type ClassConnectionNodeGradesConnectionArgs = {
  count?: Maybe<Scalars["PageSize"]>;
  cursor?: Maybe<Scalars["String"]>;
  direction?: Maybe<ConnectionDirection>;
  filter?: Maybe<GradeFilter>;
  sort?: Maybe<GradeSortInput>;
};

export type ClassConnectionNodeProgramsConnectionArgs = {
  count?: Maybe<Scalars["PageSize"]>;
  cursor?: Maybe<Scalars["String"]>;
  direction?: Maybe<ConnectionDirection>;
  filter?: Maybe<ProgramFilter>;
  sort?: Maybe<ProgramSortInput>;
};

export type ClassConnectionNodeSchoolsConnectionArgs = {
  count?: Maybe<Scalars["PageSize"]>;
  cursor?: Maybe<Scalars["String"]>;
  direction?: Maybe<ConnectionDirection>;
  filter?: Maybe<SchoolFilter>;
  sort?: Maybe<SchoolSortInput>;
};

export type ClassConnectionNodeStudentsConnectionArgs = {
  count?: Maybe<Scalars["PageSize"]>;
  cursor?: Maybe<Scalars["String"]>;
  direction?: Maybe<ConnectionDirection>;
  filter?: Maybe<UserFilter>;
  sort?: Maybe<UserSortInput>;
};

export type ClassConnectionNodeSubjectsConnectionArgs = {
  count?: Maybe<Scalars["PageSize"]>;
  cursor?: Maybe<Scalars["String"]>;
  direction?: Maybe<ConnectionDirection>;
  filter?: Maybe<SubjectFilter>;
  sort?: Maybe<SubjectSortInput>;
};

export type ClassConnectionNodeTeachersConnectionArgs = {
  count?: Maybe<Scalars["PageSize"]>;
  cursor?: Maybe<Scalars["String"]>;
  direction?: Maybe<ConnectionDirection>;
  filter?: Maybe<UserFilter>;
  sort?: Maybe<UserSortInput>;
};

export type ClassFilter = {
  AND?: Maybe<Array<ClassFilter>>;
  OR?: Maybe<Array<ClassFilter>>;
  academicTermId?: Maybe<UuidExclusiveFilter>;
  ageRangeUnitFrom?: Maybe<AgeRangeUnitFilter>;
  ageRangeUnitTo?: Maybe<AgeRangeUnitFilter>;
  ageRangeValueFrom?: Maybe<AgeRangeValueFilter>;
  ageRangeValueTo?: Maybe<AgeRangeValueFilter>;
  gradeId?: Maybe<UuidFilter>;
  id?: Maybe<UuidFilter>;
  name?: Maybe<StringFilter>;
  organizationId?: Maybe<UuidFilter>;
  programId?: Maybe<UuidFilter>;
  schoolId?: Maybe<UuidExclusiveFilter>;
  status?: Maybe<StringFilter>;
  studentId?: Maybe<UuidFilter>;
  subjectId?: Maybe<UuidFilter>;
  teacherId?: Maybe<UuidFilter>;
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
  edges?: Maybe<Array<Maybe<ClassesConnectionEdge>>>;
  pageInfo?: Maybe<ConnectionPageInfo>;
  totalCount?: Maybe<Scalars["Int"]>;
};

export type ClassesMutationResult = {
  __typename?: "ClassesMutationResult";
  classes: Array<ClassConnectionNode>;
};

export type Complexity = {
  __typename?: "Complexity";
  limit?: Maybe<Scalars["Int"]>;
  score?: Maybe<Scalars["Int"]>;
};

export enum ConnectionDirection {
  Backward = "BACKWARD",
  Forward = "FORWARD",
}

export type ConnectionPageInfo = {
  __typename?: "ConnectionPageInfo";
  endCursor?: Maybe<Scalars["String"]>;
  hasNextPage?: Maybe<Scalars["Boolean"]>;
  hasPreviousPage?: Maybe<Scalars["Boolean"]>;
  startCursor?: Maybe<Scalars["String"]>;
};

export type ConnectionsDirectionArgs = {
  count?: Maybe<Scalars["PageSize"]>;
  cursor?: Maybe<Scalars["String"]>;
};

export type ContactInfo = {
  __typename?: "ContactInfo";
  email?: Maybe<Scalars["String"]>;
  phone?: Maybe<Scalars["String"]>;
  username?: Maybe<Scalars["String"]>;
};

export type ContactInfoInput = {
  email?: Maybe<Scalars["String"]>;
  phone?: Maybe<Scalars["String"]>;
};

export type CoreProgramConnectionNode = {
  __typename?: "CoreProgramConnectionNode";
  id: Scalars["ID"];
  name?: Maybe<Scalars["String"]>;
  status: Status;
  system: Scalars["Boolean"];
};

export type CoreSubjectConnectionNode = {
  __typename?: "CoreSubjectConnectionNode";
  id: Scalars["ID"];
  name?: Maybe<Scalars["String"]>;
  status: Status;
  system: Scalars["Boolean"];
};

export type CreateAcademicTermInput = {
  endDate: Scalars["Date"];
  name: Scalars["String"];
  schoolId: Scalars["ID"];
  startDate: Scalars["Date"];
};

export type CreateCategoryInput = {
  name: Scalars["String"];
  organizationId: Scalars["ID"];
  subcategoryIds?: Maybe<Array<Scalars["ID"]>>;
};

export type CreateClassInput = {
  name: Scalars["String"];
  organizationId: Scalars["ID"];
  shortcode?: Maybe<Scalars["String"]>;
};

export type CreateOrganizationInput = {
  address1?: Maybe<Scalars["String"]>;
  address2?: Maybe<Scalars["String"]>;
  organizationName: Scalars["String"];
  phone?: Maybe<Scalars["String"]>;
  shortcode?: Maybe<Scalars["String"]>;
  /**
   * A user who will become the organization's owner.
   * Must not already own an organization.
   */
  userId: Scalars["ID"];
};

export type CreateProgramInput = {
  ageRangeIds: Array<Scalars["ID"]>;
  gradeIds: Array<Scalars["ID"]>;
  name: Scalars["String"];
  organizationId: Scalars["ID"];
  subjectIds: Array<Scalars["ID"]>;
};

export type CreateRoleInput = {
  organizationId: Scalars["ID"];
  roleDescription: Scalars["String"];
  roleName: Scalars["String"];
};

export type CreateSchoolInput = {
  name: Scalars["String"];
  organizationId: Scalars["String"];
  shortCode?: Maybe<Scalars["String"]>;
};

export type CreateSubcategoryInput = {
  name: Scalars["String"];
  organizationId: Scalars["ID"];
};

export type CreateSubjectInput = {
  categoryIds?: Maybe<Array<Scalars["ID"]>>;
  name: Scalars["String"];
  organizationId: Scalars["ID"];
};

export type CreateUserInput = {
  alternateEmail?: Maybe<Scalars["String"]>;
  alternatePhone?: Maybe<Scalars["String"]>;
  contactInfo?: Maybe<ContactInfoInput>;
  dateOfBirth?: Maybe<Scalars["String"]>;
  familyName: Scalars["String"];
  gender: Scalars["String"];
  givenName: Scalars["String"];
  username?: Maybe<Scalars["String"]>;
};

export type DateFilter = {
  operator: NumberOrDateOperator;
  value: Scalars["String"];
};

export type DeleteAcademicTermInput = {
  id: Scalars["ID"];
};

export type DeleteAgeRangeInput = {
  id: Scalars["ID"];
};

export type DeleteCategoryInput = {
  id: Scalars["ID"];
};

export type DeleteClassInput = {
  id: Scalars["ID"];
};

export type DeleteGradeInput = {
  id: Scalars["ID"];
};

export type DeleteProgramInput = {
  id: Scalars["ID"];
};

export type DeleteRoleInput = {
  id: Scalars["ID"];
};

export type DeleteSchoolInput = {
  id: Scalars["ID"];
};

export type DeleteSubcategoryInput = {
  id: Scalars["ID"];
};

export type DeleteSubjectInput = {
  id: Scalars["ID"];
};

export type DeleteUsersFromOrganizationInput = {
  organizationId: Scalars["ID"];
  userIds: Array<Scalars["ID"]>;
};

export type DeleteUsersFromSchoolInput = {
  schoolId: Scalars["ID"];
  userIds: Array<Scalars["ID"]>;
};

export type EligibleMembersFilter = {
  AND?: Maybe<Array<EligibleMembersFilter>>;
  OR?: Maybe<Array<EligibleMembersFilter>>;
  email?: Maybe<StringFilter>;
  familyName?: Maybe<StringFilter>;
  givenName?: Maybe<StringFilter>;
  phone?: Maybe<StringFilter>;
  username?: Maybe<StringFilter>;
};

export type File = {
  __typename?: "File";
  encoding: Scalars["String"];
  filename: Scalars["String"];
  mimetype: Scalars["String"];
};

export type Grade = {
  __typename?: "Grade";
  /** @deprecated Sunset Date: 08/30/2022 Details: https://calmisland.atlassian.net/l/c/XopY1izU */
  delete?: Maybe<Scalars["Boolean"]>;
  id: Scalars["ID"];
  name: Scalars["String"];
  progress_from_grade?: Maybe<Grade>;
  progress_to_grade?: Maybe<Grade>;
  status?: Maybe<Status>;
  system: Scalars["Boolean"];
};

export type GradeDeleteArgs = {
  _?: Maybe<Scalars["Int"]>;
};

export type GradeConnectionNode = {
  __typename?: "GradeConnectionNode";
  fromGrade: GradeSummaryNode;
  id: Scalars["ID"];
  name?: Maybe<Scalars["String"]>;
  status: Status;
  system: Scalars["Boolean"];
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
  AND?: Maybe<Array<GradeFilter>>;
  OR?: Maybe<Array<GradeFilter>>;
  fromGradeId?: Maybe<UuidFilter>;
  id?: Maybe<UuidFilter>;
  name?: Maybe<StringFilter>;
  organizationId?: Maybe<UuidFilter>;
  programId?: Maybe<UuidFilter>;
  status?: Maybe<StringFilter>;
  system?: Maybe<BooleanFilter>;
  toGradeId?: Maybe<UuidFilter>;
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
  edges?: Maybe<Array<Maybe<GradesConnectionEdge>>>;
  pageInfo?: Maybe<ConnectionPageInfo>;
  totalCount?: Maybe<Scalars["Int"]>;
};

export type GradesMutationResult = {
  __typename?: "GradesMutationResult";
  grades: Array<GradeConnectionNode>;
};

export enum LogicalOperator {
  And = "AND",
  Or = "OR",
}

export type MembershipUpdate = {
  __typename?: "MembershipUpdate";
  membership?: Maybe<OrganizationMembership>;
  schoolMemberships?: Maybe<Array<Maybe<SchoolMembership>>>;
  user?: Maybe<User>;
};

export type MoveUsersToClassInput = {
  fromClassId: Scalars["ID"];
  toClassId: Scalars["ID"];
  userIds: Array<Scalars["ID"]>;
};

export type MoveUsersToClassMutationResult = {
  __typename?: "MoveUsersToClassMutationResult";
  fromClass: ClassConnectionNode;
  toClass: ClassConnectionNode;
};

export type Mutation = {
  __typename?: "Mutation";
  addAgeRangesToClasses?: Maybe<ClassesMutationResult>;
  addClassesToSchools?: Maybe<SchoolsMutationResult>;
  addGradesToClasses?: Maybe<ClassesMutationResult>;
  addOrganizationRolesToUsers?: Maybe<UsersMutationResult>;
  addProgramsToClasses?: Maybe<ClassesMutationResult>;
  addProgramsToSchools?: Maybe<SchoolsMutationResult>;
  addSchoolRolesToUsers?: Maybe<UsersMutationResult>;
  addStudentsToClasses?: Maybe<ClassesMutationResult>;
  addSubcategoriesToCategories?: Maybe<CategoriesMutationResult>;
  addSubjectsToClasses?: Maybe<ClassesMutationResult>;
  addTeachersToClasses?: Maybe<ClassesMutationResult>;
  addUsersToOrganizations?: Maybe<OrganizationsMutationResult>;
  addUsersToSchools?: Maybe<SchoolsMutationResult>;
  /** @deprecated Sunset Date: 30/08/2022 Details: https://calmisland.atlassian.net/l/c/W8zhP5g1 */
  age_range?: Maybe<AgeRange>;
  /** @deprecated Sunset Date: 24/02/2022 Details: [https://calmisland.atlassian.net/l/c/RKcPTt1p, https://calmisland.atlassian.net/l/c/mTni58mA] */
  category?: Maybe<Category>;
  class?: Maybe<Class>;
  classes?: Maybe<Array<Maybe<Class>>>;
  createAcademicTerms?: Maybe<AcademicTermsMutationResult>;
  createCategories?: Maybe<CategoriesMutationResult>;
  createClasses?: Maybe<ClassesMutationResult>;
  /**
   * Creates a new organization, and makes the user its
   * owner as well as a member of the organization.
   */
  createOrganizations?: Maybe<OrganizationsMutationResult>;
  createPrograms?: Maybe<ProgramsMutationResult>;
  createRoles?: Maybe<RolesMutationResult>;
  createSchools?: Maybe<SchoolsMutationResult>;
  createSubcategories?: Maybe<SubcategoriesMutationResult>;
  createSubjects?: Maybe<SubjectsMutationResult>;
  createUsers?: Maybe<UsersMutationResult>;
  deleteAcademicTerms?: Maybe<AcademicTermsMutationResult>;
  deleteAgeRanges?: Maybe<AgeRangesMutationResult>;
  deleteBrandingColor?: Maybe<Scalars["Boolean"]>;
  deleteBrandingImage?: Maybe<Scalars["Boolean"]>;
  deleteCategories?: Maybe<CategoriesMutationResult>;
  deleteClasses?: Maybe<ClassesMutationResult>;
  deleteGrades?: Maybe<GradesMutationResult>;
  deletePrograms?: Maybe<ProgramsMutationResult>;
  deleteRoles?: Maybe<RolesMutationResult>;
  deleteSchools?: Maybe<SchoolsMutationResult>;
  deleteSubcategories?: Maybe<SubcategoriesMutationResult>;
  deleteSubjects?: Maybe<SubjectsMutationResult>;
  /**
   * Deletes users from an organization. They will
   * be treated as if they had never been part of the organizaton.
   * Membership data may not be maintained.
   */
  deleteUsersFromOrganizations?: Maybe<OrganizationsMutationResult>;
  /**
   * Deletes users from a School. They will
   * be treated as if they had never been part of the school.
   * Membership data may not be maintained.
   */
  deleteUsersFromSchools?: Maybe<SchoolsMutationResult>;
  grade?: Maybe<Grade>;
  /** @deprecated Sunset Date: 01/09/22 Details: https://calmisland.atlassian.net/wiki/spaces/UserService/pages/2704867356 */
  me?: Maybe<User>;
  moveStudentsToClass?: Maybe<MoveUsersToClassMutationResult>;
  moveTeachersToClass?: Maybe<MoveUsersToClassMutationResult>;
  /** @deprecated Use the inviteUser() method */
  newUser?: Maybe<User>;
  organization?: Maybe<Organization>;
  /** @deprecated Sunset Date: 08/08/2022 Details: https://calmisland.atlassian.net/wiki/spaces/ATZ/pages/2669379612. */
  program?: Maybe<Program>;
  /**
   * Reactivates users for an organization who were inactivated via removeUsersFromOrganizations
   * They will have the same roles they had at the time of removal.
   */
  reactivateUsersFromOrganizations?: Maybe<OrganizationsMutationResult>;
  /**
   * Reactivates users in a school who were previously removed via removeUsersFromSchools.
   * They will have the same roles they had at the time of removal.
   */
  reactivateUsersFromSchools?: Maybe<SchoolsMutationResult>;
  removeAgeRangesFromClasses?: Maybe<ClassesMutationResult>;
  removeClassesFromSchools?: Maybe<SchoolsMutationResult>;
  removeOrganizationRolesFromUsers?: Maybe<UsersMutationResult>;
  removeProgramsFromClasses?: Maybe<ClassesMutationResult>;
  removeProgramsFromSchools?: Maybe<SchoolsMutationResult>;
  removeSchoolRolesFromUsers?: Maybe<UsersMutationResult>;
  removeStudentsFromClasses?: Maybe<ClassesMutationResult>;
  removeSubcategoriesFromCategories?: Maybe<CategoriesMutationResult>;
  removeSubjectsFromClasses?: Maybe<ClassesMutationResult>;
  removeTeachersFromClasses?: Maybe<ClassesMutationResult>;
  /**
   * Inactivates users in an organization. Their membership data
   * will be maintained and can be restored with reactivateUsersFromOrganizations.
   */
  removeUsersFromOrganizations?: Maybe<OrganizationsMutationResult>;
  /**
   * Inactivates users in a School. Their membership data
   * will be maintained and can be restored with reactivateUsersFromSchools.
   */
  removeUsersFromSchools?: Maybe<SchoolsMutationResult>;
  renameDuplicateGrades?: Maybe<Scalars["Boolean"]>;
  renameDuplicateOrganizations?: Maybe<Scalars["Boolean"]>;
  renameDuplicateSubjects?: Maybe<Scalars["Boolean"]>;
  replaceRole?: Maybe<Role>;
  role?: Maybe<Role>;
  /** @deprecated Sunset Date: 09/08/2022 Details: https://calmisland.atlassian.net/l/c/Z7e0ZCzm */
  roles?: Maybe<Array<Maybe<Role>>>;
  /** @deprecated Sunset Date: 26/08/2022 Details: https://calmisland.atlassian.net/l/c/f00eVp51 */
  school?: Maybe<School>;
  /** Note: A null or undefined academicTermId will remove the AcademicTerm from the class */
  setAcademicTermsOfClasses?: Maybe<ClassesMutationResult>;
  setBranding?: Maybe<Branding>;
  /** @deprecated Sunset Date: 22/02/22 Details: https://calmisland.atlassian.net/wiki/spaces/ATZ/pages/2457174175 */
  subcategory?: Maybe<Subcategory>;
  /** @deprecated Sunset Date: 25/08/2022 Details: https://calmisland.atlassian.net/l/c/85BxNDPR */
  subject?: Maybe<Subject>;
  /** @deprecated Moved to auth service */
  switch_user?: Maybe<User>;
  updateCategories?: Maybe<CategoriesMutationResult>;
  updateClasses?: Maybe<ClassesMutationResult>;
  updatePrograms?: Maybe<ProgramsMutationResult>;
  updateRoles?: Maybe<RolesMutationResult>;
  updateSchools?: Maybe<SchoolsMutationResult>;
  updateSubcategories?: Maybe<SubcategoriesMutationResult>;
  updateSubjects?: Maybe<SubjectsMutationResult>;
  updateUsers?: Maybe<UsersMutationResult>;
  uploadAgeRangesFromCSV?: Maybe<File>;
  uploadCategoriesFromCSV?: Maybe<File>;
  uploadClassesFromCSV?: Maybe<File>;
  uploadGradesFromCSV?: Maybe<File>;
  uploadOrganizationsFromCSV?: Maybe<File>;
  uploadProgramsFromCSV?: Maybe<File>;
  uploadRolesFromCSV?: Maybe<File>;
  uploadSchoolsFromCSV?: Maybe<File>;
  uploadSubCategoriesFromCSV?: Maybe<File>;
  uploadSubjectsFromCSV?: Maybe<File>;
  uploadUsersFromCSV?: Maybe<File>;
  /** @deprecated Sunset Date: 01/09/22 Details: https://calmisland.atlassian.net/wiki/spaces/UserService/pages/2704900487 */
  user?: Maybe<User>;
};

export type MutationAddAgeRangesToClassesArgs = {
  input: Array<AddAgeRangesToClassInput>;
};

export type MutationAddClassesToSchoolsArgs = {
  input: Array<AddClassesToSchoolInput>;
};

export type MutationAddGradesToClassesArgs = {
  input: Array<AddGradesToClassInput>;
};

export type MutationAddOrganizationRolesToUsersArgs = {
  input: Array<AddOrganizationRolesToUserInput>;
};

export type MutationAddProgramsToClassesArgs = {
  input: Array<AddProgramsToClassInput>;
};

export type MutationAddProgramsToSchoolsArgs = {
  input: Array<AddProgramsToSchoolInput>;
};

export type MutationAddSchoolRolesToUsersArgs = {
  input: Array<AddSchoolRolesToUserInput>;
};

export type MutationAddStudentsToClassesArgs = {
  input: Array<AddStudentsToClassInput>;
};

export type MutationAddSubcategoriesToCategoriesArgs = {
  input: Array<AddSubcategoriesToCategoryInput>;
};

export type MutationAddSubjectsToClassesArgs = {
  input: Array<AddSubjectsToClassInput>;
};

export type MutationAddTeachersToClassesArgs = {
  input: Array<AddTeachersToClassInput>;
};

export type MutationAddUsersToOrganizationsArgs = {
  input: Array<AddUsersToOrganizationInput>;
};

export type MutationAddUsersToSchoolsArgs = {
  input: Array<AddUsersToSchoolInput>;
};

export type MutationAge_RangeArgs = {
  id: Scalars["ID"];
};

export type MutationCategoryArgs = {
  id: Scalars["ID"];
};

export type MutationClassArgs = {
  class_id: Scalars["ID"];
};

export type MutationCreateAcademicTermsArgs = {
  input: Array<CreateAcademicTermInput>;
};

export type MutationCreateCategoriesArgs = {
  input: Array<CreateCategoryInput>;
};

export type MutationCreateClassesArgs = {
  input: Array<CreateClassInput>;
};

export type MutationCreateOrganizationsArgs = {
  input: Array<CreateOrganizationInput>;
};

export type MutationCreateProgramsArgs = {
  input: Array<CreateProgramInput>;
};

export type MutationCreateRolesArgs = {
  input: Array<CreateRoleInput>;
};

export type MutationCreateSchoolsArgs = {
  input: Array<CreateSchoolInput>;
};

export type MutationCreateSubcategoriesArgs = {
  input: Array<CreateSubcategoryInput>;
};

export type MutationCreateSubjectsArgs = {
  input: Array<CreateSubjectInput>;
};

export type MutationCreateUsersArgs = {
  input: Array<CreateUserInput>;
};

export type MutationDeleteAcademicTermsArgs = {
  input: Array<DeleteAcademicTermInput>;
};

export type MutationDeleteAgeRangesArgs = {
  input: Array<DeleteAgeRangeInput>;
};

export type MutationDeleteBrandingColorArgs = {
  organizationId: Scalars["ID"];
};

export type MutationDeleteBrandingImageArgs = {
  organizationId: Scalars["ID"];
  type: BrandingImageTag;
};

export type MutationDeleteCategoriesArgs = {
  input: Array<DeleteCategoryInput>;
};

export type MutationDeleteClassesArgs = {
  input: Array<DeleteClassInput>;
};

export type MutationDeleteGradesArgs = {
  input: Array<DeleteGradeInput>;
};

export type MutationDeleteProgramsArgs = {
  input: Array<DeleteProgramInput>;
};

export type MutationDeleteRolesArgs = {
  input: Array<DeleteRoleInput>;
};

export type MutationDeleteSchoolsArgs = {
  input: Array<DeleteSchoolInput>;
};

export type MutationDeleteSubcategoriesArgs = {
  input: Array<DeleteSubcategoryInput>;
};

export type MutationDeleteSubjectsArgs = {
  input: Array<DeleteSubjectInput>;
};

export type MutationDeleteUsersFromOrganizationsArgs = {
  input: Array<DeleteUsersFromOrganizationInput>;
};

export type MutationDeleteUsersFromSchoolsArgs = {
  input: Array<DeleteUsersFromSchoolInput>;
};

export type MutationGradeArgs = {
  id: Scalars["ID"];
};

export type MutationMoveStudentsToClassArgs = {
  input?: Maybe<MoveUsersToClassInput>;
};

export type MutationMoveTeachersToClassArgs = {
  input?: Maybe<MoveUsersToClassInput>;
};

export type MutationNewUserArgs = {
  avatar?: Maybe<Scalars["String"]>;
  date_of_birth?: Maybe<Scalars["String"]>;
  email?: Maybe<Scalars["String"]>;
  family_name?: Maybe<Scalars["String"]>;
  gender?: Maybe<Scalars["String"]>;
  given_name?: Maybe<Scalars["String"]>;
  phone?: Maybe<Scalars["String"]>;
  username?: Maybe<Scalars["String"]>;
};

export type MutationOrganizationArgs = {
  address1?: Maybe<Scalars["String"]>;
  address2?: Maybe<Scalars["String"]>;
  organization_id: Scalars["ID"];
  organization_name?: Maybe<Scalars["String"]>;
  phone?: Maybe<Scalars["String"]>;
  shortCode?: Maybe<Scalars["String"]>;
};

export type MutationProgramArgs = {
  id: Scalars["ID"];
};

export type MutationReactivateUsersFromOrganizationsArgs = {
  input: Array<ReactivateUsersFromOrganizationInput>;
};

export type MutationReactivateUsersFromSchoolsArgs = {
  input: Array<ReactivateUsersFromSchoolInput>;
};

export type MutationRemoveAgeRangesFromClassesArgs = {
  input: Array<RemoveAgeRangesFromClassInput>;
};

export type MutationRemoveClassesFromSchoolsArgs = {
  input: Array<RemoveClassesFromSchoolInput>;
};

export type MutationRemoveOrganizationRolesFromUsersArgs = {
  input: Array<RemoveOrganizationRolesFromUserInput>;
};

export type MutationRemoveProgramsFromClassesArgs = {
  input: Array<RemoveProgramsFromClassInput>;
};

export type MutationRemoveProgramsFromSchoolsArgs = {
  input: Array<RemoveProgramsFromSchoolInput>;
};

export type MutationRemoveSchoolRolesFromUsersArgs = {
  input: Array<RemoveSchoolRolesFromUserInput>;
};

export type MutationRemoveStudentsFromClassesArgs = {
  input: Array<RemoveStudentsFromClassInput>;
};

export type MutationRemoveSubcategoriesFromCategoriesArgs = {
  input: Array<RemoveSubcategoriesFromCategoryInput>;
};

export type MutationRemoveSubjectsFromClassesArgs = {
  input: Array<RemoveSubjectsFromClassInput>;
};

export type MutationRemoveTeachersFromClassesArgs = {
  input: Array<RemoveTeachersFromClassInput>;
};

export type MutationRemoveUsersFromOrganizationsArgs = {
  input: Array<RemoveUsersFromOrganizationInput>;
};

export type MutationRemoveUsersFromSchoolsArgs = {
  input: Array<RemoveUsersFromSchoolInput>;
};

export type MutationReplaceRoleArgs = {
  new_role_id: Scalars["ID"];
  old_role_id: Scalars["ID"];
  organization_id: Scalars["ID"];
};

export type MutationRoleArgs = {
  role_id: Scalars["ID"];
};

export type MutationSchoolArgs = {
  school_id: Scalars["ID"];
};

export type MutationSetAcademicTermsOfClassesArgs = {
  input: Array<SetAcademicTermOfClassInput>;
};

export type MutationSetBrandingArgs = {
  iconImage?: Maybe<Scalars["Upload"]>;
  organizationId: Scalars["ID"];
  primaryColor?: Maybe<Scalars["HexColor"]>;
};

export type MutationSubcategoryArgs = {
  id: Scalars["ID"];
};

export type MutationSubjectArgs = {
  id: Scalars["ID"];
};

export type MutationSwitch_UserArgs = {
  user_id: Scalars["ID"];
};

export type MutationUpdateCategoriesArgs = {
  input: Array<UpdateCategoryInput>;
};

export type MutationUpdateClassesArgs = {
  input: Array<UpdateClassInput>;
};

export type MutationUpdateProgramsArgs = {
  input: Array<UpdateProgramInput>;
};

export type MutationUpdateRolesArgs = {
  input: Array<UpdateRoleInput>;
};

export type MutationUpdateSchoolsArgs = {
  input: Array<UpdateSchoolInput>;
};

export type MutationUpdateSubcategoriesArgs = {
  input: Array<UpdateSubcategoryInput>;
};

export type MutationUpdateSubjectsArgs = {
  input: Array<UpdateSubjectInput>;
};

export type MutationUpdateUsersArgs = {
  input: Array<UpdateUserInput>;
};

export type MutationUploadAgeRangesFromCsvArgs = {
  file: Scalars["Upload"];
};

export type MutationUploadCategoriesFromCsvArgs = {
  file: Scalars["Upload"];
};

export type MutationUploadClassesFromCsvArgs = {
  file: Scalars["Upload"];
};

export type MutationUploadGradesFromCsvArgs = {
  file: Scalars["Upload"];
};

export type MutationUploadOrganizationsFromCsvArgs = {
  file: Scalars["Upload"];
};

export type MutationUploadProgramsFromCsvArgs = {
  file: Scalars["Upload"];
};

export type MutationUploadRolesFromCsvArgs = {
  file: Scalars["Upload"];
};

export type MutationUploadSchoolsFromCsvArgs = {
  file: Scalars["Upload"];
};

export type MutationUploadSubCategoriesFromCsvArgs = {
  file: Scalars["Upload"];
};

export type MutationUploadSubjectsFromCsvArgs = {
  file: Scalars["Upload"];
};

export type MutationUploadUsersFromCsvArgs = {
  file: Scalars["Upload"];
  isDryRun?: Maybe<Scalars["Boolean"]>;
};

export type MutationUserArgs = {
  alternate_email?: Maybe<Scalars["String"]>;
  alternate_phone?: Maybe<Scalars["String"]>;
  avatar?: Maybe<Scalars["String"]>;
  date_of_birth?: Maybe<Scalars["String"]>;
  email?: Maybe<Scalars["String"]>;
  family_name?: Maybe<Scalars["String"]>;
  gender?: Maybe<Scalars["String"]>;
  given_name?: Maybe<Scalars["String"]>;
  phone?: Maybe<Scalars["String"]>;
  user_id: Scalars["ID"];
  username?: Maybe<Scalars["String"]>;
};

export type MyType = {
  __typename?: "MyType";
  myField?: Maybe<Scalars["UUID"]>;
};

export type MyUser = {
  __typename?: "MyUser";
  hasPermissionsInOrganization: Array<UserPermissionStatus>;
  hasPermissionsInSchool: Array<UserPermissionStatus>;
  node?: Maybe<UserConnectionNode>;
  /** 'operator' default = 'AND' */
  organizationsWithPermissions?: Maybe<OrganizationsConnectionResponse>;
  /** Returns a paginated response of the permissions the user has in a given organization. */
  permissionsInOrganization?: Maybe<PermissionsConnectionResponse>;
  /** Returns a paginated response of the permissions the user has in a given school. */
  permissionsInSchool?: Maybe<PermissionsConnectionResponse>;
  /**
   * Finds user profiles matching the username/email/phone provided in the token.
   * Properties are checked in the following order of precedence: username>email>phone.
   * e.g. email & phone won't be checked if username is provided.
   */
  profiles: Array<UserConnectionNode>;
  /** 'operator' default = 'AND' */
  schoolsWithPermissions?: Maybe<SchoolsConnectionResponse>;
};

export type MyUserHasPermissionsInOrganizationArgs = {
  organizationId: Scalars["ID"];
  permissionIds: Array<Scalars["String"]>;
};

export type MyUserHasPermissionsInSchoolArgs = {
  permissionIds: Array<Scalars["String"]>;
  schoolId: Scalars["ID"];
};

export type MyUserOrganizationsWithPermissionsArgs = {
  count?: Maybe<Scalars["PageSize"]>;
  cursor?: Maybe<Scalars["String"]>;
  direction?: Maybe<ConnectionDirection>;
  filter?: Maybe<OrganizationFilter>;
  operator?: Maybe<LogicalOperator>;
  permissionIds: Array<Scalars["String"]>;
  sort?: Maybe<OrganizationSortInput>;
};

export type MyUserPermissionsInOrganizationArgs = {
  count?: Maybe<Scalars["PageSize"]>;
  cursor?: Maybe<Scalars["String"]>;
  direction?: Maybe<ConnectionDirection>;
  filter?: Maybe<PermissionFilter>;
  organizationId: Scalars["ID"];
  sort?: Maybe<PermissionSortInput>;
};

export type MyUserPermissionsInSchoolArgs = {
  count?: Maybe<Scalars["PageSize"]>;
  cursor?: Maybe<Scalars["String"]>;
  direction?: Maybe<ConnectionDirection>;
  filter?: Maybe<PermissionFilter>;
  schoolId: Scalars["ID"];
  sort?: Maybe<PermissionSortInput>;
};

export type MyUserSchoolsWithPermissionsArgs = {
  count?: Maybe<Scalars["PageSize"]>;
  cursor?: Maybe<Scalars["String"]>;
  direction?: Maybe<ConnectionDirection>;
  filter?: Maybe<SchoolFilter>;
  operator?: Maybe<LogicalOperator>;
  permissionIds: Array<Scalars["String"]>;
  sort?: Maybe<SchoolSortInput>;
};

export type NumberFilter = {
  operator: NumberOrDateOperator;
  value: Scalars["Float"];
};

export enum NumberOrDateOperator {
  Eq = "eq",
  Gt = "gt",
  Gte = "gte",
  Lt = "lt",
  Lte = "lte",
  Neq = "neq",
}

export type Organization = {
  __typename?: "Organization";
  /** @deprecated Sunset Date: 01/02/22 Details: https://calmisland.atlassian.net/wiki/spaces/UserService/pages/2462417870/ */
  addUser?: Maybe<OrganizationMembership>;
  address1?: Maybe<Scalars["String"]>;
  address2?: Maybe<Scalars["String"]>;
  /** @deprecated Sunset Date: 06/03/2022 Details: https://calmisland.atlassian.net/wiki/spaces/ATZ/pages/2473459840 */
  ageRanges?: Maybe<Array<AgeRange>>;
  branding?: Maybe<Branding>;
  /** @deprecated Sunset Date: 06/03/2022 Details: https://calmisland.atlassian.net/wiki/spaces/ATZ/pages/2473459840 */
  categories?: Maybe<Array<Category>>;
  /** @deprecated Use 'getClasses'. */
  classes?: Maybe<Array<Maybe<Class>>>;
  /** @deprecated Sunset Date: 10/04/2022 https://calmisland.atlassian.net/l/c/GSPr3XYb */
  createClass?: Maybe<Class>;
  createOrUpdateAgeRanges?: Maybe<Array<Maybe<AgeRange>>>;
  /** @deprecated Sunset Date: 22/02/22 Details: https://calmisland.atlassian.net/l/c/kY3S0K0h */
  createOrUpdateCategories?: Maybe<Array<Maybe<Category>>>;
  createOrUpdateGrades?: Maybe<Array<Maybe<Grade>>>;
  /** @deprecated Sunset Date: 24/04/2022 Details: https://calmisland.atlassian.net/l/c/8d8mpL0Q */
  createOrUpdatePrograms?: Maybe<Array<Maybe<Program>>>;
  /** @deprecated Sunset Date: 22/02/22 Details: https://calmisland.atlassian.net/wiki/spaces/ATZ/pages/2457174175 */
  createOrUpdateSubcategories?: Maybe<Array<Maybe<Subcategory>>>;
  /** @deprecated Sunset Date: 11/04/2022 Details: https://calmisland.atlassian.net/l/c/8d8mpL0Q */
  createOrUpdateSubjects?: Maybe<Array<Maybe<Subject>>>;
  /** @deprecated Sunset Date: 29/03/2022 Details: https://calmisland.atlassian.net/l/c/8d8mpL0Q */
  createRole?: Maybe<Role>;
  createSchool?: Maybe<School>;
  delete?: Maybe<Scalars["Boolean"]>;
  /** @deprecated Sunset Date: 01/02/22 Details: https://calmisland.atlassian.net/wiki/spaces/ATZ/pages/2433581057 */
  editMembership?: Maybe<MembershipUpdate>;
  findMembers?: Maybe<Array<Maybe<OrganizationMembership>>>;
  getClasses?: Maybe<Array<Maybe<Class>>>;
  grades?: Maybe<Array<Grade>>;
  inviteUser?: Maybe<MembershipUpdate>;
  membersWithPermission?: Maybe<Array<Maybe<OrganizationMembership>>>;
  memberships?: Maybe<Array<Maybe<OrganizationMembership>>>;
  organization_id: Scalars["ID"];
  organization_name?: Maybe<Scalars["String"]>;
  /**
   * 'owner' is the User that created this Organization
   * @deprecated Use 'organization_ownerships'.
   */
  owner?: Maybe<User>;
  phone?: Maybe<Scalars["String"]>;
  primary_contact?: Maybe<User>;
  programs?: Maybe<Array<Program>>;
  roles?: Maybe<Array<Maybe<Role>>>;
  schools?: Maybe<Array<Maybe<School>>>;
  set?: Maybe<Organization>;
  setPrimaryContact?: Maybe<User>;
  shortCode?: Maybe<Scalars["String"]>;
  status?: Maybe<Status>;
  students?: Maybe<Array<Maybe<OrganizationMembership>>>;
  /** @deprecated Sunset Date: 06/03/2022 Details: https://calmisland.atlassian.net/wiki/spaces/ATZ/pages/2473459840 */
  subcategories?: Maybe<Array<Subcategory>>;
  subjects?: Maybe<Array<Subject>>;
  teachers?: Maybe<Array<Maybe<OrganizationMembership>>>;
};

export type OrganizationAddUserArgs = {
  shortcode?: Maybe<Scalars["String"]>;
  user_id: Scalars["ID"];
};

export type OrganizationCreateClassArgs = {
  class_name?: Maybe<Scalars["String"]>;
  shortcode?: Maybe<Scalars["String"]>;
};

export type OrganizationCreateOrUpdateAgeRangesArgs = {
  age_ranges: Array<Maybe<AgeRangeDetail>>;
};

export type OrganizationCreateOrUpdateCategoriesArgs = {
  categories: Array<Maybe<CategoryDetail>>;
};

export type OrganizationCreateOrUpdateGradesArgs = {
  grades: Array<Maybe<GradeDetail>>;
};

export type OrganizationCreateOrUpdateProgramsArgs = {
  programs: Array<Maybe<ProgramDetail>>;
};

export type OrganizationCreateOrUpdateSubcategoriesArgs = {
  subcategories: Array<Maybe<SubcategoryDetail>>;
};

export type OrganizationCreateOrUpdateSubjectsArgs = {
  subjects: Array<Maybe<SubjectDetail>>;
};

export type OrganizationCreateRoleArgs = {
  role_description: Scalars["String"];
  role_name: Scalars["String"];
};

export type OrganizationCreateSchoolArgs = {
  school_name?: Maybe<Scalars["String"]>;
  shortcode?: Maybe<Scalars["String"]>;
};

export type OrganizationDeleteArgs = {
  _?: Maybe<Scalars["Int"]>;
};

export type OrganizationEditMembershipArgs = {
  alternate_email?: Maybe<Scalars["String"]>;
  alternate_phone?: Maybe<Scalars["String"]>;
  date_of_birth?: Maybe<Scalars["String"]>;
  email?: Maybe<Scalars["String"]>;
  family_name: Scalars["String"];
  gender: Scalars["String"];
  given_name: Scalars["String"];
  organization_role_ids: Array<Scalars["ID"]>;
  phone?: Maybe<Scalars["String"]>;
  school_ids?: Maybe<Array<Scalars["ID"]>>;
  school_role_ids?: Maybe<Array<Scalars["ID"]>>;
  shortcode: Scalars["String"];
  user_id: Scalars["ID"];
  username?: Maybe<Scalars["String"]>;
};

export type OrganizationFindMembersArgs = {
  search_query: Scalars["String"];
};

export type OrganizationInviteUserArgs = {
  alternate_email?: Maybe<Scalars["String"]>;
  alternate_phone?: Maybe<Scalars["String"]>;
  date_of_birth?: Maybe<Scalars["String"]>;
  email?: Maybe<Scalars["String"]>;
  family_name: Scalars["String"];
  gender: Scalars["String"];
  given_name: Scalars["String"];
  organization_role_ids: Array<Scalars["ID"]>;
  phone?: Maybe<Scalars["String"]>;
  school_ids?: Maybe<Array<Scalars["ID"]>>;
  school_role_ids?: Maybe<Array<Scalars["ID"]>>;
  shortcode?: Maybe<Scalars["String"]>;
  username?: Maybe<Scalars["String"]>;
};

export type OrganizationMembersWithPermissionArgs = {
  permission_name: Scalars["String"];
  search_query?: Maybe<Scalars["String"]>;
};

export type OrganizationSetArgs = {
  address1?: Maybe<Scalars["String"]>;
  address2?: Maybe<Scalars["String"]>;
  organization_name?: Maybe<Scalars["String"]>;
  phone?: Maybe<Scalars["String"]>;
  shortCode?: Maybe<Scalars["String"]>;
};

export type OrganizationSetPrimaryContactArgs = {
  user_id: Scalars["ID"];
};

export type OrganizationConnectionNode = {
  __typename?: "OrganizationConnectionNode";
  ageRangesConnection?: Maybe<AgeRangesConnectionResponse>;
  branding?: Maybe<Branding>;
  categoriesConnection?: Maybe<CategoriesConnectionResponse>;
  classesConnection?: Maybe<ClassesConnectionResponse>;
  contactInfo?: Maybe<OrganizationContactInfo>;
  id: Scalars["ID"];
  name?: Maybe<Scalars["String"]>;
  organizationMembershipsConnection?: Maybe<OrganizationMembershipsConnectionResponse>;
  owners?: Maybe<Array<Maybe<UserSummaryNode>>>;
  rolesConnection?: Maybe<RolesConnectionResponse>;
  schoolsConnection?: Maybe<SchoolsConnectionResponse>;
  shortCode?: Maybe<Scalars["String"]>;
  status?: Maybe<Status>;
  subcategoriesConnection?: Maybe<SubcategoriesConnectionResponse>;
};

export type OrganizationConnectionNodeAgeRangesConnectionArgs = {
  count?: Maybe<Scalars["PageSize"]>;
  cursor?: Maybe<Scalars["String"]>;
  direction: ConnectionDirection;
  filter?: Maybe<AgeRangeFilter>;
  sort?: Maybe<AgeRangeSortInput>;
};

export type OrganizationConnectionNodeCategoriesConnectionArgs = {
  count?: Maybe<Scalars["PageSize"]>;
  cursor?: Maybe<Scalars["String"]>;
  direction?: Maybe<ConnectionDirection>;
  filter?: Maybe<CategoryFilter>;
  sort?: Maybe<CategorySortInput>;
};

export type OrganizationConnectionNodeClassesConnectionArgs = {
  count?: Maybe<Scalars["PageSize"]>;
  cursor?: Maybe<Scalars["String"]>;
  direction?: Maybe<ConnectionDirection>;
  filter?: Maybe<ClassFilter>;
  sort?: Maybe<ClassSortInput>;
};

export type OrganizationConnectionNodeOrganizationMembershipsConnectionArgs = {
  count?: Maybe<Scalars["PageSize"]>;
  cursor?: Maybe<Scalars["String"]>;
  direction?: Maybe<ConnectionDirection>;
  filter?: Maybe<OrganizationMembershipFilter>;
  sort?: Maybe<OrganizationMembershipSortBy>;
};

export type OrganizationConnectionNodeRolesConnectionArgs = {
  count?: Maybe<Scalars["PageSize"]>;
  cursor?: Maybe<Scalars["String"]>;
  direction?: Maybe<ConnectionDirection>;
  filter?: Maybe<RoleFilter>;
  sort?: Maybe<RoleSortInput>;
};

export type OrganizationConnectionNodeSchoolsConnectionArgs = {
  count?: Maybe<Scalars["PageSize"]>;
  cursor?: Maybe<Scalars["String"]>;
  direction?: Maybe<ConnectionDirection>;
  filter?: Maybe<SchoolFilter>;
  sort?: Maybe<SchoolSortInput>;
};

export type OrganizationConnectionNodeSubcategoriesConnectionArgs = {
  count?: Maybe<Scalars["PageSize"]>;
  cursor?: Maybe<Scalars["String"]>;
  direction?: Maybe<ConnectionDirection>;
  filter?: Maybe<SubcategoryFilter>;
  sort?: Maybe<SubcategorySortInput>;
};

export type OrganizationContactInfo = {
  __typename?: "OrganizationContactInfo";
  address1?: Maybe<Scalars["String"]>;
  address2?: Maybe<Scalars["String"]>;
  phone?: Maybe<Scalars["String"]>;
};

export type OrganizationFilter = {
  AND?: Maybe<Array<OrganizationFilter>>;
  OR?: Maybe<Array<OrganizationFilter>>;
  id?: Maybe<UuidFilter>;
  name?: Maybe<StringFilter>;
  ownerUserEmail?: Maybe<StringFilter>;
  ownerUserId?: Maybe<UuidFilter>;
  ownerUsername?: Maybe<StringFilter>;
  phone?: Maybe<StringFilter>;
  shortCode?: Maybe<StringFilter>;
  status?: Maybe<StringFilter>;
  userId?: Maybe<UuidFilter>;
};

export type OrganizationMembership = {
  __typename?: "OrganizationMembership";
  /** @deprecated Sunset Date: 01/02/22 Details: https://calmisland.atlassian.net/wiki/spaces/ATZ/pages/2433482757 */
  addRole?: Maybe<Role>;
  /** @deprecated Sunset Date: 01/02/22 Details: https://calmisland.atlassian.net/wiki/spaces/ATZ/pages/2433482757 */
  addRoles?: Maybe<Array<Maybe<Role>>>;
  checkAllowed?: Maybe<Scalars["Boolean"]>;
  /** @deprecated Use User.classesStudying and User.classesTeaching */
  classes?: Maybe<Array<Maybe<Class>>>;
  classesTeaching?: Maybe<Array<Maybe<Class>>>;
  join_timestamp?: Maybe<Scalars["Date"]>;
  /** @deprecated Sunset Date: 13/03/22 Details: https://calmisland.atlassian.net/wiki/spaces/UserService/pages/2484240385/ */
  leave?: Maybe<Scalars["Boolean"]>;
  organization?: Maybe<Organization>;
  organization_id: Scalars["ID"];
  /** @deprecated Sunset Date: 08/02/2022 Details: https://calmisland.atlassian.net/wiki/spaces/ATZ/pages/2440790112 */
  removeRole?: Maybe<OrganizationMembership>;
  roles?: Maybe<Array<Maybe<Role>>>;
  schoolMemberships?: Maybe<Array<Maybe<SchoolMembership>>>;
  shortcode?: Maybe<Scalars["String"]>;
  status?: Maybe<Status>;
  user?: Maybe<User>;
  user_id: Scalars["ID"];
};

export type OrganizationMembershipAddRoleArgs = {
  role_id: Scalars["ID"];
};

export type OrganizationMembershipAddRolesArgs = {
  role_ids: Array<Scalars["ID"]>;
};

export type OrganizationMembershipCheckAllowedArgs = {
  permission_name: Scalars["ID"];
};

export type OrganizationMembershipLeaveArgs = {
  _?: Maybe<Scalars["Int"]>;
};

export type OrganizationMembershipRemoveRoleArgs = {
  role_id: Scalars["ID"];
};

export type OrganizationMembershipSchoolMembershipsArgs = {
  permission_name?: Maybe<Scalars["String"]>;
};

export type OrganizationMembershipConnectionNode = {
  __typename?: "OrganizationMembershipConnectionNode";
  joinTimestamp?: Maybe<Scalars["Date"]>;
  organization?: Maybe<OrganizationConnectionNode>;
  organizationId: Scalars["String"];
  rolesConnection?: Maybe<RolesConnectionResponse>;
  shortCode?: Maybe<Scalars["String"]>;
  status: Status;
  user?: Maybe<UserConnectionNode>;
  userId: Scalars["String"];
};

export type OrganizationMembershipConnectionNodeRolesConnectionArgs = {
  count?: Maybe<Scalars["PageSize"]>;
  cursor?: Maybe<Scalars["String"]>;
  direction?: Maybe<ConnectionDirection>;
  filter?: Maybe<RoleFilter>;
  sort?: Maybe<RoleSortInput>;
};

export type OrganizationMembershipFilter = {
  AND?: Maybe<Array<Maybe<OrganizationMembershipFilter>>>;
  OR?: Maybe<Array<Maybe<OrganizationMembershipFilter>>>;
  organizationId?: Maybe<UuidFilter>;
  roleId?: Maybe<UuidFilter>;
  shortCode?: Maybe<StringFilter>;
  status?: Maybe<StringFilter>;
  userId?: Maybe<UuidFilter>;
};

export enum OrganizationMembershipSortBy {
  OrganizationId = "organizationId",
  UserId = "userId",
}

export type OrganizationMembershipSortInput = {
  field: OrganizationMembershipSortBy;
  order: SortOrder;
};

export type OrganizationMembershipsConnectionEdge = IConnectionEdge & {
  __typename?: "OrganizationMembershipsConnectionEdge";
  cursor?: Maybe<Scalars["String"]>;
  node?: Maybe<OrganizationMembershipConnectionNode>;
};

export type OrganizationMembershipsConnectionResponse = IConnectionResponse & {
  __typename?: "OrganizationMembershipsConnectionResponse";
  edges?: Maybe<Array<Maybe<OrganizationMembershipsConnectionEdge>>>;
  pageInfo?: Maybe<ConnectionPageInfo>;
  totalCount?: Maybe<Scalars["Int"]>;
};

export type OrganizationOwnership = {
  __typename?: "OrganizationOwnership";
  organization?: Maybe<Organization>;
  organization_id: Scalars["ID"];
  status?: Maybe<Status>;
  user?: Maybe<User>;
  user_id: Scalars["ID"];
};

export enum OrganizationSortBy {
  Name = "name",
  OwnerEmail = "ownerEmail",
}

export type OrganizationSortInput = {
  field: Array<OrganizationSortBy>;
  order: SortOrder;
};

export type OrganizationSummaryNode = {
  __typename?: "OrganizationSummaryNode";
  id: Scalars["ID"];
  joinDate?: Maybe<Scalars["Date"]>;
  name?: Maybe<Scalars["String"]>;
  status?: Maybe<Status>;
  userShortCode?: Maybe<Scalars["String"]>;
  userStatus?: Maybe<Status>;
};

export type OrganizationsConnectionEdge = IConnectionEdge & {
  __typename?: "OrganizationsConnectionEdge";
  cursor?: Maybe<Scalars["String"]>;
  node?: Maybe<OrganizationConnectionNode>;
};

export type OrganizationsConnectionResponse = IConnectionResponse & {
  __typename?: "OrganizationsConnectionResponse";
  edges?: Maybe<Array<Maybe<OrganizationsConnectionEdge>>>;
  pageInfo?: Maybe<ConnectionPageInfo>;
  totalCount?: Maybe<Scalars["Int"]>;
};

export type OrganizationsMutationResult = {
  __typename?: "OrganizationsMutationResult";
  organizations: Array<OrganizationConnectionNode>;
};

export type PageInfo = {
  __typename?: "PageInfo";
  endCursor: Scalars["String"];
  hasNextPage: Scalars["Boolean"];
  hasPreviousPage: Scalars["Boolean"];
  startCursor: Scalars["String"];
};

export type Permission = {
  __typename?: "Permission";
  allow?: Maybe<Scalars["Boolean"]>;
  permission_category?: Maybe<Scalars["String"]>;
  permission_description?: Maybe<Scalars["String"]>;
  permission_group?: Maybe<Scalars["String"]>;
  permission_id?: Maybe<Scalars["ID"]>;
  permission_level?: Maybe<Scalars["String"]>;
  permission_name: Scalars["ID"];
};

export type PermissionFilter = {
  AND?: Maybe<Array<PermissionFilter>>;
  OR?: Maybe<Array<PermissionFilter>>;
  allow?: Maybe<BooleanFilter>;
  name?: Maybe<StringFilter>;
  roleId?: Maybe<UuidFilter>;
};

export enum PermissionSortBy {
  Category = "category",
  Group = "group",
  Id = "id",
  Level = "level",
  Name = "name",
}

export type PermissionSortInput = {
  field: PermissionSortBy;
  order: SortOrder;
};

export type PermissionsConnectionEdge = IConnectionEdge & {
  __typename?: "PermissionsConnectionEdge";
  cursor?: Maybe<Scalars["String"]>;
  node?: Maybe<PermissionsConnectionNode>;
};

export type PermissionsConnectionNode = {
  __typename?: "PermissionsConnectionNode";
  allow: Scalars["Boolean"];
  category?: Maybe<Scalars["String"]>;
  description?: Maybe<Scalars["String"]>;
  group?: Maybe<Scalars["String"]>;
  id: Scalars["ID"];
  level?: Maybe<Scalars["String"]>;
  name: Scalars["String"];
  rolesConnection?: Maybe<RolesConnectionResponse>;
};

export type PermissionsConnectionNodeRolesConnectionArgs = {
  count?: Maybe<Scalars["PageSize"]>;
  cursor?: Maybe<Scalars["String"]>;
  direction?: Maybe<ConnectionDirection>;
  filter?: Maybe<RoleFilter>;
  sort?: Maybe<RoleSortInput>;
};

export type PermissionsConnectionResponse = IConnectionResponse & {
  __typename?: "PermissionsConnectionResponse";
  edges?: Maybe<Array<Maybe<PermissionsConnectionEdge>>>;
  pageInfo?: Maybe<ConnectionPageInfo>;
  totalCount?: Maybe<Scalars["Int"]>;
};

export type Program = {
  __typename?: "Program";
  /** @deprecated Sunset Date: 06/03/2022 Details: https://calmisland.atlassian.net/wiki/spaces/ATZ/pages/2473459840 */
  age_ranges?: Maybe<Array<AgeRange>>;
  /** @deprecated Sunset Date: 28/04/2022 Details: https://calmisland.atlassian.net/l/c/8d8mpL0Q */
  delete?: Maybe<Scalars["Boolean"]>;
  /** @deprecated Sunset Date: 08/08/2022 Details: https://calmisland.atlassian.net/wiki/spaces/ATZ/pages/2669346881 */
  editAgeRanges?: Maybe<Array<Maybe<AgeRange>>>;
  /** @deprecated Sunset Date: 08/08/2022 Details: https://calmisland.atlassian.net/wiki/spaces/ATZ/pages/2669379603 */
  editGrades?: Maybe<Array<Maybe<Grade>>>;
  /** @deprecated Sunset Date: 08/08/2022 Details: https://calmisland.atlassian.net/wiki/spaces/ATZ/pages/2669346890 */
  editSubjects?: Maybe<Array<Maybe<Subject>>>;
  grades?: Maybe<Array<Grade>>;
  id: Scalars["ID"];
  name: Scalars["String"];
  status?: Maybe<Status>;
  subjects?: Maybe<Array<Subject>>;
  system: Scalars["Boolean"];
};

export type ProgramDeleteArgs = {
  _?: Maybe<Scalars["Int"]>;
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

export type ProgramConnectionNode = {
  __typename?: "ProgramConnectionNode";
  /** @deprecated Sunset Date: 06/03/2022 Details: https://calmisland.atlassian.net/wiki/spaces/ATZ/pages/2473459840 */
  ageRanges?: Maybe<Array<AgeRangeConnectionNode>>;
  ageRangesConnection?: Maybe<AgeRangesConnectionResponse>;
  /** @deprecated Sunset Date: 06/03/2022 Details: https://calmisland.atlassian.net/wiki/spaces/ATZ/pages/2473459840 */
  grades?: Maybe<Array<GradeSummaryNode>>;
  gradesConnection?: Maybe<GradesConnectionResponse>;
  id: Scalars["ID"];
  name?: Maybe<Scalars["String"]>;
  status: Status;
  /** @deprecated Sunset Date: 07/03/2022 Details: https://calmisland.atlassian.net/l/c/Ts9fp60C */
  subjects?: Maybe<Array<CoreSubjectConnectionNode>>;
  subjectsConnection?: Maybe<SubjectsConnectionResponse>;
  system: Scalars["Boolean"];
};

export type ProgramConnectionNodeAgeRangesConnectionArgs = {
  count?: Maybe<Scalars["PageSize"]>;
  cursor?: Maybe<Scalars["String"]>;
  direction?: Maybe<ConnectionDirection>;
  filter?: Maybe<AgeRangeFilter>;
  sort?: Maybe<AgeRangeSortInput>;
};

export type ProgramConnectionNodeGradesConnectionArgs = {
  count?: Maybe<Scalars["PageSize"]>;
  cursor?: Maybe<Scalars["String"]>;
  direction?: Maybe<ConnectionDirection>;
  filter?: Maybe<GradeFilter>;
  sort?: Maybe<GradeSortInput>;
};

export type ProgramConnectionNodeSubjectsConnectionArgs = {
  count?: Maybe<Scalars["PageSize"]>;
  cursor?: Maybe<Scalars["String"]>;
  direction?: Maybe<ConnectionDirection>;
  filter?: Maybe<SubjectFilter>;
  sort?: Maybe<SubjectSortInput>;
};

export type ProgramDetail = {
  age_ranges?: Maybe<Array<Scalars["ID"]>>;
  grades?: Maybe<Array<Scalars["ID"]>>;
  id?: Maybe<Scalars["ID"]>;
  name?: Maybe<Scalars["String"]>;
  status?: Maybe<Status>;
  subjects?: Maybe<Array<Scalars["ID"]>>;
  system?: Maybe<Scalars["Boolean"]>;
};

export type ProgramFilter = {
  AND?: Maybe<Array<ProgramFilter>>;
  OR?: Maybe<Array<ProgramFilter>>;
  ageRangeFrom?: Maybe<AgeRangeTypeFilter>;
  ageRangeTo?: Maybe<AgeRangeTypeFilter>;
  classId?: Maybe<UuidFilter>;
  gradeId?: Maybe<UuidFilter>;
  id?: Maybe<UuidFilter>;
  name?: Maybe<StringFilter>;
  organizationId?: Maybe<UuidFilter>;
  schoolId?: Maybe<UuidFilter>;
  status?: Maybe<StringFilter>;
  subjectId?: Maybe<UuidFilter>;
  system?: Maybe<BooleanFilter>;
};

export enum ProgramSortBy {
  Id = "id",
  Name = "name",
}

export type ProgramSortInput = {
  field: Array<ProgramSortBy>;
  order: SortOrder;
};

export type ProgramsConnectionEdge = IConnectionEdge & {
  __typename?: "ProgramsConnectionEdge";
  cursor?: Maybe<Scalars["String"]>;
  node?: Maybe<ProgramConnectionNode>;
};

export type ProgramsConnectionResponse = IConnectionResponse & {
  __typename?: "ProgramsConnectionResponse";
  edges?: Maybe<Array<Maybe<ProgramsConnectionEdge>>>;
  pageInfo?: Maybe<ConnectionPageInfo>;
  totalCount?: Maybe<Scalars["Int"]>;
};

export type ProgramsMutationResult = {
  __typename?: "ProgramsMutationResult";
  programs: Array<ProgramConnectionNode>;
};

export type Query = {
  __typename?: "Query";
  _entities: Array<Maybe<_Entity>>;
  _service: _Service;
  ageRangeNode?: Maybe<AgeRangeConnectionNode>;
  ageRangesConnection?: Maybe<AgeRangesConnectionResponse>;
  /** @deprecated Sunset Date: 08/02/2022 Details: https://calmisland.atlassian.net/wiki/spaces/ATZ/pages/2427683554 */
  age_range?: Maybe<AgeRange>;
  categoriesConnection?: Maybe<CategoriesConnectionResponse>;
  /** @deprecated Sunset Date: 08/02/2022 Details: https://calmisland.atlassian.net/wiki/spaces/ATZ/pages/2427683554 */
  category?: Maybe<Category>;
  categoryNode?: Maybe<CategoryConnectionNode>;
  /** @deprecated Sunset Date: 08/02/2022 Details: https://calmisland.atlassian.net/wiki/spaces/ATZ/pages/2427683554 */
  class?: Maybe<Class>;
  classNode?: Maybe<ClassConnectionNode>;
  /** @deprecated Use 'classesConnection'. */
  classes?: Maybe<Array<Maybe<Class>>>;
  classesConnection?: Maybe<ClassesConnectionResponse>;
  eligibleStudentsConnection?: Maybe<UsersConnectionResponse>;
  eligibleTeachersConnection?: Maybe<UsersConnectionResponse>;
  /** @deprecated Sunset Date: 08/02/2022 Details: https://calmisland.atlassian.net/wiki/spaces/ATZ/pages/2427683554 */
  grade?: Maybe<Grade>;
  gradeNode?: Maybe<GradeConnectionNode>;
  gradesConnection?: Maybe<GradesConnectionResponse>;
  /** @deprecated Use myUser.node. Details: https://calmisland.atlassian.net/wiki/spaces/ATZ/pages/2437513558 */
  me?: Maybe<User>;
  myUser?: Maybe<MyUser>;
  /** @deprecated Use myUser.profiles. Details: https://calmisland.atlassian.net/wiki/spaces/ATZ/pages/2437513558 */
  my_users?: Maybe<Array<User>>;
  /** @deprecated Sunset Date: 08/02/2022 Details: https://calmisland.atlassian.net/wiki/spaces/ATZ/pages/2427683554 */
  organization?: Maybe<Organization>;
  organizationNode?: Maybe<OrganizationConnectionNode>;
  /** @deprecated Use 'organizationsConnection'. */
  organizations?: Maybe<Array<Maybe<Organization>>>;
  organizationsConnection?: Maybe<OrganizationsConnectionResponse>;
  permissionNode?: Maybe<PermissionsConnectionNode>;
  permissionsConnection?: Maybe<PermissionsConnectionResponse>;
  /** @deprecated Sunset Date: 08/02/2022 Details: https://calmisland.atlassian.net/wiki/spaces/ATZ/pages/2427683554 */
  program?: Maybe<Program>;
  programNode?: Maybe<ProgramConnectionNode>;
  programsConnection?: Maybe<ProgramsConnectionResponse>;
  queryComplexity?: Maybe<Complexity>;
  /** @deprecated Sunset Date: 08/02/2022 Details: https://calmisland.atlassian.net/wiki/spaces/ATZ/pages/2427683554 */
  role?: Maybe<Role>;
  roleNode?: Maybe<RoleConnectionNode>;
  /** @deprecated Sunset Date: 09/08/2022 Details: https://calmisland.atlassian.net/l/c/Z7e0ZCzm */
  roles?: Maybe<Array<Maybe<Role>>>;
  rolesConnection?: Maybe<RolesConnectionResponse>;
  /** @deprecated Sunset Date: 08/02/2022 Details: https://calmisland.atlassian.net/wiki/spaces/ATZ/pages/2427683554 */
  school?: Maybe<School>;
  schoolNode?: Maybe<SchoolConnectionNode>;
  schoolsConnection?: Maybe<SchoolsConnectionResponse>;
  subcategoriesConnection?: Maybe<SubcategoriesConnectionResponse>;
  /** @deprecated Sunset Date: 08/02/2022 Details: https://calmisland.atlassian.net/wiki/spaces/ATZ/pages/2427683554 */
  subcategory?: Maybe<Subcategory>;
  subcategoryNode?: Maybe<SubcategoryConnectionNode>;
  /** @deprecated Sunset Date: 09/02/2022 Details: https://calmisland.atlassian.net/wiki/spaces/ATZ/pages/2427683554 */
  subject?: Maybe<Subject>;
  subjectNode?: Maybe<SubjectConnectionNode>;
  subjectsConnection?: Maybe<SubjectsConnectionResponse>;
  /** @deprecated Sunset Date: 08/02/2022 Details: https://calmisland.atlassian.net/wiki/spaces/ATZ/pages/2427683554 */
  user?: Maybe<User>;
  userNode?: Maybe<UserConnectionNode>;
  /** @deprecated Unused */
  users?: Maybe<Array<Maybe<User>>>;
  usersConnection?: Maybe<UsersConnectionResponse>;
};

export type Query_EntitiesArgs = {
  representations: Array<Scalars["_Any"]>;
};

export type QueryAgeRangeNodeArgs = {
  id: Scalars["ID"];
};

export type QueryAgeRangesConnectionArgs = {
  direction: ConnectionDirection;
  directionArgs?: Maybe<ConnectionsDirectionArgs>;
  filter?: Maybe<AgeRangeFilter>;
  sort?: Maybe<AgeRangeSortInput>;
};

export type QueryAge_RangeArgs = {
  id: Scalars["ID"];
};

export type QueryCategoriesConnectionArgs = {
  direction: ConnectionDirection;
  directionArgs?: Maybe<ConnectionsDirectionArgs>;
  filter?: Maybe<CategoryFilter>;
  sort?: Maybe<CategorySortInput>;
};

export type QueryCategoryArgs = {
  id: Scalars["ID"];
};

export type QueryCategoryNodeArgs = {
  id: Scalars["ID"];
};

export type QueryClassArgs = {
  class_id: Scalars["ID"];
};

export type QueryClassNodeArgs = {
  id: Scalars["ID"];
};

export type QueryClassesConnectionArgs = {
  direction: ConnectionDirection;
  directionArgs?: Maybe<ConnectionsDirectionArgs>;
  filter?: Maybe<ClassFilter>;
  sort?: Maybe<ClassSortInput>;
};

export type QueryEligibleStudentsConnectionArgs = {
  classId: Scalars["ID"];
  direction: ConnectionDirection;
  directionArgs?: Maybe<ConnectionsDirectionArgs>;
  filter?: Maybe<EligibleMembersFilter>;
  sort?: Maybe<UserSortInput>;
};

export type QueryEligibleTeachersConnectionArgs = {
  classId: Scalars["ID"];
  direction: ConnectionDirection;
  directionArgs?: Maybe<ConnectionsDirectionArgs>;
  filter?: Maybe<EligibleMembersFilter>;
  sort?: Maybe<UserSortInput>;
};

export type QueryGradeArgs = {
  id: Scalars["ID"];
};

export type QueryGradeNodeArgs = {
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

export type QueryOrganizationNodeArgs = {
  id: Scalars["ID"];
};

export type QueryOrganizationsArgs = {
  organization_ids?: Maybe<Array<Scalars["ID"]>>;
};

export type QueryOrganizationsConnectionArgs = {
  direction: ConnectionDirection;
  directionArgs?: Maybe<ConnectionsDirectionArgs>;
  filter?: Maybe<OrganizationFilter>;
  sort?: Maybe<OrganizationSortInput>;
};

export type QueryPermissionNodeArgs = {
  id: Scalars["ID"];
};

export type QueryPermissionsConnectionArgs = {
  direction: ConnectionDirection;
  directionArgs?: Maybe<ConnectionsDirectionArgs>;
  filter?: Maybe<PermissionFilter>;
  sort?: Maybe<PermissionSortInput>;
};

export type QueryProgramArgs = {
  id: Scalars["ID"];
};

export type QueryProgramNodeArgs = {
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

export type QueryRoleNodeArgs = {
  id: Scalars["ID"];
};

export type QueryRolesConnectionArgs = {
  direction: ConnectionDirection;
  directionArgs?: Maybe<ConnectionsDirectionArgs>;
  filter?: Maybe<RoleFilter>;
  sort?: Maybe<RoleSortInput>;
};

export type QuerySchoolArgs = {
  school_id: Scalars["ID"];
};

export type QuerySchoolNodeArgs = {
  id: Scalars["ID"];
};

export type QuerySchoolsConnectionArgs = {
  direction: ConnectionDirection;
  directionArgs?: Maybe<ConnectionsDirectionArgs>;
  filter?: Maybe<SchoolFilter>;
  sort?: Maybe<SchoolSortInput>;
};

export type QuerySubcategoriesConnectionArgs = {
  direction: ConnectionDirection;
  directionArgs?: Maybe<ConnectionsDirectionArgs>;
  filter?: Maybe<SubcategoryFilter>;
  sort?: Maybe<SubcategorySortInput>;
};

export type QuerySubcategoryArgs = {
  id: Scalars["ID"];
};

export type QuerySubcategoryNodeArgs = {
  id: Scalars["ID"];
};

export type QuerySubjectArgs = {
  id: Scalars["ID"];
};

export type QuerySubjectNodeArgs = {
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

export type QueryUserNodeArgs = {
  id: Scalars["ID"];
};

export type QueryUsersConnectionArgs = {
  direction: ConnectionDirection;
  directionArgs?: Maybe<ConnectionsDirectionArgs>;
  filter?: Maybe<UserFilter>;
  sort?: Maybe<UserSortInput>;
};

export type ReactivateUsersFromOrganizationInput = {
  organizationId: Scalars["ID"];
  userIds: Array<Scalars["ID"]>;
};

export type ReactivateUsersFromSchoolInput = {
  schoolId: Scalars["ID"];
  userIds: Array<Scalars["ID"]>;
};

export type RemoveAgeRangesFromClassInput = {
  ageRangeIds: Array<Scalars["ID"]>;
  classId: Scalars["ID"];
};

export type RemoveClassesFromSchoolInput = {
  classIds: Array<Scalars["ID"]>;
  schoolId: Scalars["ID"];
};

export type RemoveOrganizationRolesFromUserInput = {
  organizationId: Scalars["ID"];
  roleIds: Array<Scalars["ID"]>;
  userId: Scalars["ID"];
};

export type RemoveProgramsFromClassInput = {
  classId: Scalars["ID"];
  programIds: Array<Scalars["ID"]>;
};

export type RemoveProgramsFromSchoolInput = {
  programIds: Array<Scalars["ID"]>;
  schoolId: Scalars["ID"];
};

export type RemoveSchoolRolesFromUserInput = {
  roleIds: Array<Scalars["ID"]>;
  schoolId: Scalars["ID"];
  userId: Scalars["ID"];
};

export type RemoveStudentsFromClassInput = {
  classId: Scalars["ID"];
  studentIds: Array<Scalars["ID"]>;
};

export type RemoveSubcategoriesFromCategoryInput = {
  categoryId: Scalars["ID"];
  subcategoryIds: Array<Scalars["ID"]>;
};

export type RemoveSubjectsFromClassInput = {
  classId: Scalars["ID"];
  subjectIds: Array<Scalars["ID"]>;
};

export type RemoveTeachersFromClassInput = {
  classId: Scalars["ID"];
  teacherIds: Array<Scalars["ID"]>;
};

export type RemoveUsersFromOrganizationInput = {
  organizationId: Scalars["ID"];
  userIds: Array<Scalars["ID"]>;
};

export type RemoveUsersFromSchoolInput = {
  schoolId: Scalars["ID"];
  userIds: Array<Scalars["ID"]>;
};

export type Role = {
  __typename?: "Role";
  /** @deprecated Sunset Date: 27/03/2022 Details: https://calmisland.atlassian.net/l/c/8d8mpL0Q */
  delete_role?: Maybe<Scalars["Boolean"]>;
  /** @deprecated Sunset Date: 09/08/2022 Details: https://calmisland.atlassian.net/l/c/Z7e0ZCzm */
  deny?: Maybe<Permission>;
  /** @deprecated Sunset Date: 26/05/2022 Details: https://calmisland.atlassian.net/l/c/ctBTX0xC */
  edit_permissions?: Maybe<Array<Maybe<Permission>>>;
  /** @deprecated Sunset Date: 09/08/2022 Details: https://calmisland.atlassian.net/l/c/Z7e0ZCzm */
  grant?: Maybe<Permission>;
  memberships?: Maybe<Array<Maybe<OrganizationMembership>>>;
  organization?: Maybe<Organization>;
  permission?: Maybe<Permission>;
  /** @deprecated Sunset Date: 26/02/2022 Details: https://calmisland.atlassian.net/l/c/1nEk2YHE */
  permissions?: Maybe<Array<Maybe<Permission>>>;
  /** @deprecated Sunset Date: 09/08/2022 Details: https://calmisland.atlassian.net/l/c/Z7e0ZCzm */
  revoke?: Maybe<Scalars["Boolean"]>;
  role_description: Scalars["String"];
  role_id: Scalars["ID"];
  role_name?: Maybe<Scalars["String"]>;
  /** @deprecated Sunset Date: 03/04/2022 Details: https://calmisland.atlassian.net/l/c/8d8mpL0Q */
  set?: Maybe<Role>;
  status: Status;
  system_role: Scalars["Boolean"];
};

export type RoleDelete_RoleArgs = {
  _?: Maybe<Scalars["Int"]>;
};

export type RoleDenyArgs = {
  permission_name: Scalars["String"];
};

export type RoleEdit_PermissionsArgs = {
  permission_names?: Maybe<Array<Scalars["String"]>>;
};

export type RoleGrantArgs = {
  permission_name: Scalars["String"];
};

export type RolePermissionArgs = {
  permission_name: Scalars["String"];
};

export type RoleRevokeArgs = {
  permission_name: Scalars["String"];
};

export type RoleSetArgs = {
  role_description?: Maybe<Scalars["String"]>;
  role_name?: Maybe<Scalars["String"]>;
  system_role?: Maybe<Scalars["Boolean"]>;
};

export type RoleConnectionNode = {
  __typename?: "RoleConnectionNode";
  description: Scalars["String"];
  id: Scalars["ID"];
  name?: Maybe<Scalars["String"]>;
  permissionsConnection?: Maybe<PermissionsConnectionResponse>;
  status: Status;
  system: Scalars["Boolean"];
};

export type RoleConnectionNodePermissionsConnectionArgs = {
  count?: Maybe<Scalars["PageSize"]>;
  cursor?: Maybe<Scalars["String"]>;
  direction: ConnectionDirection;
  filter?: Maybe<PermissionFilter>;
  sort?: Maybe<PermissionSortInput>;
};

export type RoleFilter = {
  AND?: Maybe<Array<Maybe<RoleFilter>>>;
  OR?: Maybe<Array<Maybe<RoleFilter>>>;
  membershipOrganizationId?: Maybe<UuidFilter>;
  membershipOrganizationUserId?: Maybe<UuidFilter>;
  name?: Maybe<StringFilter>;
  organizationId?: Maybe<UuidFilter>;
  schoolId?: Maybe<UuidFilter>;
  schoolUserId?: Maybe<UuidFilter>;
  status?: Maybe<StringFilter>;
  system?: Maybe<BooleanFilter>;
};

export enum RoleSortBy {
  Id = "id",
  Name = "name",
}

export type RoleSortInput = {
  field: RoleSortBy;
  order: SortOrder;
};

export type RoleSummaryNode = {
  __typename?: "RoleSummaryNode";
  id: Scalars["ID"];
  name?: Maybe<Scalars["String"]>;
  organizationId?: Maybe<Scalars["String"]>;
  schoolId?: Maybe<Scalars["String"]>;
  status?: Maybe<Status>;
};

export type RolesConnectionEdge = IConnectionEdge & {
  __typename?: "RolesConnectionEdge";
  cursor?: Maybe<Scalars["String"]>;
  node?: Maybe<RoleConnectionNode>;
};

export type RolesConnectionResponse = IConnectionResponse & {
  __typename?: "RolesConnectionResponse";
  edges?: Maybe<Array<Maybe<RolesConnectionEdge>>>;
  pageInfo?: Maybe<ConnectionPageInfo>;
  totalCount?: Maybe<Scalars["Int"]>;
};

export type RolesMutationResult = {
  __typename?: "RolesMutationResult";
  roles: Array<RoleConnectionNode>;
};

export type ScheduleEntry = {
  __typename?: "ScheduleEntry";
  id: Scalars["ID"];
  timestamp?: Maybe<Scalars["Date"]>;
};

export type School = {
  __typename?: "School";
  /** @deprecated Sunset Date: 26/08/2022 Details: https://calmisland.atlassian.net/l/c/f00eVp51 */
  addUser?: Maybe<SchoolMembership>;
  classes?: Maybe<Array<Maybe<Class>>>;
  /** @deprecated Sunset Date: 06/03/2022 Details: https://calmisland.atlassian.net/l/c/av1p2bKY */
  delete?: Maybe<Scalars["Boolean"]>;
  /** @deprecated Sunset Date: 06/03/2022 Details: https://calmisland.atlassian.net/l/c/av1p2bKY */
  editPrograms?: Maybe<Array<Maybe<Program>>>;
  membership?: Maybe<SchoolMembership>;
  memberships?: Maybe<Array<Maybe<SchoolMembership>>>;
  organization?: Maybe<Organization>;
  programs?: Maybe<Array<Program>>;
  school_id: Scalars["ID"];
  school_name?: Maybe<Scalars["String"]>;
  /** @deprecated Sunset Date: 26/08/2022 Details: https://calmisland.atlassian.net/l/c/f00eVp51 */
  set?: Maybe<School>;
  shortcode?: Maybe<Scalars["String"]>;
  status?: Maybe<Status>;
};

export type SchoolAddUserArgs = {
  user_id: Scalars["ID"];
};

export type SchoolDeleteArgs = {
  _?: Maybe<Scalars["Int"]>;
};

export type SchoolEditProgramsArgs = {
  program_ids?: Maybe<Array<Scalars["ID"]>>;
};

export type SchoolMembershipArgs = {
  user_id: Scalars["ID"];
};

export type SchoolSetArgs = {
  school_name?: Maybe<Scalars["String"]>;
  shortcode?: Maybe<Scalars["String"]>;
};

export type SchoolConnectionNode = {
  __typename?: "SchoolConnectionNode";
  academicTermsConnection?: Maybe<AcademicTermsConnectionResponse>;
  classesConnection?: Maybe<ClassesConnectionResponse>;
  id: Scalars["ID"];
  name: Scalars["String"];
  organizationId: Scalars["ID"];
  programsConnection?: Maybe<ProgramsConnectionResponse>;
  schoolMembershipsConnection?: Maybe<SchoolMembershipsConnectionResponse>;
  shortCode?: Maybe<Scalars["String"]>;
  status: Status;
};

export type SchoolConnectionNodeAcademicTermsConnectionArgs = {
  count?: Maybe<Scalars["PageSize"]>;
  cursor?: Maybe<Scalars["String"]>;
  direction?: Maybe<ConnectionDirection>;
  filter?: Maybe<AcademicTermFilter>;
  sort?: Maybe<AcademicTermSortInput>;
};

export type SchoolConnectionNodeClassesConnectionArgs = {
  count?: Maybe<Scalars["PageSize"]>;
  cursor?: Maybe<Scalars["String"]>;
  direction?: Maybe<ConnectionDirection>;
  filter?: Maybe<ClassFilter>;
  sort?: Maybe<ClassSortInput>;
};

export type SchoolConnectionNodeProgramsConnectionArgs = {
  count?: Maybe<Scalars["PageSize"]>;
  cursor?: Maybe<Scalars["String"]>;
  direction?: Maybe<ConnectionDirection>;
  filter?: Maybe<ProgramFilter>;
  sort?: Maybe<ProgramSortInput>;
};

export type SchoolConnectionNodeSchoolMembershipsConnectionArgs = {
  count?: Maybe<Scalars["PageSize"]>;
  cursor?: Maybe<Scalars["String"]>;
  direction?: Maybe<ConnectionDirection>;
  filter?: Maybe<SchoolMembershipFilter>;
  sort?: Maybe<SchoolMembershipSortInput>;
};

export type SchoolFilter = {
  AND?: Maybe<Array<SchoolFilter>>;
  OR?: Maybe<Array<SchoolFilter>>;
  name?: Maybe<StringFilter>;
  organizationId?: Maybe<UuidFilter>;
  programId?: Maybe<UuidFilter>;
  schoolId?: Maybe<UuidFilter>;
  shortCode?: Maybe<StringFilter>;
  status?: Maybe<StringFilter>;
  userId?: Maybe<UuidFilter>;
};

export type SchoolMembership = {
  __typename?: "SchoolMembership";
  /** @deprecated Sunset Date: 26/08/2022 Details: https://calmisland.atlassian.net/l/c/f00eVp51 */
  addRole?: Maybe<Role>;
  /** @deprecated Sunset Date: 26/08/2022 Details: https://calmisland.atlassian.net/l/c/f00eVp51 */
  addRoles?: Maybe<Array<Maybe<Role>>>;
  checkAllowed?: Maybe<Scalars["Boolean"]>;
  join_timestamp?: Maybe<Scalars["Date"]>;
  /** @deprecated Sunset Date: 21/03/22 Details: https://calmisland.atlassian.net/l/c/8d8mpL0Q */
  leave?: Maybe<Scalars["Boolean"]>;
  /** @deprecated Sunset Date: 06/03/2022 Details: https://calmisland.atlassian.net/l/c/ezmgXfSg */
  removeRole?: Maybe<SchoolMembership>;
  roles?: Maybe<Array<Maybe<Role>>>;
  school?: Maybe<School>;
  school_id: Scalars["ID"];
  status?: Maybe<Status>;
  user?: Maybe<User>;
  user_id: Scalars["ID"];
};

export type SchoolMembershipAddRoleArgs = {
  role_id: Scalars["ID"];
};

export type SchoolMembershipAddRolesArgs = {
  role_ids: Array<Scalars["ID"]>;
};

export type SchoolMembershipCheckAllowedArgs = {
  permission_name: Scalars["ID"];
};

export type SchoolMembershipLeaveArgs = {
  _?: Maybe<Scalars["Int"]>;
};

export type SchoolMembershipRemoveRoleArgs = {
  role_id: Scalars["ID"];
};

export type SchoolMembershipConnectionNode = {
  __typename?: "SchoolMembershipConnectionNode";
  joinTimestamp?: Maybe<Scalars["Date"]>;
  rolesConnection?: Maybe<RolesConnectionResponse>;
  school?: Maybe<SchoolConnectionNode>;
  schoolId: Scalars["String"];
  status: Status;
  user?: Maybe<UserConnectionNode>;
  userId: Scalars["String"];
};

export type SchoolMembershipConnectionNodeRolesConnectionArgs = {
  count?: Maybe<Scalars["PageSize"]>;
  cursor?: Maybe<Scalars["String"]>;
  direction?: Maybe<ConnectionDirection>;
  filter?: Maybe<RoleFilter>;
  sort?: Maybe<RoleSortInput>;
};

export type SchoolMembershipFilter = {
  AND?: Maybe<Array<Maybe<SchoolMembershipFilter>>>;
  OR?: Maybe<Array<Maybe<SchoolMembershipFilter>>>;
  organizationId?: Maybe<UuidFilter>;
  roleId?: Maybe<UuidFilter>;
  schoolId?: Maybe<UuidFilter>;
  status?: Maybe<StringFilter>;
  userId?: Maybe<UuidFilter>;
};

export enum SchoolMembershipSortBy {
  SchoolId = "schoolId",
  UserId = "userId",
}

export type SchoolMembershipSortInput = {
  field: SchoolMembershipSortBy;
  order: SortOrder;
};

export type SchoolMembershipsConnectionEdge = IConnectionEdge & {
  __typename?: "SchoolMembershipsConnectionEdge";
  cursor?: Maybe<Scalars["String"]>;
  node?: Maybe<SchoolMembershipConnectionNode>;
};

export type SchoolMembershipsConnectionResponse = IConnectionResponse & {
  __typename?: "SchoolMembershipsConnectionResponse";
  edges?: Maybe<Array<Maybe<SchoolMembershipsConnectionEdge>>>;
  pageInfo?: Maybe<ConnectionPageInfo>;
  totalCount?: Maybe<Scalars["Int"]>;
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
  edges?: Maybe<Array<Maybe<SchoolsConnectionEdge>>>;
  pageInfo?: Maybe<ConnectionPageInfo>;
  totalCount?: Maybe<Scalars["Int"]>;
};

export type SchoolsMutationResult = {
  __typename?: "SchoolsMutationResult";
  schools: Array<SchoolConnectionNode>;
};

export type SetAcademicTermOfClassInput = {
  academicTermId?: Maybe<Scalars["ID"]>;
  classId: Scalars["ID"];
};

export enum SortOrder {
  Asc = "ASC",
  Desc = "DESC",
}

export enum Status {
  Active = "active",
  Deleted = "deleted",
  Inactive = "inactive",
}

export type StringFilter = {
  caseInsensitive?: Maybe<Scalars["Boolean"]>;
  operator: StringOperator;
  value: Scalars["String"];
};

export enum StringOperator {
  Contains = "contains",
  Eq = "eq",
  Neq = "neq",
}

export type SubcategoriesConnectionEdge = IConnectionEdge & {
  __typename?: "SubcategoriesConnectionEdge";
  cursor?: Maybe<Scalars["String"]>;
  node?: Maybe<SubcategoryConnectionNode>;
};

export type SubcategoriesConnectionResponse = IConnectionResponse & {
  __typename?: "SubcategoriesConnectionResponse";
  edges?: Maybe<Array<Maybe<SubcategoriesConnectionEdge>>>;
  pageInfo?: Maybe<ConnectionPageInfo>;
  totalCount?: Maybe<Scalars["Int"]>;
};

export type SubcategoriesMutationResult = {
  __typename?: "SubcategoriesMutationResult";
  subcategories: Array<SubcategoryConnectionNode>;
};

export type Subcategory = {
  __typename?: "Subcategory";
  /** @deprecated Sunset Date: 10/02/2022 Details: https://github.com/KL-Engineering/user-service/tree/main/documents/rfc/mutations/050-Subcategory-toplevel-mutations.md */
  delete?: Maybe<Scalars["Boolean"]>;
  id: Scalars["ID"];
  name: Scalars["String"];
  status?: Maybe<Status>;
  system: Scalars["Boolean"];
};

export type SubcategoryDeleteArgs = {
  _?: Maybe<Scalars["Int"]>;
};

export type SubcategoryConnectionNode = {
  __typename?: "SubcategoryConnectionNode";
  id: Scalars["ID"];
  name: Scalars["String"];
  status: Status;
  system: Scalars["Boolean"];
};

export type SubcategoryDetail = {
  id?: Maybe<Scalars["ID"]>;
  name?: Maybe<Scalars["String"]>;
  system?: Maybe<Scalars["Boolean"]>;
};

export type SubcategoryFilter = {
  AND?: Maybe<Array<Maybe<SubcategoryFilter>>>;
  OR?: Maybe<Array<Maybe<SubcategoryFilter>>>;
  categoryId?: Maybe<UuidFilter>;
  organizationId?: Maybe<UuidFilter>;
  status?: Maybe<StringFilter>;
  system?: Maybe<BooleanFilter>;
};

export enum SubcategorySortBy {
  Id = "id",
  Name = "name",
}

export type SubcategorySortInput = {
  field: SubcategorySortBy;
  order: SortOrder;
};

export type Subject = {
  __typename?: "Subject";
  /** @deprecated Sunset Date: 06/03/2022 Details: https://calmisland.atlassian.net/wiki/spaces/ATZ/pages/2473459840 */
  categories?: Maybe<Array<Category>>;
  /** @deprecated Sunset Date: 20/04/2022 Details: https://calmisland.atlassian.net/l/c/8d8mpL0Q */
  delete?: Maybe<Scalars["Boolean"]>;
  id: Scalars["ID"];
  name: Scalars["String"];
  status?: Maybe<Status>;
  /** @deprecated Sunset Date: 06/03/2022 Details: https://calmisland.atlassian.net/wiki/spaces/ATZ/pages/2473459840 */
  subcategories?: Maybe<Array<Subcategory>>;
  system: Scalars["Boolean"];
};

export type SubjectDeleteArgs = {
  _?: Maybe<Scalars["Int"]>;
};

export type SubjectConnectionNode = {
  __typename?: "SubjectConnectionNode";
  /** @deprecated Sunset Date: 06/03/2022 Details: https://calmisland.atlassian.net/wiki/spaces/ATZ/pages/2473459840 */
  categories?: Maybe<Array<CategoryConnectionNode>>;
  categoriesConnection?: Maybe<CategoriesConnectionResponse>;
  id: Scalars["ID"];
  name?: Maybe<Scalars["String"]>;
  status: Status;
  system: Scalars["Boolean"];
};

export type SubjectConnectionNodeCategoriesConnectionArgs = {
  count?: Maybe<Scalars["PageSize"]>;
  cursor?: Maybe<Scalars["String"]>;
  direction?: Maybe<ConnectionDirection>;
  filter?: Maybe<CategoryFilter>;
  sort?: Maybe<CategorySortInput>;
};

export type SubjectDetail = {
  categories?: Maybe<Array<Scalars["ID"]>>;
  id?: Maybe<Scalars["ID"]>;
  name?: Maybe<Scalars["String"]>;
  system?: Maybe<Scalars["Boolean"]>;
};

export type SubjectFilter = {
  AND?: Maybe<Array<Maybe<SubjectFilter>>>;
  OR?: Maybe<Array<Maybe<SubjectFilter>>>;
  categoryId?: Maybe<UuidFilter>;
  classId?: Maybe<UuidFilter>;
  id?: Maybe<UuidFilter>;
  name?: Maybe<StringFilter>;
  organizationId?: Maybe<UuidFilter>;
  programId?: Maybe<UuidFilter>;
  status?: Maybe<StringFilter>;
  system?: Maybe<BooleanFilter>;
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

export type SubjectsConnectionEdge = IConnectionEdge & {
  __typename?: "SubjectsConnectionEdge";
  cursor?: Maybe<Scalars["String"]>;
  node?: Maybe<SubjectConnectionNode>;
};

export type SubjectsConnectionResponse = IConnectionResponse & {
  __typename?: "SubjectsConnectionResponse";
  edges?: Maybe<Array<Maybe<SubjectsConnectionEdge>>>;
  pageInfo?: Maybe<ConnectionPageInfo>;
  totalCount?: Maybe<Scalars["Int"]>;
};

export type SubjectsMutationResult = {
  __typename?: "SubjectsMutationResult";
  subjects: Array<SubjectConnectionNode>;
};

export type UuidExclusiveFilter = {
  operator: UuidExclusiveOperator;
  value?: Maybe<Scalars["UUID"]>;
};

export enum UuidExclusiveOperator {
  Eq = "eq",
  IsNull = "isNull",
  Neq = "neq",
}

export type UuidFilter = {
  operator: UuidOperator;
  value: Scalars["UUID"];
};

export enum UuidOperator {
  Eq = "eq",
  Neq = "neq",
}

export type UpdateCategoryInput = {
  id: Scalars["ID"];
  name?: Maybe<Scalars["String"]>;
  subcategoryIds?: Maybe<Array<Scalars["ID"]>>;
};

export type UpdateClassInput = {
  classId: Scalars["ID"];
  className?: Maybe<Scalars["String"]>;
  shortcode?: Maybe<Scalars["String"]>;
};

export type UpdateProgramInput = {
  ageRangeIds?: Maybe<Array<Scalars["ID"]>>;
  gradeIds?: Maybe<Array<Scalars["ID"]>>;
  id: Scalars["ID"];
  name?: Maybe<Scalars["String"]>;
  subjectIds?: Maybe<Array<Scalars["ID"]>>;
};

export type UpdateRoleInput = {
  id: Scalars["ID"];
  permissionIds?: Maybe<Array<Scalars["ID"]>>;
  roleDescription?: Maybe<Scalars["String"]>;
  roleName?: Maybe<Scalars["String"]>;
};

export type UpdateSchoolInput = {
  id: Scalars["ID"];
  name: Scalars["String"];
  organizationId: Scalars["ID"];
  shortCode: Scalars["String"];
};

export type UpdateSubcategoryInput = {
  id: Scalars["ID"];
  name?: Maybe<Scalars["String"]>;
};

export type UpdateSubjectInput = {
  categoryIds?: Maybe<Array<Scalars["ID"]>>;
  id: Scalars["ID"];
  name?: Maybe<Scalars["String"]>;
};

export type UpdateUserInput = {
  alternateEmail?: Maybe<Scalars["String"]>;
  alternatePhone?: Maybe<Scalars["String"]>;
  avatar?: Maybe<Scalars["String"]>;
  dateOfBirth?: Maybe<Scalars["String"]>;
  email?: Maybe<Scalars["String"]>;
  familyName?: Maybe<Scalars["String"]>;
  gender?: Maybe<Scalars["String"]>;
  givenName?: Maybe<Scalars["String"]>;
  id: Scalars["ID"];
  phone?: Maybe<Scalars["String"]>;
  primaryUser?: Maybe<Scalars["Boolean"]>;
  username?: Maybe<Scalars["String"]>;
};

export type User = {
  __typename?: "User";
  /** @deprecated Sunset Date: 01/02/22 Details: https://calmisland.atlassian.net/wiki/spaces/UserService/pages/2462417870/ */
  addOrganization?: Maybe<OrganizationMembership>;
  /** @deprecated Sunset Date: 01/09/22 Details: https://calmisland.atlassian.net/wiki/spaces/UserService/pages/2704900507/ */
  addSchool?: Maybe<SchoolMembership>;
  alternate_email?: Maybe<Scalars["String"]>;
  alternate_phone?: Maybe<Scalars["String"]>;
  avatar?: Maybe<Scalars["String"]>;
  classesStudying?: Maybe<Array<Maybe<Class>>>;
  classesTeaching?: Maybe<Array<Maybe<Class>>>;
  /** @deprecated Sunset Date: 01/05/22 Details: https://calmisland.atlassian.net/l/c/hKbcoRyx */
  createOrganization?: Maybe<Organization>;
  date_of_birth?: Maybe<Scalars["String"]>;
  email?: Maybe<Scalars["String"]>;
  family_name?: Maybe<Scalars["String"]>;
  full_name?: Maybe<Scalars["String"]>;
  gender?: Maybe<Scalars["String"]>;
  given_name?: Maybe<Scalars["String"]>;
  membership?: Maybe<OrganizationMembership>;
  memberships?: Maybe<Array<Maybe<OrganizationMembership>>>;
  /** @deprecated Sunset Date: 01/08/22 Details: https://calmisland.atlassian.net/wiki/spaces/UserService/pages/2665513259/ */
  merge?: Maybe<User>;
  /**
   * 'my_organization' is the Organization that this user has created
   * @deprecated Use 'organization_ownerships'.
   */
  my_organization?: Maybe<Organization>;
  organization_ownerships?: Maybe<Array<Maybe<OrganizationOwnership>>>;
  organizationsWithPermission?: Maybe<Array<Maybe<OrganizationMembership>>>;
  phone?: Maybe<Scalars["String"]>;
  primary?: Maybe<Scalars["Boolean"]>;
  school_membership?: Maybe<SchoolMembership>;
  school_memberships?: Maybe<Array<Maybe<SchoolMembership>>>;
  schoolsWithPermission?: Maybe<Array<Maybe<SchoolMembership>>>;
  /** @deprecated Sunset Date: 01/09/22 Details: https://calmisland.atlassian.net/wiki/spaces/UserService/pages/2704867347/ */
  set?: Maybe<User>;
  /** @deprecated Sunset Date: 01/09/22 Details: https://calmisland.atlassian.net/wiki/spaces/UserService/pages/2704900497/ */
  setPrimary?: Maybe<Scalars["Boolean"]>;
  subjectsTeaching?: Maybe<Array<Maybe<Subject>>>;
  user_id: Scalars["ID"];
  /** @deprecated Use 'full_name'. */
  user_name?: Maybe<Scalars["String"]>;
  username?: Maybe<Scalars["String"]>;
};

export type UserAddOrganizationArgs = {
  organization_id: Scalars["ID"];
};

export type UserAddSchoolArgs = {
  school_id: Scalars["ID"];
};

export type UserCreateOrganizationArgs = {
  address1?: Maybe<Scalars["String"]>;
  address2?: Maybe<Scalars["String"]>;
  email?: Maybe<Scalars["String"]>;
  organization_name?: Maybe<Scalars["String"]>;
  phone?: Maybe<Scalars["String"]>;
  shortCode?: Maybe<Scalars["String"]>;
};

export type UserMembershipArgs = {
  organization_id: Scalars["ID"];
};

export type UserMergeArgs = {
  other_id?: Maybe<Scalars["String"]>;
};

export type UserOrganizationsWithPermissionArgs = {
  permission_name: Scalars["String"];
};

export type UserSchool_MembershipArgs = {
  school_id: Scalars["ID"];
};

export type UserSchoolsWithPermissionArgs = {
  permission_name: Scalars["String"];
};

export type UserSetArgs = {
  alternate_email?: Maybe<Scalars["String"]>;
  alternate_phone?: Maybe<Scalars["String"]>;
  avatar?: Maybe<Scalars["String"]>;
  date_of_birth?: Maybe<Scalars["String"]>;
  email?: Maybe<Scalars["String"]>;
  family_name?: Maybe<Scalars["String"]>;
  gender?: Maybe<Scalars["String"]>;
  given_name?: Maybe<Scalars["String"]>;
  phone?: Maybe<Scalars["String"]>;
  username?: Maybe<Scalars["String"]>;
};

export type UserSetPrimaryArgs = {
  _?: Maybe<Scalars["Int"]>;
};

export type UserConnectionNode = {
  __typename?: "UserConnectionNode";
  alternateContactInfo?: Maybe<ContactInfo>;
  avatar?: Maybe<Scalars["String"]>;
  classesStudyingConnection?: Maybe<ClassesConnectionResponse>;
  classesTeachingConnection?: Maybe<ClassesConnectionResponse>;
  contactInfo?: Maybe<ContactInfo>;
  dateOfBirth?: Maybe<Scalars["String"]>;
  familyName?: Maybe<Scalars["String"]>;
  gender?: Maybe<Scalars["String"]>;
  givenName?: Maybe<Scalars["String"]>;
  id: Scalars["ID"];
  organizationMembershipsConnection?: Maybe<OrganizationMembershipsConnectionResponse>;
  /** @deprecated Sunset Date: 31/01/22 Details: https://calmisland.atlassian.net/l/c/7Ry00nhw */
  organizations?: Maybe<Array<OrganizationSummaryNode>>;
  /** @deprecated Sunset Date: 31/01/22 Details: https://calmisland.atlassian.net/l/c/7Ry00nhw */
  roles?: Maybe<Array<RoleSummaryNode>>;
  schoolMembershipsConnection?: Maybe<SchoolMembershipsConnectionResponse>;
  /** @deprecated Sunset Date: 31/01/22 Details: https://calmisland.atlassian.net/l/c/7Ry00nhw */
  schools?: Maybe<Array<SchoolSummaryNode>>;
  status: Status;
  username?: Maybe<Scalars["String"]>;
};

export type UserConnectionNodeClassesStudyingConnectionArgs = {
  count?: Maybe<Scalars["PageSize"]>;
  cursor?: Maybe<Scalars["String"]>;
  direction?: Maybe<ConnectionDirection>;
  filter?: Maybe<ClassFilter>;
  sort?: Maybe<ClassSortInput>;
};

export type UserConnectionNodeClassesTeachingConnectionArgs = {
  count?: Maybe<Scalars["PageSize"]>;
  cursor?: Maybe<Scalars["String"]>;
  direction?: Maybe<ConnectionDirection>;
  filter?: Maybe<ClassFilter>;
  sort?: Maybe<ClassSortInput>;
};

export type UserConnectionNodeOrganizationMembershipsConnectionArgs = {
  count?: Maybe<Scalars["PageSize"]>;
  cursor?: Maybe<Scalars["String"]>;
  direction?: Maybe<ConnectionDirection>;
  filter?: Maybe<OrganizationMembershipFilter>;
  sort?: Maybe<OrganizationMembershipSortBy>;
};

export type UserConnectionNodeSchoolMembershipsConnectionArgs = {
  count?: Maybe<Scalars["PageSize"]>;
  cursor?: Maybe<Scalars["String"]>;
  direction?: Maybe<ConnectionDirection>;
  filter?: Maybe<SchoolMembershipFilter>;
  sort?: Maybe<SchoolMembershipSortInput>;
};

export type UserFilter = {
  AND?: Maybe<Array<UserFilter>>;
  OR?: Maybe<Array<UserFilter>>;
  avatar?: Maybe<StringFilter>;
  classId?: Maybe<UuidExclusiveFilter>;
  email?: Maybe<StringFilter>;
  familyName?: Maybe<StringFilter>;
  givenName?: Maybe<StringFilter>;
  /** Filter users on the grades assigned to the classes they're a member of */
  gradeId?: Maybe<UuidFilter>;
  organizationId?: Maybe<UuidFilter>;
  /** Note: use organizationUserStatus with organizationId filter to avoid duplicating users */
  organizationUserStatus?: Maybe<StringFilter>;
  phone?: Maybe<StringFilter>;
  roleId?: Maybe<UuidFilter>;
  schoolId?: Maybe<UuidExclusiveFilter>;
  schoolMembershipStatus?: Maybe<StringFilter>;
  userId?: Maybe<UuidFilter>;
  userStatus?: Maybe<StringFilter>;
  username?: Maybe<StringFilter>;
};

export type UserPermissionStatus = {
  __typename?: "UserPermissionStatus";
  allowed: Scalars["Boolean"];
  permissionId: Scalars["String"];
};

export enum UserSortBy {
  FamilyName = "familyName",
  GivenName = "givenName",
}

export type UserSortInput = {
  field: Array<UserSortBy>;
  order: SortOrder;
};

export type UserSummaryNode = {
  __typename?: "UserSummaryNode";
  email?: Maybe<Scalars["String"]>;
  id?: Maybe<Scalars["String"]>;
};

export type UsersConnectionEdge = IConnectionEdge & {
  __typename?: "UsersConnectionEdge";
  cursor?: Maybe<Scalars["String"]>;
  node?: Maybe<UserConnectionNode>;
};

export type UsersConnectionResponse = IConnectionResponse & {
  __typename?: "UsersConnectionResponse";
  edges?: Maybe<Array<Maybe<UsersConnectionEdge>>>;
  pageInfo?: Maybe<ConnectionPageInfo>;
  totalCount?: Maybe<Scalars["Int"]>;
};

export type UsersMutationResult = {
  __typename?: "UsersMutationResult";
  users: Array<UserConnectionNode>;
};

export type _Entity = User | UserConnectionNode;

export type _Service = {
  __typename?: "_Service";
  /** The sdl representing the federated service capabilities. Includes federation directives, removes federation types, and includes rest of full schema after schema directives have been applied */
  sdl?: Maybe<Scalars["String"]>;
};

export type IConnectionEdge = {
  cursor?: Maybe<Scalars["String"]>;
};

export type IConnectionResponse = {
  pageInfo?: Maybe<ConnectionPageInfo>;
  totalCount?: Maybe<Scalars["Int"]>;
};
