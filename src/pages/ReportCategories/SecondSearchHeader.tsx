import { Divider, Hidden, makeStyles, Menu, MenuItem, TextField } from "@material-ui/core";
import PersonOutlinedIcon from "@material-ui/icons/PersonOutlined";
import clsx from "clsx";
import React, { forwardRef } from "react";
import LayoutBox from "../../components/LayoutBox";
import { PermissionType, usePermission } from "../../components/Permission";
import { d } from "../../locale/LocaleManager";
import { QueryCondition, SingleTeacherItem } from "../ReportAchievementList/types";

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
  list: SingleTeacherItem[];
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
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>, tab: keyof QueryCondition) => any;
  onChangeMb: (e: React.MouseEvent, value: string, tab: keyof QueryCondition) => any;
  teacherList: SingleTeacherItem[];
}
export function SecondSearchHeader(props: SecondSearchHeaderProps) {
  const { onChange, value, onChangeMb, teacherList } = props;
  const css = useStyles();
  const viewReport = usePermission(PermissionType.view_reports_610);
  const viewMyReport = usePermission(PermissionType.view_my_reports_614);
  const [anchorElTeacher, setAnchorElTeacher] = React.useState<null | HTMLElement>(null);

  const showItem = (event: any, tab: keyof QueryCondition) => {
    if (tab === "teacher_id") setAnchorElTeacher(event.currentTarget);
  };
  const handleClose = (e: any, tab: keyof QueryCondition) => {
    if (tab === "teacher_id") setAnchorElTeacher(null);
  };
  const handleChangeMenu = (e: React.MouseEvent, value: any, tab: keyof QueryCondition) => {
    handleClose(e, tab);
    onChangeMb(e, value, tab);
  };

  // const getTeacherList = (teacherList: TeacherItem[] | undefined | null) => {
  //   if (teacherList === null || teacherList === undefined) return;
  //   return teacherList.map((item) => (
  //     <MenuItem key={item.user.user_id} value={item.user.user_id}>
  //       {item.user.user_name}
  //     </MenuItem>
  //   ));
  // };
  return (
    <LayoutBox holderMin={40} holderBase={202} mainBase={1517}>
      <Hidden smDown>
        {viewReport && !viewMyReport && (
          <TextField
            size="small"
            className={css.selectButton}
            onChange={(e) => onChange(e, "teacher_id")}
            label={d("Teacher").t("report_label_teacher")}
            value={value.teacher_id}
            select
            disabled={teacherList.length <= 0}
            SelectProps={{ MenuProps: { transformOrigin: { vertical: -40, horizontal: "left" } } }}
          >
            {/* {getTeacherList(teacherList)} */}
          </TextField>
        )}
      </Hidden>
      <Hidden mdUp>
        {viewReport && !viewMyReport && (
          <PersonOutlinedIcon
            fontSize="large"
            className={clsx(css.selectIcon, teacherList.length <= 0 && css.selectIconDisabled)}
            onClick={(e) => showItem(e, "teacher_id")}
          />
        )}
        <Menu anchorEl={anchorElTeacher} keepMounted open={Boolean(anchorElTeacher)} onClose={(e) => handleClose(e, "teacher_id")}>
          <GetTeacherItem list={teacherList} value={value} onChangeMenu={handleChangeMenu} tab="teacher_id"></GetTeacherItem>
        </Menu>
      </Hidden>
      <Divider className={css.divider} />
    </LayoutBox>
  );
}
