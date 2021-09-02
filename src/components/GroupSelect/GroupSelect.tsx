import { FormControl, InputLabel, makeStyles, MenuItem, Paper, Typography } from "@material-ui/core";
import { ArrowDropDown, ArrowRight } from "@material-ui/icons";
import clsx from "clsx";
import React, { forwardRef } from "react";
import { getNameByIds } from "../../pages/ContentEdit/OutcomesRelated";
import { LinkedMockOptionsItem } from "../../reducers/milestone";
const useStyles = makeStyles(({ shadows, palette }) => ({
  paper: {
    position: "relative",
    borderRadius: 4,
    border: "1px solid rgba(0,0,0,.23)",
    borderBottom: "1px solid #fff",
    boxSizing: "content-box",
    "&:hover": {
      border: "1px solid rgba(0,0,0,.57)",
    },
  },
  searchTextField: {
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
    top: 44,
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
  paperBox:{
    width: "50%",
    overflow: "auto",
    "&::-webkit-scrollbar": {
      width: "4px",
      height: "4px",
    },
    "&::-webkit-scrollbar-thumb": {
      background: "transparent",
      borderRadius: "4px",
    },
    "&:hover": {
      "&::-webkit-scrollbar-thumb": {
        background: "#ccc",
      },
    },

  }
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
export const GroupSelect = forwardRef<HTMLDivElement, IGroupSelectProps>((props, ref) => {
  const { value, onChange, label, list, subList, onChangeSubListItem, onChangeListItem } = props;
  const css = useStyles();
  const [open, setOpen] = React.useState(false);
  const subListIds = value?.split("/")[1].split(",")||[]
  const listId = value?.split("/")[0];
  const handleChangeListItem = (id: string) => {
    onChangeListItem?.(id);
    onChange?.(`${id}/all`);
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
    onChange?.(`${listId}/${newSubListIds.length ? newSubListIds?.join(",") : "all"}`);
  };
  const handleClick = (e:any) => {
    e.stopPropagation();
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
  React.useEffect(()=>{
    window.addEventListener("click",()=>setOpen(false))
    return(
      window.removeEventListener("click",()=>setOpen(false))
    )
  })
  return (
    <div className={css.paper}  >
      <FormControl variant="outlined" onClick={handleClick} fullWidth>
        <InputLabel variant="outlined" style={{ transform: "translate(14px, -6px) scale(0.75)",backgroundColor: "#fff" }}>
          {label}
        </InputLabel>
        <div className={css.searchTextField}>
          <Typography noWrap>{id2Name()}</Typography>
        </div>
      </FormControl>

      <ArrowDropDown className={css.arrowDown} onClick={handleClick} />
      <Paper elevation={3} style={{ display: open ? "flex" : "none" }} className={css.cascader} >
        <div className={css.paperBox}>
          {list.map((item) => (
            <MenuItem
              className={clsx(css.cascaderList, { active: item.id === listId })}
              key={item.id}
              onClick={(e) => {
                e.stopPropagation()
                item.id && handleChangeListItem(item.id);
              }}
            >
              <Typography noWrap>{item.name}</Typography>
              <ArrowRight />
            </MenuItem>
          ))}
        </div>
        <div style={{ borderLeft: "1px solid #ccc"}} className={css.paperBox}>
          {subList.map((item) => (
            <MenuItem
              disabled={value === "all/all"}
              key={item.id}
              className={clsx(css.cascaderSubList, { active: item.id && subListIds?.includes(item.id) })}
              onClick={(e) => {
                e.stopPropagation()
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
})
