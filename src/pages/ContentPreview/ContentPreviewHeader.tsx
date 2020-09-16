import { Box, Chip, makeStyles, Tab, Tabs, Theme, Typography } from "@material-ui/core";
import CloseIcon from "@material-ui/icons/Close";
import React, { Fragment } from "react";
import { Content } from "../../api/api";
import { Thumbnail } from "../../components/Thumbnail";
import { TabValue } from "./type";

const useStyles = makeStyles((theme: Theme) => ({
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
}));
interface ContentPreviewProps {
  tab: string;
  contentPreview: Content;
  content_type: Content["content_type"];
  onClose: () => any;
  onChangeTab: (value: TabValue) => any;
}
export function ContentPreviewHeader(props: ContentPreviewProps) {
  const css = useStyles();
  const { tab, contentPreview, content_type, onClose, onChangeTab } = props;
  return (
    <Fragment>
      <Box className={css.closeIconCon}>
        <CloseIcon style={{ cursor: "pointer" }} onClick={onClose} />
      </Box>
      <Typography className={css.text}>Title</Typography>
      <Box className={css.nameCon}>
        <Typography className={css.text}>{contentPreview.name}</Typography>
        <Chip size="small" color="primary" label={contentPreview.content_type_name} />
      </Box>
      <Box style={{ width: "100%", height: "196px", margin: "10px 0 20px 0", textAlign: "center" }}>
        <Thumbnail className={css.img} type={content_type} id={contentPreview?.thumbnail} key={contentPreview?.thumbnail} />
      </Box>
      <Tabs
        className={css.tab}
        value={tab}
        onChange={(e, value) => onChangeTab(value)}
        indicatorColor="primary"
        textColor="primary"
        variant="fullWidth"
        aria-label="full width tabs example"
      >
        <Tab label="Details" value={TabValue.details} />
        <Tab label="Leaning Outcomes" value={TabValue.leaningoutcomes} />
      </Tabs>
    </Fragment>
  );
}
