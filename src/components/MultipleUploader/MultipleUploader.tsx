import { PayloadAction } from "@reduxjs/toolkit";
import { Batch, BatchItem, FileLike } from "@rpldy/shared";
import { PreSendData, useBatchAddListener, useBatchFinishListener, useItemProgressListener, useRequestPreSend } from "@rpldy/shared-ui";
import { UPLOADER_EVENTS } from "@rpldy/uploader";
import Uploady, { UploadyContext, UploadyProps } from "@rpldy/uploady";
import intersection from "lodash/intersection";
import React, { forwardRef, ReactNode, useContext, useEffect, useMemo, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import api from "../../api";
import { AsyncTrunkReturned, getContentResourceUploadPath } from "../../reducers/content";
import { SingleUploaderControl } from "../SingleUploader";

interface MultipleUploaderControl extends Omit<SingleUploaderControl, "value" | "item"> {
  value?: FileLikeWithId[];
  batch?: Batch;
  item?: BatchItem;
}

interface BaseUploaderProps {
  value?: FileLikeWithId[];
  render: (control: MultipleUploaderControl) => ReactNode;
}
function BaseUploader(props: BaseUploaderProps) {
  const { value, render } = props;
  const uploady = useContext(UploadyContext);
  const [isUploading, setIsUploading] = useState(false);
  const [index, setIndex] = useState(0);
  // useBatchProgressListener 接口有问题，需要手动更新状态
  const batchRef = useRef<Batch>();
  const progressItem = useItemProgressListener();
  const indexedItem = batchRef.current?.items[index];
  const uploadingItem = indexedItem?.id === progressItem?.id ? progressItem : indexedItem;
  const batch = !batchRef.current
    ? undefined
    : !uploadingItem || index === undefined
    ? batchRef.current
    : {
        ...batchRef.current,
        items: [uploadingItem].concat(batchRef.current?.items?.slice(index + 1)),
      };
  const btnRef = useRef<HTMLButtonElement>(null);
  useBatchAddListener((batch: Batch) => {
    batchRef.current = batch;
    setIsUploading(true);
    setIndex(0);
  });
  useBatchFinishListener(() => {
    setIsUploading(false);
  });
  useEffect(() => {
    const handleClick = () => uploady.showFileUpload();
    const btn = btnRef.current;
    btn?.addEventListener("click", handleClick);
    return () => btn?.removeEventListener("click", handleClick);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [uploady, btnRef.current]);
  // useItemFinish 时序有问题，需要在 uploady 上绑定
  useEffect(() => {
    const handleItemFinish = (finishedItem: BatchItem) => {
      const idx = batchRef.current?.items.findIndex((item) => item?.id === finishedItem?.id);
      if (idx !== undefined && idx !== -1) setIndex(idx + 1);
    };
    uploady.on(UPLOADER_EVENTS.ITEM_FINISH, handleItemFinish);
    return () => {
      uploady.off(UPLOADER_EVENTS.ITEM_FINISH, handleItemFinish);
    };
  }, [uploady]);
  return <>{render({ uploady, batch, item: uploadingItem, btnRef, value, isUploading })}</>;
}

const parseExtension = (filename: string) => {
  if (!filename.includes(".")) return "";
  return filename.split(".").pop() || "";
};

export interface FileLikeWithId extends Partial<FileLike> {
  id?: string;
}

interface BatchItemWithResourceId extends BatchItem {
  resourceId?: string;
}

export enum MultipleUploaderErrorType {
  MaxAmountError = "MaxAmountError",
  MaxSizeError = "MaxSizeError",
  DuplicateFileError = "DuplicateFileError",
}

export enum FileSizeUnit {
  K = 1024,
  M = 1024 * 1024,
}

interface MultipleUploaderError {
  type: MultipleUploaderErrorType;
}

type FetchUploadUrlResult = ReturnType<typeof api.contentsResources.getContentResourceUploadPath>;
export interface MultipleUploaderProps extends BaseUploaderProps, UploadyProps {
  partition: NonNullable<Parameters<typeof api.contentsResources.getContentResourceUploadPath>[0]>["partition"];
  value?: Pick<FileLikeWithId, "id" | "name">[];
  maxAmount?: number;
  maxSize?: number;
  onChange?: (value?: Pick<FileLikeWithId, "id" | "name">[]) => any;
  onError?: (event: MultipleUploaderError) => any;
}
export const MultipleUploader = forwardRef<HTMLDivElement, MultipleUploaderProps>((props, ref) => {
  const { value, onChange, render, partition, onError, maxAmount, maxSize, ...uploadyProps } = props;
  const dispatch = useDispatch();
  const itemWithResourceIdMap = useRef<Record<string, BatchItemWithResourceId>>({});
  const listeners = useMemo(
    () => ({
      async [UPLOADER_EVENTS.BATCH_ADD](batch: Batch) {
        itemWithResourceIdMap.current = {};
        const files = batch?.items?.map((item) => item.file) ?? [];
        if (maxAmount !== undefined && (value?.length ?? 0) + files.length > maxAmount) {
          onError && onError({ type: MultipleUploaderErrorType.MaxAmountError });
          return false;
        }
        if (maxSize !== undefined && files.some((file) => file.size > maxSize)) {
          onError && onError({ type: MultipleUploaderErrorType.MaxSizeError });
          return false;
        }
        if (
          intersection(
            files.map((file) => file.name),
            value?.map((file) => file.name)
          ).length > 0
        ) {
          onError && onError({ type: MultipleUploaderErrorType.DuplicateFileError });
          return false;
        }
      },
      async [UPLOADER_EVENTS.REQUEST_PRE_SEND](props: PreSendData): Promise<boolean | ReturnType<Parameters<typeof useRequestPreSend>[0]>> {
        const { items } = props;
        try {
          const file = items[0].file;
          const extension = parseExtension(file.name);
          const { payload } = ((await dispatch(getContentResourceUploadPath({ partition, extension }))) as unknown) as PayloadAction<
            AsyncTrunkReturned<typeof getContentResourceUploadPath>
          >;
          const { path, resource_id } = payload;
          const extendedItem = { ...items[0], resourceId: resource_id };
          itemWithResourceIdMap.current[extendedItem.id] = extendedItem;
          return { options: { destination: { url: path } }, items: [extendedItem, ...items.slice(1)] };
        } catch (err) {
          return false;
        }
      },
      [UPLOADER_EVENTS.ITEM_FINISH](item: BatchItem) {
        const extendedItem = itemWithResourceIdMap.current[item.id];
        if (onChange) onChange(value?.concat({ id: extendedItem.id, name: extendedItem.file.name }));
      },
    }),
    [maxAmount, value, maxSize, onError, dispatch, partition, onChange]
  );
  return (
    <div ref={ref}>
      <Uploady {...uploadyProps} method="PUT" sendWithFormData={false} listeners={listeners}>
        <BaseUploader {...{ value, onChange, render }} />
      </Uploady>
    </div>
  );
});
