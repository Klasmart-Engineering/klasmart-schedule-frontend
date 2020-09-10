// import { Breakpoint } from "@material-ui/core/styles/createBreakpoints";
import { Box, Chip, Tab, Tabs, Typography } from "@material-ui/core";
import { makeStyles, Theme } from "@material-ui/core/styles";
import CloseIcon from "@material-ui/icons/Close";
import { PayloadAction } from "@reduxjs/toolkit";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory, useLocation } from "react-router-dom";
import { Content } from "../../api/api";
import { Thumbnail } from "../../components/Thumbnail";
import { RootState } from "../../reducers";
import {
  approveContent,
  AsyncTrunkReturned,
  deleteContent,
  getContentDetailById,
  lockContent,
  publishContent,
  rejectContent,
} from "../../reducers/content";
import { actSuccess } from "../../reducers/notify";
import { Detail } from "./Detail";
import { ActionProps, OperationBtn } from "./OperationBtn";
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
    height: "100%",
    width: "100%",
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

export default function ContentPreview(props: Content) {
  const history = useHistory();
  const dispatch = useDispatch();
  const { search } = useLocation();
  const query = new URLSearchParams(search);
  let id = query.get("id") || "";
  const css = useStyles();
  const [value, setValue] = React.useState(0);
  const { contentPreview } = useSelector<RootState, RootState["content"]>((state) => state.content);
  const handleChange = (event: React.ChangeEvent<{}>, newValue: number) => {
    setValue(newValue);
  };
  const handleDelete: ActionProps["onDelete"] = async () => {
    await dispatch(deleteContent(id));
    history.go(-1);
  };
  const handlePublish = async () => {
    await dispatch(publishContent(id));
    history.go(-1);
  };
  const handleApprove = async () => {
    await dispatch(approveContent(id));
    history.go(-1);
  };
  const handleReject = async () => {
    const { payload } = ((await dispatch(rejectContent({ id: id }))) as unknown) as PayloadAction<AsyncTrunkReturned<typeof rejectContent>>;
    if (payload === "ok") {
      dispatch(actSuccess("Reject success"));
      history.go(-1);
    }
  };
  // enum ContentTypeMap {
  //   Material = "material",
  //   Plan = "plan",
  //   Assets = "assets"
  // }
  // enum RightSideMap {
  //   Material = "contentH5p",
  //   Plan = "planComposeGraphic",
  //   Assets = "assetEdit"
  // }

  const handleEdit: ActionProps["onDelete"] = async () => {
    const lesson =
      contentPreview.content_type_name === "Material"
        ? "material"
        : contentPreview.content_type_name === "Plan"
        ? "plan"
        : contentPreview.content_type_name === "Assets"
        ? "assets"
        : "material";
    const rightSide =
      contentPreview.content_type_name === "Material"
        ? "contentH5p"
        : contentPreview.content_type_name === "Plan"
        ? "planComposeGraphic"
        : contentPreview.content_type_name === "Assets"
        ? "assetEdit"
        : "contentH5p";
    if (contentPreview.publish_status === "published") {
      const { payload } = ((await dispatch(lockContent(id))) as unknown) as PayloadAction<AsyncTrunkReturned<typeof lockContent>>;
      if (payload.id) {
        history.push(`/library/content-edit/lesson/${lesson}/tab/details/rightside/${rightSide}?id=${payload.id}`);
      }
    } else {
      history.push(`/library/content-edit/lesson/${lesson}/tab/details/rightside/${rightSide}?id=${id}`);
    }
  };
  const handleClose = () => {
    history.go(-1);
  };
  useEffect(() => {
    dispatch(getContentDetailById(id));
  }, [dispatch, id]);
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
        <Box style={{ width: "100%", height: "196px", margin: "10px 0 20px 0", textAlign: "center" }}>
          <Thumbnail className={css.img} type={contentPreview.content_type} id={contentPreview?.thumbnail} />
        </Box>
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
        <Detail contentPreview={contentPreview} />
        <OperationBtn
          publish_status={contentPreview.publish_status}
          content_type_name={contentPreview.content_type_name}
          onDelete={handleDelete}
          onPublish={handlePublish}
          onApprove={handleApprove}
          onReject={handleReject}
          onEdit={handleEdit}
        />
      </Box>
      <Box className={css.right}>right</Box>
    </Box>
  );
}
ContentPreview.routeBasePath = "/library/content-preview";
