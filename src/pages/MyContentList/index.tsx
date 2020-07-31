import React from "react";
import { useLocation } from "react-router-dom";
import CardList from "./CardList";
import TableList from "./TableList";
import ActionBar from "./ActionBar";
import mockList from "../../mocks/contentList.json";

const useQuery = () => {
  const { search } = useLocation();
  const query = new URLSearchParams(search);
  const layout = query.get("layout") || "card";
  const status = query.get("status") || "content";
  return { layout, status };
};

export default function MyContentList() {
  const { layout, status } = useQuery();
  return (
    <div>
      <ActionBar layout={layout} status={status} />
      {layout === "card" ? (
        <CardList list={mockList} status={status} />
      ) : (
        <TableList list={mockList} status={status} />
      )}
    </div>
  );
}
