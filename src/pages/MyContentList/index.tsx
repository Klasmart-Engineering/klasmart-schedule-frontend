import { Typography } from "@material-ui/core";
import { PayloadAction } from "@reduxjs/toolkit";
import React, { useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { useHistory, useLocation } from "react-router-dom";
import { OrderBy } from "../../api/api.d";
import emptyIconUrl from "../../assets/icons/empty.svg";
import { RootState } from "../../reducers";
import { actAsyncConfirm } from "../../reducers/confirm";
import { AsyncTrunkReturned, bulkDeleteContent, bulkPublishContent, contentLists, deleteContent, publishContent } from "../../reducers/content";
import { actWarning } from "../../reducers/notify";
import { ContentCardList, ContentCardListProps } from "./ContentCardList";
import FirstSearchHeader, { FirstSearchHeaderMb, FirstSearchHeaderProps } from "./FirstSearchHeader";
import { SecondSearchHeader, SecondSearchHeaderMb } from "./SecondSearchHeader";
import { ThirdSearchHeader, ThirdSearchHeaderMb, ThirdSearchHeaderProps } from "./ThirdSearchHeader";
import { ContentListForm, ContentListFormKey, QueryCondition } from "./types";

const PAGE_SIZE= 16;

const clearNull = (obj: Record<string, any>) => {
  Object.keys(obj).forEach(key => {
    if (obj[key] == null) delete obj[key];
  })
  return obj;
}

const useQuery = (): QueryCondition => {
  const { search } = useLocation();
  return useMemo(() => {
    const query = new URLSearchParams(search);
    const name = query.get('name');
    const publish_status = query.get('publish_status');
    const author = query.get('author');
    const page = Number(query.get('page')) || 1;
    const order_by = (query.get('order_by') as OrderBy | null) || undefined;

    return clearNull({ name, publish_status, author, page, order_by });
  }, [search])
};

const toQueryString = (hash: Record<string, any>): string => {
  const search = new URLSearchParams(hash);
  return `?${search.toString()}`;
}

export default function MyContentList() {
  const condition = useQuery();
  const history = useHistory();
  const formMethods = useForm<ContentListForm>();
  const { getValues, reset } = formMethods;
  const { contentsList, total } = useSelector<RootState, RootState["content"]>((state) => state.content);
  const dispatch = useDispatch();
  const handlePublish: ContentCardListProps['onPublish'] = (id) => dispatch(publishContent(id));
  const handleBulkPublish: ThirdSearchHeaderProps['onBulkPublish'] = () => {
    const ids = getValues()[ContentListFormKey.CHECKED_CONTENT_IDS];
    if (!ids.length) return dispatch(actWarning('You have select any plan or material to publish!'));
    dispatch(bulkPublishContent(ids));
  };
  const handleDelete: ContentCardListProps['onDelete'] = async (id) => {
    const content = `Are you sure you want to delete this content?`;
    const { payload } = await dispatch(actAsyncConfirm({ content })) as unknown as PayloadAction<AsyncTrunkReturned<typeof actAsyncConfirm>>;
    if (payload.isConfirmed) return dispatch(deleteContent(id));
  }
  const handleBulkDelete: ThirdSearchHeaderProps['onBulkDelete'] = async () => {
    const ids = getValues()[ContentListFormKey.CHECKED_CONTENT_IDS];
    if (!ids.length) return dispatch(actWarning('You have select any plan or material to delete!'));
    const content = `Are you sure you want to delete these contents?`;
    const { payload } = await dispatch(actAsyncConfirm({ content })) as unknown as PayloadAction<AsyncTrunkReturned<typeof actAsyncConfirm>>;
    if (payload.isConfirmed) return dispatch(bulkDeleteContent(ids));
  }
  const handleChangePage: ContentCardListProps['onChangePage'] = (page) => history.push({ search: toQueryString({ ...condition, page }) });
  const handleClickConent: ContentCardListProps['onClickContent'] = (id) => history.push(`/library/content-preview?id=${id}`);
  const handleChange: FirstSearchHeaderProps['onChange'] = (value) => history.push({ search: toQueryString(value) });
  useEffect(() => {
    reset();
    dispatch(contentLists({...condition, page_size: PAGE_SIZE, metaLoading: true}));
  }, [condition, reset, dispatch])

  // useEffect(() => {
  //   dispatch(contentLists(query));
  //   setCheckedContent([]);
  //   onChangeCheckedContents([]);
  // }, [status, subStatus, name, sortBy, myOnly, page, refresh, dispatch, query]);

  // const changePage = (page: number) => {
  //   setPage(page);
  // };


  // const onHandelAction = (type: string, id?: string) => {
  //   if (!id) return;
  //   setTitleDialog(`Are you sure you want to ${type} this content?`);
  //   setId(id);
  //   setActionType(type);
  //   setOpenDialog(true);
  // };
  // const handleCloseDialog = () => {
  //   setOpenDialog(false);
  // };
  // const handleDispatch = useCallback(
  //   async (type: string, id: string) => {
  //     setOpenDialog(false);
  //     switch (type) {
  //       case "delete":
  //         await dispatch(deleteContent(id));
  //         break;
  //       case "publish":
  //         await dispatch(publishContent(id));
  //         break;
  //       case "bulkdelete":
  //         await dispatch(bulkDeleteContent(checkedContents));
  //         break;
  //       case "bulkpublish":
  //         await dispatch(bulkDeleteContent(checkedContents));
  //         break;
  //       default:
  //         return;
  //     }
  //   },
  //   [checkedContents, dispatch]
  // );
  // const handleDialogEvent = () => {
  //   handleDispatch(actionType, id);
  // };
  // const onHandleBulkAction = (type: string) => {
  //   if (checkedContents.length === 0) {
  //     alert("please select first");
  //     return;
  //   }
  //   setTitleDialog(`Are you sure you want to ${type} this content?`);
  //   switch (type) {
  //     case "delete":
  //       setActionType("bulkdelete");
  //       break;
  //     case "publish":
  //       setActionType("bulkpublish");
  //       break;
  //     default:
  //       return;
  //   }
  //   setOpenDialog(true);
  // };
  return (
    <div>
      <FirstSearchHeader value={condition} onChange={handleChange} />
      <FirstSearchHeaderMb value={condition} onChange={handleChange} />
      <SecondSearchHeader value={condition} onChange={handleChange} />
      <SecondSearchHeaderMb value={condition} onChange={handleChange} />
      <ThirdSearchHeader value={condition} onChange={handleChange} onBulkPublish={handleBulkPublish} onBulkDelete={handleBulkDelete} />
      <ThirdSearchHeaderMb value={condition} onChange={handleChange} onBulkPublish={handleBulkPublish} onBulkDelete={handleBulkDelete} />
      {contentsList && contentsList.length > 0 ? (
          <ContentCardList
            formMethods={formMethods}
            list={contentsList}
            total={total}
            queryCondition={condition}
            onChangePage={handleChangePage}
            onClickContent={handleClickConent}
            onPublish={handlePublish}
            onDelete={handleDelete}
          />
        ) : (
          <div style={{ margin: "0 auto", textAlign: "center" }}>
            <img src={emptyIconUrl} alt="" />
            <Typography variant="body1" color="textSecondary">
              Empty...
            </Typography>
          </div>
        )
      }
    </div>
  );
}
