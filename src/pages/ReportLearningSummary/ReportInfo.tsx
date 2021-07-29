import { makeStyles } from "@material-ui/core";
import clsx from "clsx";
import React from "react";
import LayoutBox from "../../components/LayoutBox";
import { LiveClassesReport, NoDataCom, RectCom } from "./LiveClassesReport";
import { PieChart } from "./PieChart";
import { ReportInfoBaseProps, ReportType } from "./types";

const useStyles = makeStyles(({ breakpoints }) => ({
  reportCon: {
    width: "100%",
    height: "1042px",
    borderRadius: "20px",
    marginTop: 40,
    marginBottom: 80,
    display: "flex",
    flexDirection: "column",
    minWidth: 1120,
  },
  pieCon: {
    flex: 4,
    display: "flex",
  },
  pieWrap: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "column",
    height: "calc(100% - 40px)",
    position: "relative",
  },
  leftPieItem: {
    flex: 5,
    borderRadius: "20px 20px 0 0",
    boxShadow: "-5px -5px 10px -5px rgba(0,0,0,0.20)",
    textAlign: "center",
    // boxShadow: "5px 0px 5px -5px rgba(0,0,0,0.20), -5px 0 15px -5px rgba(0,0,0,0.20)"
  },
  noDataCon: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "column",
    height: "calc(100% - 40px)",
    position: "relative",
  },
  leftNotActive: {
    flex: 5,
    borderRadius: "20px 5px 20px 0",
    backgroundColor: "#F6F6F6",
    textAlign: "center",
    boxShadow: "inset -5px 0px 5px -5px rgba(0,0,0,0.20), inset 0px -5px 5px -5px rgba(0,0,0,0.20)",
  },
  rightNoActive: {
    flex: 5,
    borderRadius: "5px 20px 0 20px",
    backgroundColor: "#F6F6F6",
    textAlign: "center",
    boxShadow: "inset 5px 0px 5px -5px rgba(0,0,0,0.20), inset 0px -5px 5px -5px rgba(0,0,0,0.20)",
  },
  rightPieItem: {
    flex: 5,
    borderRadius: "20px 20px 0 0",
    boxShadow: "5px -5px 10px -5px rgba(0,0,0,0.20)",
    textAlign: "center",
  },
  infoCon: {
    flex: 6,
    borderRadius: "0 0 20px 20px",
    boxShadow: "-5px 5px 10px -4px rgba(0,0,0,0.20),5px 5px 10px -4px rgba(0,0,0,0.12)",
    marginTop: -10,
  },
}));

export interface ReportInfoProps extends ReportInfoBaseProps {
  onChangeReportType: (value: ReportType) => void;
}
export function ReportInfo(props: ReportInfoProps) {
  const css = useStyles();
  const { reportType, liveClassSummary, assignmentSummary, onChangeReportType } = props;
  console.log(liveClassSummary);
  const isLiveClass = reportType === ReportType.live;
  const handleClickLive = () => onChangeReportType(ReportType.live);
  const handleClickAssignment = () => onChangeReportType(ReportType.assignment);
  return (
    <LayoutBox holderMin={40} holderBase={202} mainBase={1517}>
      <div className={css.reportCon}>
        <div className={css.pieCon}>
          <div className={clsx(isLiveClass ? css.leftPieItem : css.leftNotActive)} onClick={handleClickLive}>
            <RectCom title={"Live Classes"} reportType={ReportType.live} />
            {liveClassSummary.items && (
              <div className={css.pieWrap}>
                <PieChart px={1} data={[7, 3]} />
              </div>
            )}
            {!liveClassSummary.items && (
              <div className={css.noDataCon}>
                <NoDataCom isPie={true} reportType={reportType} />
              </div>
            )}
          </div>
          <div className={isLiveClass ? css.rightNoActive : css.rightPieItem} onClick={handleClickAssignment}>
            <RectCom title={"Assignments"} reportType={ReportType.assignment} />
            {/* <NoDataCom isPie={false} /> */}
          </div>
        </div>
        <div className={css.infoCon}>
          <LiveClassesReport data={[]} reportType={reportType} liveClassSummary={liveClassSummary} assignmentSummary={assignmentSummary} />
        </div>
      </div>
    </LayoutBox>
  );
}
