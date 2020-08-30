// import { Breakpoint } from "@material-ui/core/styles/createBreakpoints";
import { Box, Button, CardMedia, Chip, Grid, InputAdornment, Tab, Tabs, TextField, Typography } from "@material-ui/core";
// import LayoutPair from "../ContentEdit/Layout";
import { makeStyles, Theme } from "@material-ui/core/styles";
import CloseIcon from "@material-ui/icons/Close";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory, useLocation } from "react-router-dom";
import { Content } from "../../api/api";
import { apiResourcePathById } from "../../api/extra";
import DocIconUrl from "../../assets/icons/doc.svg";
import MaterialIconUrl from "../../assets/icons/material.svg";
import MusicIconUrl from "../../assets/icons/music.svg";
import PicIconUrl from "../../assets/icons/pic.svg";
import PlanIconUrl from "../../assets/icons/plan.svg";
import VideoIconUrl from "../../assets/icons/video.svg";
import { RootState } from "../../reducers";
import { approveContent, deleteContent, getContentDetailById, publishContent, rejectContent } from "../../reducers/content";

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
  rejectBtn: {
    backgroundColor: "#d32f2f",
    color: "#fff",
    marginRight: "10px",
  },
  approveBtn: {
    backgroundColor: "#4caf50",
    color: "#fff",
  },
}));

interface ActionProps {
  handleAction: (type: string) => any;
}
function PublishedBtn(props: ActionProps) {
  const css = useStyles();
  const { handleAction } = props;
  const handleClick = () => {
    handleAction("del");
  };
  const handleEdit = () => {
    handleAction("edit");
  };
  return (
    <Box display="flex" justifyContent="flex-end">
      <Button className={css.publistedBtn} variant="outlined" onClick={handleClick}>
        Remove
      </Button>
      <Button color="primary" variant="contained" onClick={handleEdit}>
        Edit
      </Button>
    </Box>
  );
}
interface ActionProps {
  handleAction: (type: string) => any;
}
// function WaitingBtn(props: ActionProps) {
//   const css = useStyles();
//   const { handleAction } = props;
//   const handleDelete = () => {
//     handleAction("del");
//   };
//   return (
//     <Box display="flex" justifyContent="flex-end">
//       <Button className={css.publistedBtn} variant="outlined" onClick={handleDelete}>
//         Delete
//       </Button>
//     </Box>
//   );
// }

interface ActionProps {
  handleAction: (type: string) => any;
}
function PendingBtn(props: ActionProps) {
  const css = useStyles();
  const { handleAction } = props;
  const handelApprove = () => {
    handleAction("approve");
  };
  const handleReject = () => {
    handleAction("reject");
  };
  return (
    <Box display="flex" justifyContent="flex-end">
      <Button className={css.rejectBtn} variant="contained" onClick={handleReject}>
        Reject
      </Button>
      <Button className={css.approveBtn} variant="contained" onClick={handelApprove}>
        Approve
      </Button>
    </Box>
  );
}
interface ActionProps {
  handleAction: (type: string) => any;
}
function ArchiveBtn(props: ActionProps) {
  const css = useStyles();
  const { handleAction } = props;
  const handleDelete = () => {
    handleAction("del");
  };
  const handleRepublish = () => {
    handleAction("publish");
  };
  return (
    <Box display="flex" justifyContent="flex-end">
      <Button className={css.publistedBtn} variant="outlined" onClick={handleDelete}>
        Delete
      </Button>
      <Button className={css.approveBtn} variant="contained" onClick={handleRepublish}>
        Republish
      </Button>
    </Box>
  );
}
interface ActionProps {
  handleAction: (type: string) => any;
}
function DraftRejectBtn(props: ActionProps) {
  const css = useStyles();
  const { handleAction } = props;
  const handleDelete = () => {
    handleAction("del");
  };
  const handleEdit = () => {
    handleAction("edit");
  };
  return (
    <Box display="flex" justifyContent="flex-end">
      <Button className={css.publistedBtn} variant="outlined" onClick={handleDelete}>
        Delete
      </Button>
      <Button color="primary" variant="contained" onClick={handleEdit}>
        Edit
      </Button>
    </Box>
  );
}

export default function ContentPreview(props: Content) {
  const history = useHistory();
  const dispatch = useDispatch();
  const { search } = useLocation();
  const query = new URLSearchParams(search);
  const id = query.get("id") || "";
  const css = useStyles();
  const [value, setValue] = React.useState(0);
  const { contentPreview } = useSelector<RootState, RootState["content"]>((state) => state.content);
  const colors = ["#009688", "#9c27b0", "#ffc107"];
  const handleChange = (event: React.ChangeEvent<{}>, newValue: number) => {
    setValue(newValue);
  };
  const handleAction = (type: string) => {
    if (type === "del") {
      dispatch(deleteContent(id));
      history.go(-1);
    }
    if (type === "approve") {
      dispatch(approveContent(id));
      history.go(-1);
    }
    if (type === "reject") {
      dispatch(rejectContent(id));
      history.go(-1);
    }
    if (type === "publish") {
      dispatch(publishContent(id));
      history.go(-1);
    }
    if (type === "edit") {
      if (contentPreview.content_type_name === "MATERIAL") {
        history.push(`/library/content-edit/lesson/material/tab/details/rightside/contentH5p?id=${id}`);
      }
      if (contentPreview.content_type_name === "PLAN") {
        history.push(`/library/content-edit/lesson/plan/tab/details/rightside/contentH5p?id=${id}`);
      }
    }
  };
  const handleClose = () => {
    history.go(-1);
  };
  useEffect(() => {
    dispatch(getContentDetailById(id));
  }, [dispatch, id]);
  const setThumbnail = () => {
    if (!contentPreview?.thumbnail && contentPreview?.content_type_name === "document") return DocIconUrl;
    if (!contentPreview?.thumbnail && contentPreview?.content_type_name === "audio") return MusicIconUrl;
    if (!contentPreview?.thumbnail && contentPreview?.content_type_name === "img") return PicIconUrl;
    if (!contentPreview?.thumbnail && contentPreview?.content_type_name === "video") return VideoIconUrl;
    if (!contentPreview?.thumbnail && contentPreview?.content_type_name === "LESSON") return PlanIconUrl;
    if (!contentPreview?.thumbnail && contentPreview?.content_type_name === "MATERIAL") return MaterialIconUrl;
    if (contentPreview?.thumbnail) return apiResourcePathById(contentPreview?.thumbnail);
  };
  return (
    <Box className={css.container}>
      <Box className={css.left}>
        <Box className={css.closeIconCon}>
          <CloseIcon style={{ cursor: "pointer" }} onClick={handleClose} />
        </Box>
        <Typography className={css.text}>Title</Typography>
        <Box className={css.nameCon}>
          <Typography className={css.text}>{contentPreview.name}</Typography>
          <Chip size="small" color="primary" label={contentPreview.content_type_name} />
        </Box>
        <CardMedia className={css.img} component="img" image={setThumbnail()} />
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
          value={contentPreview.description}
        />
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6}>
            <TextField label="Created On" fullWidth variant="outlined" />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField label="Author" fullWidth variant="outlined" value={contentPreview.author_name} />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField label="Program" fullWidth variant="outlined" value={contentPreview.program_name} />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField label="Subject" fullWidth variant="outlined" value={contentPreview.subject_name} />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField label="Development" fullWidth variant="outlined" value={contentPreview.developmental_name?.join(",")} />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField label="Skills" fullWidth variant="outlined" value={contentPreview.skills} />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField label="Visibility Settings" fullWidth variant="outlined" value={contentPreview.publish_scope} />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField label="Duration" fullWidth variant="outlined" value={contentPreview.suggest_time} />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField label="Suitable Age" fullWidth variant="outlined" value={contentPreview.age_name?.join(",")} />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField label="Grade" fullWidth variant="outlined" value={contentPreview.grade_name?.join(",")} />
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
                {contentPreview.keywords?.map((value, index) => (
                  <Chip key={value} label={value} className={css.chip} style={{ color: "#fff", backgroundColor: colors[index % 3] }} />
                ))}
              </InputAdornment>
            ),
          }}
        ></TextField>
        {contentPreview.publish_status === "published" && <PublishedBtn handleAction={handleAction} />}
        {(contentPreview.publish_status === "draft" || contentPreview.publish_status === "rejected") && (
          <DraftRejectBtn handleAction={handleAction} />
        )}
        {contentPreview.publish_status === "pending" && <PendingBtn handleAction={handleAction} />}
        {/* {contentPreview.publish_status === "pending" && <WaitingBtn handleAction={handleAction} />} */}
        {contentPreview.publish_status === "archive" && <ArchiveBtn handleAction={handleAction} />}
      </Box>
      <Box className={css.right}>right</Box>
    </Box>
  );
}
ContentPreview.routeBasePath = "/library/content-preview";
