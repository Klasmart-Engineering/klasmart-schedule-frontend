import { Box, Checkbox, Grid, makeStyles, MenuItem, TextField } from "@material-ui/core";
import React, { useMemo } from "react";
import { Controller, useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import { MockOptionsItem } from "../../api/extra";
import ModalBox from "../../components/ModalBox";
import { RootState } from "../../reducers";
import { onLoadContentEdit } from "../../reducers/content";
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
  watch();
  console.log(mockOptions);

  React.useEffect(() => {
    dispatch(onLoadContentEdit({ type: "material", id: null }));
  }, [dispatch]);

  interface outcomeDetails {
    outcome_id?: string;
    ancestor_id?: string;
    shortcode?: string;
    assumed?: boolean;
    outcome_name?: string;
    program?: { program_id?: string; program_name?: string }[];
    subject?: { subject_id?: string; subject_name?: string }[];
    developmental?: { developmental_id?: string; developmental_name?: string }[];
    skills?: { skill_id?: string; skill_name?: string }[];
    age?: { age_id?: string; age_name?: string }[];
    grade?: { grade_id?: string; grade_name?: string }[];
    estimated_time?: number;
    reject_reason?: string;
    keywords?: string[];
    source_id?: string;
    locked_by?: string;
    author_id?: string;
    author_name?: string;
    organization_id?: string;
    organization_name?: string;
    publish_scope?: string;
    publish_status?: "draft" | "pending" | "published" | "rejected";
    created_at?: number;
    description?: string;
  }

  const initialDetail: outcomeDetails = {
    outcome_id: "",
    outcome_name: "",
    shortcode: "",
    assumed: true,
    program: [],
    subject: [],
    developmental: [],
    skills: [],
    age: [],
    grade: [],
    estimated_time: 0,
    keywords: [],
    // description: "",
    reject_reason: "",
    created_at: 0,
    author_id: "",
    author_name: "",
    publish_status: "draft",
    organization_id: "",
    organization_name: "",
    locked_by: "",
    description: "",
  };

  const getItems = (list: MockOptionsItem[]) =>
    list.map((item) => (
      <MenuItem key={item.id} value={item.id}>
        {item.name}
      </MenuItem>
    ));

  const handleSave = useMemo(
    () =>
      handleSubmit(async (value: any) => {
        console.log(value);
      }),
    [handleSubmit]
  );

  const handleClose = () => {
    setOpenStatus(false);
  };

  const [enableCustomization, setEnableCustomization] = React.useState(false);

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
          setOpenStatus(false);
        },
      },
    ],
    handleClose: handleClose,
    customizeTemplate: <CustomizeRejectTemplate handleClose={handleClose} />,
  };

  const handleDelete = () => {
    setEnableCustomization(false);
    setOpenStatus(true);
  };

  const handelReject = (): void => {
    setOpenStatus(true);
    setEnableCustomization(true);
  };

  const handleChange = () => {
    setValue("assumed", !getValues("assumed"));
  };

  console.log(getValues());

  return (
    <Box component="form" className={classes.outcomings_container}>
      <OutcomeHeader
        handleSave={handleSave}
        handleReset={reset}
        handleDelete={handleDelete}
        outcome_id={outcome_id}
        handelReject={handelReject}
      />
      <div className={classes.middleBox}>
        <Box style={{ borderBottom: "1px solid #d7d7d7", marginBottom: "40px" }}>
          {outcome_id && (
            <Grid container>
              <Grid item lg={5} xl={5} md={5} sm={12} xs={12} className={classes.marginItem}>
                <Controller
                  name="reject_reason"
                  rules={{ required: true }}
                  error={errors.reject_reason}
                  as={TextField}
                  control={control}
                  size="small"
                  defaultValue={initialDetail.reject_reason}
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
                defaultValue={initialDetail.outcome_name}
                fullWidth
                label="Learning Outcome Name"
              />
            </Grid>
            <Grid item lg={5} xl={5} md={5} sm={12} xs={12} className={classes.marginItem}>
              <Controller
                name="shortcode"
                as={TextField}
                rules={{ maxLength: 3 }}
                error={errors.shortcode ? true : false}
                control={control}
                size="small"
                defaultValue={initialDetail.shortcode}
                fullWidth
                label="Short Code"
              />
            </Grid>
          </Grid>
          <Grid container justify="space-between" style={{ paddingBottom: "40px" }}>
            <Grid item lg={5} xl={5} md={5} sm={12} xs={12} className={classes.checkBox}>
              <Controller
                control={control}
                name="assumed"
                render={({ onChange, value }) => <Checkbox checked={value || false} onChange={handleChange} />}
              />
              <p className={classes.checkLabel}>Assumed</p>
            </Grid>
            {outcome_id && (
              <Grid item lg={5} xl={5} md={5} sm={12} xs={12}>
                <Controller
                  name="organization_name"
                  as={TextField}
                  control={control}
                  defaultValue={initialDetail.organization_name}
                  fullWidth
                  label="Organization"
                  disabled
                  size="small"
                />
              </Grid>
            )}
          </Grid>
          {outcome_id && (
            <Grid container justify="space-between" style={{ paddingBottom: "40px" }}>
              <Grid item lg={5} xl={5} md={5} sm={12} xs={12}>
                <Controller
                  name="created_at"
                  as={TextField}
                  control={control}
                  defaultValue={initialDetail.created_at}
                  fullWidth
                  disabled
                  label="Create Time"
                  size="small"
                />
              </Grid>
              <Grid item lg={5} xl={5} md={5} sm={12} xs={12}>
                <Controller
                  name="author_name"
                  as={TextField}
                  control={control}
                  defaultValue={initialDetail.author_name}
                  fullWidth
                  size="small"
                  disabled
                  label="Author"
                />
              </Grid>
            </Grid>
          )}
        </Box>
        <Box style={{ paddingBottom: "10px", borderBottom: "1px solid #d7d7d7" }}>
          <Grid container justify="space-between">
            <Grid item lg={5} xl={5} md={5} sm={12} xs={12} className={classes.marginItem}>
              <Controller
                name="program"
                as={TextField}
                select
                control={control}
                defaultValue={initialDetail.program}
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
                defaultValue={initialDetail.subject}
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
                defaultValue={initialDetail.developmental}
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
                defaultValue={initialDetail.skills}
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
                defaultValue={initialDetail.age}
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
                defaultValue={initialDetail.grade}
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
                as={TextField}
                control={control}
                defaultValue={initialDetail.estimated_time}
                size="small"
                fullWidth
                label="Estimated time"
              />
            </Grid>
            <Grid item lg={5} xl={5} md={5} sm={12} xs={12} className={classes.marginItem}>
              <Controller
                name="keywords"
                as={TextField}
                control={control}
                defaultValue={initialDetail.keywords}
                size="small"
                fullWidth
                label="Keywords"
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
                defaultValue={initialDetail.description}
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
