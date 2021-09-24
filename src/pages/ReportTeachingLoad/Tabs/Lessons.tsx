import React from "react";
import LessonChart from "../Components/LessonChart";
import LessonTable from "../Components/LessonTable";

export default function () {
  const teacherChange = (id?: string) => {
    console.log(id);
  };

  return (
    <div>
      <LessonChart teacherChange={teacherChange} />
      <LessonTable />
    </div>
  );
}
