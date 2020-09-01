import { Chip, Grid, InputAdornment, TextField } from "@material-ui/core";
import React from "react";
import { Content } from "../../api/api";
import { OperationBtn } from "./OperationBtn";

const time = (time?: number) => {
  const year = new Date((time || 0) * 1000).getFullYear();
  let mouth: string = String(new Date((time || 0) * 1000).getMonth() + 1);
  mouth = mouth.padStart(2, "0");
  let day = String(new Date((time || 0) * 1000).getDate());
  day = day.padStart(2, "0");
  return `${year}-${mouth}-${day}`;
};

interface DetailProps {
  contentPreview: Content;
  handleAction: (type: string) => void;
}
export function Detail(props: DetailProps) {
  const { contentPreview, handleAction } = props;
  const colors = ["#009688", "#9c27b0", "#ffc107"];
  return (
    <>
      <TextField
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
            value={time(contentPreview.created_at)}
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
                <Chip key={value} label={value} style={{ color: "#fff", backgroundColor: colors[index % 3], margin: 2 }} />
              ))}
            </InputAdornment>
          ),
        }}
      ></TextField>
      <OperationBtn publish_status={contentPreview.publish_status} handleAction={handleAction} />
    </>
  );
}
