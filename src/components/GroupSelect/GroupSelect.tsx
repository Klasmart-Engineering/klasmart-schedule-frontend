import { FormControl, InputLabel, makeStyles, MenuItem, Paper, Typography } from "@material-ui/core";
import { ArrowDropDown, ArrowRight } from "@material-ui/icons";
import clsx from "clsx";
import React from "react";
import { getNameByIds } from "../../pages/ContentEdit/OutcomesRelated";
import { LinkedMockOptionsItem } from "../../reducers/milestone";
const useStyles = makeStyles(({ shadows, palette }) => ({
  paper: {
    width: 200,
    position: "relative",
    marginRight: 20,
  },
  searchTextField: {
    width: 200,
    height: 40,
    backgroundColor: "white",
    borderRadius: 4,
    boxShadow: shadows[3],
    color: palette.text.primary,
    justifyContent: "center",
    flexDirection: "column",
    display: "flex",
    paddingLeft: 8,
    paddingRight: 26,
    boxSizing: "border-box",
  },
  arrowDown: {
    position: "absolute",
    top: "50%",
    transform: "translateY(-50%)",
    right: 0,
    color: "rgba(0,0,0,.54)",
  },
  cascader: {
    justifyContent: "space-between",
    position: "absolute",
    width: 400,
    height: 500,
    zIndex: 100,
    top: 40,
  },
  cascaderList: {
    display: "flex",
    justifyContent: "space-between",
    width: "100%",
    "&.active": {
      background: "rgba(75,136,245,0.08)",
    },
  },
  cascaderSubList: {
    display: "flex",
    justifyContent: "center",
    width: "100%",
    "&.active": {
      background: "rgba(75,136,245,0.08)",
    },
  },
}));

interface IGroupSelectProps {
  value?: string;
  onChange?: (value: IGroupSelectProps["value"]) => any | null;
  label: string;
  list: LinkedMockOptionsItem[];
  subList: LinkedMockOptionsItem[];
  onChangeListItem?: (id: string) => any;
  onChangeSubListItem?: (subId: string[]) => any;
}
export function GroupSelect(props: IGroupSelectProps) {
  const { value, onChange, label, list, subList, onChangeSubListItem, onChangeListItem } = props;
  const css = useStyles();
  // const [open, toggle] = React.useReducer((open) => !open, false);
  const [open, setOpen] = React.useState(false);
  const [subListIds, setSubListIds] = React.useState(value?.split("/")[1].split(",") || []);
  const listId = value?.split("/")[0];

  const handleChangeListItem = (id: string) => {
    onChangeListItem?.(id);
    onChange?.(`${id}/${subListIds?.join(",")}`);
  };
  const handleChangeSubListItem = (subId: string) => {
    let newSubListIds: string[] = [];
    if (subId === "all") {
      newSubListIds = ["all"];
    } else {
      const selectSubListIds = subListIds?.filter((item) => item !== "all");
      newSubListIds = selectSubListIds?.includes(subId)
        ? selectSubListIds.filter((item) => item !== subId)
        : selectSubListIds?.concat([subId]) || [];
    }
    setSubListIds(newSubListIds.length ? newSubListIds : ["all"]);
    onChange?.(`${listId}/${newSubListIds.length ? newSubListIds?.join(",") : "all"}`);
  };
  const handleClick = () => {
    if (open) {
      onChangeSubListItem?.(subListIds);
    }
    setOpen(!open);
  };
  const id2Name = () => {
    const name = list.find((item) => item.id === listId)?.name;
    const subNames = getNameByIds(subList, subListIds)?.join(",");
    return `${name}/${subNames}`;
  };
  return (
    <div className={css.paper}>
      <FormControl variant="outlined" onClick={handleClick}>
        <InputLabel variant="outlined" style={{ transform: "translate(14px, -6px) scale(0.75)" }}>
          {label}
        </InputLabel>
        <div className={css.searchTextField}>
          <Typography noWrap>{id2Name()}</Typography>
        </div>
      </FormControl>

      <ArrowDropDown className={css.arrowDown} />
      <Paper elevation={3} style={{ display: open ? "flex" : "none" }} className={css.cascader}>
        <div style={{ width: "50%", overflow: "auto" }}>
          {list.map((item) => (
            <MenuItem
              className={clsx(css.cascaderList, { active: item.id === listId })}
              key={item.id}
              onClick={() => {
                item.id && handleChangeListItem(item.id);
              }}
            >
              <Typography noWrap>{item.name}</Typography>
              <ArrowRight />
            </MenuItem>
          ))}
        </div>
        <div style={{ borderLeft: "1px solid #ccc", width: "50%", overflow: "auto" }}>
          {subList.map((item) => (
            <MenuItem
              key={item.id}
              className={clsx(css.cascaderSubList, { active: item.id && subListIds?.includes(item.id) })}
              onClick={() => {
                item.id && handleChangeSubListItem(item.id);
              }}
            >
              <Typography noWrap>{item.name}</Typography>
            </MenuItem>
          ))}
        </div>
      </Paper>
    </div>
  );
}
