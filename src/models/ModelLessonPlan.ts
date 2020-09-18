import produce from "immer";
import cloneDeep from "lodash/cloneDeep";
import { Content } from "../api/api";

export interface Segment {
  segmentId?: string;
  condition?: "ifCorrect" | "ifWrong" | "ifScoreUp60" | "ifScoreDown60" | "start";
  material?: Content;
  materialId?: string;
  next?: Segment[];
}

interface HashSegment
  extends Record<
    string,
    {
      prevIdx?: number;
      prev?: Segment;
      current: Segment;
    }
  > {}

export class ModelLessonPlan {
  static getPairCondition(condition: Segment["condition"]): [Segment["condition"], Segment["condition"]] {
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

  static genHash(hash: HashSegment, plan?: Segment, prevIdx?: number, prev?: Segment): HashSegment {
    if (!plan?.segmentId) return hash;
    hash[plan.segmentId] = { current: plan, prevIdx, prev };
    plan.next?.forEach((subPlan, idx) => ModelLessonPlan.genHash(hash, subPlan, idx, plan));
    return hash;
  }

  static forEach(plan: Segment, callback: (item: Segment, prevIdx: number | undefined, prev: Segment | undefined) => any) {
    const planHash = ModelLessonPlan.genHash({}, plan);
    Object.values(planHash).forEach((subPlan) => {
      if (!subPlan) return;
      const { prevIdx, prev, current } = subPlan;
      callback(current, prevIdx, prev);
    });
  }

  static toString(plan: Segment): string {
    const result = produce(plan, (draft) => {
      ModelLessonPlan.forEach(draft, (item) => {
        if (item.material) {
          item.materialId = item.material.id;
          delete item.material;
        }
      });
    });
    return JSON.stringify(result);
  }
  static toSegment(plan: string): Segment {
    const newPlan = JSON.parse(plan) as Segment;
    const result = produce(newPlan, (draft) => {
      ModelLessonPlan.forEach(draft, (item) => {
        if (item.material === null) {
          item.material = {};
        }
      });
    });
    return result;
  }

  static set(plan: Segment, segmentId: Segment["segmentId"], value: Partial<Segment>): Segment {
    const result = produce(plan, (draft) => {
      if (!segmentId) return;
      const planHash = ModelLessonPlan.genHash({}, draft);
      const { current } = planHash[segmentId];
      Object.assign(current, value);
    });
    return result === plan ? plan : cloneDeep(result);
  }

  static add(plan: Segment, virtualSegmentId: Segment["segmentId"], value: Partial<Segment>, first: boolean): Segment {
    const result = produce(plan, (draft) => {
      const segmentId = virtualSegmentId?.slice(7);
      if (!first && !segmentId) return;
      const planHash = ModelLessonPlan.genHash({}, draft);
      if (first) {
        if (value.material) {
          draft.segmentId = `1`;
          draft.material = value.material;
          draft.next = [];
        }
      } else {
        if (!segmentId) return;
        const { current } = planHash[segmentId];
        if (value.condition) {
          const [firstCondition, secondCondition] = ModelLessonPlan.getPairCondition(value.condition);
          current.next = [
            { segmentId: `${segmentId}1`, condition: firstCondition, next: [] },
            { segmentId: `${segmentId}2`, condition: secondCondition, next: [] },
          ];
        }
        if (value.material) {
          current.next = [{ segmentId: `${segmentId}1`, material: value.material, next: [] }];
        }
      }
    });
    return result === plan ? plan : cloneDeep(result);
  }

  static toArray(plan: Segment): Segment["material"][] {
    const result: Segment["material"][] = [];
    ModelLessonPlan.forEach(plan, (item) => {
      result.push(item.material);
    });

    return result;
  }

  // 这里只考虑了单节点情况，如果将来有condition 分叉，需要修改实现
  static remove(plan: Segment, segmentId: Segment["segmentId"]): Segment {
    const result = produce(plan, (draft) => {
      if (!segmentId) return;
      const planHash = ModelLessonPlan.genHash({}, draft);
      const { prev, prevIdx, current } = planHash[segmentId];
      // 修改第一个的情况
      if (!prev || prevIdx == null) {
        return current.next && current.next.length > 0 ? current.next[0] : {};
      }
      if (!prev.next) return;
      if (!current.next || current.next.length === 0) {
        prev.next.splice(prevIdx, 1);
      } else {
        prev.next[prevIdx] = current.next[0];
      }
    });
    return result === plan ? plan : cloneDeep(result);
  }
}
