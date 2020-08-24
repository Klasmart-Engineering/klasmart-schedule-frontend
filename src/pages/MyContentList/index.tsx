import React from "react";
import { useLocation } from "react-router-dom";
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
  const sortBy = query.get("sourtBy") || "";
  return { layout, status, subStatus, name, sortBy };
};

export default function MyContentList() {
  const { layout, status, subStatus, name, sortBy } = useQuery();
  const showMyOnly = status === "published";
  const total = mockList.length;
  // useEffect(() => {
  //   console.log(layout, status, subStatus, name)
  // })
  return (
    <div>
      <ActionBar layout={layout} status={status} showMyOnly={showMyOnly} subStatus={subStatus} sortBy={sortBy} />
      {layout === "card" ? (
        <CardList list={mockContentList} publish_status={status} total={total} />
      ) : (
        <TableList list={mockList} status={status} total={total} />
      )}
    </div>
  );
}
