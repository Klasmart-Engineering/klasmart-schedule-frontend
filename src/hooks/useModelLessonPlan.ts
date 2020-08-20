import { useMemo, createContext, ReactNode, createElement, useState, useContext, useCallback, JSXElementConstructor } from "react";
import cloneDeep from "lodash/cloneDeep";

interface Segment {
  segmentId?: string;
  condition?: "ifCorrect" | "ifWrong" | "ifScoreUp60" | "ifScoreDown60" | "start";
  material?: any;
  next?: Segment[];
}

interface HashSegment {
  [key: string]: {
    prevIdx?: number;
    prev?: Segment;
    current: Segment;
  };
}

class ModelLessonPlan {
  hash: HashSegment;
  value: Segment;

  static clone(model: ModelLessonPlan) {
    const result = Object.create(ModelLessonPlan.prototype);
    Object.assign(result, model);
    return result;
  }

  constructor(plan: Segment) {
    this.value = plan;
    this.hash = this.genHash({}, plan);
  }
  getPairCondition(condition: Segment["condition"]): [Segment["condition"], Segment["condition"]] {
    switch (condition) {
      case "ifCorrect":
      case "ifWrong":
        return ["ifCorrect", "ifWrong"];
      case "ifScoreDown60":
      case "ifScoreUp60":
        return ["ifScoreUp60", "ifScoreDown60"];
      default:
        return ["ifCorrect", "ifWrong"];
    }
  }
  genHash(hash: HashSegment, plan?: Segment, prevIdx?: number, prev?: Segment): HashSegment {
    if (!plan?.segmentId) return hash;
    hash[plan.segmentId] = { current: plan, prevIdx, prev };
    plan.next?.forEach((subPlan, idx) => this.genHash(hash, subPlan, idx, plan));
    return hash;
  }
  forEach(callback: (item: Segment, prevIdx: number | undefined, prev: Segment | undefined) => any) {
    Object.values(this.hash).forEach((subPlan) => {
      if (!subPlan) return;
      const { prevIdx, prev, current } = subPlan;
      callback(current, prevIdx, prev);
    });
  }
  set(segmentId: Segment["segmentId"], value: Partial<Segment>): this {
    if (!segmentId) return this;
    const { current } = this.hash[segmentId];
    Object.assign(current, value);
    return this;
  }
  add(virtualSegmentId: Segment["segmentId"], value: Partial<Segment>, first: boolean): this {
    const segmentId = virtualSegmentId?.slice(7);
    if (first) {
      if (value.material) {
        this.value.segmentId = `1`;
        this.value.material = value.material;
        this.value.next = [];
      }
    } else {
      if (!segmentId) return this;
      const { current } = this.hash[segmentId];
      if (value.condition) {
        const [firstCondition, secondCondition] = this.getPairCondition(value.condition);
        current.next = [
          { segmentId: `${segmentId}1`, condition: firstCondition, next: [] },
          { segmentId: `${segmentId}2`, condition: secondCondition, next: [] },
        ];
      }
      if (value.material) {
        current.next = [{ segmentId: `${segmentId}1`, material: value.material, next: [] }];
      }
    }
    this.hash = this.genHash({}, this.value);
    return this;
  }
  // 这里只考虑了单节点情况，如果将来有condition 分叉，需要修改实现
  remove(segmentId: Segment["segmentId"]): this {
    if (!segmentId) return this;
    const { prev, prevIdx, current } = this.hash[segmentId];
    // 修改第一个的情况
    if (!prev || prevIdx == null) {
      this.value = current.next ? current.next[0] : {};
      this.hash = this.genHash({}, this.value);
      return this;
    }
    if (!prev.next) return this;
    if (!current.next || current.next.length === 0) {
      prev.next.splice(prevIdx, 1);
    } else {
      prev.next[prevIdx] = current.next[0];
    }
    this.value = Object.assign({}, this.value);
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
  const getValue = useMemo<IGetValue<T>>(() => {
    const ref = { current: transform(initValue) };
    return function getValue(set) {
      const setValue = (value: any) => {
        ref.current = value;
        set(value);
      };
      return [ref, setValue];
    };
  }, [initValue, transform]);
  const [{ current }, setValue] = getValue(set);
  return [current, setValue];
}

export function useModelLessonPlan(): ModelContext {
  return useContext(context);
}

interface ContainerFormLessonPlanProps {
  plan: Segment;
  children: ReactNode;
}
export function ContainerModelLessonPlan(props: ContainerFormLessonPlanProps) {
  const { children, plan } = props;
  const [model, setModel] = useMemoWithSet<ModelLessonPlan>(plan, (plan: Segment) => {
    return new ModelLessonPlan(cloneDeep(plan));
  });
  const update = () => setModel(ModelLessonPlan.clone(model));
  return createElement(context.Provider, { value: { model, update } }, children);
}
