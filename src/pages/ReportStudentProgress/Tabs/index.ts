import React from "react";

const AssignmentCompletion = React.lazy(() => import("./AssignmentCompletion"));
const ClassAttendance = React.lazy(() => import("./ClassAttendance"));
const LearningOutcomesAchievement = React.lazy(() => import("./LearningOutcomesAchievement"));

export { AssignmentCompletion, ClassAttendance, LearningOutcomesAchievement };
