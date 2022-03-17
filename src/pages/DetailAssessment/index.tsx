import { V2AssessmentUpdateReq } from "@api/api.auto";
import PermissionType from "@api/PermissionType";
import { NoOutcome } from "@components/TipImages";
import { usePermission } from "@hooks/usePermission";
import { setQuery } from "@models/ModelContentDetailForm";
import { getDetailAssessmentV2, updateAssessmentV2 } from "@reducers/assessments";
import { actAsyncConfirm } from "@reducers/confirm";
import { actSuccess, actWarning } from "@reducers/notify";
import { AsyncTrunkReturned } from "@reducers/type";
import { PayloadAction, unwrapResult } from "@reduxjs/toolkit";
import { cloneDeep } from "lodash";
import React, { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { useHistory, useLocation } from "react-router-dom";
import { AssessmentTypeValues } from "../../components/AssessmentType";
import { d } from "../../locale/LocaleManager";
import { ModelAssessment } from "../../models/ModelAssessment";
import { AppDispatch, RootState } from "../../reducers";
import LayoutPair from "../ContentEdit/Layout";
import { AssessmentStatus, DetailAssessmentResult, DetailAssessmentResultStudent } from "../ListAssessment/types";
import { DetailForm } from "./DetailForm";
import { DetailHeader } from "./DetailHeader";
import { MaterialView, MaterialViewProps } from "./MaterialView";
import { Dimension, MultiSelect, MultiSelectProps, Subtitle } from "./MultiSelect";
import { OverallOutcomes, OverallOutcomesProps } from "./OverallOutcomes";
import { StudentView } from "./StudentView";
import { OutcomeStatus, StudentParticipate, StudentViewItemsProps, SubDimensionOptions, UpdateAssessmentDataOmitAction } from "./type";

const useQuery = () => {
  const { search } = useLocation();
  return useMemo(() => {
    const querys = new URLSearchParams(search);
    const id = querys.get("id") as string;
    const editindex: number = Number(querys.get("editindex") || 0);
    const assessment_type = (querys.get("assessment_type") as AssessmentTypeValues) || AssessmentTypeValues.live;
    return { assessment_type, editindex, id };
  }, [search]);
};

export function DetailAssessment() {
  const dispatch = useDispatch<AppDispatch>();
  const history = useHistory();
  const { assessmentDetailV2, my_id } = useSelector<RootState, RootState["assessments"]>((state) => state.assessments);
  const { assessment_type, editindex, id } = useQuery();
  const formMethods = useForm<UpdateAssessmentDataOmitAction>();
  const [students, setStudents] = useState<DetailAssessmentResult["students"]>();
  const [contents, setContents] = useState<DetailAssessmentResult["contents"]>();
  const initStudentViewItems = useMemo(() => {
    return ModelAssessment.getStudentViewItems(assessmentDetailV2.students, assessmentDetailV2.contents, assessmentDetailV2.outcomes);
  }, [assessmentDetailV2.contents, assessmentDetailV2.outcomes, assessmentDetailV2.students]);
  const [computedStudentViewItems, setComputedStudentViewItems] = useState<StudentViewItemsProps[] | undefined>();
  const overallOutcomes = useMemo(() => {
    const outcomes = ModelAssessment.getOverallOutcomes(computedStudentViewItems ? computedStudentViewItems : initStudentViewItems);
    return outcomes;
  }, [computedStudentViewItems, initStudentViewItems]);
  const attendanceList = useMemo(() => {
    if (students) {
      return students?.filter((student: DetailAssessmentResultStudent) => student.status === StudentParticipate.Participate);
    } else {
      return assessmentDetailV2.students?.filter(
        (student: DetailAssessmentResultStudent) => student.status === StudentParticipate.Participate
      );
    }
  }, [assessmentDetailV2.students, students]);
  const [dimension, setDimension] = useState<Dimension>(Dimension.student);
  const initSubDimension = useMemo(() => {
    return ModelAssessment.getInitSubDimension(dimension, computedStudentViewItems ? computedStudentViewItems : initStudentViewItems);
  }, [computedStudentViewItems, dimension, initStudentViewItems]);
  const [subDimesion, setSubDimension] = useState<SubDimensionOptions[] | undefined>();
  const [selectedSubdimension, setSelectedSubdimension] = useState<SubDimensionOptions[] | undefined>();
  const isStudy = assessment_type === AssessmentTypeValues.study;
  const isClass = assessment_type === AssessmentTypeValues.class;
  const perm = usePermission([PermissionType.edit_in_progress_assessment_439]);
  const perm_439 = Boolean(perm.edit_in_progress_assessment_439);
  const isMyAssessmentlist = assessmentDetailV2.teachers?.filter((item) => item.id === my_id);
  const isMyAssessment = Boolean(isMyAssessmentlist && isMyAssessmentlist.length > 0);
  const hasRemainTime = assessmentDetailV2.remaining_time ? assessmentDetailV2.remaining_time > 0 : false;
  const isComplete = assessmentDetailV2.status === AssessmentStatus.complete;
  const editable = isStudy
    ? isMyAssessment && perm_439 && !hasRemainTime && !isComplete
    : isMyAssessment && perm_439 && !isComplete && !hasRemainTime;
  const completeRate = useMemo(() => {
    const { all, attempt } = ModelAssessment.getCompleteRateV2(computedStudentViewItems ? computedStudentViewItems : initStudentViewItems);
    if (all === 0) return d("N/A").t("assess_column_n_a");
    if (attempt === 0) return "0";
    return `${Math.round((attempt / all) * 100)}%`;
  }, [computedStudentViewItems, initStudentViewItems]);
  const handleGoBack = () => {
    history.goBack();
  };
  const handleDetailSave = async () => {
    if (id) {
      const { _contents, _students } = ModelAssessment.getUpdateAssessmentData(
        contents ? contents : assessmentDetailV2.contents,
        computedStudentViewItems ? computedStudentViewItems : initStudentViewItems
      );
      const data: V2AssessmentUpdateReq = {
        action: "Draft",
        contents: [..._contents],
        id: id,
        students: [..._students],
      };
      const { payload } = (await dispatch(updateAssessmentV2({ id: id!, data }))) as unknown as PayloadAction<
        AsyncTrunkReturned<typeof updateAssessmentV2>
      >;
      if (payload) {
        dispatch(actSuccess(d("Saved Successfully.").t("assess_msg_save_successfully")));
        history.replace({
          search: setQuery(history.location.search, { id: payload, editindex: editindex + 1 }),
        });
      }
    }
  };
  const handleDetailComplete = async () => {
    const notFillItem = overallOutcomes.find(
      (oItem) =>
        !oItem.skip &&
        !oItem.none_achieved &&
        oItem?.attendance_ids &&
        oItem?.attendance_ids.length === 0 &&
        oItem.partial_attendance_ids?.length === 0
    );
    if (notFillItem) {
      return Promise.reject(dispatch(actWarning(d("Please fill in all the information.").t("assess_msg_missing_infor"))));
    }
    if (assessment_type === AssessmentTypeValues.study) {
      const hasNotAttempted = ModelAssessment.getCompleteStatus(computedStudentViewItems);
      if (hasNotAttempted) {
        const content = d("You cannot change the assessment after clicking Complete.").t("assess_msg_cannot_delete");
        const { isConfirmed } = unwrapResult(await dispatch(actAsyncConfirm({ content, hideCancel: false })));
        if (!isConfirmed) return Promise.reject();
      }
    }
    if (id) {
      const { _contents, _students } = ModelAssessment.getUpdateAssessmentData(
        contents ? contents : assessmentDetailV2.contents,
        computedStudentViewItems ? computedStudentViewItems : initStudentViewItems
      );
      const data: V2AssessmentUpdateReq = {
        action: "Complete",
        contents: [..._contents],
        id,
        students: [..._students],
      };
      const { payload } = (await dispatch(updateAssessmentV2({ id, data }))) as unknown as PayloadAction<
        AsyncTrunkReturned<typeof updateAssessmentV2>
      >;
      if (payload) {
        dispatch(actSuccess(d("Completed Successfully.").t("assess_msg_compete_successfully")));
        history.replace({
          search: setQuery(history.location.search, { id: payload, editindex: editindex + 1 }),
        });
      }
    }
  };
  const handleChangeStudent = (students: DetailAssessmentResult["students"]) => {
    students && setStudents([...students]);
    const selectedStudents = ModelAssessment.getStudentViewItems(
      students,
      contents ? contents : assessmentDetailV2.contents,
      assessmentDetailV2.outcomes
    );
    setComputedStudentViewItems(selectedStudents);
    setSubDimension(ModelAssessment.getInitSubDimension(dimension, selectedStudents));
  };
  const handleChangeContents = (contents: DetailAssessmentResult["contents"]) => {
    contents && setContents([...contents]);
    const selectedContents = ModelAssessment.getStudentViewItems(
      students ? students : assessmentDetailV2.students,
      contents,
      assessmentDetailV2.outcomes
    );
    setComputedStudentViewItems(selectedContents);
    setSubDimension(ModelAssessment.getInitSubDimension(dimension, selectedContents));
  };
  const handleChangeComputedStudentViewItems = (studentViewItems?: StudentViewItemsProps[]) => {
    studentViewItems && setComputedStudentViewItems([...studentViewItems]);
  };
  const handleChangeAllAchieved: OverallOutcomesProps["onChangeAllAchieved"] = (checked: boolean, outcome_id?: string) => {
    const _computedStudentViewItems = computedStudentViewItems ? cloneDeep(computedStudentViewItems) : cloneDeep(initStudentViewItems);
    _computedStudentViewItems?.forEach((sItem) => {
      sItem?.result?.forEach((rItem) => {
        rItem?.outcomes?.forEach((oItem) => {
          if (oItem.outcome_id === outcome_id) {
            oItem.status = checked ? OutcomeStatus.Achieved : OutcomeStatus.Unknown;
          }
        });
      });
    });
    setComputedStudentViewItems(_computedStudentViewItems);
  };
  const handleChangeMaterialAllAchieved: MaterialViewProps["onChangeMaterialAllAchieved"] = (
    checked: boolean,
    content_id?: string,
    outcome_id?: string
  ) => {
    const _computedStudentViewItems = computedStudentViewItems ? cloneDeep(computedStudentViewItems) : cloneDeep(initStudentViewItems);
    _computedStudentViewItems?.forEach((sItem) => {
      sItem?.result?.forEach((rItem) => {
        if (rItem.content_id === content_id) {
          rItem?.outcomes?.forEach((oItem) => {
            if (oItem.outcome_id === outcome_id) {
              oItem.status = checked ? OutcomeStatus.Achieved : OutcomeStatus.Unknown;
            }
          });
        }
      });
    });
    setComputedStudentViewItems(_computedStudentViewItems);
  };
  const handleChangeMaterialNoneAchieved: MaterialViewProps["onChangeMaterialNoneAchieved"] = (
    checked: boolean,
    content_id?: string,
    outcome_id?: string
  ) => {
    const _computedStudentViewItems = computedStudentViewItems ? cloneDeep(computedStudentViewItems) : cloneDeep(initStudentViewItems);
    _computedStudentViewItems?.forEach((sItem) => {
      sItem?.result?.forEach((rItem) => {
        if (rItem.content_id === content_id) {
          rItem?.outcomes?.forEach((oItem) => {
            if (oItem.outcome_id === outcome_id) {
              oItem.status = checked ? OutcomeStatus.NotAchieved : OutcomeStatus.Unknown;
            }
          });
        }
      });
    });
    setComputedStudentViewItems(_computedStudentViewItems);
  };
  const handleChangeMatarialStudentStatus: MaterialViewProps["onChangeMatarialStudentStatus"] = (
    checked: boolean,
    student_id?: string,
    content_id?: string,
    outcome_id?: string
  ) => {
    const _computedStudentViewItems = computedStudentViewItems ? cloneDeep(computedStudentViewItems) : cloneDeep(initStudentViewItems);
    _computedStudentViewItems?.forEach((sItem) => {
      if (sItem.student_id === student_id) {
        sItem?.result?.forEach((rItem) => {
          if (rItem.content_id === content_id) {
            rItem?.outcomes?.forEach((oItem) => {
              if (oItem.outcome_id === outcome_id) {
                oItem.status = checked ? OutcomeStatus.Achieved : OutcomeStatus.Unknown;
              }
            });
          }
        });
      }
    });
    setComputedStudentViewItems(_computedStudentViewItems);
  };
  const handleChangeNoneAchieved: OverallOutcomesProps["onChangeNoneAchieved"] = (checked: boolean, outcome_id?: string) => {
    const _computedStudentViewItems = computedStudentViewItems ? cloneDeep(computedStudentViewItems) : cloneDeep(initStudentViewItems);
    _computedStudentViewItems?.forEach((sItem) => {
      sItem?.result?.forEach((rItem) => {
        rItem?.outcomes?.forEach((oItem) => {
          if (oItem.outcome_id === outcome_id) {
            oItem.status = checked ? OutcomeStatus.NotAchieved : OutcomeStatus.Unknown;
          }
        });
      });
    });
    setComputedStudentViewItems(_computedStudentViewItems);
  };
  const handleChangeStudentStatus: OverallOutcomesProps["onChangeStudentStatus"] = (
    checked: boolean,
    student_id?: string,
    outcome_id?: string
  ) => {
    const _computedStudentViewItems = computedStudentViewItems ? cloneDeep(computedStudentViewItems) : cloneDeep(initStudentViewItems);
    _computedStudentViewItems?.forEach((sItem) => {
      if (sItem.student_id === student_id) {
        sItem?.result?.forEach((rItem) => {
          rItem?.outcomes?.forEach((oItem) => {
            if (oItem.outcome_id === outcome_id) {
              oItem.status = checked ? OutcomeStatus.Achieved : OutcomeStatus.Unknown;
            }
          });
        });
      }
    });
    setComputedStudentViewItems(_computedStudentViewItems);
  };
  const handleChangeNotCovered: OverallOutcomesProps["onChangeNotCovered"] = (checked: boolean, outcome_id?: string) => {
    const _computedStudentViewItems = computedStudentViewItems ? cloneDeep(computedStudentViewItems) : cloneDeep(initStudentViewItems);
    _computedStudentViewItems?.forEach((sItem) => {
      sItem?.result?.forEach((rItem) => {
        rItem?.outcomes?.forEach((oItem) => {
          if (oItem.outcome_id === outcome_id) {
            oItem.status = checked ? OutcomeStatus.NotCovered : OutcomeStatus.Unknown;
          }
        });
      });
    });
    setComputedStudentViewItems(_computedStudentViewItems);
  };
  const handleChangeDimension: MultiSelectProps["onChangeDimension"] = (value: Dimension) => {
    setDimension(value);
    const _subDimension = ModelAssessment.getInitSubDimension(
      value,
      computedStudentViewItems ? computedStudentViewItems : initStudentViewItems
    );
    setSubDimension(_subDimension);
    setSelectedSubdimension(_subDimension);
  };
  const handleChangeSubdimension: MultiSelectProps["onChangeSubdimension"] = (value: SubDimensionOptions[]) => {
    setSelectedSubdimension(value);
  };
  const rightside = (
    <>
      {!isClass && (
        <MultiSelect
          onChangeDimension={handleChangeDimension}
          dimension={dimension}
          subDimension={subDimesion ? subDimesion : initSubDimension || []}
          onChangeSubdimension={handleChangeSubdimension}
        />
      )}
      <Subtitle
        text={
          dimension === Dimension.student
            ? d("Learning Outcome Assessment").t("assessment_learning_outcome_assessment")
            : d("Lesson Plan Assessment").t("assess_detail_lesson_plan_assessment")
        }
      />
      {overallOutcomes && overallOutcomes.length ? (
        <OverallOutcomes
          attendanceList={attendanceList}
          overallOutcomes={overallOutcomes}
          editable={editable}
          onChangeAllAchieved={handleChangeAllAchieved}
          onChangeNoneAchieved={handleChangeNoneAchieved}
          onChangeStudentStatus={handleChangeStudentStatus}
          onChangeNotCovered={handleChangeNotCovered}
        />
      ) : (
        <NoOutcome />
      )}
      {!isClass && dimension === Dimension.student && (
        <>
          <Subtitle text={d("Score Assessment").t("assess_detail_score_assessment")} />
          <StudentView
            dimension={dimension}
            subDimension={selectedSubdimension ? selectedSubdimension : initSubDimension || []}
            studentViewItems={computedStudentViewItems ? computedStudentViewItems : initStudentViewItems}
            editable={editable}
            roomId={assessmentDetailV2.room_id}
            onChangeComputedStudentViewItems={handleChangeComputedStudentViewItems}
          />
        </>
      )}
      {!isClass && dimension === Dimension.material && (
        <>
          <Subtitle text={d("Lesson Material Assessment").t("assessment_lesson_material_assessment")} />
          <MaterialView
            dimension={dimension}
            subDimension={selectedSubdimension ? selectedSubdimension : initSubDimension || []}
            studentViewItems={computedStudentViewItems ? computedStudentViewItems : initStudentViewItems}
            students={students ? students : assessmentDetailV2.students}
            contents={contents ? contents : assessmentDetailV2.contents}
            editable={editable}
            roomId={assessmentDetailV2.room_id}
            onChangeMaterialAllAchieved={handleChangeMaterialAllAchieved}
            onChangeMaterialNoneAchieved={handleChangeMaterialNoneAchieved}
            onChangeMatarialStudentStatus={handleChangeMatarialStudentStatus}
            onChangeComputedStudentViewItems={handleChangeComputedStudentViewItems}
          />
        </>
      )}
    </>
  );
  useEffect(() => {
    dispatch(getDetailAssessmentV2({ id, metaLoading: true }));
  }, [dispatch, id, editindex]);
  return (
    <>
      <DetailHeader
        name={d("Assessment Details").t("assess_assessment_details")}
        onBack={handleGoBack}
        onComplete={handleDetailComplete}
        onSave={handleDetailSave}
        editable={editable}
      />
      <LayoutPair breakpoint="md" leftWidth={603} rightWidth={1205} spacing={32} basePadding={0} padding={40}>
        <DetailForm
          assessmentDetail={assessmentDetailV2}
          students={students ? students : assessmentDetailV2.students}
          contents={contents ? contents : assessmentDetailV2.contents}
          assessmentType={assessment_type}
          formMethods={formMethods}
          editable={editable}
          onChangeStudent={handleChangeStudent}
          onChangeContents={handleChangeContents}
          completeRate={completeRate}
        />
        {rightside}
      </LayoutPair>
    </>
  );
}

DetailAssessment.routeBasePath = "/assessments/details";