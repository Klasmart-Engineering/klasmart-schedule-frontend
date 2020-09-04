import { Box, Checkbox, Grid, makeStyles, MenuItem, TextField } from "@material-ui/core";
import React, { useMemo } from "react";
import { Controller, useForm } from "react-hook-form";
import { useLocation } from "react-router-dom";
import ModalBox from "../../components/ModalBox";
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
  const { control, errors, watch, handleSubmit, reset } = useForm();
  const [openStatus, setOpenStatus] = React.useState(false);
  watch();

  const mockList = [
    {
      id: 1,
      name: "飞洒晒晒",
    },
    {
      id: 2,
      name: "fdsfsdfs",
    },
    {
      id: 3,
      name: "seengn",
    },
    {
      id: 4,
      name: "khgk4556",
    },
    {
      id: 5,
      name: "grtyrt54456f",
    },
  ];

  interface outcomeDetails {
    name: string;
    code: string;
    assumed: boolean;
    program: string;
    subject: string;
    development: string;
    skills: string;
    age: string;
    grade: string;
    estimateTime: string;
    keywords: string;
    description: string;
    reject_reason: string;
    organization: string;
    create_time: string;
    author: string;
  }

  const initialDetail: outcomeDetails = {
    name: "",
    code: "",
    assumed: true,
    program: "",
    subject: "",
    development: "",
    skills: "",
    age: "",
    grade: "",
    estimateTime: "",
    keywords: "",
    description: "",
    reject_reason: "",
    organization: "",
    create_time: "",
    author: "",
  };

  const getItems = () =>
    mockList.map((item) => (
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

  const handleReset = () => {
    reset();
  };

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
    setOpenStatus(true);
  };

  const handelReject = (): void => {
    setOpenStatus(true);
    setEnableCustomization(true);
  };

  return (
    <Box component="form" className={classes.outcomings_container}>
      <OutcomeHeader
        handleSave={handleSave}
        handleReset={handleReset}
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
                name="name"
                rules={{ required: true }}
                error={errors.name ? true : false}
                as={TextField}
                control={control}
                size="small"
                defaultValue={initialDetail.name}
                fullWidth
                label="Learning Outcome Name"
              />
            </Grid>
            <Grid item lg={5} xl={5} md={5} sm={12} xs={12} className={classes.marginItem}>
              <Controller
                name="code"
                as={TextField}
                rules={{ maxLength: 3 }}
                error={errors.code ? true : false}
                control={control}
                size="small"
                defaultValue={initialDetail.code}
                fullWidth
                label="Short Code"
              />
            </Grid>
          </Grid>
          <Grid container justify="space-between" style={{ paddingBottom: "40px" }}>
            <Grid item lg={5} xl={5} md={5} sm={12} xs={12} className={classes.checkBox}>
              <Controller name="assumed" as={Checkbox} control={control} defaultChecked={initialDetail.assumed} size="small" />
              <p className={classes.checkLabel}>Assumed</p>
            </Grid>
            {outcome_id && (
              <Grid item lg={5} xl={5} md={5} sm={12} xs={12}>
                <Controller
                  name="organization "
                  as={TextField}
                  control={control}
                  defaultValue={initialDetail.organization}
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
                  name="create_time"
                  as={TextField}
                  control={control}
                  defaultValue={initialDetail.create_time}
                  fullWidth
                  disabled
                  label="Create Time"
                  size="small"
                />
              </Grid>
              <Grid item lg={5} xl={5} md={5} sm={12} xs={12}>
                <Controller
                  name="author"
                  as={TextField}
                  control={control}
                  defaultValue={initialDetail.author}
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
              >
                {getItems()}
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
              >
                {getItems()}
              </Controller>
            </Grid>
          </Grid>
          <Grid container justify="space-between">
            <Grid item lg={5} xl={5} md={5} sm={12} xs={12} className={classes.marginItem}>
              <Controller
                name="development"
                as={TextField}
                select
                control={control}
                defaultValue={initialDetail.development}
                size="small"
                fullWidth
                label="Development Category"
              >
                {getItems()}
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
              >
                {getItems()}
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
              >
                {getItems()}
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
              >
                {getItems()}
              </Controller>
            </Grid>
          </Grid>
        </Box>
        <Box>
          <Grid container justify="space-between" style={{ marginTop: "40px" }}>
            <Grid item lg={5} xl={5} md={5} sm={12} xs={12} className={classes.marginItem}>
              <Controller
                name="estimateTime"
                as={TextField}
                control={control}
                defaultValue={initialDetail.estimateTime}
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
