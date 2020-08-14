import { useMemo, createContext, ReactNode, createElement, useState, useContext } from "react";
import cloneDeep from "lodash/cloneDeep";

interface Segment {
  segmentId?: string;
  condition?: "ifCorrect" | "ifWrong" | "ifScoreUp60" | "ifScoreDown60" | "start";
  material?: any;
  next?: Segment[];
}

const context = createContext({});

export function useModelLessonPlan() {
  // const { model } = useContext(context);
  // return { model };
}

interface ContainerModelLessonPlanProps {
  plan: Segment;
  children: ReactNode;
}
export function ContainerModelLessonPlan(props: ContainerModelLessonPlanProps) {
  const { children, plan } = props;
  const model = useMemo(() => cloneDeep(plan), [plan]);
  return createElement(context.Provider, { value: { model } }, children);
}
