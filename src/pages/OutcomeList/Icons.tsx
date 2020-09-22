import { SvgIcon } from "@material-ui/core";
import React from "react";
import { ReactComponent as AssessmentsBlueIconUrl } from "../../assets/icons/assessment-24px-blue.svg";
import { ReactComponent as AssessmentsIconUrl } from "../../assets/icons/assessments-24px.svg";
import { ReactComponent as LOBlueIconUrl } from "../../assets/icons/learning outcomes-24px-blue.svg";
import { ReactComponent as LOIconUrl } from "../../assets/icons/learning outcomes-24px.svg";
import { ReactComponent as PendingBlueIconUrl } from "../../assets/icons/pending_actions-24px-blue.svg";
import { ReactComponent as PendingIconUrl } from "../../assets/icons/pending_actions-24px.svg";
import { ReactComponent as UnPubBlueIconUrl } from "../../assets/icons/unpublished-24px-blue.svg";
import { ReactComponent as UnPubIconUrl } from "../../assets/icons/unpublished-24px.svg";
export function LoIcon() {
  return <SvgIcon component={LOIconUrl}></SvgIcon>;
}
export function PendingIcon() {
  return <SvgIcon component={PendingIconUrl}></SvgIcon>;
}

export function UnPubIcon() {
  return <SvgIcon component={UnPubIconUrl}></SvgIcon>;
}

export function AssessmentsIcon() {
  return <SvgIcon component={AssessmentsIconUrl}></SvgIcon>;
}

export function LoBlueIcon() {
  return <SvgIcon component={LOBlueIconUrl}></SvgIcon>;
}
export function PendingBlueIcon() {
  return <SvgIcon component={PendingBlueIconUrl}></SvgIcon>;
}

export function UnPubBlueIcon() {
  return <SvgIcon component={UnPubBlueIconUrl}></SvgIcon>;
}

export function AssessmentsBlueIcon() {
  return <SvgIcon component={AssessmentsBlueIconUrl}></SvgIcon>;
}
