import React from "react";
import LessonChart from "../components/LessonChart";

export default function () {
  const teacherChange = (id?: string, days?: number) => {
    console.log(id, days);
  };

  return (
    <div>
      <LessonChart teacherChange={teacherChange} teacherIds={[]} classIds={[]} />
      <LessonTable />
    </div>
  );
}
