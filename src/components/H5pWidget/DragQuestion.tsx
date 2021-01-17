import { Box, Button, InputLabel, makeStyles, Typography } from "@material-ui/core";
import ImageIcon from "@material-ui/icons/Image";
import TextFieldsIcon from "@material-ui/icons/TextFields";
import TrackChangesIcon from "@material-ui/icons/TrackChanges";
import React, { cloneElement, Fragment } from "react";
import { d } from "../../locale/LocaleManager";
import {
  H5PBooleanSemantic,
  H5PGroupSemantic,
  H5PItemHelper,
  H5PLibrarySemantic,
  H5PListSemantic,
  H5PNumberSemantic,
  H5PSelectSemantic,
  H5PTextSemantic,
  isH5pBooleanItemInfo,
  isH5pGroupItemInfo,
  isH5pLibraryItemInfo,
  isH5pNumberItemInfo,
  isH5pSelectItemInfo,
  isH5pTextItemInfo,
} from "../../models/ModelH5pSchema";
import { H5pElement, H5pElementGroupProps, H5pElementProps, isH5pElementGroup } from "../H5pElement";
import { DynamicCheckboxesOption } from "./DynamicCheckboxes";

const useStyles = makeStyles(({ palette, shadows }) => ({
  label: {
    marginTop: 32,
  },
  flex: {
    display: "flex",
    alignItems: "center",
    width: 240,
  },
  closeIcon: {
    marginTop: 32,
  },
  DragQuestionBox: {
    border: "1px solid #ccc",
    marginTop: 16,
    paddingBottom: "50%",
  },
  toolBox: {
    height: 42,
    padding: "8px 16px",
    backgroundColor: palette.grey[200],
    borderBottom: "1px solid #ccc",
    display: "flex",
    alignItems: "center",
  },
  buttonIcon: {
    marginLeft: 16,
  },
  listItemBox: {
    marginTop: 16,
    boxShadow: shadows[2],
  },
  listItemBoxContent: {
    overflow: "hidden",
    padding: 32,
    paddingTop: 0,
  },
  listItemBoxFooter: {
    height: 42,
    padding: "8px 16px",
    backgroundColor: palette.grey[200],
    borderBottom: "1px solid #ccc",
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-end",
    borderTop: "1px solid #ccc",
  },
}));

interface DragItemHepler extends H5PItemHelper<H5PGroupSemantic> {
  childItems: [
    H5PItemHelper<H5PLibrarySemantic>,
    H5PItemHelper<H5PNumberSemantic>,
    H5PItemHelper<H5PNumberSemantic>,
    H5PItemHelper<H5PNumberSemantic>,
    H5PItemHelper<H5PNumberSemantic>,
    H5PItemHelper<H5PSelectSemantic>,
    H5PItemHelper<H5PNumberSemantic>,
    H5PItemHelper<H5PBooleanSemantic>
  ];
}
interface DropItemHepler extends H5PItemHelper<H5PGroupSemantic> {
  childItems: [
    H5PItemHelper<H5PTextSemantic>,
    H5PItemHelper<H5PBooleanSemantic>,
    H5PItemHelper<H5PNumberSemantic>,
    H5PItemHelper<H5PNumberSemantic>,
    H5PItemHelper<H5PNumberSemantic>,
    H5PItemHelper<H5PNumberSemantic>,
    H5PItemHelper<H5PSelectSemantic>,
    H5PItemHelper<H5PNumberSemantic>,
    H5PItemHelper<H5PGroupSemantic>,
    H5PItemHelper<H5PBooleanSemantic>,
    H5PItemHelper<H5PBooleanSemantic>
  ];
}

interface DragListHelper extends H5PItemHelper<H5PListSemantic> {
  childItems: DragItemHepler[];
}

interface DropListHelper extends H5PItemHelper<H5PListSemantic> {
  childItems: DropItemHepler[];
}

interface H5pWidgetDragQuestionProps extends H5pElementGroupProps {
  itemHelper: { childItems: [DragListHelper, DropListHelper] } & H5pElementGroupProps["itemHelper"];
}

function isWidgetDragQuestionItemHelper(props: H5pElementProps): props is H5pWidgetDragQuestionProps {
  if (!isH5pElementGroup(props)) return false;
  const [dragListItemHelper, dropListItemHelper] = props.itemHelper.childItems;
  const isDragListItemHelper = dragListItemHelper.childItems.every((dragItemHelper) => {
    if (!isH5pGroupItemInfo(dragItemHelper)) return false;
    const [c0, c1, c2, c3, c4, c5, c6, c7] = dragItemHelper.childItems;
    if (!isH5pLibraryItemInfo(c0)) return false;
    if (!isH5pNumberItemInfo(c1)) return false;
    if (!isH5pNumberItemInfo(c2)) return false;
    if (!isH5pNumberItemInfo(c3)) return false;
    if (!isH5pNumberItemInfo(c4)) return false;
    if (!isH5pSelectItemInfo(c5)) return false;
    if (!isH5pNumberItemInfo(c6)) return false;
    if (!isH5pBooleanItemInfo(c7)) return false;
    return true;
  });
  const isDropListItemHelper = dropListItemHelper.childItems.every((dropItemHelper) => {
    if (!isH5pGroupItemInfo(dropItemHelper)) return false;
    const [c0, c1, c2, c3, c4, c5, c6, c7, c8, c9, c10] = dropItemHelper.childItems;
    if (!isH5pTextItemInfo(c0)) return false;
    if (!isH5pBooleanItemInfo(c1)) return false;
    if (!isH5pNumberItemInfo(c2)) return false;
    if (!isH5pNumberItemInfo(c3)) return false;
    if (!isH5pNumberItemInfo(c4)) return false;
    if (!isH5pNumberItemInfo(c5)) return false;
    if (!isH5pSelectItemInfo(c6)) return false;
    if (!isH5pNumberItemInfo(c7)) return false;
    if (!isH5pGroupItemInfo(c8)) return false;
    if (!isH5pBooleanItemInfo(c9)) return false;
    if (!isH5pBooleanItemInfo(c10)) return false;
    return true;
  });
  return isDragListItemHelper && isDropListItemHelper;
}

export function WidgetElement(props: H5pElementGroupProps) {
  const css = useStyles();
  if (!isWidgetDragQuestionItemHelper(props)) return <H5pElement {...props} />;
  const { itemHelper } = props;
  const { semantics, childItems } = itemHelper;
  const [dragListHelper, dropListHelper] = childItems;
  const discription = semantics.description?.split("<br/>");
  console.log("dragListHelper = ", dragListHelper);
  const dragOptions = dropListHelper.childItems
    .map((item, idx) => {
      const label = item.childItems[0].content;
      return label ? { label, value: idx } : undefined;
    })
    .filter((x) => !!x);
  const dropOptions = (dropIdx: number) =>
    dragListHelper.childItems.reduce((options, item, dragIdx) => {
      const dragOptionValues = item.childItems[5].content as number[];
      const libraryItemHelper = item.childItems[0];
      const labelItemIdx = libraryItemHelper.content?.library.includes("Text") ? 0 : 2;
      const label = libraryItemHelper.childItems[labelItemIdx]?.content as string | undefined;
      return label && dragOptionValues.includes(dropIdx) ? options.concat({ label, value: dragIdx }) : options;
    }, [] as DynamicCheckboxesOption[]);
  const dragListElemnts = dragListHelper.childItems.map((dragItemHelper) => (
    <div className={css.listItemBox} key={dragItemHelper.path}>
      <div className={css.listItemBoxContent}>
        {dragItemHelper.childItems.map(({ node }, drapPropertyIdx) => {
          if (drapPropertyIdx !== 5 || !node) return node;
          return cloneElement(node, { options: dragOptions });
        })}
      </div>
      <Box className={css.listItemBoxFooter}>
        <Button size="small" variant="outlined">
          {d("Remove").t("library_label_remove")}
        </Button>
        <Button className={css.buttonIcon} color="primary" variant="contained" size="small">
          {d("Complete").t("assess_button_complete")}
        </Button>
      </Box>
    </div>
  ));
  const dropListElemnts = dropListHelper.childItems.map((dropItemHelper, dropIdx) => (
    <div className={css.listItemBox} key={dropItemHelper.path}>
      <div className={css.listItemBoxContent}>
        {dropItemHelper.childItems.map(({ node }, dropPropertyIdx) => {
          if (dropPropertyIdx !== 6 || !node) return node;
          return cloneElement(node, { options: dropOptions(dropIdx) });
        })}
      </div>
      <Box className={css.listItemBoxFooter}>
        <Button size="small" variant="outlined">
          {d("Remove").t("library_label_remove")}
        </Button>
        <Button className={css.buttonIcon} color="primary" variant="contained" size="small">
          {d("Complete").t("assess_button_complete")}
        </Button>
      </Box>
    </div>
  ));
  return (
    <Fragment>
      <InputLabel required={!semantics.optional} className={css.label}>
        {semantics.label || semantics.name}
      </InputLabel>
      <div className={css.DragQuestionBox}>
        <div className={css.toolBox}>
          <Button variant="outlined">
            <TrackChangesIcon />
          </Button>
          <Button className={css.buttonIcon} variant="outlined">
            <TextFieldsIcon />
          </Button>
          <Button className={css.buttonIcon} variant="outlined">
            <ImageIcon />
          </Button>
        </div>
      </div>
      {dragListElemnts}
      {dropListElemnts}
      {discription &&
        discription.map((item, idx) => {
          return (
            <div key={idx}>
              <Typography variant="caption">{item}</Typography>
              <br />
            </div>
          );
        })}
    </Fragment>
  );
}

export const version = "1.0.0";
export const name = "H5PEditor.DragQuestion";
export const title = "dragQuestion";
