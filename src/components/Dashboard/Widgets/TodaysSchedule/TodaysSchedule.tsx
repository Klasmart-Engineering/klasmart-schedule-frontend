import "react-big-calendar/lib/css/react-big-calendar.css";
import { WidgetType } from "../../models/widget.model";
import DailyCalendar from "@components/Dashboard/Widgets/TodaysSchedule/Calendar/DailyCalendar/DailyCalendar";
import { DailyCalendarEvent } from "@components/Dashboard/Widgets/TodaysSchedule/Calendar/DailyCalendar/DailyCalenderHelper";
import WidgetWrapper from "@components/Dashboard/WidgetWrapper";
import { retrieveClassTypeIdentityOrDefault } from "@config/classTypes";
import { WIDGET_SCHEDULE_ORIENTATION_SWITCH_WIDTH } from "@config/index";
import { usePostSchedulesTimeViewList } from "@kl-engineering/cms-api-client";
import { useCurrentOrganization } from "@store/organizationMemberships";
import { Box } from "@material-ui/core";
import ParentSize from "@visx/responsive/lib/components/ParentSize";
import React, { useEffect, useState } from "react";
import { useIntl } from "react-intl";

// event unix dates are in seconds, we need to multiply by seconds
const MILLISECONDS_IN_A_SECOND = 1000;
const now = new Date();
const timeZoneOffset = now.getTimezoneOffset() * 60 * -1; // to make seconds

export default function TodaysSchedule() {
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

    if (!eventSchedule) return;
    setEvents(eventSchedule);
  }, [schedulesData, unixEndOfDay, unixStartOfDay]);

  return (
    <WidgetWrapper
      label={intl.formatMessage({
        id: `home.schedule.containerTitleLabel`,
      })}
      error={isScheduleError}
      noData={false}
      reload={refetch}
      loading={isSchedulesFetching}
      link={{
        url: `schedule`,
        label: intl.formatMessage({
          id: `home.schedule.containerUrlLabel`,
        }),
      }}
      id={WidgetType.SCHEDULE}
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
    </WidgetWrapper>
  );
}
