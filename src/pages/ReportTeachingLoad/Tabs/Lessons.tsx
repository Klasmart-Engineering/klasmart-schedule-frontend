import React from "react";
import LessonChart from "../Components/LessonChart";

export default function () {
  const teacherChange = (id?: string) => {
    console.log(id);
  };

  return (
    <div>
      <LessonChart teacherChange={teacherChange} />
    </div>
  );
}
