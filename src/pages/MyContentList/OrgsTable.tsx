import { OrganizationSortBy } from "@api/api-ko-schema.auto";
import { t } from "@locale/LocaleManager";
import {
  Box,
  Checkbox,
  makeStyles,
  SvgIcon,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@material-ui/core";
import clsx from "clsx";
import React, { ReactNode } from "react";
import { ReactComponent as SortSvg } from "../../assets/icons/sort.svg";
import { ReactComponent as sortAsc } from "../../assets/icons/sortAsc.svg";
import { ReactComponent as sortDesc } from "../../assets/icons/sortDesc.svg";
import { CheckboxGroupContext } from "../../components/CheckboxGroup";
import { CursorType, OrgInfoProps } from "./OrganizationList";
const useOrgStyles = makeStyles(() => ({
  tableHead: {
    backgroundColor: "#F2F5F7",
    "& .MuiTableCell-root": {
      padding: 0,
    },
  },
  tableCell: {
    padding: 0,
  },
  tableBorder: {
    padding: 10,
    borderRight: "1px solid rgba(0, 0, 0, .12)",
  },
  tableWidth: {
    maxWidth: 270,
    padding: 10,
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
  render: ReactNode;
}
export function OrgsTable(props: OrgsTableProps) {
  const { list, selectedContentGroupContext, onSortOrgList, handleChangeBeValues, sortType, nameOrder, emailOrder, render } = props;
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
      <TableCell style={{ width: 270 }} className={css.tableBorder}>
        <Typography style={{ fontSize: 14 }} noWrap>
          {item.organization_id}
        </Typography>
      </TableCell>
      <TableCell align="center" className={clsx(css.tableWidth, css.tableBorder)}>
        <Typography style={{ fontSize: 14 }} noWrap>
          {item.organization_name}
        </Typography>
      </TableCell>
      <TableCell align="center" className={clsx(css.tableWidth, css.tableCell)}>
        <Typography style={{ fontSize: 14 }} noWrap>
          {item.email}
        </Typography>
      </TableCell>
    </TableRow>
  ));

  return (
    <TableContainer style={{ minHeight: 470, overflow: "auto" }}>
      <Table stickyHeader>
        <TableHead className={css.tableHead}>
          <TableRow>
            <TableCell align="center" style={{ width: 30 }}>
              {" "}
              {render}
            </TableCell>
            <TableCell align="center">Organization ID</TableCell>
            <TableCell align="center">
              <Box display="flex" style={{ justifyContent: "center" }}>
                <div style={{ display: "flex", cursor: "pointer" }} onClick={() => onSortOrgList(OrganizationSortBy.Name)}>
                  {t("library_label_organization")}
                  <SvgIcon
                    style={{ marginTop: 1 }}
                    component={sortType === OrganizationSortBy.OwnerEmail ? SortSvg : nameOrder ? sortAsc : sortDesc}
                  />
                </div>
              </Box>
            </TableCell>
            <TableCell align="center">
              <Box display="flex" style={{ justifyContent: "center" }}>
                <div style={{ display: "flex", cursor: "pointer" }} onClick={() => onSortOrgList(OrganizationSortBy.OwnerEmail)}>
                  {t("library_label_org_owner_email")}
                  <SvgIcon
                    style={{ marginTop: 1 }}
                    component={sortType === OrganizationSortBy.Name ? SortSvg : emailOrder ? sortAsc : sortDesc}
                  />
                </div>
              </Box>
            </TableCell>
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
export const getPageDesc = (cursor: CursorType, pageSize: number, total: number, pageDesc: string) => {
  if (total === 0) return "0";
  const [start, end] = pageDesc.split("-");
  switch (cursor) {
    case CursorType.start:
      return `1-${total > pageSize ? pageSize : total}`;
    case CursorType.end:
      return total % pageSize > 0 ? `${total - (total % pageSize) + 1} -${total}` : `${total - pageSize + 1}-${total}`;
    case CursorType.prev:
      return `${Number(start) - pageSize}-${Number(start) - 1}`;
    case CursorType.next:
      return `${Number(end) + 1}-${Number(end) + pageSize < total ? Number(end) + pageSize : total}`;
  }
};
