import { Divider, Hidden, makeStyles, Menu, MenuItem, TextField } from "@material-ui/core";
import PersonOutlinedIcon from "@material-ui/icons/PersonOutlined";
import clsx from "clsx";
import React, { forwardRef } from "react";
import { User } from "../../api/api-ko-schema.auto";
import LayoutBox from "../../components/LayoutBox";
import { d } from "../../locale/LocaleManager";
import { ICacheData } from "../../services/permissionCahceService";
import { QueryCondition } from "../ReportAchievementList/types";

const useStyles = makeStyles(({ palette, shadows, breakpoints }) => ({
  box: {
    [breakpoints.down(1500)]: {
      height: 100,
    },
  },
  boxRight: {
    position: "absolute",
    right: 0,
    [breakpoints.down(1500)]: {
      top: 60,
      left: 0,
    },
    [breakpoints.up(1500)]: {
      top: 0,
    },
  },
  selectButton: {
    width: 200,
    height: 40,
    backgroundColor: "white",
    borderRadius: 4,
    boxShadow: shadows[3],
    color: palette.text.primary,
    marginRight: 20,
  },
  lastButton: {
    marginRight: 0,
  },
  selectIcon: {
    marginRight: 20,
  },
  selectIconDisabled: {
    color: palette.grey[500],
  },
  divider: {
    marginTop: 20,
  },
}));

interface GetTeacherItemProps {
  list: SecondSearchHeaderProps["teacherList"];
  value: QueryCondition;
  onChangeMenu: (e: React.MouseEvent, value: string, tab: keyof QueryCondition) => any;
  tab: keyof QueryCondition;
}

const GetTeacherItem = forwardRef<React.RefObject<HTMLElement>, GetTeacherItemProps>((props, ref) => {
  const { list, value, onChangeMenu, tab } = props;
  return (
    <>
      {" "}
      {list &&
        list.map((item) => (
          <MenuItem key={item.user_id} selected={value[tab] === item.user_id} onClick={(e) => onChangeMenu(e, item.user_id as string, tab)}>
            {item.user_name}
          </MenuItem>
        ))}
    </>
  );
});

export interface SecondSearchHeaderProps {
  value: QueryCondition;
  onChange: (value: string, tab: keyof QueryCondition) => any;
  teacherList: Pick<User, "user_id" | "user_name">[];
  perm: ICacheData;
}
export function SecondSearchHeader(props: SecondSearchHeaderProps) {
  const { onChange, value, teacherList, perm } = props;
  const css = useStyles();
  const [anchorElTeacher, setAnchorElTeacher] = React.useState<null | HTMLElement>(null);
  const showItem = (event: any, tab: keyof QueryCondition) => {
    if (tab === "teacher_id") setAnchorElTeacher(event.currentTarget);
  };
  const handleClose = (e: any, tab: keyof QueryCondition) => {
    if (tab === "teacher_id") setAnchorElTeacher(null);
  };
  const handleChangeMenu = (e: React.MouseEvent, value: any, tab: keyof QueryCondition) => {
    handleClose(e, tab);
    onChange(value, tab);
  };
  return (
    <LayoutBox holderMin={40} holderBase={202} mainBase={1517}>
      {(perm.view_reports_610 || perm.view_my_school_reports_611 || perm.view_my_organizations_reports_612) && teacherList.length > 0 && (
        <>
          <Hidden smDown>
            <TextField
              size="small"
              className={css.selectButton}
              onChange={(e) => onChange(e.target.value, "teacher_id")}
              label={d("Teacher").t("report_label_teacher")}
              value={value.teacher_id || teacherList[0]?.user_id || ""}
              select
              disabled={teacherList.length < 2}
              SelectProps={{ MenuProps: { transformOrigin: { vertical: -40, horizontal: "left" } } }}
            >
              {teacherList.map((item) => (
                <MenuItem key={item.user_id} value={item.user_id}>
                  {item.user_name}
                </MenuItem>
              ))}
            </TextField>
          </Hidden>
          <Hidden mdUp>
            <PersonOutlinedIcon
              fontSize="large"
              className={clsx(css.selectIcon, teacherList.length <= 0 && css.selectIconDisabled)}
              onClick={(e) => showItem(e, "teacher_id")}
            />
            <Menu anchorEl={anchorElTeacher} keepMounted open={Boolean(anchorElTeacher)} onClose={(e) => handleClose(e, "teacher_id")}>
              <GetTeacherItem list={teacherList} value={value} onChangeMenu={handleChangeMenu} tab="teacher_id"></GetTeacherItem>
            </Menu>
          </Hidden>
        </>
      )}
      <Divider className={css.divider} />
    </LayoutBox>
  );
}
