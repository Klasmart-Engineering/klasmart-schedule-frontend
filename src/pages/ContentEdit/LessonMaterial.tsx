import { TabContext, TabList, TabPanel } from "@material-ui/lab";
import React from "react";
import {
  Tab,
  TextField,
  Box,
  makeStyles,
  Button,
  MenuItem,
  Paper,
  useMediaQuery,
  useTheme,
  createMuiTheme,
  ThemeProvider,
  AppBar,
  Tabs,
} from "@material-ui/core";
import { CloudUploadOutlined, SettingsOutlined } from "@material-ui/icons";
import LayoutPair from "./Layout";
import clsx from "clsx";

const useStyles = makeStyles(({ breakpoints, shadows, palette }) => ({
  tabs: {
    backgroundColor: palette.grey[200],
    boxShadow: shadows[3],
  },
  tabPane: {
    padding: "7.8% 8.5%",
  },
  tab: {
    fontWeight: 'bold',
    padding: 0,
    [breakpoints.down("sm")]: {
      fontSize: 13,
      letterSpacing: 0,
    },
  },
  fieldset: {
    marginTop: 20,
  },
  halfFieldset: {
    marginTop: 20,
    width: "calc(50% - 10px)",
    "&:not(:first-child)": {
      marginLeft: 20,
    },
  },
}));

export default function LessonMaterial() {
  const css = useStyles();
  const defaultTheme = useTheme();
  const sm = useMediaQuery(defaultTheme.breakpoints.down("sm"));
  const size = sm ? 'small' : 'medium';
  const theme = createMuiTheme(defaultTheme, {
    props: {
      MuiTextField: {
        size,
        fullWidth: true,
      },
      MuiButton: {
        size,
      },
      MuiSvgIcon: {
        fontSize: sm ? "small" : "default",
      },
    },
  });

  return (
    <ThemeProvider theme={theme}>
      <LayoutPair
        breakpoint="md"
        leftWidth={703}
        rightWidth={1105}
        spacing={32}
        p={sm ? 0 : 5}
      >
        <Paper elevation={sm ? 0 : 3}>
          <TabContext value="details">
            <Tabs value="details" className={css.tabs} variant="fullWidth" indicatorColor="primary" textColor="primary">
              <Tab className={css.tab} label="Details" value="details" />
              <Tab
                className={css.tab}
                label="Learning Outcomes"
                value="outcomes"
              />
              <Tab className={css.tab} label="Media Assets" value="assets" />
            </Tabs>
            <TabPanel className={css.tabPane} value="details">
              <TextField label="Lesson Material"></TextField>
              <Box className={css.fieldset}>
                <input
                  id="thumbnail-file-input"
                  type="file"
                  accept="image/*"
                  hidden
                ></input>
                <label htmlFor="thumbnail-file-input">
                  <Button
                    size={sm ? "medium" : "large"}
                    variant="contained"
                    component="span"
                    color="primary"
                    endIcon={<CloudUploadOutlined />}
                  >
                    Thumbnail
                  </Button>
                </label>
              </Box>
              <TextField
                className={css.fieldset}
                label="Material Name"
              ></TextField>
              <TextField
                className={css.fieldset}
                label="Program"
                InputProps={{ endAdornment: <SettingsOutlined /> }}
              ></TextField>
              <TextField className={css.fieldset} label="Subject"></TextField>
              <Box>
                <TextField
                  className={sm ? css.fieldset : css.halfFieldset}
                  fullWidth={sm}
                  label="Developmental"
                  InputProps={{ endAdornment: <SettingsOutlined /> }}
                ></TextField>
                <TextField
                  className={sm ? css.fieldset : css.halfFieldset}
                  fullWidth={sm}
                  label="Skills"
                  InputProps={{ endAdornment: <SettingsOutlined /> }}
                ></TextField>
              </Box>
              <TextField
                className={css.fieldset}
                label="Visibility Settings"
                select
              >
                <MenuItem>Organization</MenuItem>
                <MenuItem>School</MenuItem>
              </TextField>
              <TextField
                className={css.fieldset}
                label="Description"
              ></TextField>
              <TextField className={css.fieldset} label="Keywords"></TextField>
            </TabPanel>
            <TabPanel className={css.tabPane} value="outcomes">
              outcomes
            </TabPanel>
            <TabPanel className={css.tabPane} value="assets">
              assets
            </TabPanel>
          </TabContext>
        </Paper>
        <Box flex="1 1 1105px" boxShadow={sm ? 0 : 1} textAlign="center">
          h5p content
        </Box>
      </LayoutPair>
    </ThemeProvider>
  );
}
