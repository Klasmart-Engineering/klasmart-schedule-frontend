import * as Html from "./Html";
import * as RangeList from "./RangeList";
import * as ShowWhen from "./ShowWhen";
import * as VerticalTabs from "./VerticalTabs";

export const widgetElements = {
  [ShowWhen.title]: ShowWhen.WidgetElement,
  [Html.title]: Html.WidgetElement,
  [VerticalTabs.title]: VerticalTabs.WidgetElement,
  [RangeList.title]: RangeList.WidgetElement,
};
