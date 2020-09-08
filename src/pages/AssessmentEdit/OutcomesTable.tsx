import {
  Box,
  Checkbox,
  FormControlLabel,
  makeStyles,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@material-ui/core";
import React, { Fragment, useState } from "react";
import { Controller, UseFormMethods } from "react-hook-form";
import { AssessmentDetailProps, Outcomes } from ".";
import { CheckboxGroup } from "../../components/CheckboxGroup";

const useStyles = makeStyles({
  tableContainer: {
    marginTop: 5,
    maxHeight: 830,
    marginBottom: 20,
  },
  table: {
    minWidth: 900,
    fontSize: "14px !important",
  },
  checkBoxUi: {
    fontSize: "14px !important",
  },
  tableHead: {
    backgroundColor: "#F2F5F7",
  },
  tableCellLine: {
    "&:not(:last-child)": {
      borderRight: "1px solid #ebebeb",
    },
  },
  assessActionline: {
    borderLeft: "1px solid #ebebeb",
  },
});

interface AssessActionProps {
  assumed: boolean;
  onChangeAward: (e: React.ChangeEvent<HTMLInputElement>) => any;
  onChangeSkip: (e: React.ChangeEvent<HTMLInputElement>) => any;
  attendenceList: AssessmentDetailProps["attendences"];
  formMethods: UseFormMethods<AssessmentDetailProps>;
  selectedAttendence: AssessmentDetailProps["attendences"];
  index: number;
}
const AssessAction = (props: AssessActionProps) => {
  const css = useStyles();
  const {
    assumed,
    attendenceList,
    formMethods: { control },
    selectedAttendence,
    onChangeSkip,
    index,
  } = props;
  const [defaultvalue, SetValue] = useState(selectedAttendence.map((v) => v.id));
  const qtyKeys = `outcome_attendence_maps[${index}].attendence_ids`;
  const handleChangeAward = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      SetValue(attendenceList.map((v) => v.id));
    }
  };
  return (
    <Box display="flex" alignItems="center">
      <Box width={500} fontSize={14}>
        <FormControlLabel
          control={<Checkbox defaultChecked={assumed} onChange={handleChangeAward} name="award" color="primary" />}
          label="Award All"
        />
        <FormControlLabel
          control={
            <Checkbox
              // checked={state.checkedB}
              onChange={onChangeSkip}
              name="skip"
              color="primary"
            />
          }
          label="Skip"
        />
      </Box>
      <Box px={3} className={css.assessActionline}>
        <Controller
          name={qtyKeys}
          control={control}
          defaultValue={defaultvalue}
          render={(props) => (
            <CheckboxGroup
              {...props}
              render={(selectedContentGroupContext) => (
                <Fragment>
                  {attendenceList.map((item) => (
                    <FormControlLabel
                      control={
                        <Checkbox
                          color="primary"
                          value={item.id}
                          checked={selectedContentGroupContext.hashValue[item.id as string]}
                          onChange={selectedContentGroupContext.registerChange}
                        />
                      }
                      label={item.name}
                      key={item.id}
                    />
                  ))}
                </Fragment>
              )}
            />
          )}
        />
      </Box>
    </Box>
  );
};

interface OutcomesTableProps {
  outcomesList: AssessmentDetailProps["outcome_attendence_maps"];
  attendenceList: AssessmentDetailProps["attendences"];
  formMethods: UseFormMethods<AssessmentDetailProps>;
}
export function OutcomesTable(props: OutcomesTableProps) {
  const css = useStyles();
  const { outcomesList, attendenceList, formMethods } = props;
  const handleChangeAward = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log(e.target.checked);
  };
  const handleChangeSkip = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log(e.target.checked);
  };

  const rows = outcomesList.map((item: Outcomes, index) => (
    <TableRow key={item.outcome_id}>
      <TableCell className={css.tableCellLine} align="center">
        {item.outcome_name}
      </TableCell>
      <TableCell className={css.tableCellLine} align="center">
        {item.assumed ? "Assumed" : "Unassumed"}
      </TableCell>
      <TableCell>
        <AssessAction
          assumed={item.assumed}
          attendenceList={attendenceList}
          formMethods={formMethods}
          selectedAttendence={item.attendence_ids}
          onChangeAward={(e) => handleChangeAward(e)}
          onChangeSkip={(e) => handleChangeSkip(e)}
          index={index}
        ></AssessAction>
      </TableCell>
    </TableRow>
  ));
  return (
    <TableContainer className={css.tableContainer}>
      <Table className={css.table} stickyHeader>
        <TableHead className={css.tableHead}>
          <TableRow>
            <TableCell width={150} align="center">
              Learning Outcomes
            </TableCell>
            <TableCell width={80} align="center">
              Assumed
            </TableCell>
            <TableCell align="center">Assessing Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>{rows}</TableBody>
      </Table>
    </TableContainer>
  );
}
