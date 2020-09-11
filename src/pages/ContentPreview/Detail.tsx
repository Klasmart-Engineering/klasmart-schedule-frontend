import { Chip, Grid, InputAdornment, TextField } from "@material-ui/core";
import makeStyles from "@material-ui/core/styles/makeStyles";
import React from "react";
import { Content } from "../../api/api";
import { formattedTime } from "../../models/ModelContentDetailForm";

const useStyles = makeStyles(() => ({
  textFiled: {
    height: "112px",
    marginBottom: 20,
    "& .MuiInputBase-root": {
      height: "100%",
    },
  },
}));

interface ContentPreviewProps {
  contentPreview: Content;
}
export function Detail(props: ContentPreviewProps) {
  const css = useStyles();
  const { contentPreview } = props;
  const colors = ["#009688", "#9c27b0", "#ffc107"];
  return (
    <>
      <TextField
        className={css.textFiled}
        margin="normal"
        fullWidth
        multiline
        rows={2}
        label="Description"
        variant="outlined"
        InputProps={{ readOnly: true }}
        value={contentPreview.description}
      />
      <Grid container spacing={3}>
        <Grid item xs={12} sm={6}>
          <TextField
            label="Created On"
            fullWidth
            variant="outlined"
            InputProps={{ readOnly: true }}
            value={formattedTime(contentPreview.created_at)}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField label="Author" fullWidth variant="outlined" InputProps={{ readOnly: true }} value={contentPreview.author_name} />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            label="Program"
            fullWidth
            variant="outlined"
            InputProps={{ readOnly: true }}
            value={contentPreview.program?.join(",")}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField label="Subject" fullWidth variant="outlined" InputProps={{ readOnly: true }} value={contentPreview.subject_name} />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            label="Development"
            fullWidth
            variant="outlined"
            InputProps={{ readOnly: true }}
            value={contentPreview.developmental?.join(",")}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField label="Skills" fullWidth variant="outlined" InputProps={{ readOnly: true }} value={contentPreview.skills} />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            label="Visibility Settings"
            fullWidth
            variant="outlined"
            InputProps={{ readOnly: true }}
            value={contentPreview.publish_scope}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField label="Duration" fullWidth variant="outlined" InputProps={{ readOnly: true }} value={contentPreview.suggest_time} />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            label="Suitable Age"
            fullWidth
            variant="outlined"
            InputProps={{ readOnly: true }}
            value={contentPreview.age?.join(",")}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField label="Grade" fullWidth variant="outlined" InputProps={{ readOnly: true }} value={contentPreview.grade?.join(",")} />
        </Grid>
      </Grid>
      <TextField
        margin="normal"
        fullWidth
        label="Keywords"
        variant="outlined"
        InputProps={{
          readOnly: true,
          startAdornment: (
            <InputAdornment position="start">
              {contentPreview.keywords?.map((value, index) => (
                <Chip key={value + index} label={value} style={{ color: "#fff", backgroundColor: colors[index % 3], margin: 2 }} />
              ))}
            </InputAdornment>
          ),
        }}
      ></TextField>
    </>
  );
}
