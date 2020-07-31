import React from "react";
import { useLocation } from "react-router-dom";
import CardList from "./CardList";
import TableList from "./TableList";
import ActionBar from "./ActionBar";

const useLayout = () => {
  const { search } = useLocation();
  return new URLSearchParams(search).get("layout") || "card";
};

export default function MyContentList() {
  const layout = useLayout();
  return (
    <div>
      <ActionBar />
      {layout === "card" ? <CardList /> : <TableList />}
    </div>
  );
}
