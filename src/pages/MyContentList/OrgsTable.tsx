import { OrganizationSortBy } from "@api/api-ko-schema.auto";
import { t } from "@locale/LocaleManager";
import { Box, Checkbox, makeStyles, SvgIcon, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@material-ui/core";
import React from "react";
import { ReactComponent as SortSvg } from "../../assets/icons/sort.svg";
import { ReactComponent as sortAsc } from "../../assets/icons/sortAsc.svg";
import { ReactComponent as sortDesc } from "../../assets/icons/sortDesc.svg";
import { CheckboxGroupContext } from "../../components/CheckboxGroup";
import { CursorType, OrgInfoProps } from "./OrganizationList";
const PAGESIZE = 10;
const useOrgStyles = makeStyles(() => ({
  tableHead: {
    backgroundColor: "#F2F5F7",
  },
  tableCell: {
    padding: 0,
    paddingLeft: 4,
  },
  tableName: {
    padding: 12,
    borderRight: "1px solid rgba(0, 0, 0, .12)",
  },
  tableEmail: {
    padding: 12,
    maxWidth: 330,
  },
}));
interface OrgsTableProps {
  list: OrgInfoProps[];
  selectedContentGroupContext: CheckboxGroupContext;
  onSortOrgList: (type: OrganizationSortBy) => any;
  handleChangeBeValues: (id: string, checked: boolean) => any;
  sortType: OrganizationSortBy;
  emailOrder: boolean;
  nameOrder: boolean;
}
export function OrgsTable(props: OrgsTableProps) {
  const { list, selectedContentGroupContext, onSortOrgList, handleChangeBeValues, sortType, nameOrder } = props;
  const css = useOrgStyles();
  const rows = list?.map((item, idx) => (
    <TableRow key={item.organization_id}>
      <TableCell className={css.tableCell}>
        {
          <Checkbox
            color="primary"
            value={item.organization_id}
            checked={selectedContentGroupContext.hashValue[item.organization_id] || false}
            onChange={(e, checked) => {
              selectedContentGroupContext.registerChange(e);
              handleChangeBeValues(item.organization_id, checked);
            }}
          />
        }
      </TableCell>
      <TableCell className={css.tableName}>{item.organization_name}</TableCell>
      {/* 2022/1/21 todo  */}
      {/* <TableCell align="center" className={css.tableEmail}>
        <Typography style={{ fontSize: 14 }} noWrap>
          {item.email}
        </Typography>
      </TableCell> */}
    </TableRow>
  ));

  return (
    <TableContainer style={{ maxHeight: 520, overflow: "auto" }}>
      <Table stickyHeader>
        <TableHead className={css.tableHead}>
          <TableRow>
            <TableCell align="center" style={{ width: 30 }}></TableCell>
            <TableCell align="center">
              <Box display="flex">
                <div style={{ display: "flex", cursor: "pointer" }} onClick={() => onSortOrgList(OrganizationSortBy.Name)}>
                  {t("library_label_organization")}
                  <SvgIcon
                    style={{ marginTop: 1 }}
                    component={sortType === OrganizationSortBy.OwnerEmail ? SortSvg : nameOrder ? sortAsc : sortDesc}
                  />
                </div>
              </Box>
            </TableCell>
            {/* 2022/1/21 todo  */}
            {/* <TableCell align="center">
              <Box display="flex" style={{ justifyContent: "center" }}>
                <div style={{ display: "flex", cursor: "pointer" }} onClick={() => onSortOrgList(OrganizationSortBy.OwnerEmail)}>
                  {t("library_label_org_owner_email")}
                  <SvgIcon
                    style={{ marginTop: 1 }}
                    component={sortType === OrganizationSortBy.Name ? SortSvg : emailOrder ? sortAsc : sortDesc}
                  />
                </div>
              </Box>
            </TableCell> */}
          </TableRow>
        </TableHead>
        <TableBody>{rows}</TableBody>
      </Table>
    </TableContainer>
  );
}

export const getDefaultValue = (orgList: OrgInfoProps[], beValues: string[]) => {
  let defaultValue: string[] = [];
  orgList.forEach((item) => {
    if (beValues.indexOf(item.organization_id) > -1) {
      defaultValue = defaultValue.concat([item.organization_id]);
    }
  });
  return defaultValue;
};
export const getPageDesc = (cursor: CursorType, total: number, pageDesc: string) => {
  if (total === 0) return "0";
  const [start, end] = pageDesc.split("-");
  switch (cursor) {
    case CursorType.start:
      return `1-${total > PAGESIZE ? PAGESIZE : total}`;
    case CursorType.end:
      return total % PAGESIZE > 0 ? `${total - (total % PAGESIZE) + 1} -${total}` : `${total - PAGESIZE + 1}-${total}`;
    case CursorType.prev:
      return `${Number(start) - PAGESIZE}-${Number(start) - 1}`;
    case CursorType.next:
      return `${Number(end) + 1}-${Number(end) + PAGESIZE < total ? Number(end) + PAGESIZE : total}`;
  }
};
