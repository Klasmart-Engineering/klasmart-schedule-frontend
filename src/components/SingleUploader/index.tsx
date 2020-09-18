import { PayloadAction } from "@reduxjs/toolkit";
import { BatchItem } from "@rpldy/shared";
import { PreSendData, UploadyContextType, useItemProgressListener, useRequestPreSend } from "@rpldy/shared-ui";
import { UPLOADER_EVENTS } from "@rpldy/uploader";
import Uploady, { UploadyContext, UploadyProps } from "@rpldy/uploady";
import React, { ReactNode, RefObject, useContext, useEffect, useMemo, useRef, useState } from "react";
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
  }, [uploady]);
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
  onChange?: (value?: string) => any;
}
export function SingleUploader(props: SingleUploaderProps) {
  const { value, onChange, render, partition, ...uploadyProps } = props;
  const dispatch = useDispatch();
  const [rid, setRid] = useState<string>();
  const listeners = useMemo(
    () => ({
      [UPLOADER_EVENTS.REQUEST_PRE_SEND](props: PreSendData): Promise<boolean | ReturnType<Parameters<typeof useRequestPreSend>[0]>> {
        const {
          items: [{ file }],
        } = props;
        const extension = parseExtension(file.name);
        return ((dispatch(getContentResourceUploadPath({ partition, extension })) as unknown) as Promise<
          PayloadAction<AsyncTrunkReturned<typeof getContentResourceUploadPath>>
        >)
          .then(({ payload }) => {
            const { path, resource_id } = payload;
            setRid(resource_id);
            return { options: { destination: { url: path } } };
          })
          .catch((err) => {
            return false;
          });
      },
      [UPLOADER_EVENTS.ITEM_FINISH]() {
        if (onChange) onChange(rid);
      },
    }),
    [rid, partition, onChange, dispatch]
  );
  return (
    <Uploady {...uploadyProps} method="PUT" sendWithFormData={false} listeners={listeners}>
      <BaseUploader {...{ value, onChange, render }} />
    </Uploady>
  );
}
