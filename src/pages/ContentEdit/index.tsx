import React, { Fragment } from "react";
import Header from "./Header";
import { useLocation } from "react-router-dom";
import LessonMaterial from "./LessonMaterial";
import LessonPlan from "./LessonPlan";

const useQuery = () => {
  const { search } = useLocation();
  const query = new URLSearchParams(search);
  const lesson = query.get("lesson") || "material";
  return { lesson };
};

export default function ContentEdit() {
  const { lesson } = useQuery();

  return (
    <Fragment>
      <Header />
      {lesson === "material" ? <LessonMaterial /> : <LessonPlan />}
    </Fragment>
  );
}
