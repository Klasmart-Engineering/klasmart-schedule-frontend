import { Box, Checkbox, FormControl, Grid, InputLabel, makeStyles, MenuItem, Select, TextField } from "@material-ui/core";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory, useLocation } from "react-router-dom";
import { MockOptionsItem } from "../../api/extra";
import ModalBox from "../../components/ModalBox";
import { RootState } from "../../reducers";
import { onLoadContentEdit } from "../../reducers/content";
import { actSuccess } from "../../reducers/notify";
import { approve, deleteOutcome, getOutcomeDetail, publish, reject, save, updateOutcome } from "../../reducers/outcomes";
import OutcomeHeader from "./OutcomeHeader";
import CustomizeRejectTemplate from "./RejectTemplate";

const useStyles = makeStyles(() => ({
  outcomings_container: {
    width: "100%",
    // padding: "70px 22%",
    boxSizing: "border-box",
  },
  marginItem: {
    marginBottom: "40px",
  },
  middleBox: {
    padding: "50px 20%",
  },
  checkBox: {
    width: "100%",
    border: "1px solid #bbb",
    borderRadius: "4px",
    display: "flex",
    justifyContent: "flex-end",
    position: "relative",
  },
  checkLabel: {
    position: "absolute",
    left: "12px",
    top: "50%",
    transform: "translateY(-50%)",
    margin: 0,
    padding: 0,
    color: "rgba(0, 0, 0, 0.5)",
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

  const getItems = (list: MockOptionsItem[]) =>
    list.map((item) => (
      <MenuItem key={item.id} value={item.id}>
        {item.name}
      </MenuItem>
    ));

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
      if (result.payload.outcome_id) {
        history.push(`/assessments/outcome-edit?outcome_id=${result.payload.outcome_id}`);
        dispatch(actSuccess("Save Success"));
        setShowPublish(true);
      }
    }
  };

  const handleClose = () => {
    setOpenStatus(false);
  };

  const timestampToTime = (timestamp: number | undefined, type: string = "default") => {
    const date = new Date(Number(timestamp) * 1000);
    const dateNumFun = (num: number) => (num < 10 ? `0${num}` : num);
    const [Y, M, D] = [
      date.getFullYear(),
      dateNumFun(date.getMonth() + 1),
      dateNumFun(date.getDate()),
      dateNumFun(date.getHours()),
      dateNumFun(date.getMinutes()),
      dateNumFun(date.getSeconds()),
    ];
    return `${Y}-${M}-${D}`;
  };

  const [enableCustomization, setEnableCustomization] = React.useState(false);

  const handleReject = async (reason: string) => {
    const result: any = await dispatch(reject({ id: outcome_id, reject_reason: reason }));
    if (result.paylod === "ok") {
      dispatch(actSuccess("Reject Success"));
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
          console.log(result);
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

  const handleDDDChange = (name: string, event: React.ChangeEvent<{ value: any }>) => {
    let aaa = event.target.value.filter((item: any) => item);
    console.log(aaa);
    if (name === "program") {
      setFinalData({
        ...finalData,
        [name]: aaa.map((item: any) => ({
          program_id: item,
          program_name: item,
        })),
      });
      setMulselect({
        ...mulSelect,
        program: event.target.value.filter((item: any) => item),
      });
    }
    if (name === "subject") {
      setFinalData({
        ...finalData,
        [name]: aaa.map((item: any) => ({
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
        [name]: aaa.map((item: any) => ({
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
        [name]: aaa.map((item: any) => ({
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
        [name]: aaa.map((item: any) => ({
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
        [name]: aaa.map((item: any) => ({
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

  const handleInputChange = (name: string, event: React.ChangeEvent<{ value: any }>) => {
    if (name === "assumed") {
      setFinalData({
        ...finalData,
        assumed: !finalData.assumed,
      });
      return;
    }
    if (name === "estimated_time") {
      console.log(event.target.value);
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
    keywords.map((item: any) => item);
  };

  console.log(finalData);

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
      />
      <div className={classes.middleBox}>
        <Box style={{ borderBottom: "1px solid #d7d7d7", marginBottom: "40px" }}>
          {outcomeDetail.publish_status && outcomeDetail.publish_status === "rejected" && (
            <Grid container>
              <Grid item lg={5} xl={5} md={5} sm={12} xs={12} className={classes.marginItem}>
                <TextField
                  size="small"
                  defaultValue={finalData.reject_reason}
                  fullWidth
                  label="Reject Reason"
                  onChange={(event) => handleInputChange("reject_reason", event)}
                />
              </Grid>
            </Grid>
          )}
          <Grid container justify="space-between">
            <Grid item lg={5} xl={5} md={5} sm={12} xs={12} className={classes.marginItem}>
              <TextField
                size="small"
                value={finalData.outcome_name}
                fullWidth
                label="Learning outcome Name"
                onChange={(event) => handleInputChange("outcome_name", event)}
              />
            </Grid>
            {(outcome_id || showCode) && (
              <Grid item lg={5} xl={5} md={5} sm={12} xs={12} className={classes.marginItem}>
                <TextField size="small" value={finalData.shortcode} fullWidth label="Short Code" disabled />
              </Grid>
            )}
            <Grid item lg={5} xl={5} md={5} sm={12} xs={12} className={`${classes.checkBox} ${classes.marginItem}`}>
              <Checkbox checked={finalData.assumed || false} onChange={(event) => handleInputChange("assumed", event)} />
              <p className={classes.checkLabel}>Assumed</p>
            </Grid>
            {(outcome_id || showCode) && (
              <>
                <Grid item lg={5} xl={5} md={5} sm={12} xs={12} className={classes.marginItem}>
                  <TextField value={finalData.organization_id} fullWidth label="Organization" disabled size="small" />
                </Grid>
                <Grid item lg={5} xl={5} md={5} sm={12} xs={12} className={classes.marginItem}>
                  <TextField fullWidth value={timestampToTime(finalData.created_at)} disabled label="Create Time" size="small" />
                </Grid>
                <Grid item lg={5} xl={5} md={5} sm={12} xs={12} className={classes.marginItem}>
                  <TextField value={finalData.author_name} fullWidth size="small" disabled label="Author" />
                </Grid>
              </>
            )}
          </Grid>
        </Box>
        <Box style={{ paddingBottom: "10px", borderBottom: "1px solid #d7d7d7" }}>
          <Grid container justify="space-between">
            <Grid item lg={5} xl={5} md={5} sm={12} xs={12} className={classes.marginItem}>
              <FormControl fullWidth variant="outlined">
                <InputLabel id="demo-mutiple-name-label">Program</InputLabel>
                <Select
                  labelId="demo-mutiple-name-label"
                  id="demo-mutiple-name"
                  multiple
                  value={finalData.program?.map((item: any) => item.program_id)}
                  onChange={(event) => handleDDDChange("program", event)}
                  label="Program"
                >
                  {getItems(mockOptions.program)}
                </Select>
              </FormControl>
            </Grid>
            <Grid item lg={5} xl={5} md={5} sm={12} xs={12} className={classes.marginItem}>
              <FormControl fullWidth variant="outlined">
                <InputLabel id="demo-mutiple-name-label">Subject</InputLabel>
                <Select
                  labelId="demo-mutiple-name-label"
                  id="demo-mutiple-name"
                  multiple
                  value={finalData.subject?.map((item: any) => item.subject_id)}
                  onChange={(event) => handleDDDChange("subject", event)}
                  label="Subject"
                >
                  {getItems(mockOptions.subject)}
                </Select>
              </FormControl>
            </Grid>
          </Grid>
          <Grid container justify="space-between">
            <Grid item lg={5} xl={5} md={5} sm={12} xs={12} className={classes.marginItem}>
              <FormControl fullWidth variant="outlined">
                <InputLabel id="demo-mutiple-name-label">Developmental</InputLabel>
                <Select
                  labelId="demo-mutiple-name-label"
                  id="demo-mutiple-name"
                  multiple
                  value={finalData.developmental?.map((item: any) => item.developmental_id)}
                  onChange={(event) => handleDDDChange("developmental", event)}
                  label={"Developmental"}
                >
                  {getItems(mockOptions.developmental)}
                </Select>
              </FormControl>
            </Grid>
            <Grid item lg={5} xl={5} md={5} sm={12} xs={12} className={classes.marginItem}>
              <FormControl fullWidth variant="outlined">
                <InputLabel id="demo-mutiple-name-label">Skills</InputLabel>
                <Select
                  labelId="demo-mutiple-name-label"
                  id="demo-mutiple-name"
                  multiple
                  value={finalData.skills?.map((item: any) => item.skill_id)}
                  onChange={(event) => handleDDDChange("skills", event)}
                  label="Skills"
                >
                  {getItems(mockOptions.skills)}
                </Select>
              </FormControl>
            </Grid>
          </Grid>
          <Grid container justify="space-between">
            <Grid item lg={5} xl={5} md={5} sm={12} xs={12} className={classes.marginItem}>
              <FormControl fullWidth variant="outlined">
                <InputLabel id="demo-mutiple-name-label">Age</InputLabel>
                <Select
                  labelId="demo-mutiple-name-label"
                  id="demo-mutiple-name"
                  multiple
                  value={finalData.age?.map((item: any) => item.age_id)}
                  onChange={(event) => handleDDDChange("age", event)}
                  label="Age"
                >
                  {getItems(mockOptions.age)}
                </Select>
              </FormControl>
            </Grid>
            <Grid item lg={5} xl={5} md={5} sm={12} xs={12} className={classes.marginItem}>
              <FormControl fullWidth variant="outlined">
                <InputLabel id="demo-mutiple-name-label">Grade</InputLabel>
                <Select
                  labelId="demo-mutiple-name-label"
                  id="demo-mutiple-name"
                  multiple
                  value={finalData.grade?.map((item: any) => item.grade_id)}
                  onChange={(event) => handleDDDChange("grade", event)}
                  label="Grade"
                >
                  {getItems(mockOptions.grade)}
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </Box>
        <Box>
          <Grid container justify="space-between" style={{ marginTop: "40px" }}>
            <Grid item lg={5} xl={5} md={5} sm={12} xs={12} className={classes.marginItem}>
              <TextField
                size="small"
                fullWidth
                value={finalData.estimated_time}
                label="Estimated time"
                onChange={(event) => handleInputChange("estimated_time", event)}
              />
            </Grid>
            <Grid item lg={5} xl={5} md={5} sm={12} xs={12} className={classes.marginItem}>
              <TextField value={getKeywords(finalData.keywords)} onChange={handleKeywordsChange} size="small" fullWidth label="Keywords" />
            </Grid>
          </Grid>
          <Grid container justify="space-between" className={classes.marginItem}>
            <Grid item lg={12} xl={12} md={12} sm={12} xs={12}>
              <TextField
                size="small"
                value={finalData.description || ""}
                fullWidth
                label="Description"
                onChange={(event) => handleInputChange("description", event)}
              />
            </Grid>
          </Grid>
        </Box>
      </div>
      <ModalBox modalDate={modalDate} />
    </Box>
  );
}

CreateOutcomings.routeBasePath = "/assessments/outcome-edit";
