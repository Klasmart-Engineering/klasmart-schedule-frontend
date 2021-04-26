import { Box, Hidden, makeStyles, Menu, MenuItem, TextField } from "@material-ui/core";
import PeopleOutlineOutlinedIcon from "@material-ui/icons/PeopleOutlineOutlined";
import PersonOutlinedIcon from "@material-ui/icons/PersonOutlined";
import clsx from "clsx";
import React, { forwardRef } from "react";
import { Class, School, User } from "../../api/api-ko-schema.auto";
import LayoutBox from "../../components/LayoutBox";
import { PermissionType, usePermission } from "../../components/Permission";
import { d } from "../../locale/LocaleManager";
import { TeachingLoadPayload, TeachingLoadResponse } from "../../reducers/report";

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

interface GetSchoolItemProps {
  list?: Pick<School, "school_id" | "school_name">[];
  value: TeachingLoadPayload;
  onChangeMenu: (e: React.MouseEvent, value: string, tab: keyof TeachingLoadPayload) => any;
  tab: keyof TeachingLoadPayload;
}

const GetSchoolItem = forwardRef<React.RefObject<HTMLElement>, GetSchoolItemProps>((props, ref) => {
  const { list, value, onChangeMenu, tab } = props;
  return (
    <>
      {" "}
      {list?.map((item) => (
        <MenuItem
          key={item.school_id}
          selected={value[tab] === item.school_id}
          onClick={(e) => onChangeMenu(e, item.school_id as string, tab)}
        >
          {item.school_name}
        </MenuItem>
      ))}
    </>
  );
});
interface GetTeacherItemProps {
  list?: Pick<User, "user_id" | "user_name">[];
  value: TeachingLoadPayload;
  onChangeMenu: (e: React.MouseEvent, value: string, tab: keyof TeachingLoadPayload) => any;
  tab: keyof TeachingLoadPayload;
}

const GetTeacherItem = forwardRef<React.RefObject<HTMLElement>, GetTeacherItemProps>((props, ref) => {
  const { list, value, onChangeMenu, tab } = props;
  return (
    <>
      {" "}
      {list?.map((item) => (
        <MenuItem key={item.user_id} selected={value[tab] === item.user_id} onClick={(e) => onChangeMenu(e, item.user_id as string, tab)}>
          {item.user_name}
        </MenuItem>
      ))}
    </>
  );
});

interface GetClassItemProps {
  list?: Pick<Class, "class_id" | "class_name">[];
  value: TeachingLoadPayload;
  onChangeMenu: (e: React.MouseEvent, value: string, tab: keyof TeachingLoadPayload) => any;
  tab: keyof TeachingLoadPayload;
}

const GetClassItem = forwardRef<React.RefObject<HTMLElement>, GetClassItemProps>((props, ref) => {
  const { list, value, onChangeMenu, tab } = props;
  return (
    <>
      {" "}
      {list?.map((item) => (
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
  value: TeachingLoadPayload;
  onChange: (value: string, tab: keyof TeachingLoadPayload) => any;
  teachingLoadOnload: TeachingLoadResponse;
}
export function FilterTeacherLoad(props: FilterTeacherLoadProps) {
  const { onChange, value, teachingLoadOnload } = props;
  const css = useStyles();
  const perm = usePermission([
    PermissionType.view_reports_610,
    PermissionType.view_my_reports_614,
    PermissionType.view_my_organizations_reports_612,
    PermissionType.view_my_school_reports_611,
  ]);
  const schools = teachingLoadOnload.schoolList?.slice(0) || [];
  schools.push({ school_id: "no_assigned", school_name: "No assigned" });
  schools.unshift({ school_id: "all", school_name: "All" });
  const classs = teachingLoadOnload.classList?.slice(0) || [];
  classs.unshift({ class_id: "all", class_name: "All" });
  const teachers = teachingLoadOnload.teacherList?.slice(0) || [];
  teachers.unshift({ user_id: "all", user_name: "All" });
  const class_ids = value?.class_ids?.split(",");
  const teacher_ids = value?.teacher_ids?.split(",");

  const [anchorElSchool, setAnchorElSchool] = React.useState<null | HTMLElement>(null);
  const [anchorElTeacher, setAnchorElTeacher] = React.useState<null | HTMLElement>(null);
  const [anchorElClass, setAnchorElClass] = React.useState<null | HTMLElement>(null);

  const showItem = (event: any, tab: keyof TeachingLoadPayload) => {
    if (tab === "teacher_ids" && teachers.length > 0) setAnchorElTeacher(event.currentTarget);
    if (tab === "class_ids" && classs.length > 0) setAnchorElClass(event.currentTarget);
    if (tab === "school_id" && schools.length > 0) setAnchorElSchool(event.currentTarget);
  };
  const handleClose = (e: any, tab: keyof TeachingLoadPayload) => {
    if (tab === "teacher_ids") setAnchorElTeacher(null);
    if (tab === "class_ids") setAnchorElClass(null);
    if (tab === "school_id") setAnchorElSchool(null);
  };
  const handleChangeMenu = (e: React.MouseEvent, value: any, tab: keyof TeachingLoadPayload) => {
    handleClose(e, tab);
    onChange(value, tab);
  };

  const getSchoolList = (list: Pick<School, "school_id" | "school_name">[] | undefined | null) => {
    if (list === null || list === undefined) return;

    return list.map((item) => (
      <MenuItem key={item.school_id} value={item.school_id}>
        {item.school_name}
      </MenuItem>
    ));
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
              <TextField
                size="small"
                className={css.selectButton}
                onChange={(e) => onChange(e.target.value, "school_id")}
                label={"School"}
                value={value.school_id}
                select
                disabled={schools.length <= 0}
                SelectProps={{ MenuProps: { transformOrigin: { vertical: -40, horizontal: "left" } } }}
              >
                {getSchoolList(schools)}
              </TextField>
              {(perm.view_reports_610 || perm.view_my_school_reports_611 || perm.view_my_organization_reports_612) && (
                <TextField
                  size="small"
                  className={css.selectButton}
                  onChange={(e) => onChange(e.target.value, "teacher_ids")}
                  label={d("Teacher").t("report_label_teacher")}
                  value={teacher_ids}
                  select
                  disabled={teachers.length <= 0}
                  SelectProps={{ multiple: true, MenuProps: { transformOrigin: { vertical: -40, horizontal: "left" } } }}
                >
                  {getTeacherList(teachers)}
                </TextField>
              )}
              <TextField
                size="small"
                className={css.selectButton}
                onChange={(e) => onChange(e.target.value, "class_ids")}
                label={d("Class").t("report_label_class")}
                value={class_ids}
                select
                SelectProps={{ multiple: true, MenuProps: { transformOrigin: { vertical: -40, horizontal: "left" } } }}
                disabled={classs.length <= 0}
              >
                {getClassList(classs)}
              </TextField>
            </Box>
          </Box>
        </Hidden>
      )}
      {(perm.view_reports_610 || perm.view_my_reports_614 || perm.view_my_school_reports_611 || perm.view_my_organization_reports_612) && (
        <Hidden mdUp>
          <Box display="flex">
            <Box flex={3}>
              <PeopleOutlineOutlinedIcon
                fontSize="large"
                className={clsx(css.selectIcon, schools.length <= 0 && css.selectIconDisabled)}
                onClick={(e) => showItem(e, "school_id")}
              />
              <Menu anchorEl={anchorElSchool} keepMounted open={Boolean(anchorElSchool)} onClose={(e) => handleClose(e, "school_id")}>
                <GetSchoolItem list={schools} value={value} onChangeMenu={handleChangeMenu} tab="school_id"></GetSchoolItem>
              </Menu>
              {(perm.view_reports_610 || perm.view_my_school_reports_611 || perm.view_my_organization_reports_612) && (
                <PersonOutlinedIcon
                  fontSize="large"
                  className={clsx(css.selectIcon, teachers.length <= 0 && css.selectIconDisabled)}
                  onClick={(e) => showItem(e, "teacher_ids")}
                />
              )}
              <Menu anchorEl={anchorElTeacher} keepMounted open={Boolean(anchorElTeacher)} onClose={(e) => handleClose(e, "teacher_ids")}>
                <GetTeacherItem list={teachers} value={value} onChangeMenu={handleChangeMenu} tab="teacher_ids"></GetTeacherItem>
              </Menu>

              <PeopleOutlineOutlinedIcon
                fontSize="large"
                className={clsx(css.selectIcon, classs.length <= 0 && css.selectIconDisabled)}
                onClick={(e) => showItem(e, "class_ids")}
              />
              <Menu anchorEl={anchorElClass} keepMounted open={Boolean(anchorElClass)} onClose={(e) => handleClose(e, "class_ids")}>
                <GetClassItem list={classs} value={value} onChangeMenu={handleChangeMenu} tab="class_ids"></GetClassItem>
              </Menu>
            </Box>
          </Box>
        </Hidden>
      )}
    </LayoutBox>
  );
}
