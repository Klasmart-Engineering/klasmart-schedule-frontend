import { Typography } from "@material-ui/core";
import React, { useEffect } from "react";
import { useLocation } from "react-router-dom";
import emptyIconUrl from "../../assets/icons/empty.svg";
import mockList from "../../mocks/contentList.json";
import { Content } from "../api/api";
import ActionBar from "./ActionBar";
import CardList from "./CardList";
import TableList from "./TableList";

const useQuery = () => {
  const { search } = useLocation();
  const query = new URLSearchParams(search);
  const layout = query.get("layout") || "card";
  const status = query.get("status") || "content";
  const subStatus = query.get("subStatus") || "";
  const name = query.get("name") || "";
  const sortBy = query.get("sortBy") || "";
  return { layout, status, subStatus, name, sortBy };
};

export default function MyContentList() {
  // const dispatch = useDispatch();
  const { layout, status, subStatus, name, sortBy } = useQuery();
  const showMyOnly = status === "published";
  const lists = [
    {
      type: "Lesson Plan",
      img: "https://beta-hub.kidsloop.net/e23a62b86d44c7ae5eb7993dbb6f7d7d.png",
      fileType: "jpg",
      settings: "Private",
      status: "Published",
      created: "06/13/2020 10:58:20",
      action: "操作",
      id: "1",
      content_type: 1,
      name: "Content title",
      program: "ede1995ebdb440ebb9526c53e07a9ff3",
      subject: "ede1995ebdb440ebb9526c53e07a9ff3",
      developmental: "developmental",
      skills: "ede1995ebdb440ebb9526c53e07a9ff3",
      age: "12-18 Month",
      keywords: ["1111", "2222", "3333"],
      description: "Content description",
      thumbnail: "https://beta-hub.kidsloop.net/e23a62b86d44c7ae5eb7993dbb6f7d7d.png",
      version: 1,
      source_id: "ede1995ebdb440ebb9526c53e07a9ff3",
      locked_by: "ede1995ebdb440ebb9526c53e07a9ff3",
      data: {
        source: "ede1995ebdb440ebb9526c53e07a9ff3.jpg",
      },
      extra: {
        data: "hello",
      },
      author: "ede1995ebdb440ebb9526c53e07a9ff3",
      author_name: "zhangsan",
      org: "ede1995ebdb440ebb9526c53e07a9ff3",
      publish_scope: "ede1995ebdb440ebb9526c53e07a9ff3",
      publish_status: "published",
      content_type_name: "lesson",
      program_name: "program1",
      subject_name: "subject1",
      developmental_name: "developmental1",
      skills_name: "skills1",
      age_name: "6-9months",
      org_name: "school1",
    },
  ];
  const total = mockList.length;
  const [resList, setResList] = React.useState<Content[]>([]);

  function mapQuery(name: string, status: string) {
    const query: any = {};
    if (status) query["publish_status"] = status;
    if (name) query["name"] = name;
    return query;
  }

  useEffect(() => {
    console.log(mapQuery(name, status));
    // 掉接口更新数据
    // dispatch(contentList(mapQuery(name, status)))
    resList.push(lists[0]);
    setResList(resList);
  }, [status, name, resList, lists]);
  return (
    <div>
      <ActionBar layout={layout} status={status} showMyOnly={showMyOnly} subStatus={subStatus} />
      {layout === "card" ? (
        resList.length > 0 ? (
          <CardList list={resList} publish_status={status} total={total} />
        ) : (
          <div style={{ margin: "0 auto", textAlign: "center" }}>
            <img src={emptyIconUrl} alt="" />
            <Typography variant="body1" color="textSecondary">
              Empty...
            </Typography>
          </div>
        )
      ) : (
        <TableList list={mockList} status={status} total={total} />
      )}
    </div>
  );
}
