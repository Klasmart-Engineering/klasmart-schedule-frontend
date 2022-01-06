import { ConnectionDirection, OrganizationSortBy, OrganizationSortInput, SortOrder } from "@api/api-ko-schema.auto";
import { GetOrganizationsQueryVariables } from "@api/api-ko.auto";
import CursorPagination from "@components/CursorPagination/CursorPagination";
import { FormattedTextField, frontTrim } from "@components/FormattedTextField";
import { resultsTip } from "@components/TipImages";
import {
  Button,
  Checkbox,
  createStyles,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  makeStyles,
  Radio,
  RadioGroup,
  TextFieldProps,
  Theme,
  Tooltip,
  withStyles,
} from "@material-ui/core";
import { InfoOutlined } from "@material-ui/icons";
import ArrowForwardIosIcon from "@material-ui/icons/ArrowForwardIos";
import { getOrgList, Region } from "@reducers/content";
import { RootState } from "@reducers/index";
import { AsyncTrunkReturned } from "@reducers/type";
import { PayloadAction } from "@reduxjs/toolkit";
import { cloneDeep, uniq } from "lodash";
import React, { useMemo, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { EntityFolderContentData } from "../../api/api.auto";
import { CheckboxGroup } from "../../components/CheckboxGroup";
import { LButton, LButtonProps } from "../../components/LButton";
import { d } from "../../locale/LocaleManager";
import { getDefaultValue, getPageDesc, OrgsTable } from "./OrgsTable";

export interface OrgInfoProps {
  organization_id: string;
  organization_name?: string;
  email?: string;
}

const LightTooltip = withStyles((theme: Theme) => ({
  tooltip: {
    backgroundColor: theme.palette.common.white,
    color: "rgba(0, 0, 0, 0.87)",
    boxShadow: theme.shadows[1],
    fontSize: 12,
  },
}))(Tooltip);

const useStyles = makeStyles(() =>
  createStyles({
    okBtn: {
      marginLeft: "40px !important",
    },
    dialogContent: {
      padding: 0,
      paddingLeft: 30,
    },
    tooltipIcon: {
      color: "#666",
      verticalAlign: "middle",
      marginLeft: "5px",
    },
    searchButon: {
      marginLeft: 10,
    },
    searchBar: {
      display: "flex",
      margin: " 0px 16px 10px",
    },
    content: {
      borderLeft: "1px solid rgb(0,0,0,.12)",
      paddingTop: 10,
    },
  })
);
const SELECTED_ORG = "SELECTED_ORG";
export enum ShareScope {
  share_all = "{share_all}",
  share_to_org = "share_to_org",
}
export enum CursorType {
  start = "start",
  prev = "prev",
  next = "next",
  end = "end",
}
export type CursorListProps = Pick<GetOrganizationsQueryVariables, "direction" | "cursor"> & {
  curentPageCursor?: CursorType;
  sort?: OrganizationSortInput;
};

export interface OrganizationListProps {
  open: boolean;
  orgList: OrgInfoProps[];
  onClose: () => any;
  onShareFolder: (ids: string[]) => ReturnType<LButtonProps["onClick"]>; //ReturnType<LButtonProps["onClick"]>
  selectedOrg: string[];
}
const PAGESIZE = 10;
export function OrganizationList(props: OrganizationListProps) {
  const css = useStyles();
  const { open, orgList, selectedOrg, onClose, onShareFolder } = props;
  const { orgListPageInfo, orgListTotal, orgProperty } = useSelector<RootState, RootState["content"]>((state) => state.content);
  const { control, watch, getValues, reset } = useForm();
  const dispatch = useDispatch();
  const allValue = useMemo(() => orgList?.map((org) => org.organization_id), [orgList]);
  const [radioValue, setRadioValue] = useState<string>(
    selectedOrg[0] === ShareScope.share_all ? ShareScope.share_all : ShareScope.share_to_org
  );
  const [newSelectedOrgIds, setNewSelectedOrgIds] = useState(true);
  const [beValues, setBeValues] = useState(selectedOrg[0] === ShareScope.share_all ? [] : selectedOrg);
  const [pageDesc, setPageDesc] = useState(`1-${orgListTotal > PAGESIZE ? PAGESIZE : orgListTotal}`);
  const [nameOrder, setNameOrder] = useState(false);
  const [emailOrder, setEmailOrder] = useState(false);
  const [sortType, setSortType] = useState<OrganizationSortBy>(OrganizationSortBy.Name);
  const searchValue = watch()["searchValue"] || "";
  useMemo(() => {
    const radioNewValue =
      selectedOrg && selectedOrg.length > 0
        ? selectedOrg[0] === ShareScope.share_all
          ? ShareScope.share_all
          : ShareScope.share_to_org
        : "";
    setRadioValue(radioNewValue);
  }, [selectedOrg]);

  let selectedOrgIds = useMemo(() => {
    const ids = radioValue ? (radioValue === ShareScope.share_all ? [ShareScope.share_all] : beValues || selectedOrg) : [];
    return ids;
  }, [radioValue, selectedOrg, beValues]);
  const handleChange = (value: string) => {
    setRadioValue(value);
    setNewSelectedOrgIds(false);
  };

  const searchOrgList = async ({ direction, cursor = "", curentPageCursor = CursorType.start, sort }: CursorListProps) => {
    const initSort: OrganizationSortInput = {
      field: [OrganizationSortBy.Name],
      order: SortOrder.Asc,
    };
    const { payload } = (await dispatch(
      getOrgList({ metaLoading: true, cursor, direction, sort: sort || initSort, searchValue, count: 10 })
    )) as unknown as PayloadAction<AsyncTrunkReturned<typeof getOrgList>>;
    if (!payload) return;
    setPageDesc(getPageDesc(curentPageCursor, payload.orgListTotal, pageDesc));
    reset({ ...getValues(), SELECTED_ORG: getDefaultValue(payload.orgs as OrgInfoProps[], beValues) });
  };
  const handleKeyPress: TextFieldProps["onKeyPress"] = (event) => {
    if (event.key === "Enter") searchOrgList({ direction: ConnectionDirection.Forward });
  };
  const sortOrgList = (type: OrganizationSortBy) => {
    const sort: OrganizationSortInput = {
      field: [type],
      order: type === OrganizationSortBy.Name ? (nameOrder ? SortOrder.Asc : SortOrder.Desc) : emailOrder ? SortOrder.Asc : SortOrder.Desc,
    };
    searchOrgList({ direction: ConnectionDirection.Forward, sort });
    setSortType(type);
    type === OrganizationSortBy.Name ? setNameOrder(!nameOrder) : setEmailOrder(!emailOrder);
  };
  const handleChangePage = (props: CursorListProps) => {
    const sort: OrganizationSortInput = {
      field: [sortType],
      order:
        sortType === OrganizationSortBy.Name ? (!nameOrder ? SortOrder.Asc : SortOrder.Desc) : !emailOrder ? SortOrder.Asc : SortOrder.Desc,
    };
    searchOrgList({ ...props, sort });
  };
  const handleChangeBeValues = (id: string, checked: boolean) => {
    if (checked) {
      if (id && beValues) {
        setBeValues?.(uniq(beValues.concat([id])));
      }
    } else {
      if (id && beValues) {
        let newValue = cloneDeep(beValues);
        newValue = newValue.filter((v) => v !== id);
        setBeValues?.(uniq(newValue));
      }
    }
  };
  const handleChangeAllBeValues = (checked: boolean) => {
    if (checked) {
      if (beValues) {
        setBeValues?.(uniq(beValues.concat(allValue)));
      }
    } else {
      if (beValues) {
        let newValue = cloneDeep(beValues);
        allValue.forEach((id) => {
          newValue = newValue.filter((v) => v !== id);
        });
        setBeValues?.(uniq(newValue));
      }
    }
  };
  return (
    <Dialog open={open} maxWidth={radioValue === ShareScope.share_to_org ? "md" : "sm"} fullWidth>
      <DialogTitle>{d("Distribute").t("library_label_distribute")}</DialogTitle>
      <DialogContent className={css.dialogContent} dividers>
        <div style={{ display: "flex" }}>
          <RadioGroup style={{ minWidth: 250, marginTop: 30 }} value={radioValue} onChange={(e) => handleChange(e.target.value)}>
            <FormControlLabel
              value={ShareScope.share_all}
              control={<Radio />}
              label={
                <>
                  <span>{d("Preset").t("library_label_preset")}</span>{" "}
                  <LightTooltip
                    placement="right"
                    title={d("Choosing this option will make the selected content available to current and future organizations.").t(
                      "library_msg_preset"
                    )}
                  >
                    <InfoOutlined className={css.tooltipIcon} />
                  </LightTooltip>
                </>
              }
            />
            <FormControlLabel
              value={ShareScope.share_to_org}
              control={<Radio />}
              label={
                <>
                  <span>{d("Select Organizations").t("library_label_select_organizations")}</span>{" "}
                  <ArrowForwardIosIcon fontSize="small" className={css.tooltipIcon} />
                </>
              }
            />
          </RadioGroup>
          {radioValue && radioValue !== ShareScope.share_all && (
            <div style={{ flex: 1 }}>
              <Controller
                name={SELECTED_ORG}
                control={control}
                defaultValue={newSelectedOrgIds ? getDefaultValue(orgList, beValues) : []}
                rules={{ required: true }}
                render={({ ref, ...props }) => (
                  <CheckboxGroup
                    allValue={allValue}
                    {...props}
                    render={(selectedContentGroupContext) => (
                      <div {...{ ref }} className={css.content}>
                        <div className={css.searchBar}>
                          <Controller
                            as={FormattedTextField}
                            control={control}
                            name="searchValue"
                            size="small"
                            encode={frontTrim}
                            decode={frontTrim}
                            defaultValue={""}
                            fullWidth
                            onKeyPress={handleKeyPress}
                            placeholder={d("Search").t("library_label_search")}
                          />
                          <Button
                            className={css.searchButon}
                            variant="contained"
                            color="primary"
                            onClick={() => searchOrgList({ direction: ConnectionDirection.Forward })}
                          >
                            {d("Search").t("library_label_search")}{" "}
                          </Button>
                        </div>

                        <div style={{ minHeight: 520 }}>
                          {orgList?.length > 0 ? (
                            <OrgsTable
                              sortOrgList={sortOrgList}
                              handleChangeBeValues={handleChangeBeValues}
                              list={orgList}
                              selectedContentGroupContext={selectedContentGroupContext}
                            />
                          ) : (
                            resultsTip
                          )}
                        </div>

                        <div style={{ display: "flex", justifyContent: "space-between" }}>
                          <FormControlLabel
                            control={
                              <Checkbox
                                color="primary"
                                checked={selectedContentGroupContext.isAllvalue}
                                onChange={(e, checked) => {
                                  selectedContentGroupContext.registerAllChange(e);
                                  handleChangeAllBeValues(checked);
                                }}
                              />
                            }
                            style={{ marginLeft: 4 }}
                            label={d("All").t("library_label_all_organizations")}
                          />
                          {orgProperty.region === Region.global && (
                            <CursorPagination
                              pageDesc={pageDesc}
                              total={orgListTotal}
                              pageInfo={orgListPageInfo}
                              onChange={handleChangePage}
                            />
                          )}
                        </div>
                      </div>
                    )}
                  />
                )}
              />
            </div>
          )}
        </div>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} disableRipple={true} color="primary" variant="outlined">
          {d("CANCEL").t("general_button_CANCEL")}
        </Button>
        <LButton color="primary" variant="contained" className={css.okBtn} onClick={() => onShareFolder(selectedOrgIds)}>
          {d("OK").t("general_button_OK")}
        </LButton>
      </DialogActions>
    </Dialog>
  );
}

export function useOrganizationList() {
  const [active, setActive] = useState(false);
  const [organizationListShowIndex, setOrganizationListShowInex] = useState(100);
  const [shareFolder, setShareFolder] = useState<EntityFolderContentData>();
  return useMemo(
    () => ({
      organizationListShowIndex,
      organizationListActive: active,
      openOrganizationList: () => {
        setOrganizationListShowInex(organizationListShowIndex + 1);
        setActive(true);
      },
      closeOrganizationList: () => {
        setActive(false);
      },
      shareFolder,
      setShareFolder,
    }),
    [active, setActive, shareFolder, setShareFolder, organizationListShowIndex]
  );
}
