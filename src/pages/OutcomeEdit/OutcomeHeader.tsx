import { Box, Button, ButtonProps, fade, Hidden, IconButton, makeStyles, Typography, useMediaQuery, useTheme } from "@material-ui/core";
import { Palette, PaletteColor } from "@material-ui/core/styles/createPalette";
import { ArrowBack, Cancel, CancelOutlined, Check, Clear, ClearSharp, Create, Delete, Publish, Save } from "@material-ui/icons";
import clsx from "clsx";
import React, { Fragment } from "react";
import { useHistory } from "react-router-dom";
import KidsloopLogo from "../../assets/icons/kidsloop-logo.svg";
import { LButton, LButtonProps } from "../../components/LButton";

const createContainedColor = (paletteColor: PaletteColor, palette: Palette) => ({
  color: palette.common.white,
  backgroundColor: paletteColor.main,
  "&:hover": {
    backgroundColor: paletteColor.dark,
  },
});

const createOutlinedColor = (paletteColor: PaletteColor, palette: Palette) => ({
  color: paletteColor.main,
  borderColor: paletteColor.light,
  "&:hover": {
    borderColor: paletteColor.main,
    backgroundColor: fade(paletteColor.main, palette.action.hoverOpacity),
  },
});

const useStyles = makeStyles(({ palette, breakpoints }) => ({
  arrowBack: {
    color: palette.common.black,
    marginRight: 28,
    [breakpoints.down("sm")]: {
      marginRight: 16,
    },
  },
  kidsloopLogo: {
    width: 40,
    height: 40,
    marginRight: 16,
  },
  title: {
    marginRight: "auto",
    [breakpoints.down("sm")]: {
      fontSize: 16,
    },
  },
  headerButton: {
    fontWeight: "bold",
    borderRadius: 27,
    marginLeft: 50,
  },
  iconButton: {
    marginRight: 16,
    padding: 5,
    border: "thin solid currentColor",
  },
  redButton: createContainedColor(palette.error, palette),
  redOutlinedButton: createOutlinedColor(palette.error, palette),
  greenButton: createContainedColor(palette.success, palette),
  primaryIconButton: createContainedColor(palette.primary, palette),
  radioGroup: {
    flexDirection: "row",
    padding: "7px 0",
    marginTop: 16,
  },
  radio: {
    "&:not(:first-child)": {
      marginLeft: 64,
    },
    [breakpoints.down("sm")]: {
      marginRight: 0,
    },
  },
  deleteButton: {
    border: "1px solid red",
    borderRadius: "28px",
    color: "red",
    fontWeight: 700,
  },
  editButton: {
    marginRight: "10px",
  },
}));

export interface OutcomeHeaderProps {
  handleSave: LButtonProps["onClick"];
  handleReset: ButtonProps["onClick"];
  handleDelete: ButtonProps["onClick"];
  outcome_id: string;
  handelReject: ButtonProps["onClick"];
  handlePublish: LButtonProps["onClick"];
  handleApprove: LButtonProps["onClick"];
  publish_status: string | undefined;
  isDirty: boolean;
  showEdit: boolean;
  handleEdit: LButtonProps["onClick"];
  status: string | undefined;
  before: string | undefined;
}

function OutcomeHeader(props: OutcomeHeaderProps) {
  const history = useHistory();
  const css = useStyles();
  const {
    handleSave,
    handleReset,
    handleDelete,
    outcome_id,
    handelReject,
    handlePublish,
    handleApprove,
    publish_status,
    isDirty,
    showEdit,
    handleEdit,
    status,
    before,
  } = props;
  const { breakpoints } = useTheme();
  const sm = useMediaQuery(breakpoints.down("sm"));
  // const size = sm ? "small" : "medium";
  // const radioTypography = sm ? "subtitle2" : "h5";
  const goBack = () => {
    history.go(-1);
  };

  const getHeaderButtons = () => {
    return (
      <>
        {publish_status === "draft" && (
          <>
            {showEdit && (
              <>
                {before ? (
                  <>
                    <Button
                      variant="contained"
                      endIcon={<Cancel />}
                      className={clsx(css.headerButton, css.redButton)}
                      onClick={handleReset}
                    >
                      Cancel
                    </Button>
                    <LButton variant="contained" endIcon={<Save />} color="primary" className={css.headerButton} onClick={handleSave}>
                      Save
                    </LButton>
                    <LButton
                      variant="contained"
                      endIcon={<Publish />}
                      className={clsx(css.headerButton, css.greenButton)}
                      onClick={handlePublish}
                      disabled={isDirty}
                    >
                      Publish
                    </LButton>
                  </>
                ) : (
                  <>
                    <Button variant="outlined" endIcon={<Delete />} className={clsx(css.deleteButton)} onClick={handleDelete}>
                      Delete
                    </Button>
                    {/* <Button variant="contained" endIcon={<Cancel />} className={clsx(css.headerButton, css.redButton)} onClick={handleReset}>
                        Cancel
                      </Button> */}
                    {!status ? (
                      <Button
                        variant="contained"
                        endIcon={<Create />}
                        color="primary"
                        className={clsx(css.headerButton, css.editButton)}
                        onClick={handleEdit}
                      >
                        Edit
                      </Button>
                    ) : (
                      <>
                        <LButton
                          variant="contained"
                          endIcon={<Save />}
                          color="primary"
                          className={css.headerButton}
                          onClick={handleSave}
                          disabled={isDirty}
                        >
                          Save
                        </LButton>
                        <LButton
                          variant="contained"
                          endIcon={<Publish />}
                          className={clsx(css.headerButton, css.greenButton)}
                          onClick={handlePublish}
                          disabled={!isDirty}
                        >
                          Publish
                        </LButton>
                      </>
                    )}
                  </>
                )}
              </>
            )}
            {!showEdit && (
              <>
                <Button variant="contained" endIcon={<Cancel />} className={clsx(css.headerButton, css.redButton)} onClick={handleReset}>
                  Cancel
                </Button>
                <LButton
                  variant="contained"
                  endIcon={<Save />}
                  color="primary"
                  className={css.headerButton}
                  onClick={handleSave}
                  disabled={!isDirty}
                >
                  Save
                </LButton>
                <LButton
                  variant="contained"
                  endIcon={<Publish />}
                  className={clsx(css.headerButton, css.greenButton)}
                  onClick={handlePublish}
                  disabled={outcome_id ? isDirty : true}
                >
                  Publish
                </LButton>
              </>
            )}
          </>
        )}
        {publish_status === "pending" && (
          <>
            <Button variant="outlined" endIcon={<Delete />} className={clsx(css.deleteButton)} onClick={handleDelete}>
              Delete
            </Button>
            <Button variant="contained" endIcon={<Clear />} className={clsx(css.headerButton, css.redButton)} onClick={handelReject}>
              Reject
            </Button>
            <LButton variant="contained" endIcon={<Check />} className={clsx(css.headerButton, css.greenButton)} onClick={handleApprove}>
              Approve
            </LButton>
          </>
        )}
        {publish_status === "rejected" && (
          <>
            {showEdit && (
              <>
                <Button variant="outlined" endIcon={<Delete />} className={clsx(css.deleteButton)} onClick={handleDelete}>
                  Delete
                </Button>
                <Button
                  variant="contained"
                  endIcon={<Create />}
                  color="primary"
                  className={clsx(css.headerButton, css.editButton)}
                  onClick={handleEdit}
                >
                  Edit
                </Button>
              </>
            )}
            {!showEdit && (
              <>
                <Button variant="contained" endIcon={<Cancel />} className={clsx(css.headerButton, css.redButton)} onClick={handleReset}>
                  Cancel
                </Button>
                <LButton
                  variant="contained"
                  endIcon={<Save />}
                  color="primary"
                  className={css.headerButton}
                  onClick={handleSave}
                  disabled={!isDirty}
                >
                  Save
                </LButton>
                <LButton
                  variant="contained"
                  endIcon={<Publish />}
                  className={clsx(css.headerButton, css.greenButton)}
                  onClick={handlePublish}
                  disabled={isDirty}
                >
                  Publish
                </LButton>
              </>
            )}
          </>
        )}
        {publish_status === "published" && (
          <>
            <LButton
              variant="contained"
              endIcon={<Create />}
              color="primary"
              className={clsx(css.headerButton, css.editButton)}
              onClick={handleEdit}
              style={{ marginRight: "30px" }}
            >
              Edit
            </LButton>
            <Button variant="outlined" endIcon={<Delete />} className={clsx(css.deleteButton)} onClick={handleDelete}>
              Delete
            </Button>
          </>
        )}
      </>
    );
  };

  const getHeaderButtonsSmallScreen = () => {
    return (
      <>
        {publish_status === "draft" && (
          <>
            {showEdit && (
              <>
                <Button variant="contained" color="primary" className={clsx(css.headerButton, css.editButton)} onClick={handleEdit}>
                  <Create fontSize="small" />
                </Button>
                <Button className={clsx(css.iconButton, css.redButton)} color="primary" onClick={handleDelete}>
                  <Delete fontSize="small" />
                </Button>
              </>
            )}
            {!showEdit && (
              <>
                {!isDirty ? (
                  <LButton className={clsx(css.iconButton, css.greenButton)} color="primary" onClick={handlePublish}>
                    <Publish fontSize="small" />
                  </LButton>
                ) : (
                  <LButton className={clsx(css.iconButton, css.primaryIconButton)} color="primary" onClick={handleSave}>
                    <Save fontSize="small" />
                  </LButton>
                )}
                <IconButton className={clsx(css.iconButton, css.redButton)} color="primary" onClick={handleReset}>
                  <CancelOutlined fontSize="small" />
                </IconButton>
              </>
            )}
          </>
        )}
        {publish_status === "pending" && (
          <>
            <Button className={clsx(css.iconButton, css.redButton)} color="primary" onClick={handleDelete}>
              <Delete fontSize="small" />
            </Button>
            <Button className={clsx(css.iconButton, css.redButton)} color="primary" onClick={handelReject}>
              <ClearSharp fontSize="small" />
            </Button>
            <LButton className={clsx(css.iconButton, css.greenButton)} color="primary" onClick={handleApprove}>
              <Check fontSize="small" />
            </LButton>
          </>
        )}
        {publish_status === "rejected" && (
          <>
            {showEdit && (
              <>
                <Button variant="contained" color="primary" className={clsx(css.headerButton, css.editButton)} onClick={handleEdit}>
                  <Create fontSize="small" />
                </Button>
                <Button className={clsx(css.iconButton, css.redButton)} color="primary" onClick={handleDelete}>
                  <Delete fontSize="small" />
                </Button>
              </>
            )}
            {!showEdit && (
              <>
                <LButton className={clsx(css.iconButton, css.primaryIconButton)} color="primary" onClick={handleSave}>
                  <Save fontSize="small" />
                </LButton>
                <IconButton className={clsx(css.iconButton, css.redButton)} color="primary" onClick={handleReset}>
                  <CancelOutlined fontSize="small" />
                </IconButton>
              </>
            )}
          </>
        )}
        {publish_status === "published" && (
          <>
            {showEdit && (
              <>
                <Button variant="contained" color="primary" className={clsx(css.headerButton, css.editButton)} onClick={handleEdit}>
                  <Create fontSize="small" />
                </Button>
                <Button className={clsx(css.iconButton, css.redButton)} color="primary" onClick={handleDelete}>
                  <Delete fontSize="small" />
                </Button>
              </>
            )}
            {!showEdit && (
              <>
                <LButton className={clsx(css.iconButton, css.primaryIconButton)} color="primary" onClick={handleSave}>
                  <Save fontSize="small" />
                </LButton>
                <IconButton className={clsx(css.iconButton, css.redButton)} color="primary" onClick={handleReset}>
                  <CancelOutlined fontSize="small" />
                </IconButton>
              </>
            )}
          </>
        )}
      </>
    );
  };

  return (
    <Fragment>
      <Box display="flex" alignItems="center" pl={sm ? 2 : 3} pr={10} height={72} boxShadow={3}>
        <Button size="small" className={css.arrowBack} onClick={goBack}>
          <ArrowBack fontSize={sm ? "small" : "default"} />
        </Button>
        <Hidden smDown>
          <img className={css.kidsloopLogo} src={KidsloopLogo} alt="kidsloop logo" />
        </Hidden>
        <Typography variant="h6" className={css.title}>
          {sm ? "Create a New Learning Outcome" : "For Organizations"}
        </Typography>
        <Hidden smDown>{getHeaderButtons()}</Hidden>
      </Box>
      <Hidden smDown>
        <Box display="flex" alignItems="center" pl={5} pr={10} height={64} boxShadow={2}>
          <Typography variant="h6" className={css.title}>
            {outcome_id ? "Details" : "Create a New Learning Outcome"}
          </Typography>
        </Box>
      </Hidden>
      <Hidden mdUp>
        <Box display="flex" justifyContent="flex-end" pt={3}>
          {getHeaderButtonsSmallScreen()}
        </Box>
      </Hidden>
    </Fragment>
  );
}

export default OutcomeHeader;
