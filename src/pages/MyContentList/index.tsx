import React from "react";
import { useLocation } from "react-router-dom";
import CardList from "./CardList";
import TableList from "./TableList";
import ActionBar from "./ActionBar";
import mockList from "../../mocks/contentList.json";
import HeaderNavBar from "./HeaderNavBar";

const useQuery = () => {
  const { search } = useLocation();
  const query = new URLSearchParams(search);
  const layout = query.get("layout") || "card";
  const status = query.get("status") || "content";
  return { layout, status };
};

export default function MyContentList() {
  const { layout, status } = useQuery();
  const total = mockList.length;
  return (
    <div>
      <HeaderNavBar />
      <ActionBar layout={layout} status={status} />
      {layout === "card" ? (
        <CardList list={mockList} status={status} total={total} />
      ) : (
        <TableList list={mockList} status={status} total={total} />
      )}
    </div>
  );
}
