import { Box, makeStyles } from "@material-ui/core";
import React from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { useHistory, useLocation } from "react-router-dom";
import ModalBox from "../../components/ModalBox";
import { ModelMockOptions } from "../../models/ModelMockOptions";
import { modelOutcomeDetail } from "../../models/ModelOutcomeDetailForm";
import { RootState } from "../../reducers";
import { onLoadContentEdit } from "../../reducers/content";
import { actSuccess } from "../../reducers/notify";
import { approve, deleteOutcome, getOutcomeDetail, lockOutcome, publishOutcome, reject, save, updateOutcome } from "../../reducers/outcome";
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
  const { mockOptions } = useSelector<RootState, RootState["content"]>((state) => state.content);
  const dispatch = useDispatch();
  const history = useHistory();
  const { outcomeDetail, lockOutcome_id } = useSelector<RootState, RootState["outcome"]>((state) => state.outcome);
  const [showEdit, setShowEdit] = React.useState(false);

  const formMethods = useForm();
  const {
    handleSubmit,
    reset,
    formState: { isDirty },
    watch,
    setValue,
  } = formMethods;

  const { program: [programId] = [], developmental: [developmentalId] = [] } = watch(["program", "developmental"]);
  const flattenedMockOptions = ModelMockOptions.toFlatten({ programId, developmentalId }, mockOptions);

  const handleChangeProgram = React.useMemo(
    () => ([programId]: string[]) => {
      ModelMockOptions.updateValuesWhenProgramChange(setValue, mockOptions, programId);
    },
    [mockOptions, setValue]
  );

  const handleChangeDevelopmental = React.useCallback(() => setValue("skills", []), [setValue]);

  React.useEffect(() => {
    // 新建表单时，加载完 mockOptions 的逻辑
    if (outcome_id) return;
    const defaultProgramId = ModelMockOptions.getDefaultProgramId(mockOptions);
    const defaultDevelopmentalId = ModelMockOptions.getDefaultDevelopmental(mockOptions, defaultProgramId);
    if (!defaultDevelopmentalId || !defaultProgramId) return;
    reset({ program: [defaultProgramId], developmental: [defaultDevelopmentalId] });
  }, [mockOptions, reset, outcome_id]);

  React.useEffect(() => {
    dispatch(onLoadContentEdit({ type: "material", id: null }));
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
    if (lockOutcome_id) {
      history.push(`/assessments/outcome-edit?outcome_id=${lockOutcome_id}&before=published`);
    }
  }, [history, lockOutcome_id]);

  React.useEffect(() => {
    reset(modelOutcomeDetail(outcomeDetail));
  }, [outcomeDetail, reset]);

  const handleClose = () => {
    setOpenStatus(false);
  };

  const handleSave = React.useMemo(
    () =>
      handleSubmit(async (value) => {
        if (outcome_id) {
          const result: any = await dispatch(updateOutcome({ outcome_id, value }));
          if (result.payload === "ok") {
            dispatch(actSuccess("Update Success"));
            dispatch(getOutcomeDetail({ id: outcome_id, metaLoading: true }));
          }
        } else {
          const result: any = await dispatch(save(value));
          if (result.payload?.outcome_id) {
            history.push(`/assessments/outcome-edit?outcome_id=${result.payload.outcome_id}&status=createDfaft`);
            dispatch(actSuccess("Save Success"));
          }
        }
      }),
    [dispatch, handleSubmit, history, outcome_id]
  );

  const [enableCustomization, setEnableCustomization] = React.useState(false);

  const handleReject = async (reason: string) => {
    if (!reason) return;
    const result: any = await dispatch(reject({ id: outcome_id, reject_reason: reason }));
    if (result.payload === "ok") {
      dispatch(actSuccess("Reject Success"));
      history.go(-1);
    }
    setOpenStatus(false);
  };

  const modalDate: any = {
    title: "",
    text: "Are you sure you want to delete this learning outcome?",
    openStatus: openStatus,
    enableCustomization: enableCustomization,
    buttons: [
      {
        label: "Cancel",
        event: () => {
          setOpenStatus(false);
        },
      },
      {
        label: "Delete",
        event: async () => {
          const result: any = await dispatch(deleteOutcome(outcome_id));
          setOpenStatus(false);
          if (result.payload === "ok") {
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
    const result: any = await dispatch(deleteOutcome(outcome_id));
    setOpenStatus(false);
    if (result.payload === "ok") {
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
    if (outcomeDetail.publish_status === "draft") {
      const result: any = await dispatch(publishOutcome(outcomeDetail.outcome_id as string));
      if (result.payload === "ok") {
        history.push("/assessments/outcome-list?publish_status=draft&page=1&order_by=-created_at");
      }
    }
  };

  const handleApprove: OutcomeHeaderProps["handleApprove"] = async () => {
    if (outcome_id && outcomeDetail.publish_status === "pending") {
      await dispatch(approve(outcome_id));
      history.go(-1);
    }
  };

  const handleEdit: OutcomeHeaderProps["handleEdit"] = async () => {
    setShowEdit(!showEdit);
    if (outcomeDetail.publish_status === "published") {
      await dispatch(lockOutcome(outcome_id));
    }
  };

  const handleCheckBoxChange: OutcomeFormProps["handleCheckBoxChange"] = (event) => {
    setValue("assumed", event.target.checked, {
      shouldDirty: true,
    });
  };

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
        publish_status={outcomeDetail.publish_status}
        isDirty={isDirty}
        showEdit={showEdit}
        handleEdit={handleEdit}
        status={status}
        before={before}
      />
      <OutcomeForm
        outcome_id={outcome_id}
        flattenedMockOptions={flattenedMockOptions}
        showEdit={showEdit}
        formMethods={formMethods}
        outcomeDetail={outcomeDetail}
        onChangeProgram={handleChangeProgram}
        onChangeDevelopmental={handleChangeDevelopmental}
        handleCheckBoxChange={handleCheckBoxChange}
      />
      <ModalBox modalDate={modalDate} />
    </Box>
  );
}

CreateOutcomings.routeBasePath = "/assessments/outcome-edit";
