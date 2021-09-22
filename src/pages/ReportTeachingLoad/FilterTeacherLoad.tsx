import { Box, Hidden, makeStyles, Menu, MenuItem, TextField } from "@material-ui/core";
import { SchoolOutlined } from "@material-ui/icons";
import PeopleOutlineOutlinedIcon from "@material-ui/icons/PeopleOutlineOutlined";
import PersonOutlinedIcon from "@material-ui/icons/PersonOutlined";
import clsx from "clsx";
import React, { forwardRef } from "react";
import LayoutBox from "../../components/LayoutBox";
import { PermissionType, usePermission } from "../../components/Permission";
import { d } from "../../locale/LocaleManager";
import { Iitem, TeachingLoadPayload, TeachingLoadResponse } from "../../reducers/report";

const useStyles = makeStyles(({ palette, shadows, breakpoints }) => ({
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
function isClassDisabled(props: { perm: Record<PermissionType, Boolean | undefined>; value: TeachingLoadPayload; teacher_ids: string[] }) {
  const { perm, value, teacher_ids } = props;
  if (perm.view_my_reports_614 && !perm.view_reports_610 && !perm.view_my_school_reports_611 && !perm.view_my_organizations_reports_612) {
    return false;
  } else {
    return value?.teacher_ids === "all" || teacher_ids.length > 1;
  }
}
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
  if (perm.view_reports_610 || perm.view_my_reports_614 || perm.view_my_organizations_reports_612) {
    schools.push({ value: "no_assigned", label: "No assigned" });
  }
  const {classList:classs,teacherList:teachers} = teachingLoadOnload
  const class_ids = value?.class_ids?.split(",");
  const teacher_ids = value?.teacher_ids?.split(",");
  const classIsDisabled = isClassDisabled({ perm, value, teacher_ids });

  const [anchorElSchool, setAnchorElSchool] = React.useState<null | HTMLElement>(null);
  const [anchorElTeacher, setAnchorElTeacher] = React.useState<null | HTMLElement>(null);
  const [anchorElClass, setAnchorElClass] = React.useState<null | HTMLElement>(null);

  const showItem = (event: any, tab: keyof TeachingLoadPayload) => {
    if (tab === "teacher_ids") setAnchorElTeacher(event.currentTarget);
    if (tab === "class_ids" && !classIsDisabled) setAnchorElClass(event.currentTarget);
    if (tab === "school_id") setAnchorElSchool(event.currentTarget);
  };
  const handleClose = (e: any, tab: keyof TeachingLoadPayload) => {
    if (tab === "teacher_ids") setAnchorElTeacher(null);
    if (tab === "class_ids") setAnchorElClass(null);
    if (tab === "school_id") setAnchorElSchool(null);
  };
  const handleChangeMenu = (e: React.MouseEvent, value: any, tab: keyof TeachingLoadPayload) => {
    switch (tab) {
      case "school_id": {
        handleClose(e, tab);
        onChange(value, tab);
        break;
      }
      case "teacher_ids": {
        let newValue: string[] = [];
        if (teacher_ids.indexOf(value) < 0) {
          newValue = teacher_ids.concat([value]);
        } else {
          newValue = teacher_ids.filter((id) => id !== value);
        }
        onChange((newValue as any) as string, tab);
        break;
      }
      case "class_ids": {
        let newValue: string[] = [];
        if (class_ids.indexOf(value) < 0) {
          newValue = class_ids.concat([value]);
        } else {
          newValue = class_ids.filter((id) => id !== value);
        }
        onChange((newValue as any) as string, tab);
        break;
      }
    }
  };

  return (
    <LayoutBox holderMin={40} holderBase={202} mainBase={1517}>
      {(perm.view_reports_610 || perm.view_my_reports_614 || perm.view_my_school_reports_611 || perm.view_my_organizations_reports_612) && (
        <Hidden smDown>
          <Box position="relative">
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
              {getList(schools)}
            </TextField>
            {(perm.view_reports_610 || perm.view_my_school_reports_611 || perm.view_my_organizations_reports_612) && (
              <TextField
                size="small"
                className={css.selectButton}
                onChange={(e) => onChange(e.target.value, "teacher_ids")}
                label={d("Teacher").t("report_label_teacher")}
                value={teacher_ids}
                select
                SelectProps={{ multiple: true, MenuProps: { transformOrigin: { vertical: -40, horizontal: "left" } } }}
              >
                {getList(teachers)}
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
              disabled={classIsDisabled}
            >
              {getList(classs)}
            </TextField>
          </Box>
        </Hidden>
      )}
      {(perm.view_reports_610 || perm.view_my_reports_614 || perm.view_my_school_reports_611 || perm.view_my_organizations_reports_612) && (
        <Hidden mdUp>
          <Box display="flex">
            <Box flex={3}>
              <SchoolOutlined fontSize="large" className={css.selectIcon} onClick={(e) => showItem(e, "school_id")} />
              <Menu anchorEl={anchorElSchool} keepMounted open={Boolean(anchorElSchool)} onClose={(e) => handleClose(e, "school_id")}>
                <GetListItem list={schools} value={value} onChangeMenu={handleChangeMenu} tab="school_id"></GetListItem>
              </Menu>
              {(perm.view_reports_610 || perm.view_my_school_reports_611 || perm.view_my_organizations_reports_612) && (
                <PersonOutlinedIcon fontSize="large" className={css.selectIcon} onClick={(e) => showItem(e, "teacher_ids")} />
              )}
              <Menu anchorEl={anchorElTeacher} keepMounted open={Boolean(anchorElTeacher)} onClose={(e) => handleClose(e, "teacher_ids")}>
                <GetListItem list={teachers} value={value} onChangeMenu={handleChangeMenu} tab="teacher_ids"></GetListItem>
              </Menu>

              <PeopleOutlineOutlinedIcon
                fontSize="large"
                className={clsx(css.selectIcon, { [css.selectIconDisabled]: value?.teacher_ids === "all" || teacher_ids.length > 1 })}
                onClick={(e) => showItem(e, "class_ids")}
              />
              <Menu anchorEl={anchorElClass} keepMounted open={Boolean(anchorElClass)} onClose={(e) => handleClose(e, "class_ids")}>
                <GetListItem list={classs} value={value} onChangeMenu={handleChangeMenu} tab="class_ids"></GetListItem>
              </Menu>
            </Box>
          </Box>
        </Hidden>
      )}
    </LayoutBox>
  );
}
const getList = (list?: Iitem[]) => {
  return list?.map((item) => (
    <MenuItem key={item.value} value={item.value}>
      {item.label || "null"}
    </MenuItem>
  ));
};


interface GetListItemProps {
  list?: Iitem[];
  value: TeachingLoadPayload;
  onChangeMenu: (e: React.MouseEvent, value: string, tab: keyof TeachingLoadPayload) => any;
  tab: keyof TeachingLoadPayload;
}

const GetListItem = forwardRef<React.RefObject<HTMLElement>, GetListItemProps>((props, ref) => {
  const { list, value, onChangeMenu, tab } = props;
  return (
    <>
      {" "}
      {list?.map((item) => (
        <MenuItem
          key={item.value}
          selected={value[tab] === item.value}
          onClick={(e) => onChangeMenu(e, item.value as string, tab)}
        >
          {item.label ?? "null"}
        </MenuItem>
      ))}
    </>
  );
});
