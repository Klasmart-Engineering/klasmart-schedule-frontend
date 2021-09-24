import React from "react";
import LessonChart from "../components/LessonChart";
import LessonTable from "../components/LessonTable";

export default function () {
  const teacherChange = (id?: string) => {
    console.log(id);
  };

  return (
    <div>
      <LessonChart teacherChange={teacherChange} teacherIds={[]} classIds={[]} />
      <LessonTable />
    </div>
  );
}
