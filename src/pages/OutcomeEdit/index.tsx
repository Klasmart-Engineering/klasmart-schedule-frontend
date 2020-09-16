import { Box, makeStyles } from "@material-ui/core";
import React from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { useHistory, useLocation } from "react-router-dom";
import ModalBox from "../../components/ModalBox";
import { ModelMockOptions } from "../../models/ModelMockOptions";
import { RootState } from "../../reducers";
import { onLoadContentEdit } from "../../reducers/content";
import { actSuccess } from "../../reducers/notify";
import { approve, deleteOutcome, getOutcomeDetail, lockOutcome, publishOutcome, reject, save } from "../../reducers/outcome";
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
  const [showCode] = React.useState(false);
  const [showPublish] = React.useState(false);
  const { outcomeDetail, lockOutcome_id } = useSelector<RootState, RootState["outcome"]>((state) => state.outcome);
  const [finalData, setFinalData] = React.useState(outcomeDetail);
  const [setFinalDataTest] = React.useState(outcomeDetail);
  const [showEdit, setShowEdit] = React.useState(false);
  const [isError] = React.useState(false);
  const [mulSelect, setMulselect] = React.useState({
    program: [],
    subject: [],
    developmental: [],
    skills: [],
    age: [],
    grade: [],
  });

  const formMethods = useForm();
  const {
    handleSubmit,
    reset,
    formState: { isDirty },
    watch,
    setValue,
    getValues,
  } = formMethods;

  const { program: [programId] = [], developmental: [developmentalId] = [] } = watch(["program", "developmental"]);
  const flattenedMockOptions = ModelMockOptions.toFlatten({ programId, developmentalId }, mockOptions);

  React.useEffect(() => {
    ModelMockOptions.updateValuesWhenProgramChange(setValue, mockOptions, programId);
  }, [programId, mockOptions, reset, setValue]);

  React.useEffect(() => {
    // 切换 developmentalId 的逻辑
    if (developmentalId) setValue("skills", []);
  }, [developmentalId, mockOptions, reset, getValues, setValue]);

  React.useEffect(() => {
    // 新建表单时，加载完 mockOptions 的逻辑
    if (outcome_id) return;
    const defaultProgramId = ModelMockOptions.getDefaultProgramId(mockOptions);
    const defaultDevelopmentalId = ModelMockOptions.getDefaultDevelopmental(mockOptions, defaultProgramId);
    if (!defaultDevelopmentalId || !defaultProgramId) return;
    reset({ program: [defaultProgramId], developmental: [defaultDevelopmentalId] });
  }, [mockOptions, reset, outcome_id]);

  // const isSame = JSON.stringify(finalData) === JSON.stringify(finalDataTest);

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
    setFinalData(outcomeDetail);
  }, [outcomeDetail, setFinalDataTest]);

  // const handleSave: OutcomeHeaderProps["handleSave"] = async () => {
  //   if (!finalData.outcome_name) {
  //     setIsError(true);
  //     return;
  //   }
  //   const data = {
  //     ...finalData,
  //     ...mulSelect,
  //   };
  //   if (outcome_id) {
  //     const result: any = await dispatch(updateOutcome({ outcome_id, value: data }));
  //     if (result.payload === "ok") {
  //       dispatch(actSuccess("Update Success"));
  //       setShowPublish(true);
  //       dispatch(getOutcomeDetail({ id: outcome_id, metaLoading: true }));
  //       setIsError(false);
  //     }
  //   } else {
  //     const result: any = await dispatch(save(data));
  //     setShoeCode(true);
  //     if (result.payload?.outcome_id) {
  //       history.push(`/assessments/outcome-edit?outcome_id=${result.payload.outcome_id}&status=createDfaft`);
  //       dispatch(actSuccess("Save Success"));
  //       setShowPublish(true);
  //       setIsError(false);
  //     }
  //   }
  // };

  const handleClose = () => {
    setOpenStatus(false);
  };

  const handleSave = React.useMemo(
    () =>
      handleSubmit(async (value) => {
        console.log(value);
        await dispatch(save(value));
      }),
    [dispatch, handleSubmit]
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
            // history.push("/assessments/outcome-list");
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
      // history.push("/assessments/outcome-list");
      history.go(-1);
    }
  };

  const handleKeywordsChange: OutcomeFormProps["handleKeywordsChange"] = (event) => {
    const keywords = event.target.value.split(",");
    setValue("keywords", keywords);
  };

  const handleMultipleChange: OutcomeFormProps["handleMultipleChange"] = (name, event) => {
    let aaa = (event.target.value as string[]).filter((item: string) => item);
    if (name === "program") {
      setFinalData({
        ...finalData,
        [name]: aaa.map((item: string) => ({
          program_id: item,
          program_name: item,
        })),
      });
    }
    if (name === "subject") {
      setFinalData({
        ...finalData,
        [name]: aaa.map((item: string) => ({
          subject_id: item,
          subject_name: item,
        })),
      });
    }
    if (name === "developmental") {
      setFinalData({
        ...finalData,
        [name]: aaa.map((item: string) => ({
          developmental_id: item,
          developmental_name: item,
        })),
      });
    }
    if (name === "skills") {
      setFinalData({
        ...finalData,
        [name]: aaa.map((item: string) => ({
          skill_id: item,
          skill_name: item,
        })),
      });
    }
    if (name === "age") {
      setFinalData({
        ...finalData,
        [name]: aaa.map((item: string) => ({
          age_id: item,
          age_name: item,
        })),
      });
    }
    if (name === "grade") {
      setFinalData({
        ...finalData,
        [name]: aaa.map((item: string) => ({
          grade_id: item,
          grade_name: item,
        })),
      });
    }
    setMulselect({
      ...mulSelect,
      [name]: aaa,
    });
  };

  const handleInputChange = (name: string, event: React.ChangeEvent<{ value: string }>) => {
    if (name === "assumed") {
      setFinalData({
        ...finalData,
        assumed: !finalData.assumed,
      });
      return;
    }
    if (name === "estimated_time") {
      setFinalData({
        ...finalData,
        estimated_time: +event.target.value,
      });
      return;
    }
    setFinalData({
      ...finalData,
      [name]: event.target.value,
    });
  };

  const getKeywords = (keywords: string[] | undefined) => {
    if (!keywords || !keywords.length) return;
    return keywords.map((item: string) => item);
  };

  const handleEdit: OutcomeHeaderProps["handleEdit"] = async () => {
    setShowEdit(!showEdit);
    if (outcomeDetail.publish_status === "published") {
      await dispatch(lockOutcome(outcome_id));
    }
  };

  React.useEffect(() => {
    if (lockOutcome_id) {
      history.push(`/assessments/outcome-edit?outcome_id=${lockOutcome_id}&before=published`);
    }
  }, [history, lockOutcome_id]);

  React.useEffect(() => {
    reset(outcomeDetail);
  }, [outcomeDetail, reset]);

  React.useEffect(() => {
    // const data = getValues()
    if (outcomeDetail.program?.length) {
      reset({ ...outcomeDetail, program: [outcomeDetail.program[0].program_id] });
    }
  }, [outcomeDetail, reset]);

  console.log(getValues());
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
        showPublish={showPublish}
        finalData={finalData}
        isDirty={isDirty}
        showEdit={showEdit}
        handleEdit={handleEdit}
        status={status}
        before={before}
      />
      <OutcomeForm
        outcome_id={outcome_id}
        flattenedMockOptions={flattenedMockOptions}
        handleInputChange={handleInputChange}
        handleMultipleChange={handleMultipleChange}
        handleKeywordsChange={handleKeywordsChange}
        getKeywords={getKeywords}
        showCode={showCode}
        showEdit={showEdit}
        isError={isError}
        formMethods={formMethods}
        outcomeDetail={outcomeDetail}
      />
      <ModalBox modalDate={modalDate} />
    </Box>
  );
}

CreateOutcomings.routeBasePath = "/assessments/outcome-edit";
