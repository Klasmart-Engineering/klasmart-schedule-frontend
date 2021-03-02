import { cloneDeep } from "@apollo/client/utilities";
import { Box, Button, Grid, makeStyles } from "@material-ui/core";
import { CancelRounded, Check, CheckCircle, ShowChart } from "@material-ui/icons";
import clsx from "clsx";
import React, { useCallback, useMemo, useState } from "react";
import { DragSourceMonitor, DropTargetMonitor, useDrag, useDrop } from "react-dnd";
import { apiResourcePathById } from "../../api/extra";
import { H5PItemContent, H5PSingleMediaContent, parseLibraryContent } from "../../models/ModelH5pSchema";
import { DragItem } from "../ContentEdit/PlanComposeGraphic";
const useStyles = makeStyles(({ palette }) => ({
  title: (props: ImagePairProps) => ({
    padding: 10 * props.px,
  }),
  contentBox: {
    borderBottom: "1px solid #dde4ea",
    borderTop: "1px solid #dde4ea",
  },
  contentItem: {
    padding: 20,
  },
  pairBackGround: {
    backgroundColor: "#eef1f4",
  },
  imagePair: {
    padding: 6,
    borderRadius: 6,
    margin: 6,
    border: "2px solid #dbe2e8",
    boxShadow: "2px 2px 0px 2px rgb(203 213 222 / 20%)",
    backgroundColor: "#FFF",

    boxSizing: "border-box",
  },
  imagePairHover: {
    "&:hover": {
      boxShadow: "rgb(64, 110, 243) 0px 0px 10px 0px",
      border: "2px solid rgb(26, 115, 217)",
      borderImage: "initial",
      cursor: "pointer",
    },
  },
  imagerPairgreyDash: {
    border: "2px dashed #b7b7b7",
  },
  imagerPairIsOver: {
    border: "2px dashed #1a73d9",
  },
  imagePairDragging: {
    opacity: "0.3 !important",
  },
  imagePairDiv: {
    position: "absolute",
    top: 0,
    height: "100%",
    width: "100%",
    backgroundColor: "#1a73d9",
    opacity: 0,
    borderRadius: 6,
  },
  imagePairDivHover: {
    "&:hover": {
      opacity: 0.3,
    },
  },
  imagePairIner: {
    "-webkit-box-shadow": "inset 0px 2px 74px 0px rgb(203 213 222)",
    "-moz-box-shadow": "inset 0px 2px 74px 0px rgba(203, 213, 222, 1)",
    boxShadow: "inset 0px 2px 74px 0px rgb(203 213 222)",
    position: "relative",
    borderRadius: "6px",
    width: "100%",
    height: "100%",
  },
  image: {
    maxHeight: "100%",
    maxWidth: "100%",
    position: "relative",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    bottom: 0,
    margin: "auto",
  },
  pairedImage: {
    position: "relative",
    padding: 10,
    boxSizing: "border-box",
    width: "100%",
    height: "100%",
  },
  pairedImageItem: {
    position: "absolute",
    bottom: 0,
    right: 0,
  },
  divWidth: {
    width: "100%",
    height: "100%",
  },
  check: {
    position: "absolute",
    fontSize: "25%",
    top: "20%",
    right: "20%",
  },
  checkIcon: {
    fontSize: 20,
    backgroundColor: palette.common.white,
    borderRadius: "100%",
    position: "absolute",
    top: -10,
    right: -10,
  },
  imagePairError: {
    border: "2px solid #d32f2f",
  },
  imagePairCorrect: {
    border: "2px solid #64a877",
  },
  imagePairShow: {
    border: "2px dashed #1a73d9",
  },
}));

interface MapDropPropsReturn {
  isOver: boolean;
  canDrop: boolean;
}
interface ImageItem {
  image: H5PSingleMediaContent;
  id: number;
}
interface ImagePairItem {
  image?: H5PSingleMediaContent;
  matchId?: number;
  match?: H5PSingleMediaContent;
  id?: number;
  check?: CheckType;
}
interface ImagePairProps {
  data: string;
  px: number;
}
enum CheckType {
  error = "error",
  correct = "correct",
  showSloution = "showSloution",
}
export function ImagePair(props: ImagePairProps) {
  const { data } = props;
  const css = useStyles(props);
  const { params: libraryParams } = parseLibraryContent(data);
  const cards = libraryParams && (libraryParams.cards as Record<string, H5PItemContent>[]);
  const imageList = cloneDeep(cards)
    ?.map((item, idx) => {
      return { image: item.image, id: idx };
    })
    .sort(() => {
      return 0.5 - Math.random();
    });
  const matchList = cloneDeep(cards)
    ?.map((item, idx) => {
      return { image: item.match || item.image, matchId: idx };
    })
    .sort(() => {
      return 0.5 - Math.random();
    }) as ImagePairItem[] | undefined;
  const [matchPairList, SetMatchPairList] = useState(matchList);
  const cardWidth = imageList && `${(1 / imageList.length) * 100 - 5}%`;
  const computedHeight = imageList && window.innerWidth / 2 / imageList.length;
  const DraggableImagePair = (props: ImageItem) => {
    const { image } = props;
    const [{ isDragging }, dragRef] = useDrag({
      item: { type: "IMAGE_PAIR", data: props },
      canDrag: () => true,
      collect: (mointor: DragSourceMonitor) => ({
        isDragging: mointor.isDragging(),
      }),
    });
    return (
      <div className={clsx(css.divWidth, css.imagePair, css.imagePairHover, isDragging && css.imagePairDragging)} ref={dragRef}>
        <div className={css.imagePairIner}>
          <img
            width="100%"
            height="auto"
            className={css.image}
            alt={image?.imageAlt || ""}
            src={apiResourcePathById(image && image.path)}
          ></img>
          <div className={clsx(css.imagePairDiv, css.imagePairDivHover)}></div>
        </div>
      </div>
    );
  };
  const DropImagePair = (props: ImagePairItem & { pairIndex: number }) => {
    const { image, pairIndex } = props;
    const setPair = useMemo(
      () => (dragItem: DragItem) => {
        const newList =
          matchPairList &&
          matchPairList.map((item, index) => {
            if (index === pairIndex) {
              item.match = dragItem.data.image;
              item.id = dragItem.data.id;
              return item;
            }
            return item;
          });
        SetMatchPairList(newList);
      },
      [pairIndex]
    );
    const [{ isOver, canDrop }, dropRef] = useDrop<DragItem, unknown, MapDropPropsReturn>({
      accept: "IMAGE_PAIR",
      drop: setPair,
      collect: (mointor: DropTargetMonitor) => ({
        isOver: mointor.isOver(),
        canDrop: mointor.canDrop(),
      }),
    });

    return (
      <div
        className={clsx(css.divWidth, css.imagePair, { [css.imagerPairgreyDash]: canDrop, [css.imagerPairIsOver]: isOver })}
        ref={dropRef}
      >
        <div className={css.imagePairIner}>
          <img
            width="100%"
            height="auto"
            className={css.image}
            alt={image?.imageAlt || ""}
            src={apiResourcePathById(image && image.path)}
          ></img>
          <div className={clsx(isOver && css.imagePairDragging, css.imagePairDiv)}></div>
        </div>
      </div>
    );
  };

  const pairedImage = (props: ImagePairItem & { pairIndex: number }) => {
    const { image, match, pairIndex, check } = props;
    const handleOndoDrag = (props: ImagePairItem) => {
      const newList =
        matchPairList &&
        matchPairList.map((item, index) => {
          if (index === pairIndex) {
            delete item.match;
            delete item.id;
            return item;
          }
          return item;
        });
      SetMatchPairList(newList);
    };
    return (
      <div
        className={css.pairedImage}
        onClick={() => {
          !check && handleOndoDrag(props);
        }}
      >
        <Box
          width="50%"
          height="50%"
          className={clsx(
            check === CheckType.correct && css.imagePairCorrect,
            check === CheckType.error && css.imagePairError,
            check === CheckType.showSloution && css.imagePairShow,
            css.imagePair,
            !check && css.imagePairHover
          )}
        >
          <div className={css.imagePairIner}>
            <img
              width="100%"
              height="auto"
              className={css.image}
              alt={image?.imageAlt || ""}
              src={apiResourcePathById(image && image.path)}
            ></img>
            <div className={clsx(css.imagePairDiv, !check && css.imagePairDivHover)}></div>
          </div>
          <div className={css.check}>
            {check === CheckType.correct && <CheckCircle style={{ color: "#64a877" }} viewBox="3 3 18 18" className={css.checkIcon} />}
            {check === CheckType.error && <CancelRounded style={{ color: "#d32f2f" }} viewBox="3 3 18 18" className={css.checkIcon} />}
            {check === CheckType.showSloution && <CheckCircle style={{ color: "#1a73d9" }} viewBox="3 3 18 18" className={css.checkIcon} />}
          </div>
        </Box>
        <Box
          width="50%"
          height="50%"
          className={clsx(
            check === CheckType.correct && css.imagePairCorrect,
            check === CheckType.error && css.imagePairError,
            check === CheckType.showSloution && css.imagePairShow,
            css.imagePair,
            !check && css.imagePairHover,
            css.pairedImageItem
          )}
        >
          <div className={css.imagePairIner}>
            <img
              width="100%"
              height="auto"
              className={css.image}
              alt={match?.imageAlt || ""}
              src={apiResourcePathById(match && match.path)}
            ></img>
            <div className={clsx(css.imagePairDiv, !check && css.imagePairDivHover)}></div>
          </div>
        </Box>
      </div>
    );
  };
  const handleCheck = useCallback(() => {
    const newList =
      matchPairList &&
      matchPairList.map((item) => {
        item.check = item.id === item.matchId ? CheckType.correct : CheckType.error;
        return item;
      });
    SetMatchPairList(newList);
  }, [matchPairList]);
  const handleShowSolution = useCallback(() => {
    const newList = cloneDeep(cards)?.map((item) => {
      if (!item.match) {
        item.match = item.image;
        item.check = CheckType.showSloution;
      }
      return item;
    });
    SetMatchPairList(newList);
  }, [cards]);
  return (
    <div>
      <div className={css.title}>{libraryParams && libraryParams.taskDescription}</div>
      <Grid container className={css.contentBox}>
        <Grid item xs={6} className={css.contentItem}>
          <Box display="flex" justifyContent="space-around">
            {imageList &&
              imageList.map((item) => {
                const image = item.image as H5PSingleMediaContent;
                return (
                  <Box key={item.id} width={cardWidth} height={computedHeight}>
                    <DraggableImagePair image={image} id={item.id} />
                  </Box>
                );
              })}
          </Box>
        </Grid>
        <Grid item xs={6} className={clsx(css.contentItem, css.pairBackGround)}>
          <Box display="flex" justifyContent="space-around">
            {matchPairList &&
              matchPairList.map((item, idx) => {
                const image = item.image as H5PSingleMediaContent;
                const match = item.match as H5PSingleMediaContent;
                return (
                  <Box key={idx} width={cardWidth} height={computedHeight}>
                    {match ? (
                      pairedImage({ ...item, pairIndex: idx })
                    ) : (
                      <DropImagePair image={image} matchId={item.matchId} pairIndex={idx} />
                    )}
                  </Box>
                );
              })}
          </Box>
        </Grid>
      </Grid>
      <Box p={3}>
        <Button variant="contained" color="primary" startIcon={<Check />} onClick={handleCheck}>
          Check
        </Button>
        <Button variant="contained" color="primary" startIcon={<ShowChart />} onClick={handleShowSolution}>
          Show Solution
        </Button>
      </Box>
    </div>
  );
}
