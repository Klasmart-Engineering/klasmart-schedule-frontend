import { makeStyles, MenuItem, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Tooltip } from "@material-ui/core";
import { InfoOutlined } from "@material-ui/icons";
import React from "react";
import ReportPagination from "../../../components/ReportPagination/ReportPagination";
import { d, t } from "../../../locale/LocaleManager";

enum ClassType {
  all="All",
  study="Study",
  homeFun="Home Fun"
}
const useStyles= makeStyles(({palette})=>({
  selectButton: {
    width: 200,
    height: 40,
    borderRadius: 4,
    color: palette.text.primary,
    marginRight: 20,
  },
  selectBox:{
    margin: "24px 0",
    display: "flex",
    justifyContent: "flex-end"
  },
  tableHead: {
    backgroundColor: "rgba(242,245,247,1)",
    "& .MuiTableCell-head": {
      fontWeight:700,
      color: "#666",
    }
  },
  infoIcon: {
   position:"relative",
   top:4,
   left:5,
   cursor: "pointer"

  }

}))
export default function Assignments () {
  const [classType, setClassType] = React.useState("all");
  const [duration, setDuration] = React.useState(7);
  const [page, setPage] = React.useState(1);
  const total=10;
  const css = useStyles();
  React.useEffect(() => {

  },[])

  return (
    <div>
      <div className={css.selectBox}>
        <TextField
          size="small"
          className={css.selectButton}
          onChange={(e) => setClassType(e.target.value)}
          label={t("schedule_detail_class_type")}
          value={classType}
          select
          SelectProps={{ MenuProps: { transformOrigin: { vertical: -40, horizontal: "left" } } }}
        >
          <MenuItem key="all" value="all">{d("All").t("report_label_all")}</MenuItem>
          <MenuItem key="study" value="study">{d("Study").t("report_student_usage_study")}</MenuItem>
          <MenuItem key="homeFun" value="homeFun">{d("Home Fun").t("report_student_usage_home_fun")}</MenuItem>
        </TextField>
        <TextField
          size="small"
          className={css.selectButton}
          onChange={(e) => setDuration(Number(e.target.value))}
          value={duration}
          select
          SelectProps={{ MenuProps: { transformOrigin: { vertical: -40, horizontal: "left" } } }}
        >
          <MenuItem key={7} value={7}>Past 7 days</MenuItem>
          <MenuItem key={30} value={30}>Past 30 days</MenuItem>
        </TextField>
      </div>
      <AssignmentsTabel/>
      <ReportPagination
        page={page}
        count={total}
        onChangePage={setPage}
      />
    </div>

  )
}
//  AssignmentsTabel 组件
interface IAssignmentsProps {
  assignmentsList?:IAssignmentItem[]
}
interface IAssignmentItem {
  tearch_id:string;
  no_class?:number;
  no_students?:number;
  AssignmentsScheduled?: number;
  AssessmentsCompleted?:number;
  Feedback?:number;
  AssessmentsPending?: number;
  AvgDaysPending?:number;
}
const AssignmentsTabel = (props:IAssignmentsProps) => {
  const css = useStyles();
  const {assignmentsList} = props;
  const rows = assignmentsList?.map((item, idx) => (
    <TableRow key={item.tearch_id}>
      <TableCell align="center">{item.no_class}</TableCell>
      <TableCell align="center">{item.no_students} </TableCell>
      <TableCell align="center">{item.no_students} </TableCell>
      <TableCell align="center">{item.no_students} </TableCell>
      <TableCell align="center">{item.no_students} </TableCell>
      <TableCell align="center">{item.no_students} </TableCell>
      <TableCell align="center">{item.no_students} </TableCell>
      <TableCell align="center">{item.no_students} </TableCell>
    </TableRow>
  ));
  return (
    <TableContainer>
      <Table  stickyHeader>
        <TableHead className={css.tableHead}>
          <TableRow>
            <TableCell align="center">{d("Teacher").t("report_label_teacher")}</TableCell>
            <TableCell align="center">
              <div>
                {"No.of Classes"}
                <div style={{display: "flex", justifyContent: "center"}}>
                <span style={{color:"rgba(102,102,102,.6)",marginRight:5}}>{"(Current)"}</span>
                <Tooltip title="" >
                  <InfoOutlined fontSize="small" />
                </Tooltip>
                </div>
              </div>
              </TableCell>
            <TableCell align="center">
              <div>
                {"No.of Students"} 
                <div style={{display: "flex", justifyContent: "center"}}>
                <span style={{color:"rgba(102,102,102,.6)",marginRight:5}}>{"(Current)"}</span>
                <Tooltip title="" >
                  <InfoOutlined fontSize="small" />
                </Tooltip>
                </div>
              </div>
            </TableCell>
            <TableCell align="center">
              <div>
                {"Assignments Scheduled"}
                  <Tooltip title=""  className={css.infoIcon} >
                  <InfoOutlined fontSize="small" />
                </Tooltip>
              </div>
            </TableCell>
            <TableCell align="center">
            <div>
                {"Assessments Completed"}
                  <Tooltip title="" className={css.infoIcon} >
                  <InfoOutlined fontSize="small" />
                </Tooltip>
              </div>
              </TableCell>
            <TableCell align="center">
              <div style={{whiteSpace: "nowrap"}}>
                  {"% Feedback"}
                  <Tooltip title="" className={css.infoIcon} >
                  <InfoOutlined fontSize="small" />
                </Tooltip>
              </div>
            </TableCell>
            <TableCell align="center">
              <div>
                {"Assessments Pending"}
                  <Tooltip title="" className={css.infoIcon} >
                  <InfoOutlined fontSize="small" />
                </Tooltip>
              </div>
              </TableCell>
            <TableCell align="center">
              <div>
                {"Avg Days Pending"}
                <Tooltip title="111" className={css.infoIcon} >
                <InfoOutlined fontSize="small" />
                </Tooltip>
              </div>
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>{rows}</TableBody>
      </Table>
    </TableContainer>
  );
};

