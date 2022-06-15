import { WidgetType } from "../../models/widget.model";
import { useGetClassNodeRoster } from "@api/classRoster";
import { useRestAPI } from "@api/restapi";
import scheduleSvg from "@assets/img/schedule.svg";
import WidgetWrapper from "@components/Dashboard/WidgetWrapper";
import { getLiveEndpoint } from "../../../../config";
import { SchedulePayload } from "../../../../types/objectTypes";
import { usePostSchedulesTimeViewList } from "@kl-engineering/cms-api-client";
import { UserAvatar } from "@kl-engineering/kidsloop-px";
import VideoCallIcon from "@material-ui/icons/VideoCall";
import { apiOrganizationOfPage } from "@api/extra";
import { Box, darken, Divider, Fab, Grid, Typography } from "@material-ui/core";
import { createStyles, makeStyles } from "@material-ui/core/styles";
import React, { useEffect, useState } from "react";
import { FormattedDate, FormattedMessage, FormattedRelativeTime, FormattedTime, useIntl } from "react-intl";
import FormattedDuration from "react-intl-formatted-duration";

const useStyles = makeStyles((theme) =>
  createStyles({
    noClass: {
      display: `flex`,
      flexDirection: `column`,
      height: `100%`,
      alignItems: `center`,
      "& img": {
        height: `73%`,
      },
    },
    teachersTitle: {
      fontSize: `1em`,
      paddingBottom: `0.5em`,
    },
    nextClassTimeWrapper: {
      display: `flex`,
      flexDirection: `row`,
      padding: `1em 0 0 0`,
      alignItems: `flex-start`,
    },
    nextClassTime: {
      display: `flex`,
      flexDirection: `column`,
      alignItems: `start`,
    },
    nextClassCardTitleIntro: {
      color: theme.palette.grey[600],
    },
    nextClassIcon: {
      fill: theme.palette.getContrastText(theme.palette.text.primary),
      backgroundColor: theme.palette.primary.main,
      borderRadius: `100%`,
      padding: `0.1em`,
      marginRight: `0.3em`,
    },
    nextClassCard: {
      padding: `0 1em 1em 1em`,
      height: `100%`,
    },
    nextClassCardTitle: {
      display: `flex`,
      alignItems: `center`,
      fontSize: `1.5em`,
      color: theme.palette.primary.main,
      marginTop: 5,
      lineHeight: `1.2`,
      marginBottom: theme.spacing(2),
    },
    nextClassGridDetails: {
      [theme.breakpoints.down(`md`)]: {
        borderTop: `1px solid ${theme.palette.grey[300]}`,
        paddingTop: theme.spacing(3),
        marginTop: theme.spacing(3),
      },
      [theme.breakpoints.up(`lg`)]: {
        borderLeft: `1px solid ${theme.palette.grey[300]}`,
        paddingLeft: theme.spacing(4),
        marginLeft: theme.spacing(4),
      },
    },
    liveButton: {
      padding: theme.spacing(5),
      color: theme.palette.common.white,
      backgroundColor: theme.palette.primary.main,
      borderRadius: `100%`,
      "&:hover": {
        backgroundColor: darken(theme.palette.primary.main, 0.2),
      },
      "& .MuiTypography-root": {
        wordBreak: `keep-all`,
      },
    },
    warningText: {
      color: theme.palette.error.main,
      fontWeight: `bold`,
      paddingTop: `0.5em`,
    },
    teacher: {
      "& .singleTeacher": {
        borderRight: `1px solid ${theme.palette.grey[300]}`,
        paddingRight: 10,
        marginRight: 10,
        marginBottom: 10,
      },
      "&:last-of-type .singleTeacher": {
        borderRight: 0,
        paddingRight: 0,
        marginRight: 0,
        marginBottom: 0,
      },
    },
    avatar: {
      marginRight: theme.spacing(1),
    },
  })
);

const now = new Date();
const timeZoneOffset = now.getTimezoneOffset() * 60 * -1; // to make seconds
const maxDays = 14;

export default function NextClass() {
  const intl = useIntl();
  const classes = useStyles();
  const restApi = useRestAPI();
  const [schedule, setSchedule] = useState<SchedulePayload[]>([]);
  const [liveToken, setLiveToken] = useState(``);
  const [nextClass, setNextClass] = useState<SchedulePayload>();
  const [maxTeachers] = useState(2);
  const [timeBeforeClass, setTimeBeforeClass] = useState(Number.MAX_SAFE_INTEGER);
  const organizationId = apiOrganizationOfPage() ?? ``;

  const secondsBeforeClassCanStart = 900;

  const unixStartOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0).getTime();
  const unixEndOfDateRange = new Date(now.getFullYear(), now.getMonth(), now.getDate() + maxDays, 23, 59, 59).getTime();

  const {
    data: schedulesData,
    isFetching: isSchedulesFetching,
    error: isScheduleError,
    refetch,
  } = usePostSchedulesTimeViewList(
    {
      org_id: organizationId,
      view_type: `full_view`,
      time_at: 0, // any time is ok together with view_type=`full_view`,
      start_at_ge: unixStartOfDay / 1000,
      end_at_le: unixEndOfDateRange / 1000,
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

  const { data: rosterData } = useGetClassNodeRoster({
    fetchPolicy: `no-cache`,
    variables: {
      id: nextClass?.class_id ?? ``,
      count: maxTeachers,
      orderBy: `familyName`,
      order: `ASC`,
      direction: `FORWARD`,
      showStudents: false,
      showTeachers: true,
    },
    skip: !nextClass?.class_id,
  });

  function goLive() {
    const liveLink = `${getLiveEndpoint()}?token=${liveToken}`;
    window.open(liveLink);
  }

  useEffect(() => {
    const scheduledClass = schedule
      ?.filter((event) => event.status !== `Closed`)
      .filter((event) => event.class_type === `OnlineClass`)
      .filter((event) => event.end_at > now.getTime() / 1000);

    if (!scheduledClass) return;
    setNextClass(scheduledClass[0]);
  }, [schedule]);

  useEffect(() => {
    if (!nextClass) return;
    setTimeBeforeClass(nextClass?.start_at - new Date().getTime() / 1000);
  }, [nextClass]);

  useEffect(() => {
    if (!schedulesData?.data.length) {
      setSchedule([]);
      return;
    }

    schedulesData.data.sort((a, b) => {
      const startDiff = a.start_at - b.start_at;
      if (startDiff === 0) return a.title.localeCompare(b.title);
      return startDiff;
    });

    setSchedule([...schedulesData.data]);
  }, [schedulesData]);

  useEffect(() => {
    if (timeBeforeClass > secondsBeforeClassCanStart || !nextClass) return;
    (async () => {
      const json = await restApi.getLiveTokenByClassId({
        classId: nextClass.id,
        organizationId,
      });
      if (!json || !json.token) {
        setLiveToken(``);
        return;
      }
      setLiveToken(json.token);
    })();
  }, [nextClass, organizationId, restApi, timeBeforeClass]);

  return (
    <WidgetWrapper
      label={intl.formatMessage({
        id: `home.nextClass.containerTitleLabel`,
      })}
      loading={isSchedulesFetching}
      error={isScheduleError}
      noData={false}
      reload={refetch}
      link={{
        url: `schedule`,
        label: intl.formatMessage({
          id: `home.nextClass.containerUrlLabel`,
        }),
      }}
      id={WidgetType.NEXTCLASS}
    >
      <Box className={classes.nextClassCard}>
        {nextClass ? (
          <Grid container>
            <Grid item xs={12}>
              <Typography className={classes.nextClassCardTitleIntro} variant="caption">
                <FormattedMessage id="home.nextClass.title" />
              </Typography>
              <Typography className={classes.nextClassCardTitle}>
                <VideoCallIcon className={classes.nextClassIcon} />
                {nextClass?.title}
              </Typography>
              <Divider />

              <Typography className={classes.warningText}>
                {timeBeforeClass < 0 ? (
                  <FormattedMessage id="home.nextClass.alreadyStarted" />
                ) : (
                  timeBeforeClass < secondsBeforeClassCanStart && <FormattedMessage id="home.nextClass.startsSoon" />
                )}
                {timeBeforeClass < secondsBeforeClassCanStart && (
                  <>
                    {` `}
                    (
                    <FormattedRelativeTime value={timeBeforeClass} updateIntervalInSeconds={1} />)
                  </>
                )}
              </Typography>

              <Grid container alignItems="center" justifyContent="space-between" className={classes.nextClassTimeWrapper}>
                <Grid item>
                  <div className={classes.nextClassTime}>
                    <Typography variant="caption">
                      <FormattedDate value={nextClass?.start_at * 1000} month="long" weekday="long" day="2-digit" />
                    </Typography>
                    <Typography variant="caption">
                      <FormattedTime value={nextClass?.start_at * 1000} hour="2-digit" minute="2-digit" />
                      <FormattedDuration seconds={nextClass?.end_at - nextClass?.start_at} format=" - {hours} {minutes}" />
                    </Typography>
                  </div>
                </Grid>
                <Grid item>
                  <Fab
                    variant="circular"
                    color="primary"
                    className={classes.liveButton}
                    disabled={liveToken === ``}
                    onClick={() => goLive()}
                  >
                    {timeBeforeClass < secondsBeforeClassCanStart ? (
                      <Typography>
                        <FormattedMessage id="home.nextClass.goLive" />
                      </Typography>
                    ) : (
                      <Typography>
                        <FormattedRelativeTime value={timeBeforeClass} updateIntervalInSeconds={1} />
                      </Typography>
                    )}
                  </Fab>
                </Grid>
              </Grid>
            </Grid>

            {rosterData?.classNode.teachersConnection?.totalCount !== 0 && (
              <Grid item xs={12}>
                <Box>
                  <Typography className={classes.teachersTitle}>
                    <FormattedMessage
                      id="home.nextClass.teachersTitle"
                      values={{
                        count: rosterData?.classNode.teachersConnection?.totalCount || 0,
                      }}
                    />
                  </Typography>
                  <Grid container alignItems="baseline">
                    {rosterData?.classNode.teachersConnection?.edges!.map((edge, i) => {
                      return (
                        <Grid key={edge?.node?.id} item className={classes.teacher}>
                          {rosterData?.classNode.teachersConnection && rosterData?.classNode.teachersConnection.totalCount! <= maxTeachers && (
                            <Box display="flex" flexDirection="row" alignItems="center" className="singleTeacher">
                              <UserAvatar
                                name={`${edge?.node?.givenName} ${edge?.node?.familyName}`}
                                className={classes.avatar}
                                size="small"
                              />
                              <span>
                                {edge?.node?.givenName} {edge?.node?.familyName}
                              </span>
                            </Box>
                          )}
                          {rosterData?.classNode.teachersConnection && rosterData.classNode.teachersConnection.totalCount! > maxTeachers && (
                            <Box display="flex" flexDirection="row" paddingRight="1em" paddingBottom="1em">
                              <UserAvatar
                                name={`${edge?.node?.givenName} ${edge?.node?.familyName}`}
                                className={classes.avatar}
                                size="small"
                              />
                              <Typography variant="caption">{edge?.node?.givenName}</Typography>
                              {i === maxTeachers - 1 && (
                                <Typography variant="caption">
                                  <span
                                    style={{
                                      display: `inline-block`,
                                      paddingLeft: `1em`,
                                    }}
                                  >
                                    {" "}
                                    + {rosterData.classNode.teachersConnection.totalCount! - maxTeachers}
                                  </span>
                                </Typography>
                              )}
                            </Box>
                          )}
                        </Grid>
                      );
                    })}
                  </Grid>
                </Box>
              </Grid>
            )}
          </Grid>
        ) : (
          <div className={classes.noClass}>
            <img src={scheduleSvg} alt="" />
            <Typography color="primary">
              <FormattedMessage id="home.common.noData.schedule.title" />
            </Typography>
          </div>
        )}
      </Box>
    </WidgetWrapper>
  );
}
