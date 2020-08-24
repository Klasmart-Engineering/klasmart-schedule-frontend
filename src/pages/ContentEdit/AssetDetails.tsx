import { Box, Button, createMuiTheme, makeStyles, MenuItem, TextField, ThemeProvider, useMediaQuery, useTheme } from "@material-ui/core";
import { CloudUploadOutlined, SettingsOutlined } from "@material-ui/icons";
import React from "react";
import { useDispatch } from "react-redux";

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

interface DetailProps {
  sm: any;
  theme: Object;
}
function AssetsDetails(props: DetailProps) {
  const css = useStyles();
  const { sm, theme } = props;
  const dispatch = useDispatch();

  interface InitData {
    fileType: string;
    assetsName: string;
    program: string;
    subject: string;
    developmental: string;
    skills: string;
    age: number;
    description: string;
    keywords: string;
  }

  const [topicList, setTopicList] = React.useState({
    fileType: "images",
    assetsName: "",
    program: "",
    subject: "",
    developmental: "",
    skills: "",
    age: 1,
    description: "",
    keywords: "",
  });

  const handleTopicListChange = (event: React.ChangeEvent<{ value: String }>, name: string) => {
    const newTopocList = {
      ...topicList,
      [name]: event.target.value as string,
    };
    setTopicList((newTopocList as unknown) as { [key in keyof InitData]: InitData[key] });
    dispatch({ type: "save", topicList: newTopocList });
  };
  return (
    <ThemeProvider theme={theme}>
      <Box p="7.8% 8.5%">
        <TextField label="Lesson Material" value={topicList.fileType} onChange={(e) => handleTopicListChange(e, "fileType")} select>
          <MenuItem value="images">Image</MenuItem>
          <MenuItem value="video">Video</MenuItem>
          <MenuItem value="audio">Audio</MenuItem>
          <MenuItem value="document">Document</MenuItem>
        </TextField>
        <Box className={css.fieldset}>
          <input id="thumbnail-file-input" type="file" accept="image/*" hidden></input>
          <label htmlFor="thumbnail-file-input">
            <Button size={sm ? "medium" : "large"} variant="contained" component="span" color="primary" endIcon={<CloudUploadOutlined />}>
              Thumbnail
            </Button>
          </label>
        </Box>
        <TextField
          className={css.fieldset}
          label="Assets Name"
          value={topicList.assetsName}
          onChange={(e) => handleTopicListChange(e, "assetsName")}
        ></TextField>
        <TextField
          className={css.fieldset}
          label="Program"
          value={topicList.program}
          onChange={(e) => handleTopicListChange(e, "program")}
          InputProps={{ endAdornment: <SettingsOutlined /> }}
        ></TextField>
        <TextField
          className={css.fieldset}
          label="Subject"
          value={topicList.subject}
          onChange={(e) => handleTopicListChange(e, "subject")}
        ></TextField>
        <Box>
          <TextField
            className={sm ? css.fieldset : css.halfFieldset}
            fullWidth={sm}
            label="Developmental"
            value={topicList.developmental}
            onChange={(e) => handleTopicListChange(e, "developmental")}
            InputProps={{ endAdornment: <SettingsOutlined /> }}
          ></TextField>
          <TextField
            className={sm ? css.fieldset : css.halfFieldset}
            fullWidth={sm}
            label="Skills"
            value={topicList.skills}
            onChange={(e) => handleTopicListChange(e, "skills")}
            InputProps={{ endAdornment: <SettingsOutlined /> }}
          ></TextField>
        </Box>
        <TextField className={css.fieldset} label="age" value={topicList.age} onChange={(e) => handleTopicListChange(e, "age")} select>
          <MenuItem value={1}>3-4</MenuItem>
          <MenuItem value={2}>4-2</MenuItem>
          <MenuItem value={3}>5-6</MenuItem>
        </TextField>
        <TextField
          className={css.fieldset}
          label="Description"
          value={topicList.description}
          onChange={(e) => handleTopicListChange(e, "description")}
        ></TextField>
        <TextField
          className={css.fieldset}
          label="Keywords"
          value={topicList.keywords}
          onChange={(e) => handleTopicListChange(e, "keywords")}
        ></TextField>
      </Box>
    </ThemeProvider>
  );
}

interface AssetDetailsProps {}
export default function AssetDetails(props: AssetDetailsProps) {
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
  return <AssetsDetails theme={theme} sm={sm} />;
}
