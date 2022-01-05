import { OrganizationSortBy } from "@api/api-ko-schema.auto";
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
import React from "react";
import { ReactComponent as SortSvg } from "../../assets/icons/Slice 1.svg";
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
}));
interface OrgsTableProps {
  list: OrgInfoProps[];
  selectedContentGroupContext: CheckboxGroupContext;
  sortOrgList: (type: OrganizationSortBy) => any;
  handleChangeBeValues: (id: string, checked: boolean) => any;
}
export function OrgsTable(props: OrgsTableProps) {
  const { list, selectedContentGroupContext, sortOrgList, handleChangeBeValues } = props;
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
      <TableCell style={{ borderRight: "1px solid rgba(0, 0, 0, .12)" }}>{item.organization_name}</TableCell>
      <TableCell align="center" style={{ maxWidth: 330 }}>
        <Typography style={{ fontSize: 14 }} noWrap>
          {item.email}
        </Typography>
      </TableCell>
    </TableRow>
  ));

  return (
    <TableContainer style={{ maxHeight: 597, overflow: "auto" }}>
      <Table stickyHeader>
        <TableHead className={css.tableHead}>
          <TableRow>
            <TableCell align="center" style={{ width: 30 }}></TableCell>
            <TableCell align="center">
              <Box display="flex">
                {"Organization"}
                <SvgIcon component={SortSvg} onClick={() => sortOrgList(OrganizationSortBy.Name)} cursor="pointer" />
              </Box>
            </TableCell>
            <TableCell align="center">
              <Box display="flex" style={{ justifyContent: "center" }}>
                {"Org Owner Email"}
                <SvgIcon component={SortSvg} onClick={() => sortOrgList(OrganizationSortBy.OwnerEmail)} cursor="pointer" />
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
export const getPageDesc = (cursor: CursorType, total: number, pageDesc: string) => {
  if (total === 0) return "0";
  const [start, end] = pageDesc.split("-");
  switch (cursor) {
    case CursorType.start:
      return `1-${total > PAGESIZE ? PAGESIZE : total}`;
    case CursorType.end:
      return total % PAGESIZE > 0 ? `${total - (total % PAGESIZE) + 1} -${total}` : `${total - PAGESIZE}-${total}`;
    case CursorType.prev:
      return `${Number(start) - PAGESIZE}-${Number(start) - 1}`;
    case CursorType.next:
      return `${Number(end) + 1}-${Number(end) + PAGESIZE < total ? Number(end) + PAGESIZE : total}`;
  }
};
