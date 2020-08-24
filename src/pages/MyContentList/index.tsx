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
  return { layout, status };
};

export default function MyContentList() {
  const { layout, status } = useQuery();
  const showMyOnly = status === "published" || status === "assets";
  const total = mockList.length;
  return (
    <div>
      {/* <HeaderNavBar /> */}
      <ActionBar layout={layout} status={status} showMyOnly={showMyOnly} />
      {layout === "card" ? (
        <CardList list={mockContentList} status={status} total={total} />
      ) : (
        <TableList list={mockList} status={status} total={total} />
      )}
    </div>
  );
}
