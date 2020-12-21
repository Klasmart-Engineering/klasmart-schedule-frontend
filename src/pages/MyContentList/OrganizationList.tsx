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
  Theme,
  Tooltip,
  withStyles,
} from "@material-ui/core";
import { InfoOutlined } from "@material-ui/icons";
import React, { useMemo, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { EntityFolderContent } from "../../api/api.auto";
import { CheckboxGroup } from "../../components/CheckboxGroup";
import { LButton } from "../../components/LButton";
import { d, reportMiss } from "../../locale/LocaleManager";

export interface OrgInfoProps {
  organization_id: string;
  organization_name: string;
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
      maxHeight: 280,
      // inWidth: 300
    },
    tooltipIcon: {
      color: "#666",
      verticalAlign: "middle",
      marginLeft: "5px",
    },
  })
);
const SELECTED_ORG = "SELECTED_ORG";
export enum ShareScope {
  share_all = "share_all",
  share_to_org = "share_to_org",
}
export interface OrganizationListProps {
  open: boolean;
  orgList: OrgInfoProps[];
  onClose: () => any;
  onShareFolder: (ids: string[]) => any; //ReturnType<LButtonProps["onClick"]>
  selectedOrg: string[];
}

export function OrganizationList(props: OrganizationListProps) {
  const css = useStyles();
  const { open, orgList, onClose, onShareFolder, selectedOrg } = props;
  const { control, watch } = useForm();
  const values = watch()[SELECTED_ORG];
  const allValue = useMemo(() => orgList.map((org) => org.organization_id), [orgList]);
  const [radioValue, setRadioValue] = useState(
    selectedOrg && selectedOrg.length > 0 ? (selectedOrg[0] === ShareScope.share_all ? ShareScope.share_all : ShareScope.share_to_org) : ""
  );
  const [newSelectedOrgIds, setNewSelectedOrgIds] = useState<string[]>(["default"]);
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
    const ids = radioValue ? (radioValue === ShareScope.share_all ? [ShareScope.share_all] : values || selectedOrg) : [];
    return ids;
  }, [radioValue, selectedOrg, values]);
  const handleChange = (value: string) => {
    setRadioValue(value);
    setNewSelectedOrgIds([]);
  };
  return (
    <Dialog open={open}>
      <DialogTitle id="confirmation-dialog-title">{reportMiss("Distribute with", "library_label_distribute_with")}</DialogTitle>
      <DialogContent className={css.dialogContent} dividers>
        <RadioGroup value={radioValue} onChange={(e) => handleChange(e.target.value)}>
          <FormControlLabel
            value={ShareScope.share_all}
            control={<Radio />}
            label={
              <>
                <span>{reportMiss("Preset", "library_label_share_preset")}</span>{" "}
                <LightTooltip placement="right" title={"test tetwewtewewrewrewrewrwe"}>
                  <InfoOutlined className={css.tooltipIcon} />
                </LightTooltip>
              </>
            }
          />
          <FormControlLabel
            value={ShareScope.share_to_org}
            control={<Radio />}
            label={reportMiss("Select by Organization", "library_label_select_organization")}
          />
        </RadioGroup>
        {radioValue && radioValue !== ShareScope.share_all && (
          <Controller
            name={SELECTED_ORG}
            control={control}
            defaultValue={newSelectedOrgIds.length ? selectedOrg : newSelectedOrgIds}
            rules={{ required: true }}
            error={"Please Select"}
            render={({ ref, ...props }) => (
              <CheckboxGroup
                allValue={allValue}
                {...props}
                render={(selectedContentGroupContext) => (
                  <div {...{ ref }} style={{ marginLeft: 30 }}>
                    <FormControlLabel
                      style={{ display: "block" }}
                      control={
                        <Checkbox
                          color="primary"
                          checked={selectedContentGroupContext.isAllvalue}
                          onChange={selectedContentGroupContext.registerAllChange}
                        />
                      }
                      label={reportMiss("All Organizations", "library_label_all_organization")}
                    />
                    {orgList?.map((item) => (
                      <FormControlLabel
                        style={{ display: "block" }}
                        control={
                          <Checkbox
                            color="primary"
                            value={item.organization_id}
                            checked={selectedContentGroupContext.hashValue[item.organization_id] || false}
                            onChange={selectedContentGroupContext.registerChange}
                          />
                        }
                        label={item.organization_name}
                        key={item.organization_id}
                      />
                    ))}
                  </div>
                )}
              />
            )}
          />
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary" variant="outlined">
          {d("Cancel").t("library_label_cancel")}
        </Button>
        <LButton
          color="primary"
          variant="contained"
          className={css.okBtn}
          onClick={() => onShareFolder(selectedOrgIds)}
          disabled={!selectedOrgIds.length}
        >
          {d("OK").t("library_label_ok")}
        </LButton>
      </DialogActions>
    </Dialog>
  );
}

export function useOrganizationList<T>() {
  const [active, setActive] = useState(false);
  const [organizationListShowIndex, setOrganizationListShowInex] = useState(100);
  const [shareFolder, setShareFolder] = useState<EntityFolderContent>();
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
