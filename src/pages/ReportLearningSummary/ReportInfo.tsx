import { makeStyles } from "@material-ui/core";
import React from "react";
import { EntityQueryLiveClassesSummaryResult } from "../../api/api.auto";
import LayoutBox from "../../components/LayoutBox";
import { LiveClassesReport, NoDataCom } from "./LiveClassesReport";
import { ReportType } from "./types";

const useStyles = makeStyles(({ breakpoints }) => ({
  reportCon: {
    width: "100%",
    height: "1042px",
    borderRadius: "20px",
    marginTop: 40,
    marginBottom: 80,
    display: "flex",
    flexDirection: "column",
  },
  pieCon: {
    flex: 4,
    display: "flex",
  },
  leftPieItem: {
    flex: 5,
    borderRadius: "20px 20px 0 0",
    boxShadow: "-5px -5px 10px -5px rgba(0,0,0,0.20)",
    // boxShadow: "5px 0px 5px -5px rgba(0,0,0,0.20), -5px 0 15px -5px rgba(0,0,0,0.20)"
  },
  leftNotActive: {
    flex: 5,
    borderRadius: "20px 5px 20px 0",
    backgroundColor: "#F6F6F6",
    boxShadow: "inset -5px 0px 5px -5px rgba(0,0,0,0.20), inset 0px -5px 5px -5px rgba(0,0,0,0.20)",
  },
  rightNoActive: {
    flex: 5,
    borderRadius: "5px 20px 0 20px",
    backgroundColor: "#F6F6F6",
    boxShadow: "inset 5px 0px 5px -5px rgba(0,0,0,0.20), inset 0px -5px 5px -5px rgba(0,0,0,0.20)",
  },
  rightPieItem: {
    flex: 5,
    borderRadius: "20px 20px 0 0",
    boxShadow: "5px -5px 10px -5px rgba(0,0,0,0.20)",
  },
  infoCon: {
    flex: 6,
    borderRadius: "0 0 20px 20px",
    boxShadow: "-5px 5px 10px -4px rgba(0,0,0,0.20),5px 5px 10px -4px rgba(0,0,0,0.12)",
    marginTop: -10,
  },
}));
export interface ReportInfoProps {
  reportType: ReportType;
  liveClassesSummary: EntityQueryLiveClassesSummaryResult[];
  onChangeReportType: (value: ReportType) => void;
}
export function ReportInfo(props: ReportInfoProps) {
  const css = useStyles();
  const { reportType, onChangeReportType } = props;
  const isLive = reportType === ReportType.live;
  const handleClickLive = () => onChangeReportType(ReportType.live);
  const handleClickAssignment = () => onChangeReportType(ReportType.assignment);
  return (
    <LayoutBox holderMin={40} holderBase={202} mainBase={1517}>
      <div className={css.reportCon}>
        <div className={css.pieCon}>
          <div className={isLive ? css.leftPieItem : css.leftNotActive} onClick={handleClickLive}>
            <NoDataCom isPie={true} />
          </div>
          <div className={isLive ? css.rightNoActive : css.rightPieItem} onClick={handleClickAssignment}>
            <NoDataCom isPie={false} />
          </div>
        </div>
        <div className={css.infoCon}>
          <LiveClassesReport data={[]} reportType={reportType}/>
        </div>
      </div>
    </LayoutBox>
  );
}
