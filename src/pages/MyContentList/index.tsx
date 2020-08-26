import { Typography } from "@material-ui/core";
import React from "react";
import { useLocation } from "react-router-dom";
import { Content } from "../../api/api";
import emptyIconUrl from "../../assets/icons/empty.svg";
import mockContentList from "../../mocks/content.json";
import mockList from "../../mocks/contentList.json";
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
  const total = mockList.length;
  function mapQuery(name: string, status: string) {
    const query: any = {};
    if (status) query["publish_status"] = status;
    if (name) query["name"] = name;
    return query;
  }

  // useEffect(() => {
  //   console.log(mapQuery(name, status));
  //   // 掉接口更新数据
  //   // dispatch(contentList(mapQuery(name, status)))
  //   // resList.push(lists[0]);
  //   setResList(resList);
  // }, [status, name, resList, lists]);
  return (
    <div>
      <ActionBar layout={layout} status={status} showMyOnly={showMyOnly} subStatus={subStatus} />
      {layout === "card" ? (
        mockContentList.length > 0 ? (
          <CardList list={mockContentList} publish_status={status} total={total} />
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
