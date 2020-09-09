import {
  Checkbox,
  createStyles,
  Grid,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { CheckBox, CheckBoxOutlineBlank } from "@material-ui/icons";
import DeleteOutlineIcon from "@material-ui/icons/DeleteOutline";
import RemoveCircleOutlineIcon from "@material-ui/icons/RemoveCircleOutline";
import { Pagination } from "@material-ui/lab";
import React from "react";
import { Controller, UseFormMethods } from "react-hook-form";
import { LearningOutcomes } from "../../api/api";
import { OutcomePublishStatus } from "../../api/api.d";
import { CheckboxGroup, CheckboxGroupContext } from "../../components/CheckboxGroup";
import LayoutBox from "../../components/LayoutBox";
import { LButton } from "../../components/LButton";
import { BulkListForm, BulkListFormKey, OutcomeQueryCondition } from "./types";
const calcGridWidth = (n: number, p: number) => (n === 1 ? "100%" : `calc(100% * ${n / (n - 1 + p)})`);

const useStyles = makeStyles((theme) =>
  createStyles({
    gridContainer: {
      [theme.breakpoints.only("xl")]: {
        width: calcGridWidth(4, 0.86),
      },
      [theme.breakpoints.only("lg")]: {
        width: calcGridWidth(4, 0.86),
      },
      [theme.breakpoints.only("md")]: {
        width: calcGridWidth(3, 0.86),
      },
      [theme.breakpoints.only("sm")]: {
        width: calcGridWidth(2, 0.9),
      },
      [theme.breakpoints.only("xs")]: {
        width: calcGridWidth(1, 1),
      },
    },
    iconColor: {
      color: "#D32F2F",
      padding: "0 0 0 10px",
    },
    rePublishColor: {
      color: "#0E78D5",
      padding: "0 0 0 10px",
    },
    pagination: {
      marginBottom: 40,
    },
    paginationUl: {
      justifyContent: "center",
    },
    checkbox: {
      padding: 0,
      borderRadius: 5,
      backgroundColor: "white",
    },
    tableHead: {
      height: 80,
      backgroundColor: "#f2f5f7",
    },
  })
);

interface OutcomeProps extends OutcomeActionProps {
  outcome: LearningOutcomes;
  queryCondition: OutcomeQueryCondition;
  selectedContentGroupContext: CheckboxGroupContext;
  onClickOutcome: OutcomeTableProps["onClickOutcome"];
}
function OutomeRow(props: OutcomeProps) {
  const css = useStyles();
  const { outcome, queryCondition, selectedContentGroupContext, onDelete, onClickOutcome } = props;
  const { registerChange, hashValue } = selectedContentGroupContext;
  const DeleteIcon = outcome?.publish_status === OutcomePublishStatus.published ? RemoveCircleOutlineIcon : DeleteOutlineIcon;
  return (
    <TableRow onClick={(e) => onClickOutcome(outcome.outcome_id)}>
      <TableCell align="center" padding="checkbox">
        <Checkbox
          icon={<CheckBoxOutlineBlank viewBox="3 3 18 18"></CheckBoxOutlineBlank>}
          checkedIcon={<CheckBox viewBox="3 3 18 18"></CheckBox>}
          size="small"
          className={css.checkbox}
          color="secondary"
          value={outcome.outcome_id}
          checked={hashValue[outcome.outcome_id as string] || false}
          onChange={registerChange}
        ></Checkbox>
      </TableCell>
      <TableCell align="center">{outcome.outcome_name}</TableCell>
      <TableCell align="center">{outcome.shortcode}</TableCell>
      <TableCell align="center">{outcome.program}</TableCell>
      <TableCell align="center">{outcome.subject}</TableCell>
      <TableCell align="center">{outcome.skills}</TableCell>
      <TableCell align="center">{outcome.publish_scope}</TableCell>
      <TableCell align="center">{outcome.assumed}</TableCell>
      <TableCell align="center">{outcome.created_at}</TableCell>
      <TableCell align="center">{outcome.author_name}</TableCell>
      <TableCell align="center">
        {queryCondition.publish_status !== OutcomePublishStatus.pending && (
          <LButton as={IconButton} replace className={css.iconColor} onClick={() => onDelete(outcome.outcome_id as string)}>
            <DeleteIcon />
          </LButton>
        )}
      </TableCell>
    </TableRow>

    // <Card className={css.card}>
    //   <Checkbox
    //     icon={<CheckBoxOutlineBlank viewBox="3 3 18 18"></CheckBoxOutlineBlank>}
    //     checkedIcon={<CheckBox viewBox="3 3 18 18"></CheckBox>}
    //     size="small"
    //     className={css.checkbox}
    //     color="secondary"
    //     value={content.id}
    //     checked={hashValue[content.id as string] || false}
    //     onChange={registerChange}
    //   ></Checkbox>
    //   <CardActionArea onClick={(e) => onClickOutcome(content.id)}>
    //     <CardMedia className={css.cardMedia}>
    //       <Thumbnail className={css.cardImg} type={content.content_type} id={content.thumbnail}></Thumbnail>
    //     </CardMedia>
    //   </CardActionArea>
    //   <CardContent className={css.cardContent}>
    //     <Grid container alignContent="space-between">
    //       <Typography variant="h6" style={{ flex: 1 }} noWrap={true}>
    //         {content?.name}
    //       </Typography>
    //       <ExpandBtn className={css.iconButtonExpandMore} {...expand.expandMore}>
    //         <ExpandMore fontSize="small"></ExpandMore>
    //       </ExpandBtn>
    //     </Grid>
    //     <Collapse {...expand.collapse} unmountOnExit>
    //       <Typography className={css.body2} variant="body2">
    //         {content?.name}
    //       </Typography>
    //     </Collapse>
    //   </CardContent>
    //   <Typography className={css.body2} style={{ marginLeft: "10px" }} variant="body2">
    //     {content?.content_type_name}
    //   </Typography>
    //   <CardActions className={css.cardActions}>
    //     <Typography className={css.body2} variant="body2">
    //       {content?.author_name}
    //     </Typography>
    //     <div>
    //       {content?.publish_status === "archive" && (
    //         <LButton as={IconButton} replace className={css.rePublishColor} onClick={() => onPublish(content.id as string)}>
    //           <PublishOutlinedIcon />
    //         </LButton>
    //       )}
    //       {queryCondition.publish_status !== OutcomePublishStatus.pending && (
    //         <LButton as={IconButton} replace className={css.iconColor} onClick={() => onDelete(content.id as string)}>
    //           <DeleteIcon />
    //         </LButton>
    //       )}
    //     </div>
    //   </CardActions>
    // </Card>
  );
}

interface OutcomeActionProps {
  onPublish: (id: NonNullable<LearningOutcomes["outcome_id"]>) => any;
  onDelete: (id: NonNullable<LearningOutcomes["outcome_id"]>) => any;
}

export interface OutcomeTableProps extends OutcomeActionProps {
  formMethods: UseFormMethods<BulkListForm>;
  total: number;
  amountPerPage?: number;
  list: LearningOutcomes[];
  queryCondition: OutcomeQueryCondition;
  onChangePage: (page: number) => void;
  onClickOutcome: (id: LearningOutcomes["outcome_id"]) => any;
}
export function OutcomeTable(props: OutcomeTableProps) {
  const css = useStyles();
  const { formMethods, list, total, amountPerPage = 16, queryCondition, onPublish, onDelete, onChangePage, onClickOutcome } = props;
  const { control } = formMethods;
  const handleChangePage = (event: object, page: number) => onChangePage(page);
  return (
    <LayoutBox holderMin={40} holderBase={202} mainBase={1517}>
      <Grid className={css.gridContainer} container>
        <Controller
          name={BulkListFormKey.CHECKED_BULK_IDS}
          control={control}
          defaultValue={[]}
          render={(props) => (
            <CheckboxGroup
              {...props}
              render={(selectedContentGroupContext) => (
                <TableContainer>
                  <Table>
                    <TableHead className={css.tableHead}>
                      <TableRow>
                        <TableCell align="center" padding="checkbox">
                          <Checkbox
                            icon={<CheckBoxOutlineBlank viewBox="3 3 18 18"></CheckBoxOutlineBlank>}
                            checkedIcon={<CheckBox viewBox="3 3 18 18"></CheckBox>}
                            size="small"
                            className={css.checkbox}
                            color="secondary"
                          />
                        </TableCell>
                        <TableCell align="center">Learning Outcomes</TableCell>
                        <TableCell align="center">Short Code</TableCell>
                        <TableCell align="center">Program</TableCell>
                        <TableCell align="center">Subject</TableCell>
                        <TableCell align="center">Milestone</TableCell>
                        <TableCell align="center">Standard</TableCell>
                        <TableCell align="center">Assumed</TableCell>
                        <TableCell align="center">Created On</TableCell>
                        <TableCell align="center">Author</TableCell>
                        <TableCell align="center">Actions</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {list.map((item, idx) => (
                        <OutomeRow
                          key={item.outcome_id}
                          outcome={item}
                          {...{ onPublish, onDelete, queryCondition, selectedContentGroupContext, onClickOutcome }}
                        />
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              )}
            />
          )}
        />
      </Grid>
      <Pagination
        page={queryCondition.page}
        className={css.pagination}
        classes={{ ul: css.paginationUl }}
        onChange={handleChangePage}
        count={Math.ceil(total / amountPerPage)}
        color="primary"
      />
    </LayoutBox>
  );
}
