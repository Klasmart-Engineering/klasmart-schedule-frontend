import { Box, makeStyles } from "@material-ui/core";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory, useLocation } from "react-router-dom";
import ModalBox from "../../components/ModalBox";
import { RootState } from "../../reducers";
import { onLoadContentEdit } from "../../reducers/content";
import { actSuccess } from "../../reducers/notify";
import { approve, deleteOutcome, getOutcomeDetail, publish, reject, save, updateOutcome } from "../../reducers/outcomes";
import { OutcomeForm } from "./OutcomeForm";
import OutcomeHeader from "./OutcomeHeader";
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
  return { outcome_id };
};

export default function CreateOutcomings() {
  const classes = useStyles();
  const { outcome_id } = useQuery();
  const [openStatus, setOpenStatus] = React.useState(false);
  const { mockOptions } = useSelector<RootState, RootState["content"]>((state) => state.content);
  const dispatch = useDispatch();
  const history = useHistory();
  const [showCode, setShoeCode] = React.useState(false);
  const [showPublish, setShowPublish] = React.useState(false);
  const { outcomeDetail } = useSelector<RootState, RootState["outcomes"]>((state) => state.outcomes);
  const [finalData, setFinalData] = React.useState(outcomeDetail);
  const [mulSelect, setMulselect] = React.useState({
    program: [],
    subject: [],
    developmental: [],
    skills: [],
    age: [],
    grade: [],
  });

  React.useEffect(() => {
    dispatch(onLoadContentEdit({ type: "material", id: null }));
  }, [dispatch]);

  React.useEffect(() => {
    if (outcome_id) {
      dispatch(getOutcomeDetail(outcome_id));
    }
  }, [dispatch, outcome_id]);

  React.useEffect(() => {
    setFinalData(outcomeDetail);
  }, [outcomeDetail]);

  const handleSave = async () => {
    const data = {
      ...finalData,
      ...mulSelect,
    };
    if (outcome_id) {
      await dispatch(updateOutcome({ outcome_id, value: data }));
      dispatch(actSuccess("Update Success"));
      setShowPublish(true);
      return;
    } else {
      const result: any = await dispatch(save(data));
      setShoeCode(true);
      if (result.payload?.outcome_id) {
        history.push(`/assessments/outcome-edit?outcome_id=${result.payload.outcome_id}`);
        dispatch(actSuccess("Save Success"));
        setShowPublish(true);
      }
    }
  };

  const handleClose = () => {
    setOpenStatus(false);
  };

  const [enableCustomization, setEnableCustomization] = React.useState(false);

  const handleReject = async (reason: string) => {
    const result: any = await dispatch(reject({ id: outcome_id, reject_reason: reason }));
    if (result.payload === "ok") {
      dispatch(actSuccess("Reject Success"));
      history.push("/assessments/outcome-list");
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
          if (result.payload === "ok") {
            dispatch(actSuccess("Delete Success"));
            history.push("/assessments/outcome-list");
          }
          setOpenStatus(false);
        },
      },
    ],
    handleClose: handleClose,
    customizeTemplate: <CustomizeRejectTemplate handleClose={handleClose} handleReject={handleReject} />,
  };

  const handleDelete = async () => {
    setEnableCustomization(false);
    setOpenStatus(true);
  };

  const handleReset = () => {
    setFinalData({
      ...finalData,
      ...outcomeDetail,
    });
  };

  const handelReject = (): void => {
    setOpenStatus(true);
    setEnableCustomization(true);
  };

  const handlePublish = async () => {
    if (outcomeDetail.publish_status === "draft") {
      const result: any = await dispatch(publish(outcomeDetail.outcome_id));
      if (result.payload === "ok") {
        history.push("/assessments/outcome-list");
      }
    }
  };

  const handleApprove = () => {
    if (outcome_id && outcomeDetail.publish_status === "pending") {
      dispatch(approve(outcome_id));
      history.push("/assessments/outcome-list");
    }
  };

  const handleKeywordsChange = (event: React.ChangeEvent<{ value: string }>) => {
    const keywords = event.target.value.split(",");
    setFinalData({
      ...finalData,
      keywords,
    });
  };

  const handleMultipleChange = (name: string, event: React.ChangeEvent<{ value: any }>) => {
    let aaa = event.target.value.filter((item: string) => item);
    if (name === "program") {
      setFinalData({
        ...finalData,
        [name]: aaa.map((item: string) => ({
          program_id: item,
          program_name: item,
        })),
      });
      setMulselect({
        ...mulSelect,
        program: event.target.value.filter((item: string) => item),
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
      setMulselect({
        ...mulSelect,
        subject: aaa,
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
      setMulselect({
        ...mulSelect,
        developmental: aaa,
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
      setMulselect({
        ...mulSelect,
        skills: aaa,
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
      setMulselect({
        ...mulSelect,
        age: aaa,
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
      setMulselect({
        ...mulSelect,
        grade: aaa,
      });
    }
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
    if (!keywords) return;
    keywords.map((item: string) => item);
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
        showPublish={showPublish}
        finalData={finalData}
      />
      <OutcomeForm
        outcome_id={outcome_id}
        mockOptions={mockOptions}
        finalData={finalData}
        setFinalData={setFinalData}
        handleInputChange={handleInputChange}
        handleMultipleChange={handleMultipleChange}
        handleKeywordsChange={handleKeywordsChange}
        getKeywords={getKeywords}
        showCode={showCode}
      />
      <ModalBox modalDate={modalDate} />
    </Box>
  );
}

CreateOutcomings.routeBasePath = "/assessments/outcome-edit";
