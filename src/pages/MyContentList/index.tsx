import { Typography } from "@material-ui/core";
import React, { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import emptyIconUrl from "../../assets/icons/empty.svg";
import ModalBox from "../../components/ModalBox";
import mockList from "../../mocks/contentList.json";
import { RootState } from "../../reducers";
import { bulkDeleteContent, bulkPublishContent, contentLists, deleteContent, publishContent } from "../../reducers/content";
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
const mapQuery = (name: string, status: string, subStatus: string, sortBy: string, myOnly: string, page: number) => {
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
  query["page"] = page;
  query["page_size"] = 10;
  return query;
};
export default function MyContentList() {
  const { layout, status, subStatus, name, sortBy, myOnly } = useQuery();
  const showMyOnly = status === "published";
  const [page, setPage] = React.useState<number>(1);
  const [checkedContents, setCheckedContent] = React.useState<string[]>([]);
  const { contentsList } = useSelector<RootState, RootState["content"]>((state) => state.content);
  const { total } = useSelector<RootState, RootState["content"]>((state) => state.content);
  const [openStatus, setOpenStatus] = React.useState(false);
  const onChangeCheckedContents = (checkedContentsArr?: string[]) => {
    setCheckedContent(checkedContentsArr || [""]);
  };
  const [refresh, setRefresh] = React.useState<number>(0);
  const dispatch = useDispatch();
  const query = useMemo(() => mapQuery(name, status, subStatus, sortBy, myOnly, page), [name, status, subStatus, sortBy, myOnly, page]);
  useEffect(() => {
    dispatch(contentLists(query));
  }, [status, subStatus, name, sortBy, myOnly, page, refresh, dispatch, query]);
  const onHandelAction = (type: string, id?: string) => {
    if (!id) return;
    switch (type) {
      case "delete":
        setRefresh(refresh + 1);
        dispatch(deleteContent(id));
        break;
      case "publish":
        setRefresh(refresh + 1);
        dispatch(publishContent(id));
        break;
      default:
        return;
    }
  };
  const onHandleBulkAction = (type: string) => {
    if (checkedContents.length === 0) {
      alert("please select first");
      return;
    }
    switch (type) {
      case "delete":
        dispatch(bulkDeleteContent(checkedContents));
        break;
      case "publish":
        dispatch(bulkPublishContent(checkedContents));
        setRefresh(refresh + 1);
        break;
      default:
        return;
    }
  };
  const changePage = (page: number) => {
    setPage(page);
  };
  const modalDate: any = {
    text: "Are you sure you want to delete ?",
    openStatus: openStatus,
    buttons: [
      {
        label: "Cancel",
        event: () => {
          setOpenStatus(false);
        },
      },
      {
        label: "Delete",
        event: () => {
          setOpenStatus(false);
        },
      },
    ],
  };
  return (
    <div>
      <ModalBox modalDate={modalDate} />
      <ActionBar
        layout={layout}
        status={status}
        showMyOnly={showMyOnly}
        subStatus={subStatus}
        myOnly={myOnly ? true : false}
        sortBy={sortBy}
        name={name}
        onHandleBulkAction={onHandleBulkAction}
      />
      {layout === "card" ? (
        contentsList.length > 0 ? (
          <CardList
            list={contentsList}
            total={total}
            onChangeCheckedContents={onChangeCheckedContents}
            onChangePage={changePage}
            onHandelAction={onHandelAction}
          />
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
