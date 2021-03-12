import { PayloadAction } from "@reduxjs/toolkit";
import { Batch, BatchItem, FileLike } from "@rpldy/shared";
import { PreSendData, useBatchAddListener, useItemProgressListener, useRequestPreSend } from "@rpldy/shared-ui";
import { UPLOADER_EVENTS } from "@rpldy/uploader";
import Uploady, { UploadyContext, UploadyProps } from "@rpldy/uploady";
import intersection from "lodash/intersection";
import React, { forwardRef, ReactNode, useContext, useEffect, useMemo, useRef } from "react";
import { useDispatch } from "react-redux";
import api from "../../api";
import { AsyncTrunkReturned, getContentResourceUploadPath } from "../../reducers/content";
import { SingleUploaderControl } from "../SingleUploader";

interface MultipleUploaderControl extends Omit<SingleUploaderControl, "value"> {
  value?: FileLikeWithId[];
  batch?: Batch;
}

interface BaseUploaderProps {
  value?: FileLikeWithId[];
  render: (control: MultipleUploaderControl) => ReactNode;
}
function BaseUploader(props: BaseUploaderProps) {
  const { value, render } = props;
  const uploady = useContext(UploadyContext);
  // useBatchProgressListener 接口有问题，需要手动更新状态
  const batchRef = useRef<Batch>();
  const uploadingItem = useItemProgressListener();
  const index = batchRef.current?.items.findIndex((item) => item.id === uploadingItem.id) ?? 0;
  const batch = !batchRef.current
    ? undefined
    : {
        ...batchRef.current,
        items: batchRef.current?.items
          ?.slice(0, index)
          .concat(uploadingItem)
          .concat(batchRef.current?.items?.slice(index + 1)),
      };
  batchRef.current = batch;
  const btnRef = useRef<HTMLButtonElement>(null);
  const isUploading =
    index === undefined || index === -1
      ? false
      : index === 0 || index === (batch?.items?.length ?? 1) - 1
      ? uploadingItem?.completed > 0 && uploadingItem?.completed < 100
      : true;
  console.log("batch, uploadingItem, isUploading = ", batch, uploadingItem, isUploading);
  useBatchAddListener((batch) => {
    batchRef.current = batch;
  });
  useEffect(() => {
    const handleClick = () => uploady.showFileUpload();
    const btn = btnRef.current;
    btn?.addEventListener("click", handleClick);
    return () => btn?.removeEventListener("click", handleClick);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [uploady, btnRef.current]);
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
  const itemWithResourceIdsRef = useRef<BatchItemWithResourceId[]>([]);
  const listeners = useMemo(
    () => ({
      async [UPLOADER_EVENTS.BATCH_ADD](batch: Batch) {
        itemWithResourceIdsRef.current = [];
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
          itemWithResourceIdsRef.current.push(extendedItem);
          return { options: { destination: { url: path } }, items: [extendedItem, ...items.slice(1)] };
        } catch (err) {
          return false;
        }
      },
      [UPLOADER_EVENTS.BATCH_FINISH](batch: Batch) {
        console.log("BATCH_FINISH = ", batch);
        // const targetItem = itemWithResourceIdsRef.current.find(item => item.id === finishedItem.id);
        const itemWithIds = itemWithResourceIdsRef.current.map((item) => ({ id: item.resourceId, name: item.file.name }));
        if (onChange) onChange(value?.concat(itemWithIds));
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
