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
} from "@material-ui/core";
import React, { useMemo } from "react";
import { Controller, useForm } from "react-hook-form";
import { CheckboxGroup } from "../../components/CheckboxGroup";
import { LButton, LButtonProps } from "../../components/LButton";
import { d } from "../../locale/LocaleManager";
import { OrgInfoProps, ShareScope } from "./OrganizationList";

const useStyles = makeStyles(() =>
  createStyles({
    okBtn: {
      marginLeft: "40px !important",
    },
    dialogContent: {
      maxHeight: 280,
    },
  })
);
const SELECTED_ORG = "SELECTED_ORG";
export interface SpecialOrgListProps {
  open: boolean;
  orgList: OrgInfoProps[];
  onClose: () => any;
  onShareFolder: (ids: string[]) => ReturnType<LButtonProps["onClick"]>;
  selectedOrg: string[];
}

export function SpecialOrgList(props: SpecialOrgListProps) {
  const css = useStyles();
  const { open, orgList, onClose, onShareFolder, selectedOrg } = props;
  const { control, watch } = useForm();
  const values = watch()[SELECTED_ORG];
  const allValue = useMemo(() => orgList.map((org) => org.organization_id), [orgList]);
  return (
    <Dialog open={open}>
      <DialogTitle>{d("Distribute").t("library_label_distribute")}</DialogTitle>
      <DialogContent className={css.dialogContent} dividers>
        <RadioGroup value={ShareScope.share_to_org}>
          <FormControlLabel
            value={ShareScope.share_to_org}
            control={<Radio />}
            label={d("Select Organizations").t("library_label_select_organizations")}
          />
        </RadioGroup>
        <Controller
          name={SELECTED_ORG}
          control={control}
          defaultValue={selectedOrg}
          rules={{ required: true }}
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
                    label={d("All").t("library_label_all_organizations")}
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
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} disableRipple={true} color="primary" variant="outlined">
          {d("CANCEL").t("general_button_CANCEL")}
        </Button>
        <LButton color="primary" variant="contained" className={css.okBtn} onClick={() => onShareFolder(values || selectedOrg)}>
          {d("OK").t("general_button_OK")}
        </LButton>
      </DialogActions>
    </Dialog>
  );
}
