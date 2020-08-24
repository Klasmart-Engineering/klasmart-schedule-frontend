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
  return { layout, status, subStatus };
};

export default function MyContentList() {
  const { layout, status, subStatus } = useQuery();
  const showMyOnly = status === "published" || status === "assets";
  const total = mockList.length;
  return (
    <div>
      <ActionBar layout={layout} status={status} showMyOnly={showMyOnly} />
      {layout === "card" ? (
        <CardList list={mockContentList} publish_status={status} total={total} subStatus={subStatus} />
      ) : (
        <TableList list={mockList} status={status} total={total} />
      )}
    </div>
  );
}
