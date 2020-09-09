import { Box, Checkbox, Grid, makeStyles, MenuItem, TextField } from "@material-ui/core";
import React from "react";
import { Controller, useForm } from "react-hook-form";
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
  const { control, errors, watch, handleSubmit, reset, setValue, getValues } = useForm();
  const [openStatus, setOpenStatus] = React.useState(false);
  const { mockOptions } = useSelector<RootState, RootState["content"]>((state) => state.content);
  const dispatch = useDispatch();
  const history = useHistory();
  const [showCode, setShoeCode] = React.useState(false);
  let { outcomeDetail }: any = useSelector<RootState, RootState["outcome"]>((state) => state.outcome);
  watch();

  React.useEffect(() => {
    dispatch(onLoadContentEdit({ type: "material", id: null }));
  }, [dispatch]);

  React.useEffect(() => {
    if (outcome_id) {
      dispatch(getOutcomeDetail(outcome_id));
    }
  }, [dispatch, outcome_id]);

  const getItems = (list: MockOptionsItem[]) =>
    list.map((item) => (
      <MenuItem key={item.id} value={item.id}>
        {item.name}
      </MenuItem>
    ));

  const handleSave = React.useMemo(
    () =>
      handleSubmit(async (value: any) => {
        if (outcome_id) {
          await dispatch(updateOutcome({ outcome_id, value }));
          dispatch(actSuccess("Update Success"));
          return;
        }
        const result: any = await dispatch(save(value));
        setShoeCode(true);
        console.log(result);
        history.push(`/assessments/outcomes?outcome_id=${result.payload.outcome_id}`);
        dispatch(actSuccess("Save Success"));
      }),
    [dispatch, handleSubmit, history, outcome_id]
  );

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

  const handleReject = (reason: string) => {
    dispatch(reject({ id: outcome_id, reject_reason: reason }));
    setOpenStatus(false);
    dispatch(actSuccess("Reject Success"));
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
        event: () => {
          // deleteScheduleByid();
          dispatch(deleteOutcome(outcome_id));
          setOpenStatus(false);
          dispatch(actSuccess("Delete Success"));
        },
      },
    ],
    handleClose: handleClose,
    customizeTemplate: <CustomizeRejectTemplate handleClose={handleClose} handleReject={handleReject} />,
  };

  const handleDelete = () => {
    setEnableCustomization(false);
    setOpenStatus(true);
  };

  const handelReject = (): void => {
    setOpenStatus(true);
    setEnableCustomization(true);
  };

  const handleAssumedChange = () => {
    setValue("assumed", !getValues("assumed"));
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
    setValue("keywords", keywords);
  };

  return (
    <Box component="form" className={classes.outcomings_container}>
      <OutcomeHeader
        handleSave={handleSave}
        handleReset={reset}
        handleDelete={handleDelete}
        outcome_id={outcome_id}
        handelReject={handelReject}
        handlePublish={handlePublish}
        handleApprove={handleApprove}
        publish_status={outcomeDetail.publish_status}
      />
      <div className={classes.middleBox}>
        <Box style={{ borderBottom: "1px solid #d7d7d7", marginBottom: "40px" }}>
          {outcomeDetail.publish_status && outcomeDetail.publish_status === "rejected" && (
            <Grid container>
              <Grid item lg={5} xl={5} md={5} sm={12} xs={12} className={classes.marginItem}>
                <Controller
                  name="reject_reason"
                  rules={{ required: true }}
                  error={errors.reject_reason}
                  as={TextField}
                  control={control}
                  size="small"
                  defaultValue={outcomeDetail.reject_reason}
                  fullWidth
                  label="Reject Reason"
                />
              </Grid>
            </Grid>
          )}
          <Grid container justify="space-between">
            <Grid item lg={5} xl={5} md={5} sm={12} xs={12} className={classes.marginItem}>
              <Controller
                name="outcome_name"
                rules={{ required: true }}
                error={errors.outcome_name ? true : false}
                as={TextField}
                control={control}
                size="small"
                defaultValue={outcomeDetail.outcome_name}
                fullWidth
                label="Learning outcome Name"
              />
            </Grid>
            {(outcome_id || showCode) && (
              <Grid item lg={5} xl={5} md={5} sm={12} xs={12} className={classes.marginItem}>
                <Controller
                  name="shortcode"
                  as={TextField}
                  control={control}
                  size="small"
                  defaultValue={outcomeDetail.shortcode}
                  fullWidth
                  label="Short Code"
                  disabled
                />
              </Grid>
            )}
            <Grid item lg={5} xl={5} md={5} sm={12} xs={12} className={`${classes.checkBox} ${classes.marginItem}`}>
              <Controller
                control={control}
                name="assumed"
                render={({ onChange, value }) => <Checkbox checked={value || false} onChange={handleAssumedChange} />}
              />
              <p className={classes.checkLabel}>Assumed</p>
            </Grid>
            {(outcome_id || showCode) && (
              <>
                <Grid item lg={5} xl={5} md={5} sm={12} xs={12} className={classes.marginItem}>
                  <Controller
                    name="organization_name"
                    as={TextField}
                    control={control}
                    defaultValue={outcomeDetail.organization_id}
                    fullWidth
                    label="Organization"
                    disabled
                    size="small"
                  />
                </Grid>
                <Grid item lg={5} xl={5} md={5} sm={12} xs={12} className={classes.marginItem}>
                  <Controller
                    name="created_at"
                    as={TextField}
                    control={control}
                    defaultValue={timestampToTime(outcomeDetail.created_at)}
                    fullWidth
                    disabled
                    label="Create Time"
                    size="small"
                  />
                </Grid>
                <Grid item lg={5} xl={5} md={5} sm={12} xs={12} className={classes.marginItem}>
                  <Controller
                    name="author_name"
                    as={TextField}
                    control={control}
                    defaultValue={outcomeDetail.author_name}
                    fullWidth
                    size="small"
                    disabled
                    label="Author"
                  />
                </Grid>
              </>
            )}
          </Grid>
        </Box>
        <Box style={{ paddingBottom: "10px", borderBottom: "1px solid #d7d7d7" }}>
          <Grid container justify="space-between">
            <Grid item lg={5} xl={5} md={5} sm={12} xs={12} className={classes.marginItem}>
              <Controller
                name="program"
                as={TextField}
                select
                control={control}
                defaultValue={outcomeDetail.program}
                size="small"
                fullWidth
                label="Program"
                SelectProps={{ multiple: true }}
              >
                {getItems(mockOptions.program)}
              </Controller>
            </Grid>
            <Grid item lg={5} xl={5} md={5} sm={12} xs={12} className={classes.marginItem}>
              <Controller
                name="subject"
                as={TextField}
                select
                control={control}
                defaultValue={outcomeDetail.subject}
                size="small"
                fullWidth
                label="Subject"
                SelectProps={{ multiple: true }}
              >
                {getItems(mockOptions.subject)}
              </Controller>
            </Grid>
          </Grid>
          <Grid container justify="space-between">
            <Grid item lg={5} xl={5} md={5} sm={12} xs={12} className={classes.marginItem}>
              <Controller
                name="developmental"
                as={TextField}
                select
                control={control}
                defaultValue={outcomeDetail.developmental}
                size="small"
                fullWidth
                label="Development Category"
                SelectProps={{ multiple: true }}
              >
                {getItems(mockOptions.developmental)}
              </Controller>
            </Grid>
            <Grid item lg={5} xl={5} md={5} sm={12} xs={12} className={classes.marginItem}>
              <Controller
                name="skills"
                as={TextField}
                select
                control={control}
                defaultValue={outcomeDetail.skills}
                size="small"
                fullWidth
                label="Skills Category"
                SelectProps={{ multiple: true }}
              >
                {getItems(mockOptions.skills)}
              </Controller>
            </Grid>
          </Grid>
          <Grid container justify="space-between">
            <Grid item lg={5} xl={5} md={5} sm={12} xs={12} className={classes.marginItem}>
              <Controller
                name="age"
                as={TextField}
                select
                control={control}
                defaultValue={outcomeDetail.age}
                size="small"
                fullWidth
                label="Age"
                SelectProps={{ multiple: true }}
              >
                {getItems(mockOptions.age)}
              </Controller>
            </Grid>
            <Grid item lg={5} xl={5} md={5} sm={12} xs={12} className={classes.marginItem}>
              <Controller
                name="grade"
                as={TextField}
                select
                control={control}
                defaultValue={outcomeDetail.grade}
                size="small"
                fullWidth
                label="Grade"
                SelectProps={{ multiple: true }}
              >
                {getItems(mockOptions.grade)}
              </Controller>
            </Grid>
          </Grid>
        </Box>
        <Box>
          <Grid container justify="space-between" style={{ marginTop: "40px" }}>
            <Grid item lg={5} xl={5} md={5} sm={12} xs={12} className={classes.marginItem}>
              <Controller
                name="estimated_time"
                control={control}
                defaultValue={outcomeDetail.estimated_time || ""}
                as={TextField}
                size="small"
                fullWidth
                label="Estimated time"
                rules={{ required: true, pattern: /^[0-9]*$/ }}
                error={errors.estimated_time ? true : false}
              />
            </Grid>
            <Grid item lg={5} xl={5} md={5} sm={12} xs={12} className={classes.marginItem}>
              <Controller
                name="keywords"
                // as={TextField}
                control={control}
                // defaultValue={outcomeDetail.keywords?.map(item => (item + ',')) || []}
                // onChange={handleKeywordsChange}
                // render={({ onChange, value }) => <Checkbox checked={value || false} onChange={handleAssumedChange} />}
                render={({ value, onChange }) => (
                  <TextField defaultValue={value || []} onChange={handleKeywordsChange} size="small" fullWidth label="Keywords" />
                )}
              />
            </Grid>
          </Grid>
          <Grid container justify="space-between" className={classes.marginItem}>
            <Grid item lg={12} xl={12} md={12} sm={12} xs={12}>
              <Controller
                name="description"
                as={TextField}
                control={control}
                size="small"
                defaultValue={outcomeDetail.description || ""}
                fullWidth
                label="Description"
              />
            </Grid>
          </Grid>
        </Box>
      </div>
      <ModalBox modalDate={modalDate} />
    </Box>
  );
}

CreateOutcomings.routeBasePath = "/outcome-edit";
