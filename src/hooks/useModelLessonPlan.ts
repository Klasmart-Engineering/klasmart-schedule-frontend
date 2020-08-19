import { useMemo, createContext, ReactNode, createElement, useState, useContext, useCallback } from "react";
import cloneDeep from "lodash/cloneDeep";

interface Segment {
  segmentId?: string;
  condition?: "ifCorrect" | "ifWrong" | "ifScoreUp60" | "ifScoreDown60" | "start";
  material?: any;
  next?: Segment[];
}

interface HashSegment {
  [key: string]:
    | ({
        prevIdx?: number;
        prev?: Segment;
      } & Segment)
    | undefined;
}

class ModelLessonPlan {
  hash: HashSegment;
  value: Segment;

  constructor(plan: Segment) {
    this.value = plan;
    this.hash = this.genHash({}, plan);
  }

  genHash(hash: HashSegment, plan?: Segment, prevIdx?: number, prev?: Segment): HashSegment {
    if (!plan?.segmentId) return hash;
    hash[plan.segmentId] = { ...plan, prevIdx, prev };
    plan.next?.forEach((subPlan, idx) => this.genHash(hash, subPlan, idx, plan));
    return hash;
  }
  forEach(callback: (item: Segment, prevIdx: number | undefined, prev: Segment | undefined) => any) {
    Object.values(this.hash).forEach((subPlan) => {
      if (!subPlan) return;
      const { prevIdx, prev, ...item } = subPlan;
      callback(item, prevIdx, prev);
    });
  }
  // TODO: 替换成 segmentID
  set(key: Segment, value: Partial<Segment>): this {
    if (!key.segmentId) return this;
    const { prev, prevIdx } = this.hash[key.segmentId] || {};
    // 修改第一个的情况
    if (!prev || !prevIdx) {
      this.value = Object.assign(this.value, value);
      return this;
    }
    if (!prev.next) return this;
    prev.next[prevIdx] = Object.assign(prev.next[prevIdx], value);
    return this;
  }
  // TODO: 替换成 segmentID
  // 这里只考虑了单节点情况，如果将来有condition 分叉，需要修改实现
  remove(key: Segment): this {
    if (!key.segmentId || !this.value || !this.value.segmentId) return this;
    const { prev, prevIdx } = this.hash[key.segmentId] || {};
    // 修改第一个的情况
    if (!prev || !prevIdx) {
      this.value = this.value.next ? this.value?.next[0] : {};
      this.hash = this.genHash({}, this.value);
      return this;
    }
    if (!prev.next) return this;
    if (!prev.next[0].next || !prev.next[0].next[0]) {
      delete prev.next[prevIdx];
    } else {
      prev.next[0] = prev.next[0].next[0];
    }
    this.hash = this.genHash({}, this.value);
    return this;
  }
}

interface ModelContext {
  model?: ModelLessonPlan;
  update?: () => void;
}
const context = createContext<ModelContext>({});

interface IGetValue<T> {
  (set: UseMemoWithSetReturn<T>[1]): [{ current: UseMemoWithSetReturn<T>[0] }, UseMemoWithSetReturn<T>[1]];
}
type UseMemoWithSetReturn<T> = [T, (arg: T) => any];
function useMemoWithSet<T>(initValue: any, transform: (arg: any) => T): UseMemoWithSetReturn<T> {
  const [, set] = useState();
  const transformValue = useCallback(transform, []);
  const getValue = useMemo<IGetValue<T>>(() => {
    const ref = { current: transformValue(initValue) };
    return function getValue(set) {
      const setValue = (value: any) => {
        ref.current = value;
        set(value);
      };
      return [ref, setValue];
    };
  }, [initValue, transformValue]);
  const [{ current }, setValue] = getValue(set);
  return [current, setValue];
}

export function useModelLessonPlan() {
  const { model, update } = useContext(context);
  return { model, update };
}

interface ContainerFormLessonPlanProps {
  plan: Segment;
  children: (form: Segment) => ReactNode;
}
export function ContainerModelLessonPlan(props: ContainerFormLessonPlanProps) {
  const { children, plan } = props;
  const [model, setModel] = useMemoWithSet<ModelLessonPlan>(plan, (plan: Segment) => {
    return new ModelLessonPlan(cloneDeep(plan));
  });
  const update = () => setModel(Object.create(model));
  return createElement(context.Provider, { value: { model, update } }, children(model.value));
}
