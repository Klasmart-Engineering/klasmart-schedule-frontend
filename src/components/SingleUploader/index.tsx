import { BatchItem } from '@rpldy/shared';
import { UploadyContextType, useItemProgressListener } from "@rpldy/shared-ui";
import Uploady, { UploadyContext } from "@rpldy/uploady";
import React, { ReactNode, RefObject, useContext, useEffect, useRef } from "react";

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
  const { value, onChange, render} = props;
  const uploady = useContext(UploadyContext);
  const item = useItemProgressListener();
  const btnRef = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    const handleClick = () => uploady.showFileUpload();
    btnRef.current?.addEventListener('click', handleClick);
    return () => btnRef.current?.removeEventListener('click', handleClick);
  }, [uploady])
  return <>{ render({ uploady, item, btnRef }) }</>;
}


interface SingleUploaderProps extends BaseUploaderProps, BaseUploaderProps {}
export function SingleUploader(props: SingleUploaderProps) {
  const { value, onChange, render, ...uploadyProps } = props;
  return (
    <Uploady {...uploadyProps}>
      <BaseUploader {...{value, onChange, render}}/>
    </Uploady>
  );
}