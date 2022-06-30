import CssProvider from "@components/CssProvider";
import ScheduleWidget from "./ScheduleWidget";

interface WidgetProps {
  widgetContext?: any; // reduce fault tolerance.more to see "../../../WidgetWrapper/widgetContext" or hub `widgetContext`
  // widgetContext: Context;
}
export default function Index({ widgetContext }: WidgetProps) {
  return (
    <CssProvider>
      <ScheduleWidget widgetContext={widgetContext} />
    </CssProvider>
  );
}
