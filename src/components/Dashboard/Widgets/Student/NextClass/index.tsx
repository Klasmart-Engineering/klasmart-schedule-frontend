import CssProvider from "@components/CssProvider";
import NextClass from "./NextClass";

interface WidgetProps {
  widgetContext?: any; // reduce fault tolerance.more to see "../../../WidgetWrapper/widgetContext" or hub `widgetContext`
  // widgetContext: Context;
}
export default function Index({ widgetContext }: WidgetProps) {
  return (
    <CssProvider>
      <NextClass widgetContext={widgetContext} />
    </CssProvider>
  );
}
