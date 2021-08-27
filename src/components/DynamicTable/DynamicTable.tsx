import { makeStyles } from "@material-ui/core";
import React from "react";
import { EntityAssessmentStudentViewH5PItem } from "../../api/api.auto";
import noDataIconUrl from "../../assets/icons/any_time_no_data.png";
import { d } from "../../locale/LocaleManager";
import { ElasticLayerControl } from "../../types/assessmentTypes";
import ResourcesView from "./ResourcesView";
import { EntityAssessmentStudentViewH5PItemExtend, tableProps } from "./types";
import { ViewByMaterial } from "./ViewByMaterial";
import { ViewByStudents } from "./ViewByStudents";

const useStyles = makeStyles({
  table: {
    minWidth: 650,
  },
  tableBar: {
    display: "flex",
    justifyContent: "space-between",
    padding: "16px",
    cursor: "pointer",
    "&:hover": {
      backgroundColor: "#F2F5F7 !important",
    },
    "& div": {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      "& a": {
        fontSize: "14px",
        color: "#006CCF",
      },
    },
  },
  emptyBox: {
    textAlign: "center",
    display: "flex",
    alignItems: "center",
    flexDirection: "column",
    "& img": {
      marginTop: "15%",
    },
  },
  scoreEditBox: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  outcomesBox: {
    maxWidth: "260px",
    "& li": {
      textAlign: "left",
      marginTop: "10px",
      wordBreak: "break-all",
    },
  },
});

export function DynamicTable(props: tableProps) {
  const {
    studentViewItems,
    editable,
    isComplete,
    formMethods,
    formValue,
    name,
    tableType,
    autocompleteLabel,
    lesson_materials,
    changeAssessmentTableDetail,
  } = props;
  const [elasticLayerControlData, setElasticLayerControlData] = React.useState<ElasticLayerControl>({
    openStatus: false,
    type: "",
  });
  const handleElasticLayerControl = (elasticLayerControlData: ElasticLayerControl) => {
    setElasticLayerControlData(elasticLayerControlData);
  };
  const classes = useStyles();

  const getLessonMaterialsType = (id?: string, t?: string) => {
    let type = "";
    studentViewItems?.forEach((item) => {
      item.lesson_materials?.forEach((lesson, index) => {
        if (t === "p" && lesson.lesson_material_id === id && lesson.lesson_material_type) type = lesson.lesson_material_type as string;
        if (t === "c" && lesson.sub_h5p_id === id && lesson.lesson_material_type) type = lesson.lesson_material_type as string;
      });
    });
    return type;
  };

  const dimension2 = studentViewItems?.length
    ? studentViewItems[0].lesson_materials?.map((material) => {
        const id = material.sub_h5p_id ? material.sub_h5p_id : material.lesson_material_id;
        const type = material.sub_h5p_id ? "c" : "p";
        return { ...material, student: [], lesson_material_type: getLessonMaterialsType(id, type) };
      })
    : [];
  studentViewItems?.forEach((item) => {
    item.lesson_materials?.forEach((lesson, index) => {
      if (dimension2) {
        dimension2[index].student.push({ student_id: item.student_id, student_name: item.student_name, ...lesson } as never);
      }
    });
  });

  return (
    <>
      {autocompleteLabel === 1 &&
        studentViewItems?.map((item: EntityAssessmentStudentViewH5PItemExtend, index: number) => {
          return (
            <ViewByStudents
              key={item.student_id}
              handleElasticLayerControl={handleElasticLayerControl}
              formValue={formValue}
              formMethods={formMethods}
              studentViewItem={item}
              index={index}
              editable={editable}
              isComplete={isComplete}
              name={name}
              tableType={tableType}
              autocompleteLabel={autocompleteLabel}
              studentViewItemsSet={studentViewItems}
              lesson_materials={lesson_materials}
              changeAssessmentTableDetail={changeAssessmentTableDetail}
            />
          );
        })}
      {autocompleteLabel === 2 &&
        dimension2?.map((item, index: number) => {
          return (
            <ViewByMaterial
              key={item.sub_h5p_id ? item.sub_h5p_id : item.lesson_material_id}
              handleElasticLayerControl={handleElasticLayerControl}
              formValue={formValue}
              formMethods={formMethods}
              studentViewItem={[] as EntityAssessmentStudentViewH5PItem}
              index={index}
              editable={editable}
              isComplete={isComplete}
              name={name}
              tableType={tableType}
              autocompleteLabel={autocompleteLabel}
              studentViewItemsSet={studentViewItems}
              changeAssessmentTableDetail={changeAssessmentTableDetail}
              lesson_materials={lesson_materials}
              dimension2Item={item}
            />
          );
        })}
      {(!studentViewItems || !studentViewItems.length) && (
        <div className={classes.emptyBox}>
          <img alt="empty" src={noDataIconUrl} />
          <span style={{ marginTop: "10px" }}>{d("No achievement data is available.").t("report_msg_no_data")}</span>
        </div>
      )}
      <ResourcesView elasticLayerControlData={elasticLayerControlData} handleElasticLayerControl={handleElasticLayerControl} />
    </>
  );
}
