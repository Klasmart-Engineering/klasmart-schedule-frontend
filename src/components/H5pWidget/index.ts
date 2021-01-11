import * as Dimensions from "./Dimensions";
import * as DragQuestion from "./DragQuestion";
import * as DynamicCheckboxes from "./DynamicCheckboxes";
import * as Html from "./Html";
import * as RangeList from "./RangeList";
import * as ShowWhen from "./ShowWhen";
import * as VerticalTabs from "./VerticalTabs";
import * as Wizard from "./Wizard";

export const widgetElements = {
  [ShowWhen.title]: ShowWhen.WidgetElement,
  [Html.title]: Html.WidgetElement,
  [VerticalTabs.title]: VerticalTabs.WidgetElement,
  [RangeList.title]: RangeList.WidgetElement,
  [Wizard.title]: Wizard.WidgetElement,
  [DragQuestion.title]: DragQuestion.WidgetElement,
  [Dimensions.title]: Dimensions.WidgetElement,
  [DynamicCheckboxes.title]: DynamicCheckboxes.WidgetElement,
};
