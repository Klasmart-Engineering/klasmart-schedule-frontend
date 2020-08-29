import { Typography } from "@material-ui/core";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import emptyIconUrl from "../../assets/icons/empty.svg";
import mockList from "../../mocks/contentList.json";
import { RootState } from "../../reducers";
import { contentLists } from "../../reducers/content";
import ActionBar from "./ActionBar";
import CardList from "./CardList";
import TableList from "./TableList";
const useQuery = () => {
  const { search } = useLocation();
  const query = new URLSearchParams(search);
  const layout = query.get("layout") || "card";
  const status = query.get("status") || "";
  const subStatus = query.get("subStatus") || "";
  const name = query.get("name") || "";
  const sortBy = query.get("sortBy") || "";
  const myOnly = query.get("myOnly") || "";
  return { layout, status, subStatus, name, sortBy, myOnly };
};

export default function MyContentList() {
  const { layout, status, subStatus, name, sortBy, myOnly } = useQuery();
  const showMyOnly = status === "published";
  const total = mockList.length;
  const [checkedContents, setCheckedContent] = React.useState<string[]>([]);
  const { contentsList } = useSelector<RootState, RootState["content"]>((state) => state.content);
  const onChangeCheckedContents = (checkedContentsArr?: string[]) => {
    setCheckedContent(checkedContentsArr || [""]);
  };
  const dispatch = useDispatch();
  useEffect(() => {
    function mapQuery(name: string, status: string, subStatus: string, sortBy: string, myOnly: string) {
      const query: any = {};
      if (status && status !== "unpublished") {
        query["publish_status"] = status;
      } else if (status === "unpublished" && !subStatus) {
        query["publish_status"] = "draft";
      } else if (status === "unpublished" && subStatus) {
        query["publish_status"] = subStatus;
      }
      if (name) query["name"] = name;
      if (sortBy) {
        if (sortBy === "10") query["order_by"] = "content_name";
        if (sortBy === "20") query["order_by"] = "-content_name";
        if (sortBy === "30") query["order_by"] = "create_at";
        if (sortBy === "40") query["order_by"] = "-create_at";
      }
      if (myOnly) {
        query["author"] = "{self}";
      }
      return query;
    }
    const query = mapQuery(name, status, subStatus, sortBy, myOnly);
    dispatch(contentLists(query));
  }, [status, subStatus, name, sortBy, myOnly, dispatch]);
  return (
    <div>
      <ActionBar
        layout={layout}
        status={status}
        showMyOnly={showMyOnly}
        subStatus={subStatus}
        myOnly={myOnly ? true : false}
        sortBy={sortBy}
        name={name}
        checkedContents={checkedContents}
      />
      {layout === "card" ? (
        contentsList.length > 0 ? (
          <CardList list={contentsList} total={total} onChangeCheckedContents={onChangeCheckedContents} />
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
