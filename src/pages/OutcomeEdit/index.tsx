import { Box, makeStyles } from "@material-ui/core";
import { PayloadAction } from "@reduxjs/toolkit";
import { cloneDeep } from "lodash";
import React from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { useHistory, useLocation } from "react-router-dom";
import { ApiOutcomeSetCreateView } from "../../api/api.auto";
import ModalBox from "../../components/ModalBox";
import { d } from "../../locale/LocaleManager";
import { excluedOutcomeSet, findSetIndex, ids2OutcomeSet, modelOutcomeDetail } from "../../models/ModelOutcomeDetailForm";
import { RootState } from "../../reducers";
import { actSuccess } from "../../reducers/notify";
import {
  approve,
  AsyncTrunkReturned,
  createOutcomeSet,
  deleteOutcome,
  getNewOptions,
  getOutcomeDetail,
  getSpecialSkills,
  lockOutcome,
  publishOutcome,
  pullOutcomeSet,
  reject,
  save,
  updateOutcome,
} from "../../reducers/outcome";
import { OutcomeForm, OutcomeFormProps } from "./OutcomeForm";
import OutcomeHeader, { OutcomeHeaderProps } from "./OutcomeHeader";
import CustomizeRejectTemplate from "./RejectTemplate";

const useStyles = makeStyles(() => ({
  outcomings_container: {
    width: "100%",
    // padding: "70px 22%",
    boxSizing: "border-box",
  },
}));

const useQuery = () => {
  const { search } = useLocation();
  const query = new URLSearchParams(search);
  const outcome_id = query.get("outcome_id") || "";
  const status = query.get("status") || "";
  const before = query.get("before") || "";
  const readOnly = query.get("readonly") || false;
  const is_unpub = query.get("is_unpub") || "";
  return { outcome_id, status, before, readOnly, is_unpub };
};

export default function CreateOutcomings() {
  const classes = useStyles();
  const { outcome_id, status, before, readOnly, is_unpub } = useQuery();
  const [openStatus, setOpenStatus] = React.useState(false);
  const dispatch = useDispatch();
  const history = useHistory();
  const { outcomeDetail, newOptions, outcomeSetList } = useSelector<RootState, RootState["outcome"]>((state) => state.outcome);
  const [showEdit, setShowEdit] = React.useState(false);
  const [isAssumed, setIsAssumed] = React.useState(false);
  const [condition, setCondition] = React.useState("default");
  const [isSelf, setIsSelf] = React.useState(false);
  const [showSetList, setShowSetList] = React.useState(false);
  const [selectedOutcomeSet, setSelectedOutcomeSet] = React.useState<ApiOutcomeSetCreateView[]>([]);
  const formMethods = useForm();
  const {
    handleSubmit,
    reset,
    getValues,
    formState: { isDirty },
    setValue,
  } = formMethods;

  const handleChangeProgram = React.useMemo(
    () => ([programId]: string[]) => {
      setCondition("program");
      dispatch(getNewOptions({ program_id: programId, metaLoading: true }));
    },
    [dispatch]
  );
  const handleChangeSubject = React.useMemo(
    () => (default_subject_ids: string[]) => {
      setCondition("subject");
      const [program_id] = getValues("program");
      dispatch(getNewOptions({ program_id, default_subject_ids: default_subject_ids.join(","), metaLoading: true }));
    },
    [dispatch, getValues]
  );

  const handleChangeDevelopmental = React.useMemo(
    () => ([developmental_id]: string[]) => {
      setCondition("development");
      const [program_id] = getValues("program");
      dispatch(getSpecialSkills({ developmental_id, metaLoading: true, program_id }));
    },
    [dispatch, getValues]
  );

  React.useEffect(() => {
    if (outcomeDetail.author_id === newOptions.user_id) {
      setIsSelf(true);
    } else {
      setIsSelf(false);
    }
  }, [newOptions.user_id, outcomeDetail.author_id]);

  React.useEffect(() => {
    if (outcome_id) {
      dispatch(getOutcomeDetail({ id: outcome_id, metaLoading: true }));
      setShowEdit(true);
    }
  }, [dispatch, outcome_id]);

  React.useEffect(() => {
    if (status || before) setShowEdit(false);
  }, [before, status]);

  React.useEffect(() => {
    reset(modelOutcomeDetail(outcomeDetail));
    setIsAssumed(outcomeDetail.assumed as boolean);
  }, [outcomeDetail, reset]);

  const handleClose = () => {
    setOpenStatus(false);
  };

  const handleSave = React.useMemo(
    () =>
      handleSubmit(async (value) => {
        setValue("assumed", isAssumed);
        if (outcome_id) {
          const { payload } = ((await dispatch(updateOutcome({ outcome_id, value }))) as unknown) as PayloadAction<
            AsyncTrunkReturned<typeof updateOutcome>
          >;
          if (payload === "ok") {
            dispatch(actSuccess("Update Success"));
            dispatch(getOutcomeDetail({ id: outcome_id, metaLoading: true }));
            setCondition("default");
          }
        } else {
          const { payload } = ((await dispatch(save(value))) as unknown) as PayloadAction<AsyncTrunkReturned<typeof save>>;
          if (payload?.outcome_id) {
            history.push(`/assessments/outcome-edit?outcome_id=${payload.outcome_id}&status=createDfaft`);
            dispatch(actSuccess("Save Success"));
            setCondition("default");
          }
        }
      }),
    [dispatch, handleSubmit, history, isAssumed, outcome_id, setValue]
  );

  const [enableCustomization, setEnableCustomization] = React.useState(false);

  const handleReject = async (reason: string) => {
    if (!reason) return;
    const { payload } = ((await dispatch(reject({ id: outcome_id, reject_reason: reason }))) as unknown) as PayloadAction<
      AsyncTrunkReturned<typeof reject>
    >;
    if (payload === "ok") {
      dispatch(actSuccess("Reject Success"));
      history.push("/assessments/outcome-list?publish_status=pending&page=1&order_by=-updated_at");
    }
    setOpenStatus(false);
  };

  const modalDate: any = {
    title: "",
    text: d("Are you sure you want to delete this learning outcome?").t("assess_msg_delete_content"),
    openStatus: openStatus,
    enableCustomization: enableCustomization,
    buttons: [
      {
        label: d("Cancel").t("assess_label_cancel"),
        event: () => {
          setOpenStatus(false);
        },
      },
      {
        label: d("Delete").t("assess_label_delete"),
        event: async () => {
          const { payload } = ((await dispatch(deleteOutcome(outcome_id))) as unknown) as PayloadAction<
            AsyncTrunkReturned<typeof deleteOutcome>
          >;
          setOpenStatus(false);
          if (payload === "ok") {
            dispatch(actSuccess("Delete Success"));
            history.go(-1);
          }
        },
      },
    ],
    handleClose: handleClose,
    customizeTemplate: <CustomizeRejectTemplate handleClose={handleClose} handleReject={handleReject} />,
  };

  const handleDelete = async () => {
    const { payload } = ((await dispatch(deleteOutcome(outcome_id))) as unknown) as PayloadAction<AsyncTrunkReturned<typeof deleteOutcome>>;
    setOpenStatus(false);
    if (payload === "ok") {
      dispatch(actSuccess("Delete Success"));
      history.go(-1);
    }
  };

  const handleReset = () => {
    history.push("/assessments/outcome-list");
  };

  const handelReject = (): void => {
    setOpenStatus(true);
    setEnableCustomization(true);
  };

  const handlePublish: OutcomeHeaderProps["handlePublish"] = async () => {
    // if (outcomeDetail.publish_status === "draft") {
    const { payload } = ((await dispatch(publishOutcome(outcomeDetail.outcome_id as string))) as unknown) as PayloadAction<
      AsyncTrunkReturned<typeof publishOutcome>
    >;
    if (payload === "ok") {
      history.push("/assessments/outcome-list?publish_status=pending&page=1&order_by=-updated_at");
    }
    // }
  };

  const handleApprove: OutcomeHeaderProps["handleApprove"] = async () => {
    if (outcome_id && outcomeDetail.publish_status === "pending") {
      await dispatch(approve(outcome_id));
      history.push("/assessments/outcome-list?publish_status=pending&page=1&order_by=-updated_at");
    }
  };

  const handleEdit: OutcomeHeaderProps["handleEdit"] = async () => {
    setShowEdit(!showEdit);
    if (outcomeDetail.publish_status === "published") {
      const result: any = await dispatch(lockOutcome({ id: outcome_id, metaLoading: true }));
      if (result.payload.outcome_id) {
        history.push(`/assessments/outcome-edit?outcome_id=${result.payload.outcome_id}&before=published`);
      }
    }
  };

  const handleCheckBoxChange: OutcomeFormProps["handleCheckBoxChange"] = (event) => {
    setValue("assumed", event.target.checked, {
      shouldDirty: true,
    });
    setIsAssumed(event.target.checked);
  };

  const handleClickSearchOutcomSet: OutcomeFormProps["onSearchOutcomeSet"] = async (set_name) => {
    if (!set_name) return;
    await dispatch(pullOutcomeSet({ set_name }));
    setShowSetList(true);
  };
  const handleClickCreateOutcomeSet: OutcomeFormProps["onCreateOutcomeSet"] = async (set_name) => {
    await dispatch(createOutcomeSet({ set_name }));
    await dispatch(pullOutcomeSet({ set_name }));
  };
  const handleClickOk: OutcomeFormProps["onSetOutcomeSet"] = (ids) => {
    const newIds = excluedOutcomeSet(ids, selectedOutcomeSet);
    const selectedSets = ids2OutcomeSet(newIds, outcomeSetList);
    const newSets = selectedOutcomeSet.concat(selectedSets);
    setSelectedOutcomeSet(newSets || []);
    setValue("sets", newSets, { shouldDirty: true });
    setShowSetList(false);
  };

  const handleClickDelete: OutcomeFormProps["onDeleteSet"] = (set_id: string) => {
    const index = findSetIndex(set_id, selectedOutcomeSet);
    let newSets = cloneDeep(selectedOutcomeSet);
    newSets.splice(index, 1);
    setSelectedOutcomeSet(newSets);
  };

  React.useEffect(() => {
    if (outcome_id) {
      const program_id = outcomeDetail.program && outcomeDetail.program[0] && outcomeDetail.program[0].program_id;
      const subject_id = outcomeDetail.subject && outcomeDetail.subject.map((item) => item.subject_id).join(",");
      const development_id =
        outcomeDetail.developmental && outcomeDetail.developmental[0] && outcomeDetail.developmental[0].developmental_id;
      if (program_id && development_id && subject_id && outcome_id === outcomeDetail.outcome_id) {
        dispatch(getNewOptions({ program_id, development_id, default_subject_ids: subject_id, metaLoading: true }));
      }
    }
  }, [dispatch, outcomeDetail.developmental, outcomeDetail.program, outcomeDetail.outcome_id, outcome_id, outcomeDetail.subject]);

  React.useEffect(() => {
    if (!outcome_id) {
      dispatch(getNewOptions({ metaLoading: true }));
    }
  }, [outcome_id, dispatch]);

  React.useEffect(() => {
    const nextValue: any = {
      program: [newOptions.program[0]?.id],
      developmental: [newOptions.developmental[0]?.id],
      subject: [newOptions.subject[0]?.id],
      skills: [newOptions.skills[0]?.id],
      age: [newOptions.age[0]?.id],
      grade: [newOptions.grade[0]?.id],
      assumed: true,
    };
    if (outcome_id) {
      setSelectedOutcomeSet(outcomeDetail.sets || []);
      if (condition === "program") {
        setValue("subject", nextValue.subject);
        setValue("developmental", nextValue.developmental);
        setValue("skills", []);
        setValue("age", []);
        setValue("grade", []);
      }
      if (condition === "development") {
        setValue("skills", []);
      }
      if (condition === "default") {
        reset(modelOutcomeDetail(outcomeDetail));
      }
      return;
    }
    if (condition === "default") {
      reset(nextValue);
    }
    if (condition === "program") {
      setValue("subject", nextValue.subject);
      setValue("developmental", nextValue.developmental);
      setValue("skills", []);
      setValue("age", []);
      setValue("grade", []);
    }
    if (condition === "development") {
      setValue("skills", []);
    }
    setIsAssumed(true);
  }, [
    condition,
    newOptions.age,
    newOptions.developmental,
    newOptions.grade,
    newOptions.program,
    newOptions.skills,
    newOptions.subject,
    outcomeDetail,
    outcome_id,
    reset,
    setValue,
  ]);
  return (
    <Box component="form" className={classes.outcomings_container}>
      {!readOnly && (
        <OutcomeHeader
          handleSave={handleSave}
          handleReset={handleReset}
          handleDelete={handleDelete}
          outcome_id={outcome_id}
          handelReject={handelReject}
          handlePublish={handlePublish}
          handleApprove={handleApprove}
          publish_status={outcome_id ? outcomeDetail.publish_status : "draft"}
          isDirty={isDirty}
          showEdit={showEdit}
          handleEdit={handleEdit}
          status={status}
          before={before}
          is_unpub={is_unpub}
          isSelf={isSelf}
        />
      )}
      <OutcomeForm
        outcome_id={outcome_id}
        showEdit={showEdit}
        formMethods={formMethods}
        outcomeDetail={outcomeDetail}
        onChangeProgram={handleChangeProgram}
        onChangeDevelopmental={handleChangeDevelopmental}
        onChangeSubject={handleChangeSubject}
        handleCheckBoxChange={handleCheckBoxChange}
        isAssumed={isAssumed}
        newOptions={newOptions}
        showSetList={showSetList}
        onSearchOutcomeSet={handleClickSearchOutcomSet}
        onCreateOutcomeSet={handleClickCreateOutcomeSet}
        onSetOutcomeSet={handleClickOk}
        selectedOutcomeSet={selectedOutcomeSet}
        outcomeSetList={outcomeSetList}
        onDeleteSet={handleClickDelete}
      />
      <ModalBox modalDate={modalDate} />
    </Box>
  );
}

CreateOutcomings.routeBasePath = "/assessments/outcome-edit";
