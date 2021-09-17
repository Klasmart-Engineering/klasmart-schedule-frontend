import React from "react";

const Assignments = React.lazy(() => import("./Assignments"));
const Lessons = React.lazy(() => import("./Lessons"));
const NextSevenDaysLessonLoad = React.lazy(() => import("./NextSevenDaysLessonLoad"));

export { Assignments, Lessons, NextSevenDaysLessonLoad };
