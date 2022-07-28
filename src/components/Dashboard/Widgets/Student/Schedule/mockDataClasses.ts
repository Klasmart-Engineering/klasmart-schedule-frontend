import { SchedulePayload } from "../../../../../types/objectTypes";
import mock2 from "@components/Dashboard/Widgets/Student/Schedule/img/mock_2.png";
import mock3 from "@components/Dashboard/Widgets/Student/Schedule/img/mock_3.png";
import mock4 from "@components/Dashboard/Widgets/Student/Schedule/img/mock_4.png";

export const MockDataTeacher = {
  classNode: {
    teachersConnection: {
      totalCount: 2,
      edges: [
        {
          node: {
            id: `1`,
            givenName: "Christina",
            familyName: "Oliver",
            avatar: "",
          },
        },
        {
          node: {
            id: `2`,
            givenName: "Miichael",
            familyName: "Jin",
            avatar: "",
          },
        },
      ],
    },
  },
};

export interface mockSchedulePayload extends SchedulePayload {
  img?: any;
}
export const MockDataTag = `MockDataTag`;
const MockTodayDate = new Date(`${new Date().toLocaleDateString()} 8:30`).getTime() / 1000;
export const MockDataSchedule: mockSchedulePayload[] = [
  {
    class_id: "",
    class_type: "OnlineClass",
    end_at: MockTodayDate + 3 * 60 * 60,
    id: "1",
    is_repeat: false,
    lesson_plan_id: MockDataTag,
    start_at: MockTodayDate,
    status: "NotStart",
    title: "Badanamu Safari",
    is_home_fun: false,
    is_review: false,
  },
  {
    class_id: "",
    class_type: "OfflineClass",
    end_at: MockTodayDate + (24 + 3) * 60 * 60,
    id: "2",
    is_repeat: false,
    lesson_plan_id: MockDataTag,
    start_at: MockTodayDate + 24 * 60 * 60,
    status: "NotStart",
    title: "Bada Math - Let’s count",
    is_home_fun: false,
    is_review: false,
    img: mock2,
  },
  {
    class_id: "",
    class_type: "OnlineClass",
    end_at: MockTodayDate + (24 + 8.5) * 60 * 60,
    id: "3",
    is_repeat: false,
    lesson_plan_id: MockDataTag,
    start_at: MockTodayDate + (24 + 5.5) * 60 * 60,
    status: "NotStart",
    title: "My colours",
    is_home_fun: false,
    is_review: false,
    img: mock3,
  },
  {
    class_id: "",
    class_type: "OnlineClass",
    end_at: MockTodayDate + (48 + 8.5) * 60 * 60,
    id: "4",
    is_repeat: false,
    lesson_plan_id: MockDataTag,
    start_at: MockTodayDate + (48 + 5.5) * 60 * 60,
    status: "NotStart",
    title: "Good Dream!",
    is_home_fun: false,
    is_review: false,
    img: mock4,
  },
];
