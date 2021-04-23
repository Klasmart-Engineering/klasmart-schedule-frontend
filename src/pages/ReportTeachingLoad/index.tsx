import React from "react";
import { reportMiss } from "../../locale/LocaleManager";
import { ReportTitle } from "../ReportDashboard";

export default function ReportTeachingLoad() {
  return <ReportTitle title={reportMiss("Teaching Load", "report_label_teaching_load")}></ReportTitle>;
}
ReportTeachingLoad.routeBasePath = "/report/teaching-load";
ReportTeachingLoad.routeRedirectDefault = "/report/teaching-load";
