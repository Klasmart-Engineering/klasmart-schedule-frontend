import { Box, Checkbox, Chip, FormControlLabel, Grid, InputAdornment, TextField } from "@material-ui/core";
import makeStyles from "@material-ui/core/styles/makeStyles";
import { CloudDownloadOutlined } from "@material-ui/icons";
import React from "react";
import { EntityContentInfoWithDetails } from "../../api/api.auto";
import { apiResourcePathById } from "../../api/extra";
import { ContentType } from "../../api/type";
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
  fieldset: {
    marginTop: 32,
    marginBottom: 32,
  },
  keyword: {
    "& .MuiInputBase-input": {
      width: 0,
    },
  },
  chipCon: {
    width: "100%",
    overflowX: "auto",
    overflowY: "hidden",
    padding: "18.5px 14px",
    scrollbarWidth: "none",
    "&::-webkit-scrollbar": {
      display: "none",
    },
  },
  iconField: {
    position: "absolute",
    top: "40%",
    cursor: "pointer",
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
        InputProps={{
          readOnly: true,
        }}
        value={contentPreview.description}
      />
      <Grid container spacing={3}>
        <Grid item xs={12} sm={6}>
          <TextField
            label={d("Created On").t("library_label_created_on")}
            fullWidth
            disabled={true}
            variant="outlined"
            InputProps={{
              readOnly: true,
            }}
            value={formattedTime(contentPreview.updated_at)}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            label={d("Author").t("library_label_author")}
            fullWidth
            disabled={true}
            variant="outlined"
            InputProps={{
              readOnly: true,
            }}
            value={contentPreview.author_name}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            label={d("Program").t("library_label_program")}
            fullWidth
            disabled={true}
            variant="outlined"
            InputProps={{
              readOnly: true,
            }}
            value={contentPreview.program_name}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            label={d("Subject").t("library_label_subject")}
            fullWidth
            disabled={true}
            variant="outlined"
            InputProps={{
              readOnly: true,
            }}
            value={contentPreview.subject_name}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            label={d("Category").t("library_label_category")}
            fullWidth
            disabled={true}
            variant="outlined"
            InputProps={{
              readOnly: true,
            }}
            value={contentPreview.developmental_name?.join(",")}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            label={d("Subcategory").t("library_label_subcategory")}
            fullWidth
            disabled={true}
            variant="outlined"
            InputProps={{
              readOnly: true,
            }}
            value={contentPreview.skills_name}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            label={d("Visibility Settings").t("library_label_visibility_settings")}
            fullWidth
            disabled={true}
            variant="outlined"
            InputProps={{
              readOnly: true,
            }}
            value={contentPreview.publish_scope_name}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            label={d("Duration(Minutes)").t("library_label_duration")}
            fullWidth
            disabled={true}
            variant="outlined"
            InputProps={{
              readOnly: true,
            }}
            value={contentPreview.suggest_time}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            label={d("Age").t("library_label_age")}
            fullWidth
            disabled={true}
            variant="outlined"
            InputProps={{
              readOnly: true,
            }}
            value={contentPreview.age_name?.join(",")}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            label={d("Grade").t("library_label_grade")}
            fullWidth
            disabled={true}
            variant="outlined"
            InputProps={{
              readOnly: true,
            }}
            value={contentPreview.grade_name?.join(",")}
          />
        </Grid>
      </Grid>
      {contentPreview.content_type === ContentType.material && (
        <TextField
          margin="normal"
          fullWidth
          disabled={true}
          rows={2}
          label={d("Lesson Type").t("library_label_lesson_type")}
          variant="outlined"
          InputProps={{
            readOnly: true,
          }}
          value={contentPreview.lesson_type_name}
        />
      )}
      <Box
        className={css.fieldset}
        style={{
          position: "relative",
        }}
      >
        <FormControlLabel
          control={
            <Checkbox
              style={{
                position: "absolute",
                right: 0,
              }}
              disabled
              checked={contentPreview.self_study || false}
              color="primary"
            />
          }
          label={d("Suitable for Self Study").t("library_label_self_study")}
          style={{
            color: "rgba(0,0,0,0.6)",
          }}
          labelPlacement="start"
        />
      </Box>
      {contentPreview.content_type === ContentType.material && (
        <Box
          className={css.fieldset}
          style={{
            position: "relative",
          }}
        >
          <FormControlLabel
            control={
              <Checkbox
                style={{
                  position: "absolute",
                  right: 0,
                }}
                disabled
                checked={contentPreview.draw_activity || false}
                color="primary"
              />
            }
            label={d("Drawing Activity").t("library_label_drawing_activity")}
            style={{
              color: "rgba(0,0,0,0.6)",
            }}
            labelPlacement="start"
          />
        </Box>
      )}
      <TextField
        className={css.keyword}
        margin="normal"
        fullWidth
        disabled={true}
        label={d("Keywords").t("library_label_keywords")}
        variant="outlined"
        InputProps={{
          readOnly: true,
          startAdornment: (
            <InputAdornment position="start" className={css.chipCon}>
              {contentPreview.keywords?.map((value, index) => (
                <Chip
                  key={value + index}
                  label={value}
                  style={{
                    color: "#fff",
                    backgroundColor: colors[index % 3],
                    margin: 2,
                  }}
                />
              ))}
            </InputAdornment>
          ),
        }}
      ></TextField>
      {contentPreview.content_type === ContentType.plan && (
        <Box style={{ position: "relative" }}>
          <TextField
            disabled
            className={css.fieldset}
            value={contentPreview.teacher_manual}
            label={d("Teacher Manual").t("library_label_teacher_manual")}
            fullWidth
          ></TextField>
          <a href={apiResourcePathById(contentPreview.teacher_manual)} target="_blank" rel="noopener noreferrer">
            {contentPreview.teacher_manual && <CloudDownloadOutlined className={css.iconField} style={{ right: "10px", color: "#000" }} />}
          </a>
        </Box>
      )}
    </>
  );
}
