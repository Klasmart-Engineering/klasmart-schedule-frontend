import { Box, Button, IconButton, InputLabel, makeStyles, Tooltip, Typography } from "@material-ui/core";
import CloseIcon from "@material-ui/icons/Close";
import React from "react";
import { H5pElementListProps } from "../H5pElement";
const useStyles = makeStyles(() => ({
  label: {
    marginTop: 32,
  },
  addButton: {
    marginTop: 10,
  },
  closeButton: {
    marginTop: 35,
    marginLeft: 10,
  },
}));

export function WidgetElement(props: H5pElementListProps) {
  const css = useStyles();
  const { itemHelper, children, onAddListItem, onRemoveListItem } = props;
  const { semantics } = itemHelper;
  return (
    <Box>
      <InputLabel className={css.label} required={!semantics.optional}>
        {semantics.label || semantics.name}
      </InputLabel>
      <Typography variant="caption">{semantics.description}</Typography>
      {children.map((childrenNode: JSX.Element, idx) => {
        return (
          <Box display="flex" key={idx}>
            {childrenNode}
            <Box width={48}>
              {children.length > (semantics.min ?? 0) && (
                <Tooltip title="Remove Item">
                  <IconButton
                    aria-label="close"
                    className={css.closeButton}
                    onClick={() => onRemoveListItem({ ...itemHelper, index: idx })}
                  >
                    <CloseIcon />
                  </IconButton>
                </Tooltip>
              )}
            </Box>
          </Box>
        );
      })}
      <Button
        color="primary"
        variant="contained"
        size="large"
        onClick={() => {
          onAddListItem(itemHelper);
        }}
        className={css.addButton}
      >
        ADD {semantics.entity?.toUpperCase() ?? "ITEM"}
      </Button>
    </Box>
  );
}

export const version = "1.0.0";
export const name = "H5PEditor.RangeList";
export const title = "RangeList";
