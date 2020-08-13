import React, { ReactNode, Children, cloneElement, ReactElement, forwardRef, useRef, useEffect, useCallback } from "react";
import {
  makeStyles,
  Box,
  Typography,
  Button,
  useTheme,
  ButtonGroup,
  CardMedia,
  Card,
  CardContent,
  BoxProps,
  Theme,
} from "@material-ui/core";
import { Done, DashboardOutlined, SvgIconComponent, Close, Spellcheck, FlagOutlined, Translate } from "@material-ui/icons";
import { NavLink } from "react-router-dom";
import clsx from "clsx";
import { ArcherContainer, ArcherElement, Relation } from "react-archer";
import lessonPlanBgUrl from "../../assets/icons/lesson-plan-bg.svg";

const useStyles = makeStyles(({ palette, shadows, shape }) => ({
  planComposeGraphic: {
    // background: `url(${lessonPlanBgUrl}) center repeat`,
  },
  arrowSourceCircle: {
    position: "relative",
    "&:after": {
      content: '""',
      display: "block",
      position: "absolute",
      width: 8,
      height: 8,
      bottom: -5,
      left: "50%",
      transform: "translateX(-4px)",
      borderRadius: "100%",
      backgroundColor: palette.grey[700],
    },
  },
  headerTitle: {
    marginRight: 20,
    fontSize: 18,
    fontWeight: "bold",
  },
  conditionBtnUI: {
    display: "flex",
    minWidth: 175,
    paddingRight: 32,
    alignItems: "center",
    borderRadius: 3,
    boxShadow: shadows[3],
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
    display: "flex",
    width: "100%",
    overflowX: "scroll",
    paddingTop: 40,
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
  segment: (props: SegmentProps) => ({
    // debug
    backgroundColor: "rgba(0,0,0,.05)",
    paddingTop: props.first ? 0 : 66,
    "&:not(:first-child)": {
      marginLeft: props.first ? 0 : 32,
    },
  }),
  card: (props: SegmentProps) => ({
    marginTop: props.first || props.condition ? 40 : props.droppableType === "condition" ? 40 + 59 + 34 : 40 + 59,
    width: 200,
  }),
});

const useGraphicComputedStyles = makeStyles({
  composeArea: (props: PlanComposeGraphicProps) => ({
    display: "flex",
    width: "100%",
    overflowX: "scroll",
    paddingTop: 40,
    justifyContent: props.plan.material ? "start" : "center",
  }),
});

interface ConditionBtnUIProps extends BoxProps {
  color: string;
  label: string;
  Icon: SvgIconComponent;
}
const ConditionBtnUI = forwardRef<HTMLDivElement, ConditionBtnUIProps>((props, ref) => {
  const { color, Icon, label, className, ...restProps } = props;
  const css = useStyles();
  const { palette } = useTheme();
  return (
    <div className={clsx(css.conditionBtnUI, className)} {...restProps} ref={ref}>
      <Box py={2} px={1.5} mr={3} bgcolor={palette[color].main} color="white">
        <Icon color="inherit" />
      </Box>
      <Typography className={css.conditionBtnLabel}>{label}</Typography>
    </div>
  );
});

interface ConditionBtnProps extends BoxProps {
  type: Segment["condition"] | "start";
}
const ConditionBtn = forwardRef<HTMLDivElement, ConditionBtnProps>((props, ref) => {
  const { type, ...restConditionBtnUIProps } = props;
  switch (type) {
    case "start":
      return <ConditionBtnUI Icon={FlagOutlined} color="primary" label="START" {...restConditionBtnUIProps} ref={ref} />;
    case "ifCorrect":
      return <ConditionBtnUI Icon={Done} color="success" label="If Correct" {...restConditionBtnUIProps} ref={ref} />;
    case "ifWrong":
      return <ConditionBtnUI Icon={Close} color="error" label="If Wrong" {...restConditionBtnUIProps} ref={ref} />;
    case "ifScoreDown60":
      return <ConditionBtnUI Icon={Spellcheck} color="secondary" label="If Score <&nbsp; 60" {...restConditionBtnUIProps} ref={ref} />;
    case "ifScoreUp60":
      return <ConditionBtnUI Icon={Spellcheck} color="primary" label="If Score >= 60" {...restConditionBtnUIProps} ref={ref} />;
    default:
      return null;
  }
});

export interface Segment {
  segmentId?: string;
  condition?: "ifCorrect" | "ifWrong" | "ifScoreUp60" | "ifScoreDown60" | "start";
  material?: any;
  next?: Segment[];
}

interface DrappableType {
  droppableType?: "condition" | "material";
}

interface SegmentProps extends Segment, DrappableType {
  first?: boolean;
}
function Segment(props: SegmentProps) {
  const { material, condition, next, droppableType, segmentId } = props;
  const css = useStyles();
  const computedCss = useSegmentComputedStyles(props);
  const insertedNext = next && next.length > 0 ? next : material ? [{}] : [];
  const segmentConditionId = `${segmentId}.condition`;
  const segmentMaterialId = `${segmentId}.material`;
  const hasNext = next && next.length > 0;
  const conditionRelations: Relation[] = [
    { sourceAnchor: "bottom", targetAnchor: "top", targetId: segmentMaterialId, style: { strokeWidth: 1 } },
  ];
  const materialRelations = next?.map(({ condition, segmentId }) => {
    const targetId = condition ? `${segmentId}.condition` : `${segmentId}.material`;
    return { sourceAnchor: "bottom", targetAnchor: "top", targetId } as Relation;
  });
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
      <div className={clsx(css.blankBox, css.drappableBox)}>
        <Typography align="center" variant="body1" color="textSecondary">
          Drop a condition or a lesson material here
        </Typography>
      </div>
    );
  // 选 condition 但没选 material 的情况
  if (!material && condition)
    return (
      <Box className={computedCss.segment} display="flex" flexDirection="column" alignItems="center">
        <ArcherElement id={segmentConditionId} relations={conditionRelations}>
          <div className={clsx(css.arrowSourceCircle, { [css.drappableBox]: droppableType === "condition" })}>
            <ConditionBtn type={condition} />
          </div>
        </ArcherElement>
        <ArcherElement id={segmentMaterialId} relations={materialRelations}>
          <div className={clsx(computedCss.card, { [css.drappableBox]: droppableType !== "condition" })}>
            <Typography align="center" variant="body1" color="textSecondary">
              Drop a lesson material here
            </Typography>
          </div>
        </ArcherElement>
      </Box>
    );
  // 选 material 但没选 condition 的情况
  if (!condition)
    return (
      <Box className={computedCss.segment} display="flex" flexDirection="column" alignItems="center">
        <ArcherElement id={segmentMaterialId} relations={materialRelations}>
          <div className={clsx(computedCss.card, { [css.drappableBox]: droppableType === "material", [css.arrowSourceCircle]: hasNext })}>
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
          </div>
        </ArcherElement>
        {segmentNodes}
      </Box>
    );
  // 即选了 material 又选了 condition 的情况
  return (
    <Box className={computedCss.segment} display="flex" flexDirection="column" alignItems="center">
      <ArcherElement id={segmentConditionId} relations={conditionRelations}>
        <div className={clsx(css.arrowSourceCircle, { [css.drappableBox]: droppableType === "condition" })}>
          <ConditionBtn type={condition} />
        </div>
      </ArcherElement>
      <ArcherElement id={segmentMaterialId} relations={materialRelations}>
        <div className={clsx(computedCss.card, { [css.drappableBox]: droppableType === "material", [css.arrowSourceCircle]: hasNext })}>
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
        </div>
      </ArcherElement>
      {segmentNodes}
    </Box>
  );
}

const useScrollCenter = () => {
  const ref = useCallback((node: HTMLElement | null) => {
    if (!node) return;
    node.scrollIntoView({ inline: "center", behavior: "smooth" });
  }, []);
  return ref;
};

interface PlanComposeGraphicProps extends DrappableType {
  plan: Segment;
}
export default function PlanComposeGraphic(props: PlanComposeGraphicProps) {
  const { plan, droppableType } = props;
  const { palette } = useTheme<Theme>();
  const css = useStyles();
  const computedCss = useGraphicComputedStyles(props);
  const startRelations: Relation[] = [{ sourceAnchor: "bottom", targetAnchor: "top", targetId: "startTarget", style: { strokeWidth: 1 } }];
  const startRef = useScrollCenter();
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
      <Box className={computedCss.composeArea}>
        <ArcherContainer
          svgContainerStyle={{ zIndex: -1 }}
          strokeColor={palette.grey[700]}
          strokeWidth={1}
          arrowThickness={9}
          arrowLength={9}
          noCurves
        >
          <Box display="flex" flexDirection="column" alignItems="center">
            <ArcherElement id="start" relations={startRelations}>
              <div>
                <ConditionBtn ref={startRef} className={css.arrowSourceCircle} type="start" mb={-15.5} />
              </div>
            </ArcherElement>
            <Box position="relative">
              <ArcherElement id="startTarget">
                <Box position="absolute" mt={5} width={0} />
              </ArcherElement>
            </Box>
            <Segment {...plan} droppableType={droppableType} first />
          </Box>
        </ArcherContainer>
      </Box>
    </Box>
  );
}
