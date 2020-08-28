import { BatchItem, FileLike } from "@rpldy/shared";
import { PreSendData, UploadyContextType, useItemProgressListener, useRequestPreSend } from "@rpldy/shared-ui";
import { UPLOADER_EVENTS } from "@rpldy/uploader";
import Uploady, { UploadyContext } from "@rpldy/uploady";
import React, { ReactNode, RefObject, useContext, useEffect, useMemo, useRef } from "react";

const noop = (arg: any): any => {};

interface UploaderControl {
  uploady: UploadyContextType;
  item: BatchItem;
  btnRef: RefObject<HTMLButtonElement>;
}

interface BaseUploaderProps {
  value?: string;
  onChange?: (url: string) => any;
  render: (control: UploaderControl) => ReactNode;
}
function BaseUploader(props: BaseUploaderProps) {
  const { value, onChange, render } = props;
  const uploady = useContext(UploadyContext);
  const item = useItemProgressListener();
  const btnRef = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    const handleClick = () => uploady.showFileUpload();
    btnRef.current?.addEventListener("click", handleClick);
    return () => btnRef.current?.removeEventListener("click", handleClick);
  }, [uploady]);
  return <>{render({ uploady, item, btnRef })}</>;
}

const parseExtension = (filename: string) => {
  if (!filename.includes(".")) return "";
  return filename.split(".").pop();
};
interface SingleUploaderProps extends BaseUploaderProps, BaseUploaderProps {
  fetchUploadUrl: (file: FileLike) => Promise<string>;
}
export function SingleUploader(props: SingleUploaderProps) {
  const { value, onChange, render, fetchUploadUrl, ...uploadyProps } = props;
  const listeners = useMemo(
    () => ({
      [UPLOADER_EVENTS.REQUEST_PRE_SEND](props: PreSendData): Promise<boolean | ReturnType<Parameters<typeof useRequestPreSend>[0]>> {
        debugger;
        const {
          items: [{ file }],
        } = props;
        return fetchUploadUrl(file)
          .then((url) => {
            return { options: { destination: { url } } };
          })
          .catch((err) => {
            return false;
          });
      },
    }),
    [fetchUploadUrl]
  );
  return (
    <Uploady {...uploadyProps} method="PUT" listeners={listeners}>
      <BaseUploader {...{ value, onChange, render }} />
    </Uploady>
  );
}
