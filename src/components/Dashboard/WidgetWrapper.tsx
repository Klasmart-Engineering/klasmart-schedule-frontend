import { WidgetType } from "./models/widget.model";
import WidgetContext from "./WidgetManagement/widgetCustomisation/widgetContext";
import WidgetWrapperError from "./WidgetManagement/WidgetWrapperError";
import WidgetWrapperNoData from "./WidgetManagement/WidgetWrapperNoData";
import { Cancel } from "@material-ui/icons";
import PlayArrowIcon from "@material-ui/icons/PlayArrow";
import { Box, Card, CircularProgress, IconButton, Link, Typography } from "@material-ui/core";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import { ClassNameMap } from "@material-ui/styles/withStyles";
import React, { useContext } from "react";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    cardWrapper: {
      display: `flex`,
      flexFlow: `column`,
      height: `100%`,
    },
    card: {
      display: `flex`,
      flexDirection: `column`,
      justifyContent: `space-between`,
      borderRadius: 10,
      boxShadow: `none`,
      padding: 15,
      height: `100%`,
    },
    cardNoBackground: {
      backgroundColor: `unset`,
    },
    titleContainer: {
      display: `flex`,
      justifyContent: `space-between`,
      alignItems: `center`,
      padding: theme.spacing(1),
    },
    editContainer: {
      cursor: `grab`,
    },
    title: {
      fontSize: 14,
      fontWeight: `bold`,
      color: theme.palette.grey[600],
    },
    titleEditing: {
      fontSize: 14,
      fontWeight: `bold`,
      color: theme.palette.grey[100],
    },
    titleLink: {
      display: `flex`,
      alignItems: `center`,
      fontSize: 12,
      color: theme.palette.grey[500],
    },
    removeWidget: {
      color: theme.palette.error.light,
      height: `20px`,
      width: `20px`,
      position: `absolute`,
      top: `20px`,
      right: `-10px`,
      backgroundColor: theme.palette.grey[100],
      borderRadius: `50%`,
      "&:hover": {
        backgroundColor: theme.palette.grey[100],
      },
    },
    icon: {
      height: `35px`,
      width: `35px`,
    },
    pointerNone: {
      pointerEvents: `none`,
    },
  })
);

type LinkProps = {
  url: string;
  label: string;
};

export type BaseWidgetProps = {
  children: React.ReactNode;
  label: string;
  link?: LinkProps;
  overrideLink?: React.ReactNode;
  loading: boolean;
  error?: any;
  noData?: boolean;
  noBackground?: boolean;
  editable?: boolean;
  reload?: () => any | Promise<any>;
  id: WidgetType;
};

export default function WidgetWrapper(props: BaseWidgetProps) {
  const classes = useStyles();
  const { children, label, link, overrideLink, loading, error, noData, noBackground, editable = true, reload, id } = props;

  const { editing } = useContext(WidgetContext);

  return (
    <Box className={`${classes.cardWrapper} ${editing && editable && classes.editContainer}`}>
      <CardAnnotation editable={editable} classes={classes} label={label} link={link} overrideLink={overrideLink} id={id} />
      <Card className={`${classes.card} ${noBackground && classes.cardNoBackground} ${editing && editable && classes.pointerNone}`}>
        <Box
          sx={
            loading
              ? {
                  m: `auto`,
                  display: `flex`,
                  alignItems: `center`,
                }
              : {
                  height: `100%`,
                }
          }
        >
          {loading ? (
            <CircularProgress color="primary" />
          ) : error ? (
            <WidgetWrapperError reload={reload} />
          ) : noData ? (
            <WidgetWrapperNoData />
          ) : (
            children
          )}
        </Box>
      </Card>
    </Box>
  );
}

type CardAnnotationProps = {
  classes: ClassNameMap;
  label: string;
  link?: LinkProps;
  overrideLink?: React.ReactNode;
  id: WidgetType;
  editable?: boolean;
};

function CardAnnotation({ classes, label, link, overrideLink, id, editable }: CardAnnotationProps) {
  const { editing, widgets, layouts, removeWidget } = useContext(WidgetContext);

  return (
    <Box className={classes.titleContainer}>
      <Typography className={editing ? classes.titleEditing : classes.title}>{label}</Typography>
      {!editing && link && !overrideLink && (
        <Link className={classes.titleLink} href={`#${window.location.pathname}${link.url}`} color="primary">
          {link.label} <PlayArrowIcon />
        </Link>
      )}
      {!editing && overrideLink && <Box>{overrideLink}</Box>}
      {editing && editable && (
        <Box>
          <IconButton className={classes.removeWidget} onClick={() => removeWidget(id, widgets, layouts)}>
            <Cancel className={classes.icon} />
          </IconButton>
        </Box>
      )}
    </Box>
  );
}
