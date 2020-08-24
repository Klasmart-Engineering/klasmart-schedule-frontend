import { Box, Button, createMuiTheme, makeStyles, MenuItem, TextField, ThemeProvider, useMediaQuery, useTheme } from "@material-ui/core";
import { CloudUploadOutlined, SettingsOutlined } from "@material-ui/icons";
import React from "react";

const useStyles = makeStyles(({ breakpoints, shadows, palette }) => ({
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

interface DetailsProps {}
export default function Details(props: DetailsProps) {
  const css = useStyles();
  const defaultTheme = useTheme();
  const sm = useMediaQuery(defaultTheme.breakpoints.down("sm"));
  const size = sm ? "small" : "medium";
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
      <Box p="7.8% 8.5%">
        <TextField name="" label="Lesson Material"></TextField>
        <Box className={css.fieldset}>
          <input id="thumbnail-file-input" type="file" accept="image/*" hidden></input>
          <label htmlFor="thumbnail-file-input">
            <Button size={sm ? "medium" : "large"} variant="contained" component="span" color="primary" endIcon={<CloudUploadOutlined />}>
              Thumbnail
            </Button>
          </label>
        </Box>
        <TextField className={css.fieldset} label="Material Name"></TextField>
        <TextField className={css.fieldset} label="Program" InputProps={{ endAdornment: <SettingsOutlined /> }}></TextField>
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
        <TextField className={css.fieldset} label="Visibility Settings" select>
          <MenuItem>Organization</MenuItem>
          <MenuItem>School</MenuItem>
        </TextField>
        <TextField className={css.fieldset} label="Description"></TextField>
        <TextField className={css.fieldset} label="Keywords"></TextField>
      </Box>
    </ThemeProvider>
  );
}
