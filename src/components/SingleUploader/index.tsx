import { PayloadAction } from "@reduxjs/toolkit";
import { BatchItem, FileLike } from "@rpldy/shared";
import { PreSendData, UploadyContextType, useItemProgressListener, useRequestPreSend } from "@rpldy/shared-ui";
import { UPLOADER_EVENTS } from "@rpldy/uploader";
import Uploady, { UploadyContext, UploadyProps } from "@rpldy/uploady";
import React, { forwardRef, ReactNode, RefObject, useContext, useEffect, useMemo, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import api from "../../api";
import { AsyncTrunkReturned, getContentResourceUploadPath } from "../../reducers/content";

interface UploaderControl {
  uploady: UploadyContextType;
  item: BatchItem;
  btnRef: RefObject<HTMLButtonElement>;
  value?: string;
  isUploading?: boolean;
}

interface BaseUploaderProps {
  value?: string;
  render: (control: UploaderControl) => ReactNode;
}
function BaseUploader(props: BaseUploaderProps) {
  const { value, render } = props;
  const uploady = useContext(UploadyContext);
  const item = useItemProgressListener();
  const btnRef = useRef<HTMLButtonElement>(null);
  const isUploading = item?.completed > 0 && item?.completed < 100;
  useEffect(() => {
    const handleClick = () => uploady.showFileUpload();
    const btn = btnRef.current;
    btn?.addEventListener("click", handleClick);
    return () => btn?.removeEventListener("click", handleClick);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [uploady, btnRef.current]);
  return <>{render({ uploady, item, btnRef, value, isUploading })}</>;
}

const parseExtension = (filename: string) => {
  if (!filename.includes(".")) return "";
  return filename.split(".").pop() || "";
};

type FetchUploadUrlResult = ReturnType<typeof api.contentsResources.getContentResourceUploadPath>;
interface SingleUploaderProps extends BaseUploaderProps, UploadyProps {
  partition: NonNullable<Parameters<typeof api.contentsResources.getContentResourceUploadPath>[0]>["partition"];
  value?: string;
  transformFile?: (file: FileLike) => Promise<FileLike>;
  onChange?: (value?: string) => any;
  onChangeOther?: (filename?: string) => any;
}
export const SingleUploader = forwardRef<HTMLDivElement, SingleUploaderProps>((props, ref) => {
  const { value, onChange, render, partition, transformFile, onChangeOther, ...uploadyProps } = props;
  const dispatch = useDispatch();
  const [rid, setRid] = useState<string>();
  const [rname, setRname] = useState<string>();
  const listeners = useMemo(
    () => ({
      async [UPLOADER_EVENTS.REQUEST_PRE_SEND](props: PreSendData): Promise<boolean | ReturnType<Parameters<typeof useRequestPreSend>[0]>> {
        const { items } = props;
        try {
          const file = transformFile ? await transformFile(items[0].file) : items[0].file;
          const extension = parseExtension(file.name);
          const { payload } = ((await dispatch(getContentResourceUploadPath({ partition, extension }))) as unknown) as PayloadAction<
            AsyncTrunkReturned<typeof getContentResourceUploadPath>
          >;
          const { path, resource_id } = payload;
          setRid(resource_id);
          setRname(file.name);
          return { options: { destination: { url: path } }, items: [{ ...items[0], file }] };
        } catch (err) {
          return false;
        }
      },
      [UPLOADER_EVENTS.ITEM_FINISH]() {
        if (onChange) onChange(rid);
        if (onChangeOther) onChangeOther(rname);
      },
    }),
    [transformFile, dispatch, partition, onChange, rid, onChangeOther, rname]
  );
  return (
    <div ref={ref}>
      <Uploady {...uploadyProps} method="PUT" sendWithFormData={false} listeners={listeners}>
        <BaseUploader {...{ value, onChange, render }} />
      </Uploady>
    </div>
  );
});
