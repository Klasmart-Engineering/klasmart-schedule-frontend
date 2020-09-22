import { Chip, Grid, InputAdornment, TextField } from "@material-ui/core";
import makeStyles from "@material-ui/core/styles/makeStyles";
import React from "react";
import { EntityContentInfoWithDetails } from "../../api/api.auto";
import { d } from "../../locale/LocaleManager";
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
  contentPreview: EntityContentInfoWithDetails;
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
        disabled={true}
        rows={2}
        label={d("Description").t("library_label_description")}
        variant="outlined"
        InputProps={{ readOnly: true }}
        value={contentPreview.description}
      />
      <Grid container spacing={3}>
        <Grid item xs={12} sm={6}>
          <TextField
            label={d("Created On").t("library_label_created_on")}
            fullWidth
            disabled={true}
            variant="outlined"
            InputProps={{ readOnly: true }}
            value={formattedTime(contentPreview.created_at)}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            label={d("Author").t("library_label_author")}
            fullWidth
            disabled={true}
            variant="outlined"
            InputProps={{ readOnly: true }}
            value={contentPreview.author_name}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            label={d("Program").t("library_label_program")}
            fullWidth
            disabled={true}
            variant="outlined"
            InputProps={{ readOnly: true }}
            value={contentPreview.program_name?.join(",")}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            label={d("Subject").t("library_label_subject")}
            fullWidth
            disabled={true}
            variant="outlined"
            InputProps={{ readOnly: true }}
            value={contentPreview.subject_name}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            label={d("Development").t("library_label_development")}
            fullWidth
            disabled={true}
            variant="outlined"
            InputProps={{ readOnly: true }}
            value={contentPreview.developmental_name?.join(",")}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            label={d("Skills").t("library_label_skills")}
            fullWidth
            disabled={true}
            variant="outlined"
            InputProps={{ readOnly: true }}
            value={contentPreview.skills_name}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            label={d("Visibility Settings").t("library_label_visibility_settings")}
            fullWidth
            disabled={true}
            variant="outlined"
            InputProps={{ readOnly: true }}
            value={contentPreview.publish_scope}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            label={d("Duration(Minutes)").t("library_label_duration")}
            fullWidth
            disabled={true}
            variant="outlined"
            InputProps={{ readOnly: true }}
            value={contentPreview.suggest_time}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            label={d("Suitable age").t("library_label_suitable_age")}
            fullWidth
            disabled={true}
            variant="outlined"
            InputProps={{ readOnly: true }}
            value={contentPreview.age_name?.join(",")}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            label={d("Grade").t("library_label_grade")}
            fullWidth
            disabled={true}
            variant="outlined"
            InputProps={{ readOnly: true }}
            value={contentPreview.grade_name?.join(",")}
          />
        </Grid>
      </Grid>
      <TextField
        margin="normal"
        fullWidth
        disabled={true}
        label={d("Keywords").t("library_label_keywords")}
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
