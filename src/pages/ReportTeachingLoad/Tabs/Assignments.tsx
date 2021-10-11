import {
  makeStyles,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Tooltip,
  Typography
} from "@material-ui/core";
import { Theme, withStyles } from "@material-ui/core/styles";
import { InfoOutlined } from "@material-ui/icons";
import React, { useContext } from "react";
import { useDispatch, useSelector } from "react-redux";
import { SelectContext } from "..";
import { EntityTeacherLoadAssignmentResponseItem } from "../../../api/api.auto";
import ReportPagination from "../../../components/ReportPagination/ReportPagination";
import { d, t } from "../../../locale/LocaleManager";
import { getDurationByDay } from "../../../models/ModelReports";
import { RootState } from "../../../reducers";
import { getTeacherLoadAssignment } from "../../../reducers/report";
const PAGESIZE = 10;
const useStyles = makeStyles(({ palette }) => ({
  selectButton: {
    width: 200,
    height: 40,
    borderRadius: 4,
    color: palette.text.primary,
    marginRight: 20,
  },
  selectBox: {
    margin: "24px 0",
    display: "flex",
    justifyContent: "flex-end",
  },
  tableHead: {
    backgroundColor: "rgba(242,245,247,1)",
    "& .MuiTableCell-head": {
      fontWeight: 700,
      color: "#666",
    },
  },
  infoIcon: {
    position: "relative",
    top: 4,
    left: 5,
    cursor: "pointer",
  },
}));
const TooltipBlack = withStyles((theme: Theme) => ({
  tooltip: {
    backgroundColor: theme.palette.common.black,
    fontSize: 14, 
    color: theme.palette.common.white,
    maxWidth: 200,
    padding: 8,
    textAlign: "center",
    boxShadow: "0px 4px 4px 0px rgba(0,0,0,0.20)",
    fontFamily: "Helvetica, Helvetica-Regular",
  },
  arrow:{
    color: theme.palette.common.black,
  }
}))(Tooltip);

export default function Assignments() {
  const css = useStyles();
  const dispatch = useDispatch();
  const { teacherLoadAssignment } = useSelector<RootState, RootState["report"]>((state) => state.report);
  const { teachers, classes } = useContext(SelectContext);
  const [classType, setClassType] = React.useState("all");
  const [durationDay, setDurationDay] = React.useState(7);
  const [page, setPage] = React.useState(1);
  const total = teachers.length;
  const teacherLoadAssignmentWidthTeacherName = teacherLoadAssignment.map((item) => {
    const teacher_name = teachers.find((teacher) => teacher?.value === item.teacher_id)?.label;
    return { ...item, teacher_name };
  });

  const handleChangePge = React.useMemo(
    () => (page: number) => {
      const class_type_list = classType === "all" ? ["study", "home_fun"] : [classType];
      const class_id_list = classes?.map((item) => item.value);
      const teacher_id_list = teachers?.slice((page - 1) * PAGESIZE, (page - 1) * PAGESIZE + PAGESIZE).map((item) => item.value);
      dispatch(
        getTeacherLoadAssignment({
          metaLoading: true,
          class_type_list,
          duration: getDurationByDay(durationDay),
          class_id_list,
          teacher_id_list,
        })
      );
      setPage(page);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [dispatch, durationDay, classType, classes]
  );

  React.useEffect(() => {
    setPage(1);
    const duration = getDurationByDay(durationDay);
    const class_type_list = classType === "all" ? ["study", "home_fun"] : [classType];
    const class_id_list = classes?.map((item) => item.value);
    const teacher_id_list = teachers?.slice(0, PAGESIZE).map((item) => item.value);
    dispatch(getTeacherLoadAssignment({ metaLoading: true, class_type_list, duration, class_id_list, teacher_id_list }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, durationDay, classType, classes]);

  return (
    <div>
      <div className={css.selectBox}>
        <TextField
          size="small"
          className={css.selectButton}
          onChange={(e) => setClassType(e.target.value)}
          label={t("report_label_class_type")}
          value={classType}
          select
          SelectProps={{ MenuProps: { transformOrigin: { vertical: -40, horizontal: "left" } } }}
        >
          <MenuItem key="all" value="all">
            {d("All").t("report_label_all")}
          </MenuItem>
          <MenuItem key="study" value="study">
            {d("Study").t("report_label_study")}
          </MenuItem>
          <MenuItem key="home_fun" value="home_fun">
            {d("Home Fun").t("report_label_home_fun")}
          </MenuItem>
        </TextField>
        <TextField
          size="small"
          className={css.selectButton}
          onChange={(e) => setDurationDay(Number(e.target.value))}
          value={durationDay}
          select
          SelectProps={{ MenuProps: { transformOrigin: { vertical: -40, horizontal: "left" } } }}
        >
          <MenuItem key={7} value={7}>
           {t("report_label_past_7_days")}
          </MenuItem>
          <MenuItem key={30} value={30}>
            {t("report_label_past_30_days")}
          </MenuItem>
        </TextField>
      </div>
      <AssignmentsTabel assignmentsList={teacherLoadAssignmentWidthTeacherName} />
      <div style={{ marginTop: 20 }}>
        <ReportPagination page={page} count={total} onChangePage={handleChangePge} />
      </div>
    </div>
  );
}
//  AssignmentsTabel
interface IAssignmentsProps {
  assignmentsList?: EntityTeacherLoadAssignmentResponseItem[];
}

const AssignmentsTabel = (props: IAssignmentsProps) => {
  const css = useStyles();
  const { assignmentsList } = props;
  const rows = assignmentsList?.map((item, idx) => (
    <TableRow key={item.teacher_id}>
      <TableCell align="center" style={{ maxWidth: 150 }}>
        <Typography component="div" noWrap>
          {item.teacher_name}
        </Typography>
      </TableCell>
      <TableCell align="center">{item.count_of_classes}</TableCell>
      <TableCell align="center">{item.count_of_students} </TableCell>
      <TableCell align="center">{item.count_of_scheduled_assignment} </TableCell>
      <TableCell align="center">{item.count_of_completed_assignment} </TableCell>
      <TableCell align="center">{`${Math.floor(item.feedback_percentage ? item.feedback_percentage * 100 : 0)}%`} </TableCell>
      <TableCell align="center">{item.count_of_pending_assignment} </TableCell>
      <TableCell align="center">{item.avg_days_of_pending_assignment} </TableCell>
    </TableRow>
  ));
  return (
    <TableContainer>
      <Table stickyHeader>
        <TableHead className={css.tableHead}>
          <TableRow>
            <TableCell align="center">{d("Teacher").t("report_label_teacher")}</TableCell>
            <TableCell align="center">
              <div>
                {t("report_label_classes_number")}
                <div style={{ display: "flex", justifyContent: "center" }}>
                  <span style={{ color: "rgba(102,102,102,.6)", marginRight: 5 }}>({t("report_label_current")})</span>
                  <TooltipBlack arrow placement="top" title={t("report_msg_classes_number")} style={{cursor:"pointer"}}>
                    <InfoOutlined fontSize="small" />
                  </TooltipBlack>
                </div>
              </div>
            </TableCell>
            <TableCell align="center">
              <div>
                {t("report_label_students_number")}
                <div style={{ display: "flex", justifyContent: "center" }}>
                  <span style={{ color: "rgba(102,102,102,.6)", marginRight: 5 }}>({t("report_label_current")})</span>
                  <TooltipBlack arrow placement="top" title={t("report_msg_students_number")} style={{cursor:"pointer"}}>
                    <InfoOutlined fontSize="small" />
                  </TooltipBlack>
                </div>
              </div>
            </TableCell>
            <TableCell align="center">
              <div>
                {t("report_label_assignments_scheduled")}
                <TooltipBlack arrow placement="top" title={t("report_msg_assignments_scheduled")} className={css.infoIcon}>
                  <InfoOutlined fontSize="small" />
                </TooltipBlack>
              </div>
            </TableCell>
            <TableCell align="center">
              <div>
                {t("report_label_assessments_completed")}
                <TooltipBlack arrow placement="top" title={t("report_msg_assessments_completed")} className={css.infoIcon}>
                  <InfoOutlined fontSize="small" />
                </TooltipBlack>
              </div>
            </TableCell>
            <TableCell align="center">
              <div style={{ whiteSpace: "nowrap" }}>
                {t("report_label_feedback")}
                <TooltipBlack arrow placement="top" title={t("report_msg_feedback")} className={css.infoIcon}>
                  <InfoOutlined fontSize="small" />
                </TooltipBlack>
              </div>
            </TableCell>
            <TableCell align="center">
              <div>
                {t("report_label_assessments_pending")}
                <TooltipBlack arrow placement="top" title={t("report_msg_assessments_pending")} className={css.infoIcon}>
                  <InfoOutlined fontSize="small" />
                </TooltipBlack>
              </div>
            </TableCell>
            <TableCell align="center">
              <div>
                {t("report_label_avg_days_pending")}
                <TooltipBlack arrow placement="top" title={t("report_msg_avg_days_pending")} className={css.infoIcon} >
                <InfoOutlined fontSize="small" />
                </TooltipBlack>
              </div>
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>{rows}</TableBody>
      </Table>
    </TableContainer>
  );
};
