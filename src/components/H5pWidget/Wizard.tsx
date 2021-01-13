import { Box, Step, StepButton, Stepper } from "@material-ui/core";
import React, { useState } from "react";
import { isH5pGroupItemInfo } from "../../models/ModelH5pSchema";
import { H5pElement, H5pElementProps, isH5pElementGroup } from "../H5pElement";

export function WidgetElement(props: H5pElementProps) {
  const [step, setStep] = useState(0);
  if (!isH5pElementGroup(props)) return <H5pElement {...props} />;
  const { itemHelper } = props;
  const { semantics } = itemHelper;
  const stepContent = itemHelper.childItems
    .map((childItemHelper) => {
      if ("widget" in childItemHelper.semantics) return childItemHelper.node;
      if (isH5pGroupItemInfo(childItemHelper)) return childItemHelper.childItems.map(({ node }) => node);
      return childItemHelper.node;
    })
    .map((node, index) => (index === step ? node : null));
  return (
    <Box mt={4} p={4} boxShadow={1}>
      <Stepper activeStep={step} alternativeLabel nonLinear>
        {semantics.fields.map(({ label, name }, index) => (
          <Step key={name}>
            <StepButton onClick={() => setStep(index)}>{label ?? name}</StepButton>
          </Step>
        ))}
      </Stepper>
      {stepContent}
    </Box>
  );
}

export const version = "1.0.0";
export const name = "H5PEditor.Wizard";
export const title = "wizard";
