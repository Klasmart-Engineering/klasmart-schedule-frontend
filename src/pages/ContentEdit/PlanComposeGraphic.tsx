import React, { ReactNode, Children, cloneElement, ReactElement } from "react";
import { makeStyles, Box, Typography, Button, useTheme, ButtonGroup, CardMedia, Card, CardContent, BoxProps } from "@material-ui/core";
import { Done, DashboardOutlined, SvgIconComponent, Close, Spellcheck, FlagOutlined } from "@material-ui/icons";
import { NavLink } from "react-router-dom";
import clsx from "clsx";
import lessonPlanBgUrl from "../../assets/icons/lesson-plan-bg.svg";

const useStyles = makeStyles(({ palette, shape }) => ({
  planComposeGraphic: {
    background: `url(${lessonPlanBgUrl}) center repeat`,
  },
  headerTitle: {
    marginRight: 20,
    fontSize: 18,
    fontWeight: "bold",
  },
  conditionBtnLabel: {
    whiteSpace: "nowrap",
  },
  headerButtonGroup: {
    position: "absolute",
    top: -50,
    right: 0,
  },
  headerConditionBtn: {
    marginLeft: 40,
    marginTop: 28,
  },
  headerButton: {
    width: 60,
    backgroundColor: palette.common.white,
    "&.active": {
      color: palette.primary.contrastText,
      backgroundColor: palette.primary.main,
    },
    "&:hover": {
      backgroundColor: palette.action.hover,
    },
  },
  composeArea: {
    width: "100%",
    // overflowX: 'scroll',
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    paddingTop: 40,
  },
  segment: {
    // debug
    backgroundColor: "rgba(0,0,0,.05)",
    paddingTop: 66,
    "&:not(:first-child)": {
      marginLeft: 32,
    },
  },
  blankBox: {
    width: 240,
    height: 160,
    marginTop: 40,
  },
  drappableBox: {
    padding: 15,
    borderWidth: 2,
    borderStyle: "dashed",
    borderColor: palette.primary.main,
    borderRadius: shape.borderRadius,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  cardMedia: {
    width: "100%",
    height: 96,
  },
  cardContent: {
    padding: 6,
    "&:last-child": {
      padding: 6,
    },
  },
}));

const useSegmentComputedStyles = makeStyles({
  card: (props: SegmentProps) => ({
    marginTop: props.condition ? 40 : props.droppableType === "condition" ? 40 + 59 + 34 : 40 + 59,
    width: 200,
  }),
});

// ts type gard helper
function hasOwnProperty<X extends {}, Y extends PropertyKey>(obj: X, prop: Y): obj is X & Record<Y, unknown> {
  return obj.hasOwnProperty(prop);
}

interface ConditionBtnUIProps extends BoxProps {
  color: string;
  label: string;
  Icon: SvgIconComponent;
}
function ConditionBtnUI({ color, Icon, label, ...boxProps }: ConditionBtnUIProps) {
  const css = useStyles();
  const { palette } = useTheme();
  return (
    <Box
      className="ConditionBtnUI"
      display="flex"
      pr={4}
      alignItems="center"
      borderRadius={3}
      boxShadow={1}
      overflow="hidden"
      {...boxProps}
    >
      <Box py={2} px={1.5} mr={3} bgcolor={palette[color].main} color="white">
        <Icon color="inherit" />
      </Box>
      <Typography className={css.conditionBtnLabel}>{label}</Typography>
    </Box>
  );
}

interface ConditionBtnProps extends BoxProps {
  type: Segment["condition"] | "start";
}
function ConditionBtn({ type, ...restConditionBtnUIProps }: ConditionBtnProps) {
  switch (type) {
    case "start":
      return <ConditionBtnUI Icon={FlagOutlined} color="primary" label="START" {...restConditionBtnUIProps} />;
    case "ifCorrect":
      return <ConditionBtnUI Icon={Done} color="success" label="If Correct" {...restConditionBtnUIProps} />;
    case "ifWrong":
      return <ConditionBtnUI Icon={Close} color="error" label="If Wrong" {...restConditionBtnUIProps} />;
    case "ifScoreDown60":
      return <ConditionBtnUI Icon={Spellcheck} color="secondary" label="If Score < 60" {...restConditionBtnUIProps} />;
    case "ifScoreUp60":
      return <ConditionBtnUI Icon={Spellcheck} color="primary" label="If Score >= 60" {...restConditionBtnUIProps} />;
    default:
      return null;
  }
}

interface DrappableBoxProps extends BoxProps {
  enable?: boolean;
  children: ReactNode;
}
function DrappableBox({ enable, children, className, ...boxProps }: DrappableBoxProps) {
  const css = useStyles();
  if (!enable) {
    if (Children.count(children) !== 1) throw new Error("DroppableBox should not contain more than one child");
    const child = Children.toArray(children)[0];
    const childProps = child && hasOwnProperty(child, "props") ? { className: clsx(child.props.className, className) } : {};
    return cloneElement(child as ReactElement, childProps);
  }
  return (
    <Box className={clsx(css.drappableBox, className)} {...boxProps}>
      {children}
    </Box>
  );
}

export interface Segment {
  segmentId?: string;
  condition?: "ifCorrect" | "ifWrong" | "ifScoreUp60" | "ifScoreDown60" | "start";
  material?: any;
  next?: Segment[];
}

interface DrappableType {
  droppableType?: "condition" | "material";
}

interface SegmentProps extends Segment, DrappableType {}
function Segment(props: SegmentProps) {
  const { material, condition, next, droppableType, segmentId } = props;
  const css = useStyles();
  const computedCss = useSegmentComputedStyles(props);
  const insertedNext = next && next.length > 0 ? next : material ? [{}] : [];
  const segmentConditionId = `${segmentId}.condition`;
  const segmentMaterialId = `${segmentId}.material`;
  let segmentItemIdx = -1;
  const segmentNodes = (
    <Box className="segmentNext" display="flex" flexWrap="nowrap">
      {insertedNext.map((segmentItem) => (
        <Segment key={++segmentItemIdx} {...segmentItem} droppableType={droppableType} />
      ))}
    </Box>
  );
  // 既没选 material 也没选 condition 的情况
  if (!material && !condition)
    return (
      <DrappableBox className={css.blankBox} enable>
        <Typography align="center" variant="body1" color="textSecondary">
          Drop a condition or a lesson material here
        </Typography>
      </DrappableBox>
    );
  // 选 condition 但没选 material 的情况
  if (!material && condition)
    return (
      <Box className={css.segment} display="flex" flexDirection="column" alignItems="center">
        <DrappableBox enable={droppableType === "condition"}>
          <ConditionBtn type={condition} />
        </DrappableBox>
        <DrappableBox className={css.blankBox} enable={droppableType !== "condition"}>
          <Typography align="center" variant="body1" color="textSecondary">
            Drop a lesson material here
          </Typography>
        </DrappableBox>
      </Box>
    );
  // 选 material 但没选 condition 的情况
  if (!condition)
    return (
      <Box className={css.segment} display="flex" flexDirection="column" alignItems="center">
        <DrappableBox className={computedCss.card} enable={droppableType === "material"}>
          <Card>
            <CardMedia className={css.cardMedia} image="https://beta-hub.kidsloop.net/e23a62b86d44c7ae5eb7993dbb6f7d7d.png" />
            <CardContent className={css.cardContent}>
              <Typography component="div" variant="caption" noWrap>
                Badanamu Zoo: Snow Leopard
              </Typography>
              <Typography component="div" variant="caption" color="textSecondary" noWrap>
                Elnora Jensen
              </Typography>
            </CardContent>
          </Card>
        </DrappableBox>
        {segmentNodes}
      </Box>
    );
  // 即选了 material 又选了 condition 的情况
  return (
    <Box className={css.segment} display="flex" flexDirection="column" alignItems="center">
      <DrappableBox enable={droppableType === "condition"}>
        <ConditionBtn type={condition} />
      </DrappableBox>
      <DrappableBox className={computedCss.card} enable={droppableType === "material"}>
        <Card>
          <CardMedia className={css.cardMedia} image="https://beta-hub.kidsloop.net/e23a62b86d44c7ae5eb7993dbb6f7d7d.png" />
          <CardContent className={css.cardContent}>
            <Typography component="div" variant="caption" noWrap>
              Badanamu Zoo: Snow Leopard
            </Typography>
            <Typography component="div" variant="caption" color="textSecondary" noWrap>
              Elnora Jensen
            </Typography>
          </CardContent>
        </Card>
      </DrappableBox>
      {segmentNodes}
    </Box>
  );
}

interface PlanComposeGraphicProps extends DrappableType {
  plan: Segment;
}
export default function PlanComposeGraphic(props: PlanComposeGraphicProps) {
  const { plan, droppableType } = props;
  const css = useStyles();
  return (
    <Box className={css.planComposeGraphic}>
      <Box position="relative" display="flex" alignItems="center" px={3} boxShadow={3} bgcolor="white">
        <ButtonGroup className={css.headerButtonGroup}>
          <Button
            component={NavLink}
            activeClassName="active"
            variant="contained"
            className={css.headerButton}
            to="/content-edit/lesson/plan/tab/details/rightside/planComposeText"
          >
            A
          </Button>
          <Button
            component={NavLink}
            activeClassName="active"
            variant="contained"
            className={css.headerButton}
            to="/content-edit/lesson/plan/tab/details/rightside/planComposeGraphic"
          >
            <DashboardOutlined />
          </Button>
        </ButtonGroup>
        <Typography className={css.headerTitle}>Condition Library</Typography>
        <Box display="flex" flexWrap="wrap" pb={3.5}>
          <ConditionBtn className={css.headerConditionBtn} type="ifCorrect" />
          <ConditionBtn className={css.headerConditionBtn} type="ifWrong" />
          <ConditionBtn className={css.headerConditionBtn} type="ifScoreDown60" />
          <ConditionBtn className={css.headerConditionBtn} type="ifScoreUp60" />
        </Box>
      </Box>
      <Box className={css.composeArea}>
        <ConditionBtn type="start" mb={-15.5} />
        <div>
          <Segment {...plan} droppableType={droppableType} />
        </div>
      </Box>
    </Box>
  );
}
