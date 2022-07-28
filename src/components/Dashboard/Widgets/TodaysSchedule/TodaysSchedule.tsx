import "react-big-calendar/lib/css/react-big-calendar.css";
import { WidgetType } from "../../models/widget.model";
import DailyCalendar from "@components/Dashboard/Widgets/TodaysSchedule/Calendar/DailyCalendar/DailyCalendar";
import { DailyCalendarEvent } from "@components/Dashboard/Widgets/TodaysSchedule/Calendar/DailyCalendar/DailyCalenderHelper";
// import WidgetWrapper from "@components/Dashboard/WidgetWrapper";
import { retrieveClassTypeIdentityOrDefault } from "@config/classTypes";
import { WIDGET_SCHEDULE_ORIENTATION_SWITCH_WIDTH } from "@config/index";
import { usePostSchedulesTimeViewList } from "@kl-engineering/cms-api-client";
import { useCurrentOrganization } from "@store/organizationMemberships";
import { Box } from "@material-ui/core";
import ParentSize from "@visx/responsive/lib/components/ParentSize";
import React, { useEffect, useState } from "react";
import { useIntl } from "react-intl";
import { HomeScreenWidgetWrapper } from "@kl-engineering/kidsloop-px";
import WidgetWrapperError from "@components/Dashboard/WidgetManagement/WidgetWrapperError";
import WidgetWrapperNoData from "@components/Dashboard/WidgetManagement/WidgetWrapperNoData";
import NoDataMask from "@components/Dashboard/WidgetManagement/NoDataMask";
import { d } from "@locale/LocaleManager";

// event unix dates are in seconds, we need to multiply by seconds
const MILLISECONDS_IN_A_SECOND = 1000;
const now = new Date();
const timeZoneOffset = now.getTimezoneOffset() * 60 * -1; // to make seconds

const MockData: DailyCalendarEvent[] = [
  {
    allDay: false,
    title: "Butterfly A-3 class",
    // subtitle: 'Butterfly A-3 class',
    start: new Date(`${new Date().toLocaleDateString()} 8:00`),
    end: new Date(`${new Date().toLocaleDateString()} 9:00`),
    icon: retrieveClassTypeIdentityOrDefault("OnlineClass").icon,
    backgroundColor: retrieveClassTypeIdentityOrDefault("OnlineClass").color,
  },
  {
    allDay: false,
    title: "Butterfly A-3 class",
    start: new Date(`${new Date().toLocaleDateString()} 9:00`),
    end: new Date(`${new Date().toLocaleDateString()} 10:00`),
    icon: retrieveClassTypeIdentityOrDefault("OfflineClass").icon,
    backgroundColor: retrieveClassTypeIdentityOrDefault("OfflineClass").color,
  },
  {
    allDay: false,
    title: "Creating 'Bada STEM' contents",
    start: new Date(`${new Date().toLocaleDateString()} 10:00`),
    end: new Date(`${new Date().toLocaleDateString()} 12:00`),
    icon: retrieveClassTypeIdentityOrDefault("Homework").icon,
    backgroundColor: retrieveClassTypeIdentityOrDefault("Homework").color,
  },
  {
    allDay: false,
    title: "Meeting for New curriculumn",
    start: new Date(`${new Date().toLocaleDateString()} 13:00`),
    end: new Date(`${new Date().toLocaleDateString()} 15:50`),
    icon: retrieveClassTypeIdentityOrDefault("OfflineClass").icon,
    backgroundColor: retrieveClassTypeIdentityOrDefault("OfflineClass").color,
  },
];

interface Props {
  widgetContext: any;
}
export default function TodaysSchedule(props: Props) {
  const { editing = false, removeWidget, layouts, widgets } = props.widgetContext;
  const onRemove = () => removeWidget(WidgetType.SCHEDULE, widgets, layouts);

  const intl = useIntl();
  const [events, setEvents] = useState<DailyCalendarEvent[]>([]);
  const unixStartOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0).getTime();
  const unixEndOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59).getTime();
  const currentOrganization = useCurrentOrganization();
  const organizationId = currentOrganization?.id ?? ``;
  const {
    data: schedulesData,
    isFetching: isSchedulesFetching,
    isError: isScheduleError,
    refetch,
  } = usePostSchedulesTimeViewList(
    {
      org_id: organizationId,
      view_type: `full_view`,
      time_at: 0, // any time is ok together with view_type=`full_view`,
      start_at_ge: unixStartOfDay / 1000,
      end_at_le: unixEndOfDay / 1000,
      time_zone_offset: timeZoneOffset,
      order_by: `start_at`,
      time_boundary: `union`,
    },
    {
      queryOptions: {
        enabled: !!organizationId,
      },
    }
  );

  useEffect(() => {
    const eventSchedule: DailyCalendarEvent[] | undefined = schedulesData?.data?.map<DailyCalendarEvent>((scheduleItem) => {
      const classIdentity = retrieveClassTypeIdentityOrDefault(scheduleItem.class_type);
      const unixItemStartAt = scheduleItem.start_at * MILLISECONDS_IN_A_SECOND;
      const unixItemEndArt = scheduleItem.end_at * MILLISECONDS_IN_A_SECOND;

      return {
        title: scheduleItem.title,
        start: new Date(unixItemStartAt),
        end: new Date(unixItemEndArt),
        allDay: unixItemStartAt <= unixStartOfDay && unixItemEndArt >= unixEndOfDay,
        backgroundColor: classIdentity.color,
        icon: classIdentity.icon,
      };
    });

    if (!schedulesData?.data?.length) {
      setEvents(MockData);
      return;
    }
    if (!eventSchedule) return;
    setEvents(eventSchedule);
  }, [schedulesData, unixEndOfDay, unixStartOfDay]);

  return (
    <HomeScreenWidgetWrapper
      label={intl.formatMessage({
        id: `home.schedule.containerTitleLabel`,
      })}
      error={isScheduleError as boolean}
      errorScreen={<WidgetWrapperError reload={refetch} />}
      noData={false}
      noDataScreen={<WidgetWrapperNoData />}
      loading={isSchedulesFetching}
      link={{
        url: `schedule`,
        label: intl.formatMessage({
          id: `home.schedule.containerUrlLabel`,
        }),
      }}
      onRemove={onRemove}
      editing={editing}
      // onRemove={()=>{}}
      // editing={false}
    >
      <Box display="flex" height="100%" paddingBottom="2" paddingTop="3">
        <ParentSize>
          {({ width }) => {
            if (width > 0) {
              return <DailyCalendar mode={width > WIDGET_SCHEDULE_ORIENTATION_SWITCH_WIDTH ? `horizontal` : `vertical`} events={events} />;
            }
          }}
        </ParentSize>
      </Box>
      {!schedulesData?.data.length && (
        <NoDataMask
          noDataStyle={{ height: 125 }}
          text={d("Create a new schedule item to view it on your calendar widget.").t("widget_teacher_schedule_today_no_data_tip")}
          btnText={d("Create a new schedule").t("widget_teacher_schedule_today_create_schedule")}
          onClickBtn={() => {
            window.location.href = `${window.location.origin}#${window.location.pathname}schedule`;
          }}
        />
      )}
    </HomeScreenWidgetWrapper>
  );
}
