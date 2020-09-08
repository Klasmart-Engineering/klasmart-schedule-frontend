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
import React, { Fragment } from "react";
import { Controller, UseFormMethods } from "react-hook-form";
import { CheckboxGroup } from "../../components/CheckboxGroup";
import { AssessmentState } from "../../reducers/assessment";

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
  assumed?: boolean;
  onChangeAward: (e: React.ChangeEvent<HTMLInputElement>) => any;
  onChangeSkip: (e: React.ChangeEvent<HTMLInputElement>) => any;
  attendenceList: AssessmentState["attendances"];
  formMethods: UseFormMethods<AssessmentState>;
  selectedAttendence?: string[];
  index: number;
}
const AssessAction = (props: AssessActionProps) => {
  const css = useStyles();
  let {
    assumed,
    attendenceList,
    formMethods: { control },
    selectedAttendence,
    onChangeSkip,
    index,
  } = props;
  // if(assumed){selectedAttendence = attendenceList && attendenceList.map(v=>v.id)}
  const qtyKeys = `outcome_attendence_maps[${index}].attendence_ids`;
  const handleChangeAward = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      // selectedAttendence = attendenceList
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
          defaultValue={selectedAttendence}
          render={(props) => (
            <CheckboxGroup
              {...props}
              render={(selectedContentGroupContext) => (
                <Fragment>
                  {attendenceList &&
                    attendenceList.map((item) => (
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
  outcomesList: AssessmentState["outcome_attendance_maps"];
  attendanceList: AssessmentState["attendances"];
  formMethods: UseFormMethods<AssessmentState>;
}
export function OutcomesTable(props: OutcomesTableProps) {
  const css = useStyles();
  const { outcomesList, attendanceList, formMethods } = props;
  const handleChangeAward = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log(e.target.checked);
  };
  const handleChangeSkip = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log(e.target.checked);
  };

  const rows =
    outcomesList &&
    outcomesList.map((item, index) => (
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
            attendenceList={attendanceList}
            formMethods={formMethods}
            selectedAttendence={item.attendance_ids}
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
