import { Box, makeStyles } from "@material-ui/core";
import { PayloadAction } from "@reduxjs/toolkit";
import React from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { useHistory, useLocation } from "react-router-dom";
import ModalBox from "../../components/ModalBox";
import { d } from "../../locale/LocaleManager";
import { modelOutcomeDetail } from "../../models/ModelOutcomeDetailForm";
import { RootState } from "../../reducers";
import { actSuccess } from "../../reducers/notify";
import {
  approve,
  AsyncTrunkReturned,
  deleteOutcome,
  getMockOptions,
  getNewOptions,
  getOutcomeDetail,
  getSpecialSkills,
  lockOutcome,
  publishOutcome,
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
  return { outcome_id, status, before };
};

export default function CreateOutcomings() {
  const classes = useStyles();
  const { outcome_id, status, before } = useQuery();
  const [openStatus, setOpenStatus] = React.useState(false);
  const dispatch = useDispatch();
  const history = useHistory();
  const { outcomeDetail, newOptions } = useSelector<RootState, RootState["outcome"]>((state) => state.outcome);
  const [showEdit, setShowEdit] = React.useState(false);
  const [isAssumed, setIsAssumed] = React.useState(false);
  const [condition, setCondition] = React.useState("default");

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
  const handleChangeDevelopmental = React.useMemo(
    () => ([developmental_id]: string[]) => {
      setCondition("development");
      const [program_id] = getValues("program");
      console.log(program_id);
      dispatch(getSpecialSkills({ developmental_id, metaLoading: true, program_id }));
    },
    [dispatch, getValues]
  );

  React.useEffect(() => {
    dispatch(getMockOptions());
  }, [dispatch]);

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
        console.log(getValues());
        setValue("assumed", isAssumed);
        if (outcome_id) {
          const { payload } = ((await dispatch(updateOutcome({ outcome_id, value }))) as unknown) as PayloadAction<
            AsyncTrunkReturned<typeof updateOutcome>
          >;
          if (payload === "ok") {
            dispatch(actSuccess("Update Success"));
            dispatch(getOutcomeDetail({ id: outcome_id, metaLoading: true }));
          }
        } else {
          const { payload } = ((await dispatch(save(value))) as unknown) as PayloadAction<AsyncTrunkReturned<typeof save>>;
          if (payload?.outcome_id) {
            history.push(`/assessments/outcome-edit?outcome_id=${payload.outcome_id}&status=createDfaft`);
            dispatch(actSuccess("Save Success"));
          }
        }
      }),
    [dispatch, getValues, handleSubmit, history, isAssumed, outcome_id, setValue]
  );

  const [enableCustomization, setEnableCustomization] = React.useState(false);

  const handleReject = async (reason: string) => {
    if (!reason) return;
    const { payload } = ((await dispatch(reject({ id: outcome_id, reject_reason: reason }))) as unknown) as PayloadAction<
      AsyncTrunkReturned<typeof reject>
    >;
    if (payload === "ok") {
      dispatch(actSuccess("Reject Success"));
      history.push("/assessments/outcome-list?publish_status=pending&page=1&order_by=-created_at");
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
    history.go(-1);
  };

  const handelReject = (): void => {
    setOpenStatus(true);
    setEnableCustomization(true);
  };

  const handlePublish: OutcomeHeaderProps["handlePublish"] = async () => {
    if (outcomeDetail.publish_status === "draft") {
      const { payload } = ((await dispatch(publishOutcome(outcomeDetail.outcome_id as string))) as unknown) as PayloadAction<
        AsyncTrunkReturned<typeof publishOutcome>
      >;
      if (payload === "ok") {
        history.push("/assessments/outcome-list?publish_status=draft&page=1&order_by=-created_at");
      }
    }
  };

  const handleApprove: OutcomeHeaderProps["handleApprove"] = async () => {
    if (outcome_id && outcomeDetail.publish_status === "pending") {
      await dispatch(approve(outcome_id));
      history.push("/assessments/outcome-list?publish_status=pending&page=1&order_by=-created_at");
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

  React.useEffect(() => {
    dispatch(getNewOptions({ metaLoading: true }));
  }, [dispatch]);

  React.useEffect(() => {
    if (outcome_id) return;
    const nextValue: any = {
      program: [newOptions.program[0]?.id],
      developmental: [newOptions.developmental[0]?.id],
      subject: [newOptions.subject[0]?.id],
      skills: [newOptions.skills[0]?.id],
      age: [newOptions.age[0]?.id],
      grade: [newOptions.grade[0]?.id],
      assumed: true,
    };
    if (condition === "default") {
      reset(nextValue);
    }
    if (condition === "program") {
      reset({ ...nextValue, program: getValues("program") });
    }
    if (condition === "development") {
      reset({ ...nextValue, program: getValues("program"), developmental: getValues("developmental") });
    }
  }, [
    condition,
    dispatch,
    getValues,
    newOptions.age,
    newOptions.developmental,
    newOptions.grade,
    newOptions.program,
    newOptions.skills,
    newOptions.subject,
    outcome_id,
    reset,
  ]);

  return (
    <Box component="form" className={classes.outcomings_container}>
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
      />
      <OutcomeForm
        outcome_id={outcome_id}
        showEdit={showEdit}
        formMethods={formMethods}
        outcomeDetail={outcomeDetail}
        onChangeProgram={handleChangeProgram}
        onChangeDevelopmental={handleChangeDevelopmental}
        handleCheckBoxChange={handleCheckBoxChange}
        isAssumed={isAssumed}
        newOptions={newOptions}
      />
      <ModalBox modalDate={modalDate} />
    </Box>
  );
}

CreateOutcomings.routeBasePath = "/assessments/outcome-edit";
