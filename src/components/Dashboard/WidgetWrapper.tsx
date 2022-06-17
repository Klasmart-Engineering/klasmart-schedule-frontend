import { WidgetType } from "./models/widget.model";
import { createGenerateClassName, StylesProvider } from "@material-ui/core";
import React from "react";
import WidgetWrapperContent from "@components/Dashboard/WidgetWrapperContent";

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

const generateClassName = createGenerateClassName({
  productionPrefix: "schedule",
  seed: "schedule",
});

export default function WidgetWrapper(props: BaseWidgetProps) {
  return (
    <StylesProvider generateClassName={generateClassName}>
      <WidgetWrapperContent {...props} />
    </StylesProvider>
  );
}
