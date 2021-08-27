import {
  EntityAssessmentDetailContent,
  EntityAssessmentDetailContentOutcome,
  EntityAssessmentStudentViewH5PItem,
  EntityUpdateAssessmentH5PStudent,
} from "../../api/api.auto";
import { dynamicTableName, ElasticLayerControl } from "../../types/assessmentTypes";
import { UseFormMethods } from "react-hook-form";
import { IAssessmentState } from "../../reducers/assessments";
import { OutcomesTableProps } from "../../pages/AssessmentEdit/OutcomesTable";

export interface EntityAssessmentStudentViewH5PItemExtend extends EntityAssessmentStudentViewH5PItem {
  is_hide?: boolean;
}

export interface formValueMethods {
  formValue: OutcomesTableProps["formValue"];
  formMethods: UseFormMethods<IAssessmentState["assessmentDetail"]>;
  changeAssessmentTableDetail?: (value?: EntityUpdateAssessmentH5PStudent[]) => void;
}

/** Dynamic table's type **/
export interface tableProps extends formValueMethods {
  studentViewItems?: EntityAssessmentStudentViewH5PItemExtend[];
  editable?: boolean;
  isComplete: boolean;
  name: dynamicTableName;
  tableType: "live" | "study";
  autocompleteLabel: number;
  lesson_materials: EntityAssessmentDetailContent[] | undefined;
}

/** View By Material & students' type **/
export interface BasicTableProps extends tableProps {
  handleElasticLayerControl: (elasticLayerControlData: ElasticLayerControl) => void;
  studentViewItem: EntityAssessmentStudentViewH5PItemExtend;
  index: number;
  dimension2Item?: {
    achieved_score?: number | undefined;
    answer?: string | undefined;
    attempted?: boolean | undefined;
    is_h5p?: boolean | undefined;
    lesson_material_id?: string | undefined;
    lesson_material_name?: string | undefined;
    lesson_material_type?: string | undefined;
    max_score?: number | undefined;
    outcome_names?: string[];
    outcomes?: EntityAssessmentDetailContentOutcome[];
    student: never[];
    is_hide?: boolean;
    number?: string;
    sub_h5p_id?: string;
    h5p_id?: string;
  };
  studentViewItemsSet?: EntityAssessmentStudentViewH5PItem[];
}

/** Edit Score's type **/
export interface EditScoreProps {
  score?: number;
  handleChangeScore: (score?: number, indexSub?: number, student_id?: string) => void;
  index: number;
  editable?: boolean;
  isSubjectiveActivity: boolean;
  maxScore?: number;
  attempted?: boolean;
  isComplete?: boolean;
  is_h5p?: boolean;
  student_id?: string;
  not_applicable_scoring?: boolean;
  has_sub_items?: boolean;
}
