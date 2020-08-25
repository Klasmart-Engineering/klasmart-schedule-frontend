// import { Breakpoint } from "@material-ui/core/styles/createBreakpoints";
import { Box, Button, CardMedia, Chip, Grid, InputAdornment, Tab, Tabs, TextField, Typography } from "@material-ui/core";
// import LayoutPair from "../ContentEdit/Layout";
import { makeStyles, Theme } from "@material-ui/core/styles";
import CloseIcon from "@material-ui/icons/Close";
import React from "react";
import { Content } from "../../api/api";
import mockData from "../../mocks/content.json";

const useStyles = makeStyles((theme: Theme) => ({
  container: {
    width: "100%",
    display: "flex",
    height: "100%",
    [theme.breakpoints.down("sm")]: {
      flexDirection: "column",
    },
  },
  left: {
    width: "434px",
    height: "100%",
    padding: "12px",
    boxSizing: "border-box",
    [theme.breakpoints.down("sm")]: {
      width: "100%",
    },
  },
  closeIconCon: {
    textAlign: "right",
  },
  text: {
    fontSize: "24px",
    fontWeight: 700,
    marginRight: "10px",
    [theme.breakpoints.down("lg")]: {
      fontSize: "20px",
    },
  },
  nameCon: {
    display: "flex",
    alignItems: "center",
  },
  img: {
    margin: "10px 0 20px 0",
  },
  tab: {
    width: "calc(100% + 24px)",
    backgroundColor: "#f0f0f0",
    marginLeft: "-12px",
    fontSize: "18px",
  },
  textFiled: {
    height: "112px",
    "& .MuiInputBase-root": {
      height: "100%",
    },
  },
  publistedBtn: {
    color: "#d32f2f",
    border: "2px solid #d32f2f",
    fontWeight: 700,
    marginRight: "10px",
  },
  right: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120,
    maxWidth: 300,
  },
  chips: {
    display: "flex",
    flexWrap: "wrap",
  },
  chip: {
    margin: 2,
  },
}));

function PublishedBtn() {
  const css = useStyles();
  return (
    <Box display="flex" justifyContent="flex-end">
      <Button className={css.publistedBtn} variant="outlined">
        Remove
      </Button>
      <Button color="primary" variant="contained">
        Edit
      </Button>
    </Box>
  );
}

function WaitingBtn() {
  const css = useStyles();
  return (
    <Box display="flex" justifyContent="flex-end">
      <Button className={css.publistedBtn} variant="outlined">
        Delete
      </Button>
    </Box>
  );
}

function PendingBtn() {
  const css = useStyles();
  return (
    <Box display="flex" justifyContent="flex-end">
      <Button className={css.publistedBtn} variant="contained">
        Reject
      </Button>
      <Button>Approve</Button>
    </Box>
  );
}

function ArchiveBtn() {
  const css = useStyles();
  return (
    <Box display="flex" justifyContent="flex-end">
      <Button className={css.publistedBtn} variant="outlined">
        Delete
      </Button>
      <Button>Republish</Button>
    </Box>
  );
}

function DraftRejectBtn() {
  const css = useStyles();
  return (
    <Box display="flex" justifyContent="flex-end">
      <Button className={css.publistedBtn} variant="outlined">
        Delete
      </Button>
      <Button>Edit</Button>
    </Box>
  );
}

export default function ContentPreview(props: Content) {
  const data = mockData[0];
  const css = useStyles();
  const [value, setValue] = React.useState(0);
  const names = ["11111", "22222", "33333"];
  const handleChange = (event: React.ChangeEvent<{}>, newValue: number) => {
    setValue(newValue);
  };
  return (
    <Box className={css.container}>
      <Box className={css.left}>
        <Box className={css.closeIconCon}>
          <CloseIcon />
        </Box>
        <Typography className={css.text}>Title</Typography>
        <Box className={css.nameCon}>
          <Typography className={css.text}>{data.name}</Typography>
          <Chip size="small" color="primary" label={data.content_type_name} />
        </Box>
        <CardMedia className={css.img} component="img" image={data.img} />
        <Tabs
          className={css.tab}
          value={value}
          onChange={handleChange}
          indicatorColor="primary"
          textColor="primary"
          variant="fullWidth"
          aria-label="full width tabs example"
        >
          <Tab label="Details" />
          <Tab label="Assessments" />
        </Tabs>
        <TextField
          className={css.textFiled}
          margin="normal"
          fullWidth
          multiline
          rows={2}
          label="Description"
          variant="outlined"
          value={data.description}
        />
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6}>
            <TextField label="Program" fullWidth variant="outlined" value={data.program_name} />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField label="Subject" fullWidth variant="outlined" value={data.subject_name} />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField label="Development" fullWidth variant="outlined" value={data.developmental_name} />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField label="Skills" fullWidth variant="outlined" value={data.skills} />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField label="Visibility Settings" fullWidth variant="outlined" value={data.settings} />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField label="Duration" fullWidth variant="outlined" value={"Duration"} />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField label="Suitable Age" fullWidth variant="outlined" value={data.age_name} />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField label="Grade" fullWidth variant="outlined" value={"Grade"} />
          </Grid>
        </Grid>
        <TextField
          margin="normal"
          fullWidth
          label="Keywords"
          variant="outlined"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                {data.keywords.map((value) => (
                  <Chip key={value} label={value} className={css.chip} />
                ))}
              </InputAdornment>
            ),
          }}
        ></TextField>
        <PublishedBtn />
      </Box>
      <Box className={css.right}>right</Box>
    </Box>
  );
}
ContentPreview.routeBasePath = "/library/content-preview";
