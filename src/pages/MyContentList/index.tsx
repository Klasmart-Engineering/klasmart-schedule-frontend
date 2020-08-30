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
  const status = query.get("status") || "published";
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
    if (sortBy === "30") query["order_by"] = "-create_at";
    if (sortBy === "40") query["order_by"] = "create_at";
  }
  if (myOnly) {
    query["author"] = "{self}";
  }
  query["page"] = page;
  query["page_size"] = 16;
  return query;
};
export default function MyContentList() {
  const { layout, status, subStatus, name, sortBy, myOnly } = useQuery();
  const showMyOnly = status === "published";
  const [page, setPage] = React.useState<number>(1);
  const [checkedContents, setCheckedContent] = React.useState<string[]>([]);
  const { contentsList } = useSelector<RootState, RootState["content"]>((state) => state.content);
  const { total } = useSelector<RootState, RootState["content"]>((state) => state.content);
  const { refresh } = useSelector<RootState, RootState["content"]>((state) => state.content);
  const [openBulkDelete, setOpenBulkDelete] = React.useState(false);
  const [openBulkPublish, setopenBulkPublish] = React.useState(false);
  const [openDelete, setOpenDelete] = React.useState(false);
  const [openPublish, setOpenPublish] = React.useState(false);
  const [id, setId] = React.useState<string>();
  const onChangeCheckedContents = (checkedContentsArr?: string[]) => {
    setCheckedContent(checkedContentsArr || []);
  };
  const dispatch = useDispatch();
  const query = useMemo(() => mapQuery(name, status, subStatus, sortBy, myOnly, page), [name, status, subStatus, sortBy, myOnly, page]);
  useEffect(() => {
    dispatch(contentLists(query));
    setCheckedContent([]);
    onChangeCheckedContents([]);
  }, [status, subStatus, name, sortBy, myOnly, page, refresh, dispatch, query]);
  const onHandelAction = (type: string, id?: string) => {
    if (!id) return;
    switch (type) {
      case "delete":
        setId(id);
        setOpenDelete(true);
        // dispatch(deleteContent(id));
        break;
      case "publish":
        setId(id);
        setOpenPublish(true);
        // dispatch(publishContent(id));
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
        setOpenBulkDelete(true);
        // dispatch(bulkDeleteContent(checkedContents));
        break;
      case "publish":
        setopenBulkPublish(true);
        // dispatch(bulkPublishContent(checkedContents));
        break;
      default:
        return;
    }
  };
  const changePage = (page: number) => {
    setPage(page);
  };
  const DeleteModalDate: any = {
    text: "Are you sure you want to delete this content?",
    openStatus: openDelete,
    buttons: [
      {
        label: "Cancel",
        event: () => {
          setOpenDelete(false);
        },
      },
      {
        label: "Delete",
        event: () => {
          dispatch(deleteContent(id));
          setOpenDelete(false);
        },
      },
    ],
  };
  const PublishedModalDate: any = {
    text: "Are you sure you want to publish this content?",
    openStatus: openPublish,
    buttons: [
      {
        label: "Cancel",
        event: () => {
          setOpenPublish(false);
        },
      },
      {
        label: "Confirm",
        event: () => {
          dispatch(publishContent(id));
          setOpenPublish(false);
        },
      },
    ],
  };
  const BulkDeleteModalDate: any = {
    text: "Are you sure you want to delete this content?",
    openStatus: openBulkDelete,
    buttons: [
      {
        label: "Cancel",
        event: () => {
          setOpenBulkDelete(false);
        },
      },
      {
        label: "Delete",
        event: () => {
          dispatch(bulkDeleteContent(checkedContents));
          setOpenBulkDelete(false);
        },
      },
    ],
  };
  const BulkPublishedModalDate: any = {
    text: "Are you sure you want to publish this content?",
    openStatus: openBulkPublish,
    buttons: [
      {
        label: "Cancel",
        event: () => {
          setopenBulkPublish(false);
        },
      },
      {
        label: "Confirm",
        event: () => {
          dispatch(bulkPublishContent(checkedContents));
          setopenBulkPublish(false);
        },
      },
    ],
  };
  return (
    <div>
      <ModalBox modalDate={BulkDeleteModalDate} />
      <ModalBox modalDate={BulkPublishedModalDate} />
      <ModalBox modalDate={DeleteModalDate} />
      <ModalBox modalDate={PublishedModalDate} />
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
        contentsList && contentsList.length > 0 ? (
          <CardList
            list={contentsList}
            total={total}
            status={status}
            onChangeCheckedContents={onChangeCheckedContents}
            onChangePage={changePage}
            onHandelAction={onHandelAction}
            refresh={refresh}
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
