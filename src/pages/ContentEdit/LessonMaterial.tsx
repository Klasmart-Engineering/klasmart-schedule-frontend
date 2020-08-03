import { TabContext, TabList, TabPanel } from "@material-ui/lab";
import React from "react";
import {
  Tab,
  TextField,
  Box,
  makeStyles,
  Button,
  MenuItem,
} from "@material-ui/core";
import { CloudUploadOutlined, SettingsOutlined } from "@material-ui/icons";

const useStyles = makeStyles({
  tabPane: {
    padding: "7.8% 8.5%",
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
});

export default function LessonMaterial() {
  const css = useStyles();
  return (
    <Box display="flex" p={5}>
      <Box
        display="flex"
        mr={4}
        flex="1 1 703px"
        flexDirection="column"
        boxShadow={3}
      >
        <TabContext value="details">
          <TabList variant="fullWidth">
            <Tab label="Details" value="details" />
            <Tab label="Learning Outcomes" value="outcomes" />
            <Tab label="Media Assets" value="assets" />
          </TabList>
          <TabPanel className={css.tabPane} value="details">
            <TextField
              label="Lesson Material"
              variant="outlined"
              fullWidth
            ></TextField>
            <Box className={css.fieldset}>
              <input
                id="thumbnail-file-input"
                type="file"
                accept="image/*"
                hidden
              ></input>
              <label htmlFor="thumbnail-file-input">
                <Button
                  size="large"
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
              variant="outlined"
              fullWidth
              label="Material Name"
            ></TextField>
            <TextField
              className={css.fieldset}
              variant="outlined"
              fullWidth
              label="Program"
              InputProps={{ endAdornment: <SettingsOutlined /> }}
            ></TextField>
            <TextField
              className={css.fieldset}
              variant="outlined"
              fullWidth
              label="Subject"
            ></TextField>
            <Box>
              <TextField
                className={css.halfFieldset}
                variant="outlined"
                label="Developmental"
                InputProps={{ endAdornment: <SettingsOutlined /> }}
              ></TextField>
              <TextField
                className={css.halfFieldset}
                variant="outlined"
                label="Skills"
                InputProps={{ endAdornment: <SettingsOutlined /> }}
              ></TextField>
            </Box>
            <TextField
              className={css.fieldset}
              variant="outlined"
              fullWidth
              label="Visibility Settings"
              select
            >
              <MenuItem>Organization</MenuItem>
              <MenuItem>School</MenuItem>
            </TextField>
            <TextField
              className={css.fieldset}
              variant="outlined"
              fullWidth
              label="Description"
            ></TextField>
            <TextField
              className={css.fieldset}
              variant="outlined"
              fullWidth
              label="Keywords"
            ></TextField>
          </TabPanel>
          <TabPanel className={css.tabPane} value="outcomes">
            outcomes
          </TabPanel>
          <TabPanel className={css.tabPane} value="assets">
            assets
          </TabPanel>
        </TabContext>
      </Box>
      <Box flex="1 1 1105px" boxShadow={1}>
        h5p
      </Box>
    </Box>
  );
}
