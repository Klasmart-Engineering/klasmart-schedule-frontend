import { Box, Hidden, makeStyles, Menu, MenuItem, TextField } from "@material-ui/core";
import PeopleOutlineOutlinedIcon from "@material-ui/icons/PeopleOutlineOutlined";
import PersonOutlinedIcon from "@material-ui/icons/PersonOutlined";
import clsx from "clsx";
import React, { forwardRef } from "react";
import { Class, User } from "../../api/api-ko-schema.auto";
import { MockOptionsItem } from "../../api/extra";
import LayoutBox from "../../components/LayoutBox";
import { PermissionType, usePermission } from "../../components/Permission";
import { d } from "../../locale/LocaleManager";
import { GetStuReportMockOptionsResponse } from "../../reducers/report";
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
}));

interface GetMenuItemProps {
  list: MockOptionsItem[];
  value: QueryCondition;
  onChangeMenu: (e: React.MouseEvent, value: string, tab: keyof QueryCondition) => any;
  tab: keyof QueryCondition;
}
// const GetMenuItem = forwardRef<React.RefObject<HTMLElement>, GetMenuItemProps>((props, ref) => {
//   const { list, value, onChangeMenu, tab } = props;
//   return (
//     <div {...ref}>
//       {" "}
//       {list.map((item) => (
//         <MenuItem key={item.id} selected={value[tab] === item.id} onClick={(e) => onChangeMenu(e, item.id as string, tab)}>
//           {item.name}
//         </MenuItem>
//       ))}
//     </div>
//   );
// });

interface GetTeacherItemProps {
  list: Pick<User, "user_id" | "user_name">[];
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

interface GetClassItemProps {
  list: Pick<Class, "class_id" | "class_name">[];
  value: QueryCondition;
  onChangeMenu: (e: React.MouseEvent, value: string, tab: keyof QueryCondition) => any;
  tab: keyof QueryCondition;
}

const GetClassItem = forwardRef<React.RefObject<HTMLElement>, GetClassItemProps>((props, ref) => {
  const { list, value, onChangeMenu, tab } = props;
  return (
    <>
      {" "}
      {list &&
        list.map((item) => (
          <MenuItem
            key={item.class_id}
            selected={value[tab] === item.class_id}
            onClick={(e) => onChangeMenu(e, item.class_id as string, tab)}
          >
            {item.class_name}
          </MenuItem>
        ))}
    </>
  );
});

export interface FilterTeacherLoadProps {
  value: QueryCondition;
  onChange: (value: string, tab: keyof QueryCondition) => any;
  reportMockOptions: GetStuReportMockOptionsResponse;
}
export function FilterTeacherLoad(props: FilterTeacherLoadProps) {
  const { onChange, value, reportMockOptions } = props;
  const css = useStyles();
  const perm = usePermission([
    PermissionType.view_reports_610,
    PermissionType.view_my_reports_614,
    PermissionType.view_my_organizations_reports_612,
    PermissionType.view_my_school_reports_611,
  ]);
  const classs = reportMockOptions.classList || [];
  const teachers = reportMockOptions.teacherList || [];

  // const [anchorElSchool, setAnchorElSchool] = React.useState<null | HTMLElement>(null);
  const [anchorElTeacher, setAnchorElTeacher] = React.useState<null | HTMLElement>(null);
  const [anchorElClass, setAnchorElClass] = React.useState<null | HTMLElement>(null);

  const showItem = (event: any, tab: keyof QueryCondition) => {
    if (tab === "teacher_id" && classs.length > 0) setAnchorElTeacher(event.currentTarget);
    if (tab === "class_id" && classs.length > 0) setAnchorElClass(event.currentTarget);
    // if (tab === "school_id" && classs.length > 0) setAnchorElSchool(event.currentTarget);
  };
  const handleClose = (e: any, tab: keyof QueryCondition) => {
    if (tab === "teacher_id") setAnchorElTeacher(null);
    if (tab === "class_id") setAnchorElClass(null);
    // if (tab === "school_id") setAnchorElSchool(null);
  };
  const handleChangeMenu = (e: React.MouseEvent, value: any, tab: keyof QueryCondition) => {
    handleClose(e, tab);
    onChange(value, tab);
  };

  const getTeacherList = (teacherList: Pick<User, "user_id" | "user_name">[] | undefined | null) => {
    if (teacherList === null || teacherList === undefined) return;
    return teacherList.map((item) => (
      <MenuItem key={item.user_id} value={item.user_id}>
        {item.user_name}
      </MenuItem>
    ));
  };
  const getClassList = (list: Pick<Class, "class_id" | "class_name">[] | undefined | null) => {
    if (list === null || list === undefined) return;
    return list.map((item) => (
      <MenuItem key={item.class_id} value={item.class_id}>
        {item.class_name}
      </MenuItem>
    ));
  };

  return (
    <LayoutBox holderMin={40} holderBase={202} mainBase={1517}>
      {(perm.view_reports_610 || perm.view_my_reports_614 || perm.view_my_school_reports_611 || perm.view_my_organization_reports_612) && (
        <Hidden smDown>
          <Box position="relative" className={css.box}>
            <Box>
              {(perm.view_reports_610 || perm.view_my_school_reports_611 || perm.view_my_organization_reports_612) && (
                <TextField
                  size="small"
                  className={css.selectButton}
                  onChange={(e) => onChange(e.target.value, "teacher_id")}
                  label={d("Teacher").t("report_label_teacher")}
                  value={value.teacher_id}
                  select
                  disabled={teachers.length <= 0}
                  SelectProps={{ MenuProps: { transformOrigin: { vertical: -40, horizontal: "left" } } }}
                >
                  {getTeacherList(reportMockOptions.teacherList)}
                </TextField>
              )}
              <TextField
                size="small"
                className={css.selectButton}
                onChange={(e) => onChange(e.target.value, "class_id")}
                label={d("Class").t("report_label_class")}
                value={value.class_id}
                select
                SelectProps={{ MenuProps: { transformOrigin: { vertical: -40, horizontal: "left" } } }}
                disabled={classs.length <= 0}
              >
                {getClassList(reportMockOptions.classList)}
              </TextField>
            </Box>
          </Box>
        </Hidden>
      )}
      {(perm.view_reports_610 || perm.view_my_reports_614 || perm.view_my_school_reports_611 || perm.view_my_organization_reports_612) && (
        <Hidden mdUp>
          <Box display="flex">
            <Box flex={3}>
              {(perm.view_reports_610 || perm.view_my_school_reports_611 || perm.view_my_organization_reports_612) && (
                <PersonOutlinedIcon
                  fontSize="large"
                  className={clsx(css.selectIcon, teachers.length <= 0 && css.selectIconDisabled)}
                  onClick={(e) => showItem(e, "teacher_id")}
                />
              )}
              <Menu anchorEl={anchorElTeacher} keepMounted open={Boolean(anchorElTeacher)} onClose={(e) => handleClose(e, "teacher_id")}>
                <GetTeacherItem
                  list={reportMockOptions.teacherList}
                  value={value}
                  onChangeMenu={handleChangeMenu}
                  tab="teacher_id"
                ></GetTeacherItem>
              </Menu>

              <PeopleOutlineOutlinedIcon
                fontSize="large"
                className={clsx(css.selectIcon, classs.length <= 0 && css.selectIconDisabled)}
                onClick={(e) => showItem(e, "class_id")}
              />
              <Menu anchorEl={anchorElClass} keepMounted open={Boolean(anchorElClass)} onClose={(e) => handleClose(e, "class_id")}>
                <GetClassItem
                  list={reportMockOptions.classList}
                  value={value}
                  onChangeMenu={handleChangeMenu}
                  tab="class_id"
                ></GetClassItem>
              </Menu>
            </Box>
          </Box>
        </Hidden>
      )}
    </LayoutBox>
  );
}
