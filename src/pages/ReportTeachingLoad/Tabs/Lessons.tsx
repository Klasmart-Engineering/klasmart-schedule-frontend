import React from "react";
import LessonChart from "../components/LessonChart";
import LessonTable from "../components/LessonTable";
import { SelectContext } from "../index";

export interface IState {
  id: string | undefined;
  days: number;
}

export default function () {
  const [state, setState] = React.useState<IState>({
    id: undefined,
    days: 7,
  });

  const teacherChange = (id?: string, days?: number) => {
    setState({ id, days: days ? days : 7 });
  };

  return (
    <SelectContext.Consumer>
      {(value) => {
        const { teachers, classes } = value;
        return (
          <div>
            <LessonChart teacherChange={teacherChange} teacherIds={teachers} classIds={classes} />
            {state.id ? <LessonTable state={state} classIds={classes} /> : ""}
          </div>
        );
      }}
    </SelectContext.Consumer>
  );
}
