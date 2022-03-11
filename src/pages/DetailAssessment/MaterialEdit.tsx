import {
  Box,
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  IconButton,
  InputAdornment,
  makeStyles,
  TextField,
  Typography,
} from "@material-ui/core";
import { Close } from "@material-ui/icons";
import BorderColorOutlinedIcon from "@material-ui/icons/BorderColorOutlined";
import MessageOutlinedIcon from "@material-ui/icons/MessageOutlined";
import { actWarning } from "@reducers/notify";
import clsx from "clsx";
import { cloneDeep } from "lodash";
import React, { ChangeEvent, useCallback, useMemo, useState } from "react";
import { Controller, useForm, UseFormMethods } from "react-hook-form";
import { useDispatch } from "react-redux";
import PermissionType from "../../api/PermissionType";
import { AssessmentStatus } from "../../api/type";
import { PermissionOr } from "../../components/Permission";
import { d } from "../../locale/LocaleManager";
import { DetailAssessmentResult } from "../ListAssessment/types";
import { UpdateAssessmentDataOmitAction } from "./type";
const useStyles = makeStyles(({ palette, spacing }) => ({
  editBox: {
    width: "100%",
    marginTop: 30,
    position: "relative",
  },
  materialEditBox: {
    "& .MuiOutlinedInput-multiline": {
      padding: "18.5px 14px 40px 14px",
    },
  },
  fieldset: {
    "& .MuiInputBase-input": {
      color: "rgba(0,0,0,1)",
    },
    "&:not(:first-child)": {
      marginTop: 30,
    },
  },
  blockEle: {
    "& .MuiInputBase-root": {
      display: "block",
      minHeight: 120,
    },
  },
  materialTitle: {
    color: "#000",
    fontSize: 18,
    fontWeight: 700,
  },
  materialNameCon: {
    color: "#000",
    fontSize: 18,
    margin: "16px 0",
    wordBreak: "break-all",
  },
  editButton: {
    position: "absolute",
    bottom: 10,
    right: 14,
    background: "rgba(14,120,213,0.24)",
    "&:hover": {
      background: "rgba(14,120,213,0.24)",
    },
  },
  title: {
    "& .MuiTypography-root": {
      fontSize: "24px !important",
      fontWeight: 700,
    },
  },
  closeBtn: {
    color: "#000",
    position: "absolute",
    top: spacing(1),
    right: spacing(1),
  },
  okBtn: {
    marginLeft: "40px !important",
  },
  subTitle: {
    fontSize: 18,
    color: "#666",
    marginBottom: 10,
  },
  checkBoxCon: {
    "& .MuiFormControlLabel-label": {
      fontSize: 18,
    },
    "& .MuiTypography-root": {
      wordBreak: "break-all",
    },
  },
  commentCon: {
    marginLeft: 10,
    width: "100%",
    "& .MuiInputBase-root": {
      height: "100%",
    },
    "& .MuiOutlinedInput-notchedOutline": {
      border: "none",
    },
  },
  mCoverIcon: {
    fontSize: 16,
    color: "#999999",
  },
}));

interface MaterialEditProps {
  assessmentDetail: DetailAssessmentResult;
  editable: boolean;
  contents: DetailAssessmentResult["contents"];
  formMethods: UseFormMethods<UpdateAssessmentDataOmitAction>;
  onChangeContents: (contents: DetailAssessmentResult["contents"]) => void;
}
export function MaterialEdit(props: MaterialEditProps) {
  const css = useStyles();
  const { contentEditActive, openCotnentEdit, closeCotentEdit, contentEditIndex } = useContentEdit();
  const { assessmentDetail, contents, editable, onChangeContents } = props;
  // 过滤掉子material和lessonplan
  const materialArr = useMemo(() => {
    return contents?.filter((item) => item.content_type === "LessonMaterial" && item.parent_id === "");
  }, [contents]);
  const materialNameArr = useMemo(() => {
    return materialArr?.filter((item) => item.status === "Covered").map((item) => item.content_name);
  }, [materialArr]);
  const handleChangeContent = (contents: DetailAssessmentResult["contents"]) => {
    onChangeContents(contents);
  };
  return (
    <>
      <Box className={clsx(css.editBox, css.materialEditBox)}>
        <TextField
          fullWidth
          disabled
          multiline={true}
          className={clsx(css.fieldset, css.blockEle)}
          InputProps={{
            readOnly: true,
            startAdornment: (
              <>
                {materialNameArr && materialNameArr.length ? (
                  <>
                    <div className={css.materialTitle}>
                      {d("Lesson Materials Covered").t("assess_detail_lesson_materials_covered")}(
                      {`${materialNameArr.length}/${materialArr?.length}`})
                    </div>
                    <div style={{ maxHeight: 180, minHeight: 90, overflow: "auto" }}>
                      {materialNameArr.map((item, index) => (
                        <div className={css.materialNameCon} key={index}>
                          {item}
                        </div>
                      ))}
                    </div>
                  </>
                ) : (
                  d("N/A").t("assess_column_n_a")
                )}
              </>
            ),
          }}
        />
        <PermissionOr
          value={[PermissionType.edit_in_progress_assessment_439, PermissionType.edit_attendance_for_in_progress_assessment_438]}
          render={(value) =>
            value && (
              <Button className={css.editButton} color="primary" variant="outlined" onClick={openCotnentEdit}>
                {!editable ? d("View").t("assess_detail_button_view") : d("Edit").t("assess_button_edit")}
              </Button>
            )
          }
        />
        <ContentInput
          open={contentEditActive}
          onClose={closeCotentEdit}
          editable={editable}
          assessmentDetail={assessmentDetail}
          contents={contents}
          onChangeContent={handleChangeContent}
          key={contentEditIndex}
        />
      </Box>
    </>
  );
}

export interface ContentInputProps {
  open: boolean;
  onClose: () => void;
  editable: boolean;
  assessmentDetail: DetailAssessmentResult;
  contents: DetailAssessmentResult["contents"];
  onChangeContent: (contents: DetailAssessmentResult["contents"]) => void;
}
export function ContentInput(props: ContentInputProps) {
  const css = useStyles();
  const dispatch = useDispatch();
  const formMethods = useForm();
  const { control, getValues } = formMethods;
  const { open, editable, contents, assessmentDetail, onClose, onChangeContent } = props;

  const [contentArr, setContentArr] = useState(contents);
  // 过滤掉子material和lessonplan
  const materialArr = useMemo(() => {
    return contentArr?.filter((item) => item.content_type === "LessonMaterial" && item.parent_id === "");
  }, [contentArr]);
  const materialNameArr = useMemo(() => {
    return materialArr?.filter((item) => item.status === "Covered").map((item) => item.content_name);
  }, [materialArr]);
  const handleChange = (e: ChangeEvent<HTMLInputElement>, id?: string) => {
    const checked = e.target.checked;
    const _contents = cloneDeep(contentArr) ?? [];
    _contents?.forEach((item) => {
      if (item.content_id === id || item.parent_id === id) {
        item.status = checked ? "Covered" : "NotCovered";
      }
    });
    setContentArr([..._contents]);
  };
  const handleOk = useCallback(() => {
    const length = contentArr?.filter(
      (item) => item.content_type === "LessonMaterial" && item.parent_id === "" && item.status === "Covered"
    ).length;
    if (length) {
      const _contents = cloneDeep(contentArr) ?? [];
      const commentArr = getValues()["comment"];
      _contents?.forEach((item) => {
        if (item.content_type === "LessonMaterial" && commentArr[item.content_id!]) {
          item.reviewer_comment = commentArr[item.content_id!];
        }
      });
      setContentArr([..._contents]);
      onChangeContent([..._contents]);
      onClose();
    } else {
      return Promise.reject(
        dispatch(actWarning(d("At least one lesson material needs to be selected as covered.").t("assess_msg_one_exposed")))
      );
    }
  }, [contentArr, dispatch, getValues, onChangeContent, onClose]);
  return (
    <Dialog maxWidth={"sm"} fullWidth={true} open={open} onClose={onClose}>
      <DialogTitle className={css.title}>
        {assessmentDetail.status === AssessmentStatus.complete
          ? d("View Lesson Materials Covered").t("assess_detail_view_covered")
          : d("Edit Lesson Materials Covered").t("assess_detail_edit_covered")}
        {!editable && (
          <IconButton onClick={onClose} className={css.closeBtn}>
            <Close />
          </IconButton>
        )}
      </DialogTitle>
      <DialogContent dividers style={{ borderBottom: "none" }}>
        <Box style={{ height: 390 }}>
          <Typography className={css.subTitle}>
            {d("Lesson Materials Covered").t("assess_detail_lesson_materials_covered")}:{" "}
            {`${materialNameArr?.length}/${materialArr?.length ?? 0}`}
          </Typography>
          {contentArr?.map(
            (item, index) =>
              item.content_type === "LessonMaterial" &&
              item.parent_id === "" && (
                <div key={item.content_id}>
                  <FormControlLabel
                    className={css.checkBoxCon}
                    control={
                      <Checkbox
                        checked={item.status === "Covered"}
                        disabled={!editable}
                        onChange={(e) => handleChange(e, item.content_id)}
                        color="primary"
                      />
                    }
                    label={item.content_name}
                  />
                  <Controller
                    as={TextField}
                    name={`comment[${item.content_id}]`}
                    control={control}
                    multiline
                    className={css.commentCon}
                    placeholder={d("Comment here").t("assess_detail_comment_here")}
                    disabled={!editable}
                    inputProps={{ maxLength: 100 }}
                    defaultValue={item.reviewer_comment}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          {!editable ? (
                            <MessageOutlinedIcon className={css.mCoverIcon} />
                          ) : (
                            <BorderColorOutlinedIcon className={css.mCoverIcon} />
                          )}
                        </InputAdornment>
                      ),
                    }}
                  />
                </div>
              )
          )}
        </Box>
      </DialogContent>
      {editable && (
        <DialogActions>
          <Button autoFocus onClick={onClose} color="primary" variant="outlined">
            {d("CANCEL").t("general_button_CANCEL")}
          </Button>
          <Button onClick={handleOk} color="primary" variant="contained" className={css.okBtn}>
            {d("OK").t("general_button_OK")}
          </Button>
        </DialogActions>
      )}
    </Dialog>
  );
}

export function useContentEdit() {
  const [active, setActive] = useState(false);
  const [contentEditIndex, setContentEditIndex] = useState(0);
  return useMemo(
    () => ({
      contentEditIndex,
      contentEditActive: active,
      openCotnentEdit: () => {
        setContentEditIndex(contentEditIndex + 1);
        setActive(true);
      },
      closeCotentEdit: () => setActive(false),
    }),
    [active, contentEditIndex]
  );
}
