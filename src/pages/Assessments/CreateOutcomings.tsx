import { Box, Grid, makeStyles, TextField } from "@material-ui/core";
import React from "react";
import { Controller, useForm } from "react-hook-form";

const useStyles = makeStyles(() => ({
  outcomings_container: {
    width: "100%",
    padding: "70px 22%",
    boxSizing: "border-box",
  },
  marginItem: {
    marginBottom: "40px",
  },
}));

export default function CreateOutcomings() {
  const classes = useStyles();
  const { control } = useForm();

  return (
    <Box className={classes.outcomings_container}>
      <Box style={{ borderBottom: "1px solid #d7d7d7", marginBottom: "50px" }}>
        <Grid container justify="space-between" className={classes.marginItem}>
          <Grid item lg={5} xl={5} md={5} sm={5} xs={5}>
            <Controller name="name" as={TextField} control={control} size="small" fullWidth placeholder="Learning Outcome Name" />
          </Grid>
          <Grid item lg={5} xl={5} md={5} sm={5} xs={5}>
            <Controller name="name" as={TextField} control={control} size="small" fullWidth placeholder="Short Code" />
          </Grid>
        </Grid>
        <Grid container justify="space-between" style={{ paddingBottom: "60px" }}>
          <Grid item lg={5} xl={5} md={5} sm={5} xs={5}>
            <Controller name="name" as={TextField} control={control} size="small" fullWidth placeholder="Assumed" />
          </Grid>
        </Grid>
      </Box>
      <Box style={{ paddingBottom: "10px", borderBottom: "1px solid #d7d7d7" }}>
        <Grid container justify="space-between" className={classes.marginItem}>
          <Grid item lg={5} xl={5} md={5} sm={5} xs={5}>
            <Controller name="name" as={TextField} select control={control} size="small" fullWidth label="Program" />
          </Grid>
          <Grid item lg={5} xl={5} md={5} sm={5} xs={5}>
            <Controller name="name" as={TextField} select control={control} size="small" fullWidth label="Subject" />
          </Grid>
        </Grid>
        <Grid container justify="space-between" className={classes.marginItem}>
          <Grid item lg={5} xl={5} md={5} sm={5} xs={5}>
            <Controller name="name" as={TextField} select control={control} size="small" fullWidth label="Development Category" />
          </Grid>
          <Grid item lg={5} xl={5} md={5} sm={5} xs={5}>
            <Controller name="name" as={TextField} select control={control} size="small" fullWidth label="Skills Category" />
          </Grid>
        </Grid>
        <Grid container justify="space-between" className={classes.marginItem}>
          <Grid item lg={5} xl={5} md={5} sm={5} xs={5}>
            <Controller name="name" as={TextField} select control={control} size="small" fullWidth label="Age" />
          </Grid>
          <Grid item lg={5} xl={5} md={5} sm={5} xs={5}>
            <Controller name="name" as={TextField} select control={control} size="small" fullWidth label="Grade" />
          </Grid>
        </Grid>
      </Box>
      <Box>
        <Grid container justify="space-between" className={classes.marginItem} style={{ marginTop: "40px" }}>
          <Grid item lg={5} xl={5} md={5} sm={5} xs={5}>
            <Controller name="name" as={TextField} control={control} size="small" fullWidth placeholder="Estimated time" />
          </Grid>
          <Grid item lg={5} xl={5} md={5} sm={5} xs={5}>
            <Controller name="name" as={TextField} control={control} size="small" fullWidth placeholder="Keywords" />
          </Grid>
        </Grid>
        <Grid container justify="space-between" className={classes.marginItem} style={{ marginTop: "40px" }}>
          <Grid item lg={12} xl={12} md={12} sm={12} xs={12}>
            <Controller name="name" as={TextField} control={control} size="small" fullWidth placeholder="Description" />
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
}
