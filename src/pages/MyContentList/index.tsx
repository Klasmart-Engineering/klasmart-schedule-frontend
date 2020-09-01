import { Typography } from "@material-ui/core";
import React, { useCallback, useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import emptyIconUrl from "../../assets/icons/empty.svg";
import mockList from "../../mocks/contentList.json";
import { RootState } from "../../reducers";
import { bulkDeleteContent, contentLists, deleteContent, publishContent } from "../../reducers/content";
import { ActionDialog } from "../ContentPreview";
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
  const [id, setId] = React.useState<string>("");
  const [openDialog, setOpenDialog] = React.useState<boolean>(false);
  const [titleDialog, setTitleDialog] = React.useState<string>("");
  const [actionType, setActionType] = React.useState<string>("");
  const [showReason] = React.useState<boolean>(false);
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

  const changePage = (page: number) => {
    setPage(page);
  };
  const onHandelAction = (type: string, id?: string) => {
    if (!id) return;
    setTitleDialog(`Are you sure you want to ${type} this content?`);
    setId(id);
    setActionType(type);
    setOpenDialog(true);
  };
  const handleCloseDialog = () => {
    setOpenDialog(false);
  };
  const handleDispatch = useCallback(
    async (type: string, id: string) => {
      setOpenDialog(false);
      switch (type) {
        case "delete":
          await dispatch(deleteContent(id));
          break;
        case "publish":
          await dispatch(publishContent(id));
          break;
        case "bulkdelete":
          await dispatch(bulkDeleteContent(checkedContents));
          break;
        case "bulkpublish":
          await dispatch(bulkDeleteContent(checkedContents));
          break;
        default:
          return;
      }
    },
    [checkedContents, dispatch]
  );
  const handleDialogEvent = () => {
    handleDispatch(actionType, id);
  };
  const onHandleBulkAction = (type: string) => {
    if (checkedContents.length === 0) {
      alert("please select first");
      return;
    }
    setTitleDialog(`Are you sure you want to ${type} this content?`);
    switch (type) {
      case "delete":
        setActionType("bulkdelete");
        break;
      case "publish":
        setActionType("bulkpublish");
        break;
      default:
        return;
    }
    setOpenDialog(true);
  };
  return (
    <div>
      <ActionDialog
        open={openDialog}
        title={titleDialog}
        showReason={showReason}
        showError={false}
        handleCloseDialog={handleCloseDialog}
        handleDialogEvent={handleDialogEvent}
        onSetReason={() => {}}
      ></ActionDialog>
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
